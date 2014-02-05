// ==UserScript==
// @name        github-hide-automerge
// @namespace   http://springsource.org
// @description Hide auto-merge option in github
// @include     https://github.com/*/*/pull/*
// @include     http://github.com/*/*/pull/*
// @version     1
// @grant		none
// ==/UserScript==
try {
	document.getElementById("js-pull-merging").getElementsByTagName("div")[0].getElementsByTagName("div")[0].style.display = 'none';
} catch(e) {
}
