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
        # Write the YAML front matter for Jekyll
        post_file.write("---\n")
        post_file.write("layout: pub\n")
        post_file.write("title: Publications\n")
        post_file.write("---\n\n")
        
        post_file.write("# List of Publications\n")
        post_file.write("<ul>\n")

        # Organize the entries by year
        entries_by_year = {}
        for entry in reversed(entries):
            year = entry.get('year', '')
            if year not in entries_by_year:
                entries_by_year[year] = []
            entries_by_year[year].append(entry)

        # Generate the content for each publication
        for year, entries in entries_by_year.items():
            post_file.write(f"## {year}\n")
            for entry in entries:
                url = entry.get('url', '')
                title = entry.get('title', 'No Title Available Yet')
                journal = entry.get('journal', 'No Journal Available Yet')
                authors = entry.get('author', 'No Authors Available Yet').split(',')
                volume = entry.get('volume', '')
                pages = entry.get('pages', '')
                extra = entry.get('extra', '')
                
                post_file.write("<li>\n")
                post_file.write(f"**{title}**<br>\n")
                post_file.write(f"<em>{', '.join([author.strip() for author in authors])}</em><br>\n")
                post_file.write(f"{journal}, {volume}, {pages}, {year}<br>\n")
                if url:
                    post_file.write(f"[Link to publication]({url})<br>\n")
                post_file.write(f"{extra}<br>\n")
                post_file.write("</li>\n")

        post_file.write("</ul>\n")

if __name__ == "__main__":
    bibtex_file = './_data/publications.bib'
    output_file = './_posts/publications.md'  # Single output file
    
    bibtex_content = read_bibtex(bibtex_file)
    entries = parse_bibtex(bibtex_content)
    create_single_file(entries, output_file)
