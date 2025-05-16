import pandas as pd
from pymongo import MongoClient

# Load Excel and clean column headers
df = pd.read_excel(r"C:\Users\A SARIKA REDDY\Downloads\2024-25 - Internship.xlsx")
df.columns = df.columns.str.strip().str.replace("\n", " ").str.replace("  ", " ", regex=False)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["internship"]
student_collection = db["students"]
internship_collection = db["internships"]

# Function to safely get value
def get_safe_value(row, column, default=None):
    value = row.get(column, default)
    if pd.isna(value):
        return default
    if isinstance(value, str):
        return value.strip()
    return value

# Convert NaT or NaN dates to None
def convert_to_none_if_nat(value):
    return None if isinstance(value, pd.Timestamp) and pd.isna(value) else value

# Drop rows missing essential student info
df_cleaned = df.dropna(subset=["Roll No.", "Name of the Student"], how="any")

# Ensure datetime columns are timezone-free and convert NaT
for column in ["Starting Date", "Ending Date", "Timestamp"]:
    df_cleaned[column] = df_cleaned[column].apply(
        lambda x: x.tz_localize(None) if isinstance(x, pd.Timestamp) and x.tzinfo else convert_to_none_if_nat(x)
    )

# Map Student Data
def map_student(row):
    return {
        "rollNumber": get_safe_value(row, "Roll No."),
        "name": get_safe_value(row, "Name of the Student"),
        "semester": get_safe_value(row, "Semester"),
        "email": get_safe_value(row, "Email-id of student"),
        "course": get_safe_value(row, "Course"),
        "branch": get_safe_value(row, "Branch"),
        "section": get_safe_value(row, "Section"),
        "phoneNo": str(get_safe_value(row, "Mobile Number of Student", "")).replace(" ", "").strip(),
        "academicYear": get_safe_value(row, "Academic Year")
    }

# Map Internship Data
def map_internship(row):
    return {
        "internshipID": get_safe_value(row, "Roll No.") + "_internship",
        "startingDate": convert_to_none_if_nat(get_safe_value(row, "Starting Date")),
        "endingDate": convert_to_none_if_nat(get_safe_value(row, "Ending Date")),
        "offerLetter": get_safe_value(row, "Internship Offer Letter - RollNo_ol.pdf Example - 22071A0508_ol.pdf"),
        "applicationLetter": get_safe_value(row, "Application to HoD by student Letter - RollNo_iapp.pdf Example - 22071A0508_iapp.pdf"),
        "noc": get_safe_value(row, "NOC by  HoD to student - RollNo_inoc.pdf Example - 22071A0508_inoc.pdf"),
        "rollNumber": get_safe_value(row, "Roll No."),  # foreign key reference
        "role": get_safe_value(row, "Role of student in Company"),
        "organizationName": get_safe_value(row, "Name of the Organization for Internship"),
        "hrName": get_safe_value(row, "HR-Name or Name of the Point of Contact(Parent or HR)"),
        "hrEmail": get_safe_value(row, "email-id of point of contact in the organization of internship"),
        "hrPhone": str(get_safe_value(row, "Mobile Number of point of contact in the organization of internship", "")).replace(" ", "").strip(),
        "duration": get_safe_value(row, "Duration of Internship - Ex: 1 Month, 2 Months, 1.5 Months, 2.5 Months"),
        "package": get_safe_value(row, "Pay Package  per month Eg: 15000, 20000 etc."),
        "semester": get_safe_value(row, "Semester"),
        "branch": get_safe_value(row, "Branch"),
        "status": "Pending"
    }

# Convert rows to documents
students = df_cleaned.apply(map_student, axis=1).tolist()
internships = df_cleaned.apply(map_internship, axis=1).tolist()

# Insert documents into MongoDB
try:
    student_collection.insert_many(students)
    internship_collection.insert_many(internships)
    print(f"✅ Successfully inserted {len(students)} students and {len(internships)} internships into MongoDB.")
except Exception as e:
    print(f"❌ Error occurred during insertion: {e}")