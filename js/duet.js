//
// Duet JS
//
// This script handles site navigation, dynamic page loading (if enabled),
// and initializes various plugins and interactions for the Duet theme.
//

(function ($) {
    'use strict';

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Navigation & AJAX Page Loading
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var navTarget = $('body').attr('data-page-url');
    var docTitle = document.title;
    var History = window.History; // Assuming History.js is available

    // Bind to state change event for AJAX navigation
    History.Adapter.bind(window, 'statechange', function () {
        var state = History.getState();

        // Add loading state to body
        $('body').addClass('loading');

        // Load the new page content into a temporary loader element
        $('.page-loader').load(state.hash + ' .page__content', function () {

            // Scroll to the top of the page smoothly
            $('body, html').animate({
                scrollTop: 0
            }, 300);

            var transitionTime = 400; // Standard transition time

            // After current content fades out (simulated by timeout)
            setTimeout(function () {
                // Remove old page content
                $('.page .page__content').remove();

                // Append new page content from the loader
                $('.page-loader .page__content').appendTo('.page');

                // Update body attributes for the new page
                $('body').attr('data-page-url', window.location.pathname);
                navTarget = $('body').attr('data-page-url'); // Update global navTarget

                // Set the document title
                docTitle = $('.page__content').attr('data-page-title');
                document.title = docTitle;

                // Initialize functions for the new page content
                pageFunctions();

            }, transitionTime);
        });
    });

    // Hijack internal link clicks if AJAX loading is enabled
    if ($('body').hasClass('ajax-loading')) {
        $(document).on('click', 'a', function (event) {
            var thisLink = $(this);
            var thisTarget = thisLink.attr('href');

            // Do not process links with 'js-no-ajax' class, anchors, mailto, or tel links
            if (thisLink.hasClass('js-no-ajax') || thisTarget.startsWith('#') || thisTarget.startsWith('mailto:') || thisTarget.startsWith('tel:')) {
                window.location = thisTarget; // Follow link normally
                return;
            }

            // Let JavaScript handle links that are part of interactive elements (e.g., Fluidbox)
            if (thisLink.is('.gallery__item__link')) {
                // Event will be handled by the specific plugin (e.g., Fluidbox)
                return;
            }

            // For external links, open in a new tab
            if (thisTarget.startsWith('http://') || thisTarget.startsWith('https://')) {
                if (!thisTarget.includes($('body').attr('data-site-url'))) { // Check if it's truly external
                    window.open(thisTarget, '_blank');
                    event.preventDefault(); // Prevent current tab from navigating
                    return;
                }
            }
            
            // For internal links, use History.js to push state
            // Ensure it's not the current page to prevent unnecessary reloads
            if (thisTarget !== window.location.pathname && thisTarget !== (window.location.pathname + '/')) {
                event.preventDefault(); // Prevent default link navigation
                navTarget = thisTarget;
                History.pushState(null, docTitle, thisTarget);
            } else {
                 event.preventDefault(); // Also prevent reloading same page if ajax is on
            }
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Page Initialization Functions
    //
    // This function is called on initial page load and after each AJAX page load
    // to set up various elements and plugins.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function pageFunctions() {

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Show Content & Layout Initializations
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        var $firstImage = $('.page__content').find('img:first');
        if ($firstImage.length) {
            $firstImage.imagesLoaded(function () {
                initializeLayoutsAndReveal();
            });
        } else {
            initializeLayoutsAndReveal(); 
        }

        function initializeLayoutsAndReveal() {
            var $portfolioWrap = $('.portfolio-wrap');
            if ($portfolioWrap.length) {
                $portfolioWrap.imagesLoaded(function () {
                    $portfolioWrap.masonry({
                        itemSelector: '.portfolio-item',
                        transitionDuration: 0
                    });
                });
            }

            var $blogWrap = $('.blog-wrap');
            if ($blogWrap.length) {
                $blogWrap.imagesLoaded(function () {
                    $blogWrap.masonry({
                        itemSelector: '.blog-post',
                        transitionDuration: 0
                    });
                });
            }

            $('body').removeClass('loading');
            $('body').removeClass('menu--open'); 
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Active Navigation Link Styling
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        $('.active-link').removeClass('active-link');
        $('a[href="' + navTarget + '"]').addClass('active-link');

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Galleries Initialization (Owl Carousel & Fluidbox)
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        Waypoint.destroyAll(); 
        var galleryCount = 0;

        $('.gallery').each(function () {
            var $this = $(this); 
            galleryCount++;
            var thisId = 'gallery-' + galleryCount;
            $this.attr('id', thisId);

            var galleryCols = $this.attr('data-columns');

            $this.append('<div class="gallery__wrap"></div>');
            $this.children('img').each(function () {
                $(this).appendTo('#' + thisId + ' .gallery__wrap');
            });

            $this.find('.gallery__wrap img').each(function () {
                var imageSrc = $(this).attr('src');
                $(this).wrapAll('<div class="gallery__item"><a href="' + imageSrc + '" class="gallery__item__link"></a></div>');
            });

            $this.imagesLoaded(function () {
                if (galleryCols === '1') {
                    $this.addClass('gallery--carousel');
                    var $galleryWrap = $this.children('.gallery__wrap');
                    $galleryWrap.addClass('owl-carousel');

                    $galleryWrap.owlCarousel({
                        items: 1,
                        loop: true,
                        mouseDrag: false,
                        touchDrag: true,
                        pullDrag: false,
                        dots: true,
                        autoplay: false, 
                        autoplayTimeout: 6000,
                        autoHeight: true,
                        animateOut: 'fadeOut'
                    });

                    new Waypoint({
                        element: document.getElementById(thisId),
                        handler: function (direction) {
                            if (direction === 'down') {
                                $galleryWrap.trigger('stop.owl.autoplay');
                            } else if (direction === 'up') {
                                $galleryWrap.trigger('play.owl.autoplay');
                            }
                        },
                        offset: '-100%' 
                    });

                    new Waypoint({
                        element: document.getElementById(thisId),
                        handler: function (direction) {
                            if (direction === 'down') {
                                $galleryWrap.trigger('play.owl.autoplay');
                            } else if (direction === 'up') {
                                $galleryWrap.trigger('stop.owl.autoplay');
                            }
                        },
                        offset: '100%' 
                    });

                } else {
                    $this.addClass('gallery--grid');
                    $this.children('.gallery__wrap').masonry({
                        itemSelector: '.gallery__item',
                        transitionDuration: 0
                    });

                    var fluidboxOptions = {
                        loader: true,
                        viewportFill: 0.5 
                    };

                    var $galleryLinks = $this.find('.gallery__item__link');
                    console.log('%cAttempting to initialize Fluidbox for:', 'color: blue; font-weight: bold;', $galleryLinks);
                    console.log('%cWith options:', 'color: blue; font-weight: bold;', JSON.stringify(fluidboxOptions));

                    $galleryLinks.fluidbox(fluidboxOptions);

                    console.log('%cFluidbox SHOULD BE initialized for the elements above.', 'color: green;');
                }

                $this.addClass('gallery--on'); 
            });
        });

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Single Image Handling (wrapping images outside galleries)
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        $('.single p > img').each(function () {
            var $thisImage = $(this);
            var $parentParagraph = $thisImage.parent('p');
            $thisImage.insertAfter($parentParagraph); 
            $thisImage.wrapAll('<div class="image-wrap"></div>'); 
            $parentParagraph.remove(); 
        });

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Video iframe Handling (responsive embedding)
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        $('.single iframe').each(function () {
            var $thisIframe = $(this);
            var videoSrc = $thisIframe.attr('src');

            if (videoSrc && (videoSrc.includes('youtube') || videoSrc.includes('vimeo'))) {
                var width = $thisIframe.attr('width');
                var height = $thisIframe.attr('height');
                var ratio = (parseFloat(height) / parseFloat(width)) * 100;

                $thisIframe.wrapAll('<div class="video-wrap"><div class="video" style="padding-bottom:' + ratio + '%;"></div></div>');
            }
        });

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Table Handling (wrapping for responsive overflow)
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        $('.single table').each(function () {
            $(this).wrapAll('<div class="table-wrap"></div>'); 
        });
    }

    // Run functions on initial page load
    pageFunctions();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Mobile Menu Toggle
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    $(document).on('click', '.js-menu-toggle', function () {
        $('body').toggleClass('menu--open');
    });

    $(document).on('click', '.menu__list__item__link', function () {
        if ($('body').hasClass('menu--open')) { 
            $('body').removeClass('menu--open');
        }
    });

    // - - - - - - - - - - -
    // Contact Form Basic Validation (Client-side)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    $(document).on('submit', '#contact-form', function (e) {
        $('.contact-form__item--error').removeClass('contact-form__item--error');

        var emailField = $('.contact-form__input[name="email"]');
        var nameField = $('.contact-form__input[name="name"]');
        var messageField = $('.contact-form__textarea[name="message"]');
        var gotchaField = $('.contact-form__gotcha'); 

        var hasError = false;

        if (emailField.val() === '') {
            emailField.closest('.contact-form__item').addClass('contact-form__item--error');
            hasError = true;
        }
        if (nameField.val() === '') {
            nameField.closest('.contact-form__item').addClass('contact-form__item--error');
            hasError = true;
        }
        if (messageField.val() === '') {
            messageField.closest('.contact-form__item').addClass('contact-form__item--error');
            hasError = true;
        }

        if (hasError || gotchaField.val().length !== 0) {
            e.preventDefault(); 
        } else {
            // Basic client-side validation passed
        }
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Fluidbox Page Scroll Lock
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // When a Fluidbox instance starts to open
    $(document).on('openstart.fluidbox', '.gallery__item__link', function() {
        $('body').addClass('fluidbox-noscroll');
    });

    // When a Fluidbox instance has finished closing
    $(document).on('closeend.fluidbox', '.gallery__item__link', function() {
        $('body').removeClass('fluidbox-noscroll');
    });

}(jQuery));