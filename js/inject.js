//injects format.js into the webpage
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/format.js');
(document.head||document.documentElement).appendChild(s);

s.onload = function() {
    s.parentNode.removeChild(s);
};