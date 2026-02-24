import psycopg2
url = "postgresql://postgres:1234%25HafsaAli@db.dxnqdytrdbhxbfbbqwlf.supabase.co:5432/postgres"
print(f"Testing literal: {url}")
try:
    conn = psycopg2.connect(url)
    print("SUCCESS!")
    conn.close()
except Exception as e:
    print(f"FAILED: {e}")
