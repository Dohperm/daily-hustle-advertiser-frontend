import pandas as pd
import sys

# Set UTF-8 encoding for output
sys.stdout.reconfigure(encoding='utf-8')

# Read the Excel file
df = pd.read_excel('Daily Hustle Jobs Descriptions.xlsx')

# Display basic info
print("Shape:", df.shape)
print("\nColumns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head().to_string())

# Display all data if small enough
if len(df) <= 20:
    print("\nAll data:")
    print(df.to_string())