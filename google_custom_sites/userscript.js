// ==UserScript==
// @name         Simple Google Site Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds site:reddit.com to search
// @author       Your name
// @match        https://www.google.com/*
// @match        https://google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the status box
    const status = document.createElement('div');
status.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(60, 64, 72, 0.85);  // Lighter background
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #fff;
    padding: 10px 12px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;  // Slower animation
    width: auto;
    height: 20px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: 140px;
`;

    // Create inner content container
    const innerContent = document.createElement('div');
innerContent.style.cssText = `
    opacity: 0;
    transition: opacity 0.4s ease;
    margin-top: 15px;
`;

    // Create collapsed state content
    const collapsedContent = document.createElement('div');
    collapsedContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        font-weight: 500;
    `;
    collapsedContent.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Search Tools</span>
    `;

    status.appendChild(collapsedContent);
    status.appendChild(innerContent);
    document.body.appendChild(status);

    // Hover effects
    status.addEventListener('mouseenter', () => {
        status.style.width = '300px';
        status.style.height = 'auto';
        status.style.padding = '15px';
        innerContent.style.opacity = '1';
        collapsedContent.style.opacity = '0';
    });

/*
    status.addEventListener('mouseleave', () => {
        status.style.width = 'auto';
        status.style.height = '20px';
        status.style.padding = '10px 12px';
        innerContent.style.opacity = '0';
        collapsedContent.style.opacity = '1';
    });*/
    const shortcuts = [
        { trigger: 'site:', completion: 'site:reddit.com' },
    ];

    function findSearchBox() {
        return (
            document.querySelector('textarea[name="q"], input[name="q"]') ||
            document.querySelector('textarea[role="combobox"]') ||
            document.querySelector('form[role="search"] textarea') ||
            document.getElementById('APjFqb') ||
            document.querySelector('.gLFyf')
        );
    }

    function updateStatus(state = 'active', error = null) {
        collapsedContent.innerHTML = state === 'active' 
            ? `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>Search Tools</span>
            `
            : `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style="color: #ff6b6b">Error</span>
            `;

        innerContent.innerHTML = `
            ${error ? `
                <div style="color: #ff6b6b; margin: 8px 0; padding: 8px; background: rgba(255,107,107,0.1); border-radius: 4px;">
                    ${error}
                </div>
            ` : ''}
            <div style="color: #fff; font-weight: 600; margin-bottom: 8px;">Available shortcuts:</div>
            ${shortcuts.map(s => `
                <div style="margin: 4px 0; border-left: 2px solid rgba(255,255,255,0.2); padding-left: 8px;">
                    <span style="color: #61afef">${s.trigger}</span> →
                    <span style="color: #e5c07b">${s.completion}</span>
                </div>
            `).join('')}
            <div style="margin-top: 12px; font-size: 11px; color: #abb2bf;">
                ${state === 'active' 
                    ? 'Type any shortcut to trigger autocomplete' 
                    : 'Script will keep trying...'}
            </div>
        `;
    }

    // Rest of the code remains the same...
    let retryCount = 0;
    const MAX_RETRIES = 5;

    function init() {
        const searchBox = findSearchBox();
        
        if (!searchBox) {
            retryCount++;
            updateStatus('error', 
                `Cannot find search box (${retryCount}/${MAX_RETRIES})`
            );
            
            if (retryCount < MAX_RETRIES) {
                setTimeout(init, 1000);
            }
            return;
        }
        
        searchBox.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.endsWith('site:')) {
                e.target.value = val.slice(0, -5) + 'site:reddit.com ';
            }
        });

        updateStatus('active');
    }

    init();

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => 
            m.addedNodes.length && 
            Array.from(m.addedNodes).some(node => 
                node.querySelector && (
                    node.querySelector('textarea') ||
                    node.querySelector('input[name="q"]')
                )
            )
        )) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
