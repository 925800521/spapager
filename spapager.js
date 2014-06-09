var spapager = (function(){
	var currentPage; // Holds the currently visible page.
	
	/**
	 * Initializes the paging concept. 
	 * All divs with data-role="page" are considered pages.
	 * All divs are auto-hidden, except for the first one in the document
	 * All divs get the page class which makes them 100%x100% in size and positioned relatively
	 */
	var init = function() {
		$('div[data-role="page"]').addClass('page hidden');
		$('div[data-role="page"]:eq(0)').removeClass('hidden').addClass('page-current');
		currentPage = $('div[data-role="page"]:eq(0)');
	}
	
	/**
	 * Switch from the currently visible page to the page with id <toPage>.  
 	 * @param toPage jQuery object or string identifying the page to which must be switched. 
 	 * @param config Optional object containing switching configuration
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
			
		if (typeof config !== 'object')
			config = {
				transition: false
			};
		
		_changePage(toPage, config);
	}
	
	var _changePage = function(toPage, config) {
		switch(config.transition) {
			case 'slide-left':
				toPage.css('left','100%');
				_startChangePage(toPage);
				toPage.animate({'left':'0%'}, 500, 'swing',	function() {
					_terminateChangePage(toPage);
				});
			break;
			case 'slide-right':
				toPage.css('left','-100%');
				_startChangePage(toPage);
				toPage.animate({'left':'0%'}, 500, 'swing',	function() {
					_terminateChangePage(toPage);
				});
			break;
			case 'slide-up':
				toPage.css('top','100%');
				_startChangePage(toPage);
				toPage.animate({'top':'0%'}, 500, 'swing',	function() {
					_terminateChangePage(toPage);
				});
			break;
			case 'slide-down':
				toPage.css('top','-100%');
				_startChangePage(toPage);
				toPage.animate({'top':'0%'}, 500, 'swing',	function() {
					_terminateChangePage(toPage);
				});
			break;
			default:
				_startChangePage(toPage);
				_terminateChangePage(toPage);
		}
	}
	
	var _startChangePage = function(toPage) {
		toPage.addClass('page-to'); // 
		currentPage.addClass('page-current'); // Should already be the case...
		toPage.removeClass('hidden');
	}
	
	var _terminateChangePage = function(toPage) {
		currentPage.addClass('hidden').removeClass('page-current');
		toPage.addClass('page-current').removeClass('page-to');
		currentPage = $('div#'+toPage.attr('id'));
	}

	
	return {
		init: init,
		changePage: changePage
	};
})(); 
