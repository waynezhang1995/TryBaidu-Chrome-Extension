const baiduQuery: string = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=';
const baiduIcon: string = 'images/icons/48.png';
const closeButtonIcon: string = 'images/close-button.png';

// This should be done in the manifest file :(
const excludedPages = ['https://www.google.ca/?gws_rd=ssl', 'https://www.google.ca',
'https://www.google.com/?gws_rd=ssl', 'https://www.google.com'];

let isLoaded: boolean = false;

function inject_icon(): void {

    let timer = function (): void {
        setTimeout(function(): void {
            if (excludedPages.indexOf(window.location.href) === -1) {
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
                    'top': '142px',
                    'z-index': '999',
                    'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat'
                });
                initButtonListener();
            } else {
                timer();
            }
        }, 500);
    };

    timer();
}

function create_iframe(): void {

    if (isLoaded) {
        $('.baidu-iframe').show();
    }

    // Toggle button
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat' });
    $('#injected-button').toggleClass('close-icon baidu-icon');
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
        'border': 'solid'
    });

    // Hide google SERP
    $('#viewport').css({ 'filter': 'grayscale(1)'});
    isLoaded = true;
}

function close_iframe(): void {
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
            close_iframe();
        } else {
            create_iframe();
        }
    });
}

$(document).ready(function (): void {
    inject_icon();
});
