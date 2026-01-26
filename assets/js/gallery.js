(function() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  // Month name to number mapping for sorting
  const monthOrder = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };

  // Get all images and sort by date (newest first)
  const images = Array.from(gallery.querySelectorAll('img'));
  images.sort((a, b) => {
    const yearA = parseInt(a.dataset.year) || 0;
    const yearB = parseInt(b.dataset.year) || 0;
    if (yearB !== yearA) return yearB - yearA;
    const monthA = monthOrder[a.dataset.month] || 0;
    const monthB = monthOrder[b.dataset.month] || 0;
    return monthB - monthA;
  });

  // Determine number of columns based on screen width
  function getColumnCount() {
    const width = window.innerWidth;
    if (width <= 500) return 1;
    if (width <= 800) return 2;
    if (width <= 1200) return 3;
    return 4;
  }

  // Distribute images into columns (shortest-column-first for balanced heights)
  function distributeImages() {
    const numCols = getColumnCount();

    // Clear gallery
    gallery.innerHTML = '';

    // Create column containers
    const columns = [];
    const columnHeights = [];
    for (let i = 0; i < numCols; i++) {
      const col = document.createElement('div');
      col.className = 'gallery-column';
      columns.push(col);
      columnHeights.push(0);
      gallery.appendChild(col);
    }

    // Distribute images to shortest column
    images.forEach(img => {
      // Find shortest column
      let shortestIdx = 0;
      for (let i = 1; i < numCols; i++) {
        if (columnHeights[i] < columnHeights[shortestIdx]) {
          shortestIdx = i;
        }
      }

      // Add image to shortest column
      columns[shortestIdx].appendChild(img);

      // Update column height (use aspect ratio if known, else estimate)
      const aspectRatio = img._width && img._height ? img._height / img._width : 0.75;
      columnHeights[shortestIdx] += aspectRatio;
    });

    // Show gallery
    gallery.style.opacity = '1';

    // Re-attach click handlers for lightbox
    attachLightboxHandlers();
  }

  // Preload image dimensions for accurate height balancing
  function preloadDimensions() {
    return Promise.all(images.map(img => {
      return new Promise(resolve => {
        if (img.naturalWidth) {
          img._width = img.naturalWidth;
          img._height = img.naturalHeight;
          resolve();
        } else {
          const tempImg = new Image();
          tempImg.onload = () => {
            img._width = tempImg.naturalWidth;
            img._height = tempImg.naturalHeight;
            resolve();
          };
          tempImg.onerror = () => resolve();
          tempImg.src = img.src;
        }
      });
    }));
  }

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = images[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.dataset.caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;
    openLightbox(currentIndex);
  }

  function attachLightboxHandlers() {
    images.forEach((img, index) => {
      img.onclick = () => openLightbox(index);
    });
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Initial distribution (after preloading dimensions for accurate balancing)
  preloadDimensions().then(() => distributeImages());

  // Redistribute on resize (debounced)
  let resizeTimeout;
  let lastColumnCount = getColumnCount();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newColumnCount = getColumnCount();
      if (newColumnCount !== lastColumnCount) {
        lastColumnCount = newColumnCount;
        distributeImages();
      }
    }, 150);
  });
})();
