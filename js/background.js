let macros;
macros = [];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({'macros':macros});
});