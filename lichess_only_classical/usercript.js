// ==UserScript==
// @name     Only Classical Lichess
// @version  1
// @grant    none
// @match     https://lichess.org/
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const nodes = document.querySelectorAll('.lobby__app__content > div');
        if (nodes.length > 11 ) {
            main();
            obs.disconnect(); // Stop observing after main is called
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function main() {
        const nodes = document.querySelectorAll('.lobby__app__content > div');
        nodes.forEach(node => {
            const firstChar = node.getAttribute('data-id').split('+')[0];
            if (!(Number(firstChar) >= 30)) {
                node.remove();
            }
        });
    }
})();
