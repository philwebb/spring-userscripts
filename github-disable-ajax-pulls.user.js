// ==UserScript==
// @name        github-disable-ajax-pulls
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/*/*/pulls*
// @include     http://github.com/*/*/pulls*
// @version     1
// @grant		none
// ==/UserScript==

$('#issues-container a').click(function() {
	window.location.href = $(this).attr('href');
	return false;
});
