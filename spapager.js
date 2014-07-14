var spapager = (function(){
	var currentPage; // Holds the currently visible page.
	var cssPrefix = 'spapager'; // Holds the css name for all spapage related css selectors.
	var noCssAnimation = false; // Set to true if jQuery animation should be used rather than CSS animation
	var noCssAnimationSpeed = 500; // Set the animations speed when using noCSSAnimation only

	/**
	 * Initializes the paging concept. 
	 * Typically executed after the DOMLoaded event triggered.
	 * All divs with data-role="page" are considered pages.
	 * All divs are auto-hidden, except for the first one in the document.
	 * All divs get the page class which makes them 100%x100% in size and positioned relatively.
	 * @param config Optional object containing configuration options for the class.
	 * Keys:
	 * cssPrefix: Overrides the standard css prefix "spapager".
	 * noCssAnimation: Set to true to avoid using css3 animations and fall back to jQuery's animate function.
	 */
	var init = function(config) {
		if (typeof config == 'object') {
			if (config.cssPrefix)
				cssPrefix = config.cssPrefix;
			
			if (config.noCssAnimation) {
				noCssAnimation = true;
				
				if (config.noCssAnimationSpeed) {
					noCssAnimationSpeed = config.noCssAnimationSpeed;
				}
			}
		}
		
		$('div[data-role="page"]').addClass('hidden').addClass(cssPrefix);
		$('div[data-role="page"]:eq(0)').removeClass('hidden').addClass(cssPrefix+'-current');
		currentPage = $('div[data-role="page"]:eq(0)');
	};
	
	/**
	 * Add a new page to the DOM
	 * @param id String identifying the new page. Obviously has to be unique.
	 */
	var addPage = function(id) {
		
			// If there's no page with this id yet, accept it and register it
		if ($('#'+id).length>0) {
			console.error('Unable to add page. Page already exists.');
			return;
		}
			//Add the new page to the DOM.
		var newPage = $('<div/>', {
					'id':id,
					'data-role':'page',
					'class':cssPrefix+' hidden'
				});
		
		$('body').append(newPage);
	
			//Return a jQuery object referring the new page.
		return newPage;
	};
	
	var removePage = function(id) {	
			// Check if there's a page with this id.
			// If not then we can't delete it...
		if ($('#'+id).length<1) {
			console.error('Unable to remove page. Page does not exist.');
			return;
		}
			// Remove page div from DOM
		$('div[data-role="page"]#'+id).remove();
		
		return;
	};
	
	/**
	 * Switch from the currently visible page to the page with id <toPage>.  
 	 * @param toPage jQuery object or string identifying the page to which must be switched. 
 	 * @param config Optional object containing switching configuration.
 	 * Keys:
 	 * transition: String describing the transition direction: slide-left, slide-right, slide-up, slide-down
	 */
	var changePage = function(toPage, config) {
			// Check inputs
		if (typeof toPage == 'string') {
			toPageString = toPage; // For error reporting
			toPage = $('div#'+toPage);
			if (toPage.length <1 || toPage.length>1) {
				console.log('Cannot switch to page with id "'+toPageString+'". Page does not exists or exists more than once.')
				return;
			}
		}
		
			// Avoid same page switching
		if (currentPage.attr('id') == toPage.attr('id')) {
			console.log('Blocked changing to same page');
			return;
		}
			
			// Defaults for the config object
		if (typeof config !== 'object')
			config = {
				transition: false
			};
		
			// Should we use CSS animation?
		if (noCssAnimation) {
			_changePageNoCSS(toPage, config);
		} else {
			_changePage(toPage, config);
		}
	};
	
	var _changePage = function(toPage, config) {
		var handleSlide = function(cssAnimationName) {
			toPage.addClass(cssAnimationName);
			toPage.one(
				'webkitAnimationEnd oanimationend msAnimationEnd animationend',   
				function(e) {
					if ($(e.currentTarget).hasClass(cssPrefix)) {
						toPage.removeClass(cssAnimationName);
						_terminateChangePage(toPage, config);
					}
				}
			);
		}
		_startChangePage(toPage, config);
		
		switch(config.transition) {
			case 'slide-left':
				handleSlide(cssPrefix+'-slide-left');
			break;
			case 'slide-right':
				handleSlide(cssPrefix+'-slide-right');
			break;
			case 'slide-up':
				handleSlide(cssPrefix+'-slide-up');
			break;
			case 'slide-down':
				handleSlide(cssPrefix+'-slide-down');
			break;
			default:
				_terminateChangePage(toPage, config);
		}
	};
	
	var _changePageNoCSS = function(toPage, config) {
		var handleSlide = function(cssAttr, value) {
			toPage.css(cssAttr, value);
			var o = {};
			o[cssAttr]='0%';
			toPage.animate(o, noCssAnimationSpeed, 'swing',	function() {
				_terminateChangePage(toPage, config);
			});
		}
		_startChangePage(toPage, config);
		
		switch(config.transition) {
			case 'slide-left':
				handleSlide('left','100%');
			break;
			case 'slide-right':
				handleSlide('left','-100%');
			break;
			case 'slide-up':
				handleSlide('top','100%');
			break;
			case 'slide-down':
				handleSlide('top','-100%');
			break;
			default:
				_terminateChangePage(toPage, config);
		}
	};
	
	var _createEmptyPageObject = function(id) {
		return {'id':id};
	}

	var _startChangePage = function(toPage, config) {
		toPage.trigger('beforeShow', {
			currentPage: currentPage.attr('id'),
			nextPage: toPage.attr('id'),
			transition: config.transition || ''
		});
		toPage.addClass(cssPrefix+'-to'); // 
		currentPage.addClass(cssPrefix+'-current'); // Should already be the case...
		currentPage.trigger('beforeHide', {
			currentPage: currentPage.attr('id'),
			nextPage: toPage.attr('id'),
			transition: config.transition || ''
		});
		toPage.removeClass('hidden');
	};
	
	var _terminateChangePage = function(toPage, config) {
		currentPage.addClass('hidden').removeClass(cssPrefix+'-current');
		toPage.addClass(cssPrefix+'-current').removeClass(cssPrefix+'-to');
		var previousPage = currentPage;
		currentPage.trigger('hide', {
			currentPage: currentPage.attr('id'),
			previousPage: previousPage.attr('id'),
			transition: config.transition || ''
		});
		currentPage = $('div#'+toPage.attr('id'));
		
		toPage.trigger('show', {
			previousPage: previousPage.attr('id'),
			currentPage: currentPage.attr('id'),
			transition: config.transition || ''
		});
	};
	
	return {
		addPage: addPage,
		init: init,
		changePage: changePage,
		removePage: removePage
	};
})(); 