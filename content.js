(function () {

    let screenTop = null;
    let screenBottom = null;
    let inputWidth = null;
    let inputHeight = null;

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
        screenTop.style.position = 'fixed';
        screenTop.style.top = '0';
        screenTop.style.right = '0';
        screenTop.style.backgroundColor = 'rgba(0,0,0,0.7)';
        screenTop.style.color = 'white';
        screenTop.style.padding = '5px';
        screenTop.style.zIndex = '999999999';
        screenTop.style.display = 'flex';
        screenTop.style.alignItems = 'center';
        screenTop.style.fontFamily = 'Arial';
        screenTop.style.fontSize = '12px';
        // Append 2 number text fields to the screenTop
        inputWidth = document.createElement('input');
        inputHeight = document.createElement('input');
        inputWidth.type = 'number';
        inputHeight.type = 'number';
        inputWidth.style.width = '60px';
        inputHeight.style.width = '60px';
        inputWidth.style.height = 'auto';
        inputHeight.style.height = 'auto';
        inputWidth.style.border = "1px solid black";
        inputHeight.style.border = "1px solid black";
        screenTop.appendChild(inputWidth);
        screenTop.appendChild(inputHeight);
        document.body.appendChild(screenTop);

        // On enter press key
        inputWidth.addEventListener('keyup', function (event) {
            if (event.key === "Enter") {
                updateWindowSize();
            }
        });
        inputHeight.addEventListener('keyup', function (event) {
            if (event.key === "Enter") {
                updateWindowSize();
            }
        });
    }

    // Initialize bottom screen
    function initScreenBottom() {
        screenBottom = document.createElement('div');
        screenBottom.style.position = 'fixed';
        screenBottom.style.bottom = '0';
        screenBottom.style.right = '0';
        screenBottom.style.backgroundColor = 'rgba(0,0,0,0.7)';
        screenBottom.style.color = 'white';
        screenBottom.style.padding = '5px';
        screenBottom.style.zIndex = '999999999';
        screenBottom.style.fontFamily = 'Arial';
        screenBottom.style.fontSize = '12px';
        document.body.appendChild(screenBottom);

        // Update the screen size
        updateSize();

        // On window resize
        window.addEventListener('resize', updateSize);
    }

    // Update the window size
    function updateWindowSize() {
        let width = inputWidth.value;
        let height = inputHeight.value;
        if (width === "" || height === "") {
            alert("Please enter missing value(s)!");
            return;
        }
        chrome.runtime.sendMessage({ query: "updateWindowSize", width: width, height: height });
    }

    // Update the screen size display
    function updateSize() {
        chrome.runtime.sendMessage({ query: "getWindowSize" }, function (response) {
            screenBottom.textContent = `${response.width} x ${response.height}`;
        });
    }

    // Destroy everything
    function destroyAll() {
        window.removeEventListener('resize', updateSize);
        screenTop.remove();
        screenBottom.remove();
        screenTop = null;
        screenBottom = null;
        inputWidth = null;
        inputHeight = null;
    }
})();
