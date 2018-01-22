// ==UserScript==
// @name        github-label-style
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/*/*
// @include     http://github.com/*/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('div.labels a.label { line-height: 1.4 !important; font-size: 11px !important; }');
    addGlobalStyle('a span.css-truncate-target { max-width: 180px !important; }');
})();