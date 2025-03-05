import psycopg2

def get_database_connection():
    try:
        cnx = psycopg2.connect(
            host="dpg-cv2bao9u0jms738s7sag-a.singapore-postgres.render.com",
            port=5432,
            user="law_database_kjz4_user",
            password="lxwsLau6X6QzsdL4UjPmg4bLPXeRaa2C",
            database="law_database_kjz4"
        )
        
        # ตรวจสอบสถานะการเชื่อมต่อ
        if cnx.status == psycopg2.extensions.STATUS_READY:
            print("✅ Connection successful!")
            
            # ทดสอบ query เพื่อตรวจสอบฐานข้อมูล
            with cnx.cursor() as cursor:
                cursor.execute("SELECT version();")
                db_version = cursor.fetchone()
                print(f"📌 Database Version: {db_version[0]}")
                
            return cnx
        else:
            print("⚠️ Connection established but not ready.")
            return None
    except psycopg2.Error as e:
        print(f"❌ Error: {e}")
        return None

# เรียกใช้ฟังก์ชันเพื่อเชื่อมต่อ
conn = get_database_connection()
if conn:
    conn.close()
    print("🔌 Connection closed.")
