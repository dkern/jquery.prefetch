/*!
 * jQuery Prefetch - v0.1.1
 * http://jquery.eisbehr.de/prefetch/
 * http://eisbehr.de
 *
 * Copyright 2015, Daniel 'Eisbehr' Kern
 *
 * Dual licensed under the MIT and GPL-2.0 licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * jQuery.prefetch(["image1.jpg", "image2.jpg", ...], {delay: 1000});
 * jQuery("img").prefetch();
 */
;(function($, undefined)
{
    "use strict";

    /**
     * makes the plugin available direct trough jquery
     * @param {Array|object|string} [imageList]
     * @param {*} [settings]
     * @returns {Plugin}
     */
    $.Prefetch = $.prefetch = function(imageList, settings)
    {
        return new Plugin(imageList, settings);
    };

    /**
     * makes the plugin available trough jquery selector
     * @param {*} [settings]
     * @returns {object|Plugin}
     */
    $.fn.Prefetch = $.fn.prefetch = function(settings)
    {
        var instance = $.prefetch(this, settings);
        return instance.configuration.chainable ? this : instance;
    };

    /**
     * plugin class constructor
     * @constructor
     * @access private
     * @param {Array|object} imageList
     * @param {object} settings
     * @returns {Plugin}
     */
    function Plugin(imageList, settings)
    {
        if( settings ) $.extend(this.configuration, settings);
        this.addImage(imageList);

        return this._initialize();
    }

    $.extend(Plugin.prototype,
    {
        /**
         * all given items by jquery selector
         * @access private
         * @type {Array}
         */
        _images: [],

        /**
         * determine if preload is actually running
         * @access private
         * @type {boolean}
         */
        _running: false,

        /**
         * amount of currently running loadings
         * @access private
         * @type {Number}
         */
        _runningAmount: 0,

        /**
         * settings and configuration data
         * @access public
         * @type {object}
         */
        configuration:
        {
            chainable: true,

            // loading
            startAutomatically: true,
            delay: 0,
            simultaneous: 3,
            objectProperty: "url",

            // callbacks
            onStartLoading: null,
            onImageLoaded: null,
            onImageError: null,
            onAbortLoading: null,
            onAllLoaded: null
        },

        /**
         * initialize function
         * @access private
         * @type {function}
         * @returns {Plugin}
         */
        _initialize: function()
        {
            var plugin = this;

            if( this.configuration.startAutomatically )
                setTimeout(function()
                {
                    plugin.start();
                }, this.configuration.delay);

            return this;
        },

        /**
         * check for next image to load in list and start
         * @access private
         * @type {function}
         * @return void
         */
        _checkForNextImage: function()
        {
            // stop if not running or limit reached 
            if( !this._running || (this.configuration.simultaneous > 0 && this._runningAmount >= this.configuration.simultaneous) ) return;

            // load next free and waiting image
            var foundFreeImage = false;
            for( var i = 0; i < this._images.length; ++i )
                if( !this._images[i].running && !this._images[i].loaded )
                {
                    foundFreeImage = true;
                    this._preloadImage(this._images[i]);

                    break;
                }

            // finished everything
            if( !foundFreeImage && this.getLoadedAmount() == this.getImagesAmount() )
            {
                this._running = false;
                this._triggerCallback(this.configuration.onAllLoaded);
            }
        },

        /**
         * preload a single image object
         * @access private
         * @type {function}
         * @param {object} image
         * @return void
         */
        _preloadImage: function(image)
        {
            // start loading
            image.running = true;
            ++this._runningAmount;

            var plugin = this,
                imageObj = $(new Image());

            // bind error callback
            imageObj.error(function()
            {
                plugin._finishImage(image, false);
            });

            // bind loaded event
            imageObj.one("load", function()
            {
                // unbind event and remove image object
                imageObj.unbind("load").remove();
                plugin._finishImage(image, true);
            });

            // set source and start preload
            imageObj.attr("src", image.url);

            // call after load even on cached image
            if( imageObj.complete ) imageObj.load();
        },

        /**
         * finish image loading callback
         * @access private
         * @type {function}
         * @param {object} image
         * @param {boolean} loaded
         * @return void
         */
        _finishImage: function(image, loaded)
        {
            image.loaded = true;
            image.running = false;
            --this._runningAmount;

            if( loaded ) this._triggerCallback(this.configuration.onImageLoaded, image.url);
            else this._triggerCallback(this.configuration.onImageError, image.url);

            this._checkForNextImage();
        },

        /**
         * trigger a callback and pass optional image parameters
         * @access private
         * @type {function}
         * @param {function} callback
         * @param {string} [image]
         * @return void
         */
        _triggerCallback: function(callback, image)
        {
            if( callback )
            {
                if( image )
                    callback(image, this);
                else
                    callback(this);
            }
        },

        /**
         * start preloading images
         * @access public
         * @type {function}
         * @return {Plugin}
         */
        start: function()
        {
            if( !this._running && this.getLoadedAmount() < this.getImagesAmount() )
            {
                this._running = true;
                this._triggerCallback(this.configuration.onStartLoading);

                for( var i = this._runningAmount; (this.configuration.simultaneous <= 0 || i < this.configuration.simultaneous) && i < this._images.length; i++ )
                    this._checkForNextImage();
            }

            return this;
        },

        /**
         * stop current preloading
         * @access public
         * @type {function}
         * @return {Plugin}
         */
        stop: function()
        {
            if( this._running )
            {
                this._running = false;
                this._triggerCallback(this.configuration.onAbortLoading);
            }

            return this;
        },

        /**
         * get the amount of images overall, loaded or waiting
         * @access public
         * @type {function}
         * @returns {Number}
         */
        getImagesAmount: function()
        {
            return this._images.length;
        },

        /**
         * get the amount of loaded images
         * @access public
         * @type {function}
         * @returns {Number}
         */
        getLoadedAmount: function()
        {
            var loaded = 0;

            for( var i = 0; i < this._images.length; ++i )
                if( i in this._images && this._images[i]["loaded"] )
                    ++loaded;

            return loaded;
        },

        /**
         * add a list of elements, images or a single item to preloader
         * @access public
         * @type {function}
         * @param {Array|object|string} image
         * @return {Plugin}
         */
        addImage: function(image)
        {
            var imageObject = {url: "", running: false, loaded: false},
                inputType = Object.prototype.toString.call(image);

            // get images from array
            if( inputType == "[object Array]" )
            {
                for( var i = 0; i < image.length; ++i )
                    if( i in image )
                        this._images.push(jQuery.extend({}, imageObject, {url: image[i].url || image[i]}));
            }

            // get images from object or jquery selector
            else if( inputType == "[object Object]" )
            {
                var plugin = this;

                $.each(image, function()
                {
                    var element = $(this);

                    if( this.hasOwnProperty(plugin.configuration.objectProperty) || element.attr("src") || element.css("background-image") )
                        plugin._images.push(jQuery.extend({}, imageObject, {url: this[plugin.configuration.objectProperty] || element.attr("src") || element.css("background-image").replace(/^url\(["']?/, '').replace(/["']?\)$/, '')}));
                });
            }

            // get single image from string
            else if( inputType == "[object String]" )
                this._images.push(jQuery.extend({}, imageObject, {url: image}));

            return this;
        },

        /**
         * destroy this plugin instance
         * @access public
         * @type {function}
         * @returns {Plugin}
         */
        destroy: function ()
        {
            this.stop();
            this._images = [];

            return this;
        }
    });
})(jQuery);