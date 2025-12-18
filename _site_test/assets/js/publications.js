// Main publications module
// This file initializes the publications system and coordinates the components

import { fetchBibtex } from './modules/bibtexLoader.js';
import { parseBibtex } from './modules/bibtexParser.js';
import { renderPublications, calculatePublicationCountsByYear } from './modules/publicationRenderer.js';
import { paginatePublications, renderPagination, renderFilterStatus, renderEmptyState } from './modules/paginationController.js';
import { FilterController } from './modules/filterController.js';
import { SearchController } from './modules/searchController.js';
import { URLStateManager } from './modules/urlStateManager.js';

// Configuration options
const config = {
  bibtexUrl: '/assets/publications.bib', // Path to your BibTeX file
  containerSelector: '#publications-container', // Where to render publications
  paginationSelector: '.pagination-controls', // Where to render pagination controls
  filterStatusSelector: '.filter-status-container', // Where to render filter status
  filterFormSelector: '#publication-filters', // Filter form element
  searchInputSelector: '#publication-search', // Search input element
  yearFilterSelector: '#year-filter', // Year filter element
  authorFilterSelector: '#author-filter', // Author filter element
  typeFilterSelector: '#type-filter', // Type filter element
  sortSelector: '#sort-option', // Sort options element
  clearFiltersSelector: '#clear-filters', // Clear filters button
  itemsPerPage: 10, // Number of publications per page
};

// Global state
let allPublications = [];
let filteredPublications = [];
let currentPage = 1;

// Initialize controllers
const filterController = new FilterController();
const searchController = new SearchController();
const urlManager = new URLStateManager();

// Initialize the publications system
async function initPublications() {
  try {
    // Setup containers & UI elements
    setupDOMElements();

    // Load state from URL
    const state = urlManager.loadFromURL();
    currentPage = state.page;

    // Show loading state
    const container = document.querySelector(config.containerSelector);
    if (!container) {
      console.error('Publications container not found:', config.containerSelector);
      return;
    }

    container.innerHTML = '<div class="loading-indicator">Loading publications...</div>';

    // Fetch the BibTeX data
    const bibtexData = await fetchBibtex(config.bibtexUrl);

    // Parse the BibTeX data
    allPublications = parseBibtex(bibtexData);

    // Initialize controllers with data
    filterController.initialize(allPublications);
    searchController.initialize(allPublications);

    // Set initial controller states from URL
    updateControllerStatesFromURL(state);

    // Update UI filter elements based on available options
    updateFilterUI();

    // Apply filters & search to get the filtered data
    applyFiltersAndSearch();

    // Setup event listeners
    setupEventListeners();

    // Listen for browser navigation events
    urlManager.listenForNavigation((newState) => {
      // Update controller states when user navigates back/forward
      updateControllerStatesFromURL(newState);
      applyFiltersAndSearch();
      updateFilterUI();
    });

  } catch (error) {
    console.error('Error initializing publications:', error);
    const container = document.querySelector(config.containerSelector);
    if (container) {
      container.innerHTML = '<p class="error-message">Error loading publications. Please try again later.</p>';
    }
  }
}

/**
 * Set up DOM elements needed for the publications system
 */
