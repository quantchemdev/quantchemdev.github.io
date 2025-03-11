// Search Controller Module
// Handles text-based search functionality for publications

/**
 * SearchController manages text search across publications
 */
export class SearchController {
  constructor() {
    this.searchTerm = '';
    this.searchFields = ['title', 'abstract', 'author', 'journal', 'booktitle'];
    this.originalData = [];
  }

  /**
   * Initialize the search controller with publication data
   * @param {Array} publications - The full list of publications
   */
  initialize(publications) {
    this.originalData = publications;
    return this;
  }

  /**
   * Set the search term
   * @param {String} term - The search term to set
   */
  setSearchTerm(term) {
    this.searchTerm = (term || '').trim().toLowerCase();
    return this;
  }

  /**
   * Get the current search term
   * @returns {String} - The current search term
   */
  getSearchTerm() {
    return this.searchTerm;
  }

  /**
   * Check if search is active (has a non-empty search term)
   * @returns {Boolean} - True if search is active
   */
  isSearchActive() {
    return this.searchTerm !== '';
  }

  /**
   * Apply search to publication data
   * @param {Array} [publications] - Optional publications array to search (defaults to originalData)
   * @returns {Array} - Publications matching the search term
   */
  applySearch(publications = null) {
    const data = publications || this.originalData;

    // If no search term, return all publications
    if (!this.isSearchActive()) {
      return data;
    }

    // Split search term into individual words for better matching
    const searchWords = this.searchTerm.split(/\s+/).filter(word => word.length > 0);

    return data.filter(pub => {
      // Check if publication matches all search words
      return searchWords.every(word => {
        // Check if any searchable field contains the word
        return this.matchesSearchTerm(pub, word);
      });
    });
  }

  /**
   * Check if a publication matches a single search word
   * @param {Object} publication - Publication object
   * @param {String} searchWord - Single search word
   * @returns {Boolean} - True if publication matches the search word
   */
  matchesSearchTerm(publication, searchWord) {
    // Check title
    if (publication.title && publication.title.toLowerCase().includes(searchWord)) {
      return true;
    }

    // Check abstract
    if (publication.abstract && publication.abstract.toLowerCase().includes(searchWord)) {
      return true;
    }

    // Check formatted authors string
    if (publication.formattedAuthors &&
        publication.formattedAuthors.toLowerCase().includes(searchWord)) {
      return true;
    }

    // Check raw author string
    if (publication.author && publication.author.toLowerCase().includes(searchWord)) {
      return true;
    }

    // Check individual authors
    if (publication.authors && Array.isArray(publication.authors)) {
      const authorMatch = publication.authors.some(author => {
        const fullName = `${author.lastName} ${author.firstName}`.toLowerCase();
        return fullName.includes(searchWord);
      });
      if (authorMatch) return true;
    }

    // Check journal name
    if (publication.journal && publication.journal.toLowerCase().includes(searchWord)) {
      return true;
    }

    // Check book title or conference name
    if (publication.booktitle && publication.booktitle.toLowerCase().includes(searchWord)) {
      return true;
    }

    // Check publication type
    if (publication.displayType && publication.displayType.toLowerCase().includes(searchWord)) {
      return true;
    }

    // No match found
    return false;
  }

  /**
   * Highlight search terms in a text string
   * @param {String} text - Original text
   * @returns {String} - Text with search terms highlighted using <mark> tags
   */
  highlightSearchTerms(text) {
    if (!text || !this.isSearchActive()) {
      return text;
    }

    // Escape special characters in search term for regex
    const searchWords = this.searchTerm
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (searchWords.length === 0) {
      return text;
    }

    // Create regex pattern for all search words with word boundaries
    const pattern = new RegExp(`(${searchWords.join('|')})`, 'gi');

    // Replace matches with highlighted version
    return text.replace(pattern, '<mark>$1</mark>');
  }

  /**
   * Get search state as URL parameters
   * @returns {URLSearchParams} - URL parameters object
   */
  getSearchParams() {
    const params = new URLSearchParams();

    if (this.isSearchActive()) {
      params.set('q', this.searchTerm);
    }

    return params;
  }

  /**
   * Set search from URL parameters
   * @param {URLSearchParams} params - URL parameters
   */
  setSearchFromParams(params) {
    const searchTerm = params.get('q');
    if (searchTerm) {
      this.setSearchTerm(searchTerm);
    } else {
      this.setSearchTerm('');
    }

    return this;
  }
}