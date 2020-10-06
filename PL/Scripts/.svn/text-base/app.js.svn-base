/*                  ______________________________________
           ________|                                      |_______
           \       |           SmartAdmin WebApp          |      /
            \      |      Copyright © 2016 MyOrange       |     /
            /      |______________________________________|     \
           /__________)                                (_________\

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * =======================================================================
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * =======================================================================
 * original filename  : app.js
 * filesize           : ??
 * author             : Sunny (@bootstraphunt)
 * email              : info@myorange.ca
 *    
 * =======================================================================
 * INDEX (Note: line numbers for index items may not be up to date):
 * 
 * 1. APP CONFIGURATION..................................[ app.config.js ]
 * 2. APP DOM REFERENCES.................................[ app.config.js ]
 * 3. DETECT MOBILE DEVICES...................................[line: 149 ]
 * 4. CUSTOM MENU PLUGIN......................................[line: 688 ]
 * 5. ELEMENT EXIST OR NOT....................................[line: 778 ]
 * 6. INITIALIZE FORMS........................................[line: 788 ]
 * 		6a. BOOTSTRAP SLIDER PLUGIN...........................[line: 794 ]
 * 		6b. SELECT2 PLUGIN....................................[line: 803 ]
 * 		6c. MASKING...........................................[line: 824 ]
 * 		6d. AUTOCOMPLETE......................................[line: 843 ]
 * 		6f. JQUERY UI DATE....................................[line: 862 ]
 * 		6g. AJAX BUTTON LOADING TEXT..........................[line: 884 ]
 * 7. INITIALIZE CHARTS.......................................[line: 902 ]
 * 		7a. SPARKLINES........................................[line: 907 ]
 * 		7b. LINE CHART........................................[line: 1026]
 * 		7c. PIE CHART.........................................[line: 1077]
 * 		7d. BOX PLOT..........................................[line: 1100]
 * 		7e. BULLET............................................[line: 1145]
 * 		7f. DISCRETE..........................................[line: 1169]
 * 		7g. TRISTATE..........................................[line: 1195]
 * 		7h. COMPOSITE: BAR....................................[line: 1223]
 * 		7i. COMPOSITE: LINE...................................[line: 1259]
 * 		7j. EASY PIE CHARTS...................................[line: 1339]
 * 8. INITIALIZE JARVIS WIDGETS...............................[line: 1379]
 * 		8a. SETUP DESKTOP WIDGET..............................[line: 1466]
 * 		8b. GOOGLE MAPS.......................................[line: 1478]
 * 		8c. LOAD SCRIPTS......................................[line: 1500]
 * 		8d. APP AJAX REQUEST SETUP............................[line: 1538]
 * 9. CHECK TO SEE IF URL EXISTS..............................[line: 1614]
 * 10.LOAD AJAX PAGES.........................................[line: 1669]
 * 11.UPDATE BREADCRUMB.......................................[line: 1775]
 * 12.PAGE SETUP..............................................[line: 1798]
 * 13.POP OVER THEORY.........................................[line: 1852]
 * 14.DELETE MODEL DATA ON HIDDEN.............................[line: 1991]
 * 15.HELPFUL FUNCTIONS.......................................[line: 2027]
 * 
 * =======================================================================
 *       IMPORTANT: ALL CONFIG VARS IS NOW MOVED TO APP.CONFIG.JS
 * =======================================================================
 * 
 * 
 * GLOBAL: interval array (to be used with jarviswidget in ajax and 
 * angular mode) to clear auto fetch interval
 */
$.intervalArr = [];
/*
 * Calculate nav height
 */
var calc_navbar_height = function () {
    var height = null;

    if ($('#header').length)
        height = $('#header').height();

    if (height === null)
        height = $('<div id="header"></div>').height();

    if (height === null)
        return 49;
    // default
    return height;
},

	navbar_height = calc_navbar_height,
/*
 * APP DOM REFERENCES
 * Description: Obj DOM reference, please try to avoid changing these
 */
	shortcut_dropdown = $('#shortcut'),

	bread_crumb = $('#ribbon ol.breadcrumb'),
/*
 * Top menu on/off
 */
	topmenu = false,
/*
 * desktop or mobile
 */
	thisDevice = null,
/*
 * DETECT MOBILE DEVICES
 * Description: Detects mobile device - if any of the listed device is 
 * detected a class is inserted to $.root_ and the variable thisDevice 
 * is decleard. (so far this is covering most hand held devices)
 */
	ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
/*
 * JS ARRAY SCRIPT STORAGE
 * Description: used with loadScript to store script path and file name
 * so it will not load twice
 */
	jsArray = {},
