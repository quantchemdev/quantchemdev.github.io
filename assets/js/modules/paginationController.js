// Pagination Controller Module
// Handles pagination logic and rendering of pagination controls

/**
 * Get a subset of publications for the current page
 *
 * @param {Array} publications - Full list of publications
 * @param {Number} page - Current page number
 * @param {Number} itemsPerPage - Number of items to show per page
 * @returns {Array} - Subset of publications for the current page
 */
export function paginatePublications(publications, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return publications.slice(startIndex, endIndex);
}

/**
 * Render pagination controls
 *
 * @param {HTMLElement} container - Container element for pagination controls
 * @param {Number} currentPage - Current page number
 * @param {Number} totalPages - Total number of pages
 */
export function renderPagination(container, currentPage, totalPages) {
  if (!container) return;

  container.innerHTML = '';

  // Return if only one page
  if (totalPages <= 1) return;

  // Determine pagination range to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Adjust start if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  // First page button
  const firstButton = document.createElement('a');
  firstButton.innerHTML = '&laquo; First';
  if (currentPage > 1) {
    firstButton.href = `?page=1`;
  } else {
    firstButton.classList.add('disabled');
    firstButton.href = 'javascript:void(0)';
  }
  container.appendChild(firstButton);

  // Previous button
  const prevButton = document.createElement('a');
  prevButton.innerHTML = 'Prev';
  if (currentPage > 1) {
    prevButton.href = `?page=${currentPage - 1}`;
  } else {
    prevButton.classList.add('disabled');
    prevButton.href = 'javascript:void(0)';
  }
  container.appendChild(prevButton);

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement(i === currentPage ? 'span' : 'a');
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLink.classList.add('current');
    } else {
      pageLink.href = `?page=${i}`;
    }
    container.appendChild(pageLink);
  }

  // Next button
  const nextButton = document.createElement('a');
  nextButton.innerHTML = 'Next';
  if (currentPage < totalPages) {
    nextButton.href = `?page=${currentPage + 1}`;
  } else {
    nextButton.classList.add('disabled');
    nextButton.href = 'javascript:void(0)';
  }
  container.appendChild(nextButton);

  // Last page button
  const lastButton = document.createElement('a');
  lastButton.innerHTML = 'Last &raquo;';
  if (currentPage < totalPages) {
    lastButton.href = `?page=${totalPages}`;
  } else {
    lastButton.classList.add('disabled');
    lastButton.href = 'javascript:void(0)';
  }
  container.appendChild(lastButton);
}