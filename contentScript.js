// contentScript.js
(function () {
    if (window.location.href.includes("youtube.com/watch")) {
        injectChat();
    }

    function injectChat() {
        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('index.html');
        iframe.style.position = 'fixed';
        iframe.style.bottom = '10px';
        iframe.style.right = '10px';
        iframe.style.width = '400px';
        iframe.style.height = '500px';
        iframe.style.border = 'none';
        iframe.style.zIndex = '1000';
        document.body.appendChild(iframe);
    }
})();
