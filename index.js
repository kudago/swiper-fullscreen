const swiper = require('swiper');
const dialog = require('dialog-component');
const extend = require('xtend/mutable');
const domify = require('domify');
const css = require('mucss/css');
const sliderHTML = require('./index.html');
const itemHTML = require('./item.html');
const q = require('queried');

/**
 * Create an instance of fullscreen swiper
 * @constructor
 * @param {Object} options Initialization options
 */
function SwiperFullscreen(options) {

	if (!(this instanceof(SwiperFullscreen))) return new SwiperFullscreen(options);

	extend(this, options);

	if (options.swiper) {
		this.swiper = Object.create(SwiperFullscreen.prototype.swiper);
		extend(this.swiper, options.swiper);
	}

	this.el = domify(sliderHTML);

	//create and append slides
	this.data.forEach(itemData => {
		const item = this.render(itemData);
		this.el.querySelector('.swiper-wrapper').appendChild(item);
	});

	if (this.navigation && this.data.length > 1) {
		this.appendNavigation();
	}

	//create swiper instance for the gallery
	this.swiper = new Swiper(q('.swiper-container', this.el), this.swiper);

}

extend(SwiperFullscreen.prototype, {

	data: [],
	navigation: true,

	swiper: {
		loop: true,
		effect: 'fade',
		speed: 200,
		lazyLoading: true,
		preloadImages: false,
		lazyLoadingOnTransitionStart: true,
		keyboardControl: true
	},

	/**
	 * show the dialog with instance slider
	 * @param  {Number} slideIndex Index of slide to show when opened
	 */
	show(slideIndex) {

		//prepare and open dialog with swiper
		this.dialog = dialog(null, this.el)
		.effect('fade')
		.overlay()
		.fixed()
		.closable()
		.escapable()
		.addClass('dialog-slider-fullscreen')
		.on('show', function () {
			css(document.body, {
				'overflow': 'hidden'
			});
		})
		.on('close', closeDialog)
		.on('hide', closeDialog)
		.on('escape', closeDialog)
		.show();

		function closeDialog () {
			css(document.body, {
				'overflow': null
			});
		}

		this.swiper.update();
		if (typeof slideIndex != 'undefined') this.swiper.slideTo(slideIndex, 0);

	},

	/**
	 * hide the instanse's dialog
	 */
	hide() {
		this.dialog && this.dialog.hide();
	},

	/**
	 * render slide item with data provided
	 * @param  {Object} data - data to be rendered
	 * @return {DomObject}      Slide DOM element
	 */
	render(data) {
		data.title = data.title || '';
		return domify(
			itemHTML
				.replace("%src%", data.src)
				.replace("%title%", data.title)
		);
	},

	/**
	 * Method describing how navigation is appended
	 */
	appendNavigation() {
		//create elements for nav buttons
		const prevArrow = document.createElement('div');
		prevArrow.className = 'swiper-button-prev';
		const nextArrow = document.createElement('div');
		nextArrow.className = 'swiper-button-next';

		//bind click events
		prevArrow.addEventListener('click', () => this.swiper.slidePrev());
		nextArrow.addEventListener('click', () => this.swiper.slideNext());

		//append the buttons
		const container = q('.swiper-container', this.el);
		container.appendChild(prevArrow);
		container.appendChild(nextArrow);
	}
});

module.exports = SwiperFullscreen;