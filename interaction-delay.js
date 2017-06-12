//
// Logs all user interactions (scrolls, clicks and keys) and any LongTasks
// that caused delays > 50ms.
//
(function() {
    // maximum interaction delay before logging
    var MAX_DELAY = 50;

    // only run in top frame)
    if (window.self !== window.top) {
        return;
    }

    if (typeof PerformanceObserver !== "function") {
        console.log("InteractionDelay: PerformanceObserver not supported");
        return;
    }

    // LongTasks
    var longTasks = [];

    // Start PerformanceObserver
    var observer = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        console.log("InteractionDelay: LongTasks added", entries);

        // Capture all LongTasks for now
        longTasks = longTasks.concat(entries);

        // Only keep last 50 entries
        longTasks = longTasks.slice(0, 50);
    });

    // Listen for new entries
    try {
        observer.observe({entryTypes: ["longtask"]});
    } catch (e) {
        console.log("InteractionDelay: LongTasks not supported");

        return;
    }

    // Interaction event handler
    function handleInteraction(e) {
        var when = performance.now();

        if (!e || !e.timeStamp) {
            return;
        }

        // Calculate how long it took to execute this handler
        var delay = when - e.timeStamp;

        console.log("InteractionDelay:", e.type, "took", Math.round(delay), "ms");

        if (delay > MAX_DELAY) {
            // Find any matching LongTasks - use a setTimeout in case the LongTasks
            // observer needs to run still.
            setTimeout(function() {
                // Find matching culprits
                var culprits = longTasks.filter(function(lt) {
                    var ltEnd = lt.startTime + lt.duration;

                    // Anything ending during this task
                    return (ltEnd >= e.timeStamp && ltEnd <= when);
                });

                console.log("InteractionDelay: Interaction delay for", e.type, "at", Math.round(e.timeStamp), "satisifed at",
                            Math.round(when), "took", Math.round(delay), "ms with", culprits.length, "culprits");

                // Log each culprit
                culprits.forEach(function(culprit) {
                    console.log("InteractionDelay: Caused by:", culprit);
                });
            }, 100);
        }
    }

    // Listen for interaction events
    window.addEventListener("scroll", handleInteraction, false);
    document.addEventListener("click", handleInteraction, false);
    document.addEventListener("keydown", handleInteraction, false);
})();
