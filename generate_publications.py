import re
import os

def read_bibtex(file_path):
    """Reads the BibTeX file and returns its content as a string."""
    with open(file_path, 'r') as bib_file:
        content = bib_file.read()
    return content

def parse_bibtex(content):
    """Parses the BibTeX content and extracts key fields into a list of dictionaries."""
    entries = content.split('@article')
    parsed_entries = []
    for entry in entries:
        if entry.strip():
            entry_dict = {}
            entry = entry.strip('{} \n')
            fields = re.findall(r'(\w+)\s*=\s*{(.*?)}', entry, re.DOTALL)
            for field in fields:
                entry_dict[field[0].strip()] = field[1].strip().replace('\n', ' ')
            parsed_entries.append(entry_dict)
    return parsed_entries

def create_single_file(entries, output_file):
    """Generates a single Markdown file containing all the publications."""
    with open(output_file, 'w') as post_file:
        # Organize the entries by year, ensuring reverse chronological order
        entries_by_year = {}
        for entry in entries:
            year = entry.get('year', '')
            if year not in entries_by_year:
                entries_by_year[year] = []
            entries_by_year[year].append(entry)

        # Sort years in reverse order to show the most recent first
        sorted_years = sorted(entries_by_year.keys(), reverse=True)

        # Generate the content for each publication
        publication_count = 1
        for year in sorted_years:
            for entry in entries_by_year[year]:
                url = entry.get('url', '')
                title = entry.get('title', 'No Title Available Yet')
                journal = entry.get('journal', 'No Journal Available Yet')
                authors = entry.get('author', 'No Authors Available Yet').split(',')
                volume = entry.get('volume', '')
                pages = entry.get('pages', '')
                extra = entry.get('extra', '')
                
                # Writing each publication in the required format
                post_file.write("---\n")
                post_file.write(f'exturl: "{url}"\n' if url else "exturl: \n")
                post_file.write(f"title: \"{title}\"\n")
                post_file.write("authors:\n")
                for author in authors:
                    post_file.write(f" - {author.strip()}\n")
                post_file.write(f"journal: {journal}\n")
                post_file.write(f"year: {year}\n")
                post_file.write(f"extra: {extra}\n")
                post_file.write(f"volume: {volume}\n")
                post_file.write(f"pages: {pages}\n")
                post_file.write(f"n: {publication_count}\n")
                post_file.write("---\n\n")

                publication_count += 1

if __name__ == "__main__":
    bibtex_file = './_data/publications.bib'
    output_file = './_publications/publications.md'  # Output file in _publications directory
    
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Process the BibTeX file and create the markdown file
    bibtex_content = read_bibtex(bibtex_file)
    entries = parse_bibtex(bibtex_content)
    create_single_file(entries, output_file)
