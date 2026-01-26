---
---
/*
	Horizons by TEMPLATED
    templated.co @templatedco
    Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/
(function($) {

	skel.init({
		reset: 'full',
		breakpoints: {
			global:		{ range: '*', href: '{{ site.baseurl }}/assets/css/style.css', containers: 1400, grid: { gutters: 50 } },
			wide:		{ range: '-1680', href: '{{ site.baseurl }}/assets/css/style-wide.css', containers: 1200, grid: { gutters: 40 } },
			normal:		{ range: '-1280', href: '{{ site.baseurl }}/assets/css/style-normal.css', containers: 960, lockViewport: true },
			narrow:		{ range: '-980', href: '{{ site.baseurl }}/assets/css/style-narrow.css', containers: '95%', grid: { gutters: 30 } },
			narrower:	{ range: '-840', href: '{{ site.baseurl }}/assets/css/style-narrower.css', grid: { collapse: 1 } },
			mobile:		{ range: '-640', href: '{{ site.baseurl }}/assets/css/style-mobile.css', containers: '90%', grid: { gutters: 15, collapse: 2 } }
		}
	}, {
		layers: {
			layers: {
				navPanel: {
					animation: 'pushX',
					breakpoints: 'narrower',
					clickToClose: true,
					height: '100%',
					hidden: true,
					html: '<div data-action="navList" data-args="nav"></div>',
					orientation: 'vertical',
					position: 'top-left',
					side: 'left',
					width: 275
				},
				titleBar: {
					breakpoints: 'narrower',
					height: 44,
					html: '<span class="toggle" data-action="toggleLayer" data-args="navPanel"></span><span class="title" data-action="copyHTML" data-args="logo"></span>',
					position: 'top-left',
					side: 'top',
					width: '100%'
				}
			}
		}
	});

	$(function() {

		// Form submit button handler
		var $form = $('form');
		if ($form.length > 0) {
			$form.find('.form-button-submit')
				.on('click', function() {
					$(this).parents('form').submit();
					return false;
				});
		}

		// Dropdowns
		$('#nav > ul').dropotron({
			offsetY: -15,
			hoverDelay: 0
		});

	});

})(jQuery);