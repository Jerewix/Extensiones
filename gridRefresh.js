window.onload = function () {
    function FindRefreshSF() {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
            console.log('Page was refreshed');
            handlePageRefresh();
        } else {
            console.log('Page was not refreshed');
        }
    }
    
    function autoFillBasicChecks() {

    }   

    function gridRefresh() {
        if (isGridInEditMode()) {
            console.log('Refresh paused because Grid is in edit mode');
            return;
        }
        var el = document.querySelector('button[name="refreshButton"]');
        if (el) {
            el.click();
            console.log('Grid Refreshed el "queue"');
        } else {
            console.log('refreshButton el "queue" not found');
            handlePageRefresh()
        }        
        var iframe = document.querySelector('iframe.isView.reportsReportBuilder');
        if (iframe) {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            var el2 = iframeDocument.querySelector('button.slds-button.slds-button_icon-border.action-bar-action-refreshReport.reportAction.report-action-refreshReport');
            if (el2) {
                el2.click();
                console.log('Grid Refreshed "new cases" using action-bar-action-refreshReport');
                setTimeout(function() {
                checkForServiceDeskCases(iframeDocument);
                checkForCMCases(iframeDocument);
                }, 500);
            } else {
                console.log('refreshButton el2 "new cases" not found');
            }
        } else {
            console.log('Iframe "news report" not found');
            handlePageRefresh()
        }
    }

    function handlePageRefresh() {
        var notification = new Notification('Please check the reports pages are fully loaded', {
            body: ``,
        });
    }

    function checkForServiceDeskCases(iframeDocument) {
        chrome.storage.sync.get({
            sfnotificationsd: false
        }, function (items) {
            if (items.sfnotificationsd) {
                var rows = iframeDocument.querySelectorAll('tr.data-grid-table-row');
                var count = 0;
                rows.forEach(function (row) {
                    var cell = row.querySelector('td[data-column-index="2"] div.wave-table-cell-text a');
                    if (cell && cell.textContent.includes("Service Desk - CC")) {
                        count++;
                    }
                });

                if (count > 0) {
                    var caseText = count === 1 ? 'case' : 'cases';
                    var notification = new Notification('Service Desk Cases', {
                        body: `${count} ${caseText} of Service Desk found`,
                    });
                }
                if (count > 10) {
                    var notification = new Notification('Service Desk Cases EXPLODED!!!!', {
                        body: ``,
                    });
                }
            }
        });
    }

    function checkForCMCases(iframeDocument) {
        chrome.storage.sync.get({
            sfnotificationcm: false
        }, function (items) {
            if (items.sfnotificationcm) {
                var rows = iframeDocument.querySelectorAll('tr.data-grid-table-row');
                var count = 0;
                rows.forEach(function (row) {
                    var cell = row.querySelector('td[data-column-index="2"] div.wave-table-cell-text a');
                    if (cell && cell.textContent.includes("Connect")) {
                        count++;
                    }
                });

                if (count > 0) {
                    var caseText = count === 1 ? 'case' : 'cases';
                    var notification = new Notification('Connect Cases Cases', {
                        body: `${count} ${caseText} of Connect found`,
                    });
                }    
                if (count > 15) {
                    var notification = new Notification('Connect Cases EXPLODED!!!!', {
                        body: ``,
                    });
                }
            }
        });
    }

    function isGridInEditMode() {
        var outerDiv = document.querySelector(".forceListViewManagerPrimaryDisplayManager");
        if (outerDiv) {
            var innerDiv = outerDiv.querySelector(".forceListViewManagerGrid");
            if (innerDiv && innerDiv.classList.contains("edits")) {
                return true;
            }
        } else {
            console.log("outerDiv was not found");
        }
        return false;
    }

    var currentInterval;

    function setRefreshInterval() {
        if (currentInterval)
            clearInterval(currentInterval);

        chrome.storage.sync.get({
            sfGridRefreshDuration: 45,
            sfGridRefreshPause: false
        }, function (items) {
            console.log(items);
            if (items.sfGridRefreshPause === false) {
                currentInterval = setInterval(gridRefresh, items.sfGridRefreshDuration * 1000);
            } else {
                currentInterval = setInterval(gridRefreshPaused, 120 * 1000);
            }
        });
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
            console.log(changes);
            if (changes.sfGridRefreshDuration?.newValue || changes.sfGridRefreshPause?.newValue != changes.sfGridRefreshPause?.oldValue) {
                setRefreshInterval();
            }
        }
    });

    setRefreshInterval();
    FindRefreshSF();
    autoFillBasicChecks();

};