function setupDOMElements() {
  // Publication container should already exist
  const container = document.querySelector(config.containerSelector);
  if (!container) {
    console.error('Publications container not found');
    return;
  }

  // Create filter status container if it doesn't exist
  let filterStatus = document.querySelector(config.filterStatusSelector);
  if (!filterStatus) {
    filterStatus = document.createElement('div');
    filterStatus.className = 'filter-status-container';
    container.parentNode.insertBefore(filterStatus, container);
  }

  // Create filter form if it doesn't exist
  let filterForm = document.querySelector(config.filterFormSelector);
  if (!filterForm) {
    filterForm = document.createElement('form');
    filterForm.id = 'publication-filters';
    filterForm.className = 'publication-filters';
    filterForm.innerHTML = `
      <div class="filter-row search-row">
        <div class="filter-group">
          <label for="publication-search">Search publications:</label>
          <input type="text" id="publication-search" placeholder="Search by title, author, etc." />
        </div>
      </div>
      <div class="filter-row">
        <div class="filter-group">
          <label for="year-filter">Year Range:</label>
          <div class="year-filter-container">
            <select id="year-filter-min" aria-label="Minimum year">
              <option value="">From (any)</option>
            </select>
            <span class="year-filter-separator">-</span>
            <select id="year-filter-max" aria-label="Maximum year">
              <option value="">To (any)</option>
            </select>
          </div>
        </div>
        <div class="filter-group">
          <label for="type-filter">Publication Type:</label>
          <select id="type-filter" multiple aria-label="Filter by publication type">
            <!-- Will be filled dynamically -->
          </select>
        </div>
        <div class="filter-group">
          <label for="sort-option">Sort by:</label>
          <select id="sort-option" aria-label="Sort publications">
            <option value="date|desc">Date (newest first)</option>
            <option value="date|asc">Date (oldest first)</option>
            <option value="title|asc">Title (A-Z)</option>
            <option value="title|desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button type="button" id="clear-filters" class="clear-filters-button">Clear Filters</button>
      </div>
    `;
    container.parentNode.insertBefore(filterForm, container);
  }

  // Create pagination container if it doesn't exist
  let pagination = document.querySelector(config.paginationSelector);
  if (!pagination) {
    pagination = document.createElement('div');
    pagination.className = 'pagination-controls';
    container.parentNode.insertBefore(pagination, container.nextSibling);
  }
}

/**
 * Update filter UI elements with options from available data
 */
function updateFilterUI() {
  // Update year filter options
  const yearMinSelect = document.querySelector('#year-filter-min');
  const yearMaxSelect = document.querySelector('#year-filter-max');

  if (yearMinSelect && yearMaxSelect) {
    // Keep selected values
    const selectedYearMin = yearMinSelect.value;
    const selectedYearMax = yearMaxSelect.value;

    // Clear existing options except the first one
    while (yearMinSelect.options.length > 1) yearMinSelect.remove(1);
    while (yearMaxSelect.options.length > 1) yearMaxSelect.remove(1);

    // Add year options
    filterController.availableYears.forEach(year => {
      const minOption = document.createElement('option');
      minOption.value = year;
      minOption.textContent = year;
      yearMinSelect.appendChild(minOption);

      const maxOption = document.createElement('option');
      maxOption.value = year;
      maxOption.textContent = year;
      yearMaxSelect.appendChild(maxOption);
    });

    // Restore selected values
    if (filterController.filters.years.min !== null) {
      yearMinSelect.value = filterController.filters.years.min;
    } else if (selectedYearMin) {
      yearMinSelect.value = selectedYearMin;
    }

    if (filterController.filters.years.max !== null) {
      yearMaxSelect.value = filterController.filters.years.max;
    } else if (selectedYearMax) {
      yearMaxSelect.value = selectedYearMax;
    }
  }

  // Update author filter options
  const authorSelect = document.querySelector('#author-filter');
  if (authorSelect) {
    // Keep track of selected values
    const selectedAuthors = Array.from(authorSelect.selectedOptions).map(option => option.value);

    // Clear existing options
    authorSelect.innerHTML = '';

    // Add author options
    filterController.availableAuthors.forEach(author => {
      const option = document.createElement('option');
      option.value = author;
      option.textContent = author;
      option.selected = filterController.filters.authors.selected.includes(author) ||
                        selectedAuthors.includes(author);
      authorSelect.appendChild(option);
    });
  }

  // Update type filter options
  const typeSelect = document.querySelector('#type-filter');
  if (typeSelect) {
    // Keep track of selected values
    const selectedTypes = Array.from(typeSelect.selectedOptions).map(option => option.value);

    // Clear existing options
    typeSelect.innerHTML = '';

    // Add type options
    filterController.availableTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      option.selected = filterController.filters.types.selected.includes(type) ||
                        selectedTypes.includes(type);
      typeSelect.appendChild(option);
    });
  }

  // Update search input
  const searchInput = document.querySelector('#publication-search');
  if (searchInput) {
    searchInput.value = searchController.getSearchTerm();
  }

  // Update sort select
  const sortSelect = document.querySelector('#sort-option');
  if (sortSelect) {
    const currentState = urlManager.getState();
    const sortValue = `${currentState.sort.field}|${currentState.sort.direction}`;

    // Check if this value exists in the options
    const optionExists = Array.from(sortSelect.options).some(option => option.value === sortValue);

    if (optionExists) {
      sortSelect.value = sortValue;
    }
  }
}

/**
 * Apply search and filters to get filtered publication list
 */
