!function (a) { // `a` is likely jQuery ($)
    "use strict";

    var e = a("body").attr("data-page-url"), // e = navTarget
        t = document.title,                 // t = docTitle
        o = window.History;                 // o = History

    function n() { // n = pageFunctions
        a(".page__content").find("img:first").imagesLoaded(function () {
            a(".portfolio-wrap").imagesLoaded(function () {
                a(".portfolio-wrap").masonry({
                    itemSelector: ".portfolio-item",
                    transitionDuration: 0
                });
            });
            a(".blog-wrap").imagesLoaded(function () {
                a(".blog-wrap").masonry({
                    itemSelector: ".blog-post",
                    transitionDuration: 0
                });
            });
            a("body").removeClass("loading");
            a("body").removeClass("menu--open");
        });

        a(".active-link").removeClass("active-link");
        a('a[href="' + e + '"]').addClass("active-link");

        Waypoint.destroyAll();
        var t = 0; // galleryCount

        a(".gallery").each(function () {
            var e = a(this), // current gallery $this
                l = "gallery-" + ++t; // thisId (using 'l' as 'o' is History)
            e.attr("id", l);
            var i = e.attr("data-columns"); // galleryCols (using 'i' as 'n' is pageFunctions)
            e.append('<div class="gallery__wrap"></div>');
            e.children("img").each(function () {
                a(this).appendTo("#" + l + " .gallery__wrap");
            });
            e.find(".gallery__wrap img").each(function () {
                var e = a(this).attr("src");
                a(this).wrapAll('<div class="gallery__item"><a href="' + e + '" class="gallery__item__link"></div></div>').appendTo();
            });
            e.imagesLoaded(function () {
                if ("1" === i) { // if galleryCols === '1'
                    e.addClass("gallery--carousel");
                    e.children(".gallery__wrap").addClass("owl-carousel");
                    e.children(".gallery__wrap").owlCarousel({
                        items: 1,
                        loop: !0,
                        mouseDrag: !1,
                        touchDrag: !0,
                        pullDrag: !1,
                        dots: !0,
                        autoplay: !1,
                        autoplayTimeout: 6e3,
                        autoHeight: !0,
                        animateOut: "fadeOut"
                    });
                    new Waypoint({
                        element: document.getElementById(l),
                        handler: function (a) {
                            "down" === a && e.children(".gallery__wrap").trigger("stop.owl.autoplay");
                            "up" === a && e.children(".gallery__wrap").trigger("play.owl.autoplay");
                        },
                        offset: "-100%"
                    });
                    new Waypoint({
                        element: document.getElementById(l),
                        handler: function (a) {
                            "down" === a && e.children(".gallery__wrap").trigger("play.owl.autoplay");
                            "up" === a && e.children(".gallery__wrap").trigger("stop.owl.autoplay");
                        },
                        offset: "100%"
                    });
                } else {
                    e.addClass("gallery--grid");
                    e.children(".gallery__wrap").masonry({
                        itemSelector: ".gallery__item",
                        transitionDuration: 0
                    });
                    // Fluidbox initialization in the current duet-min.js:
                    e.find(".gallery__item__link").fluidbox({
                        loader: !0, 
                        viewportFill: 0.99 // Current working value
                    });
                }
                e.addClass("gallery--on");
            });
        });

        a(".single p > img").each(function () {
            var e = a(this).parent("p");
            a(this).insertAfter(e);
            a(this).wrapAll('<div class="image-wrap"></div>');
            e.remove();
        });

        a(".single iframe").each(function () {
            if (a(this).attr("src").indexOf("youtube") >= 0 || a(this).attr("src").indexOf("vimeo") >= 0) {
                var e = a(this).attr("width"),
                    t = a(this).attr("height") / e * 100;
                a(this).wrapAll('<div class="video-wrap"><div class="video" style="padding-bottom:' + t + '%;"></div></div>');
            }
        });

        a(".single table").each(function () {
            a(this).wrapAll('<div class="table-wrap"></div>');
        });
    }

    o.Adapter.bind(window, "statechange", function () {
        var l = o.getState(); // state
        a("body").addClass("loading");
        a(".page-loader").load(l.hash + " .page__content", function () {
            a("body, html").animate({
                scrollTop: 0
            }, 300);
            setTimeout(function () {
                a(".page .page__content").remove();
                a(".page-loader .page__content").appendTo(".page");
                a("body").attr("data-page-url", window.location.pathname);
                e = a("body").attr("data-page-url"); // Update navTarget
                t = a(".page__content").attr("data-page-title"); // Update docTitle
                document.title = t;
                n(); // Call pageFunctions
            }, 400);
        });
    });

    a("body").hasClass("ajax-loading") && a(document).on("click", "a", function (i) { // 'i' is event here
        i.preventDefault();
        var l = a(this).attr("href"); // thisTarget
        a(this).hasClass("js-no-ajax") || l.indexOf("#") >= 0 || l.indexOf("mailto:") >= 0 || l.indexOf("tel:") >= 0 ?
            window.location = l :
            a(this).is(".gallery__item__link") || (l.indexOf("http") >= 0 ?
                window.open(l, "_blank") :
                (e = l, o.pushState(null, t, l))); // Update navTarget and push state
    });

    n(); // Call pageFunctions on initial load

    a(document).on("click", ".js-menu-toggle", function () {
        a("body").hasClass("menu--open") ? a("body").removeClass("menu--open") : a("body").addClass("menu--open");
    });

    a(document).on("click", ".menu__list__item__link", function () {
        // Consider changing to target 'body' if .menu doesn't always have .menu--open
        a(".menu").hasClass("menu--open") && a(".menu").removeClass("menu--open"); 
    });

    a(document).on("submit", "#contact-form", function (e) {
        a(".contact-form__item--error").removeClass("contact-form__item--error");
        var t = a('.contact-form__input[name="email"]'),
            o = a('.contact-form__input[name="name"]'),
            n = a('.contact-form__textarea[name="message"]'),
            l = a(".contact-form__gotcha");

        "" === t.val() && t.closest(".contact-form__item").addClass("contact-form__item--error");
        "" === o.val() && o.closest(".contact-form__item").addClass("contact-form__item--error");
        "" === n.val() && n.closest(".contact-form__item").addClass("contact-form__item--error");

        "" !== t.val() && "" !== o.val() && "" !== n.val() && 0 === l.val().length || e.preventDefault();
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Fluidbox Page Scroll Lock
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    $(document).on('openstart.fluidbox', '.gallery__item__link', function() {
        $('body').addClass('fluidbox-noscroll');
    });

    $(document).on('closeend.fluidbox', '.gallery__item__link', function() {
        $('body').removeClass('fluidbox-noscroll');
    });

}(jQuery);