/*
 * App Initialize
 * Description: Initializes the app with intApp();
 */
	initApp = (function (app) {

	    /*
		 * ADD DEVICE TYPE
		 * Detect if mobile or desktop
		 */
	    app.addDeviceType = function () {

	        if (!ismobile) {
	            // Desktop
	            $.root_.addClass("desktop-detected");
	            thisDevice = "desktop";
	            return false;
	        } else {
	            // Mobile
	            $.root_.addClass("mobile-detected");
	            thisDevice = "mobile";

	            if (fastClick) {
	                // Removes the tap delay in idevices
	                // dependency: js/plugin/fastclick/fastclick.js 
	                $.root_.addClass("needsclick");
	                FastClick.attach(document.body);
	                return false;
	            }

	        }

	    };
	    /* ~ END: ADD DEVICE TYPE */

	    /*
		 * CHECK FOR MENU POSITION
		 * Scans localstroage for menu position (vertical or horizontal)
		 */
	    app.menuPos = function () {

	        if ($.root_.hasClass("menu-on-top") || localStorage.getItem('sm-setmenu') == 'top') {
	            topmenu = true;
	            $.root_.addClass("menu-on-top");
	        }
	    };
	    /* ~ END: CHECK MOBILE DEVICE */

	    /*
		 * SMART ACTIONS
		 */
	    app.SmartActions = function () {

	        var smartActions = {

	            // LOGOUT MSG 
	            userLogout: function ($this) {

	                // ask verification
	                $.SmartMessageBox({
	                    title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
	                    content: $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
	                    buttons: '[No][Yes]'

	                }, function (ButtonPressed) {
	                    if (ButtonPressed == "Yes") {
	                        $.root_.addClass('animated fadeOutUp');
	                        setTimeout(logout, 1000);
	                    }
	                });
	                function logout() {
	                    window.location = $this.attr('href');
	                }

	            },

	            // RESET WIDGETS
	            resetWidgets: function ($this) {

	                $.SmartMessageBox({
	                    title: "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
	                    content: $this.data('reset-msg') || "Would you like to RESET all your saved widgets and clear LocalStorage?1",
	                    buttons: '[No][Yes]'
	                }, function (ButtonPressed) {
	                    if (ButtonPressed == "Yes" && localStorage) {
	                        localStorage.clear();
	                        location.reload();
	                    }

	                });
	            },

	            // LAUNCH FULLSCREEN 
	            launchFullscreen: function (element) {

	                if (!$.root_.hasClass("full-screen")) {

	                    $.root_.addClass("full-screen");

	                    if (element.requestFullscreen) {
	                        element.requestFullscreen();
	                    } else if (element.mozRequestFullScreen) {
	                        element.mozRequestFullScreen();
	                    } else if (element.webkitRequestFullscreen) {
	                        element.webkitRequestFullscreen();
	                    } else if (element.msRequestFullscreen) {
	                        element.msRequestFullscreen();
	                    }

	                } else {

	                    $.root_.removeClass("full-screen");

	                    if (document.exitFullscreen) {
	                        document.exitFullscreen();
	                    } else if (document.mozCancelFullScreen) {
	                        document.mozCancelFullScreen();
	                    } else if (document.webkitExitFullscreen) {
	                        document.webkitExitFullscreen();
	                    }

	                }

	            },

	            // MINIFY MENU
	            minifyMenu: function ($this) {
	                if (!$.root_.hasClass("menu-on-top")) {
	                    $.root_.toggleClass("minified");
	                    $.root_.removeClass("hidden-menu");
	                    $('html').removeClass("hidden-menu-mobile-lock");
	                    $this.effect("highlight", {}, 500);
	                }
	            },

	            // TOGGLE MENU 
	            toggleMenu: function () {
	                if (!$.root_.hasClass("menu-on-top")) {
	                    $('html').toggleClass("hidden-menu-mobile-lock");
	                    $.root_.toggleClass("hidden-menu");
	                    $.root_.removeClass("minified");
	                    //} else if ( $.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated") ) {
	                    // suggested fix from Christian Jäger	
	                } else if ($.root_.hasClass("menu-on-top") && $(window).width() < 979) {
	                    $('html').toggleClass("hidden-menu-mobile-lock");
	                    $.root_.toggleClass("hidden-menu");
	                    $.root_.removeClass("minified");
	                }
	            },

	            // TOGGLE SHORTCUT 
	            toggleShortcut: function () {

	                if (shortcut_dropdown.is(":visible")) {
	                    shortcut_buttons_hide();
	                } else {
	                    shortcut_buttons_show();
	                }

	                // SHORT CUT (buttons that appear when clicked on user name)
	                shortcut_dropdown.find('a').click(function (e) {
	                    e.preventDefault();
	                    window.location = $(this).attr('href');
	                    setTimeout(shortcut_buttons_hide, 300);

	                });

	                // SHORTCUT buttons goes away if mouse is clicked outside of the area
	                $(document).mouseup(function (e) {
	                    if (!shortcut_dropdown.is(e.target) && shortcut_dropdown.has(e.target).length === 0) {
	                        shortcut_buttons_hide();
	                    }
	                });

	                // SHORTCUT ANIMATE HIDE
	                function shortcut_buttons_hide() {
	                    shortcut_dropdown.animate({
	                        height: "hide"
	                    }, 300, "easeOutCirc");
	                    $.root_.removeClass('shortcut-on');

	                }

	                // SHORTCUT ANIMATE SHOW
	                function shortcut_buttons_show() {
	                    shortcut_dropdown.animate({
	                        height: "show"
	                    }, 200, "easeOutCirc");
	                    $.root_.addClass('shortcut-on');
	                }

	            }

	        };

	        /*
			 * BUTTON ACTIONS 
			 */

	        $.root_.on('click', '[data-action="launchFullscreen"]', function (e) {
	            smartActions.launchFullscreen(document.documentElement);
	            e.preventDefault();
	        });

	        $.root_.on('click', '[data-action="minifyMenu"]', function (e) {
	            var $this = $(this);
	            smartActions.minifyMenu($this);
	            e.preventDefault();

	            //clear memory reference
	            $this = null;
	        });

	        $.root_.on('click', '[data-action="toggleMenu"]', function (e) {
	            smartActions.toggleMenu();
	            e.preventDefault();
	        });

	        $.root_.on('click', '[data-action="toggleShortcut"]', function (e) {
	            smartActions.toggleShortcut();
	            e.preventDefault();
	        });

	    };
	    /* ~ END: SMART ACTIONS */

	    /*
		 * ACTIVATE NAVIGATION
		 * Description: Activation will fail if top navigation is on
		 */
	    app.leftNav = function () {

	        // INITIALIZE LEFT NAV
	        if (!topmenu) {
	            if (!null) {
	                $('nav ul').jarvismenu({
	                    accordion: menu_accordion || true,
	                    speed: menu_speed || true,
	                    closedSign: '<em class="fa fa-plus-square-o"></em>',
	                    openedSign: '<em class="fa fa-minus-square-o"></em>'
	                });
	            } else {
	                alert("Error - menu anchor does not exist");
	            }
	        }

	    };
	    /* ~ END: ACTIVATE NAVIGATION */

	    /*
		 * MISCELANEOUS DOM READY FUNCTIONS
		 * Description: fire with jQuery(document).ready...
		 */
	    app.domReadyMisc = function () {

	        /*
			 * FIRE TOOLTIPS
			 */
	        if ($("[rel=tooltip]").length) {
	            $("[rel=tooltip]").tooltip();
	        }

	        // SHOW & HIDE MOBILE SEARCH FIELD
	        $('#search-mobile').click(function () {
	            $.root_.addClass('search-mobile');
	        });

	        $('#cancel-search-js').click(function () {
	            $.root_.removeClass('search-mobile');
	        });

	        // ACTIVITY
	        // ajax drop
	        $('#activity').click(function (e) {
	            var $this = $(this);

	            if ($this.find('.badge').hasClass('bg-color-red')) {
	                $this.find('.badge').removeClassPrefix('bg-color-');
	                $this.find('.badge').text("0");
	            }

	            if (!$this.next('.ajax-dropdown').is(':visible')) {
	                $this.next('.ajax-dropdown').fadeIn(150);
	                $this.addClass('active');
	            } else {
	                $this.next('.ajax-dropdown').fadeOut(150);
	                $this.removeClass('active');
	            }

	            var theUrlVal = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');

	            //clear memory reference
	            $this = null;
	            theUrlVal = null;

	            e.preventDefault();
	        });

	        $('input[name="activity"]').change(function () {
	            var $this = $(this);

	            url = $this.attr('id');
	            container = $('.ajax-notifications');

	            loadURL(url, container);

	            //clear memory reference
	            $this = null;
	        });

	        // close dropdown if mouse is not inside the area of .ajax-dropdown
	        $(document).mouseup(function (e) {
	            if (!$('.ajax-dropdown').is(e.target) && $('.ajax-dropdown').has(e.target).length === 0) {
	                $('.ajax-dropdown').fadeOut(150);
	                $('.ajax-dropdown').prev().removeClass("active");
	            }
	        });

	        // loading animation (demo purpose only)
	        $('button[data-btn-loading]').on('click', function () {
	            var btn = $(this);
	            btn.button('loading');
	            setTimeout(function () {
	                btn.button('reset');
	            }, 3000);
	        });

	        // NOTIFICATION IS PRESENT
	        // Change color of lable once notification button is clicked

	        $this = $('#activity > .badge');

	        if (parseInt($this.text()) > 0) {
	            $this.addClass("bg-color-red bounceIn animated");

	            //clear memory reference
	            $this = null;
	        }


	    };
	    /* ~ END: MISCELANEOUS DOM */

	    /*
		 * MISCELANEOUS DOM READY FUNCTIONS
		 * Description: fire with jQuery(document).ready...
		 */
	    app.mobileCheckActivation = function () {

	        if ($(window).width() < 979) {
	            $.root_.addClass('mobile-view-activated');
	            $.root_.removeClass('minified');
	        } else if ($.root_.hasClass('mobile-view-activated')) {
	            $.root_.removeClass('mobile-view-activated');
	        }

	        //if (debugState) {
	        //    console.log("mobileCheckActivation");
	        //}

	    }
	    /* ~ END: MISCELANEOUS DOM */
	    app.pathBase = function () {
	        return ($("#rutaRelativa").val().length <= 1) ? "" : $("#rutaRelativa").val();
	    }();

	    app.zonaHoraria = function () {
	        return " " + $("#zonaHoraria").val();
	    }();

	    app.fechaActual = function () {
	        return $("#fechaActual").val();
	    }();

	    return app;

	})({});

initApp.addDeviceType();
initApp.menuPos();
/*
 * DOCUMENT LOADED EVENT
 * Description: Fire when DOM is ready
 */
jQuery(document).ready(function () {

    initApp.SmartActions();
    initApp.leftNav();
    initApp.domReadyMisc();

});
/*
 * RESIZER WITH THROTTLE
 * Source: http://benalman.com/code/projects/jquery-resize/examples/resize/
 */
(function ($, window, undefined) {

    var elems = $([]),
        jq_resize = $.resize = $.extend($.resize, {}),
        timeout_id, str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_throttle = 'throttleWindow';

    jq_resize[str_delay] = throttle_delay;

    jq_resize[str_throttle] = true;

    $.event.special[str_resize] = {

        setup: function () {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);
            elems = elems.add(elem);
            try {
                $.data(this, str_data, {
                    w: elem.width(),
                    h: elem.height()
                });
            } catch (e) {
                $.data(this, str_data, {
                    w: elem.width, // elem.width();
                    h: elem.height // elem.height();
                });
            }

            if (elems.length === 1) {
                loopy();
            }
        },
        teardown: function () {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);
            elems = elems.not(elem);
            elem.removeData(str_data);
            if (!elems.length) {
                clearTimeout(timeout_id);
            }
        },

        add: function (handleObj) {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }
            var old_handler;

            function new_handler(e, w, h) {
                var elem = $(this),
                    data = $.data(this, str_data);
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply(this, arguments);
            }
            if ($.isFunction(handleObj)) {
                old_handler = handleObj;
                return new_handler;
            } else {
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }
    };

    function loopy() {
        timeout_id = window[str_setTimeout](function () {
            elems.each(function () {
                var width;
                var height;

                var elem = $(this),
                    data = $.data(this, str_data); //width = elem.width(), height = elem.height();

                // Highcharts fix
                try {
                    width = elem.width();
                } catch (e) {
                    width = elem.width;
                }

                try {
                    height = elem.height();
                } catch (e) {
                    height = elem.height;
                }
                //fixed bug


                if (width !== data.w || height !== data.h) {
                    elem.trigger(str_resize, [data.w = width, data.h = height]);
                }

            });
            loopy();

        }, jq_resize[str_delay]);

    }

})(jQuery, this);
/*
* ADD CLASS WHEN BELOW CERTAIN WIDTH (MOBILE MENU)
* Description: tracks the page min-width of #CONTENT and NAV when navigation is resized.
* This is to counter bugs for minimum page width on many desktop and mobile devices.
* Note: This script utilizes JSthrottle script so don't worry about memory/CPU usage
*/
$('#main').resize(function () {

    initApp.mobileCheckActivation();

});

/* ~ END: NAV OR #LEFT-BAR RESIZE DETECT */

/*
 * DETECT IE VERSION
 * Description: A short snippet for detecting versions of IE in JavaScript
 * without resorting to user-agent sniffing
 * RETURNS:
 * If you're not in IE (or IE version is less than 5) then:
 * //ie === undefined
 *
 * If you're in IE (>=5) then you can determine which version:
 * // ie === 7; // IE7
 *
 * Thus, to detect IE:
 * // if (ie) {}
 *
 * And to detect the version:
 * ie === 6 // IE6
 * ie > 7 // IE8, IE9 ...
 * ie < 9 // Anything less than IE9
 */
// TODO: delete this function later on - no longer needed (?)
var ie = (function () {

    var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');

    while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);

    return v > 4 ? v : undef;

}());
/* ~ END: DETECT IE VERSION */

/*
 * CUSTOM MENU PLUGIN
 */
