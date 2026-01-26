// Filter Controller Module
// Handles application of multiple filters to publication data

/**
 * FilterController manages the state and application of all publication filters
 */
export class FilterController {
  constructor() {
    // Initialize filter state
    this.filters = {
      years: {
        min: null,
        max: null,
        active: false
      },
      authors: {
        selected: [],
        active: false
      },
      types: {
        selected: [],
        active: false
      }
    };

    // Statistics for available filter options
    this.availableYears = [];
    this.availableAuthors = [];
    this.availableTypes = [];

    // Track the original unfiltered data
    this.originalData = [];
  }

  /**
   * Get list of group members to display in the author filter dropdown
   * @returns {Array} Array of member names
   */
  getGroupMembers() {
    return [
      // Current group leader
      "Matito, E.",
      // Scientific staff
      "Ramos-Cordoba, E.",
      // Postdocs
      "Casademont-Reig, I.",
      // PhD Students
      "Paulau, A.",
      "Perumali, J.B.",
      "Vila, G.",
      "Domin, J.",
      "Grèbol-Tomàs, J.",
      "Ylla, M.",
      // Master Students
      "Aleson, A.",
      // Former Members
      "Rodríguez-Jiménez, J.A.",
      "Naim, C.",
      "Soriano-Agueda, L.A.",
      "Rodriguez-Mayorga, M.",
      "Orozco-Ic, M.",
      "Via-Nadal, M.",
      "Milev, P.",
      "Ferradás, R.",
      "Sitkiewicz, S.",
      "Escayola, S.",
      "Xu, X."
    ];
  }

  /**
   * Initialize the filter controller with publication data
   * @param {Array} publications - The full list of publications
   */
  initialize(publications) {
    this.originalData = publications;

    // Extract available filter options from the data
    this.extractFilterOptions(publications);

    return this;
  }

  /**
   * Extract available filter options from publication data
   * @param {Array} publications - The publication data
   */
  extractFilterOptions(publications) {
    const years = new Set();
    const authors = new Set();
    const types = new Set();

    // Get list of group members
    const groupMembers = this.getGroupMembers();

    // Track which group members have publications
    const authorHasPublications = {};
    groupMembers.forEach(member => {
      authorHasPublications[member] = false;
    });

    publications.forEach(pub => {
      // Extract years
      if (pub.year) {
        years.add(parseInt(pub.year, 10));
      }

      // Extract authors (only group members)
      if (pub.author) {
        // For each group member, check if they are in this publication
        groupMembers.forEach(member => {
          if (pub.author.includes(member)) {
            authorHasPublications[member] = true;
            authors.add(member);
          }
        });
      }

      // Extract publication types
      if (pub.displayType) {
        types.add(pub.displayType);
      }
    });

    this.availableYears = [...years].sort((a, b) => b - a); // Sort years descending
    this.availableAuthors = [...authors].sort(); // Sort authors alphabetically
    this.availableTypes = [...types].sort(); // Sort types alphabetically
  }

  /**
   * Set year range filter
   * @param {Number|null} min - Minimum year (inclusive)
   * @param {Number|null} max - Maximum year (inclusive)
   */
  setYearFilter(min, max) {
    this.filters.years.min = min;
    this.filters.years.max = max;
    this.filters.years.active = (min !== null || max !== null);

    return this;
  }

  /**
   * Set author filter
   * @param {Array} authors - Array of selected author names
   */
  setAuthorFilter(authors) {
    this.filters.authors.selected = authors || [];
    this.filters.authors.active = Array.isArray(authors) && authors.length > 0;

    return this;
  }

  /**
   * Set publication type filter
   * @param {Array} types - Array of selected publication types
   */
  setTypeFilter(types) {
    this.filters.types.selected = types || [];
    this.filters.types.active = Array.isArray(types) && types.length > 0;

    return this;
  }

  /**
   * Clear all filters
   */
  clearAllFilters() {
    this.filters.years.min = null;
    this.filters.years.max = null;
    this.filters.years.active = false;

    this.filters.authors.selected = [];
    this.filters.authors.active = false;

    this.filters.types.selected = [];
    this.filters.types.active = false;

    return this;
  }

  /**
   * Apply all active filters to the publication data
   * @param {Array} [publications] - Optional publications array to filter (defaults to originalData)
   * @returns {Array} - Filtered publications
   */
  applyFilters(publications = null) {
    const data = publications || this.originalData;
    let filtered = [...data];

    // Apply year filter
    if (this.filters.years.active) {
      filtered = filtered.filter(pub => {
        const year = parseInt(pub.year, 10);
        const minOk = this.filters.years.min === null || year >= this.filters.years.min;
        const maxOk = this.filters.years.max === null || year <= this.filters.years.max;
        return minOk && maxOk;
      });
    }

    // Apply author filter
    if (this.filters.authors.active) {
      filtered = filtered.filter(pub => {
        return this.filters.authors.selected.some(author => {
          return pub.author.includes(author);
        });
      });
    }

    // Apply type filter
    if (this.filters.types.active) {
      filtered = filtered.filter(pub => {
        return this.filters.types.selected.includes(pub.displayType);
      });
    }

    return filtered;
  }

  /**
   * Get all active filters as an object
   * @returns {Object} - Object containing active filters
   */
  getActiveFilters() {
    const active = {};

    if (this.filters.years.active) {
      active.years = {
        min: this.filters.years.min,
        max: this.filters.years.max
      };
    }

    if (this.filters.authors.active) {
      active.authors = [...this.filters.authors.selected];
    }

    if (this.filters.types.active) {
      active.types = [...this.filters.types.selected];
    }

    return active;
  }

  /**
   * Check if any filters are currently active
   * @returns {Boolean} - True if at least one filter is active
   */
  hasActiveFilters() {
    return (
      this.filters.years.active ||
      this.filters.authors.active ||
      this.filters.types.active
    );
  }

  /**
   * Get filter state as URL parameters
   * @returns {URLSearchParams} - URL parameters object
   */
  getFilterParams() {
    const params = new URLSearchParams();

    // Add year parameters if active
    if (this.filters.years.active) {
      if (this.filters.years.min !== null) {
        params.set('year_min', this.filters.years.min);
      }
      if (this.filters.years.max !== null) {
        params.set('year_max', this.filters.years.max);
      }
    }

    // Add author parameters if active
    if (this.filters.authors.active) {
      this.filters.authors.selected.forEach(author => {
        params.append('author', encodeURIComponent(author));
      });
    }

    // Add type parameters if active
    if (this.filters.types.active) {
      this.filters.types.selected.forEach(type => {
        params.append('type', encodeURIComponent(type));
      });
    }

    return params;
  }

  /**
   * Set filters from URL parameters
   * @param {URLSearchParams} params - URL parameters
   */
  setFiltersFromParams(params) {
    // Reset filters
    this.clearAllFilters();

    // Set year filter
    const yearMin = params.get('year_min');
    const yearMax = params.get('year_max');
    if (yearMin || yearMax) {
      this.setYearFilter(
        yearMin ? parseInt(yearMin, 10) : null,
        yearMax ? parseInt(yearMax, 10) : null
      );
    }

    // Set author filter
    const authors = params.getAll('author').map(a => decodeURIComponent(a));
    if (authors.length > 0) {
      this.setAuthorFilter(authors);
    }

    // Set type filter
    const types = params.getAll('type').map(t => decodeURIComponent(t));
    if (types.length > 0) {
      this.setTypeFilter(types);
    }

    return this;
  }
}
