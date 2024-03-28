(function () {

    let screenTop = null;
    let screenBottom = null;
    let resolutionSelect = null;

    // Define popular screen resolutions
    const screenResolutions = [
        {name: "Select resolution", width: null, height: null},
        {name: "1920x1080 (Full HD)", width: 1920, height: 1080},
        {name: "1600x900 (HD+)", width: 1600, height: 900},
        {name: "1536x864 (WXGA++)", width: 1536, height: 864},
        {name: "1440x900 (WXGA+)", width: 1440, height: 900},
        {name: "1366x768 (WXGA)", width: 1366, height: 768},
        {name: "1280x1024 (SXGA)", width: 1280, height: 1024},
        {name: "1280x720 (HD)", width: 1280, height: 720},
        {name: "1024x768 (XGA)", width: 1024, height: 768},
    ];

    // Icon extension click event
    chrome.runtime.onMessage.addListener(
        function (request, sender) {
            console.log("Browser Dimension Setter & Viewer: ", request.toggleClose);

            if (request.toggleClose) {
                initScreenTop();
                initScreenBottom();
            } else {
                destroyAll();
            }
        }
    );

    // Initialize top screen
    function initScreenTop() {
        screenTop = document.createElement('div');
        setCommonStyle(screenTop, 'top');

        // Append select box for resolutions to the screenTop
        resolutionSelect = document.createElement('select');
        screenResolutions.forEach(res => {
            let option = new Option(res.name, `${res.width}x${res.height}`);
            resolutionSelect.options.add(option);
        });
        screenTop.appendChild(resolutionSelect);
        document.body.appendChild(screenTop);

        // On select change event
        resolutionSelect.addEventListener('change', function () {
            let [width, height] = this.value.split('x');
            if (width && height) {
                updateWindowSize(width, height);
            }
        });
    }

    // Initialize bottom screen
    function initScreenBottom() {
        screenBottom = document.createElement('div');
        setCommonStyle(screenBottom, 'bottom');
        document.body.appendChild(screenBottom);

        // Update the screen size
        updateSize();

        // On window resize
        window.addEventListener('resize', updateSize);
    }

    // Set common style for screenTop and screenBottom
    function setCommonStyle(element, position) {
        element.style.position = 'fixed';
        element.style[position] = '0';
        element.style.right = '0';
        element.style.backgroundColor = 'rgba(0,0,0,0.7)';
        element.style.color = 'white';
        element.style.padding = '5px';
        element.style.zIndex = '999999999';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.fontFamily = 'Arial';
        element.style.fontSize = '12px';
    }

    // Update the window size
    function updateWindowSize(width, height) {
        chrome.runtime.sendMessage({ query: "updateWindowSize", width: width, height: height });
    }

    // Update the screen size display
    function updateSize() {
        // Output the window size
        chrome.runtime.sendMessage({ query: "getWindowSize" }, function (response) {
            screenBottom.textContent = `${response.width} x ${response.height}`;
        });
    }

    // Destroy everything
    function destroyAll() {
        window.removeEventListener('resize', updateSize);
        if (screenTop) screenTop.remove();
        if (screenBottom) screenBottom.remove();
        screenTop = null;
        screenBottom = null;
        resolutionSelect = null;
    }
})();