$.fn.extend({

    //pass the options variable to the function
    jarvismenu: function (options) {

        var defaults = {
            accordion: 'true',
            speed: 200,
            closedSign: '[+]',
            openedSign: '[-]'
        },

        // Extend our default options with those provided.
            opts = $.extend(defaults, options),
        //Assign current element to variable, in this case is UL element
            $this = $(this);

        //add a mark [+] to a multilevel menu
        $this.find("li").each(function () {
            if ($(this).find("ul").size() !== 0) {
                //add the multilevel sign next to the link
                $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

                //avoid jumping to the top of the page when the href is an #
                if ($(this).find("a:first").attr('href') == "#") {
                    $(this).find("a:first").click(function () {
                        return false;
                    });
                }
            }
        });

        //open active level
        $this.find("li.active").each(function () {
            $(this).parents("ul").slideDown(opts.speed);
            $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
            $(this).parents("ul").parent("li").addClass("open");
        });

        $this.find("li a").click(function () {

            if ($(this).parent().find("ul").size() !== 0) {

                if (opts.accordion) {
                    //Do nothing when the list is open
                    if (!$(this).parent().find("ul").is(':visible')) {
                        parents = $(this).parent().parents("ul");
                        visible = $this.find("ul:visible");
                        visible.each(function (visibleIndex) {
                            var close = true;
                            parents.each(function (parentIndex) {
                                if (parents[parentIndex] == visible[visibleIndex]) {
                                    close = false;
                                    return false;
                                }
                            });
                            if (close) {
                                if ($(this).parent().find("ul") != visible[visibleIndex]) {
                                    $(visible[visibleIndex]).slideUp(opts.speed, function () {
                                        $(this).parent("li").find("b:first").html(opts.closedSign);
                                        $(this).parent("li").removeClass("open");
                                    });

                                }
                            }
                        });
                    }
                }// end if
                if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
                    $(this).parent().find("ul:first").slideUp(opts.speed, function () {
                        $(this).parent("li").removeClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
                    });

                } else {
                    $(this).parent().find("ul:first").slideDown(opts.speed, function () {
                        /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
                        $(this).parent("li").addClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
                    });
                } // end else
            } // end if
        });
    } // end function
});
/* ~ END: CUSTOM MENU PLUGIN */

/*
 * ELEMENT EXIST OR NOT
 * Description: returns true or false
 * Usage: $('#myDiv').doesExist();
 */
jQuery.fn.doesExist = function () {
    return jQuery(this).length > 0;
};
/* ~ END: ELEMENT EXIST OR NOT */

/*
 * INITIALIZE FORMS
 * Description: Select2, Masking, Datepicker, Autocomplete
 */
function runAllForms() {

    /*
     * BOOTSTRAP SLIDER PLUGIN
     * Usage:
     * Dependency: js/plugin/bootstrap-slider
     */
    if ($.fn.slider) {
        $('.slider').slider();
    }

    /*
     * SELECT2 PLUGIN
     * Usage:
     * Dependency: js/plugin/select2/
     */
    if ($.fn.select2) {
        $('select.select2').each(function () {
            var $this = $(this),
                width = $this.attr('data-select-width') || '100%';
            //, _showSearchInput = $this.attr('data-select-search') === 'true';
            $this.select2({
                //showSearchInput : _showSearchInput,
                allowClear: true,
                width: width
            });

            //clear memory reference
            $this = null;
        });
    }

    /*
     * MASKING
     * Dependency: js/plugin/masked-input/
     */
    if ($.fn.mask) {
        $('[data-mask]').each(function () {

            var $this = $(this),
                mask = $this.attr('data-mask') || 'error...', mask_placeholder = $this.attr('data-mask-placeholder') || 'X';

            $this.mask(mask, {
                placeholder: mask_placeholder
            });

            //clear memory reference
            $this = null;
        });
    }

    /*
     * AUTOCOMPLETE
     * Dependency: js/jqui
     */
    if ($.fn.autocomplete) {
        $('[data-autocomplete]').each(function () {

            var $this = $(this),
                availableTags = $this.data('autocomplete') || ["The", "Quick", "Brown", "Fox", "Jumps", "Over", "Three", "Lazy", "Dogs"];

            $this.autocomplete({
                source: availableTags
            });

            //clear memory reference
            $this = null;
        });
    }

    /*
     * JQUERY UI DATE
     * Dependency: js/libs/jquery-ui-1.10.3.min.js
     * Usage: <input class="datepicker" />
     */
    if ($.fn.datepicker) {
        $('.datepicker').each(function () {

            var $this = $(this),
                dataDateFormat = $this.attr('data-dateformat') || 'dd.mm.yy';

            $this.datepicker({
                dateFormat: dataDateFormat,
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
            });

            //clear memory reference
            $this = null;
        });
    }

    /*
     * AJAX BUTTON LOADING TEXT
     * Usage: <button type="button" data-loading-text="Loading..." class="btn btn-xs btn-default ajax-refresh"> .. </button>
     */
    $('button[data-loading-text]').on('click', function () {
        var btn = $(this);
        btn.button('loading');
        setTimeout(function () {
            btn.button('reset');
            //clear memory reference
            btn = null;
        }, 3000);

    });

}
/* ~ END: INITIALIZE FORMS */


/*
 * GOOGLE MAPS
 * description: Append google maps to head dynamically (only execute for ajax version)
 * Loads at the begining for ajax pages
 */
if ($.navAsAjax || $(".google_maps")) {
    var gMapsLoaded = false;
    window.gMapsCallback = function () {
        gMapsLoaded = true;
        $(window).trigger('gMapsLoaded');
    };
    window.loadGoogleMaps = function () {
        if (gMapsLoaded)
            return window.gMapsCallback();
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "http://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback");
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    };
}
/* ~ END: GOOGLE MAPS */

/*
 * LOAD SCRIPTS
 * Usage:
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */
function loadScript(scriptName, callback) {

    if (!jsArray[scriptName]) {
        jsArray[scriptName] = true;

        // adding the script tag to the head as suggested before
        var body = document.getElementsByTagName('body')[0],
            script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptName;

        // then bind the event to the callback function
        // there are several events for cross browser compatibility
        script.onload = callback;

        // fire the loading
        body.appendChild(script);

        // clear DOM reference
        //body = null;
        //script = null;

    } else if (callback) {
        // changed else to else if(callback)
        if (debugState) {
            root.root.console.log("This script was already loaded %c: " + scriptName, debugStyle_warning);
        }
        //execute function
        callback();
    }

}
/* ~ END: LOAD SCRIPTS */

/*
* APP AJAX REQUEST SETUP
* Description: Executes and fetches all ajax requests also
* updates naivgation elements to active
*/
if ($.navAsAjax) {
    // fire this on page load if nav exists
    if ($('nav').length) {
        checkURL();
    }

    $(document).on('click', 'nav a[href!="#"]', function (e) {
        e.preventDefault();
        var $this = $(e.currentTarget);

        // if parent is not active then get hash, or else page is assumed to be loaded
        if (!$this.parent().hasClass("active") && !$this.attr('target')) {

            // update window with hash
            // you could also do here:  thisDevice === "mobile" - and save a little more memory

            if ($.root_.hasClass('mobile-view-activated')) {
                $.root_.removeClass('hidden-menu');
                $('html').removeClass("hidden-menu-mobile-lock");
                window.setTimeout(function () {
                    if (window.location.search) {
                        window.location.href =
                            window.location.href.replace(window.location.search, '')
                                .replace(window.location.hash, '') + '#' + $this.attr('href');
                    } else {
                        window.location.hash = $this.attr('href');
                    }
                }, 150);
                // it may not need this delay...
            } else {
                if (window.location.search) {
                    window.location.href =
                        window.location.href.replace(window.location.search, '')
                            .replace(window.location.hash, '') + '#' + $this.attr('href');
                } else {
                    window.location.hash = $this.attr('href');
                }
            }

            // clear DOM reference
            // $this = null;
        }

    });

    // fire links with targets on different window
    $(document).on('click', 'nav a[target="_blank"]', function (e) {
        e.preventDefault();
        var $this = $(e.currentTarget);

        window.open($this.attr('href'));
    });

    // fire links with targets on same window
    $(document).on('click', 'nav a[target="_top"]', function (e) {
        e.preventDefault();
        var $this = $(e.currentTarget);

        window.location = ($this.attr('href'));
    });

    // all links with hash tags are ignored
    $(document).on('click', 'nav a[href="#"]', function (e) {
        e.preventDefault();
    });

    // DO on hash change
    $(window).on('hashchange', function () {
        checkURL();
    });
}
/*
 * CHECK TO SEE IF URL EXISTS
 */
function checkURL() {

    //get the url by removing the hash
    //var url = location.hash.replace(/^#/, '');
    var url = location.href.split('#').splice(1).join('#');
    //BEGIN: IE11 Work Around
    if (!url) {

        try {
            var documentUrl = window.document.URL;
            if (documentUrl) {
                if (documentUrl.indexOf('#', 0) > 0 && documentUrl.indexOf('#', 0) < (documentUrl.length + 1)) {
                    url = documentUrl.substring(documentUrl.indexOf('#', 0) + 1);

                }

            }

        } catch (err) { }
    }
    //END: IE11 Work Around

    container = $('#content');
    // Do this if url exists (for page refresh, etc...)
    if (url) {
        // remove all active class
        $('nav li.active').removeClass("active");
        // match the url and add the active class
        $('nav li:has(a[href="' + url + '"])').addClass("active");
        var title = ($('nav a[href="' + url + '"]').attr('title'));

        // change page title from global var
        document.title = (title || document.title);

        // debugState
        if (debugState) {
            root.console.log("Page title: %c " + document.title, debugStyle_green);
        }

        // parse url to jquery
        loadURL(url + location.search, container);

    } else {

        // grab the first URL from nav
        var $this = $('nav > ul > li:first-child > a[href!="#"]');

        //update hash
        window.location.hash = $this.attr('href');

        //clear dom reference
        $this = null;

    }

}
/*
 * LOAD AJAX PAGES
 */
