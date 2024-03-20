// ==UserScript==
// @name     Only Classical Lichess
// @version  1
// @grant    none
// @match     https://lichess.org/
// ==/UserScript==



(function() {
    'use strict';

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) continue;
}

main();

    document.addEventListener('DOMContentLoaded', function() {
        main();
    });


    function main() {

sleep(100);

        (function() {

            const nodes = document.querySelectorAll('.lobby__app__content > div'); // Select all child nodes
            console.log(nodes);
            nodes.forEach(node => {

                const firstChar = node.getAttribute('data-id').split('+')[0];
                if (!(Number(firstChar) >= 30)) {
                    node.remove();
                }

            });

        })();
    }
})();
