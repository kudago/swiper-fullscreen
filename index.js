var swiper = require('swiper');
var dialog = require('dialog-component');
var extend = require('xtend/mutable');
var domify = require('domify');
var css = require('mucss/css');
var sliderHTML = require('./index.html');
var itemHTML = require('./item.html');
var q = require('queried');

function SwiperFullscreen(options) {

	if (!(this instanceof(SwiperFullscreen))) return new SwiperFullscreen(options);

	var self = this;

	var defaults = {
		data: [],
		activeIndex: 0,
	};

	extend(self, defaults, options);

	self.el = domify(sliderHTML);

	//create and append slides
	self.data.forEach(function(itemData) {
		var item = self.render(itemData);
		self.appendItem(item);
	});

	if (self.data.length > 1) {
		self.appendArrows();
	}

	//prepare and open dialog with swiper
	dialogItem = dialog(null, self.el)
	.effect('fade')
	.overlay()
	.fixed()
	.closable()
	.escapable()
	.addClass('dialog-slider-fullscreen')
	.on('show', function () {

		var swiper = new Swiper(q('.swiper-container', self.el), {
			loop: true,
			effect: 'fade',
			speed: 200,
			lazyLoading: true,
			preloadImages: false,
			lazyLoadingOnTransitionStart: true,
			keyboardControl: true,
			nextButton: q('.swiper-button-next', self.el),
			prevButton: q('.swiper-button-prev', self.el)
		});

		swiper.slideTo(self.activeIndex+1, 0);

		css(document.body, {
			'overflow': 'hidden'
		});

	})
	.show()
	.on('close', closeDialog)
	.on('hide', closeDialog)
	.on('escape', closeDialog);

	function closeDialog () {
		css(document.body, {
			'overflow': null
		});
	}

}

extend(SwiperFullscreen.prototype, {

	render: function(data) {
		data.title = data.title || '';
		return domify(
			itemHTML
				.replace("%src%", data.src)
				.replace("%title%", data.title)
		);
	},

	appendItem: function(element) {
		this.el.querySelector('.swiper-wrapper').appendChild(element);
	},

	appendArrows: function() {
		var prevArrow = document.createElement('div');
		prevArrow.className = 'swiper-button-prev';
		var nextArrow = document.createElement('div');
		nextArrow.className = 'swiper-button-next';

		var container = q('.swiper-container', this.el);
		container.appendChild(prevArrow);
		container.appendChild(nextArrow);
	}

});

module.exports = SwiperFullscreen;