function loadURL(url, container) {

    // debugState
    if (debugState) {
        root.root.console.log("Loading URL: %c" + url, debugStyle);
    }

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'html',
        cache: true, // (warning: setting it to false will cause a timestamp and will call the request twice)
        beforeSend: function () {

            //IE11 bug fix for googlemaps (delete all google map instances)
            //check if the page is ajax = true, has google map class and the container is #content
            if ($.navAsAjax && $(".google_maps")[0] && (container[0] == $("#content")[0])) {

                // target gmaps if any on page
                var collection = $(".google_maps"),
                    i = 0;
                // run for each	map
                collection.each(function () {
                    i++;
                    // get map id from class elements
                    var divDealerMap = document.getElementById(this.id);

                    if (i == collection.length + 1) {
                        // "callback"
                    } else {
                        // destroy every map found
                        if (divDealerMap) divDealerMap.parentNode.removeChild(divDealerMap);

                        // debugState
                        if (debugState) {
                            root.console.log("Destroying maps.........%c" + this.id, debugStyle_warning);
                        }
                    }
                });

                // debugState
                if (debugState) {
                    root.console.log("✔ Google map instances nuked!!!");
                }

            } //end fix

            // destroy all datatable instances
            if ($.navAsAjax && $('.dataTables_wrapper')[0] && (container[0] == $("#content")[0])) {

                var tables = $.fn.dataTable.fnTables(true);
                $(tables).each(function () {

                    if ($(this).find('.details-control').length != 0) {
                        $(this).find('*').addBack().off().remove();
                        $(this).dataTable().fnDestroy();
                    } else {
                        $(this).dataTable().fnDestroy();
                    }

                });

                // debugState
                if (debugState) {
                    root.console.log("✔ Datatable instances nuked!!!");
                }
            }
            // end destroy

            // pop intervals (destroys jarviswidget related intervals)
            if ($.navAsAjax && $.intervalArr.length > 0 && (container[0] == $("#content")[0]) && enableJarvisWidgets) {

                while ($.intervalArr.length > 0)
                    clearInterval($.intervalArr.pop());
                // debugState
                if (debugState) {
                    root.console.log("✔ All JarvisWidget intervals cleared");
                }

            }
            // end pop intervals

            // destroy all widget instances
            if ($.navAsAjax && (container[0] == $("#content")[0]) && enableJarvisWidgets && $("#widget-grid")[0]) {

                $("#widget-grid").jarvisWidgets('destroy');
                // debugState
                if (debugState) {
                    root.console.log("✔ JarvisWidgets destroyed");
                }

            }
            // end destroy all widgets 

            // cluster destroy: destroy other instances that could be on the page 
            // this runs a script in the current loaded page before fetching the new page
            if ($.navAsAjax && (container[0] == $("#content")[0])) {

                /*
                 * The following elements should be removed, if they have been created:
                 *
                 *	colorList
                 *	icon
                 *	picker
                 *	inline
                 *	And unbind events from elements:
                 *	
                 *	icon
                 *	picker
                 *	inline
                 *	especially $(document).on('mousedown')
                 *	It will be much easier to add namespace to plugin events and then unbind using selected namespace.
                 *	
                 *	See also:
                 *	
                 *	http://f6design.com/journal/2012/05/06/a-jquery-plugin-boilerplate/
                 *	http://keith-wood.name/pluginFramework.html
                 */

                // this function is below the pagefunction for all pages that has instances

                if (typeof pagedestroy == 'function') {

                    try {
                        pagedestroy();

                        if (debugState) {
                            root.console.log("✔ Pagedestroy()");
                        }
                    }
                    catch (err) {
                        pagedestroy = undefined;

                        if (debugState) {
                            root.console.log("! Pagedestroy() Catch Error");
                        }
                    }

                }

                // destroy all inline charts

                if ($.fn.sparkline && $("#content .sparkline")[0]) {
                    $("#content .sparkline").sparkline('destroy');

                    if (debugState) {
                        root.console.log("✔ Sparkline Charts destroyed!");
                    }
                }

                if ($.fn.easyPieChart && $("#content .easy-pie-chart")[0]) {
                    $("#content .easy-pie-chart").easyPieChart('destroy');

                    if (debugState) {
                        root.console.log("✔ EasyPieChart Charts destroyed!");
                    }
                }



                // end destory all inline charts

                // destroy form controls: Datepicker, select2, autocomplete, mask, bootstrap slider

                if ($.fn.select2 && $("#content select.select2")[0]) {
                    $("#content select.select2").select2('destroy');

                    if (debugState) {
                        root.console.log("✔ Select2 destroyed!");
                    }
                }

                if ($.fn.mask && $('#content [data-mask]')[0]) {
                    $('#content [data-mask]').unmask();

                    if (debugState) {
                        root.console.log("✔ Input Mask destroyed!");
                    }
                }

                if ($.fn.datepicker && $('#content .datepicker')[0]) {
                    $('#content .datepicker').off();
                    $('#content .datepicker').remove();

                    if (debugState) {
                        root.console.log("✔ Datepicker destroyed!");
                    }
                }

                if ($.fn.slider && $('#content .slider')[0]) {
                    $('#content .slider').off();
                    $('#content .slider').remove();

                    if (debugState) {
                        root.console.log("✔ Bootstrap Slider destroyed!");
                    }
                }

                // end destroy form controls


            }
            // end cluster destroy

            // empty container and var to start garbage collection (frees memory)
            pagefunction = null;
            container.removeData().html("");

            // place cog
            container.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');

            // Only draw breadcrumb if it is main content material
            if (container[0] == $("#content")[0]) {

                // clear everything else except these key DOM elements
                // we do this because sometime plugins will leave dynamic elements behind
                $('body').find('> *').filter(':not(' + ignore_key_elms + ')').empty().remove();

                // draw breadcrumb
                drawBreadCrumb();

                // scroll up
                $("html").animate({
                    scrollTop: 0
                }, "fast");
            }
            // end if
        },
        success: function (data) {

            // dump data to container
            container.css({
                opacity: '0.0'
            }).html(data).delay(50).animate({
                opacity: '1.0'
            }, 300);

            // clear data var
            data = null;
            container = null;
        },
        error: function (xhr, status, thrownError, error) {
            container.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + url + '</span>: ' + xhr.status + ' <span style="text-transform: capitalize;">' + thrownError + '</span></h4>');
        },
        async: true
    });

}
/*
 * UPDATE BREADCRUMB
 */
function drawBreadCrumb(opt_breadCrumbs) {
    var a = $("nav li.active > a, nav li.open > a"),
        b = a.length;

    bread_crumb.empty(),
    //bread_crumb.append($("<li>Home</li>")),
    a.each(function () {
        bread_crumb.append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text()))), --b || (document.title = bread_crumb.find("li:last-child").text())
    });

    // Push breadcrumb manually -> drawBreadCrumb(["Users", "John Doe"]);
    // Credits: Philip Whitt | philip.whitt@sbcglobal.net
    if (opt_breadCrumbs != undefined) {
        $.each(opt_breadCrumbs, function (index, value) {
            bread_crumb.append($("<li></li>").html(value));
            document.title = bread_crumb.find("li:last-child").text();
        });
    }
}
/* ~ END: APP AJAX REQUEST SETUP */

/*
 * PAGE SETUP
 * Description: fire certain scripts that run through the page
 * to check for form elements, tooltip activation, popovers, etc...
 */
function pageSetUp() {

    if (thisDevice === "desktop") {
        // is desktop

        // activate tooltips
        $("[rel=tooltip], [data-rel=tooltip]").tooltip();

        // activate popovers
        $("[rel=popover], [data-rel=popover]").popover();

        // activate popovers with hover states
        $("[rel=popover-hover], [data-rel=popover-hover]").popover({
            trigger: "hover"
        });


    } else {

        // is mobile

        // activate popovers
        $("[rel=popover], [data-rel=popover]").popover();

        // activate popovers with hover states
        $("[rel=popover-hover], [data-rel=popover-hover]").popover({
            trigger: "hover"
        });

    }

}
/* ~ END: PAGE SETUP */

/*
 * ONE POP OVER THEORY
 * Keep only 1 active popover per trigger - also check and hide active popover if user clicks on document
 */
$('body').on('click', function (e) {
    $('[rel="popover"], [data-rel="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});
/* ~ END: ONE POP OVER THEORY */

/*
 * DELETE MODEL DATA ON HIDDEN
 * Clears the model data once it is hidden, this way you do not create duplicated data on multiple modals
 */
$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});
/* ~ END: DELETE MODEL DATA ON HIDDEN */

/*
 * HELPFUL FUNCTIONS
 * We have included some functions below that can be resued on various occasions
 * 
 * Get param value
 * example: alert( getParam( 'param' ) );
 */
function getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}
/* ~ END: HELPFUL FUNCTIONS */

var handleMensaje = {

    mensajeInfo: function (mensaje) {

        //var types = type;

        //$.each(types, function (index, type) {
        new BootstrapDialog({
            message: mensaje,
            cssClass: 'modalmensaje',
            type: BootstrapDialog.TYPE_INFO,
            title: ' <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Información'
        }).open();
        //});
    },
    mensajeError: function (mensaje, type) {

        //var types = type;

        //$.each(types, function (index, type) {
        new BootstrapDialog({
                message: mensaje,
                cssClass: 'modalmensaje',
                //type: BootstrapDialog.TYPE_ERROR,
                type: BootstrapDialog.TYPE_DANGER,
                title: ' <span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span> Error',
                
            }).open();
        //});
    },
    mensajeExito: function (mensaje) {

        //var types = type;

        //$.each(types, function (index, type) {
        new BootstrapDialog({
            message: mensaje,
            cssClass: 'modalmensaje',
            type: BootstrapDialog.TYPE_SUCCESS,
            title: ' <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Éxito'
        }).open();
        //});
    },
    mensajeConfirmacion: function (mensaje, callback) {
        //var types = type;

        //$.each(types, function (index, type) {
        new BootstrapDialog({
            title: ' <span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span> Confirmar',
            type: BootstrapDialog.TYPE_WARNING,
            message: mensaje,
            data: {
                'callback': callback
            },
            buttons: [{
                label: 'Sí',
                cssClass: 'btn-primary',
                icon: 'glyphicon glyphicon-ok',
                action: function (dialog) {
                    typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                    dialog.close();
                }
            },
            {
                label: 'No',
                cssClass: 'btn-primary',
                icon: 'glyphicon glyphicon-ban-circle',
                action: function (dialog) {
                    dialog.close();
                }
            }]
        }).open();

        //});
    },
    mensajeConfirmacionSINO: function (mensaje, callbackSI, callbackNO) {
        //var types = type;

        //$.each(types, function (index, type) {
        new BootstrapDialog({
            title: ' <span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span> Confirmar',
            type: BootstrapDialog.TYPE_WARNING,
            message: mensaje,
            data: {
                'callbackSI': callbackSI,
                'callbackNO': callbackNO
            },
            buttons: [{
                label: 'Sí',
                cssClass: 'btn-primary',
                icon: 'glyphicon glyphicon-ok',
                action: function (dialog) {
                    typeof dialog.getData('callbackSI') === 'function' && dialog.getData('callbackSI')(true);
                    dialog.close();
                }
            },
            {
                label: 'No',
                cssClass: 'btn-primary',
                icon: 'glyphicon glyphicon-ban-circle',
                action: function (dialog) {
                    typeof dialog.getData('callbackNO') === 'function' && dialog.getData('callbackNO')(true);
                    dialog.close();
                }
            }]
        }).open();

        //});
    }

}

