// Year Sidebar Module
// Handles rendering and updating the years sidebar

/**
 * Update the years sidebar with links to publication years
 *
 * @param {Array} publications - Array of publication objects
 * @param {string} sidebarSelector - Selector for the sidebar element
 */
export function updateYearSidebar(publications, sidebarSelector = '#sidebar ul.default') {
  const sidebarElement = document.querySelector(sidebarSelector);

  if (!sidebarElement) {
    console.error('Year sidebar element not found:', sidebarSelector);
    return;
  }

  // Extract unique years from publications
  const years = [...new Set(publications
    .map(pub => pub.year)
    .filter(year => year) // Remove undefined/empty years
    .sort((a, b) => parseInt(b) - parseInt(a)) // Sort descending
  )];

  // Clear existing content
  sidebarElement.innerHTML = '';

  // Add year links
  years.forEach(year => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.href = `#${year}`;
    link.textContent = year;

    // Add click handler for smooth scrolling
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const yearElement = document.getElementById(year);

      if (yearElement) {
        yearElement.scrollIntoView({ behavior: 'smooth' });
      }
    });

    listItem.appendChild(link);
    sidebarElement.appendChild(listItem);
  });
}