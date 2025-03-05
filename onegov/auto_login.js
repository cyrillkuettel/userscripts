// ==UserScript==
// @name         OneGov Auto Login and Root redirect 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Root URL redirect + auto login for OneGov
// @author       cyrill 
// @match        http://localhost/*
// @match        http://localhost:8080/*
// @match        http://127.0.0.1/*
// @match        http://127.0.0.1:8080/*
// @match        *://*/onegov_*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Immediately log that we're running
    console.log('[OneGov Helper] Script running on: ' + window.location.href);
    
    // Configuration
    const config = {
        username: 'admin@example.org',
        password: 'test',
        loginPath: '/auth/login',
        defaultPath: '/onegov_town6/zug',
        redirectCheckInterval: 100,  // ms
        maxWatchdogTime: 30000,      // 30 seconds
        formSubmitDelay: 500         // ms
    };
    
    // ====== REDIRECT FUNCTIONS ======
    
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
    
    // Main redirect logic
    function checkAndRedirect() {
        // Double check we're still at root
        if (window.location.pathname === "/" || window.location.pathname === "") {
            const savedPath = sessionStorage.getItem('onegovRedirectTarget') || 
                             localStorage.getItem('onegovRedirectTarget') ||
                             localStorage.getItem('onegovAppPath') ||
                             sessionStorage.getItem('onegovAppPath');
            
            if (savedPath) {
                console.log('[OneGov Helper] REDIRECTING from root to: ' + savedPath);
                
                // Force redirect with timeout to ensure it happens
                setTimeout(() => {
                    window.location.replace(window.location.origin + savedPath);
                }, 10);
                
                return true;
            } else {
                console.log('[OneGov Helper] No saved path found. Checking all storage...');
                
                // Debug output of all storage to help troubleshoot
                console.log('sessionStorage:', Object.entries(sessionStorage));
                console.log('localStorage:', Object.entries(localStorage));
                
                // No saved path, redirect to the default path
                console.log('[OneGov Helper] Using default path: ' + config.defaultPath);
                
                setTimeout(() => {
                    window.location.replace(window.location.origin + config.defaultPath);
                }, 10);
                
                return true;
            }
        }
        return false;
    }
    
    // Start watchdog for root URL monitoring
    function startRootWatchdog() {
        // First check immediately
        if (checkAndRedirect()) {
            return; // Exit if we're already redirecting
        }
        
        // Then set up interval for continuous checking
        const intervalId = setInterval(() => {
            if (checkAndRedirect()) {
                clearInterval(intervalId); // Stop checking if we redirect
            }
        }, config.redirectCheckInterval);
        
        // Add safety cleanup after specified time
        setTimeout(() => clearInterval(intervalId), config.maxWatchdogTime);
        
        return intervalId;
    }
    
    // ====== LOGIN FUNCTIONS ======
    
    // Handle login on non-root pages
    function handleLogin() {
        // Don't run this on the root URL
        if (window.location.pathname === "/" || window.location.pathname === "") {
            return;
        }
        
        console.log('[OneGov Helper] Checking login state');
        
        // Store the current app path when on any valid page
        const appPath = getAppPath();
        if (appPath) {
            sessionStorage.setItem('onegovRedirectTarget', appPath);
            console.log('[OneGov Helper] Stored app path: ' + appPath);
        }
        
        // Check if on login page
        const isLoginPage = window.location.pathname.includes(config.loginPath);
        
        // Check if logged in
        const isLoggedIn = document.querySelector('a[href*="logout"]') !== null;
        
        // If already logged in, do nothing
        if (isLoggedIn) {
            console.log('[OneGov Helper] Already logged in, nothing to do');
            return;
        }
        
        // If on login page, fill and submit form
        if (isLoginPage) {
            console.log('[OneGov Helper] On login page, filling form');
            
            // Give the page some time to fully load
            setTimeout(function() {
                // Find form elements
                const usernameField = document.getElementById('username') || 
                                    document.querySelector('input[name="username"]');
                const passwordField = document.getElementById('password') || 
                                    document.querySelector('input[name="password"]');
                const form = document.querySelector('form');
                
                if (!usernameField || !passwordField || !form) {
                    console.log('[OneGov Helper] Could not find form elements');
                    return;
                }
                
                // Fill the form
                usernameField.value = config.username;
                passwordField.value = config.password;
                
                console.log('[OneGov Helper] Submitting form');
                
                // Submit form
                const submitButton = form.querySelector('input[type="submit"]') || 
                                  form.querySelector('button[type="submit"]');
                
                if (submitButton) {
                    submitButton.click();
                } else {
                    form.submit();
                }
            }, config.formSubmitDelay);
        }
        // If not on login page and not logged in, redirect to login
        else {
            // Only redirect if we have a valid app path
            if (appPath) {
                const loginUrl = `${window.location.origin}${appPath}${config.loginPath}`;
                console.log('[OneGov Helper] Redirecting to login: ' + loginUrl);
                window.location.href = loginUrl;
            } else {
                console.log('[OneGov Helper] Could not determine login URL');
            }
        }
    }
    
    // ====== URL CHANGE DETECTION ======
    
    // Track URL changes for single-page apps
    let lastUrl = window.location.href;
    function urlChangeDetector() {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            
            // If we're at root URL, start the watchdog
            if (window.location.pathname === "/" || window.location.pathname === "") {
                startRootWatchdog();
            } else {
                // Otherwise, check login state
                handleLogin();
            }
        }
        
        // Keep checking for URL changes
        requestAnimationFrame(urlChangeDetector);
    }
    
    // ====== INITIALIZATION ======
    
    // Start root URL watchdog immediately
    if (window.location.pathname === "/" || window.location.pathname === "") {
        startRootWatchdog();
    }
    
    // Setup MutationObserver for watching DOM changes
    const observer = new MutationObserver(function() {
        if (window.location.pathname === "/" || window.location.pathname === "") {
            checkAndRedirect();
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
    
    // Handle login on document load for non-root pages
    if (document.readyState === 'complete') {
        handleLogin();
    } else {
        window.addEventListener('load', handleLogin);
    }
    
    // Start URL change detector
    urlChangeDetector();
    
    // Backup checks on different document states
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.pathname === "/" || window.location.pathname === "") {
            startRootWatchdog();
        } else {
            handleLogin();
        }
    });
})();