var handleFormato = function () {
    return {

        formatNumber: {
            separador: ".", // separador para los miles
            sepDecimal: ',', // separador para los decimales
            formatear: function (num) {
                num += '';
                var splitStr = num.split('.');
                var splitLeft = splitStr[0];
                var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
                var regx = /(\d+)(\d{3})/;
                while (regx.test(splitLeft)) {
                    splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
                }
                return this.simbol + splitLeft + splitRight;
            },
            new: function (num, simbol) {
                this.simbol = simbol || '';
                return this.formatear(num);
            }
        },
        limpiaNumero: function (elem) {

            var maxl = parseInt(elem.attr("maxlength"));
            var subida = parseInt(maxl / 4);
            elem.attr("maxlength", maxl - subida);
            elem.val(elem.val().split(".").join(''));

        },
        formateaNumero: function (elem) {

            var maxl = parseInt(elem.attr("maxlength"));
            var subida = parseInt(maxl / 3);
            elem.attr("maxlength", maxl + subida);
            elem.val(handleFormato.formatNumber.new(elem.val()));

        },
        modificaLength: function (elem) {

            var maxl = parseInt(elem.attr("maxlength"));
            var subida = parseInt(maxl / 3);
            elem.attr("maxlength", maxl + subida);

        },
        init: function () {

            $.each($("[data-formatear]"), function () {
                handleFormato.modificaLength($(this));
            })

            $("[data-formatear]").on('focus', function () {

                var elem = $(this);
                if (elem.attr("data-formatear") == "numero") {
                    handleFormato.limpiaNumero(elem);
                }


            });

            $("[data-formatear]").on('blur', function () {

                var elem = $(this);
                if (elem.attr("data-formatear") == "numero") {
                    handleFormato.formateaNumero(elem);
                }


            });

        },
        recargar: function () {

            var datos = $("[data-formatear]");

            $.each(datos, function () {
                var elem = $(this);
                if (elem.attr("data-formatear") == "numero") {
                    $(this).val(handleFormato.formatNumber.new($(this).val()));
                }
            });

        }
    }
}();