function applyFiltersAndSearch() {
  // Apply search first
  let filtered = searchController.applySearch(allPublications);

  // Then apply filters to search results
  filtered = filterController.applyFilters(filtered);

  // Save the filtered results
  filteredPublications = filtered;

  // Sort the filtered results
  const state = urlManager.getState();
  sortPublications(state.sort.field, state.sort.direction);

  // Render the results
  renderResults();
}

/**
 * Sort publications by the specified field and direction
 *
 * @param {String} field - Field to sort by
 * @param {String} direction - Sort direction (asc or desc)
 */
function sortPublications(field, direction) {
  // For sorting by publication ID (pubNum)
  if (field === 'date') {
    filteredPublications.sort((a, b) => {
      const pubNumA = a.pubNum || 0;
      const pubNumB = b.pubNum || 0;
      return direction === 'asc' ? pubNumA - pubNumB : pubNumB - pubNumA;
    });
    return;
  }

  // For sorting by title
  if (field === 'title') {
    filteredPublications.sort((a, b) => {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();

      if (titleA < titleB) return direction === 'asc' ? -1 : 1;
      if (titleA > titleB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return;
  }

  // Default sort by pubNum
  filteredPublications.sort((a, b) => {
    const pubNumA = a.pubNum || 0;
    const pubNumB = b.pubNum || 0;
    return direction === 'asc' ? pubNumA - pubNumB : pubNumB - pubNumA;
  });
}

/**
 * Setup event listeners for form elements
 */
function setupEventListeners() {
  // Year filter change events
  const yearMinSelect = document.querySelector('#year-filter-min');
  const yearMaxSelect = document.querySelector('#year-filter-max');

  if (yearMinSelect && yearMaxSelect) {
    yearMinSelect.addEventListener('change', () => {
      const min = yearMinSelect.value ? parseInt(yearMinSelect.value, 10) : null;
      const max = yearMaxSelect.value ? parseInt(yearMaxSelect.value, 10) : null;

      filterController.setYearFilter(min, max);
      urlManager.setYearFilter(min, max);
      urlManager.updateURL(true);

      applyFiltersAndSearch();
    });

    yearMaxSelect.addEventListener('change', () => {
      const min = yearMinSelect.value ? parseInt(yearMinSelect.value, 10) : null;
      const max = yearMaxSelect.value ? parseInt(yearMaxSelect.value, 10) : null;

      filterController.setYearFilter(min, max);
      urlManager.setYearFilter(min, max);
      urlManager.updateURL(true);

      applyFiltersAndSearch();
    });
  }

  // Author filter change event
  const authorSelect = document.querySelector('#author-filter');
  if (authorSelect) {
    authorSelect.addEventListener('change', () => {
      const selectedAuthors = Array.from(authorSelect.selectedOptions).map(option => option.value);

      filterController.setAuthorFilter(selectedAuthors);
      urlManager.setAuthorFilter(selectedAuthors);
      urlManager.updateURL(true);

      applyFiltersAndSearch();
    });
  }

  // Type filter change event
  const typeSelect = document.querySelector('#type-filter');
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      const selectedTypes = Array.from(typeSelect.selectedOptions).map(option => option.value);

      filterController.setTypeFilter(selectedTypes);
      urlManager.setTypeFilter(selectedTypes);
      urlManager.updateURL(true);

      applyFiltersAndSearch();
    });
  }

  // Search input events
  const searchInput = document.querySelector('#publication-search');
  if (searchInput) {
    // Search on input after short delay
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = searchInput.value.trim();

        searchController.setSearchTerm(searchTerm);
        urlManager.setSearch(searchTerm);
        urlManager.updateURL(true);

        applyFiltersAndSearch();
      }, 300); // 300ms delay to avoid too many updates while typing
    });

    // Search on Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        searchController.setSearchTerm(searchTerm);
        urlManager.setSearch(searchTerm);
        urlManager.updateURL(true);

        applyFiltersAndSearch();
      }
    });
  }

  // Sort change event
  const sortSelect = document.querySelector('#sort-option');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const [field, direction] = sortSelect.value.split('|');

      urlManager.setSort(field, direction);
      urlManager.updateURL(true);

      sortPublications(field, direction);
      renderResults();
    });
  }

  // Clear filters button
  const clearButton = document.querySelector('#clear-filters');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      // Clear controllers
      filterController.clearAllFilters();
      searchController.setSearchTerm('');

      // Clear URL
      urlManager.clearAll();
      urlManager.updateURL(true);

      // Reset form elements
      if (searchInput) searchInput.value = '';
      if (yearMinSelect) yearMinSelect.value = '';
      if (yearMaxSelect) yearMaxSelect.value = '';
      if (authorSelect) {
        Array.from(authorSelect.options).forEach(option => option.selected = false);
      }
      if (typeSelect) {
        Array.from(typeSelect.options).forEach(option => option.selected = false);
      }

      // Reset sort to default - using 'date' field consistently
      if (sortSelect) sortSelect.value = 'date|desc';

      // Reapply empty filters
      applyFiltersAndSearch();
    });
  }
}

