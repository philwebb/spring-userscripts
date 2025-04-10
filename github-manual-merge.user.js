// ==UserScript==
// @name        github-manual-merge
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/*/*
// @include     http://github.com/*/*
// @version     1
// @grant       none
// ==/UserScript==
(function() {

    'use strict'

    var repository;
	var username;
	var targetbranch;
	var remotebranch;
	var requestnumber;
	var localbranch;

	function apply() {
		var discussionBucket = document.getElementById("discussion_bucket");
        if (!discussionBucket) return
		var mergeDiv = document.getElementById("github-manual-merge");
		if (!mergeDiv) {
			mergeDiv = document.createElement('div');
			mergeDiv.setAttribute("id", "github-manual-merge");
			mergeDiv.setAttribute("style", "padding: 10px 10px; margin-bottom: 12px; border: 1px solid #EEEEEE; background-color: #f6f8fa;");
		}

		var discussionTimelineElememt = document.evaluate(".//*[contains(@class, 'discussion-timeline')]", discussionBucket, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(window.location.href.indexOf("/pull/") > -1 && discussionTimelineElememt) {
			var discussionHeaderElement = document.getElementById("partial-discussion-header");
			var status = document.evaluate(".//*[contains(@class, 'State')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
			if(status != 'Closed') {
				discussionTimelineElememt.parentElement.insertBefore(mergeDiv, discussionTimelineElememt);
				var metas = document.getElementsByTagName('meta');
				var headRefElement = document.evaluate(".//*[contains(@class, 'head-ref')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				var headRefTitle = headRefElement.title;
				repository = "https://github.com/" + headRefTitle.match("(.*):")[1];
				username = document.evaluate(".//*[contains(@class, 'author')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
				var branches = document.evaluate(".//*[contains(@class, 'commit-ref')]", discussionHeaderElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
				targetbranch = branches.iterateNext().children[0].children[1].textContent.trim();
				branches.iterateNext();
				remotebranch = branches.iterateNext().children[0].children[1].textContent.trim();
				requestnumber = document.evaluate(".//*[contains(@class, 'gh-header-number')]", discussionHeaderElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim().substring(1);
				localbranch = 'pr/' + requestnumber;
				updateMergeDivContent();
			}
		}
	}

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
		switch(fetchstyle) {
			case 'default' : fetchstyle = 'small'; break;
			case 'small'   : fetchstyle = 'pr'; break;
			case 'pr'      : fetchstyle = 'alias'; break;
			case 'alias'   : fetchstyle = 'default'; break;
		}
		localStorage['github-manual-merge-fetchstyle'] = fetchstyle;
		updateMergeDivContent();
	}

	function updateMergeDivContent() {
		var mergeDiv = document.getElementById("github-manual-merge");
		var fetchstyle = localStorage['github-manual-merge-fetchstyle'] || 'default';

		var mergeInfo = new Array();
		if (fetchstyle === 'default') {
			mergeInfo.push(
				'git remote add ' + username + ' ' + repository + '\n');
			mergeInfo.push(
				'git fetch ' + username + '\n' +
				'git checkout -b ' + localbranch + ' ' + username + '/' + remotebranch + '\n');
			mergeInfo.push(
				'git rebase ' + targetbranch + '\n');
			mergeInfo.push(
				'git checkout ' + targetbranch + '\n');
			mergeInfo.push(
				'git merge --no-ff --log -m "Merge pull request #' + requestnumber + ' from ' + username + '" ' + localbranch + '\n');
			mergeInfo.push(
				'git commit --amend -m"$(git log --format=%B -n1)$(echo "\\n\\nCloses ' + requestnumber + '")"');
		} else if (fetchstyle === 'small') {
			mergeInfo.push(
				'git fetch ' + repository + ' ' + remotebranch + '\n' +
				'git checkout -b ' + localbranch + ' FETCH_HEAD\n');
			mergeInfo.push(
				'git rebase ' + targetbranch + '\n');
			mergeInfo.push(
				'git checkout ' + targetbranch + '\n');
			mergeInfo.push(
				'git merge --no-ff --log -m "Merge pull request #' + requestnumber + ' from ' + username + '" ' + localbranch + '\n');
			mergeInfo.push(
				'git commit --amend -m"$(git log --format=%B -n1)$(echo "\\n\\nCloses ' + requestnumber + '")"');
		} else if (fetchstyle === 'alias') {
			mergeInfo.push(
				'git checkout ' + localbranch + '\n');
			mergeInfo.push(
				'git rebase ' + targetbranch + '\n');
			mergeInfo.push(
				'git checkout ' + targetbranch + '\n');
			mergeInfo.push(
				'git mergepr ' + localbranch + '\n');
		} else {
			mergeInfo.push(
				'git checkout ' + localbranch + '\n');
			mergeInfo.push(
				'git rebase ' + targetbranch + '\n');
			mergeInfo.push(
				'git checkout ' + targetbranch + '\n');
			mergeInfo.push(
				'git merge --no-ff --log -m "Merge pull request #' + requestnumber + ' from ' + username + '" ' + localbranch + '\n');
			mergeInfo.push(
				'git commit --amend -m"$(git log --format=%B -n1)$(echo "\\n\\nCloses gh-' + requestnumber + ')"');
		}

		mergeDiv.innerHTML = "";
		var toggleFetchStyleDiv = document.createElement('div');
		toggleFetchStyleDiv.setAttribute("style", "float: right; cursor: pointer; cursor: hand; color: #999999;");
		toggleFetchStyleDiv.addEventListener("click", toggleFetchStyle, false);
		toggleFetchStyleDiv.innerHTML = '<svg width="14" viewBox="0 0 14 16" version="1.1" height="16" class="octicon octicon-gear" aria-hidden="true"><path d="M14 8.77V7.17l-1.94-0.64-0.45-1.09 0.88-1.84-1.13-1.13-1.81 0.91-1.09-0.45-0.69-1.92H6.17l-0.63 1.94-1.11 0.45-1.84-0.88-1.13 1.13 0.91 1.81-0.45 1.09L0 7.23v1.59l1.94 0.64 0.45 1.09-0.88 1.84 1.13 1.13 1.81-0.91 1.09 0.45 0.69 1.92h1.59l0.63-1.94 1.11-0.45 1.84 0.88 1.13-1.13-0.92-1.81 0.47-1.09 1.92-0.69zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>'
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

    document.addEventListener("turbo:before-render", async (event) => {
        event.preventDefault()
        apply()
        event.detail.resume()
    })

	apply();
})();
