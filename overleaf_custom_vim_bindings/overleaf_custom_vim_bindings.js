(function() {
 'use strict';

 window.addEventListener('UNSTABLE_editor:extensions', (event) => {

         const retry = setInterval(() => {
                 const { CodeMirror, CodeMirrorVim, extensions } = event.detail;
                 if (CodeMirrorVim.Vim == undefined) {
                 return;
                 }
                 CodeMirrorVim.Vim.map('jk', '<Esc>', 'insert')
                 console.log("Custom key bindings applied")
                 }, 100);


         })
 })();
