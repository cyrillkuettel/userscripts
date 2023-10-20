// ==UserScript==
// @name         Minimize .po files
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Minimize .po files in github pull request
// @author       Cyrill Küttel
// @match        https://github.com/*/*/pull/*/files
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function main() {
        setTimeout(function() {
            const headers = document.querySelectorAll('.js-diff-progressive-container .file-header');
            if (headers) {
                headers.forEach(header => {
                    const button = header.querySelector('button');
                    const anchors = header.querySelectorAll('a.Link--primary.Truncate-text');
                    if (anchors) {
                        const childAnchor = Array.from(anchors).find(anchor => anchor.title.endsWith('.po'));
                        if (childAnchor && button) {
                            button.click();
                        }
                    }
                });
            }
        }, 4000); // seconds delay, else it won't work!!
    }

    if (document.readyState !== 'loading') {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main);
    }
})();

