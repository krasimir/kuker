chrome.extension.onConnect.addListener(function (port) {
  chrome.extension.onMessage.addListener(function (message, sender) {
    if (message.source === 'stent') {
      port.postMessage(message);
    }
  });
});