/**
 * Update controller states from URL parameters
 *
 * @param {Object} state - URL state object
 */
function updateControllerStatesFromURL(state) {
  // Update search controller
  searchController.setSearchTerm(state.search);

  // Update filter controller
  filterController.setYearFilter(state.filters.years?.min || null, state.filters.years?.max || null);
  filterController.setAuthorFilter(state.filters.authors || []);
  filterController.setTypeFilter(state.filters.types || []);
}

/**
 * Render publications, pagination, and filter status
 */
function renderResults() {
  const container = document.querySelector(config.containerSelector);
  const paginationContainer = document.querySelector(config.paginationSelector);
  const filterStatusContainer = document.querySelector(config.filterStatusSelector);

  if (!container) return;

  // Get year counts from original data for context
  const publicationCountsByYear = calculatePublicationCountsByYear(allPublications);

  // Check if we have any publications after filtering
  if (filteredPublications.length === 0) {
    // Render empty state
    renderEmptyState(
      container,
      filterController.hasActiveFilters() || searchController.isSearchActive()
    );

    // Hide pagination
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }

    // Still show filter status
    if (filterStatusContainer) {
      renderFilterStatus(
        filterStatusContainer,
        0,
        filterController.getActiveFilters(),
        searchController.getSearchTerm(),
        handleFilterRemove,
        handleClearAllFilters
      );
    }

    return;
  }

  // Get the current page of publications
  const paginationResult = paginatePublications(
    filteredPublications,
    currentPage,
    config.itemsPerPage
  );

  // Update current page if it was adjusted
  if (paginationResult.metadata.page !== currentPage) {
    currentPage = paginationResult.metadata.page;
    urlManager.setPage(currentPage);
    urlManager.updateURL(true);
  }

  // Render publications for current page
  renderPublications(paginationResult.data, container, {
    searchTerm: searchController.getSearchTerm(),
    filterCounts: publicationCountsByYear,
    highlightSearchTerms: (text) => searchController.highlightSearchTerms(text)
  });

  // Render pagination controls
  if (paginationContainer) {
    renderPagination(
      paginationContainer,
      paginationResult.metadata.page,
      paginationResult.metadata.totalPages,
      handlePageChange
    );
  }

  // Render filter status
  if (filterStatusContainer) {
    renderFilterStatus(
      filterStatusContainer,
      filteredPublications.length,
      filterController.getActiveFilters(),
      searchController.getSearchTerm(),
      handleFilterRemove,
      handleClearAllFilters
    );
  }
}

/**
 * Handle pagination page change
 *
 * @param {Number} page - New page number
 */
