// Publication Renderer Module
// Renders publication objects to HTML with year groupings and search highlighting

/**
 * Renders a list of publications into the specified container
 * with grouping by year and optional search term highlighting
 *
 * @param {Array} publications - Array of publication objects
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} options - Rendering options
 * @param {String} [options.searchTerm] - Current search term for highlighting
 * @param {Object} [options.filterCounts] - Counts of publications by year for filter context
 * @param {Function} [options.highlightSearchTerms] - Function to highlight search terms
 */
export function renderPublications(publications, container, options = {}) {
  // Default options
  const opts = {
    searchTerm: '',
    filterCounts: null,
    highlightSearchTerms: null,
    ...options
  };

  // Clear the container
  container.innerHTML = '';

  // If no publications, show a message
  if (!publications || publications.length === 0) {
    return;
  }

  // Group publications by year
  const publicationsByYear = groupPublicationsByYear(publications);

  // Get years in descending order
  const years = Object.keys(publicationsByYear).sort((a, b) => b - a);

  // Create a container for all years
  const allYearsContainer = document.createElement('div');
  allYearsContainer.className = 'publications-by-year';

  // Create sections for each year
  years.forEach(year => {
    const yearPublications = publicationsByYear[year];

    // Create year section
    const yearSection = document.createElement('div');
    yearSection.className = 'year-section';
    yearSection.id = `publications-${year}`;

    // Add year heading with count
    const yearHeading = document.createElement('h3');
    yearHeading.className = 'year-heading';

    // Just show the year without any count
    yearHeading.textContent = year;

    yearSection.appendChild(yearHeading);

    // Create publication list for this year
    const yearList = document.createElement('ul');
/**
 * Create an HTML element for a single publication
 *
 * @param {Object} publication - Publication object
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} - List item element for the publication
 */
function createPublicationElement(publication, options) {
  const listItem = document.createElement('li');
  listItem.className = `publication-item ${publication.type}`;
  listItem.setAttribute('data-pub-id', publication.citationKey || '');
  listItem.setAttribute('data-pub-type', publication.type || '');
  listItem.setAttribute('data-pub-year', publication.year || '');

  // Create the publication box
  const publicationBox = document.createElement('div');
  publicationBox.className = 'publication-box';

  // Create the title link
  const titleLink = document.createElement('a');
  titleLink.href = publication.url || '#';
  titleLink.className = 'publication-title';
  if (publication.url) {
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
  }

  const titleBold = document.createElement('b');
  // Apply search term highlighting if available
  if (options.highlightSearchTerms && typeof options.highlightSearchTerms === 'function') {
    titleBold.innerHTML = options.highlightSearchTerms(publication.title || 'Untitled Publication');
  } else {
    titleBold.textContent = publication.title || 'Untitled Publication';
  }
  titleLink.appendChild(titleBold);

  // Create the author span
  const authorSpan = document.createElement('span');
  authorSpan.className = 'publication-authors';

  // Apply search term highlighting if available
  if (options.highlightSearchTerms && typeof options.highlightSearchTerms === 'function') {
    authorSpan.innerHTML = options.highlightSearchTerms(publication.author || 'Unknown Authors');
  } else {
    authorSpan.textContent = publication.author || 'Unknown Authors';
  }

  // Create the details span
  const detailsSpan = document.createElement('span');
  detailsSpan.className = 'publication-details';

  // Apply search term highlighting if available on aspects of the citation that don't have HTML already
  if (options.highlightSearchTerms && typeof options.highlightSearchTerms === 'function' && publication.citation) {
    detailsSpan.innerHTML = publication.citation;
  } else {
    detailsSpan.innerHTML = publication.citation || '';
  }

  // Create a container for additional info (notes, links)
  const additionalInfo = document.createElement('div');
  additionalInfo.className = 'publication-additional-info';

  // Add notes if present
  if (publication.note && publication.note.trim() !== '') {
    const noteSpan = document.createElement('span');
    noteSpan.className = 'publication-note';

    // Apply search term highlighting if available
    if (options.highlightSearchTerms && typeof options.highlightSearchTerms === 'function') {
      noteSpan.innerHTML = `(${options.highlightSearchTerms(publication.note)})`;
    } else {
      noteSpan.textContent = `(${publication.note})`;
    }

    additionalInfo.appendChild(noteSpan);
  }

  // Add publication type badge - only if it's not a standard article
  if (publication.displayType && publication.displayType !== 'Journal Article') {
    const typeBadge = document.createElement('span');
    typeBadge.className = `publication-type-badge ${publication.type}`;
    typeBadge.textContent = publication.displayType;
    publicationBox.appendChild(typeBadge);
  }

  // Assemble the publication box
  publicationBox.appendChild(titleLink);
  publicationBox.appendChild(document.createElement('br'));
  publicationBox.appendChild(authorSpan);
  publicationBox.appendChild(document.createElement('br'));
  publicationBox.appendChild(detailsSpan);

  // Add additional info if any exists
  if (additionalInfo.childNodes.length > 0) {
    publicationBox.appendChild(document.createElement('br'));
    publicationBox.appendChild(additionalInfo);
  }

  listItem.appendChild(publicationBox);

  return listItem;
}    yearList.className = 'publication-list';

    // Add each publication to the list
    yearPublications.forEach(publication => {
      const listItem = createPublicationElement(publication, opts);
      yearList.appendChild(listItem);
    });

    // Add the list to the year section
    yearSection.appendChild(yearList);

    // Add the year section to the container
    allYearsContainer.appendChild(yearSection);
  });

  // Add everything to the main container
  container.appendChild(allYearsContainer);
}

/**
 * Group publications by year
 *
 * @param {Array} publications - Array of publication objects
 * @returns {Object} - Object with years as keys and arrays of publications as values
 */
function groupPublicationsByYear(publications) {
  const groups = {};

  publications.forEach(publication => {
    const year = publication.year || 'Unknown';
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(publication);
  });

  return groups;
}

/**
 * Create an HTML element for a single publication
 *
 * @param {Object} publication - Publication object
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} - List item element for the publication
 */


/**
 * Calculates publications count by year from the full dataset
 *
 * @param {Array} allPublications - Complete publications dataset
 * @returns {Object} - Object with years as keys and counts as values
 */
export function calculatePublicationCountsByYear(allPublications) {
  const counts = {};

  allPublications.forEach(publication => {
    const year = publication.year || 'Unknown';
    counts[year] = (counts[year] || 0) + 1;
  });

  return counts;
}