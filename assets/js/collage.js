/*!
 *
 * jQuery collagePlus Plugin v0.3.3
 * https://github.com/ed-lea/jquery-collagePlus
 *
 * Copyright 2012, Ed Lea twitter.com/ed_lea
 *
 * built for http://qiip.me
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 *
 */





;(function( $ ) {


    $.fn.collagePlus = function( options ) {

        return this.each(function() {

            /*
             *
             * set up vars
             *
             */

            // track row width by adding images, padding and css borders etc
            var row         = 0,
            // collect elements to be re-sized in current row
                elements    = [],
            // track the number of rows generated
                rownum = 1,
            // needed for creating some additional defaults that are actually obtained
            // from the dom, which maybe doesn't make them defaults ?!
                $this = $(this);


            // width of the area the collage will be in
            $.fn.collagePlus.defaults.albumWidth    = $this.width();
            // padding between the images. Using padding left as we assume padding is even all the way round
            $.fn.collagePlus.defaults.padding       = parseFloat( $this.css('padding-left') );
            // object that contains the images to collage
            $.fn.collagePlus.defaults.images        = $this.children();

            var settings = $.extend({}, $.fn.collagePlus.defaults, options);

            settings.images.each(
                function(index){

                    /*
                     *
                     * Cache selector
                     * Even if first child is not an image the whole sizing is based on images
                     * so where we take measurements, we take them on the images
                     *
                     */
                    var $this = $(this),
                        $img  = ($this.is("img")) ? $this : $(this).find("img");



                    /*
                     *
                     * get the current image size. Get image size in this order
                     *
                     * 1. from <img> tag
                     * 2. from data set from initial calculation
                     * 3. after loading the image and checking it's actual size
                     *
                     */
                    var w = (typeof $img.data("width") != 'undefined') ? $img.data("width") : $img.width(),
                        h = (typeof $img.data("height") != 'undefined') ? $img.data("height") : $img.height();



                    /*
                     *
                     * Get any current additional properties that may affect the width or height
                     * like css borders for example
                     *
                     */
                    var imgParams = getImgProperty($img);


                    /*
                     *
                     * store the original size for resize events
                     *
                     */
                    $img.data("width", w);
                    $img.data("height", h);



                    /*
                     *
                     * calculate the w/h based on target height
                     * this is our ideal size, but later we'll resize to make it fit
                     *
                     */
                    var nw = Math.ceil(w/h*settings.targetHeight),
                        nh = Math.ceil(settings.targetHeight);

                    /*
                     *
                     * Keep track of which images are in our row so far
                     *
                     */
                    elements.push([this, nw, nh, imgParams['w'], imgParams['h']]);

                    /*
                     *
                     * calculate the width of the element including extra properties
                     * like css borders
                     *
                     */
                    row += nw + imgParams['w'] + settings.padding;

                    /*
                     *
                     * if the current row width is wider than the parent container
                     * it's time to make a row out of our images
                     *
                     */
                    if( row > settings.albumWidth && elements.length != 0 ){

                        // call the method that calculates the final image sizes
                        // remove one set of padding as it's not needed for the last image in the row
                        resizeRow(elements, (row - settings.padding), settings, rownum);

                        // reset our row
                        delete row;
                        delete elements;
                        row         = 0;
                        elements    = [];
                        rownum      += 1;
                    }


                    /*
                     *
                     * if the images left are not enough to make a row
                     * then we'll force them to make one anyway
                     *
                     */
                    if ( settings.images.length-1 == index && elements.length != 0){
                        resizeRow(elements, row, settings, rownum);

                        // reset our row
                        delete row;
                        delete elements;
                        row         = 0;
                        elements    = [];
                        rownum      += 1;
                    }
                }
            );

        });

        function resizeRow( obj, row, settings, rownum) {

            /*
             *
             * How much bigger is this row than the available space?
             * At this point we have adjusted the images height to fit our target height
             * so the image size will already be different from the original.
             * The resizing we're doing here is to adjust it to the album width.
             *
             * We also need to change the album width (basically available space) by
             * the amount of padding and css borders for the images otherwise
             * this will skew the result.
             *
             * This is because padding and borders remain at a fixed size and we only
             * need to scale the images.
             *
             */
            var imageExtras         = (settings.padding * (obj.length - 1)) + (obj.length * obj[0][3]),
                albumWidthAdjusted  = settings.albumWidth - imageExtras,
                overPercent         = albumWidthAdjusted / (row - imageExtras),
                // start tracking our width with know values that will make up the total width
                // like borders and padding
                trackWidth          = imageExtras,
                // guess whether this is the last row in a set by checking if the width is less
                // than the parent width.
                lastRow             = (row < settings.albumWidth  ? true : false);





            /*
             * Resize the images by the above % so that they'll fit in the album space
             */
            for (var i = 0; i < obj.length; i++) {



                var $obj        = $(obj[i][0]),
                    fw          = Math.floor(obj[i][1] * overPercent),
                    fh          = Math.floor(obj[i][2] * overPercent),
                // if the element is the last in the row,
                // don't apply right hand padding (this is our flag for later)
                    isNotLast   = !!(( i < obj.length - 1 ));

                /*
                 * Checking if the user wants to not stretch the images of the last row to fit the
                 * parent element size
                 */
                if(settings.allowPartialLastRow === true && lastRow === true){
                   fw = obj[i][1];
                   fh = obj[i][2];
                }


                /*
                 *
                 * Because we use % to calculate the widths, it's possible that they are
                 * a few pixels out in which case we need to track this and adjust the
                 * last image accordingly
                 *
                 */
                trackWidth += fw;


                /*
                 *
                 * here we check if the combined images are exactly the width
                 * of the parent. If not then we add a few pixels on to make
                 * up the difference.
                 *
                 * This will alter the aspect ratio of the image slightly, but
                 * by a noticable amount.
                 *
                 * If the user doesn't want full width last row, we check for that here
                 *
                 */
                if(!isNotLast && trackWidth < settings.albumWidth){
                    if(settings.allowPartialLastRow === true && lastRow === true){
                        fw = fw;
                    }else{
                        fw = fw + (settings.albumWidth - trackWidth);
                    }
                }

                fw--;

                /*
                 *
                 * We'll be doing a few things to the image so here we cache the image selector
                 *
                 *
                 */
                var $img = ( $obj.is("img") ) ? $obj : $obj.find("img");

                /*
                 *
                 * Set the width of the image and parent element
                 * if the resized element is not an image, we apply it to the child image also
                 *
                 * We need to check if it's an image as the css borders are only measured on
                 * images. If the parent is a div, we need make the contained image smaller
                 * to accommodate the css image borders.
                 *
                 */
                $img.width(fw);
                if( !$obj.is("img") ){
                    $obj.width(fw + obj[i][3]);
                }


                /*
                 *
                 * Set the height of the image
                 * if the resized element is not an image, we apply it to the child image also
                 *
                 */
                $img.height(fh);
                if( !$obj.is("img") ){
                    $obj.height(fh + obj[i][4]);
                }


                /*
                 *
                 * Apply the css extras like padding
                 *
                 */
                applyModifications($obj, isNotLast, settings);


                /*
                 *
                 * Assign the effect to show the image
                 * Default effect is using jquery and not CSS3 to support more browsers
                 * Wait until the image is loaded to do this
                 *
                 */

                $img
                    .one('load', function (target) {
                    return function(){
                        if( settings.effect == 'default'){
                            target.animate({opacity: '1'},{duration: settings.fadeSpeed});
                        } else {
                            if(settings.direction == 'vertical'){
                                var sequence = (rownum <= 10  ? rownum : 10);
                            } else {
                                var sequence = (i <= 9  ? i+1 : 10);
                            }
                            /* Remove old classes with the "effect-" name */
                            target.removeClass(function (index, css) {
                                return (css.match(/\beffect-\S+/g) || []).join(' ');
                            });
                            target.addClass(settings.effect);
                            target.addClass("effect-duration-" + sequence);
                        }
                    }
                    }($obj))
                    /*
                     * fix for cached or loaded images
                     * For example if images are loaded in a "window.load" call we need to trigger
                     * the load call again
                     */
                    .each(function() {
                            if(this.complete) $(this).trigger('load');
                    });

        }





        }

        /*
         *
         * This private function applies the required css to space the image gallery
         * It applies it to the parent element so if an image is wrapped in a <div> then
         * the css is applied to the <div>
         *
         */
        function applyModifications($obj, isNotLast, settings) {
            var css = {
                    // Applying padding to element for the grid gap effect
                    'margin-bottom'     : settings.padding + "px",
                    'margin-right'      : (isNotLast) ? settings.padding + "px" : "0px",
                    // Set it to an inline-block by default so that it doesn't break the row
                    'display'           : settings.display,
                    // Set vertical alignment otherwise you get 4px extra padding
                    'vertical-align'    : "bottom",
                    // Hide the overflow to hide the caption
                    'overflow'          : "hidden"
                };

            return $obj.css(css);
        }


        /*
         *
         * This private function calculates any extras like padding, border associated
         * with the image that will impact on the width calculations
         *
         */
        function getImgProperty( img )
        {
            $img = $(img);
            var params =  new Array();
            params["w"] = (parseFloat($img.css("border-left-width")) + parseFloat($img.css("border-right-width")));
            params["h"] = (parseFloat($img.css("border-top-width")) + parseFloat($img.css("border-bottom-width")));
            return params;
        }

    };

    $.fn.collagePlus.defaults = {
        // the ideal height you want your images to be
        'targetHeight'          : 400,
        // how quickly you want images to fade in once ready can be in ms, "slow" or "fast"
        'fadeSpeed'             : "fast",
        // how the resized block should be displayed. inline-block by default so that it doesn't break the row
        'display'               : "inline-block",
        // which effect you want to use for revealing the images (note CSS3 browsers only),
        'effect'                : 'default',
        // effect delays can either be applied per row to give the impression of descending appearance
        // or horizontally, so more like a flock of birds changing direction
        'direction'             : 'vertical',
        // Sometimes there is just one image on the last row and it gets blown up to a huge size to fit the
        // parent div width. To stop this behaviour, set this to true
        'allowPartialLastRow'   : false
    };

})( jQuery );
/**
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 */

