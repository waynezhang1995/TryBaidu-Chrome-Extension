[![Build Status](https://travis-ci.org/waynezhang1995/trybaidu-chrome-extension.svg?branch=master)](https://travis-ci.org/waynezhang1995/trybaidu-chrome-extension)

# Trybaidu - Chrome Extension

Chrome Web Store [Link](https://chrome.google.com/webstore/detail/trybaidu/ifmhokadajfjcndoggkfifjfghbldbmf)

If you find it useful please leave a [review](https://chrome.google.com/webstore/detail/trybaidu/ifmhokadajfjcndoggkfifjfghbldbmf/reviews)

### Baidu ?
The largest search engine in China - [Baidu](https://en.wikipedia.org/wiki/Baidu)

### Features

 - Iframe Baidu into Google's search result page.

 - Automatically extract search term from the Google's search box.

 - Pre-load the Baidu' search result at background as you type.

 - Display Baidu's search results using the ```ctrl + back-tip``` keyboard shortcut (Default to be disabled)

 - Expand Baidu's search result to a new tab page.

 - Highlight any key words or sentences and right click open context menu then "search with Baidu".

## Build Steps

Get the latest version of NPM.
```
sudo apt-get install nodejs npm
```

Then install packages
```
npm install
```

Now compile Typescripts
```
npm run tsc
```

Linting
```
npm run test
```
## Disclaimer
**_Google and Google Chrome are trademarks of Google, Inc. Baidu is a trademark of Baidu, Inc. Trybaidu is an extension for Google Chrome_**

## License

MIT
