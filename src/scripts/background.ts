function search(info: any, tab: any): void {
    chrome.tabs.create({
        url: 'http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + info.selectionText
    });
}

chrome.contextMenus.create({
    contexts: ['selection'],
    onclick: search,
    title: '百度搜索: %s'
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({url: 'https://github.com/waynezhang1995/trybaidu-extension'});
    }
});

chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({url: 'https://github.com/waynezhang1995/trybaidu-extension'});
});
