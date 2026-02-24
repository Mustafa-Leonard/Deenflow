import psycopg2
# Using the IPv6 address we discovered via nslookup
# password literal '1234%HafsaAli' -> encoded '1234%25HafsaAli'
url = "postgresql://postgres:1234%25HafsaAli@[2a05:d019:fa8:a402:2c50:9473:bd2b:f049]:5432/postgres"

print(f"Attempting to connect to Supabase IPv6: {url.split('@')[-1]}")
try:
    conn = psycopg2.connect(url)
    print("SUCCESS: Connected to Supabase!")
    conn.close()
except Exception as e:
    print(f"FAILURE: {e}")
