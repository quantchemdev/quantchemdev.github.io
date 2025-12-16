// URL State Manager Module
// Manages URL parameters for filters, search terms, and pagination

/**
 * URLStateManager handles synchronizing application state with URL parameters
 * to enable bookmarking and sharing filtered/searched views
 */
export class URLStateManager {
  constructor() {
    // Initialize with default state
    this.state = {
      page: 1,
      search: '',
      filters: {
        years: { min: null, max: null },
        authors: [],
        types: []
      },
      sort: {
        field: 'year',
        direction: 'desc'
      }
    };
  }

  /**
   * Load state from current URL
   * @returns {Object} The loaded state
   */
  loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    // Get page parameter
    const page = params.get('page');
    this.state.page = page ? parseInt(page, 10) : 1;

    // Handle invalid page number
    if (isNaN(this.state.page) || this.state.page < 1) {
      this.state.page = 1;
    }

    // Get search parameter
    this.state.search = params.get('q') || '';

    // Get year filter parameters
    const yearMin = params.get('year_min');
    const yearMax = params.get('year_max');
    this.state.filters.years = {
      min: yearMin ? parseInt(yearMin, 10) : null,
      max: yearMax ? parseInt(yearMax, 10) : null
    };

    // Get author filter parameters
    this.state.filters.authors = params.getAll('author').map(a => decodeURIComponent(a));

    // Get type filter parameters
    this.state.filters.types = params.getAll('type').map(t => decodeURIComponent(t));

    // Get sort parameters
    const sortField = params.get('sort');
    const sortDir = params.get('dir');
    if (sortField) {
      this.state.sort.field = sortField;
    }
    if (sortDir && (sortDir === 'asc' || sortDir === 'desc')) {
      this.state.sort.direction = sortDir;
    }

    return this.state;
  }

  /**
   * Update URL to match current state
   * @param {Boolean} [replace=false] - Whether to replace or push state
   */
  updateURL(replace = false) {
    const params = new URLSearchParams();

    // Add page parameter if not on first page
    if (this.state.page > 1) {
      params.set('page', this.state.page);
    }

    // Add search parameter if search is active
    if (this.state.search && this.state.search.trim() !== '') {
      params.set('q', this.state.search);
    }

    // Add year filter parameters if active
    if (this.state.filters.years.min !== null) {
      params.set('year_min', this.state.filters.years.min);
    }
    if (this.state.filters.years.max !== null) {
      params.set('year_max', this.state.filters.years.max);
    }

    // Add author filter parameters if active
    this.state.filters.authors.forEach(author => {
      params.append('author', encodeURIComponent(author));
    });

    // Add type filter parameters if active
    this.state.filters.types.forEach(type => {
      params.append('type', encodeURIComponent(type));
    });

    // Add sort parameters if not using defaults
    if (this.state.sort.field !== 'year') {
      params.set('sort', this.state.sort.field);
    }
    if (this.state.sort.direction !== 'desc') {
      params.set('dir', this.state.sort.direction);
    }

    // Create URL string
    const url = params.toString() ? `?${params.toString()}` : window.location.pathname;

    // Update browser history
    if (replace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
  }

  /**
   * Set the current page
   * @param {Number} page - Page number
   */
  setPage(page) {
    this.state.page = page;
    return this;
  }

  /**
   * Set the search term
   * @param {String} term - Search term
   */
  setSearch(term) {
    this.state.search = term || '';
    // Reset page to 1 when search changes
    this.state.page = 1;
    return this;
  }

  /**
   * Set year range filter
   * @param {Number|null} min - Minimum year (inclusive)
   * @param {Number|null} max - Maximum year (inclusive)
   */
  setYearFilter(min, max) {
    this.state.filters.years.min = min;
    this.state.filters.years.max = max;
    // Reset page to 1 when filters change
    this.state.page = 1;
    return this;
  }

  /**
   * Set author filter
   * @param {Array} authors - Array of selected author names
   */
  setAuthorFilter(authors) {
    this.state.filters.authors = authors || [];
    // Reset page to 1 when filters change
    this.state.page = 1;
    return this;
  }

  /**
   * Set publication type filter
   * @param {Array} types - Array of selected publication types
   */
  setTypeFilter(types) {
    this.state.filters.types = types || [];
    // Reset page to 1 when filters change
    this.state.page = 1;
    return this;
  }

  /**
   * Set sort options
   * @param {String} field - Field to sort by (year, title, etc.)
   * @param {String} direction - Sort direction (asc or desc)
   */
  setSort(field, direction) {
    this.state.sort.field = field || 'year';
    this.state.sort.direction = (direction === 'asc') ? 'asc' : 'desc';
    return this;
  }

  /**
   * Clear all filters and search
   */
  clearAll() {
    this.state.search = '';
    this.state.filters.years.min = null;
    this.state.filters.years.max = null;
    this.state.filters.authors = [];
    this.state.filters.types = [];
    this.state.page = 1;
    return this;
  }

  /**
   * Get the current state
   * @returns {Object} The current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Check if any filters or search are active
   * @returns {Boolean} True if any filters or search are active
   */
  hasActiveFiltersOrSearch() {
    return (
      this.state.search !== '' ||
      this.state.filters.years.min !== null ||
      this.state.filters.years.max !== null ||
      this.state.filters.authors.length > 0 ||
      this.state.filters.types.length > 0
    );
  }

  /**
   * Add event listener for browser back/forward navigation
   * @param {Function} callback - Function to call when navigation occurs
   */
  listenForNavigation(callback) {
    if (typeof callback === 'function') {
      window.addEventListener('popstate', () => {
        this.loadFromURL();
        callback(this.state);
      });
    }
  }
}