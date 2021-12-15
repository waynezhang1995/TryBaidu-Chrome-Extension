function search(info) {
    chrome.tabs.create({
        url: 'http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + info.selectionText
    });
}

chrome.contextMenus.create({
    contexts: ['selection'],
    onclick: search,
    title: 'Search with Baidu: %s'
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            if (tab.url.includes('q=')) {
                validDomain.forEach(domain => {
                    if (tab.url.includes(domain)) {
                        chrome.tabs.reload(tab.id);
                    }
                });
            }
        });
    });
});

// Garbage collection. Remove tab ID in the storage
chrome.tabs.onRemoved.addListener(function (tabID) {
    chrome.storage.sync.get('tabID', function (obj) {
        let tabIDList = [];
        if (obj.tabID !== undefined && obj.tabID.indexOf(tabID) !== -1) {
            tabIDList = obj.tabID;
            let index = tabIDList.indexOf(tabID);
            tabIDList.splice(index, 1);
            chrome.storage.sync.set({ 'tabID': tabIDList });
        }
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    sendResponse({ 'tabID': sender.tab.id });
});
