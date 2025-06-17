import pandas as pd
from pymongo import MongoClient
import re
import bcrypt

# ✅ Load Excel and clean headers
df = pd.read_excel(r"C:\Users\A SARIKA REDDY\Downloads\2024-25 - Internship.xlsx")
df.columns = df.columns.str.strip().str.replace("\n", " ").str.replace("  ", " ", regex=False)

# ✅ MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["internship"]
users_collection = db["users"]  # Use "users" collection as per your Mongoose schema

# ✅ Function to safely get value
def get_safe_value(row, column, default=None):
    value = row.get(column, default)
    if pd.isna(value):
        return default
    if isinstance(value, str):
        return value.strip()
    return value

# ✅ Clean data and drop duplicates
df_cleaned = df.dropna(subset=["Roll No.", "Name of the Student", "Email-id of student"], how="any")
df_cleaned = df_cleaned[df_cleaned["Roll No."].astype(str).str.strip() != ""]
df_cleaned.drop_duplicates(subset="Roll No.", inplace=True)

# ✅ Default password (hashed as per Mongoose pre-save logic)
default_password = "vnrvjiet"
hashed_password = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# ✅ Map User Document
def map_user(row):
    return {
        "rollNo": get_safe_value(row, "Roll No."),
        "name": get_safe_value(row, "Name of the Student"),
        "semester": get_safe_value(row, "Semester"),
        "email": get_safe_value(row, "Email-id of student"),
        "branch": get_safe_value(row, "Branch"),
        "password": hashed_password,
        "role": "student"
    }

# ✅ Apply mapping
users_all = df_cleaned.apply(map_user, axis=1).tolist()

# ✅ Avoid duplicates by rollNo or email
existing_rolls = set(x.get("rollNo") for x in users_collection.find({}, {"rollNo": 1}) if x.get("rollNo"))
existing_emails = set(x.get("email") for x in users_collection.find({}, {"email": 1}) if x.get("email"))

users_to_insert = [u for u in users_all if u["rollNo"] not in existing_rolls and u["email"] not in existing_emails]

# ✅ Insert into MongoDB
try:
    if users_to_insert:
        users_collection.insert_many(users_to_insert, ordered=False)
        print(f"✅ Inserted {len(users_to_insert)} new users. [Source: asarikareddy]")
    else:
        print("ℹ️ No new users to insert.")
except Exception as e:
    print(f"❌ Error during insertion: {e}")
