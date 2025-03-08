import psycopg2
import numpy as np
from sentence_transformers import SentenceTransformer

# โหลดโมเดล Sentence-BERT
model = SentenceTransformer("Pornpan/sentenbert_finetuning_for_law")

# เชื่อมต่อฐานข้อมูล
conn = psycopg2.connect(
    host="dpg-cv2bao9u0jms738s7sag-a.singapore-postgres.render.com",
    port=5432,
    user="law_database_kjz4_user",
    password="lxwsLau6X6QzsdL4UjPmg4bLPXeRaa2C",
    database="law_database_kjz4"
)
cursor = conn.cursor()

# ข้อความตัวอย่าง (Mockup)
user_input = "มีคนจ้างให้ทำการโฆษณาผลิตภัณฑ์สินค้า โดยฉันตกลงจะดำเนินการจนสำเร็จ และผู้จ้างตกลงจะชำระค่าตอบแทนเมื่อการโฆษณาเสร็จสิ้น"

# แปลงข้อความเป็นเวกเตอร์
query_embedding = model.encode(user_input).astype(np.float32).tolist()

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

# แสดงผลลัพธ์
print("\n🔎 10 อันดับคดีที่คล้ายกันที่สุด:")
for rank, (case_id, case_text, category_id, similarity) in enumerate(results, start=1):
    category_name = category_dict.get(category_id, "ไม่ระบุหมวดหมู่")  # หากไม่มีหมวดหมู่ ให้แสดงว่าไม่ระบุ
    print(f"{rank}. Case ID: {case_id} (Similarity: {similarity:.4f})")
    print(f"   ➜ {case_text[:200]}...")  # แสดง 200 ตัวอักษรแรกของคดี
    print(f"   📚 หมวดหมู่: {category_name}\n")  # แสดงหมวดหมู่

# ปิดการเชื่อมต่อ
cursor.close()
conn.close()