// ==UserScript==
// @name         OneGov Root Redirect Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto login for OneGov with specific root URL monitor
// @author       You
// @match        http://127.0.0.1:8080/*
// @match        http://localhost:8080/*
// @match        *://*/onegov_*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function() {
    'use strict';
    
    // Configuration
    const config = {
        username: 'admin@example.org',
        password: 'test',
        loginPath: '/auth/login'
    };
    
    // IMPORTANT - Watch for navigation to root URL
    function checkRootURL() {
        // Check if we're at the exact root URL
        if (window.location.pathname === "/" || window.location.pathname === "") {
            console.log('[OneGov] At root URL, checking for redirect target');
            const redirectTarget = sessionStorage.getItem('onegovRedirectTarget');
            
            if (redirectTarget) {
                console.log('[OneGov] Redirecting from root to: ' + redirectTarget);
                window.location.href = redirectTarget;
                return true;
            }
        }
        return false;
    }
    
    // Run check immediately
    if (checkRootURL()) {
        return; // Stop here if we're redirecting
    }
    
    // Also set up a MutationObserver to check repeatedly as the page loads
    // This will catch client-side redirects
    const observer = new MutationObserver(function(mutations) {
        if (checkRootURL()) {
            observer.disconnect(); // Stop observing if we're redirecting
        }
    });
    
    // Start observing when the body exists
    function setupObserver() {
        if (document.body) {
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
        } else {
            // If body doesn't exist yet, try again soon
            setTimeout(setupObserver, 10);
        }
    }
    setupObserver();
    
    // Also check on URL changes (for single-page apps)
    let lastUrl = window.location.href;
    function checkURLChange() {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            checkRootURL();
        }
        requestAnimationFrame(checkURLChange);
    }
    checkURLChange();
    
    // For non-root URLs, standard login behavior
    function handleNormalPage() {
        // Don't run this on the root URL
        if (window.location.pathname === "/" || window.location.pathname === "") {
            return;
        }
        
        console.log('[OneGov] Script running on: ' + window.location.href);
        
        // Function to extract application path
        function getAppPath() {
            const path = window.location.pathname;
            const parts = path.split('/').filter(Boolean);
            
            if (parts.length >= 2 && parts[0].startsWith('onegov_')) {
                return `/${parts[0]}/${parts[1]}`;
            }
            
            if (parts.length >= 1 && parts[0].startsWith('onegov_')) {
                return `/${parts[0]}`;
            }
            
            return null;
        }
        
        // Store the current app path when on any valid page
        const appPath = getAppPath();
        if (appPath) {
            sessionStorage.setItem('onegovRedirectTarget', appPath);
            console.log('[OneGov] Stored app path: ' + appPath);
        }
        
        // Check if on login page
        const isLoginPage = window.location.pathname.includes(config.loginPath);
        
        // Check if logged in
        const isLoggedIn = document.querySelector('a[href*="logout"]') !== null;
        
        // If already logged in, do nothing
        if (isLoggedIn) {
            console.log('[OneGov] Already logged in, nothing to do');
            return;
        }
        
        // If on login page, fill and submit form
        if (isLoginPage) {
            console.log('[OneGov] On login page, filling form');
            
            // Give the page some time to fully load
            setTimeout(function() {
                // Find form elements
                const usernameField = document.getElementById('username') || 
                                    document.querySelector('input[name="username"]');
                const passwordField = document.getElementById('password') || 
                                    document.querySelector('input[name="password"]');
                const form = document.querySelector('form');
                
                if (!usernameField || !passwordField || !form) {
                    console.log('[OneGov] Could not find form elements');
                    return;
                }
                
                // Fill the form
                usernameField.value = config.username;
                passwordField.value = config.password;
                
                console.log('[OneGov] Submitting form');
                
                // Submit form
                const submitButton = form.querySelector('input[type="submit"]') || 
                                  form.querySelector('button[type="submit"]');
                
                if (submitButton) {
                    submitButton.click();
                } else {
                    form.submit();
                }
            }, 500);
        }
        // If not on login page and not logged in, redirect to login
        else {
            // Only redirect if we have a valid app path
            if (appPath) {
                const loginUrl = `${window.location.origin}${appPath}${config.loginPath}`;
                console.log('[OneGov] Redirecting to login: ' + loginUrl);
                window.location.href = loginUrl;
            } else {
                console.log('[OneGov] Could not determine login URL');
            }
        }
    }
    
    // Execute handleNormalPage after the page has loaded
    if (document.readyState === 'complete') {
        handleNormalPage();
    } else {
        window.addEventListener('load', handleNormalPage);
    }
})();
