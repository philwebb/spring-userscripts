// ==UserScript==
// @name        github-comment-with
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/*/*
// @include     http://github.com/*/*
// @version     1
// @grant		none
// ==/UserScript==
(function(unsafeWindow) {

	var ITEMS = {
		"Crosspost": 
		"Thanks for reporting, but I notice you've also posted the same " +
		"question on [Stack Overflow](http://stackoverflow.com/). " +
		"It's better if in the future you don't " +
		"cross-post questions as it makes it hard for people searching to " +
		"find answers. I'll close this one in favor of Stack Overflow.",
		
		"Moved to Stack Overflow": 
		"Thanks for getting in touch, but it feels like this is a question " +
		"that would be better suited to " +
		"[Stack Overflow](http://stackoverflow.com/). As mentioned in " +
		"[the guidelines for contributing](https://github.com/spring-projects/" + 
		"spring-boot/blob/master/CONTRIBUTING.adoc#using-github-issues), we " +
		"prefer to use GitHub issues only for bugs and enhancements. Feel free " +
		"to update this issue with a link to the re-posted question (so that " +
		"other people can find it) or add some more details if you feel this " + 
		"is a genuine bug."
	};

	var menuElement;

	function init() {
		menuElement = document.createElement ('span');
		var listItemsHtml = '';
		for (var title in ITEMS) {
			if (ITEMS.hasOwnProperty(title)) {
				listItemsHtml += '<li class="js-navigation-item comment-with-menu-item">' + title + '</li>'
			}
		}
		menuElement.innerHTML = '<span id="comment-with-button" style="margin-left: 8px; color: #aaa; cursor: pointer;" \
			class="octicon octicon-gear"></span>\
			<div style="position: absolute; top: 15px; right:2px; z-index: 30;">\
			<div id="comment-with-menu" class="suggester js-menu-content js-navigation-container js-active-navigation-container">\
			<ul class="suggestions">' + listItemsHtml + '</ul>\
			</div>\
			</div>';
	}

	function apply() {
		console.log("Adding comment-with menu");
		$('#comment-with-menu').removeClass('active');
		var parentDiv = document.querySelector(".discussion-timeline-actions .previewable-comment-form .comment-form-head div.right");
		if (parentDiv) {
			parentDiv.appendChild(menuElement);
		}
		$('#comment-with-button').click(function(e) {
			$('.comment-with-menu-item').removeClass('navigation-focus');
			$('#comment-with-menu').addClass('active');
			e.stopPropagation();
		});
		$('body').click(function() {
			$('#comment-with-menu').removeClass('active');
		});
		$('.comment-with-menu-item').click(function(e) {
			var comment = ITEMS[$(this).text()];
			$(".write-tab").click();
			var commentField = $("#new_comment_field");
			commentField.val(commentField.val() + comment);
		});
	}

	unsafeWindow.$(document).on("pjax:end", function() {
	    apply()
	});
	init();
    apply();
})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);



