# Función para leer el archivo y dividirlo en bloques por cada entrada
def leer_bibtex(archivo):
    with open(archivo, 'r', encoding='utf-8') as f:
        contenido = f.read()
        
    # Dividimos por las entradas @article
    entradas = contenido.split('@article')
    # El primer elemento será vacío si empieza con @article, lo eliminamos
    if not entradas[0].strip():
        entradas = entradas[1:]
    
    # Agregamos de nuevo el prefijo @article a cada entrada
    entradas = ['@article' + entrada for entrada in entradas]
    return entradas

# Función para escribir el archivo con el orden invertido
def escribir_bibtex(archivo, entradas):
    with open(archivo, 'w', encoding='utf-8') as f:
        # Escribir las entradas en orden inverso
        for entrada in entradas:
            f.write(entrada)

# Archivo de entrada y salida
archivo_bibtex = './publications.bib'

# Leer las entradas del archivo original
entradas = leer_bibtex(archivo_bibtex)

# Invertir el orden de las entradas
entradas_invertidas = entradas[::-1]

# Escribir las entradas invertidas en el archivo
escribir_bibtex(archivo_bibtex, entradas_invertidas)

print("El archivo ha sido reordenado exitosamente.")
