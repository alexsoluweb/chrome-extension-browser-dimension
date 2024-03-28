(function () {

    let screen = null;

    // Icon extension click event
    chrome.runtime.onMessage.addListener(
        function (request, sender) {
            console.log("Screen size display: ", request.toggleClose);

            if (request.toggleClose) {
                init();
            } else {
                destroy();
            }
        }
    );

    // Initialize the screen size display
    function init() {
        screen = document.createElement('div');
        screen.style.position = 'fixed';
        screen.style.top = '0';
        screen.style.right = '0';
        screen.style.backgroundColor = 'rgba(0,0,0,0.7)';
        screen.style.color = 'white';
        screen.style.padding = '5px';
        screen.style.zIndex = '999999999';
        document.body.appendChild(screen);

        window.addEventListener('resize', updateSize);
        updateSize();
    }

    // Update the screen size display
    function updateSize() {
        chrome.runtime.sendMessage({ query: "getWindowSize" }, function (response) {
            screen.textContent = `${response.width} x ${response.height}`;
        });
    }

    // Destroy the screen size display
    function destroy() {
        window.removeEventListener('resize', updateSize);
        screen.remove();
        screen = null;
    }
})();
