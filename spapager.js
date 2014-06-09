var spapager = (function(){
	var currentPage; // Holds the currently visible page.
	var allPageIds; // Holds the ids of all pages. Used for duplicate checking.
	var cssPrefix = 'spapager'; // Holds the css name for all spapage related css selectors.
	
	/**
	 * Initializes the paging concept. 
	 * Typically executed after the onLoad event triggered. 
	 * All divs with data-role="page" are considered pages.
	 * All divs are auto-hidden, except for the first one in the document
	 * All divs get the page class which makes them 100%x100% in size and positioned relatively
	 * @param config Optional object containing configuration options for the class
	 * Keys:
	 * cssPrefix: Overrides the standard css prefix "spapager". 
	 */
	var init = function(config) {
		if (typeof config == 'object' && config.cssPrefix) {
			cssPrefix = config.cssPrefix;
		}
		
		$('div[data-role="page"]').addClass('hidden').addClass(cssPrefix);
		$('div[data-role="page"]:eq(0)').removeClass('hidden').addClass(cssPrefix+'-current');
		currentPage = $('div[data-role="page"]:eq(0)');
		
		
		
	}
	
	/**
	 * Add a new page to the DOM
	 * @param id String identifying the new page. Obviously has to be unique. 
	 */
	var addPage = function(id) {
			// If the allPageIds array is not populated yet, do so now.
		if (typeof allPageIds !== 'object')
			_findAllPageIds();
		
			// If there's no page with this id yet, accept it and register it
		if (allPageIds.indexOf(id) < 0) {
			allPageIds.push(id);
		} else {
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
	}
	
	var removePage = function(id) {
			// If the allPageIds array is not populated yet, do so now.
		if (typeof allPageIds !== 'object')
			_findAllPageIds();
		
			// If there's no page with this id we can't delete it...
		if (allPageIds.indexOf(id) < 0) {
			console.error('Unable to remove page. Page does not exist.');
			return
		}
		
		$('div[data-role="page"]#'+id).remove();
		
		var index = allPageIds.indexOf(id);
		if (index > -1) {
		    allPageIds.splice(index, 1);
		}
		
		return;
	}
	
	/**
	 * Switch from the currently visible page to the page with id <toPage>.  
 	 * @param toPage jQuery object or string identifying the page to which must be switched. 
 	 * @param config Optional object containing switching configuration.
 	 * Keys:
 	 * transition: String describing the transition direction: slide-left, slide-right, slide-up, slide-down
 	 * onTransitionEnd: Optional callback function that will be executed once the animation ends.
	 */
	var changePage = function(toPage, config) {
		if (typeof toPage == 'string') {
			toPageString = toPage; // For error reporting
			toPage = $('div#'+toPage);
			if (toPage.length <1 || toPage.length>1) {
				console.log('Cannot switch to page with id "'+toPageString+'". Page does not exists or exists more than once.')
				return;
			}
		}
		
		if (currentPage.attr('id') == toPage.attr('id')) {
				console.log('Blocked changing to same page');
				return;
			}
			
			// Defaults for the config object
		if (typeof config !== 'object')
			config = {
				transition: false,
				onTransitionEnd: false
			};
		
		_changePage(toPage, config);
	}
	
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
		_startChangePage(toPage);
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
	}
	
	var _findAllPageIds = function() {
		allPageIds = [];
		$('div[data-role="page"]').each(function(i,e) {
			var foundId = $(e).attr('id');
			if (foundId) allPageIds.push(foundId);
		});
		return;
	}
	
	var _startChangePage = function(toPage) {
		toPage.addClass(cssPrefix+'-to'); // 
		currentPage.addClass(cssPrefix+'-current'); // Should already be the case...
		toPage.removeClass('hidden');
	}
	
	var _terminateChangePage = function(toPage, config) {
		currentPage.addClass('hidden').removeClass(cssPrefix+'-current');
		toPage.addClass(cssPrefix+'-current').removeClass(cssPrefix+'-to');
		var previousPage = currentPage;
		currentPage = $('div#'+toPage.attr('id'));
		
		if (typeof config.onTransitionEnd == 'function') {
			config.onTransitionEnd({
				previousPage: previousPage.attr('id'),
				currentPage: currentPage.attr('id'),
				transition: config.transition || ''
			});
		}
	}

	
	return {
		addPage: addPage,
		init: init,
		changePage: changePage,
		removePage: removePage
	};
})(); 
