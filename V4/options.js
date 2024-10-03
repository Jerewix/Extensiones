// Saves options to chrome.storage
function save_options() {
    document.getElementById('btnSave').setAttribute("disabled", "true");
    var refreshDuration = document.getElementById('ddlDuration').value;
    var refreshPaused = document.getElementById('chkbxPause').checked;
    var notificationsd = document.getElementById('chkbxNSD').checked;
    var notificationcm = document.getElementById('chkbxNCM').checked;
    //var notificationsdwan = document.getElementById('chkbxNSDWAN').checked;

    chrome.storage.sync.set({
        sfGridRefreshDuration: refreshDuration,
        sfGridRefreshPause: refreshPaused,
        sfnotificationsd: notificationsd,
        sfnotificationcm: notificationcm,
        //sfnotificationsdwan: notificationsdwan
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Preferences saved.';
        setTimeout(function () {
            document.getElementById('btnSave').removeAttribute("disabled");
        }, 500);
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value sfGridRefreshDuration = 45 and sfGridRefreshPause = false.
    chrome.storage.sync.get({
        sfGridRefreshDuration: 45,
        sfGridRefreshPause: false,
        sfnotificationsd: false,
        sfnotificationcm: false,
        //sfnotificationsdwan: false
    }, function (items) {
        document.getElementById('ddlDuration').value = items.sfGridRefreshDuration;
        document.getElementById('chkbxPause').checked = items.sfGridRefreshPause;
        document.getElementById('chkbxNSD').checked = items.sfnotificationsd;
        document.getElementById('chkbxNCM').checked = items.sfnotificationcm;
        //document.getElementById('chkbxNSDWAN').checked = items.sfnotificationsdwan;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    restore_options();
    var link = document.getElementById('btnSave');
    // onclick event binded
    link.addEventListener('click', function () {
        save_options();
    });
});
