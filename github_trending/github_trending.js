// ==UserScript==
// @name         github trending
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show the github trending button on homepage
// @author       Cyrill Küttel
// @match        https://github.com/*
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
            const navbar = [...document.querySelectorAll('#global-nav')][0];
            Array.from(navbar.children).filter(field => field !== null).forEach((el) => {
                if (el.innerText === 'Trending') {
                    // prevent adding it twice
                    die("Nevermind");
                }
            });
            const trending = document.createElement('a');

            // Classes manually copied form the 'Explore' Element. This could also be coplied dynamically, but it might lead to problems.
            const classesToAdd = "js-selected-navigation-item Header-link mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade";
            // Add classes for css
            classesToAdd.split(" ").forEach((token) => {
                trending.classList.add(token);
            });
            trending.textContent = 'Trending';
            trending.href = 'https://github.com/trending';
            // Add the trending element
            navbar.after(trending);
        }());


    }
})();
