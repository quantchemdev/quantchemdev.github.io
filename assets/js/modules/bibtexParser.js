// BibTeX Parser Module
// Parses BibTeX text into structured JavaScript objects

/**
 * Simplified BibTeX parser that extracts just the needed fields
 *
 * @param {string} bibtexText - The raw BibTeX content
 * @returns {Array} - Array of publication objects
 */
export function parseBibtex(bibtexText) {
  // Split entries with a more robust approach
  const entriesRaw = bibtexText.split('@').filter(entry => entry.trim() !== '');
  const entries = [];

  // Process each entry
  entriesRaw.forEach(entry => {
    try {
      // Extract entry type and key with more robust regex
      const typeMatch = entry.match(/^([a-zA-Z]+){\s*([^,\s]+)/);
      if (!typeMatch) return;

      const [, type, citationKey] = typeMatch;

      // Extract publication number for sorting (pub1, pub2, etc.)
      let pubNum = 0;
      const pubNumMatch = citationKey.match(/pub(\d+)/);
      if (pubNumMatch && pubNumMatch[1]) {
        pubNum = parseInt(pubNumMatch[1], 10);
      }

      // Initialize publication object
      const publication = {
        type: type.toLowerCase(),
        citationKey: citationKey.trim(),
        pubNum: pubNum,
        authors: [] // Will be filled with author strings directly
      };

      // Extract basic fields with simple regex
      const titleMatch = entry.match(/title\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (titleMatch && titleMatch[1]) {
        publication.title = cleanBibtexValue(titleMatch[1]);
      } else {
        publication.title = "Untitled Publication";
      }

      const authorMatch = entry.match(/author\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (authorMatch && authorMatch[1]) {
        publication.author = cleanBibtexValue(authorMatch[1]);
        // Store author string directly, no need for parsing
        publication.authors = publication.author.split(',').map(a => a.trim());
      } else {
        publication.author = "Unknown Authors";
        publication.authors = ["Unknown Authors"];
      }

      // Extract other basic fields
      const journalMatch = entry.match(/journal\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (journalMatch && journalMatch[1]) {
        publication.journal = cleanBibtexValue(journalMatch[1]);
      }

      const yearMatch = entry.match(/year\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (yearMatch && yearMatch[1]) {
        publication.year = cleanBibtexValue(yearMatch[1]);
      }

      const volumeMatch = entry.match(/volume\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (volumeMatch && volumeMatch[1]) {
        publication.volume = cleanBibtexValue(volumeMatch[1]);
      }

      const pagesMatch = entry.match(/pages\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (pagesMatch && pagesMatch[1]) {
        publication.pages = cleanBibtexValue(pagesMatch[1]);
      }

      const urlMatch = entry.match(/url\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/);
      if (urlMatch && urlMatch[1]) {
        publication.url = cleanBibtexValue(urlMatch[1]);
      }

      // Add standardized display type
      publication.displayType = getStandardizedType(publication.type);

      // Format citation string
      formatCitation(publication);

      entries.push(publication);
    } catch (error) {
      console.error('Error parsing BibTeX entry:', error);
    }
  });

  return entries;
}

/**
 * Clean a BibTeX field value by removing special characters and formatting
 *
 * @param {string} value - The raw field value
 * @returns {string} - The cleaned value
 */
function cleanBibtexValue(value) {
  if (!value) return '';

  return value
    .replace(/\\&/g, '&')
    .replace(/\\"a/g, 'ä')
    .replace(/\\"o/g, 'ö')
    .replace(/\\"u/g, 'ü')
    .replace(/\\`a/g, 'à')
    .replace(/\\'e/g, 'é')
    .replace(/\{\\textquotesingle\}/g, "'")
    .replace(/\\-/g, '-')
    .replace(/\\_/g, '_')
    .replace(/\\\$/g, '$')
    .replace(/\\#/g, '#')
    .replace(/\\%/g, '%')
    .replace(/\\\^/g, '^')
    .replace(/\\\\/g, '\\')
    .replace(/\\~/g, '~')
    .replace(/\s+/g, ' ')
    // Remove braces around words (common in BibTeX)
    .replace(/{([^{}]*)}/g, '$1')
    .trim();
}

/**
 * Get standardized publication type
 *
 * @param {string} type - The publication type from BibTeX
 * @returns {string} - Standardized display type
 */
function getStandardizedType(type) {
  const typeMap = {
    'article': 'Journal Article',
    'inbook': 'Book Chapter',
    'incollection': 'Book Chapter',
    'inproceedings': 'Conference Paper',
    'conference': 'Conference Paper',
    'book': 'Book',
    'phdthesis': 'PhD Thesis',
    'mastersthesis': 'Master\'s Thesis',
    'techreport': 'Technical Report'
  };

  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Format citation string for display
 *
 * @param {Object} publication - The publication object
 */
function formatCitation(publication) {
  if (publication.type === 'article') {
    publication.citation = [
      publication.journal ? `<i>${publication.journal}</i>` : '',
      publication.year ? `<b>${publication.year}</b>` : '',
      publication.volume ? `<i>${publication.volume}</i>` : '',
      publication.pages ? `${publication.pages}` : ''
    ].filter(Boolean).join(', ');
  } else if (publication.type === 'inbook' || publication.type === 'incollection') {
    publication.citation = [
      publication.booktitle ? `In: <i>${publication.booktitle}</i>` : '',
      publication.publisher ? `${publication.publisher}` : '',
      publication.year ? `<b>${publication.year}</b>` : '',
      publication.pages ? `pp. ${publication.pages}` : ''
    ].filter(Boolean).join(', ');
  } else {
    // Default format for other types
    publication.citation = [
      publication.journal || publication.booktitle ? `<i>${publication.journal || publication.booktitle}</i>` : '',
      publication.year ? `<b>${publication.year}</b>` : '',
      publication.volume ? `<i>${publication.volume}</i>` : '',
      publication.pages ? `${publication.pages}` : ''
    ].filter(Boolean).join(', ');
  }
}