!function (a, b, c, d) {
    "use strict";

    function e(b, c) {
        this.element = b;
        var d = {};
        a.each(a(this.element).data(), function (a, b) {
            var c = function (a) {
                return a && a[0].toLowerCase() + a.slice(1)
            },
                e = c(a.replace("fluidbox", ""));
            ("" !== e || null !== e) && ("false" == b ? b = !1 : "true" == b && (b = !0), d[e] = b)
        });
        this.settings = a.extend({}, h, c, d);
        this.settings.viewportFill = Math.max(Math.min(parseFloat(this.settings.viewportFill), 1), 0);
        this.settings.stackIndex < this.settings.stackIndexDelta && (settings.stackIndexDelta = settings.stackIndex);
        this._name = g;
        this.init();
    }

    var f = a(b),
        g = (a(c), "fluidbox"),
        h = {
            immediateOpen: !1,
            loader: !1,
            maxWidth: 0,
            maxHeight: 0,
            resizeThrottle: 500,
            stackIndex: 1e3,
            stackIndexDelta: 10,
            viewportFill: .95
        },
        i = {},
        j = 0;

    ("undefined" == typeof console || "undefined" === console.warn) && (console = {}, console.warn = function () { });

    a.isFunction(a.throttle) || console.warn("Fluidbox: The jQuery debounce/throttle plugin is not found/loaded. Even though Fluidbox works without it, the window resize event will fire extremely rapidly in browsers, resulting in significant degradation in performance upon viewport resize.");

    var k = function () {
        var a, b = c.createElement("fakeelement"),
            e = {
                transition: "transitionend",
                OTransition: "oTransitionEnd",
                MozTransition: "transitionend",
                WebkitTransition: "webkitTransitionEnd"
            };
        for (a in e)
            if (b.style[a] !== d) return e[a]
    },
        l = k(),
        m = {
            dom: function () {
                var b = a("<div />", {
                    "class": "fluidbox__wrap",
                    css: {
                        zIndex: this.settings.stackIndex - this.settings.stackIndexDelta
                    }
                });
                if (a(this.element).addClass("fluidbox--closed").wrapInner(b).find("img").first().css({
                    opacity: 1
                }).addClass("fluidbox__thumb").after('<div class="fluidbox__ghost" />'), this.settings.loader) {
                    var c = a("<div />", {
                        "class": "fluidbox__loader",
                        css: {
                            zIndex: 2
                        }
                    });
                    a(this.element).find(".fluidbox__wrap").append(c)
                }
            },
            prepareFb: function () {
                var b = this,
                    c = a(this.element);
                c.trigger("thumbloaddone.fluidbox");
                m.measure.fbElements.call(this);
                b.bindEvents();
                c.addClass("fluidbox--ready");
                b.bindListeners();
                c.trigger("ready.fluidbox");
            },
            measure: {
                viewport: function () {
                    i.viewport = {
                        w: f.width(),
                        h: f.height()
                    }
                },
                fbElements: function () {
                    var b = this,
                        c = a(this.element),
                        d = c.find("img").first(),
                        e = c.find(".fluidbox__ghost"),
                        f = c.find(".fluidbox__wrap");
                    b.instanceData.thumb = {
                        natW: d[0].naturalWidth,
                        natH: d[0].naturalHeight,
                        w: d.width(),
                        h: d.height()
                    };
                    e.css({
                        width: d.width(),
                        height: d.height(),
                        top: d.offset().top - f.offset().top + parseInt(d.css("borderTopWidth")) + parseInt(d.css("paddingTop")),
                        left: d.offset().left - f.offset().left + parseInt(d.css("borderLeftWidth")) + parseInt(d.css("paddingLeft"))
                    });
                }
            },
            checkURL: function (a) {
                var b = 0;
                return /[\s+]/g.test(a) ? (console.warn("Fluidbox: Fluidbox opening is halted because it has detected characters in your URL string that need to be properly encoded/escaped. Whitespace(s) have to be escaped manually. See RFC3986 documentation."), b = 1) : /[\"\'\(\)]/g.test(a) && (console.warn("Fluidbox: Fluidbox opening will proceed, but it has detected characters in your URL string that need to be properly encoded/escaped. These will be escaped for you. See RFC3986 documentation."), b = 0), b
            },
            formatURL: function (a) {
                return a.replace(/"/g, "%22").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")
            }
        };

    a.extend(e.prototype, {
        init: function () {
            var b = this,
                c = a(this.element),
                d = c.find("img").first();
            if (m.measure.viewport(), (!b.instanceData || !b.instanceData.initialized) && c.is("a") && 1 === c.children().length && (c.children().is("img") || c.children().is("picture") && 1 === c.find("img").length) && "none" !== c.css("display") && "none" !== c.children().css("display") && "none" !== c.parents().css("display")) {
                c.removeClass("fluidbox--destroyed");
                b.instanceData = {};
                b.instanceData.initialized = !0;
                b.instanceData.originalNode = c.html();
                j += 1;
                b.instanceData.id = j;
                c.addClass("fluidbox__instance-" + j);
                c.addClass("fluidbox--initialized");
                m.dom.call(b);
                c.trigger("init.fluidbox");
                var e = new Image;
                d.width() > 0 && d.height() > 0 ? m.prepareFb.call(b) : (e.onload = function () {
                    m.prepareFb.call(b)
                }, e.onerror = function () {
                    c.trigger("thumbloadfail.fluidbox")
                }, e.src = d.attr("src"))
            }
        },
        open: function () {
            var b = this,
                c = a(this.element),
                d = c.find("img").first(),
                e = c.find(".fluidbox__ghost"),
                f = c.find(".fluidbox__wrap");
            b.instanceData.state = 1;
            e.off(l);
            a(".fluidbox--opened").fluidbox("close");
            var g = a("<div />", {
                "class": "fluidbox__overlay",
                css: {
                    zIndex: -1
                }
            });
            if (f.append(g), c.removeClass("fluidbox--closed").addClass("fluidbox--loading"), m.checkURL(d.attr("src"))) return b.close(), !1;
            e.css({
                "background-image": "url(" + m.formatURL(d.attr("src")) + ")",
                opacity: 1
            });
            m.measure.fbElements.call(b);
            var h;
            b.settings.immediateOpen ? (c.addClass("fluidbox--opened fluidbox--loaded").find(".fluidbox__wrap").css({
                zIndex: b.settings.stackIndex + b.settings.stackIndexDelta
            }), c.trigger("openstart.fluidbox"), b.compute(), d.css({
                opacity: 0
            }), a(".fluidbox__overlay").css({
                opacity: 1
            }), e.one(l, function () {
                c.trigger("openend.fluidbox")
            }), h = new Image, h.onload = function () {
                if (c.trigger("imageloaddone.fluidbox"), 1 === b.instanceData.state) {
                    if (b.instanceData.thumb.natW = h.naturalWidth, b.instanceData.thumb.natH = h.naturalHeight, c.removeClass("fluidbox--loading"), m.checkURL(h.src)) return b.close({
                        error: !0
                    }), !1;
                    e.css({
                        "background-image": "url(" + m.formatURL(h.src) + ")"
                    });
                    b.compute()
                }
            }, h.onerror = function () {
                b.close({
                    error: !0
                });
                c.trigger("imageloadfail.fluidbox");
                c.trigger("delayedloadfail.fluidbox");
            }, h.src = c.attr("href")) : (h = new Image, h.onload = function () {
                return c.trigger("imageloaddone.fluidbox"), c.removeClass("fluidbox--loading").addClass("fluidbox--opened fluidbox--loaded").find(".fluidbox__wrap").css({
                    zIndex: b.settings.stackIndex + b.settings.stackIndexDelta
                }), c.trigger("openstart.fluidbox"), m.checkURL(h.src) ? (b.close({
                    error: !0
                }), !1) : (e.css({
                    "background-image": "url(" + m.formatURL(h.src) + ")"
                }), b.instanceData.thumb.natW = h.naturalWidth, b.instanceData.thumb.natH = h.naturalHeight, b.compute(), d.css({
                    opacity: 0
                }), a(".fluidbox__overlay").css({
                    opacity: 1
                }), void e.one(l, function () {
                    c.trigger("openend.fluidbox")
                }))
            }, h.onerror = function () {
                b.close({
                    error: !0
                });
                c.trigger("imageloadfail.fluidbox");
            }, h.src = c.attr("href"))
        },
        compute: function () {
            var b = this,
                c = a(this.element),
                d = c.find("img").first(),
                e = c.find(".fluidbox__ghost"),
                g = c.find(".fluidbox__wrap"),
                h = b.instanceData.thumb.natW,
                j = b.instanceData.thumb.natH,
                k = b.instanceData.thumb.w,
                l = b.instanceData.thumb.h,
                m = h / j,
                n = i.viewport.w / i.viewport.h;

            b.settings.maxWidth > 0 ? (h = b.settings.maxWidth, j = h / m) : b.settings.maxHeight > 0 && (j = b.settings.maxHeight, h = j * m);

            var o, p, q, r, s;
            n > m ? (o = j < i.viewport.h ? j : i.viewport.h * b.settings.viewportFill, q = o / l, r = h * (l * q / j) / k, s = q) : (p = h < i.viewport.w ? h : i.viewport.w * b.settings.viewportFill, r = p / k, q = j * (k * r / h) / l, s = r);

            b.settings.maxWidth && b.settings.maxHeight && console.warn("Fluidbox: Both maxHeight and maxWidth are specified. You can only specify one. If both are specified, only the maxWidth property will be respected. This will not generate any error, but may cause unexpected sizing behavior.");

            var t = f.scrollTop() - d.offset().top + .5 * (l * (s - 1)) + .5 * (f.height() - l * s),
                u = .5 * (k * (s - 1)) + .5 * (f.width() - k * s) - d.offset().left,
                v = parseInt(100 * r) / 100 + "," + parseInt(100 * q) / 100;

            e.css({
                transform: "translate(" + parseInt(100 * u) / 100 + "px," + parseInt(100 * t) / 100 + "px) scale(" + v + ")",
                top: d.offset().top - g.offset().top,
                left: d.offset().left - g.offset().left
            });
            c.find(".fluidbox__loader").css({
                transform: "translate(" + parseInt(100 * u) / 100 + "px," + parseInt(100 * t) / 100 + "px) scale(" + v + ")"
            });
            c.trigger("computeend.fluidbox");
        },
        recompute: function () {
            this.compute()
        },
        close: function (b) {
            var c = this,
                e = a(this.element),
                f = e.find("img").first(),
                g = e.find(".fluidbox__ghost"),
                h = e.find(".fluidbox__wrap"),
                i = e.find(".fluidbox__overlay"),
                j = a.extend(null, {
                    error: !1
                }, b);

            return null === c.instanceData.state || typeof c.instanceData.state == typeof d || 0 === c.instanceData.state ? !1 : (c.instanceData.state = 0, e.trigger("closestart.fluidbox"), e.removeClass(function (a, b) {
                return (b.match(/(^|\s)fluidbox--(opened|loaded|loading)+/g) || []).join(" ")
            }).addClass("fluidbox--closed"), g.css({
                transform: "translate(0,0) scale(1,1)",
                top: f.offset().top - h.offset().top + parseInt(f.css("borderTopWidth")) + parseInt(f.css("paddingTop")),
                left: f.offset().left - h.offset().left + parseInt(f.css("borderLeftWidth")) + parseInt(f.css("paddingLeft"))
            }), e.find(".fluidbox__loader").css({
                transform: "none"
            }), g.one(l, function () {
                g.css({
                    opacity: 0
                });
                f.css({
                    opacity: 1
                });
                i.remove();
                h.css({
                    zIndex: c.settings.stackIndex - c.settings.stackIndexDelta
                });
                e.trigger("closeend.fluidbox");
            }), j.error && g.trigger("transitionend"), void i.css({
                opacity: 0
            }))
        },
        bindEvents: function () {
            var b = this,
                c = a(this.element);
            c.on("click.fluidbox", function (a) {
                a.preventDefault();
                b.instanceData.state && 0 !== b.instanceData.state ? b.close() : b.open()
            })
        },
        bindListeners: function () {
            var b = this,
                c = a(this.element),
                d = function () {
                    m.measure.viewport();
                    m.measure.fbElements.call(b);
                    c.hasClass("fluidbox--opened") && b.compute()
                };
            a.isFunction(a.throttle) ? f.on("resize.fluidbox" + b.instanceData.id, a.throttle(b.settings.resizeThrottle, d)) : f.on("resize.fluidbox" + b.instanceData.id, d);
            c.on("reposition.fluidbox", function () {
                b.reposition()
            });
            c.on("recompute.fluidbox, compute.fluidbox", function () {
                b.compute()
            });
            c.on("destroy.fluidbox", function () {
                b.destroy()
            });
            c.on("close.fluidbox", function () {
                b.close()
            });
        },
        unbind: function () {
            a(this.element).off("click.fluidbox reposition.fluidbox recompute.fluidbox compute.fluidbox destroy.fluidbox close.fluidbox");
            f.off("resize.fluidbox" + this.instanceData.id);
        },
        reposition: function () {
            m.measure.fbElements.call(this)
        },
        destroy: function () {
            var b = this.instanceData.originalNode;
            this.unbind();
            a.data(this.element, "plugin_" + g, null);
            a(this.element).removeClass(function (a, b) {
                return (b.match(/(^|\s)fluidbox[--|__]\S+/g) || []).join(" ")
            }).empty().html(b).addClass("fluidbox--destroyed").trigger("destroyed.fluidbox");
        },
        getMetadata: function () {
            return this.instanceData
        }
    });

    a.fn[g] = function (b) {
        var c = arguments;
        if (b === d || "object" == typeof b) return this.each(function () {
            a.data(this, "plugin_" + g) || a.data(this, "plugin_" + g, new e(this, b))
        });
        if ("string" == typeof b && "_" !== b[0] && "init" !== b) {
            var f;
            return this.each(function () {
                var d = a.data(this, "plugin_" + g);
                d instanceof e && "function" == typeof d[b] ? f = d[b].apply(d, Array.prototype.slice.call(c, 1)) : console.warn('Fluidbox: The method "' + b + '" used is not defined in Fluidbox. Please make sure you are calling the correct public method.')
            }), f !== d ? f : this
        }
        return this
    }
}(jQuery, window, document);