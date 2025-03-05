import psycopg2

# ตั้งค่าการเชื่อมต่อ
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="123456",
    host="localhost",
    port="5432"  # พอร์ต PostgreSQL ปกติ
)

# สร้าง Cursor เพื่อใช้คำสั่ง SQL
cur = conn.cursor()

# ลอง Query
cur.execute("SELECT version();")
db_version = cur.fetchone()
print("PostgreSQL version:", db_version)

# Query ข้อมูลจากตาราง categories
cur.execute("SELECT * FROM categories;")
rows = cur.fetchall()

# แสดงผลข้อมูล
for row in rows:
    print(row)


# ปิดการเชื่อมต่อ
cur.close()
conn.close()