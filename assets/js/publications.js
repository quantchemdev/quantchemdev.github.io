// Main publications module
// This file initializes the publications system and coordinates the components

import { fetchBibtex } from './modules/bibtexLoader.js';
import { parseBibtex } from './modules/bibtexParser.js';
import { renderPublications } from './modules/publicationRenderer.js';
import { updateYearSidebar } from './modules/yearSidebar.js';

// Configuration options
const config = {
  bibtexUrl: '/assets/publications.bib', // Path to your BibTeX file
  containerSelector: '#publications-container', // Where to render publications
  sortBy: 'year', // Default sort (year, title, author)
  sortDirection: 'desc', // Default direction (asc, desc)
  defaultLimit: 100, // Number of publications to show initially
};

// Initialize the publications system
async function initPublications() {
  try {
    // Show loading state
    const container = document.querySelector(config.containerSelector);
    if (!container) {
      console.error('Publications container not found:', config.containerSelector);
      return;
    }

    container.innerHTML = '<p>Loading publications...</p>';

    // Fetch the BibTeX data
    const bibtexData = await fetchBibtex(config.bibtexUrl);

    // Parse the BibTeX data
    const publications = parseBibtex(bibtexData);

    // Sort publications (default by year, newest first)
    const sortedPublications = sortPublications(publications, config.sortBy, config.sortDirection);

    // Render the publications
    renderPublications(sortedPublications, container);

    // Update the year sidebar
    updateYearSidebar(sortedPublications);

  } catch (error) {
    console.error('Error initializing publications:', error);
    const container = document.querySelector(config.containerSelector);
    if (container) {
      container.innerHTML = '<p>Error loading publications. Please try again later.</p>';
    }
  }
}

// Sort publications by the specified field and direction
function sortPublications(publications, field, direction) {
  return [...publications].sort((a, b) => {
    let valueA = a[field] || '';
    let valueB = b[field] || '';

    // Handle numeric fields
    if (field === 'year') {
      valueA = parseInt(valueA, 10) || 0;
      valueB = parseInt(valueB, 10) || 0;
    }

    // Compare values
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPublications);

// Export functions for potential external use
export { initPublications, sortPublications };