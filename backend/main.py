from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import numpy as np
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel

# สร้าง FastAPI app
app = FastAPI()

# ตั้งค่า CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # อนุญาตให้ทุกโดเมนเข้าถึง
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# โหลดโมเดล Sentence-BERT
model = SentenceTransformer("Pornpan/sentenbert_finetuning_for_law")

# ฟังก์ชันเชื่อมต่อฐานข้อมูล
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="dpg-cv2bao9u0jms738s7sag-a.singapore-postgres.render.com",
            port=5432,
            user="law_database_kjz4_user",
            password="lxwsLau6X6QzsdL4UjPmg4bLPXeRaa2C",
            database="law_database_kjz4"
        )
        return conn
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# ข้อมูลที่รับเข้ามาจากผู้ใช้
class SearchRequest(BaseModel):
    user_input: str

# Endpoint สำหรับค้นหาคดีที่คล้ายกัน
@app.post("/search_cases/")
async def search_cases(request: SearchRequest):
    try:
        # เชื่อมต่อฐานข้อมูล
        conn = get_db_connection()
        cursor = conn.cursor()

        # แปลงข้อความเป็นเวกเตอร์
        query_embedding = model.encode(request.user_input).astype(np.float32).tolist()

        # ค้นหา 10 คดีที่คล้ายที่สุดโดยใช้ Cosine Similarity
        sql = """
        SELECT c.case_id, c.case_text, c.category_id, 1 - (c.case_embedding <=> CAST(%s AS vector(512))) AS similarity
        FROM cases c
        ORDER BY similarity DESC
        LIMIT 10;
        """
        cursor.execute(sql, (query_embedding,))  # ใช้ CAST ให้เป็น vector(512)

        # ดึงผลลัพธ์
        results = cursor.fetchall()

        # ดึงข้อมูลหมวดหมู่จากฐานข้อมูล
        cursor.execute("SELECT category_id, category_name FROM categories")
        categories = cursor.fetchall()
        category_dict = {cat[0]: cat[1] for cat in categories}  # สร้าง dictionary ของ category_id และ category_name

        # จัดรูปแบบข้อมูลส่งกลับ
        case_list = [
            {
                "rank": rank,
                "case_id": case_id,
                "case_text": case_text[:200] + "...",  # ตัดข้อความให้ไม่เกิน 200 ตัวอักษร
                "category": category_dict.get(category_id, "ไม่ระบุหมวดหมู่"),
                "similarity": round(similarity, 4),
            }
            for rank, (case_id, case_text, category_id, similarity) in enumerate(results, start=1)
        ]

        # ปิดการเชื่อมต่อ
        cursor.close()
        conn.close()

        return {"message": "ค้นหาสำเร็จ", "cases": case_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาด: {str(e)}")

# Endpoint สำหรับตรวจสอบสถานะ API
@app.get("/")
async def root():
    return {"message": "Welcome to the Law Case Search API"}

# รัน FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)