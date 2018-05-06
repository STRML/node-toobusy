var toobusy = require('node-toobusy');

// Set maximum lag to an aggressive value.
toobusy.maxLag(10);

// Set check interval to a faster value. This will catch more latency spikes
// but may cause the check to be too sensitive.
toobusy.interval(250);

// Set smoothing factor on rise to a lower value. This will make it less sensible
// to spikes. Default is 1/3.
toobusy.smoothingFactorOnRise(1/4);

// Set smoothing factor on fall to a higher value. This will make it recover faster
// after spikes. Default is 2/3.
toobusy.smoothingFactorOnFall(3/4);

// You can overwrite this function to change the way currentLag is calculated.
// This is the default implementation.
toobusy.lagFunction = function(lag, currentLag, smoothingUp, smoothingDown) {
  var factor = lag > currentLag ? smoothingUp : smoothingDown;
  return factor * lag + (1 - factor) * currentLag;
}

// Get current maxLag or interval setting by calling without parameters.
var currentMaxLag = toobusy.maxLag(), interval = toobusy.interval();

toobusy.onLag(function(currentLag) {
  console.log("Event loop lag detected! Latency: " + currentLag + "ms");
});

// check if node is too busy
if (toobusy()) {
  console.warn("TooBusy!");
}

console.log("Current adjusted event lag", toobusy.lag(), "ms");
