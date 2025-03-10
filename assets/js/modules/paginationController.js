// Pagination Controller Module
// Handles pagination logic and rendering of pagination controls

/**
 * Get a subset of publications for the current page
 *
 * @param {Array} publications - Full list of publications (already filtered)
 * @param {Number} page - Current page number
 * @param {Number} itemsPerPage - Number of items to show per page
 * @returns {Object} - Object containing paginated data and metadata
 */
export function paginatePublications(publications, page, itemsPerPage) {
  const totalItems = publications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure page is within valid range
  const validPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    data: publications.slice(startIndex, endIndex),
    metadata: {
      page: validPage,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: itemsPerPage,
      startIndex: startIndex,
      endIndex: endIndex - 1
    }
  };
}

/**
 * Render pagination controls
 *
 * @param {HTMLElement} container - Container element for pagination controls
 * @param {Number} currentPage - Current page number
 * @param {Number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback function when page changes
 * @param {URLSearchParams} [searchParams] - Current URL search parameters to preserve
 */
export function renderPagination(container, currentPage, totalPages, onPageChange, searchParams) {
  if (!container) return;

  // Clear existing pagination controls
  container.innerHTML = '';

  // Return if only one page
  if (totalPages <= 1) {
    container.style.display = 'none';
    return;
  } else {
    container.style.display = 'block';
  }

  // Create pagination info text
  const paginationInfo = document.createElement('div');
  paginationInfo.className = 'pagination-info';
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  container.appendChild(paginationInfo);

  // Determine pagination range to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Adjust start if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  // Create pagination controls wrapper
  const controls = document.createElement('div');
  controls.className = 'pagination-controls-buttons';
  container.appendChild(controls);

  // First page button
  const firstButton = document.createElement('a');
  firstButton.className = 'pagination-button first-page';
  firstButton.innerHTML = '&laquo; First';
  firstButton.setAttribute('aria-label', 'Go to first page');
  if (currentPage > 1) {
    firstButton.href = getPageUrl(1, searchParams);
    firstButton.addEventListener('click', (e) => handlePageClick(e, 1, onPageChange));
  } else {
    firstButton.classList.add('disabled');
    firstButton.setAttribute('aria-disabled', 'true');
    firstButton.href = 'javascript:void(0)';
  }
  controls.appendChild(firstButton);

  // Previous button
  const prevButton = document.createElement('a');
  prevButton.className = 'pagination-button prev-page';
  prevButton.innerHTML = '&lsaquo; Prev';
  prevButton.setAttribute('aria-label', 'Go to previous page');
  if (currentPage > 1) {
    prevButton.href = getPageUrl(currentPage - 1, searchParams);
    prevButton.addEventListener('click', (e) => handlePageClick(e, currentPage - 1, onPageChange));
  } else {
    prevButton.classList.add('disabled');
    prevButton.setAttribute('aria-disabled', 'true');
    prevButton.href = 'javascript:void(0)';
  }
  controls.appendChild(prevButton);

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      // Current page (not a link)
      const currentPageSpan = document.createElement('span');
      currentPageSpan.className = 'pagination-button current';
      currentPageSpan.setAttribute('aria-current', 'page');
      currentPageSpan.textContent = i;
      controls.appendChild(currentPageSpan);
    } else {
      // Other pages (links)
      const pageLink = document.createElement('a');
      pageLink.className = 'pagination-button';
      pageLink.textContent = i;
      pageLink.href = getPageUrl(i, searchParams);
      pageLink.setAttribute('aria-label', `Go to page ${i}`);
      pageLink.addEventListener('click', (e) => handlePageClick(e, i, onPageChange));
      controls.appendChild(pageLink);
    }
  }

  // Next button
  const nextButton = document.createElement('a');
  nextButton.className = 'pagination-button next-page';
  nextButton.innerHTML = 'Next &rsaquo;';
  nextButton.setAttribute('aria-label', 'Go to next page');
  if (currentPage < totalPages) {
    nextButton.href = getPageUrl(currentPage + 1, searchParams);
    nextButton.addEventListener('click', (e) => handlePageClick(e, currentPage + 1, onPageChange));
  } else {
    nextButton.classList.add('disabled');
    nextButton.setAttribute('aria-disabled', 'true');
    nextButton.href = 'javascript:void(0)';
  }
  controls.appendChild(nextButton);

  // Last page button
  const lastButton = document.createElement('a');
  lastButton.className = 'pagination-button last-page';
  lastButton.innerHTML = 'Last &raquo;';
  lastButton.setAttribute('aria-label', 'Go to last page');
  if (currentPage < totalPages) {
    lastButton.href = getPageUrl(totalPages, searchParams);
    lastButton.addEventListener('click', (e) => handlePageClick(e, totalPages, onPageChange));
  } else {
    lastButton.classList.add('disabled');
    lastButton.setAttribute('aria-disabled', 'true');
    lastButton.href = 'javascript:void(0)';
  }
  controls.appendChild(lastButton);
}

