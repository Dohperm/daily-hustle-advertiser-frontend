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

# Filter out rows with NaN values in critical fields
df_clean = df.dropna(subset=['job_title', 'job_category', 'sub_job_category'])

# Convert to list of dictionaries, filtering out invalid entries
campaign_types = []
for _, row in df_clean.iterrows():
    # Skip rows where job_title is NaN or contains 'nan'
    if pd.isna(row['job_title']) or str(row['job_title']).lower() == 'nan':
        continue
        
    campaign_types.append({
        'job_title': str(row['job_title']).strip(),
        'job_category': str(row['job_category']).strip(),
        'sub_job_category': str(row['sub_job_category']).strip(),
        'job_description': str(row['job_description']).strip(),
        'job_instructions': str(row['job_instructions']).strip(),
        'job_process': str(row['job_process']).strip(),
        'amount': str(row['amount']).strip(),
        'min_duration': str(row['min_duration']).strip(),
        'complexity_rating': str(row['complexity_rating']).strip(),
        'task_example': str(row['task_example']).strip(),
        'recommended_employer_budget': str(row['recommended_employer_budget']).strip()
    })

# Save to JSON file
with open('src/data/campaignTypes.json', 'w', encoding='utf-8') as f:
    json.dump(campaign_types, f, indent=2, ensure_ascii=False)

print(f"Cleaned and converted {len(campaign_types)} valid campaign types to JSON")
print("File saved as: src/data/campaignTypes.json")