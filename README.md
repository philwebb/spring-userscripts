# Spring Userscripts #
A collection of userscripts useful for Spring committers

## Installation ##
### Chrome ###
* Open [chrome://chrome/extensions/](chrome://chrome/extensions/)
* Drag the script you want to load to the window

### Firefox ###
* Install [Greasmonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
* Browse to the scripts folder inside Firefox (either local or from github)
* Click on the user.js script that you want to install

## Scripts ##
### github-jira ###
Allows JIRA references displayed on github to appear as links back to [jira.springsource.org](http://jira.springsource.org).
### github-manual-merge ###
Augments github pull request for spring projects with the manual merge commands that can be run from the command line.

## Enable GitHub PRs ##
The github-manual-merge.user.js script can work with GitHub `pr/*` remotes, to add them:

Locate the section for your github remote in the `.git/config` file. It looks like this:

```
[remote "origin"]
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = git@github.com:joyent/node.git
```

Now add the line `fetch = +refs/pull/*/head:refs/remotes/origin/pr/*` to this section. Obviously, change the github url to match your project's URL. It ends up looking like this:

```
[remote "origin"]
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = git@github.com:joyent/node.git
	fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```

See https://gist.github.com/piscisaureus/3342247