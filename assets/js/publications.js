// Main publications module
// This file initializes the publications system and coordinates the components

import { fetchBibtex } from './modules/bibtexLoader.js';
import { parseBibtex } from './modules/bibtexParser.js';
import { renderPublications } from './modules/publicationRenderer.js';
import { paginatePublications, renderPagination } from './modules/paginationController.js';

// Configuration options
const config = {
  bibtexUrl: '/assets/publications.bib', // Path to your BibTeX file
  containerSelector: '#publications-container', // Where to render publications
  paginationSelector: '.pagination-controls', // Where to render pagination controls
  sortBy: 'year', // Default sort (year, title, author)
  sortDirection: 'desc', // Default direction (asc, desc)
  itemsPerPage: 10, // Number of publications per page
};

// Global state
let allPublications = [];
let currentPage = 1;
let totalPages = 1;

// Initialize the publications system
async function initPublications() {
  try {
    // Get URL parameters (for pagination)
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page') || '1', 10);

    if (isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

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
    allPublications = parseBibtex(bibtexData);

    // Sort publications (default by year, newest first)
    allPublications = sortPublications(allPublications, config.sortBy, config.sortDirection);

    // Calculate total pages
    totalPages = Math.ceil(allPublications.length / config.itemsPerPage);

    // Ensure current page is valid
    if (currentPage > totalPages) {
      currentPage = 1;
      // Update URL without reloading
      window.history.replaceState({}, '', '?page=1');
    }

    // Get the current page of publications
    const paginatedPublications = paginatePublications(allPublications, currentPage, config.itemsPerPage);

    // Render the publications
    renderPublications(paginatedPublications, container);

    // Render pagination controls
    const paginationContainer = document.querySelector(config.paginationSelector);
    renderPagination(paginationContainer, currentPage, totalPages);

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