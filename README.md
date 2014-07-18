spapager
========

SPA Pager is a JavaScript library that provides a simple imitation of jQuery Mobile's "page" concept.
It is meant for Single Page Applications written in JavaScript and works on mobile devices.
Both CSS Animation and jQuery's animation function are used in order to support a wide range of devices / browsers

This library has been purposefully kept as lightweight as possible so it can be used in any (mobile) web application without making the project much bulgier.
It is based on jQuery so it would be advisable only to use this library if you're using jQuery already.



Usage
=====

### 1. Add pages to your html as follows:
	<div data-role="page" id="pageOne">
		Hello World
	</div>

### 2. Once the dom is loaded, init the library.

* All divs with data-role="page" are considered pages.
* All divs are auto-hidden, except for the first one in the document.
* All divs get the page class which makes them 100% x 100% in size and positioned relatively.

*Short*

	$(function() {
		spapager.init();
	});



*Long*

	$(function() {
		spapager.init({
			cssPrefix:'spapager', // Default: spapager. Change to something else if the CSS classes collide with your css classes. Don't forget to update the CSS classnames accordingly.
			noCssAnimation: true, // Avoid using CSS animation. Use this if you suspect the browser has no CSS3 animation support.
			noCssAnimationSpeed: 250, // When NOT using CSS3 animation, define the animation speed here. Otherwise you can determine this in the keyframe definitions in the CSS.
			pageChanged: function(eventData) {
				console.log('Page changed!');
				console.dir(eventData);
			}
		});
	});

### 3. Trigger page switches 
*Syntax:*

	spapager.changePage(
		<target page ID>, 
		{
			'transition':'slide-up || slide-down || slide-left || slide-right'
		}
	);

*Examples*

	// No transition. Immediate change.
	spapager.changePage('pageTwo');

	// slide up transition.
	spapager.changePage('pageTwo', {'transition':'slide-up'});



### 4. Add pages
If you need to add a new page, make sure to use the library's addPage method. 
Otherwise you will not be able to switch to the new page as the library will not know about it. This function also ass the appropriate classes to the new page.

*Syntax*

	// MyPage will hold a jQuery object containing the new page which has been added to the DOM already.
	var myPage = addPage(<page ID>); 
	
### 5. Remove pages
Removing a page works identical to the addPage method.

### 6. Events
Events are triggered on pages that are being hidden and on pages that are being shown.
Event handlers can simply be attached using the normal jQuery event listener approach.

The advantage of this approach is that 

* removing elements will automatically remove the events associated.
* unbinding events can be done through jQuery.

On every page change, all 4 available events are triggered:

* beforeHide
* hide
* beforeShow
* show

Together with the event, additional event data is sent, being:

* fromPage - The page transitioned from.
* toPage - The page transitioned to
* transition - The type of transition used.

*Syntax*

	$('#<page ID>').on('show', function(event, eventData) {
		alert('Hello');
		console.dir(eventData);
	});

Furthermore there is a callback that is triggered on every page change.
This callback is called after the animation has finished and returns the same eventdata as the other events
See the initialization example above for more info.

#FAQ
Q: Is the hashchange monitored?
A: No. But if you want you could use Ben Alman's excellent jQuery Plugin "BBQ".
On Hash Change you can then switch to the page you need to.
If you've attached the proper listeners there, then you can make sure that page is set-up properly before it gets shown.

Q: Is hash monitoring going to be included?
A: No. If you need that kind of functionality out of the box go for Ember, Angular or something similar.

Q: I need to pass additional event data when binding events. Can I do that?
A: Hm.. Good point. Let me think about it and add it as soon as I decide it's a good idea.

Q: Is there something I can do in return for all the code you've written for me?
A: Why yes there is... Consider linking to appwards.nl. That would directly help my business.

#License
Copyright (C) 2014 Appwards.nl, Menno Bieringa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#Contribute!!!
Feel free to improve this library and, if I like what you've done, I might just honor your pull request.