/**
 * Hamburger Menu - Vanilla JS (Fixed)
 * - Ignores empty submenus
 * - Removes dependency on FontAwesome
 * - improved browser compatibility (removed :scope)
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var nav = document.getElementById('nav');
        var body = document.body;

        if (!nav) return;

        // 1. Better Selector Logic (No :scope)
        // Get the direct <ul> child of nav
        var mainList = nav.querySelector('ul');
        if (!mainList) return;

        var topLevelItems = mainList.children; // Direct <li> children

        // Helper: Check if element is a strictly empty UL
        function hasVisibleItems(ul) {
            if (!ul) return false;
            // Check if it has <li> children
            return ul.querySelectorAll('li').length > 0;
        }

        // 2. Add Classes only if REAL children exist
        Array.from(topLevelItems).forEach(function(item) {
            var submenu = item.querySelector('ul');
            
            // FIX: Only add class if submenu exists AND has items
            if (hasVisibleItems(submenu)) {
                item.classList.add('has-dropdown');

                // Check for nested levels
                var nestedItems = submenu.children;
                Array.from(nestedItems).forEach(function(nestedItem) {
                    var nestedSubmenu = nestedItem.querySelector('ul');
                    if (hasVisibleItems(nestedSubmenu)) {
                        nestedItem.classList.add('has-nested');
                    }
                });
            }
        });

        // Create hamburger button
        var hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<span class="hamburger-box"><span class="hamburger-inner"></span></span>';

        // Create overlay
        var overlay = document.createElement('div');
        overlay.className = 'nav-overlay';

        // Insert hamburger before nav
        nav.parentNode.insertBefore(hamburger, nav);
        body.appendChild(overlay);

        // Toggle menu function
        function toggleMenu() {
            var isOpen = nav.classList.contains('is-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        function openMenu() {
            nav.classList.add('is-open');
            hamburger.classList.add('is-active');
            hamburger.setAttribute('aria-expanded', 'true');
            overlay.classList.add('is-visible');
            body.classList.add('nav-open');
        }

        function closeMenu() {
            nav.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('is-visible');
            body.classList.remove('nav-open');
        }

        // Event listeners
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                closeMenu();
            }
        });

        // 3. Handle Submenu Toggles (The "Arrow")
        var menuItems = nav.querySelectorAll('li');
        menuItems.forEach(function(item) {
            var submenu = item.querySelector('ul');
            var link = item.querySelector('a');

            // FIX: Only add arrow if submenu has content
            if (hasVisibleItems(submenu) && link) {
                
                var toggle = document.createElement('button');
                toggle.className = 'submenu-toggle';
                toggle.setAttribute('aria-label', 'Toggle submenu');
                
                // FIX: Use standard text arrow instead of FontAwesome <i>
                toggle.innerHTML = '<span style="font-size: 10px;">▼</span>'; 

                link.parentNode.insertBefore(toggle, submenu);

                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var isExpanded = item.classList.contains('submenu-open');

                    // Close siblings
                    var siblings = item.parentNode.children;
                    Array.from(siblings).forEach(function(sib) {
                        if (sib !== item && sib.classList.contains('submenu-open')) {
                            sib.classList.remove('submenu-open');
                            var sibToggle = sib.querySelector('.submenu-toggle');
                            if (sibToggle) sibToggle.setAttribute('aria-expanded', 'false');
                        }
                    });

                    // Toggle current
                    item.classList.toggle('submenu-open');
                    toggle.setAttribute('aria-expanded', !isExpanded);
                });
            }
        });

        // Close menu when clicking a link (on mobile)
        var links = nav.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 980) {
                    closeMenu();
                }
            });
        });

        // Handle window resize
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 980) {
                    closeMenu();
                    var openSubmenus = nav.querySelectorAll('.submenu-open');
                    openSubmenus.forEach(function(item) {
                        item.classList.remove('submenu-open');
                    });
                }
            }, 250);
        });
    });
})();
