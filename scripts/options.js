const blockSiteButton = document.getElementsByClassName("block-web-adress__button")[0];
const clearBlockedSitesButton = document.getElementsByClassName("blocked-sites__button")[0];
const blockedSitesList = document.getElementsByClassName("blocked-sites__list")[0];
const webAdressInput = document.getElementsByClassName("block-web-adress__input")[0];

function sendMessageToBackground(messageContent) {
  chrome.runtime.sendMessage( { message: messageContent } );
}

function clearBlockListElements() {
  while (blockedSitesList.firstChild) {
    blockedSitesList.removeChild(blockedSitesList.firstChild);
  } 
}

function setBlockList() {
  chrome.storage.local.get( "blockList", storage => {
    storage.blockList.forEach( blockedSite => {
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(blockedSite));
      li.classList.add("blocked-site");
      blockedSitesList.appendChild(li);
    });  
  });
}

function isUrl(url) {
  try { 
    return Boolean(new URL(url)); 
  }
  catch(error) {
    alert('Incorrect input!\nInput web adress in "https://" or "http://" format.')
    return false;
  }
}

blockSiteButton.addEventListener( "click", () => {
  let webAdressInputValue = webAdressInput.value;

  if (isUrl(webAdressInputValue)) {
    chrome.storage.local.set({
      url: webAdressInputValue
    });   
    sendMessageToBackground("block");
  } 
});

clearBlockedSitesButton.addEventListener( "click", () => {
  sendMessageToBackground("clear blocked sites list");
});

chrome.storage.onChanged.addListener( () => {
  clearBlockListElements();
  setBlockList();
});

setBlockList();