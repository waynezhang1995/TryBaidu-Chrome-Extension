function inject_icon() {
    let timer = function () {
        setTimeout(function () {

            if ($('input.gsfi').val() !== undefined && $('input.gsfi').val() !== '' &&
                ($('div #resultStats').length > 0 || getParameterByName('q') !== undefined)) {
                let searchQuery = '';
                let icon = '';

                searchQuery = $('input.gsfi').val();

                icon += '<a href="javascrip(0)" id="injected-button" class="baidu-icon"></a>';
                $('body').prepend(icon);
                $('#injected-button').css(
                    { 'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat' }
                );
                if (getParameterByName('tbm') === 'isch') { $('.baidu-icon').css({ 'position': 'absolute' }); } // Image
                create_iframe(searchQuery, true);
                bind_input_listener();
                init_button_listener();
                apply_settings();
                return;
            } else {
                timer();
            }
        }, 500);
    };
    timer();
}

function bind_input_listener() {
    $('input.gsfi').on('change input', function () {
        create_iframe($('input.gsfi').val(), true);
    });
}

function bind_newtab_button_listener() {
    $('.newtab-icon').on('click', function () {
        hide_iframe();
        window.open(baiduQuery + searchTerm);
    });
}

function show_iframe() {
    let searchQuery = $('input.gsfi').val();
    let newTabIcon = '<a href="javascrip(0)" class="tooltip newtab-icon"><span class="tooltiptext">Open in a new tab page</span></a>';
    // Grey out Google background
    $('html').css({ 'overflow-y': 'hidden' });
    $('#viewport').css({ 'filter': 'grayscale(1)' });

    // Toggle button class
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(closeButtonIcon) + ') no-repeat', 'position': 'fixed' });
    $('#injected-button').toggleClass('close-icon baidu-icon');

    // Show new tab icon
    $('body').prepend(newTabIcon);
    $('.newtab-icon').css(
        { 'background': 'url(' + chrome.extension.getURL(newTabButtonIcon) + ') no-repeat' }
    );

    // Bind new tab button listener
    bind_newtab_button_listener();

    if (isLoaded && searchTerm === searchQuery) {
        $('html').css({ 'overflow-y': 'hidden' });
        $('.baidu-iframe').show();
    } else {
        create_iframe(searchQuery, false);
    }
}

function create_iframe(searchQuery, isFirstLoad) {
    let iframe = '';
    let onLoadOverlay = '';

    if ($('.baidu-iframe').length) {
        $('.baidu-iframe').remove();
    }

    let searchCategory = getParameterByName('tbm');

    if (searchCategory === 'isch') { // Images
        iframe += '<iframe class="baidu-iframe" src="' + baiduImageQuery + searchQuery + '"></iframe>';
    } else {
        iframe += '<iframe class="baidu-iframe" src="' + baiduQuery + searchQuery + '"></iframe>';
    }

    $('body').prepend(iframe);
    $('.baidu-iframe').hide();

    if (!isFirstLoad) {
        onLoadOverlay += '<div class="on-load-overlay text-center">';
        onLoadOverlay += '<p><img class="on-load-overlay-icon" src="' + chrome.extension.getURL(baiduIcon) + '">';
        onLoadOverlay += 'Loading ....</p></div>';
        $('body').prepend(onLoadOverlay);

        $('.baidu-iframe').on('load', function () {
            $('.on-load-overlay').remove();
            $('.baidu-iframe').show();
        });
    }
    searchTerm = searchQuery;
    isLoaded = true;
}

function hide_iframe() {
    // Bring google back
    $('#viewport').css({ 'filter': '' });
    $('html').css({ 'overflow-y': 'auto' });
    $('.newtab-icon').remove();
    $('#injected-button').toggleClass('close-icon baidu-icon');
    $('#injected-button').css({ 'background': 'url(' + chrome.extension.getURL(baiduIcon) + ') no-repeat' });
    $('.baidu-iframe').hide();

    if (iconFixed) {
        $('#injected-button').css('position', 'absolute');
    }
}

function init_button_listener() {
    $('#injected-button').on('click', function () {
        event.preventDefault();
        if ($(this).hasClass('close-icon')) {
            hide_iframe();
        } else {
            show_iframe();
        }
    });
}

function hide_icon() {
    if ($('#injected-button').length) {
        $('#injected-button').hide();
    }
}

function show_icon() {
    if ($('#injected-button').length) {
        $('#injected-button').show();
    } else {
        inject_icon(); // Create icon
    }
}

function bind_message_listener() {
    chrome.runtime.onMessage.addListener(function (message) {
        if (message.isDisable) {
            if (message.isDisable === 'True') {
                hide_icon();
            } else {
                show_icon();
            }
        } else if (message.settings) {
            if (message.settings['position_fix'] === 'True') { // Icon fixes at top-left corner
                $('#injected-button').css('position', 'absolute');
                iconFixed = true;
            } else {
                $('#injected-button').css('position', 'fixed');
                iconFixed = false;
            }

            if (message.settings['keyboard_shortcut'] === 'True') {
                hotkeyEnable = true;
            } else {
                hotkeyEnable = false;
            }
        }
    });
}

// Helper
function getParameterByName(name, url) {
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

function set_current_tab() {
    chrome.runtime.sendMessage({ greeting: 'hello' }, function (response) {
        chrome.storage.sync.get('tabID', function (obj) {
            let tabIDList = [];
            if (obj.tabID !== undefined) {
                if (obj.tabID.indexOf(response.tabID) === -1) { // Push new tab ID
                    tabIDList = obj.tabID;
                }

                if (obj.tabID.indexOf(response.tabID) !== -1) { // Tab ID already there. Return
                    return;
                }
            }
            tabIDList.push(response.tabID);
            chrome.storage.sync.set({ 'tabID': tabIDList });
        });
    });
}

function check_disable() {
    chrome.storage.sync.get('isDisable', function (obj) {
        if (obj.isDisable === undefined || obj.isDisable === 'False') {
            inject_icon();
        }
    });
}

function apply_settings() {
    chrome.storage.sync.get('settings', function (obj) {
        if (obj.settings !== undefined) { // If settings is undefined, use default
            if (obj.settings['position_fix'] === 'True') { // Icon fixes at top-left corner
                $('#injected-button').css('position', 'absolute');
                iconFixed = true;
            } else {
                $('#injected-button').css('position', 'fixed');
                iconFixed = false;
            }

            if (obj.settings['keyboard_shortcut'] === 'True') {
                hotkeyEnable = true;
            } else {
                hotkeyEnable = false;
            }
        }
        bind_keyboard_listener();
    });
}

function bind_keyboard_listener() {
    $(document).keydown(function (e) {
        if (e.keyCode === ctrlKey) {
            ctrlDown = true;
        }
    }).keyup(function (e) {
        if (e.keyCode === ctrlKey) {
            ctrlDown = false;
        }
    });

    $(document).keydown(function (e) {
        if (ctrlDown && (e.keyCode === backtickKey) && hotkeyEnable && $('#injected-button').css('display') === 'block') {
            if ($('.baidu-iframe').css('display') === 'block') {
                hide_iframe();
            } else {
                show_iframe();
            }
        }
    });
}

function init() {
    set_current_tab(); // Set current tab's ID
    bind_message_listener();
    check_disable();
}

$(document).ready(function () {
    init();
});
