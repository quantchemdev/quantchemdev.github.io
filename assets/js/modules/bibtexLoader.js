// BibTeX Loader Module
// Handles fetching the BibTeX file from the server

/**
 * Fetches BibTeX data from the specified URL
 *
 * @param {string} url - The URL of the BibTeX file
 * @returns {Promise<string>} - The BibTeX content as text
 * @throws {Error} - If the fetch fails
 */
export async function fetchBibtex(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch BibTeX file: ${response.status} ${response.statusText}`);
    }

    const bibtexText = await response.text();

    if (!bibtexText || bibtexText.trim() === '') {
      throw new Error('BibTeX file is empty');
    }

    return bibtexText;
  } catch (error) {
    console.error('Error fetching BibTeX:', error);
    throw error;
  }
}