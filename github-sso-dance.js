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
        const globalSsoBannerElement = rootElement?.querySelector("react-partial[partial-name='global-sso-banner']")
        const embeddedDataScriptElement = globalSsoBannerElement?.querySelector("script[data-target='react-partial.embeddedData']")
        if (embeddedDataScriptElement) {
            const embeddedData = JSON.parse(embeddedDataScriptElement.textContent)
            const ssoOrgs = embeddedData?.props?.ssoOrgs
            var signOnAllButtonElement = document.getElementById("github-sso-sign-on-all")
            if (!signOnAllButtonElement) {
                signOnAllButtonElement = document.createElement('button')
                signOnAllButtonElement.setAttribute("id", "github-sso-sign-on-all")
                signOnAllButtonElement.setAttribute("class", "Button--secondary Button--small Button")
                signOnAllButtonElement.setAttribute("style", "margin: 10px;")
                signOnAllButtonElement.innerHTML = "Sign-on all"
            }
            globalSsoBannerElement.prepend(signOnAllButtonElement)
            signOnAllButtonElement.onclick = () => performGitHubSignOn(ssoOrgs)
            if (ssoContinue && ssoOrgs && ssoOrgs.length > 0) {
                performGitHubSignOn(ssoOrgs)
            }
        }
    }

    function performGitHubSignOn(ssoOrgs) {
        const login = ssoOrgs[0]?.login
        const href = `https://github.com/orgs/${login}/sso?return_to=%2Fnotifications&sso-continue=true&sso-count=${ssoOrgs.length}`
        window.location.href = new URL(href)
    }

    function gitHubSsoClickContinue(params) {
        const ssoCount = params.get("sso-count")
        const formElement = document.querySelector("form")
        const action = formElement?.action
        if (action && action.includes("/saml/")) {
            const url = new URL(action)
            const returnTo = url.searchParams.get("return_to")
            if (returnTo) {
                const returnToUrl = new URL(`https://github.com/${returnTo}`)
                returnToUrl.searchParams.delete("sso-continue")
                if (ssoCount > 1) {
                    returnToUrl.searchParams.set("sso-continue", "true")
                }
                url.searchParams.set("return_to", returnToUrl.toString().replaceAll("https://github.com/", ""))
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