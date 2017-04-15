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
            if (excludedPages.indexOf(window.location.href) === -1) {
                let icon: string = '';
                icon += '<a href="javascript:void(0)" id="injected-button" class="baidu-icon"></a>';
                $('body').prepend(icon);
                $('#injected-button').css(
                    { 'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat' }
                );
                initButtonListener();
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

$(document).ready(function (): void {
    inject_icon();
});
