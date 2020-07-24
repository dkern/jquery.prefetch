## jQuery Prefetch - Lightweight Image and Background Preloader
[![GitHub version](https://badge.fury.io/gh/dkern%2Fjquery.prefetch.svg)](http://github.com/dkern/jquery.prefetch)
[![Dependency version](https://david-dm.org/dkern/jquery.prefetch.png)](https://david-dm.org/dkern/jquery.prefetch)

---

## About jQuery Prefetch
Prefetch is a lightweight image, list and background preloader for jQuery. Just give them a list of images or elements and the plugin will load every image for you.


## Download & Installation
First of all, you will need [jQuery](http://jquery.com) to use Prefetch successfully on your project! If you get this you can install Prefetch by different ways. Some examples below:

#### Self-Hosted
Download and save one of two available files to include Prefetch to your page, either the [development](http://raw.githubusercontent.com/dkern/jquery.prefetch/master/jquery.prefetch.js) or the [minified](http://raw.githubusercontent.com/dkern/jquery.prefetch/master/jquery.prefetch.min.js) version.
```HTML
<script type="text/javascript" src="jquery.prefetch.min.js"></script>
```

#### Package Managers
Prefetch is even available through [NPM](http://npmjs.org) and [Bower](http://bower.io). Just use one of the following commands below.

[![NPM version](https://badge.fury.io/js/jquery-prefetch.svg)](http://www.npmjs.org/package/jquery-prefetch)
[![Bower version](https://badge.fury.io/bo/jquery-prefetch.svg)](http://bower.io/search/?q=jquery-prefetch)

[![NPM](https://nodei.co/npm/jquery-prefetch.png?compact=true)](https://nodei.co/npm/jquery-prefetch/)
```
$ npm install jquery-prefetch
$ bower install jquery-prefetch
```


## Load Images or Backgrounds
Just select a bunch of elements with jQuery and pass them to Prefetch, the Plugin does the rest for you:
```HTML
<!-- images -->
<img src="images/1.jpg" />
<img src="images/2.jpg" />
<img src="images/3.jpg" />

<!-- backgrounds -->
<div style="background: url(images/1.jpg);" ></div>
<div style="background: url(images/2.jpg);" ></div>
<div style="background: url(images/3.jpg);" ></div>
```
```JS
$("img, div").Prefetch();
```


## Load a List of Images
Prefetch is even able to load a list of images directly. Pass an array, object or a simple string to load everything:
```JS
$.Prefetch(["images/1.jpg", "images/2.jpg", "images/3.jpg"]);
$.Prefetch([{image: "images/1.jpg"}, {image: "images/2.jpg"}, {image: "images/3.jpg"}]);
$.Prefetch({key1: {file: "images/1.jpg"}, key2: {file: "images/2.jpg"}}, {objectProperty: "file"});
$.Prefetch("images/1.jpg");
```


## Use Prefetch the manually way
The Prefetch-Object can be used in a manual manner or to control its behavior:
```JS
// use public function directly or chained
var preload = $.Prefetch();
preload.addImage(["images/1.jpg", "images/2.jpg", "images/3.jpg"]);
preload.addImage("images/4.jpg")
       .addImage("images/5.jpg")
       .start();
```


## Configuration
The configuration can be changed directly in the constructor or manually on a Prefetch instance:
```JS
$.Prefetch(["images/1.jpg", "images/2.jpg", "images/3.jpg"], {delay: 1000});
$("img, div").Prefetch({delay: 1000});

var preload = $.Prefetch();
preload.configuration.objectProperty = "file";
```


## Automatically create Image Source
There will be three possibilies to pass the image source strings to the Plugin. As a simple array/object, with a relative image folder path or within a custom generation function. These examples below will all load the same images:
```JS
// load as simple list
$.Prefetch(["images/1.jpg", "images/2.jpg", "images/3.jpg"]);

// load with image base path
$.Prefetch(["1.jpg", "2.jpg", "3.jpg"], {imagesBasePath: "images/"});

// load with custom source generation
$.Prefetch(["1", "2", "3"], {getImageSource: function(source) {
	return "images/" + source + ".jpg";
}});
```


## Parameter
The following configurations is available by default:

Name               | Type       | Default    | Description
------------------ | ---------- | ---------- | -----------
chainable          | *boolean*  | *true*     | by default Prefetch is chainable and will return all elements, if set to `false` it will return the created plugin instance itself for further use
startAutomatically | *boolean*  | *true*     | determine to automatically start loading images if available on initialization
delay              | *integer*  | *0*        | time in milliseconds to wait after initialization before loading images
simultaneous       | *integer*  | *3*        | amount of images should be loaded simultaneously, zero means no limit
objectProperty     | *string*   | *"image"*  | name of the property of passed object to look for image source
imagesBasePath     | *string*   | *null*     | optional base path where images are located, will be prepend on all image sources
onStartLoading     | *function* | *null*     | optional callback, triggered when loading starts *(parameter: prefetch instance)*
getImageSource     | *function* | *function* | callback to generate the used image source string, can be overwritten to create a custom source generation *(parameter: image source, prefetch instance / return: string)*
onImageLoaded      | *function* | *null*     | optional callback, triggered when a single image was loaded *(parameter: image source, prefetch instance)*
onImageError       | *function* | *null*     | optional callback, triggered when a single image could not be loaded *(parameter: image source, prefetch instance)*
onAbortLoading     | *function* | *null*     | optional callback, triggered when the loading was aborted while loading with `stop` or `destroy` function *(parameter: prefetch instance)*
onAllLoaded        | *function* | *null*     | optional callback, triggered when all images was loaded *(parameter: prefetch instance)*


## Bugs / Feature request
Please [report](http://github.com/dkern/jquery.prefetch/issues) bugs and feel free to [ask](http://github.com/dkern/jquery.prefetch/issues) for new features directly on GitHub.


## License
Prefetch is dual-licensed under [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL-2.0](http://www.gnu.org/licenses/gpl-2.0.html) license.
