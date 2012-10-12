// ==UserScript==
// @name        github-jira
// @namespace   http://springsource.org
// @description GitHub JIRA integration
// @include     http://github.com/SpringSource/*
// @include     https://github.com/SpringSource/*
// @include     http://github.com/*/spring-*
// @include     https://github.com/*/spring-*
// @version     1
// @grant       none
// ==/UserScript==
textNodes = document.evaluate("//*[not(self::a)]/text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var searchRE = new RegExp('([A-Z]{3,}\-[0-9]{3,})','g');
var jiraReplacementDiv = document.createElement('div');
for (var i=0;i<textNodes.snapshotLength;i++) {
	var node = textNodes.snapshotItem(i);
	if(searchRE.test(node.data)) {
		jiraReplacementDiv.innerHTML = node.data.replace(searchRE, "<a href=\"https://jira.springsource.org/browse/$1\">$1</a>"); 
		while (jiraReplacementDiv.firstChild) {
        	node.parentNode.insertBefore(jiraReplacementDiv.firstChild, node);
    	}
    	node.parentNode.removeChild(node);
    }
}