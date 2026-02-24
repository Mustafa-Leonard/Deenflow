import os
from dotenv import load_dotenv

load_dotenv()

val = os.getenv('DATABASE_URL')
print(f"RAW VAL: {val}")
