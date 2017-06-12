//
// Logs all LongTasks to the console
//
(function() {
    // only run in top frame)
    if (window.self !== window.top) {
        return;
    }

    console.log("LongTasks: Initializing");

    var observer = new PerformanceObserver(function(list) {
        var perfEntries = list.getEntries();
        for (var i = 0; i < perfEntries.length; i++) {
            console.log("LongTasks: ",
                        perfEntries[i].name,
                        perfEntries[i].duration,
                        perfEntries[i].attribution.length,
                        perfEntries[i].attribution[0].containerType,
                        perfEntries[i].attribution[0].containerName,
                        perfEntries[i].attribution[0].containerSrc,
                        perfEntries[i].attribution[0].containerId,
                        perfEntries[i]);
        }
    });

    try {
        observer.observe({entryTypes: ["longtask"]});

        console.log("LongTasks: Appears to be supported");
    } catch (e) {
        console.log("LongTasks: Not supported");
    }
})();
