// Increase the default max listeners to prevent MaxListenersExceededWarning
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 15; // Increased from default 10

console.log("Increased EventEmitter.defaultMaxListeners to 15");
