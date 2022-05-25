const blockSiteButton = document.getElementById("block-site");
const blockListButton = document.getElementById("block-list");
const tabUrl = document.getElementsByClassName("popup-headline__url")[0];

function sendMessageToBackground(messageContent) {
  chrome.runtime.sendMessage( { message: messageContent } );
}

blockSiteButton.addEventListener("click", () => {
  sendMessageToBackground("block");
});

blockListButton.addEventListener("click",() => {
  sendMessageToBackground("open options tab");
});

function getCurrentTabUrl() {
  chrome.storage.local.get("url", currentTabUrl => {
    tabUrl.innerText = currentTabUrl.url;
  });
}

getCurrentTabUrl();