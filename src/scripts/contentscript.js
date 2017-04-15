var baiduQuery = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=';
var baiduIcon = 'images/icons/48.png';
var closeButtonIcon = 'images/close-button.png';
function inject_icon() {
    var icon = '';
    icon += '<button class="baidu-icon"></button>';
    $('body').prepend(icon);
    $('.baidu-icon').css({
        'height': '50px',
        'width': '50px',
        'border-radius': '50px',
        'border': '1px solid #fff',
        'position': 'absolute',
        'right': '60px',
        'top': '60px',
        'z-index': '999',
        'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat'
    });
}
function create_iframe() {
    $('.baidu-icon').css({ 'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat' });
    var iframe = '';
    var searchQuery = $('input.gsfi').val();
    iframe += '<iframe class="baidu-iframe" src="' + baiduQuery + searchQuery + '"></iframe>';
    $('body').prepend(iframe);
    $('.baidu-iframe').css({
        'position': 'absolute',
        'z-index': '999',
        'width': '90%',
        'height': '90%',
        'top': '37px',
        'left': '79px'
    });
    $('#viewport').hide();
}
$(document).ready(function () {
    inject_icon();
    $('.baidu-icon').click(function () {
        create_iframe();
    });
});
