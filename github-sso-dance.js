// ==UserScript==
// @name        github-sso-dance
// @namespace   http://springsource.org
// @description Adds manual merge commands to pull requests
// @include     https://github.com/**
// @version     1
// @grant       none
// ==/UserScript==

(function() {

    'use strict'

    function githubSignOnAll(rootElement, ssoContinue) {
        const ssoSectionElement = rootElement?.querySelector("section[aria-labelledby='single-sign-on']")
        const ssoActionMenuElement = ssoSectionElement?.querySelector("action-menu")
        const focusGroupElement = ssoActionMenuElement?.querySelector("focus-group")
        const ssoActionListElement = ssoActionMenuElement?.querySelector("action-list")
        const ssoAnchorElements = getSsoAnchorElements(ssoSectionElement, ssoActionListElement, ssoContinue)
        if (ssoAnchorElements && focusGroupElement) {
            var signOnAllButtonElement = document.getElementById("github-sso-sign-on-all")
            if (!signOnAllButtonElement) {
                signOnAllButtonElement = document.createElement('button')
                signOnAllButtonElement.setAttribute("id", "github-sso-sign-on-all")
                signOnAllButtonElement.setAttribute("class", "Button--secondary Button--small Button")
                signOnAllButtonElement.innerHTML = "Sign-on all"
            }
            focusGroupElement.prepend(signOnAllButtonElement)
            signOnAllButtonElement.onclick = () => performGitHubSignOn(ssoAnchorElements)
        }
        if (ssoAnchorElements && ssoContinue) {
            performGitHubSignOn(ssoAnchorElements)
        }
    }

    function getSsoAnchorElements(ssoSectionElement, ssoActionListElement, ssoContinue) {
        if (ssoActionListElement) {
            return ssoActionListElement?.querySelectorAll("li.ActionListItem a")
        }
        if (ssoContinue) {
            const bannerActionsDivElement = ssoSectionElement?.querySelector("div.flash-action")
            return bannerActionsDivElement?.querySelectorAll("a.Button")
        }
        return null
    }

    function performGitHubSignOn(ssoAnchorElements) {
        const href = ssoAnchorElements[0]?.href
        if (href) {
            window.location.href = `${href}&sso-continue=true&sso-count=${ssoAnchorElements.length}`
        }
    }

    function gitHubSsoClickContinue(params) {
        const ssoCount = params.get("sso-count")
        const formElement = document.querySelector("form")
        const action = formElement?.action
        if (action && action.includes("/saml/")) {
            const url = new URL(action)
            const returnTo = url.searchParams.get("return_to")
            if (returnTo) {
                const returnToUrl = new URL(returnTo)
                returnToUrl.searchParams.delete("sso-continue")
                if (ssoCount > 1) {
                    returnToUrl.searchParams.set("sso-continue", "true")
                }
                url.searchParams.set("return_to", returnToUrl)
                formElement.action = url
            }
            formElement.submit()
        }
    }

    document.addEventListener("turbo:before-render", async (event) => {
        event.preventDefault()
        githubSignOnAll(event.detail.newBody)
        githubSignOnAll(document)
        event.detail.resume()
    })

    if (window.location.href.startsWith("https://github.com/notifications")) {
        const params = new URLSearchParams(window.location.search)
        githubSignOnAll(document.body, params.has("sso-continue"));
    }

    if (window.location.href.startsWith("https://github.com/orgs") && window.location.pathname.endsWith("/sso")) {
        const params = new URLSearchParams(window.location.search)
        if (params.has("sso-continue")) {
            gitHubSsoClickContinue(params)
        }
    }

})();