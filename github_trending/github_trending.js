// ==UserScript==
// @name         github trending
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show the github trending button on homepage
// @author       You
// @match        http://github.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    /*
   // get the parent element of the navigation links
const navParent = document.getElementById('global-nav');

// create a new link element
const linkElement = document.createElement('a');


// append the new link element to the parent element
navParent.appendChild(linkElement);


    str = ` <div class="d-flex position-relative">
      <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade" data-ga-click="Header, click, Nav menu - item:trending context:user" data-octo-dimensions="location:nav_bar" data-turbo="false" data-selected-links=" /trending" href="/trending">Trending</a>
    </div>`
    let doc = new DOMParser().parseFromString(str, 'text/html');
    console.log(doc);
    */

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

    function addTrendingMenuItem() {
        const navParent = document.getElementById('global-nav');

        const $secondListItem = $('.header-nav.left .header-nav-item:nth-child(2)');
        const $trendingListItem = $(`<div class="d-flex position-relative">
      <a class="js-selected-navigation-item Header-link flex-auto mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade" data-ga-click="Header, click, Nav menu - item:trending context:user" data-octo-dimensions="location:nav_bar" data-turbo="false" data-selected-links=" /trending" href="/trending">Trending</a>
    </div>`)
	$secondListItem.after($trendingListItem);

    }

    addTrendingMenuItem();

    }



})();
