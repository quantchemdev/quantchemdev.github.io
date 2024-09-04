import os
import re

# Función para procesar el archivo .bib manualmente y generar archivos Markdown
def convert_bib_to_markdown(bib_file, output_dir):
    # Leer el archivo .bib
    with open(bib_file, 'r', encoding='utf-8') as f:
        bib_data = f.read()
    
    # Dividir el archivo .bib en entradas (separadas por "@")
    entries = re.split(r'^\s*@', bib_data, flags=re.MULTILINE)[1:]  # Ignorar la primera parte vacía    
    # Crear la carpeta de publicaciones si no existe
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Inicializar un diccionario para contar las publicaciones por año
    year_counters = {}

    # Procesar cada entrada
    for entry in entries:
        # Extraer los campos básicos: author, title, journal, year, volume, pages, url
        fields = {}
        
        for line in entry.splitlines():
            if '=' in line:
                key, value = line.split('=', 1)
                fields[key.strip().lower()] = value.strip().strip('{},')

        # Obtener los datos necesarios
        title = fields.get('title', '').replace("{", "").replace("}", "").replace('"', '')
        authors = fields.get('author', '').replace(' and ', '\n  - ')
        journal = fields.get('journal', '')
        year = fields.get('year', '').strip()
        volume = fields.get('volume', '')
        pages = fields.get('pages', '')
        url = fields.get('url', '#')
        extra = fields.get('extra', '')

        # Asegurarse de que el año esté en el diccionario de contadores
        if year not in year_counters:
            year_counters[year] = 1  # Inicializa el contador para el año

        # Obtener el día basado en el contador para ese año
        day = year_counters[year]
        day_str = f"{day:02d}"  # Formato con dos dígitos (01, 02, 03, etc.)

        # Crear el nombre del archivo basado en el año, enero y el contador de día
        filename = f"{year}-01-{day_str}-{title[:9].replace(' ', '-').lower()}.md"
        filepath = os.path.join(output_dir, filename)

        # Incrementar el contador para ese año
        year_counters[year] += 1

        # Crear el contenido en formato Markdown con el front matter YAML
        md_content = f"""---
layout: publication
title: "{title}"
authors:
  - {authors}
journal: "{journal}"
year: {year}
volume: {volume}
pages: "{pages}"
url: "{url}"
extra: "{extra}"
---

Descripción opcional de la publicación.
"""

        # Escribir el archivo Markdown
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(md_content)

# Convertir el archivo .bib a Markdown
convert_bib_to_markdown('_bibliography/publications.bib', '_publications')
