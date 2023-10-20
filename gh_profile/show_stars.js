(function () {
    'use strict';

    if (document.readyState !== 'loading') {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            main();
        });
    }
	
    function main() {	
      

        (function () {
                    
          const parent = document.querySelector('turbo-frame#user-profile-frame').firstElementChild;
          // swap
          let tmp = parent.children[1];
          parent.insertBefore(parent.children[2], tmp);
          parent.insertBefore(tmp, parent.children[2].nextSibling);
	
        }());
      
    }
})();
