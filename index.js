const swiper = require('swiper');
const dialog = require('dialog-component');
const extend = require('xtend/mutable');
const domify = require('domify');
const css = require('mucss/css');
const q = require('queried');
const events = require('events-mixin');


/**
 * Create an instance of fullscreen swiper
 * @constructor
 * @param {Object} options Initialization options
 */
class SwiperFullscreen {
	constructor(options) {
		const data = options.data || [];
		const hasOneSlide = data.length === 1;

		extend(this, {
			data,
			navigation: true,
			swiperOptions: {
				loop: true,
				effect: 'fade',
				speed: 200,
				lazyLoading: true,
				preloadImages: false,
				lazyLoadingOnTransitionStart: true,
				keyboardControl: !hasOneSlide,
				onlyExternal: hasOneSlide,
			},
		}, options);

		const markup = this.getMarkup(this.data);
		this.el = domify(markup);

		const container = q('.swiper-container', this.el);
		this.swiper = new Swiper(container, this.swiperOptions);

		this.bindEvents();
	}

	bindEvents() {
		this.events = events(this.el, this);
		this.events.bind({
			'click .swiper-button-prev': 'prevSlide',
			'click .swiper-button-next': 'nextSlide',
		});
	}

	/**
	 * get markup of the slider
	 * @param  {Object} data - data to render
	 * @return {String}      - html string
	 */
	getMarkup(data) {
		const items = this.getItemsMarkup(data);
		const navigation = this.getNavigationMarkup(data);

		return `
			<div class="fs-swiper">
				<div class="swiper-container fs-swiper-container">
					<div class="swiper-wrapper">${ items }</div>
					<div class="swiper-button-fullscreen"></div>
					${ navigation }
				</div>
			</div>
		`;
	}

	/**
	 * get items list markup
	 * @param  {Object} data - data to render
	 * @return {String}      - html string
	 */
	getItemsMarkup(data) {
		return data.reduce((prev, curr) => {
			let caption;

			if (curr.title && curr.title.trim()) {
				caption = `
					<div class="fs-swiper-caption">
						${ curr.title }
					</div>
				`;
			} else {
				caption = '';
			}

			return prev + `
				<div class="swiper-slide fs-swiper-slide">
					<img class="fs-swiper-image swiper-lazy" data-src="${ curr.src }" />
					${ caption }
					<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
				</div>
			`;
		}, '');
	}

	/**
	 * Get navigation markup if more than one slide
	 * @return {String}      - html string
	 */
	getNavigationMarkup(data) {
		if (this.navigation && data.length > 1) {
			return `
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>
			`;
		}

		return '';
	}

	/**
	 * show the dialog with instance slider
	 * @param {Number} slideIndex Index of slide to show when opened
	 */
	show(slideIndex) {
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

		this.swiper.update();
		if (slideIndex !== undefined) {
			this.swiper.slideTo(slideIndex, 0);
		}

		function closeDialog () {
			css(document.body, {
				'overflow': null
			});
		}
	}

	/**
	 * hide the instance's dialog
	 */
	hide() {
		this.dialog && this.dialog.hide();
	}

	/**
	 * go to previous slide
	 */
	prevSlide() {
		this.swiper.slidePrev()
	}

	/**
	 * go to next slide
	 */
	nextSlide() {
		this.swiper.slideNext()
	}
}

module.exports = SwiperFullscreen;
