// ==UserScript==
// @name        jira-commit-sha
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     http://jira.springsource.org/*
// @include     https://jira.springsource.org/*
// @version     1
// @grant		none
// ==/UserScript==

var metas = document.getElementsByTagName('meta'); 

var gitproject
for (i=0; i<metas.length; i++) { 
	if (metas[i].getAttribute("name") == "ajs-issue-key") { 
    	var issuekey = metas[i].getAttribute("content"); 
    	if(issuekey.substring(0,3) === "SPR") gitproject = "https://github.com/SpringSource/spring-framework";
    	if(issuekey.substring(0,3) === "SWF") gitproject = "https://github.com/SpringSource/spring-webflow";
    } 
}

if(gitproject) {
	textNodes = document.evaluate("//*[not(self::a)]/text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var searchRE = new RegExp('([0-9a-z]{40})','g');
	var gitLinkReplacementDiv = document.createElement('div');
	for (var i=0;i<textNodes.snapshotLength;i++) {
		var node = textNodes.snapshotItem(i);
		if(searchRE.test(node.data)) {
			gitLinkReplacementDiv.innerHTML = node.data.replace(searchRE, "<a href=\"" + gitproject + "/commit/$1\">$1</a>"); 
			while (gitLinkReplacementDiv.firstChild) {
	        	node.parentNode.insertBefore(gitLinkReplacementDiv.firstChild, node);
	    	}
	    	node.parentNode.removeChild(node);
	    }
	}
}