function handlePageChange(page) {
  currentPage = page;
  urlManager.setPage(page);
  urlManager.updateURL(true);

  renderResults();

  // Scroll to top of publications container
  const container = document.querySelector(config.containerSelector);
  if (container) {
    container.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Handle removing a specific filter
 *
 * @param {String} filterType - Type of filter to remove (search, years, authors, types)
 * @param {String|null} value - Specific value to remove (null to remove entire filter type)
 */
function handleFilterRemove(filterType, value) {
  // Handle each filter type
  switch (filterType) {
    case 'search':
      // Clear search
      searchController.setSearchTerm('');
      urlManager.setSearch('');

      // Update search input
      const searchInput = document.querySelector('#publication-search');
      if (searchInput) {
        searchInput.value = '';
      }
      break;

    case 'years':
      // Clear year filter (either completely or just min/max)
      if (value === null) {
        // Clear both min and max
        filterController.setYearFilter(null, null);
        urlManager.setYearFilter(null, null);

        // Update year select inputs
        const yearMinSelect = document.querySelector('#year-filter-min');
        const yearMaxSelect = document.querySelector('#year-filter-max');
        if (yearMinSelect) yearMinSelect.value = '';
        if (yearMaxSelect) yearMaxSelect.value = '';
      } else if (value === 'min') {
        // Clear just min year
        const yearMaxSelect = document.querySelector('#year-filter-max');
        const maxYear = yearMaxSelect ? yearMaxSelect.value : null;

        filterController.setYearFilter(null, maxYear ? parseInt(maxYear, 10) : null);
        urlManager.setYearFilter(null, maxYear ? parseInt(maxYear, 10) : null);

        // Update min year select
        const yearMinSelect = document.querySelector('#year-filter-min');
        if (yearMinSelect) yearMinSelect.value = '';
      } else if (value === 'max') {
        // Clear just max year
        const yearMinSelect = document.querySelector('#year-filter-min');
        const minYear = yearMinSelect ? yearMinSelect.value : null;

        filterController.setYearFilter(minYear ? parseInt(minYear, 10) : null, null);
        urlManager.setYearFilter(minYear ? parseInt(minYear, 10) : null, null);

        // Update max year select
        const yearMaxSelect = document.querySelector('#year-filter-max');
        if (yearMaxSelect) yearMaxSelect.value = '';
      }
      break;

    case 'authors':
      // Remove specific author or all authors
      if (value === null) {
        // Clear all authors
        filterController.setAuthorFilter([]);
        urlManager.setAuthorFilter([]);

        // Update author select
        const authorSelect = document.querySelector('#author-filter');
        if (authorSelect) {
          Array.from(authorSelect.options).forEach(option => {
            option.selected = false;
          });
        }
      } else {
        // Remove specific author
        const updatedAuthors = filterController.filters.authors.selected.filter(
          author => author !== value
        );

        filterController.setAuthorFilter(updatedAuthors);
        urlManager.setAuthorFilter(updatedAuthors);

        // Update author select
        const authorSelect = document.querySelector('#author-filter');
        if (authorSelect) {
          Array.from(authorSelect.options).forEach(option => {
            if (option.value === value) {
              option.selected = false;
            }
          });
        }
      }
      break;

    case 'types':
      // Remove specific type or all types
      if (value === null) {
        // Clear all types
        filterController.setTypeFilter([]);
        urlManager.setTypeFilter([]);

        // Update type select
        const typeSelect = document.querySelector('#type-filter');
        if (typeSelect) {
          Array.from(typeSelect.options).forEach(option => {
            option.selected = false;
          });
        }
      } else {
        // Remove specific type
        const updatedTypes = filterController.filters.types.selected.filter(
          type => type !== value
        );

        filterController.setTypeFilter(updatedTypes);
        urlManager.setTypeFilter(updatedTypes);

        // Update type select
        const typeSelect = document.querySelector('#type-filter');
        if (typeSelect) {
          Array.from(typeSelect.options).forEach(option => {
            if (option.value === value) {
              option.selected = false;
            }
          });
        }
      }
      break;
  }

  // Update URL and reapply filters
  urlManager.updateURL(true);
  applyFiltersAndSearch();
}

/**
 * Handle clearing all filters
 */
function handleClearAllFilters() {
  // Clear controllers
  filterController.clearAllFilters();
  searchController.setSearchTerm('');

  // Clear URL
  urlManager.clearAll();
  urlManager.updateURL(true);

  // Reset form elements
  const searchInput = document.querySelector('#publication-search');
  const yearMinSelect = document.querySelector('#year-filter-min');
  const yearMaxSelect = document.querySelector('#year-filter-max');
  const authorSelect = document.querySelector('#author-filter');
  const typeSelect = document.querySelector('#type-filter');

  if (searchInput) searchInput.value = '';
  if (yearMinSelect) yearMinSelect.value = '';
  if (yearMaxSelect) yearMaxSelect.value = '';

  if (authorSelect) {
    Array.from(authorSelect.options).forEach(option => {
      option.selected = false;
    });
  }

  if (typeSelect) {
    Array.from(typeSelect.options).forEach(option => {
      option.selected = false;
    });
  }

  // Reapply empty filters
  applyFiltersAndSearch();
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPublications);

// Export functions for potential external use
export {
  initPublications,
  applyFiltersAndSearch,
  sortPublications
};