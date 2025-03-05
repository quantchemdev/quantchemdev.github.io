// BibTeX Parser Module
// Parses BibTeX text into structured JavaScript objects

/**
 * Basic BibTeX parser
 * Note: In a production environment, you would likely use a library like citation.js
 * This is a simplified version to demonstrate the concept
 *
 * @param {string} bibtexText - The raw BibTeX content
 * @returns {Array} - Array of publication objects
 */
export function parseBibtex(bibtexText) {
  // Split entries (this is a simplified approach)
  const entries = bibtexText.split('@').filter(entry => entry.trim() !== '');

  // Parse each entry
  return entries.map(entry => {
    try {
      // Extract entry type and key
      const typeMatch = entry.match(/^([a-zA-Z]+){\s*([^,]+)/);
      if (!typeMatch) return null;

      const [, type, citationKey] = typeMatch;

      // Initialize publication object
      const publication = {
        type: type.toLowerCase(),
        citationKey,
        raw: entry,
      };

      // Extract fields
      const fieldsText = entry.substring(entry.indexOf('{') + 1);
      const fieldMatches = [...fieldsText.matchAll(/\s*([a-zA-Z]+)\s*=\s*{([^{}]*(({[^{}]*})[^{}]*)*)}/g)];

      fieldMatches.forEach(match => {
        const [, field, value] = match;
        publication[field.toLowerCase()] = cleanBibtexValue(value);
      });

      // Format authors for display
      if (publication.author) {
        publication.formattedAuthors = formatAuthors(publication.author);
      }

      return publication;
    } catch (error) {
      console.error('Error parsing BibTeX entry:', error, entry);
      return null;
    }
  }).filter(entry => entry !== null);
}

/**
 * Clean a BibTeX field value by removing special characters and formatting
 *
 * @param {string} value - The raw field value
 * @returns {string} - The cleaned value
 */
function cleanBibtexValue(value) {
  return value
    .replace(/\\&/g, '&')
    .replace(/\\"a/g, 'ä')
    .replace(/\\"o/g, 'ö')
    .replace(/\\"u/g, 'ü')
    .replace(/\\`a/g, 'à')
    .replace(/\\'e/g, 'é')
    .replace(/\{\\textquotesingle\}/g, "'")
    .replace(/[{}]/g, '')
    .trim();
}

/**
 * Format authors string into a more readable format
 *
 * @param {string} authors - Raw author string from BibTeX
 * @returns {string} - Formatted author string
 */
function formatAuthors(authors) {
  return authors
    .split(' and ')
    .map(author => author.trim())
    .join(', ');
}