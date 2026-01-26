/**
 * Vanilla JS Dropdown Menu
 * Replacement for jQuery dropotron plugin
 */
(function() {
    'use strict';

    function initDropdowns(selector, options) {
        var defaults = {
            hoverDelay: 0,
            offsetY: -15
        };

        var settings = Object.assign({}, defaults, options || {});
        var nav = document.querySelector(selector);

        if (!nav) return;

        var items = nav.querySelectorAll('li');
        var activeTimeout = null;

        items.forEach(function(item) {
            var submenu = item.querySelector(':scope > ul');

            if (submenu) {
                // Style the submenu
                submenu.classList.add('dropotron');

                // Determine level
                var level = 0;
                var parent = item.parentElement;
                while (parent && parent !== nav) {
                    if (parent.tagName === 'UL') level++;
                    parent = parent.parentElement;
                }

                if (level === 1) {
                    submenu.classList.add('level-0');
                }

                // Position submenu
                submenu.style.position = 'absolute';
                submenu.style.display = 'none';
                submenu.style.zIndex = '1000';

                // Mouse enter
                item.addEventListener('mouseenter', function() {
                    if (activeTimeout) {
                        clearTimeout(activeTimeout);
                        activeTimeout = null;
                    }

                    var showSubmenu = function() {
                        // Hide sibling submenus
                        var siblings = item.parentElement.querySelectorAll(':scope > li > ul');
                        siblings.forEach(function(sib) {
                            if (sib !== submenu) {
                                sib.style.display = 'none';
                            }
                        });

                        submenu.style.display = 'block';

                        // Position based on level
                        if (level === 1) {
                            submenu.style.top = '100%';
                            submenu.style.left = '0';
                            submenu.style.marginTop = settings.offsetY + 'px';
                        } else {
                            submenu.style.top = '0';
                            submenu.style.left = '100%';
                        }

                        item.classList.add('active');
                    };

                    if (settings.hoverDelay > 0) {
                        activeTimeout = setTimeout(showSubmenu, settings.hoverDelay);
                    } else {
                        showSubmenu();
                    }
                });

                // Mouse leave
                item.addEventListener('mouseleave', function() {
                    if (activeTimeout) {
                        clearTimeout(activeTimeout);
                        activeTimeout = null;
                    }

                    submenu.style.display = 'none';
                    item.classList.remove('active');
                });
            }
        });
    }

    // Expose globally
    window.initDropdowns = initDropdowns;

    // Auto-initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initDropdowns('#nav > ul', {
            offsetY: -15,
            hoverDelay: 0
        });
    });
})();