/**
 * Generate URL for a specific page while preserving other parameters
 *
 * @param {Number} page - Page number to link to
 * @param {URLSearchParams} [currentParams] - Current URL search parameters
 * @returns {String} - URL with updated page parameter
 */
function getPageUrl(page, currentParams) {
  let params = new URLSearchParams(window.location.search);

  // Use provided params if available
  if (currentParams) {
    params = new URLSearchParams(currentParams.toString());
  }

  // Update or add page parameter
  params.set('page', page);

  return `?${params.toString()}`;
}

/**
 * Handle click on pagination link
 *
 * @param {Event} event - Click event
 * @param {Number} page - Page number clicked
 * @param {Function} onPageChange - Callback function when page changes
 */
function handlePageClick(event, page, onPageChange) {
  // Only prevent default if callback exists
  if (typeof onPageChange === 'function') {
    event.preventDefault();
    onPageChange(page);
  }
}

/**
 * Render result count and active filters
 *
 * @param {HTMLElement} container - Container element
 * @param {Number} resultCount - Number of matching results
 * @param {Object} activeFilters - Active filters object
 * @param {String} searchTerm - Active search term
 * @param {Function} onFilterRemove - Callback when a filter is removed
 * @param {Function} onClearAll - Callback when all filters are cleared
 */
