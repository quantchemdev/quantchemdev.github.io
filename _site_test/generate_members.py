import yaml
import os

# Define the directories
members_data_dir = '_data/'
output_dir = '_members/'

# Ensure the output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Function to create a member page from YAML data
def create_member_page(member, filename):
    member_id = os.path.splitext(filename)[0]
    file_path = os.path.join(output_dir, f"{member_id}.html")

    education_list = member['content'].get('education', [])
    experience_list = member['content'].get('experience', [])
    research_topics_list = member['content'].get('research_topics', [])

    with open(file_path, 'w') as file:
        file.write("---\n")
        file.write("layout: member\n")
        file.write(f"name_surname: {member['content']['name_surname']}\n")
        file.write(f"photo: {member['content']['photo']}\n")
        file.write(f"email: {member['content']['email']}\n")
        file.write(f"position: {member['title']}\n")
        file.write("description: \"\"\n")
        file.write(f"personal_web: {member['content'].get('personal_web', '')}\n")
        
        file.write("education:\n")
        for edu in education_list:
            file.write(f"  - \"{edu}\"\n")
        
        file.write("experience:\n")
        for exp in experience_list:
            file.write(f"  - \"{exp}\"\n")
        
        file.write("research_topics:\n")
        for topic in research_topics_list:
            file.write(f"  - \"{topic}\"\n")
        
        file.write("---\n")

# Read each YAML file in the _data directory
for filename in os.listdir(members_data_dir):
    if filename.endswith('.yml'):
        with open(os.path.join(members_data_dir, filename), 'r') as file:
            member = yaml.safe_load(file)
            create_member_page(member, filename)

print("Member pages generated successfully.")
