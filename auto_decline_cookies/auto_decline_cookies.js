// ==UserScript==
// @name         Auto decline cookies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Declines cookies in the popup which appears in google
// @author       Cyrill Küttel
// @match        https://google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (document.readyState !== 'loading') {
        console.log('document is already ready, just execute code here');
        main();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('document was not ready, place code here');
            main();
        });
    }

    function main() {

        (function () {

            const findElementByText = (text) => {
                // Search for the 'Reject All' button on the page.

                // Languages English and German are taken into consideration.
                const elements = document.getElementsByTagName("button");
                for (const element of elements) {
                    if (element && element.textContent && element.textContent.includes(text)) {
                        return element;
                    }
                }

                // If we land here, they have changed the DOM structure,but we will still find it!
                // Just loop over _everything_ and search the text
                const l = text.length;
                const elementsWithText = Array.from(document.querySelectorAll('*')).filter(el => el.textContent.trim().length === l);

                for (const element of elementsWithText) {
                    if (element && element.textContent && element.textContent.includes(text)) {
                        return element;
                    }
                }
                return null;
            };


            const textByLanguages = ["Reject all", "Alle ablehnen"];
            textByLanguages.forEach(value => {
                const rejectButton = findElementByText(value);
                if (rejectButton !== null) {
                    rejectButton.click();
                    throw new Error("Bye Bye  ( ͡° ͜ʖ ͡°)╭∩╮");
                }
            });
        }());
    }
})();

