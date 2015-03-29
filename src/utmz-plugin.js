var UTMZCookie = require('./utmz-cookie.js');
var url = require('url');

function BringBackTheUTMZCookie(tracker, config) {
    this.tracker = tracker;
    this.debug = config.debug || false;
    this.debugMessage('loaded');
    if(config.cookies) {
        this.existingCookie = this.loadExistingCookie(config.cookies);
    }
}

BringBackTheUTMZCookie.prototype.runDefaultBehaviour = function() {
    // Is this a new domain?
    var currentUrl = document.location.toString()
    if (this.isSameDomain(document.referrer, currentUrl)) {
        return false;
    }
    
    if (this.runTaggedCampaignBehaviour()) { return true; }
    else if (this.runReferralBehaviour()) { return true; }
    else if (this.existingCookie && this.existingCookie.isLoaded) { return false; }
    else { this.runDirectBehaviour() }
};

BringBackTheUTMZCookie.prototype.loadExistingCookie = function (cookies) {
    // Is there any existing cookie? If so, get it.
    var existingCookie = new UTMZCookie({});
    if (cookies.indexOf("__utmz=") > -1) {
        var cookieString = cookies.match(/__utmz=[^;]*;/)[0];
        existingCookie.loadFromCookieString(cookieString.substring(7, cookieString.length-1));
        this.debugMessage(cookieString);
    }
    return existingCookie;
};

BringBackTheUTMZCookie.prototype.runDirectBehaviour = function() {
    var directCookie = new UTMZCookie({});
    directCookie.loadAsDirect();
    this.setOrUpdate(directCookie);
};

BringBackTheUTMZCookie.prototype.runReferralBehaviour = function() {
    // Is there a referer string?
    if (!document.referrer) {
        return false;
    }
    
    // Is it a parseable and known referer? If so, set it correctly.
    //TODO: parse special referrers correctly.
    
    // Otherwise, set as a referal
    var referrerCookie = new UTMZCookie({});
    referrerCookie.loadFromReferrerString(document.referrer);
    this.setOrUpdate(referrerCookie);
};

BringBackTheUTMZCookie.prototype.setOrUpdate = function(newCookie) {
    if (this.existingCookie && this.existingCookie.isLoaded && newCookie.nooverride) {
        this.existingCookie.expirationDate = '';
        document.cookie = this.existingCookie.cookieString();
        return true;
    // If existing cookie, and same as URL string, increment campaign and refresh
    } else if (this.existingCookie && this.existingCookie.isLoaded && this.existingCookie.equivalent(newCookie)) {
        this.existingCookie.campaignNumber++;
        this.existingCookie.expirationDate = '';
        document.cookie = this.existingCookie.cookieString();
        return true;
    } else {
        // Else, set url string as cookie
        document.cookie = newCookie.cookieString();
        return true;
    }
};

BringBackTheUTMZCookie.prototype.runTaggedCampaignBehaviour = function() {
    // Are there campaign tags in the URL?
    var currentUrl = document.location.toString()
    if (!this.hasCampaignTags(currentUrl)) {
        return false;
    }
    // Load from the URL String
    var urlCookie = new UTMZCookie({});
    urlCookie.loadFromURLString(currentUrl);
    // If existing cookie, and URL string is nooverride, refresh expiry of existing
    return this.setOrUpdate(urlCookie);
};

BringBackTheUTMZCookie.prototype.isSameDomain = function (url1, url2) {
    if (url1 && url2) {
        var domain1 = url.parse(url1).hostname.replace(/^www\./,'');
        var domain2 = url.parse(url2).hostname.replace(/^www\./,'');
        return (domain1 == domain2);
    } else { return false; }
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
