// ==UserScript==
// @name        github-manual-merge
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/SpringSource/spring-framework/pull/*
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

var pullHeaderElement = document.getElementById("pull-head")
var metas = document.getElementsByTagName('meta'); 

var repository
for (i=0; i<metas.length; i++) { 
	if (metas[i].getAttribute("property") == "og:title") { 
    	repository = metas[i].getAttribute("content"); 
    } 
} 

var username     = document.evaluate("div/p/span[2]/span/span",
						pullHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
						.singleNodeValue.textContent.trim();
var branch       = document.evaluate("div/p/span[2]/span[2]",
						pullHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
						.singleNodeValue.textContent.trim();
var requestnumber= document.evaluate("div/div/span[2]",
						pullHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
						.singleNodeValue.textContent.trim().substring(1);

var mergeInfo = new Array();
mergeInfo.push(
	'git remote add ' + username + ' https://github.com/' + username + '/' + repository + '.git\n');
mergeInfo.push(
	'git fetch ' + username + '\n'+
	'git checkout --track ' + username + '/' + branch + ' -b ' + branch + '\n');
mergeInfo.push(
	'git rebase master');
mergeInfo.push(
	'git checkout master');
mergeInfo.push(
	'git merge --no-ff --log -m "Merge pull request #' + requestnumber + ' from ' + username + '/' + branch + '" ' + branch);

var mergeDiv = document.createElement('div');
mergeDiv.setAttribute("class", "pull-head");
mergeDiv.setAttribute("style", "padding: 10px;");
for (var i = 0; i < mergeInfo.length; i++) {
	var mergeInfoElement = document.createElement('pre');
	mergeDiv.appendChild(mergeInfoElement);
	if(i < mergeInfo.length-1) {
		mergeInfoElement.setAttribute("style", "margin-bottom: 6px;");
	}
	mergeInfoElement.innerHTML = mergeInfo[i];
	mergeInfoElement.addEventListener("click", selectText, false);
}
pullHeaderElement.parentNode.insertBefore(mergeDiv, pullHeaderElement.nextSibling);
