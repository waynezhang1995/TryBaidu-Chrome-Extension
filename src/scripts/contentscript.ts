const baiduQuery: string = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=';
const baiduIcon: string = 'images/icons/48.png';
const closeButtonIcon: string = 'images/close-button.png';

function inject_icon(): void {
    let icon: string = '';
    icon += '<button onclick="#" id="injected-button" class="baidu-icon"></button>';
    $('body').prepend(icon);
    $('#injected-button').css({
        'height': '50px',
        'width': '50px',
        'border-radius': '50px',
        'border': '1px solid #fff',
        'position': 'fixed',
        'right': '60px',
        'top': '60px',
        'z-index': '999',
        'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat'
    });
}

function create_iframe(): void {
    // Toggle button
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat' });
    $('#injected-button').toggleClass('close-icon baidu-icon');
    let iframe: string = '';
    let searchQuery: string = $('input.gsfi').val();
    iframe += '<iframe class="baidu-iframe" src="' + baiduQuery + searchQuery + '"></iframe>';
    $('body').prepend(iframe);
    $('.baidu-iframe').css({
        'position': 'absolute',
        'z-index': '999',
        'width': '89.5%',
        'height': '90%',
        'top': '37px',
        'left': '79px',
        'body': 'solid'
    });

    // Hide google SERP
    $('#viewport').css({ 'filter': 'grayscale(1)', 'overflow': 'hidden' });
}

function close_iframe(): void {
    // Bring google back
    $('#viewport').css({ 'filter': '', 'overflow': 'auto' });
    $('#injected-button').toggleClass('close-icon baidu-icon');
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat' });
    $('.baidu-iframe').hide();
}

function initButtonListener(): void {
    $('#injected-button').click(function (): void {
        event.preventDefault();
        if ($(this).hasClass('close-icon')) {
            create_iframe();
        } else {
            close_iframe();
        }

    });
}

$(document).ready(function (): void {
    inject_icon();
    initButtonListener();
});
