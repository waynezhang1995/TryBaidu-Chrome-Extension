const baiduQuery: string = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=';
const baiduIcon: string = 'images/icons/48.png';
const closeButtonIcon: string = 'images/close-button.png';
let searchTerm: string = '';

// This should be done in the manifest file :(
const excludedPages = ['https://www.google.ca/?gws_rd=ssl', 'https://www.google.ca',
    'https://www.google.com/?gws_rd=ssl', 'https://www.google.com'];

let isLoaded: boolean = false;

function inject_icon(): void {
    let timer = function (): void {
        setTimeout(function (): void {

            if (excludedPages.indexOf(window.location.href) === -1 && getParameterByName('tbm') !== 'shop'
                && getParameterByName('gws_rd=ssl#q') !== undefined || getParameterByName('q') !== undefined) {

                let icon: string = '';
                icon += '<a href="javascript:void(0)" id="injected-button" class="baidu-icon"></a>';
                $('body').prepend(icon);
                $('#injected-button').css(
                    { 'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat' }
                );
                if (getParameterByName('tbm') === 'isch') { $('.baidu-icon').css({ 'position': 'absolute' }); }
                initButtonListener();
                bindMessageListener();
                return;
            } else {
                timer();
            }
        }, 500);
    };

    timer();
}

function show_iframe(): void {
    let searchQuery: string = $('input.gsfi').val();

    // Grey out Google background
    $('html').css({ 'overflow-y': 'hidden' });
    $('#viewport').css({ 'filter': 'grayscale(1)' });

    // Toggle button class
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat' });
    $('#injected-button').toggleClass('close-icon baidu-icon');

    if (isLoaded && searchTerm === searchQuery) {
        $('html').css({ 'overflow-y': 'hidden' });
        $('.baidu-iframe').show();
    } else {
        create_iframe(searchQuery);
    }
}

function create_iframe(searchQuery: string): void {
    let iframe: string = '';
    let onLoadOverlay: string = '';

    if ($('.baidu-iframe').length) {
        $('.baidu-iframe').remove();
    }

    onLoadOverlay += '<div class="on-load-overlay text-center">';
    onLoadOverlay += '<p><img class="on-load-overlay-icon" src="' + chrome.extension.getURL(baiduIcon) + '">';
    onLoadOverlay += 'Loading ....</p></div>';
    $('body').prepend(onLoadOverlay);

    iframe += '<iframe class="baidu-iframe" src="' + baiduQuery + searchQuery + '"></iframe>';
    $('body').prepend(iframe);
    $('.baidu-iframe').hide();

    $('.baidu-iframe').on('load', function (): void {
        $('.on-load-overlay').remove();
        $('.baidu-iframe').show();
    });

    searchTerm = searchQuery;
    isLoaded = true;
}

function hide_iframe(): void {
    // Bring google back
    $('#viewport').css({ 'filter': '' });
    $('html').css({ 'overflow-y': 'auto' });
    $('#injected-button').toggleClass('close-icon baidu-icon');
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat' });
    $('.baidu-iframe').hide();
}

function initButtonListener(): void {
    $('#injected-button').on('click', function (): void {
        event.preventDefault();
        if ($(this).hasClass('close-icon')) {
            hide_iframe();
        } else {
            show_iframe();
        }
    });
}

function hide_icon(): void {
    if ($('#injected-button').length) {
        $('#injected-button').hide();
    }
}

function show_icon(): void {
    if ($('#injected-button').length) {
        $('#injected-button').show();
    } else {
        inject_icon(); // Create icon
    }
}

function bindMessageListener(): void {
    chrome.runtime.onMessage.addListener(function(message: any, sender: any, sendResponse: any): void {
        if (message.isDisable === 'True') {
            hide_icon();
        } else {
            show_icon();
        }
    });
}

// Helper
function getParameterByName(name: any, url?: any): string {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) {
        return undefined;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$(document).ready(function (): void {

    // Set current tab's ID
    chrome.runtime.sendMessage({greeting: 'hello'}, function (response: any): void {
        chrome.storage.sync.set({'tabID': response.tabID});
    });

    chrome.storage.sync.get('isDisable', function (obj: any): void {
        if (obj.isDisable === 'False') {
            inject_icon();
        }
    });
});
