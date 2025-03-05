from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_database_connection
from sbert_model import get_similarity
from pydantic import BaseModel, Field

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",  # React Frontend
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CaseInput(BaseModel):
    decision_number: str
    short_brief: str
    long_brief: str
    Source: str
    case_number: str = Field(
        ...,
        pattern=r"^(ดำ|แดง)",  # ไม่จำกัดความยาว และรองรับอักษรพิเศษ
        description="รูปแบบ: ไม่จำกัดความยาวของข้อความ และสามารถมีอักษรพิเศษได้"
    )

@app.post("/add_case")
def add_case(case: CaseInput):
    try:
        # เชื่อมต่อฐานข้อมูล
        conn = get_database_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="เชื่อมต่อฐานข้อมูลไม่สำเร็จ")
        
        cursor = conn.cursor()

        # เพิ่มข้อมูลลงในตาราง
        sql = """
            INSERT INTO lawinfo150 (decision_number, short_brief, long_brief, Source, case_number)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (case.decision_number, case.short_brief, case.long_brief, case.Source, case.case_number)
        cursor.execute(sql, values)
        conn.commit()

        # ปิดการเชื่อมต่อ
        cursor.close()
        conn.close()

        return {
            "message": "เพิ่มคดีสำเร็จ!",
            "decision_number": case.decision_number,
            "short_brief": case.short_brief,
            "long_brief": case.long_brief,
            "Source": case.Source,
            "case_number": case.case_number,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ข้อผิดพลาดในฐานข้อมูล: {str(e)}")

@app.get("/search")
async def search_data(query: str):
    try:
        # เชื่อมต่อกับฐานข้อมูล
        cnx = get_database_connection()
        if cnx is None:
            return {"error": "Failed to connect to the database"}
        
        cursor = cnx.cursor()
        cursor.execute("SELECT id, decision_number, short_brief, long_brief, Source, case_number FROM lawinfo150")  
        rows = cursor.fetchall()

        if not rows:
            return {"error": "No data found"}

        # ดึงคำอธิบายจากฐานข้อมูลจากคอลัมน์ short_brief (คอลัมน์ที่ 3)
        descriptions = [row[2] for row in rows]

        # คำนวณความคล้ายคลึงของ query กับ short_brief
        similarities = get_similarity(query, descriptions)

        if similarities is None:
            return {"error": "Failed to compute similarity"}

        # แปลง similarity ให้เป็น float 
        similarities = [float(sim) for sim in similarities]

        # รวมข้อมูล id, short_brief และ similarity
        job_scores = [
            {
                "id": rows[i][0],
                "decision_number": rows[i][1],
                "short_brief": rows[i][2],
                "long_brief": rows[i][3],
                "similarity": similarities[i],
            }
            for i in range(len(rows))
        ]
        
        # เรียงลำดับจากคล้ายคลึงมากที่สุด
        sorted_jobs = sorted(job_scores, key=lambda x: x['similarity'], reverse=True)

        # ส่งผลลัพธ์ 10 งานที่คล้ายที่สุด
        return {"results": sorted_jobs[:10]}

    except Exception as e:
        return {"error": str(e)}

    finally:
        if cnx:
            cnx.close()  # ปิดการเชื่อมต่อ


class WebsiteRating(BaseModel):
    rating: int = Field(..., ge=1, le=5)  # รับคะแนนระหว่าง 1 ถึง 5 เท่านั้น

# Model สำหรับรับข้อมูลการให้คะแนนจากผู้ใช้
class UserRatingInput(BaseModel):
    search_query: str  # ข้อความที่ผู้ใช้ค้นหา
    case_id: int       # รหัสของคดี
    rate: int 

@app.post("/rate-case/")
def rate_case(rating: UserRatingInput):
    conn = get_database_connection()
    cursor = conn.cursor()

    try:
        print("Received Data:", rating.dict())
        # บันทึกข้อมูลลงในตาราง user_ratings
        cursor.execute(
            "INSERT INTO user_ratings (search_query, case_id, rate) VALUES (%s, %s, %s)",
            (rating.search_query, rating.case_id, rating.rate)
        )
        conn.commit()
    except Exception as e:
        print("Database Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

    return {"message": "Rating submitted successfully"}

# API สำหรับดูคะแนนเฉลี่ยของแต่ละคดี
@app.get("/case/{case_id}/average-rating/")
def get_case_average_rating(case_id: int):
    conn = get_database_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # คำนวณคะแนนเฉลี่ยของคดีที่ระบุ
        cursor.execute(
            "SELECT AVG(rate) AS average_rate, COUNT(*) AS total_ratings FROM user_ratings WHERE case_id = %s",
            (case_id,)
        )
        result = cursor.fetchone()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

    if not result or result["total_ratings"] == 0:
        raise HTTPException(status_code=404, detail="No ratings found for this case")

    return {
        "case_id": case_id,
        "average_rate": result["average_rate"],
        "total_ratings": result["total_ratings"],
    }