var UTMZCookie = require('./utmz-cookie.js');
var url = require('url');

function BringBackTheUTMZCookie(tracker, config) {
    this.tracker = tracker;
    this.debug = config.debug || false;
    this.debugMessage('loaded');
}

BringBackTheUTMZCookie.prototype.runTaggedCampaignBehaviour = function() {
    // Is this a new domain?
    var currentUrl = document.location.toString()
    if (this.isSameDomain(document.referrer, currentUrl)) {
        return false;
    }
    // Are there campaign tags in the URL?
    if (!this.hasCampaignTags(currentUrl)) {
        return false;
    }
    // Is there any existing cookie? If so, get it.
    var cookies = document.cookie;
    var existingCookie = new UTMZCookie({});
    if (cookies.indexOf("__utmz=") > -1) {
        var cookieString = cookies.match(/__utmz=[^;]*;/)[0];
        existingCookie.loadFromCookieString(cookieString.substring(7, cookieString.length));
        this.debugMessage(cookieString);
    }
    // Load from the URL String
    var urlCookie = new UTMZCookie({});
    urlCookie.loadFromURLString(currentUrl);
    // If existing cookie, and URL string is nooverride, refresh expiry of existing
    if (existingCookie.isLoaded && urlCookie.nooverride) {
        document.cookie = existingCookie.cookieString();
        return true;
    // If existing cookie, and same as URL string, increment campaign and refresh
    } else if (existingCookie.isLoaded && existingCookie.equivalent(urlCookie)) {
        
    } else {
        // Else, set url string as cookie
        document.cookie = urlCookie.cookieString();
        return true;
    }
};

BringBackTheUTMZCookie.prototype.isSameDomain = function (url1, url2) {
        var domain1 = url.parse(url1).hostname.replace(/^www\./,'');
        var domain2 = url.parse(url2).hostname.replace(/^www\./,'');
        return (domain1 == domain2);
};

BringBackTheUTMZCookie.prototype.hasCampaignTags = function (currentUrl) {
        var query = url.parse(currentUrl).query;
        if (query == undefined) return false;
        var medium = query.indexOf('utm_medium=') > -1;
        var source = query.indexOf('utm_source=') > -1;
        var campaign = query.indexOf('utm_campaign=') > -1;
        return (medium && source && campaign);
};
// Enables / disables debug output.
BringBackTheUTMZCookie.prototype.setDebug = function(enabled) {
    this.debug = enabled;
};

/**
 * Displays a debug message in the console, if debugging is enabled.
 */
BringBackTheUTMZCookie.prototype.debugMessage = function(message) {
    if (!this.debug) return;
    if (console) console.debug('utmz: ' + message);
};

module.exports = BringBackTheUTMZCookie;
