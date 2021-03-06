"use strict";

var DEBUG = 0;

// Production detection
if (Browser.inProduction()) {
	DEBUG = 0;
}

// Logging setup
console.lolg = function() {
	// Console logging that only happens in debug mode
	// The name "lolg" is a tribute to Lorents Odin Lervik Gravås
	if (DEBUG) {
		console.log.apply(console, arguments);
	}
};

// Loops & intervals
var BACKGROUND_LOOP = 60000; // 60s
var BACKGROUND_LOOP_DEBUG = 5000; // 5s, respond fairly quickly for us developers
var PAGE_LOOP = 10000; // 10s
var PAGE_LOOP_DEBUG = 5000; // 5s
var ONLINE_MESSAGE = '\nNow online, run mainloop\n';
var OFFLINE_MESSAGE = '\nNow offline, stop execution\n';

// Update stuff at every X intervals
var UPDATE_OFFICE_INTERVAL = 1; // recommended: 1
var UPDATE_SERVANT_INTERVAL = 20; // recommended: 20
var UPDATE_MEETINGS_INTERVAL = 20; // recommended: 20
var UPDATE_COFFEE_INTERVAL = 1; // recommended: 1
var UPDATE_HOURS_INTERVAL = 60; // recommended: 60
var UPDATE_CANTINAS_INTERVAL = 60; // recommended: 60
var UPDATE_BUS_INTERVAL = 2; // recommended: 1
var UPDATE_NEWS_INTERVAL = 20; // recommended: 20

// Meme detection
var urlExists = function(url) {
	try {
	    var http = new XMLHttpRequest();
	    http.open('HEAD', url, false);
	    http.send();
	    return http.status!=404;
	}
	catch (e) {
		return false;
	}
}
var MEME_AMOUNT = 0;
var __counter__ = 1;
while (urlExists('meme/'+__counter__+'.png')) {
	MEME_AMOUNT++;
	__counter__++;
}
