# Swiper-Fullscreen

A fullscreen gallery made with [component-dialog](https://github.com/component/dialog) and [swiper](https://github.com/nolimits4web/Swiper).

[Demo](http://kudago.github.io/swiper-fullscreen/)

## Usage

The componentn is written to be used with browserify.

`$ npm install swiper-fullscreen`

Then you can create an instance of the slider and manage it through API.

```js
var swiperFullscreen = new SwiperFullscreen({
	...options...
});

swiperFullscreen.show();
```

## API

```js
const options = {
	navigation: true, //show navigation arrows if slides number is more than 1
	swiper: {...object...} // swiper settings for the slideshow
};

const swiperFullscreen = new SwiperFullscreen(options);

swiperFullscreen.swiper; // the instance's swiper object so you can manipulate it
swiperFullscreen.show(slideIndex); //instance's method to show the dialog popup. 'slideIndex' parameter is optional
swiperFullscreen.hide(); // hide the dialog with the slider

swiperFullscreen.show(); //...and show it
```
[![NPM](https://nodei.co/npm/swiper-fullscreen.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/swiper-fullscreen/)
