function inject_icon(): void {
    let icon: string = '';
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
        'background': 'url(' + chrome.extension.getURL('images/icons/48.png') + ') no-repeat'
    });
}

function create_iframe(): void {

}


$(document).ready(function (): void {
    inject_icon();

    $('.baidu-icon').click(function () {
        create_iframe();
    });
});
