const contextMenuOption = {
  "id": "block",
  "title": "Block this site",
  "contexts": ["all"]  
}


function blockTab(tabId) {
  chrome.tabs.update(tabId, {
    active: true,
    url: "blocked.html"
  });
}

function openOptionsTab() {
  chrome.tabs.create({
    url: "options.html"
  });
}

function clearBlockList() {
  chrome.storage.local.set( { blockList: [] } );
}

function addUrlToBlockList() {
  chrome.storage.local.get( ["blockList", "url"], storage => {
    if (!storage.blockList.includes(storage.url)) {
      storage.blockList.push(storage.url);
      chrome.storage.local.set({
        blockList: storage.blockList
      }, () => {
        console.log(`Added ${storage.url} to block list`);
        console.log(storage.blockList);
      });
    }             
  }); 
}

function checkIfBlocked(url, tabId) {
  chrome.storage.local.get( "blockList", storage => {
    storage.blockList.forEach( blockedUrl => {
      if (url === blockedUrl) {
        try {
          blockTab(tabId);
        }
        catch(error) {
          setTimeout( () => {
            blockTab(tabId);
          }, 100);
        }
      }
    });
  });
}

function handleMessages(request) {
  if (request.message === "block") {
    addUrlToBlockList();
  } else if (request.message === "open options tab") {
    openOptionsTab();
  } else if (request.message === "clear blocked sites list") {
    clearBlockList();
  }
}

function handleContextMenuActions(contextMenuAction) {
  if (contextMenuAction.menuItemId === "block") {
    addUrlToBlockList();
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    blockList: [],
    url: ""
  });
  chrome.contextMenus.create(contextMenuOption);
  console.log("Stay focused - Websites blocker extension installed sucesfully!");
});

chrome.tabs.onActivated.addListener( activeTab => {
  chrome.tabs.get(activeTab.tabId, tab => {
    let tabUrl = new URL(tab.url).origin;    

    chrome.storage.local.set({
      url: tabUrl
    });   

    checkIfBlocked(tabUrl, activeTab.tabId);
  });
});

chrome.tabs.onUpdated.addListener( (tabId, change, tab) => {
  if (tab.active && change.url) {    
    let tabUrl = new URL(tab.url).origin;

    chrome.storage.local.set({
      url: tabUrl
    }); 

    checkIfBlocked(tabUrl, tabId);
  }
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  handleMessages(request);
});

chrome.contextMenus.onClicked.addListener( clickedContextMenuAction => {
  handleContextMenuActions(clickedContextMenuAction);
});