+function ($) { "use strict";

  /**
   * The zoom service
   */
  function ZoomService () {
    this._activeZoom            =
    this._initialScrollPosition =
    this._initialTouchPosition  =
    this._touchMoveListener     = null

    this._$document = $(document)
    this._$window   = $(window)
    this._$body     = $(document.body)

    this._boundClick = $.proxy(this._clickHandler, this)
  }

  ZoomService.prototype.listen = function () {
    this._$body.on('click', '[data-action="zoom"]', $.proxy(this._zoom, this))
  }

  ZoomService.prototype._zoom = function (e) {
    var target = e.target

    if (!target || target.tagName != 'IMG') return

    if (this._$body.hasClass('zoom-overlay-open')) return

    if (e.metaKey || e.ctrlKey) {
      return window.open((e.target.getAttribute('data-original') || e.target.src), '_blank')
    }

    if (target.width >= ($(window).width() - Zoom.OFFSET)) return

    this._activeZoomClose(true)

    this._activeZoom = new Zoom(target)
    this._activeZoom.zoomImage()

    // todo(fat): probably worth throttling this
    this._$window.on('scroll.zoom', $.proxy(this._scrollHandler, this))

    this._$document.on('keyup.zoom', $.proxy(this._keyHandler, this))
    this._$document.on('touchstart.zoom', $.proxy(this._touchStart, this))

    // we use a capturing phase here to prevent unintended js events
    // sadly no useCapture in jquery api (http://bugs.jquery.com/ticket/14953)
    if (document.addEventListener) {
      document.addEventListener('click', this._boundClick, true)
    } else {
      document.attachEvent('onclick', this._boundClick, true)
    }

    if ('bubbles' in e) {
      if (e.bubbles) e.stopPropagation()
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }
  }

  ZoomService.prototype._activeZoomClose = function (forceDispose) {
    if (!this._activeZoom) return

    if (forceDispose) {
      this._activeZoom.dispose()
    } else {
      this._activeZoom.close()
    }

    this._$window.off('.zoom')
    this._$document.off('.zoom')

    document.removeEventListener('click', this._boundClick, true)

    this._activeZoom = null
  }

  ZoomService.prototype._scrollHandler = function (e) {
    if (this._initialScrollPosition === null) this._initialScrollPosition = $(window).scrollTop()
    var deltaY = this._initialScrollPosition - $(window).scrollTop()
    if (Math.abs(deltaY) >= 40) this._activeZoomClose()
  }

  ZoomService.prototype._keyHandler = function (e) {
    if (e.keyCode == 27) this._activeZoomClose()
  }

  ZoomService.prototype._clickHandler = function (e) {
    if (e.preventDefault) e.preventDefault()
    else event.returnValue = false

    if ('bubbles' in e) {
      if (e.bubbles) e.stopPropagation()
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }

    this._activeZoomClose()
  }

  ZoomService.prototype._touchStart = function (e) {
    this._initialTouchPosition = e.touches[0].pageY
    $(e.target).on('touchmove.zoom', $.proxy(this._touchMove, this))
  }

  ZoomService.prototype._touchMove = function (e) {
    if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
      this._activeZoomClose()
      $(e.target).off('touchmove.zoom')
    }
  }


  /**
   * The zoom object
   */
  function Zoom (img) {
    this._fullHeight      =
    this._fullWidth       =
    this._overlay         =
    this._targetImageWrap = null

    this._targetImage = img

    this._$body = $(document.body)
  }

  Zoom.OFFSET = 80
  Zoom._MAX_WIDTH = 2560
  Zoom._MAX_HEIGHT = 4096

  Zoom.prototype.zoomImage = function () {
    var img = document.createElement('img')
    img.onload = $.proxy(function () {
      this._fullHeight = Number(img.height)
      this._fullWidth = Number(img.width)
      this._zoomOriginal()
    }, this)
    img.src = this._targetImage.src
  }

  Zoom.prototype._zoomOriginal = function () {
    this._targetImageWrap           = document.createElement('div')
    this._targetImageWrap.className = 'zoom-img-wrap'

    this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage)
    this._targetImageWrap.appendChild(this._targetImage)

    $(this._targetImage)
      .addClass('zoom-img')
      .attr('data-action', 'zoom-out')

    this._overlay           = document.createElement('div')
    this._overlay.className = 'zoom-overlay'

    document.body.appendChild(this._overlay)

    this._calculateZoom()
    this._triggerAnimation()
  }

  Zoom.prototype._calculateZoom = function () {
    this._targetImage.offsetWidth // repaint before animating

    var originalFullImageWidth  = this._fullWidth
    var originalFullImageHeight = this._fullHeight

    var scrollTop = $(window).scrollTop()

    var maxScaleFactor = originalFullImageWidth / this._targetImage.width

    var viewportHeight = ($(window).height() - Zoom.OFFSET)
    var viewportWidth  = ($(window).width() - Zoom.OFFSET)

    var imageAspectRatio    = originalFullImageWidth / originalFullImageHeight
    var viewportAspectRatio = viewportWidth / viewportHeight

    if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
      this._imgScaleFactor = maxScaleFactor

    } else if (imageAspectRatio < viewportAspectRatio) {
      this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor

    } else {
      this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
    }
  }

  Zoom.prototype._triggerAnimation = function () {
    this._targetImage.offsetWidth // repaint before animating

    var imageOffset = $(this._targetImage).offset()
    var scrollTop   = $(window).scrollTop()

    var viewportY = scrollTop + ($(window).height() / 2)
    var viewportX = ($(window).width() / 2)

    var imageCenterY = imageOffset.top + (this._targetImage.height / 2)
    var imageCenterX = imageOffset.left + (this._targetImage.width / 2)

    this._translateY = Math.round(viewportY - imageCenterY)
    this._translateX = Math.round(viewportX - imageCenterX)

    var targetTransform = 'scale(' + this._imgScaleFactor + ')'
    var imageWrapTransform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px)'

    if ($.support.transition) {
      imageWrapTransform += ' translateZ(0)'
    }

    $(this._targetImage)
      .css({
        '-webkit-transform': targetTransform,
            '-ms-transform': targetTransform,
                'transform': targetTransform
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': imageWrapTransform,
            '-ms-transform': imageWrapTransform,
                'transform': imageWrapTransform
      })

    this._$body.addClass('zoom-overlay-open')
  }

  Zoom.prototype.close = function () {
    this._$body
      .removeClass('zoom-overlay-open')
      .addClass('zoom-overlay-transitioning')

    // we use setStyle here so that the correct vender prefix for transform is used
    $(this._targetImage)
      .css({
        '-webkit-transform': '',
            '-ms-transform': '',
                'transform': ''
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': '',
            '-ms-transform': '',
                'transform': ''
      })

    if (!$.support.transition) {
      return this.dispose()
    }

    $(this._targetImage)
      .one($.support.transition.end, $.proxy(this.dispose, this))
      .emulateTransitionEnd(300)
  }

  Zoom.prototype.dispose = function () {
    if (this._targetImageWrap && this._targetImageWrap.parentNode) {
      $(this._targetImage)
        .removeClass('zoom-img')
        .attr('data-action', 'zoom')

      this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap)
      this._overlay.parentNode.removeChild(this._overlay)

      this._$body.removeClass('zoom-overlay-transitioning')
    }
  }

  // wait for dom ready (incase script included before body)
  $(function () {
    new ZoomService().listen()
  })

}(jQuery)
$(function() {
	
	// Automatically add Zoom interaction
	$('article.content img').attr('data-action', 'zoom');

	// Make captions from Alt tags
	$('img.captioned').each(function() {
		var caption = $(this).attr('alt') || false;
		if (caption) {
			$(this).after('<p class="caption">' + caption + '</p>');
		}
	});

	// Auto focus on the giant search box
	var search = $('input.giant.search');
	search.focus().val(search.val());

	// Fire up that gallery
	$(window).load(function () {
		collage();
	});

	// Anima

	$('#nav-main .search').focus(function() {
		$(this).addClass('grow');
	}).blur(function() {
		$(this).removeClass('grow');
	});
});

function collage() {
	$('.gallery-images').collagePlus({
		'fadeSpeed' : 300
    });
}

// Reinitialize the gallery on browser resize.
var resizeTimer = null;
$(window).bind('resize', function() {
    $('.gallery-images img').css("opacity", 0);
    
    if (resizeTimer) clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(collage, 200);
});
//# sourceMappingURL=redwood.js.map
