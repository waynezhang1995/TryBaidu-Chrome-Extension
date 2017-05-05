function check_disable_status(): void {
    chrome.storage.sync.get('isDisable', function (obj: any): void {
        if (obj.isDisable === 'True') {
            $('#option').text('Enable');
        }
    });
}

function bind_click_listener(): void {
    $('#option').click(function (): void {
        if ($('#option').text() === 'Disable') {
            $('#option').text('Enable');
            chrome.storage.sync.set({ 'isDisable': 'True' });
            chrome.storage.sync.get('tabID', function (obj: any): void {
                obj.tabID.forEach(id => {
                    chrome.tabs.sendMessage(id, {isDisable: 'True'});
                });
            });
        } else {
            $('#option').text('Disable');
            chrome.storage.sync.set({ 'isDisable': 'False' });
            chrome.storage.sync.get('tabID', function (obj: any): void {
                obj.tabID.forEach(id => {
                    chrome.tabs.sendMessage(id, {isDisable: 'False'});
                });
            });
        }
    });

    $('.main-wrapper a').click(function (): void {
        event.preventDefault();
        window.open($(this).attr('href'));
    });
}

function bind_settings_listener(): void {
    let preferences = {'position_fix': 'False', 'keyboard_shortcut': 'False'};

    $('.setting').change( function(): void {
        chrome.storage.sync.get('settings', function (obj: any): void {
            if (obj.settings !== undefined) {
                preferences = obj.settings;
            }
            if ($('#position_fix').is(':checked')) {
                preferences['position_fix'] = 'True';
            } else {
                preferences['position_fix'] = 'False';
            }
            if ($('#keyboard_shortcut').is(':checked')) {
                preferences['keyboard_shortcut'] = 'True';
            } else {
                preferences['keyboard_shortcut'] = 'False';
            }
            chrome.storage.sync.set({'settings': preferences});
            chrome.storage.sync.get('tabID', function (objTabs: any): void {
                objTabs.tabID.forEach(id => {
                    chrome.tabs.sendMessage(id, {'settings': preferences});
                });
            });
        });
    });
}

function check_settings(): void {
    chrome.storage.sync.get('settings', function (obj: any): void {
        if (obj.settings !== undefined) { // If settings is undefined, use default
            if (obj.settings['position_fix'] === 'True') { // Icon fixes at top-left corner
                $('#position_fix').bootstrapToggle('on');
            }

            if (obj.settings['keyboard_shortcut'] === 'True') {
                $('#keyboard_shortcut').bootstrapToggle('on');
            }
        }
    });
}

$(document).ready(function (): void {
    check_settings();
    check_disable_status();
    bind_click_listener();
    bind_settings_listener();
});