export function renderFilterStatus(container, resultCount, activeFilters, searchTerm, onFilterRemove, onClearAll) {
  if (!container) return;

  // Clear container
  container.innerHTML = '';

  // Create filter status container
  const statusContainer = document.createElement('div');
  statusContainer.className = 'filter-status';

  // Add result count
  const resultCountElem = document.createElement('div');
  resultCountElem.className = 'result-count';
  resultCountElem.textContent = `${resultCount} publication${resultCount !== 1 ? 's' : ''} found`;
  statusContainer.appendChild(resultCountElem);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchTerm ||
    (activeFilters.years && (activeFilters.years.min || activeFilters.years.max)) ||
    (activeFilters.authors && activeFilters.authors.length) ||
    (activeFilters.types && activeFilters.types.length)
  );

  // If no filters active, just show the count
  if (!hasActiveFilters) {
    container.appendChild(statusContainer);
    return;
  }

  // Create active filters container
  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'active-filters';

  // Add title for active filters
  const filtersTitle = document.createElement('span');
  filtersTitle.className = 'active-filters-title';
  filtersTitle.textContent = 'Active filters: ';
  filtersContainer.appendChild(filtersTitle);

  // Add search term tag if active
  if (searchTerm) {
    const searchTag = createFilterTag(`Search: ${searchTerm}`, () => {
      if (onFilterRemove) onFilterRemove('search', null);
    });
    filtersContainer.appendChild(searchTag);
  }

  // Add year filter tags if active
  if (activeFilters.years) {
    if (activeFilters.years.min && activeFilters.years.max) {
      const yearTag = createFilterTag(`Years: ${activeFilters.years.min}-${activeFilters.years.max}`, () => {
        if (onFilterRemove) onFilterRemove('years', null);
      });
      filtersContainer.appendChild(yearTag);
    } else if (activeFilters.years.min) {
      const yearTag = createFilterTag(`Years: ≥ ${activeFilters.years.min}`, () => {
        if (onFilterRemove) onFilterRemove('years', 'min');
      });
      filtersContainer.appendChild(yearTag);
    } else if (activeFilters.years.max) {
      const yearTag = createFilterTag(`Years: ≤ ${activeFilters.years.max}`, () => {
        if (onFilterRemove) onFilterRemove('years', 'max');
      });
      filtersContainer.appendChild(yearTag);
    }
  }

  // Add author filter tags if active
  if (activeFilters.authors && activeFilters.authors.length) {
    activeFilters.authors.forEach(author => {
      const authorTag = createFilterTag(`Author: ${author}`, () => {
        if (onFilterRemove) onFilterRemove('authors', author);
      });
      filtersContainer.appendChild(authorTag);
    });
  }

  // Add type filter tags if active
  if (activeFilters.types && activeFilters.types.length) {
    activeFilters.types.forEach(type => {
      const typeTag = createFilterTag(`Type: ${type}`, () => {
        if (onFilterRemove) onFilterRemove('types', type);
      });
      filtersContainer.appendChild(typeTag);
    });
  }

  // Add clear all button
  if (hasActiveFilters && onClearAll) {
    const clearAllButton = document.createElement('button');
    clearAllButton.className = 'clear-all-filters';
    clearAllButton.textContent = 'Clear all filters';
    clearAllButton.addEventListener('click', onClearAll);
    filtersContainer.appendChild(clearAllButton);
  }

  // Add filters container to main container
  statusContainer.appendChild(filtersContainer);
  container.appendChild(statusContainer);
}

/**
 * Create a filter tag element
 *
 * @param {String} text - Text to display
 * @param {Function} onRemove - Callback when remove button is clicked
 * @returns {HTMLElement} - The filter tag element
 */
function createFilterTag(text, onRemove) {
  const tag = document.createElement('span');
  tag.className = 'filter-tag';

  const tagText = document.createElement('span');
  tagText.className = 'filter-tag-text';
  tagText.textContent = text;
  tag.appendChild(tagText);

  const removeButton = document.createElement('button');
  removeButton.className = 'filter-tag-remove';
  removeButton.innerHTML = '&times;';
  removeButton.setAttribute('aria-label', `Remove filter: ${text}`);
  removeButton.addEventListener('click', onRemove);
  tag.appendChild(removeButton);

  return tag;
}

/**
 * Render empty state message when no publications match filters
 *
 * @param {HTMLElement} container - Container element
 * @param {Boolean} hasActiveFilters - Whether filters are currently active
 */
export function renderEmptyState(container, hasActiveFilters) {
  if (!container) return;

  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';

  if (hasActiveFilters) {
    // No results with filters
    const icon = document.createElement('div');
    icon.className = 'empty-state-icon filter';
    emptyState.appendChild(icon);

    const heading = document.createElement('h3');
    heading.textContent = 'No publications match your filters';
    emptyState.appendChild(heading);

    const message = document.createElement('p');
    message.textContent = 'Try adjusting your search terms or removing some filters to see more results.';
    emptyState.appendChild(message);
  } else {
    // No publications at all
    const icon = document.createElement('div');
    icon.className = 'empty-state-icon empty';
    emptyState.appendChild(icon);

    const heading = document.createElement('h3');
    heading.textContent = 'No publications found';
    emptyState.appendChild(heading);

    const message = document.createElement('p');
    message.textContent = 'There are currently no publications in the database.';
    emptyState.appendChild(message);
  }

  container.innerHTML = '';
  container.appendChild(emptyState);
}