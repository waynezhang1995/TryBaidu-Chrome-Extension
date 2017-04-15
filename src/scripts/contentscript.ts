const baiduQuery: string = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=';
const baiduIcon: string = 'images/icons/48.png';
const closeButtonIcon: string = 'images/close-button.png';
let isLoaded: boolean = false;

function inject_icon(): void {
    let icon: string = '';
    icon += '<a href="javascript:void(0)" id="injected-button" class="baidu-icon"></a>';
    $('body').prepend(icon);
    $('#injected-button').css({
        'height': '50px',
        'width': '50px',
        'border-radius': '50px',
        'border': '1px solid #fff',
        'position': 'fixed',
        'right': '60px',
        'top': '70px',
        'z-index': '999',
        'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat'
    });
}

function show_iframe(): void {
    // Toggle button
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat' });
    $('#injected-button').toggleClass('close-icon baidu-icon');
    // Hide google SERP
    $('#viewport').css({ 'filter': 'grayscale(1)'});
    $('.baidu-iframe').show();
}

function hide_iframe(): void {
    // Bring google back
    $('#viewport').css({ 'filter': ''});
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

function loadIframe(): void {
    let iframe: string = '';
    let searchQuery: string = $('input.gsfi').val();
    iframe += '<iframe class="baidu-iframe" src="' + baiduQuery + searchQuery + '"></iframe>';
    $('body').prepend(iframe);
    $('.baidu-iframe').css({
        'position': 'fixed',
        'z-index': '999',
        'width': '89.5%',
        'height': '90%',
        'top': '37px',
        'left': '79px',
        'border': 'solid',
        'display': 'none'
    });
}

$(document).ready(function (): void {
    inject_icon();
    initButtonListener();
    loadIframe();
});
