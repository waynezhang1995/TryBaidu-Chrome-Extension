function search(info, tab) {
    console.log("Word " + info.selectionText + " was clicked.");
    chrome.tabs.create({
        url: "http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=" + info.selectionText,
    });
}

chrome.contextMenus.create({
    title: "百度搜索: %s",
    contexts: ["selection"],
    onclick: search,
});