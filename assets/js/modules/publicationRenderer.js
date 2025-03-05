// Publication Renderer Module
// Renders publication objects to HTML without year groupings

/**
 * Renders a list of publications into the specified container
 *
 * @param {Array} publications - Array of publication objects
 * @param {HTMLElement} container - The container element to render into
 */
export function renderPublications(publications, container) {
  // Clear the container
  container.innerHTML = '';

  // If no publications, show a message
  if (!publications || publications.length === 0) {
    container.innerHTML = '<p>No publications found.</p>';
    return;
  }

  // Create a publication list element
  const publicationList = document.createElement('ul');
  publicationList.className = 'publication-list';

  // Add each publication to the list
  publications.forEach(publication => {
    const listItem = createPublicationElement(publication);
    publicationList.appendChild(listItem);
  });

  // Add the list to the container
  container.appendChild(publicationList);
}

/**
 * Create an HTML element for a single publication
 * This matches the current website's publication HTML structure
 *
 * @param {Object} publication - Publication object
 * @returns {HTMLElement} - List item element for the publication
 */
function createPublicationElement(publication) {
  const listItem = document.createElement('li');

  // Create the publication box
  const publicationBox = document.createElement('div');
  publicationBox.className = 'publication-box';

  // Create the title link
  const titleLink = document.createElement('a');
  titleLink.href = publication.url || '#';
  titleLink.className = 'publication-title';
  titleLink.target = '_blank';

  const titleBold = document.createElement('b');
  titleBold.textContent = publication.title || 'Untitled Publication';
  titleLink.appendChild(titleBold);

  // Create the author span
  const authorSpan = document.createElement('span');
  authorSpan.className = 'publication-authors';
  authorSpan.textContent = publication.formattedAuthors || publication.author || 'Unknown Authors';

  // Create the details span
  const detailsSpan = document.createElement('span');
  detailsSpan.className = 'publication-details';

  // Journal/venue
  const journalElement = document.createElement('i');
  journalElement.textContent = publication.journal || publication.booktitle || '';

  // Year
  const yearElement = document.createElement('b');
  yearElement.textContent = publication.year || '';

  // Volume
  const volumeElement = document.createElement('i');
  volumeElement.textContent = publication.volume || '';

  // Combine all elements
  detailsSpan.appendChild(journalElement);
  if (publication.year) {
    detailsSpan.appendChild(document.createTextNode(', '));
    detailsSpan.appendChild(yearElement);
  }
  if (publication.volume) {
    detailsSpan.appendChild(document.createTextNode(', '));
    detailsSpan.appendChild(volumeElement);
  }
  if (publication.pages) {
    detailsSpan.appendChild(document.createTextNode(', ' + publication.pages));
  }

  // Assemble the publication box
  publicationBox.appendChild(titleLink);
  publicationBox.appendChild(document.createElement('br'));
  publicationBox.appendChild(authorSpan);
  publicationBox.appendChild(document.createElement('br'));
  publicationBox.appendChild(detailsSpan);

  listItem.appendChild(publicationBox);

  return listItem;
}