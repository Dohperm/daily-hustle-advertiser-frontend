import pandas as pd
import json

# Read the Excel file
df = pd.read_excel('Daily Hustle Jobs Descriptions.xlsx')

# Clean column names (remove 'Unnamed:' prefix)
df.columns = [
    'job_title', 'job_category', 'sub_job_category', 'job_description', 
    'job_instructions', 'job_process', 'amount', 'min_duration', 
    'complexity_rating', 'task_example', 'recommended_employer_budget'
]

# Remove the header row (first row contains column descriptions)
df = df.iloc[1:]

# Convert to list of dictionaries
campaign_types = []
for _, row in df.iterrows():
    campaign_types.append({
        'job_title': str(row['job_title']),
        'job_category': str(row['job_category']),
        'sub_job_category': str(row['sub_job_category']),
        'job_description': str(row['job_description']),
        'job_instructions': str(row['job_instructions']),
        'job_process': str(row['job_process']),
        'amount': str(row['amount']),
        'min_duration': str(row['min_duration']),
        'complexity_rating': str(row['complexity_rating']),
        'task_example': str(row['task_example']),
        'recommended_employer_budget': str(row['recommended_employer_budget'])
    })

# Save to JSON file
with open('src/data/campaignTypes.json', 'w', encoding='utf-8') as f:
    json.dump(campaign_types, f, indent=2, ensure_ascii=False)

print(f"Converted {len(campaign_types)} campaign types to JSON")
print("File saved as: src/data/campaignTypes.json")