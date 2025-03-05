// ==UserScript==
// @name         OneGov Root Fix Event Loop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aggressively monitors and redirects from root URL
// @author       You
// @match        http://localhost/*
// @match        http://localhost:8080/*
// @match        http://127.0.0.1/*
// @match        http://127.0.0.1:8080/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Immediately log that we're running
    console.log('[Root Fix] Script running at root URL');
    
    // AGGRESSIVE EVENT LOOP - runs every 100ms to check and redirect
    function startRootWatchdog() {
        // First check immediately
        checkAndRedirect();
        
        // Then set up interval for continuous checking
        const intervalId = setInterval(checkAndRedirect, 100);
        
        // Also add safety cleanup after 30 seconds (in case we get stuck)
        setTimeout(() => clearInterval(intervalId), 30000);
        
        function checkAndRedirect() {
            // Double check we're still at root
            if (window.location.pathname === "/" || window.location.pathname === "") {
                const savedPath = sessionStorage.getItem('onegovRedirectTarget') || 
                                 localStorage.getItem('onegovRedirectTarget') ||
                                 localStorage.getItem('onegovAppPath') ||
                                 sessionStorage.getItem('onegovAppPath');
                
                if (savedPath) {
                    console.log('[Root Fix] REDIRECTING from root to: ' + savedPath);
                    
                    // Force redirect with timeout to ensure it happens
                    setTimeout(() => {
                        window.location.replace(window.location.origin + savedPath);
                    }, 10);
                    
                    // Try to clear interval
                    clearInterval(intervalId);
                } else {
                    console.log('[Root Fix] Would redirect, but no saved path found. Checking all storage...');
                    
                    // Debug output of all storage to help troubleshoot
                    console.log('sessionStorage:', Object.entries(sessionStorage));
                    console.log('localStorage:', Object.entries(localStorage));
                    
                    // No saved path, redirect to a default path if we know it
                    // Adjust this path to match your application
                    const defaultPath = '/onegov_town6/zug';
                    console.log('[Root Fix] Using default path: ' + defaultPath);
                    
                    setTimeout(() => {
                        window.location.replace(window.location.origin + defaultPath);
                    }, 10);
                    
                    // Try to clear interval
                    clearInterval(intervalId);
                }
            } else {
                // If we're no longer at root, clear the interval
                console.log('[Root Fix] No longer at root URL, stopping watchdog');
                clearInterval(intervalId);
            }
        }
    }
    
    // Start the watchdog
    startRootWatchdog();
    
    // Also run on DOMContentLoaded as a backup
    document.addEventListener('DOMContentLoaded', startRootWatchdog);
    
    // And on full page load as a final backup
    window.addEventListener('load', startRootWatchdog);
    
    // Watch for URL changes as another backup
    let lastHref = window.location.href;
    
    // Create a function that will check if the URL has changed
    function urlChangeDetector() {
        if (window.location.href !== lastHref) {
            lastHref = window.location.href;
            // If we're at root URL, start the watchdog
            if (window.location.pathname === "/" || window.location.pathname === "") {
                startRootWatchdog();
            }
        }
        
        // Keep checking for URL changes
        requestAnimationFrame(urlChangeDetector);
    }
    
    // Start the URL change detector
    urlChangeDetector();
})();
