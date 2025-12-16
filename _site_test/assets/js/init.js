<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
<!-- FIXED -->
    <title>Quantum Chemistry Development Group</title>
    <meta name="description"
        content="Website for the Quantum Chemistry Development Group at DIPC">
    <meta name="keywords"
        content="quantum chemistry, computational chemistry, DFT, DMFT, electron correlation, ">
    <meta name="author" content="Quantum Chemistry Development Group">

    <!-- Canonical URL -->
    <link rel="canonical" href="http://localhost:4001/assets/js/init.js">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="">
    <meta property="og:description" content="Website for the Quantum Chemistry Development Group at DIPC">
    <meta property="og:url" content="http://localhost:4001/assets/js/init.js">
    <meta property="og:site_name" content="">
    <meta property="og:type" content="website">

    <!-- Enhanced Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
        img-src 'self' data: https:;
        font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
        frame-src https://www.google.com;
        connect-src 'self' https:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
    ">

    <!-- DNS Prefetch and Preconnect for Performance -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">

    <!-- Optimized Google Fonts -->


    <!-- Font Awesome (Modern Version) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous" referrerpolicy="no-referrer">

    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="/assets/css/style.css">

    <!-- Quick Fixes CSS -->
    <link rel="stylesheet" href="/assets/css/quick-fixes.css">

    <!-- Favicon (add if you have one) -->
    <!-- <link rel="icon" type="image/x-icon" href="/favicon.ico"> -->
    <link rel="stylesheet" href="/assets/css/font-awesome.min.css">
    <!-- Modern jQuery with Security -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <!-- Navigation JavaScript -->
    <script src="/assets/js/jquery.dropotron.min.js"></script>
    <script src="/assets/js/init.js"></script>

</head>

<body class="default">


    <!-- Page Content -->
    /*
	Horizons by TEMPLATED
    templated.co @templatedco
    Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/
(function($) {

	skel.init({
		reset: 'full',
		breakpoints: {
			global:		{ range: '*', href: '/assets/css/style.css', containers: 1400, grid: { gutters: 50 } },
			wide:		{ range: '-1680', href: '/assets/css/style-wide.css', containers: 1200, grid: { gutters: 40 } },
			normal:		{ range: '-1280', href: '/assets/css/style-normal.css', containers: 960, lockViewport: true },
			narrow:		{ range: '-980', href: '/assets/css/style-narrow.css', containers: '95%', grid: { gutters: 30 } },
			narrower:	{ range: '-840', href: '/assets/css/style-narrower.css', grid: { collapse: 1 } },
			mobile:		{ range: '-640', href: '/assets/css/style-mobile.css', containers: '90%', grid: { gutters: 15, collapse: 2 } }
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

		var	$window = $(window);

		// Forms (IE<10).
			var $form = $('form');
			if ($form.length > 0) {

				$form.find('.form-button-submit')
					.on('click', function() {
						$(this).parents('form').submit();
						return false;
					});

				if (skel.vars.IEVersion < 10) {
					$.fn.n33_formerize=function(){var _fakes=new Array(),_form = $(this);_form.find('input[type=text],textarea').each(function() { var e = $(this); if (e.val() == '' || e.val() == e.attr('placeholder')) { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).blur(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).focus(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); _form.find('input[type=password]').each(function() { var e = $(this); var x = $($('<div>').append(e.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text')); if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield'); if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield'); x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e); if (e.val() == '') e.hide(); else x.hide(); e.blur(function(event) { event.preventDefault(); var e = $(this); var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } }); x.focus(function(event) { event.preventDefault(); var x = $(this); var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') + ']'); x.hide(); e.show().focus(); }); x.keypress(function(event) { event.preventDefault(); x.val(''); }); });  _form.submit(function() { $(this).find('input[type=text],input[type=password],textarea').each(function(event) { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', ''); if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); }).bind("reset", function(event) { event.preventDefault(); $(this).find('select').val($('option:first').val()); $(this).find('input,textarea').each(function() { var e = $(this); var x; e.removeClass('formerize-placeholder'); switch (this.type) { case 'submit': case 'reset': break; case 'password': e.val(e.attr('defaultValue')); x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } else { e.show(); x.hide(); } break; case 'checkbox': case 'radio': e.attr('checked', e.attr('defaultValue')); break; case 'text': case 'textarea': e.val(e.attr('defaultValue')); if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } break; default: e.val(e.attr('defaultValue')); break; } }); window.setTimeout(function() { for (x in _fakes) _fakes[x].trigger('formerize_sync'); }, 10); }); return _form; };
					$form.n33_formerize();
				}

			}

		// Dropdowns.
			$('#nav > ul').dropotron({
				offsetY: -15,
				hoverDelay: 0
			});

	});

})(jQuery);

    <!-- Footer Scripts (if any) -->

</body>

</html>