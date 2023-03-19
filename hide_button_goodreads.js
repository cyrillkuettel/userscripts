(function() {
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

        const selectedSpan = Array.from(document.querySelectorAll('span'))
        .find(span => span.textContent === 'Buy on Amazon');

        const buttonContainer = selectedSpan.parentNode.parentNode.parentNode;
        console.log(buttonContainer);
        buttonContainer.style.display = "None";

    }


})();
