// ==UserScript==
// @name        github-hide-automerge
// @namespace   http://springsource.org
// @description Hide auto-merge option in github
// @include     https://github.com/*/*
// @include     http://github.com/*/*
// @version     1
// @grant		none
// ==/UserScript==
(function(unsafeWindow) {

	function apply() {
		try {
			$(".js-merge-branch-action").hide();
		} catch(e) {
		}
	}

	unsafeWindow.$(document).on("pjax:end", function() {
	    apply()
	});
    apply();
})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);
