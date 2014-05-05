// ==UserScript==
// @name        github-manual-merge
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/*/*/pull/*
// @include     http://github.com/*/*/pull/*
// @version     1
// @grant		none
// ==/UserScript==

function selectText(e) {
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(this);
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(this);
		window.getSelection().addRange(range);
	}
}

function toggleFetchStyle(e) {
	var fetchstyle = localStorage['github-manual-merge-fetchstyle'] || 'default';
	fetchstyle = (fetchstyle === 'default' ? 'small' : 'default');
	localStorage['github-manual-merge-fetchstyle'] = fetchstyle;
	updateMergeDivContent();
}

function updateMergeDivContent() {

	var fetchstyle = localStorage['github-manual-merge-fetchstyle'] || 'default';

	var mergeInfo = new Array();
	if(fetchstyle === 'default') {
	mergeInfo.push(
		'git remote add ' + username + ' https://github.com/' + username + '/' + repository + '.git\n');
		mergeInfo.push(
			'git fetch ' + username + '\n'+
			'git checkout --track ' + username + '/' + remotebranch + ' -b ' + localbranch + "\n");
	} else {
		mergeInfo.push(
			'git fetch https://github.com/' + username + '/' + repository + '.git ' + remotebranch + '\n' +
			'git checkout -b ' + localbranch + ' FETCH_HEAD\n');
	}
	mergeInfo.push(
		'git rebase ' + targetbranch + '\n');
	mergeInfo.push(
		'git checkout ' + targetbranch + '\n');
	mergeInfo.push(
		'git merge --no-ff --log -m "Merge pull request #' + requestnumber + ' from ' + username + '/' + remotebranch + '" ' + localbranch + "\n");

	mergeDiv.innerHTML = "";
	var toggleFetchStyleDiv = document.createElement('div');
	toggleFetchStyleDiv.setAttribute("style", "float: right; cursor: pointer; cursor: hand; color: #999999;");
	toggleFetchStyleDiv.addEventListener("click", toggleFetchStyle, false);
	toggleFetchStyleDiv.innerHTML = '<span class="octicon octicon-gear"> </span>';
	mergeDiv.appendChild(toggleFetchStyleDiv);

	for (var i = 0; i < mergeInfo.length; i++) {
		var mergeInfoElement = document.createElement('pre');
		mergeDiv.appendChild(mergeInfoElement);
		if(i < mergeInfo.length-1) {
			mergeInfoElement.setAttribute("style", "margin-bottom: 6px;");
		}
		mergeInfoElement.innerHTML = mergeInfo[i];
		mergeInfoElement.addEventListener("click", selectText, false);
	}
}

// Grab variables we need from the page

var discussionHeaderElement = document.getElementById("js-discussion-header")
var metas = document.getElementsByTagName('meta'); 

var repository
for (i=0; i<metas.length; i++) { 
	if (metas[i].getAttribute("property") == "og:title") { 
		repository = metas[i].getAttribute("content");
		repository = repository.substr(repository.indexOf('/')+1);
	}
}

var username = document.evaluate(".//*[contains(@class, 'author')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
var branches = document.evaluate(".//*[contains(@class, 'commit-ref')]", discussionHeaderElement, null, XPathResult.ANY_TYPE, null);
var targetbranch = branches.iterateNext().children[1].textContent.trim();
var remotebranch = branches.iterateNext().children[1].textContent.trim();
var requestnumber = document.evaluate(".//*[contains(@class, 'gh-header-number')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim().substring(1);
var status = document.evaluate(".//*[contains(@class, 'state-indicator')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
var localbranch = (remotebranch === targetbranch ? ('pull' + requestnumber) : remotebranch);

// Insert our new div element

if(status != 'Closed') {
	var mergeDiv = document.createElement('div');
	mergeDiv.setAttribute("class", "timeline-comment-header");
	mergeDiv.setAttribute("style", "padding: 10px 10px; margin-top: 10px; border: 1px solid #EEEEEE;");
	discussionHeaderElement.parentNode.insertBefore(mergeDiv, discussionHeaderElement.nextSibling);
	updateMergeDivContent();
}