var handleUtilidades = function () {

    function es_numero(codigo, espacio) {
        var valor = false;
        switch (codigo) {
            case 32: valor = espacio; break; // (space)

            case 48: valor = true; break; // 0
            case 49: valor = true; break; // 1
            case 50: valor = true; break; // 2
            case 51: valor = true; break; // 3
            case 52: valor = true; break; // 4
            case 53: valor = true; break; // 5
            case 54: valor = true; break; // 6
            case 55: valor = true; break; // 7
            case 56: valor = true; break; // 8
            case 57: valor = true; break; // 9

            default: valor = false; break;
        }
        return valor;
    }

    function llenarComboData(id, datos, key, value, afectaOrden, callback) {

        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {
                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboDataSeleccione(id, datos, key, value, afectaOrden, callback) {

        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {
                cmb.append(
                    $('<option>', {
                        value: "-1",
                        text: "Seleccione"
                    }, '</option>'));

                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function llenarComboDataTodos(id, datos, key, value, afectaOrden, texto, callback) {

        if (afectaOrden === undefined)
            afectaOrden = true;

        if (afectaOrden) {
            datos = datos.sort(function (a, b) {
                if (a[value] > b[value])
                    return 1;
                if (a[value] < b[value])
                    return -1;

                return 0;
            });
        }

        $('#' + id).each(function (e, i) {
            var cmb = $(this)
            cmb.empty();
            if (cmb.children('option').length == 0) {

                if (texto.length > 0)
                cmb.append(
                    $('<option>', {
                        value: "-1",
                        text: texto
                    }, '</option>'));
                    
                $.map(datos, function (item) {
                    cmb.append(
                        $('<option>', {
                            value: item[key],
                            text: item[value]
                        }, '</option>'));
                });
            }
        });

        if (callback !== undefined)
            callback();
    }

    function validarRut(intlargo) {

        var validacionRut = {
            resultado: false,
            rutFormateado: ""
        }

        var tmpstr = "";

        var dv = 0;
        var rut = "";
        if (parseInt(intlargo) != 0) {
            if (intlargo.length > 0) {
                crut = intlargo;
                largo = crut.length;

                if (largo < 2)
                    return validacionRut;

                var chardv = '';
                for (i = 0; i < crut.length; i++)
                    if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-' && !isNaN(parseInt(crut.charAt(i)))) tmpstr = tmpstr + crut.charAt(i);
                    else if (crut.charAt(i).toUpperCase() == 'K')
                        chardv = crut.charAt(i).toUpperCase();

                tmpstr = Number(tmpstr).toString();
                rut = tmpstr + chardv;
                crut = tmpstr + chardv;
                largo = crut.length;

                rut = (largo > 2) ? crut.substring(0, largo - 1) : crut.charAt(0);
                dv = crut.charAt(largo - 1);

                if (rut == null || dv == null)
                    return validacionRut;

                var dvr = '0';
                suma = 0;
                mul = 2;

                for (i = rut.length - 1; i >= 0; i--) {
                    suma = suma + rut.charAt(i) * mul;
                    if (mul == 7)
                        mul = 2;
                    else
                        mul++;
                }

                res = suma % 11;
                if (res == 1)
                    dvr = 'k';
                else if (res == 0)
                    dvr = '0';
                else {
                    dvi = 11 - res;
                    dvr = dvi + "";
                }

                if (dvr != dv.toLowerCase())
                    return validacionRut;

                var rut_final = "";
                var num = 0;
                var val = rut.length;
                while (val != 0) {
                    num++;
                    if (num == 3) {
                        rut_final = "." + rut[val - 1] + rut_final;
                        num = 0;
                    }
                    else
                        rut_final = rut[val - 1] + rut_final;
                    val--;
                }
                validacionRut.rutFormateado = rut_final = rut_final + "-" + dv;
                validacionRut.resultado = true;

                return validacionRut;
            }
            else
                return validacionRut;
        }
        else
            return validacionRut;
    }

    function convierteAfecha(cadenaFecha) {

        var arregloFecha = cadenaFecha.split("/");
        var anio = arregloFecha[2];
        var mes = arregloFecha[1] - 1;
        var dia = arregloFecha[0];

        var fecha = new Date(anio, mes, dia);

        return fecha;
    }

    return {
        llenarComboItems: llenarComboData,
        llenarCombo: function (id, datos, key, value, afectaOrden) {

            llenarComboDataSeleccione(id, datos, key, value, afectaOrden, function () {

                $('#' + id).val('-1').selectpicker();

            });
        },
        llenarComboRefresh: function (id, datos, key, value, afectaOrden, texto) {

            llenarComboDataTodos(id, datos, key, value, afectaOrden, texto, function () {

                $('#' + id).selectpicker('refresh');

            });
        },
        llenarComboSelectValue: function (id, datos, key, value, afectaOrden, valueID) {

            llenarComboDataSeleccione(id, datos, key, value, afectaOrden, function () {

                $('#' + id).val(valueID).selectpicker('refresh');

            });
        },
        llenarComboTodos: function (id, datos, key, value, afectaOrden, texto) {

            llenarComboDataTodos(id, datos, key, value, afectaOrden, texto, function () {
                
                var select = '-1';
                if (datos.length == 1)
                    select = datos.SED_ID_SEDE;

                $('#' + id).val(select).selectpicker();

            });
        },
        llenarComboMultiple: function (id, datos, key, value, afectaOrden) {

            llenarComboData(id, datos, key, value, afectaOrden, function () {

                $('#' + id).attr("multiple", "");
                $('#' + id).attr("data-size", "10");
                $('#' + id).attr("title", "Seleccione");
                $('#' + id).val('').selectpicker();

            });

        },
        selectpickerEnable: function (selector) {

            $(selector).prop("disabled", false);
            $(selector).selectpicker('refresh');

        },
        selectpickerDisable: function (selector) {

            $(selector).prop("disabled", true);
            $(selector).selectpicker('refresh');

        },
        llenarComboAutocompletarSimple: function (id, datos, key, value, afectaOrden) {

            llenarComboDataSeleccione(id, datos, key, value, afectaOrden, function () {

                $('#' + id).attr("data-live-search", "true");
                $('#' + id).attr("data-size", "10");
                $('#' + id).attr("title", "Seleccione");
                $('#' + id).selectpicker("val", "-1");

            });

        },
        formatoFecha: function (fecha) {
            return (fecha._isAMomentObject) ? fecha.parseZone(initApp.zonaHoraria).format('DD/MM/YYYY') :
                moment.parseZone(fecha + initApp.zonaHoraria).format('DD/MM/YYYY');
        },
        formatoHora: function (fecha) {
            return moment.parseZone(fecha + initApp.zonaHoraria).format('HH:mm');
        },
        calculaEdad: function (fechaNacimiento) {

            var edadExacta = {
                anios: "",
                meses: "",
                dias: ""
            }

            if (fechaNacimiento != "") {

                var partes = fechaNacimiento.split('/');

                var dia = partes[0];
                var mes = partes[1];
                var ano = partes[2];

                //var fecha_Actual = moment(moment.now()).format('DD/MM/YYYY');
                //var fecha_Actual = moment.parseZone(moment($("#fechaActual").val(), 'DD/MM/YYYY HH:mm').toDate() + initApp.zonaHoraria).format('DD/MM/YYYY');
                //var fecha_Actual = $("#fechaActual").val().split(" ")[0];
                var fecha_hoy = ($("#fechaActual").val().split(' ')[0].split('-').length > 1) ? $("#fechaActual").val().split(' ')[0].split('-') : $("#fechaActual").val().split(' ')[0].split('/');

                var ahora_ano = fecha_hoy[2];
                var ahora_mes = fecha_hoy[1];
                var ahora_dia = fecha_hoy[0];
                var anio = ahora_ano - ano;

                if (ahora_mes < (mes - 1)) {
                    anio--;
                }
                if (((mes - 1) == ahora_mes) && (ahora_dia < dia)) {
                    anio--;
                }

                var meses = 0;

                if (ahora_mes > mes)
                    meses = ahora_mes - mes;
                if (ahora_mes < mes)
                    meses = 12 - (mes - ahora_mes);
                if (ahora_mes == mes && dia > ahora_dia)
                    meses = 11;

                var dias = 0;

                if (ahora_dia > dia)
                    dias = ahora_dia - dia;
                if (ahora_dia < dia) {
                    ultimoDiaMes = new Date(ahora_ano, ahora_mes, 0);
                    dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
                }

                edadExacta.anios = anio;
                edadExacta.meses = meses;
                edadExacta.dias = dias;

            }
            return edadExacta;

        },
        ajustaString: function (cadena, lenUsu) {

            if (lenUsu == null || lenUsu === undefined)
                lenUsu = 50;

            if (cadena == "" || cadena == null || cadena === undefined)
                return "";

            if (cadena.length <= lenUsu)
                return cadena;

            if (cadena.length > lenUsu) {
                var len = (cadena.length <= lenUsu) ? cadena.length : lenUsu;
                return cadena.substring(0, len - 3) + '...';
            }


        },
        validarRut: validarRut,
        es_numero: es_numero,
        convierteAfecha: convierteAfecha
    }

}();



function GeneralSettings() {

    var handleRenderSwitcher = function () {

        $(".switchery").attr("data-size", "small");
        $(".switchery").attr("data-on", "Sí");
        $(".switchery").attr("data-off", "No");
        $(".switchery").bootstrapToggle();

        $('[data-toggle="buttons"]').on("click", function (ev) {

            if ($(this).children('label').hasClass('disabled')) {
                ev.stopPropagation();
            }
        })

    };

    var handleDataTableSettings = function () {

        var lenguaje = {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "No existen datos",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }

        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "fecha-asc": function (a, b) {
                var ukDatea = a.split('/');
                var ukDateb = b.split('/');

                var x = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
                var y = (ukDateb[2] + ukDateb[1] + ukDateb[0]) * 1;

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            },

            "fecha-desc": function (a, b) {
                var ukDatea = a.split('/');
                var ukDateb = b.split('/');

                var x = (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
                var y = (ukDateb[2] + ukDateb[1] + ukDateb[0]) * 1;

                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            },

            "numeric-comma-pre": function (a) {
                var z = a.toString().split('.').join('');
                z = z.replace(/,/, ".");
                return parseFloat(z);
            },

            "numeric-comma-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },

            "numeric-comma-desc": function (a, b) {
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            },

            "fraccion-asc": function (c1, c2) {

                var p1 = c1.split("/");
                var res1 = parseFloat(parseInt(p1[0]) / parseInt(p1[1]));
                var p2 = c2.split("/");
                var res2 = parseFloat(parseInt(p2[0]) / parseInt(p2[1]));

                return ((res1 < res2) ? -1 : ((res1 > res2) ? 1 : 0));
            },

            "fraccion-desc": function (c1, c2) {

                var p1 = c1.split("/");
                var res1 = parseFloat(parseInt(p1[0]) / parseInt(p1[1]));
                var p2 = c2.split("/");
                var res2 = parseFloat(parseInt(p2[0]) / parseInt(p2[1]));

                return ((res1 < res2) ? 1 : ((res1 > res2) ? -1 : 0));
            },

            "numeric-input-pre": function (a) {
                //var x = (a == "-") ? 0 : a.replace(/,/, ".");
                var c = $(a).val();
                if (!isNaN(c)) {
                    c = parseInt(c).toString();
                }
                return c;
            },

            "numeric-input-asc": function (a, b) {
                var c = $(a).val().replace('.', '');
                $(a).blur();
                return ((c < b) ? -1 : ((c > b) ? 1 : 0));
            },

            "numeric-input-desc": function (a, b) {
                var c = $(a).val().replace('.', '');
                $(a).blur();
                return ((c < b) ? 1 : ((c > b) ? -1 : 0));
            },
        });

        //$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        //    $($.fn.dataTable.tables(true)).DataTable()
        //       .columns.adjust()
        //       .responsive.recalc();
        //});

        //$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        //    $($.fn.dataTable.tables(true)).DataTable()
        //       .columns.adjust()
        //       .responsive.recalc();
        //});

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $($(".tab-pane .dataTable").toArray()).DataTable()
               .columns.adjust()
               .responsive.recalc();
        });

        $('body').on('mouseover', '.dataTable tbody tr', function () {
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover',
                html: true
            });
        });


        $.extend(true, $.fn.dataTable.defaults, {
            processing: false,
            responsive: true,
            deferRender: true,
            "language": lenguaje,
            "sPaginationType": ($(window).width() < 979) ? "numbers" : "full_numbers",
            "iDisplayLength": 10,
            "dom": "<'col-sm-6 hidden-xs'l><'col-sm-6 datatable-fix-alignment-filter'f>tip",
            "drawCallback": function (oSettings) {
                if ($(this[0]).find("td.dataTables_empty").length > 0)
                    $(this[0]).find("td").attr("colspan", oSettings.aoColumns.length);
            },
            "rowCallback": function (oSettings) {
                $(this).DataTable().columns.adjust().responsive.recalc();
            }
        });

    };

    var handleDateInput = function () {

        $(".date input").datepicker({
            language: "es",
            autoclose: true,
            clearBtn: true,
            startDate: "01/01/1900",
            keyboardNavigation: false,
            orientation: "bottom left"
        }).on('changeDate', function (ev) {
            var elem = $(this).find("input");
            if (elem.val() == "")
                elem.change();
        });

        $(".date input[type='text']").attr("readonly", "readonly");

        $(".date .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        //var fechaHoy = $(".menu-fecha").text()
        var fechaHoy = moment(moment.now()).format('DD/MM/YYYY');

        $(".dateHoy input").datepicker({
            language: "es",
            autoclose: true,
            clearBtn: true,
            keyboardNavigation: false,
            startDate: "01/01/1900",
            orientation: "bottom left",
            endDate: fechaHoy
        }).on('changeDate', function (ev) {
            var elem = $(this).find("input");
            if (elem.val() == "")
                elem.change();
        });

        $(".dateHoy input[type='text']").attr("readonly", "readonly");

        $(".dateHoy .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        });

        $(".monthView input").datepicker({
            language: "es",
            orientation: "bottom left",
            format: "mm/yyyy",
            startView: "months",
            startDate: "01/1900",
            minViewMode: "months",
            keyboardNavigation: false,
            autoclose: true,
        });

        $(".monthView input[type='text']").attr("readonly", "readonly");

        $(".monthView .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        $(".yearView input").datepicker({
            language: "es",
            orientation: "bottom left",
            format: "yyyy",
            startView: "years",
            startDate: "1900",
            minViewMode: "years",
            keyboardNavigation: false,
            autoclose: true,
        });

        $(".yearView input[type='text']").attr("readonly", "readonly");

        $(".yearView .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        $(".dateRange.to input").datepicker({
            language: "es",
            format: 'dd/mm/yyyy',
            autoclose: true,
            clearBtn: true,
            startDate: "01/01/1900",
            keyboardNavigation: false,
            orientation: "bottom left",
            endDate: $("#" + $(".dateRange.to input").attr("from")).val()
        })
        .on('changeDate', function (selected) {
            var minDate = new Date(selected.dates.valueOf());
            if (selected.date !== undefined) {
                $("#" + $(selected.currentTarget).attr("from")).datepicker('setStartDate', minDate);
            }
            else {
                $("#" + $(selected.currentTarget).attr("from")).datepicker('setStartDate', "01/01/1900");
            }
        });

        $(".dateRange.from input").datepicker({
            language: "es",
            format: 'dd/mm/yyyy',
            autoclose: true,
            clearBtn: true,
            startDate: "01/01/1900",
            keyboardNavigation: false,
            orientation: "bottom left",
            startDate: $("#" + $(".dateRange.from input").attr("to")).val()
        })
        .on('changeDate', function (selected) {
            var maxDate = new Date(selected.dates.valueOf());
            if (selected.date !== undefined) {
                $("#" + $(selected.currentTarget).attr("to")).datepicker('setEndDate', maxDate);
            }
            else {
                $("#" + $(selected.currentTarget).attr("to")).datepicker('setEndDate', "");
            }
        });

        $(".dateRange .input-group-addon").on("click", function () {
            $("#" + $(this).parent().find('input').attr("id")).datepicker('show');
        })

        $(".dateRange input[type='text']").attr("readonly", "readonly");

        $('.calendario-full-ajustado').datepicker({
            language: "es",
            startDate: "01/01/1900",
            keyboardNavigation: false,
            clearBtn: true,
        });

    };

    var handleTimePicker = function () {
        $('.timepicker').timepicker({
            template: 'dropdown',
            maxHours: 24,
            minuteStep: 5,
            showInputs: false,
            showSeconds: false,
            showMeridian: false,
            snapToStep: true
        });

        $('.timepicker').timepicker().on('show.timepicker', function (e) {
            //(e.currentTarget.value == "") ? $(this).timepicker('setTime', moment.parseZone(moment(e.timeStamp).format("MM/DD/YYYY HH:mm") + initApp.zonaHoraria).format("HH:mm")) : false;
            (e.currentTarget.value == "") ? $(this).timepicker('setTime', moment(moment.utc().format("MM/DD/YYYY HH:mm") + ((initApp.zonaHoraria.indexOf("-") == -1) ? initApp.zonaHoraria.replace("+", "-") : initApp.zonaHoraria.replace("-", "+"))).utc().format("HH:mm")) : false;
        });

    };
    
    var handleGenericValidations = function () {

        $(document)
        //.unbind('keydown')
        .bind('keydown', function (event) {
            var doPrevent = false;
            var key = event.charCode || event.keyCode || 0;
            if (key == 8) {
                var d = event.srcElement || event.target;
                if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'SEARCH' || d.type.toUpperCase() === 'FILE'))
                    || d.tagName.toUpperCase() === 'TEXTAREA' || d.tagName.toUpperCase() === 'DIV')
                    doPrevent = d.readOnly || d.disabled;
                else
                    doPrevent = true;
            }
            if (doPrevent)
                event.preventDefault();
        });

        $('input:text,textarea,input:password')
            //.unbind("keypress")
            .on("keypress", function (e) {
                var res = true;
                var key = e.charCode || e.keyCode || 0;
                if ($(this).hasClass('numero'))
                    res = NumericOnly(e, $(this), null);
                else if ($(this).hasClass('decimal'))
                    res = NumericOnly(e, $(this), ',');
                else if ($(this).hasClass('integer'))
                    res = NumericOnly(e, $(this), null);
                else if ($(this).hasClass('rut'))
                    res = RutOnly(e, $(this));
                else if ($(this).hasClass('mail')) {
                    var keychar = String.fromCharCode(key);
                    var regEx = /[A-Z0-9a-z@\-_\.]/;
                    var v_shiftKey = e.shiftKey;
                    if (is_special_key(e))
                        res = true;
                    else
                        res = regEx.test(keychar);
                } else if ($(this).hasClass('input-full-trim'))
                    if (key == 32)
                        res = false;
                    else
                        res = true;
                if (res == true) {
                    var v_ctrlKey = e.ctrlKey;
                    var v_shiftKey = e.shiftKey;
                    if (is_special_key(e))
                        res = true;
                    else
                        if (/\w<|>|;|\\|'|"|\$|\||</.test(String.fromCharCode(key)))
                            res = false;
                        else
                            res = true;

                }

                return res;
            });

        $('input:text,textarea,input:password')
            //.unbind("keyup")
            .on("keyup", function (e) {
                if ($(this).hasClass('key_search'))
                    $(this).trigger("blur");
                if ($(this).is("textarea"))
                    validarTextArea($(this));
            });

        $('input:text,textarea,input:password')
        //.unbind("change")
        .on("change", function () {
            validarTextBox(this);
        });

        $('input:text,textarea,input:password')
        //.unbind("paste")
        .on('paste', function (e) {
            var self = this;
            setTimeout(function (e) {
                validarTextBox(self);
            }, 0);
        });

        $('.capitalize').each(function (i, val) {
            if ($(val).is("input")) {
                $(val).val($(val).val().capitalize(true));
            } else {
                $(val).html($(val).html().capitalize(true));
            }
        });

        var nclick = 0;
        $('.prevent_dblsubmit')
        .off("click")
        .on("click", function () {
            nclick = nclick + 1
            $(this).fadeTo(0, 0.5);
            if (nclick > 1) {
                return false;
            }
        });

        $(".validaRut, .rut").on("keypress", function (e) {
            if ((e.which >= 45 && e.which <= 57 && e.which != 47) || e.which == 107 || e.which == 75)
                return true;
            else
                return false;
        });

        $(".validaRut").on("change, blur", function () {
            var val = validarRut(this.value);
            $(this).val(val.rutFormateado);
        });

        function validarRutChileno(el) {

            var input = $(el);

            var tmpstr = "";
            //if (!isNaN(input.val())) {
            //    input.val(Number(input.val().split("-").join("").split(".").join("")).toString());
            //}
            var intlargo = input.val();
            var dv = 0;
            var rut = "";
            if (parseInt(intlargo) != 0) {
                if (intlargo.length > 0) {
                    crut = intlargo;
                    largo = crut.length;
                    if (largo < 2) {
                        input.val("");
                        //showToast("Rut inválido", "info", "Validación", 0);
                        return false;
                    }
                    var chardv = '';
                    for (i = 0; i < crut.length; i++) {
                        if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-' && !isNaN(parseInt(crut.charAt(i)))) {
                            tmpstr = tmpstr + crut.charAt(i);
                        }
                        else if (crut.charAt(i).toUpperCase() == 'K') {
                            chardv = crut.charAt(i).toUpperCase();
                        }
                    }
                    tmpstr = Number(tmpstr).toString();
                    rut = tmpstr + chardv;
                    crut = tmpstr + chardv;
                    largo = crut.length;

                    if (largo > 2)
                        rut = crut.substring(0, largo - 1);
                    else
                        rut = crut.charAt(0);

                    dv = crut.charAt(largo - 1);

                    if (rut == null || dv == null)
                        return 0;

                    var dvr = '0';
                    suma = 0;
                    mul = 2;

                    for (i = rut.length - 1; i >= 0; i--) {
                        suma = suma + rut.charAt(i) * mul;
                        if (mul == 7)
                            mul = 2;
                        else
                            mul++;
                    }

                    res = suma % 11;
                    if (res == 1)
                        dvr = 'k';
                    else if (res == 0)
                        dvr = '0';
                    else {
                        dvi = 11 - res;
                        dvr = dvi + "";
                    }
                    if (dvr != dv.toLowerCase()) {
                        input.val("");
                        return false;
                    }
                    var rut_final = "";
                    var num = 0;
                    var val = rut.length;
                    while (val != 0) {
                        num++;
                        if (num == 3) {
                            rut_final = "." + rut[val - 1] + rut_final;
                            num = 0;
                        }
                        else
                            rut_final = rut[val - 1] + rut_final;
                        val--;
                    }
                    rut_final = rut_final + "-" + dv;
                    input.val(rut_final);
                    return true;
                }
            }
            else {
                input.val("");
                return false;
            }

        }

        function getCharFromKeyCode(e) {

            if (window.event) // IE
                keynum = e.keyCode;
            else (e.which)
            keynum = e.which;

            keychar = String.fromCharCode(keynum);
            return keychar;

        }

        var _to_ascii = {
            '188': '44',
            '109': '45',
            '190': '46',
            '191': '47',
            '192': '96',
            '220': '92',
            '222': '39',
            '221': '93',
            '219': '91',
            '173': '45',
            '187': '61', //IE Key codes
            '186': '59', //IE Key codes
            '189': '45'  //IE Key codes
        }

        var shiftUps = {
            "96": "~",
            "49": "!",
            "50": "@",
            "51": "#",
            "52": "$",
            "53": "%",
            "54": "^",
            "55": "&",
            "56": "*",
            "57": "(",
            "48": ")",
            "45": "_",
            "61": "+",
            "91": "{",
            "93": "}",
            "92": "|",
            "59": ":",
            "39": "\"",
            "44": "<",
            "46": ">",
            "47": "?"
        };

        function ValidaFecha(id) {
            var valorfecha = $("#" + id).val();

            if (valorfecha != "") {

                if (valorfecha.length == 10) {

                    valores = valorfecha.split("/");
                    if (valores.length == 3) {

                        var diasmes = 0;

                        if (valores[2].length != 4 || (valores[2] < 1900 && valores[2] != "00/00/0000")) {
                            $("#" + id).val("");
                            return false;
                        }

                        if (valores[1].length == 2) {
                            if (parseInt(valores[1]) < 1 || parseInt(valores[1]) > 12) {
                                $("#" + id).val("");
                                return false;
                            }
                            if (parseInt(valores[1]) == 1 || parseInt(valores[1]) == 3 || parseInt(valores[1]) == 5 || parseInt(valores[1]) == 7 || parseInt(valores[1]) == 8 || parseInt(valores[1]) == 10 || parseInt(valores[1]) == 12)
                                diasmes = 31;
                            if (parseInt(valores[1]) == 4 || parseInt(valores[1]) == 6 || parseInt(valores[1]) == 9 || parseInt(valores[1]) == 11)
                                diasmes = 30;
                            if (parseInt(valores[1]) == 2)
                                if ((parseInt(valores[2]) % 4 == 0) && ((parseInt(valores[2]) % 100 != 0) || (parseInt(valores[2]) % 400 == 0)))
                                    diasmes = 29;
                                else
                                    diasmes = 28;

                        }
                        else {
                            $("#" + id).val("");
                            return false;
                        }

                        if (valores[0].length == 2) {
                            if (parseInt(valores[0]) < 1 || parseInt(valores[0]) > diasmes) {
                                $("#" + id).val("");
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else {
                            $("#" + id).val("");
                            return false;
                        }

                    }
                    else {
                        $("#" + id).val("");
                        return false;
                    }
                }
                else {
                    $("#" + id).val("");
                    return false;
                }
            }

        }
        //funciones para validacion de textos
        $.fn.SinEspacios =
        function () {
            return this.each(function () {
                $(this).keypress(function (e) {
                    var key = e.charCode || e.keyCode || 0;
                    // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
                    if (key == 32) {
                        return false;
                    } else {
                        return true;
                    }
                });
            });
        };

        function is_special_key(e) {
            var v_ctrlKey = e.ctrlKey;
            var v_shiftKey = e.shiftKey;
            var char = getCharFromKeyCode(e)
            var key = e.charCode || e.keyCode || 0;
            if (((key == 86 && v_ctrlKey) || /*Copia*/
            (key == 67 && v_ctrlKey) || /*Pega*/
            (key == 35) || /*Inicio*/
            (key == 36) || /*Fin*/
            (key == 35 && v_shiftKey) || /*SHIFT Inicio*/
            (key == 36 && v_shiftKey) || /*SHIFT Fin*/
            key == 13 || /*tecla enter*/
            key == 8 || /*backspace*/
            key == 9 || /*tab*/
            key == 37 || /*left arrow*/
            key == 38 || /*up arrow*/
            key == 39 || /*right arrow*/
            key == 40 || /*down arrow*/
            key == 46) /*delete*/
            && /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(char)/*si es un caracter unicode no imprimible*/
            ) {
                return true;
            } else {
                return false;
            }
        }

        function NumericOnly(e, elem, decimalChar) {
            var char = getCharFromKeyCode(e)
            var key = e.charCode || e.keyCode || 0;
            var v_ctrlKey = e.ctrlKey;
            var v_shiftKey = e.shiftKey;
            return (
                    (is_special_key(e) || /*teclas especiales como tab, enter o flechas*/
            /*Si decimalChar no es nulo y ademas el caracter presionado
            Corresponde al punto decimal especificado, permitimos su ingreso
            una sola vez*/
                    (char == decimalChar && decimalChar != null && elem.val().indexOf(decimalChar) < 0) ||
                    (key == 110 && decimalChar == "." && decimalChar != null && elem.val().indexOf(".") < 0) ||
                    (key >= 48 && key <= 57)  /*teclas del cero al nueve (numeric key pad)*/
                    )
                );
        }

        function RutOnly(e, elem) {
            var guionChar = '-'
            var v_ctrlKey = e.ctrlKey;
            var v_shiftKey = e.shiftKey;
            var char = getCharFromKeyCode(e)
            var key = e.charCode || e.keyCode || 0;
            return (
                    (
                    is_special_key(e) ||
            /*Si guionChar no es nulo y ademas el caracter presionado
            Corresponde al punto decimal especificado, permitimos su ingreso
            una sola vez*/
                    (char == guionChar && guionChar != null && elem.val().indexOf(guionChar) < 0) ||
                    (char.toUpperCase() == 'K' && char != null && elem.val().toUpperCase().indexOf(char.toUpperCase()) < 0) ||
                    (key >= 48 && key <= 57) /*teclas del cero al nueve (numeric key pad)*/
                )
            );
        }


        //Función que calcula el dígito verificador de un Rut
        function obtener_dv(T) {
            var M = 0, S = 1;
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11;
            return S ? S - 1 : 'k';
        }

        //Función para la validación de Rut
        function validaRut(p_rut_completo) {
            if (p_rut_completo != null || p_rut_completo == '') {
                var v_partes = p_rut_completo.split('-');
                if (v_partes.length == 2) {
                    var rut_texto = v_partes[0].replace(/\./g, '');
                    var rut_dv = v_partes[1];
                    if (obtener_dv(rut_texto) == rut_dv)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            } else
                return false;

        }

        //Permite agregar "leading zeros" o ceros al inicio de un texto.
        //recibe como parámetros el string y la cantidad máxima de caracteres
        function pad(str, max) {
            return str.length < max ? pad("0" + str, max) : str;
        }

        function CommentsMaxLength(text, maxLength) {
            text.value = text.value.substring(0, maxLength);
        }

        function validarEmail(email) {
            expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!expr.test(email))
                return false;
            else
                return true;
        }

        //validar si se usan para bloquear campos
        function validarFormatoFecha(campo) {
            var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
            if ((campo.match(RegExPattern)) && (campo != '')) {
                return true;
            } else {
                return false;
            }
        }

        //validar si se usan para bloquear campos
        function existeFecha(fecha) {
            var fechaf = fecha.split("/");
            var day = fechaf[0];
            var month = fechaf[1];
            var year = fechaf[2];
            var date = new Date(year, month, '0');
            if ((day - 0) > (date.getDate() - 0)) {
                return false;
            }
            return true;
        }

        String.prototype.capitalize = function (lower) {
            return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
        };

        $.fn.setCursorToTextEnd = function () {
            this.focus();
            var $thisVal = this.val();
            this.val('').val($thisVal);
            return this;
        }

        function validarTextBox(el) {

            if ($(el).hasClass('numero'))
                validarNumero(el);
            if ($(el).hasClass('decimal'))
                validarDecimal(el);
            if ($(el).hasClass('integer'))
                validarInteger(el);
            if ($(el).hasClass('input-full-trim'))
                validarSinEspacio(el);
            if ($(el).hasClass('input-left-trim'))
                InputLeftTrim(el);
            if ($(el).hasClass('input-outer-trim'))
                inputOuterTrim(el);
            if ($(el).hasClass('validaFecha'))
                ValidaFecha(el.id);
            if ($(el).is("textarea"))
                validarTextArea(el);

            validarCaracterEspecial(el);

        }

        function validarCaracterEspecial(el) {
            $(el).val($(el).val().replace(/;|<|>|;|\\|'|"|\$|\||/g, ''));
        }

        function validarNumero(el) {
            $(el).val($(el).val().replace(/[^0-9]/g, ''));
        }

        function validarDecimal(el) {
            if ($(el).val() != "") {
                var valor_final = $(el).val();
                //Verificamos si tiene decimales
                if ($(el).val().indexOf(',') > -1) {
                    //Si tiene decimales, validamos que sea un número válido
                    var vargs = valor_final.split(',');
                    if (vargs.length == 2 && vargs[0] != "" && vargs[1] != "") {
                        vargs[0] = vargs[0].replace(/[^0-9]/g, ''); //eliminamos todos los registros no numericos
                        vargs[1] = vargs[1].replace(/[^0-9]/g, ''); //eliminamos todos los registros no numericos
                        if ($(el).data("precision_decimal") != null) {
                            //alert($(el).data("precision_decimal"));
                            try {
                                vargs[1] = vargs[1].substring(0, $(el).data("precision_decimal"));
                            } catch (e) {
                                vargs[1] = "";
                            }
                        }
                        valor_final = vargs[0] + ',' + vargs[1]
                    } else {
                        valor_final = "";
                    }
                } else {
                    //Si no tiene decimales, validamos que sea un número válido
                    valor_final = valor_final.replace(/[^0-9]/g, '');
                }
                $(el).val(valor_final);
            }
        }
        function validarInteger(el) {
            $(el).val($(el).val().replace(/[^0-9]/g, ''));
        }

        function validarSinEspacio(el) {
            $(el).val($(el).val().split(" ").join(""));
            //$(el).val($(el).val().replace(/^[ \t]+/, ""));
            $(el).val($(el).val().replace(/;| |/g, ''));
        }

        function InputLeftTrim(el) {
            $(el).val($(el).val().replace(/^\s+/, ""));
        }
        function inputOuterTrim(el) {
            $(el).val($.trim($(el).val()));
        }

        function validarTextArea(el) {
            var limit = parseInt($(el).attr('max-length'));
            var text = $(el).val();
            var chars = text.length;
            if (chars > limit) {
                var new_text = text.substr(0, limit);
                $(el).val(new_text);
            }
        }

    };

    var handleSettingsForm = function () {

        //var w = window.innerWidth
        //        || document.documentElement.clientWidth
        //        || document.body.clientWidth;

        //if (w <= 768 && w > 640) {
        //    $("#btnManipularMenu").click();
        //}

        $.ajaxPrefilter(function (opts, originalOpts, jqXHR) {

            var dfd = $.Deferred();

            jqXHR.done(function (res, a, q) {
                dfd.resolve();
            });

            jqXHR.fail(function (xhr, status, err) {
                var args = Array.prototype.slice.call(arguments);
                if (xhr.status === 401) {
                    window.location.href = $("#rutaRelativa").val();
                    throw '';
                }
                else {
                    dfd.rejectWith(xhr, args);
                    handleMensaje.mensajeError(xhr.statusText);
                }
            });

        });

        $.ajaxSetup({
            cache: false,
            async: true,

        });

        $(document).on("ajaxStart", function () {
            $("#page-loader").show();
        });

        $(document).on("ajaxError", function (event, jqxhr, ajaxOptions) {
            $("#page-loader").hide();
        });

        $(document).on("ajaxStop", function () {
            $("#page-loader").hide();
        });

        window.onerror = function errorHandler(msg, url, line) {
            $("#page-loader").hide();
            return false;
        }

        $("#page-loader").hide();

        var forms = $('form');
        $.each(forms, function (i, val) {
            val.reset();
        })

        var originalAddClassMethod = jQuery.fn.addClass;

        jQuery.fn.addClass = function () {
            // Execute the original method.
            var next = true;
            $.each(arguments, function (i, val) {
                if (val === "bv-tab-success" || val === "has-success")
                    next = false;
            });
            if (next)
                return originalAddClassMethod.apply(this, arguments);
        }

        $('form').bind("keypress", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                return false;
            }
        });

    };

    handleDataTableSettings();
    pageSetUp();
    drawBreadCrumb();
    handleRenderSwitcher();
    handleDateInput();
    handleTimePicker();
    handleSettingsForm();
    handleGenericValidations();

}


$(document).ready(function () {
    GeneralSettings();
});
