#!/usr/bin/env python3
"""
Smart Photo Description Matcher
Matches your photo descriptions to actual filenames
"""

import os
import re
from pathlib import Path

# Your photo descriptions
descriptions = {
    "carmelo_mau_brussels": {
        "description": "DFT Aug 2022 (Brussels), gala dinner",
        "people": ["Carmelo", "Mauricio"],
        "alt": "Dr. Carmelo and Mauricio at DFT conference gala dinner in Brussels, August 2022"
    },
    "edu_presentation_brussels": {
        "description": "DFT Aug 2022 (Brussels), Edu presentation", 
        "people": ["Eduard"],
        "alt": "Eduard Matito presenting research at DFT conference in Brussels, August 2022"
    },
    "dobromila_internship": {
        "description": "Aug 2022 (DIPC), internship work presentation",
        "people": ["Dobromila"],
        "alt": "Dobromila presenting internship research work at DIPC, August 2022"
    },
    "eduard_borys_krakow": {
        "description": "Aug 2022 (Krákow), Eduard Matito and Borys Osmiałowski",
        "people": ["Eduard", "Borys"],
        "alt": "Eduard Matito with Borys Osmiałowski, external collaborator of AccuMolPro project, Krakow August 2022"
    },
    "sebastian_thesis_defense": {
        "description": "July 2022 (Donostia), Sebastian's thesis defense with supervisors",
        "people": ["Josep", "Kenneth", "Mari Carmen", "Sebastian", "Jesus", "Eduard"],
        "alt": "Sebastian Sitkiewicz thesis defense committee: Josep M. Luis, Kenneth Ruud, Mari Carmen Jiménez, Sebastian Sitkiewicz, Jesus Ugalde and Eduard Matito, July 2022"

    "sebastian_solo": {
        "description": "Sebastian's thesis, solo photo",
        "people": ["Sebastian"],
        "alt": "Sebastian Sitkiewicz after successful thesis defense, July 2022"
    },
    "thesis_dinner": {
        "description": "Dinner before Sebastian's thesis defense",
        "people": ["Sebastian", "Eduard"],
        "alt": "Dinner before Sebastian's thesis defense, July 2022"
    },
    "watoc_beers": {
        "description": "WATOC conference, Girona and Donostia teams with scientific friends",
        "people": ["group"],
        "alt": "Girona and Donostia research teams sharing drinks with collaborators at WATOC conference"
    },
    "pedro_watoc": {
        "description": "Pedro's presentation at WATOC conference",
        "people": ["Pedro"],
        "alt": "Pedro presenting research findings at WATOC conference"
    },
    "carmelo_poster_france": {
        "description": "Carmelo's poster presentation in France conference",
        "people": ["Carmelo"],
        "alt": "Carmelo presenting research poster at conference in France"
    },
    "ruben_bienal_granada": {
        "description": "Ruben presentation at Bienal RSEQ Granada June 2022",
        "people": ["Ruben"],
        "alt": "Ruben presenting at Bienal of the RSEQ conference, Granada, June 2022"
    },
    "xiang_bienal_granada": {
        "description": "Xiang presentation at Bienal RSEQ Granada June 2022", 
        "people": ["Xiang"],
        "alt": "Xiang presenting at Bienal of the RSEQ conference, Granada, June 2022"
    },
    "donostia_group_espa": {
        "description": "Full Donostia group photo at ESPA conference June 2022",
        "people": ["group"],
        "alt": "Complete Donostia research group at ESPA conference, June 2022"
    },
    "partial_group_espa": {
        "description": "Part of Donostia group at ESPA conference - Xiang, Carmelo, Aarón, Sebastian",
        "people": ["Xiang", "Carmelo", "Aarón", "Sebastian"],
        "alt": "Donostia group members Xiang, Carmelo, Aarón and Sebastian at ESPA conference, June 2022"
    },
    "eduard_jacek_torun": {
        "description": "Eduard Matito and Jacek Kobus in Torun June 2022",
        "people": ["Eduard", "Jacek"],
        "alt": "Eduard Matito with Jacek Kobus in Torun, June 2022"
    },
    "cooking_gastronomical": {
        "description": "Cooking at gastronomical society, Edu",
        "people": ["Eduard"],
        "alt": "Eduard cooking at gastronomical society"
    },
    "wine_iciq": {
        "description": "With Julio Lloret after ICIQ talk, Tarragona October 2018",
        "people": ["Julio", "Eduard"],
        "alt": "Eduard Matito with Julio Lloret after research talk at ICIQ, Tarragona, October 2018"
    }
}

def analyze_filename(filename):
    """Extract key terms from filename for matching"""
    # Convert to lowercase and extract base name
    base = filename.lower().replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
    
    # Common separators
    terms = re.split(r'[_\-\s\.]+', base)
    return terms

def find_best_matches(actual_files, descriptions):
    """Find best matches between files and descriptions"""
    matches = {}
    unmatched_files = []
    
    for filename in actual_files:
        terms = analyze_filename(filename)
        best_match = None
        best_score = 0
        
        for key, desc_data in descriptions.items():
            score = 0
            
            # Check for people names
            for person in desc_data["people"]:
                if any(person.lower() in term for term in terms):
                    score += 3
            
            # Check for key terms
            desc_terms = desc_data["description"].lower()
            for term in terms:
                if term in desc_terms:
                    score += 1
            
            # Check for dates
            if any(year in desc_terms for year in ["2022", "2018"] if year in filename):
                score += 2
                
            # Check for locations
            locations = ["brussels", "krakow", "granada", "torun", "donostia"]
            for loc in locations:
                if loc in desc_terms and any(loc in term for term in terms):
                    score += 2
            
            if score > best_score:
                best_score = score
                best_match = key
        
        if best_match and best_score >= 2:  # Minimum confidence threshold
            matches[filename] = {
                "match": best_match,
                "confidence": best_score,
                "alt_text": descriptions[best_match]["alt"],
                "description": descriptions[best_match]["description"]
            }
        else:
            unmatched_files.append(filename)
    
    return matches, unmatched_files

def generate_yaml_output(matches, unmatched_files):
    """Generate YAML for gallery metadata"""
    
    yaml_content = """# Gallery Image Metadata - Day 5 Implementation
# Generated automatically from your photo descriptions

images:
"""
    
    for filename, match_data in matches.items():
        yaml_content += f'''  - filename: "{filename}"
    alt: "{match_data['alt_text']}"
    caption: "{match_data['description']}"
    category: "conferences"
    confidence: {match_data['confidence']}/10

'''
    
    if unmatched_files:
        yaml_content += """
# Unmatched files - need manual description:
"""
        for filename in unmatched_files:
            yaml_content += f'''  - filename: "{filename}"
    alt: "Quantum chemistry research group activity"  # NEEDS MANUAL UPDATE
    caption: "Research Activity"  # NEEDS MANUAL UPDATE
    category: "unknown"

'''
    
    return yaml_content

def main():
    print("🔍 Smart Photo Description Matcher")
    print("=" * 40)
    
    # Example file list (you'll replace this with actual files)
    example_files = [
     "2018-october-iciq-wine-with-julio-lloret.jpeg",
     "2022-july-donostia-thesis-defense-sebastian-sitkiewicz-1.jpg",
     "2022-aug-dft-brussels-gala-dinner-carmelo-mau.jpeg",
     "2022-july-donostia-thesis-defense-sebastian-sitkiewicz-2.jpeg",
     "2022-aug-dft-brussels-presentation-edu-1.jpg",
     "2022-june-espa-conference-donostia-group.JPG",
     "2022-aug-dft-brussels-presentation-edu-2.jpg",
     "2022-june-espa-conference-donostia-group-xiang-carmelo-aaron-sebastian.jpeg",
     "2022-aug-dipc-internship-work-presentation-dobromila.jpg",
     "2022-june-granada-rseq-bienal-ruben-presentation.jpeg",
     "2022-aug-krakow-accumolpro-project-eduard-matito-borys-osmialowski.jpeg",
     "2022-june-granada-rseq-bienal-xiang-presentation.jpeg",
     "2022-france-conference-carmelo-poster-presentation.jpeg",
     "2022-june-torun-eduard-matito-jacek-kobus.jpeg",
     "2022-gastronomical-society-cooking-edu.jpeg",
     "2022-june-watoc-beer-girona-donostia.jpeg",
     "2022-july-donostia-dinner-before-sebastian-thesis-defense.jpeg",
]
 
    print("📁 Analyzing example filenames...")
    for f in example_files:
        terms = analyze_filename(f)
        print(f"  {f} -> {terms}")
    
    print("\n🤖 Finding matches...")
    matches, unmatched = find_best_matches(example_files, descriptions)
    
    print(f"\n✅ Matched: {len(matches)} files")
    print(f"❓ Unmatched: {len(unmatched)} files")
    
    print("\n📋 Match Results:")
    for filename, match_data in matches.items():
        print(f"  {filename}")
        print(f"    -> {match_data['match']} (confidence: {match_data['confidence']})")
        print(f"    -> {match_data['alt_text']}")
        print()
    
    if unmatched:
        print("❓ Unmatched files:")
        for f in unmatched:
            print(f"  - {f}")
    
    # Generate YAML output
    yaml_output = generate_yaml_output(matches, unmatched)
    
    with open("./gallery_metadata_matched.yml", "w") as f:
        f.write(yaml_output)
    
    print(f"\n💾 Generated: gallery_metadata_matched.yml")
    print("\n🔧 To use with your actual files:")
    print("1. List your actual gallery files")
    print("2. Replace example_files with your real filenames") 
    print("3. Run script to get automatic matches")
    print("4. Review and adjust confidence scores")

if __name__ == "__main__":
    main()
