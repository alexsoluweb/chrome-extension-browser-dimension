let toggleClose = false;

chrome.action.onClicked.addListener(function (tab) {

    // Toggle the screen size display
    toggleClose = !toggleClose;

    // Send a message to the content script
    chrome.tabs.sendMessage(tab.id, { 'toggleClose': toggleClose });

    // Highlight the icon if the screen size display is active
    if (toggleClose) {
        chrome.action.setIcon({
            tabId: tab.id,
            path: {
                "16": "icons/ruler-on-16.png",
                "48": "icons/ruler-on-48.png",
                "128": "icons/ruler-on-128.png"
            }
        });
    } else {
        chrome.action.setIcon({
            tabId: tab.id,
            path: {
                "16": "icons/ruler-off-16.png",
                "48": "icons/ruler-off-48.png",
                "128": "icons/ruler-off-128.png"
            }
        });
    }

});

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    if (request.query === "getWindowSize") {
        chrome.windows.getCurrent({}, function (window) {
            sendResponse({ width: window.width, height: window.height });
        });
        return true; // Indicates response is async
    }
});
