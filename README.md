spapager
========

SPA Pager is a JavaScript library that provides a simple imitation of jQuery Mobile's "page" concept.
It is meant for Single Page Applications written in JavaScript and works on mobile devices.
Both CSS Animation and jQuery's animation function are used in order to support a wide range of devices / browsers

This library has been purposefully kept as lightweight as possible so it can be used in any (mobile) web application without making the project much bulgier.
It is based on jQuery so it would be advisable only to use this library if you’re using jQuery already.


Usage
=====

1. Add pages to your html as follows:
<div data-role="page" id="pageOne">
	Hello World
</div>

2. When the dom is loaded, init the library.
* All divs with data-role="page" are considered pages.
* All divs are auto-hidden, except for the first one in the document.
* All divs get the page class which makes them 100%x100% in size and positioned relatively.

*Short*
$(function() {
	spapager.init();
});

*Long*
$(function() {
	spapager.init({
		cssPrefix:'spapager', // Default: spapager. Change to something else if the CSS classes collide with your css classes. Don't forget to update the CSS classnames accordingly.
		noCssAnimation: true, // Avoid using CSS animation. Use this if you suspect the browser has no CSS3 animation support.
		noCssAnimationSpeed: 250 // When NOT using CSS3 animation, define the animation speed here. Otherwise you can determine this in the keyframe definitions in the CSS.
	});
});

3. Trigger page switches 
*Syntax:*
spapager.changePage(
	<target page ID>, 
	{
		'transition':'slide-up || slide-down || slide-left || slide-right', 
		'onTransitionEnd': function(eventData) {
			console.log(eventData);
		}
	}
);

*Examples*
// No transition. Immediate change.
spapager.changePage('pageTwo');

// slide up transition.
spapager.changePage('pageTwo', {'transition':'slide-up'});

// slide up transition and callback once animation ends.
spapager.changePage('pageTwo', {'transition':'slide-up', onTransitionEnd: function(x) { alert('This is the new page!!!'); }});

4. Add pages
If you need to add a new page, make sure to use the library's addPage method. 
Otherwise you will not be able to switch to the new page as the library will not know about it. This function also ass the appropriate classes to the new page.
*Syntax*
	var myPage = addPage(<page ID>); // MyPage will hold a jQuery object containing the new page which has been added to the DOM already.