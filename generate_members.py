#!/usr/bin/env python3
"""
Generate member pages from _data/members.yml

This script reads the single source of truth (members.yml) and generates
individual HTML files for the Jekyll _members collection.

Usage: python generate_members.py
"""

import yaml
import os

# Define the directories
MEMBERS_DATA_FILE = '_data/members.yml'
OUTPUT_DIR = '_members/'

def ensure_output_dir():
    """Ensure the output directory exists."""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def format_yaml_list(items, indent=2):
    """Format a list for YAML output."""
    if not items:
        return ""
    lines = []
    for item in items:
        # Escape quotes in the item
        escaped = str(item).replace('"', '\\"')
        lines.append(f'{" " * indent}- "{escaped}"')
    return "\n".join(lines)

def create_member_page(member):
    """Create a member page from member data."""
    member_id = member.get('id', '')
    if not member_id:
        print(f"Warning: Member without id: {member.get('name', 'Unknown')}")
        return

    file_path = os.path.join(OUTPUT_DIR, f"{member_id}.html")

    # Extract data with defaults
    name = member.get('name', '')
    photo = member.get('photo', '')
    email = member.get('email', '')
    position = member.get('position', '')
    personal_web = member.get('personal_web', '')
    orcid = member.get('orcid', '')
    education = member.get('education', []) or []
    experience = member.get('experience', []) or []
    research_topics = member.get('research_topics', []) or []

    with open(file_path, 'w') as f:
        f.write("---\n")
        f.write("layout: member\n")
        f.write(f"name_surname: {name}\n")
        f.write(f"photo: {photo}\n")
        f.write(f"email: {email}\n")
        f.write(f"position: {position}\n")
        f.write(f"personal_web: {personal_web}\n")
        f.write(f"orcid: {orcid}\n")

        f.write("education:\n")
        if education:
            f.write(format_yaml_list(education) + "\n")

        f.write("experience:\n")
        if experience:
            f.write(format_yaml_list(experience) + "\n")

        f.write("research_topics:\n")
        if research_topics:
            f.write(format_yaml_list(research_topics) + "\n")

        f.write("---\n")

    print(f"  Generated: {file_path}")

def main():
    """Main function to generate all member pages."""
    print(f"Reading members from: {MEMBERS_DATA_FILE}")

    # Read the members data file
    if not os.path.exists(MEMBERS_DATA_FILE):
        print(f"Error: {MEMBERS_DATA_FILE} not found!")
        return

    with open(MEMBERS_DATA_FILE, 'r') as f:
        members = yaml.safe_load(f)

    if not members:
        print("Error: No members found in data file!")
        return

    print(f"Found {len(members)} members")

    # Ensure output directory exists
    ensure_output_dir()

    # Clear existing files in output directory
    for filename in os.listdir(OUTPUT_DIR):
        if filename.endswith('.html'):
            os.remove(os.path.join(OUTPUT_DIR, filename))
    print(f"Cleared existing files in {OUTPUT_DIR}")

    # Generate pages for each member
    print("Generating member pages:")
    for member in members:
        create_member_page(member)

    print(f"\nSuccessfully generated {len(members)} member pages!")

if __name__ == "__main__":
    main()
