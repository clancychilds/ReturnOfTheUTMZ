var url = require('url');
    /* Format utmz cookie string
  Based on information provided at
  http://blog.vkistudios.com/index.cfm/2010/8/31/GA-Basics-The-Structure-of-Cookie-Values

    utmz=123456789.1234567890.1.1.utmcsr=[source]|utmgclid=[ad click id]|utmccn=[campaign]|utmcmd=…
    …[medium]|utmctr=[keyword]
    Domain Hash: Used to be the domain hash, but is now initialized to '0'
    Time Stamp: The second number is the current time stamp
    Session #: this is now permanently set to '1' as it is unused in this plugin
    Campaign #: This counts each time a visitor arrives from a different campaign.
    utmcsr: This is the source of the visitor.
    utmgclid: This is the Google ad click ID
    utmccn: This is set by the campaign value of the url, or in the case of organic traffic it is (organic).
    utmcmd: This is set by the medium defined by the URL.
    utmctr: This is the keyword that brought the visitor here in search engine campaigns.
    utmcid: This is the lookup table id
    utmcct: This is the Ad content description    
*/

    function UTMZCookie(config) {
        this.source = config.source;
        this.medium = config.medium;
        this.campaign = config.campaign;
        this.gclid = config.gclid;
        this.term = config.term;
        this.content = config.content;
        this.tableid = config.tableid;         
        this.nooverride = config.nooverride || false;
        this.debug = true;
        this.domainHash = config.domainHash || 0;
        this.timestamp = config.timestamp || 1234567890; //TODO: figure out a better timestamp plan
        this.sessionNumber = config.sessionNumber || 1;
        this.campaignNumber = config.campaignNumber || 1;
        this.domain = config.domain;
        this.path = config.path;
        this.currentTime = config.currentTime;
        this.expirationDate = config.expirationDate;
        this.expirationDays = config.expirationDays || 180;
        this.isLoaded = false;
    }
   
    // DomainHash Generator
    UTMZCookie.prototype.generateDomainHash =  function generateDomainHash(d)
    {
        if (!d || d=="") return 1;
        var h=0,g=0;
        for (var i=d.length-1;i>=0;i--){
            var c=parseInt(d.charCodeAt(i));
            h=((h << 6) & 0xfffffff) + c + (c << 14);
            if ((g=h & 0xfe00000)!=0) h=(h ^ (g >> 21));
        }
        return h;
    }
    
    UTMZCookie.prototype.loadFromCookieString = function(cookieString) {
        //this.debugMessage('loading cookie from string: ' + cookieString);
        var periodSplit = cookieString.split('.');
        this.domainHash = periodSplit[0];
        this.timestamp = periodSplit[1];
        this.sessionNumber = periodSplit[2];
        this.campaignNumber = periodSplit[3];
        var sourceString = periodSplit[4];
        var pipeSplit = sourceString.split('|');
        for (var i = 0; i < pipeSplit.length; i++) {
            var item = pipeSplit[i];
            //this.debugMessage('item: ' + item);
            var keyValue = item.split('=');
            switch (keyValue[0]) {
                case 'utmcsr':
                    this.source = keyValue[1];
                    break;
                case 'utmgclid':
                    this.gclid = keyValue[1];
                    break;
                case 'utmccn':
                    this.campaign = keyValue[1];
                    break;
                case 'utmcmd':
                    this.medium = keyValue[1];
                    break;
                case 'utmctr':
                    this.term = keyValue[1];
                    break;
                case 'utmcct':                    
                    this.content = keyValue[1];
                    break;
                case 'utmcid':                    
                    this.tableid = keyValue[1];
                    break;                     
            }
        }
        this.isLoaded = true;
    };

    UTMZCookie.prototype.loadFromURLString = function(urlString) {
        if (urlString.indexOf('?') == -1) return;
        var searchString = urlString.split("?")[1];
        this.loadFromSearchString(searchString);
        this.isLoaded = true;
    };

    UTMZCookie.prototype.loadFromSearchString = function(searchString) {
        var parameters = searchString.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var keyValue = parameters[i].split("=", 2);
            var key = keyValue[0];
            var value = keyValue[1];
            switch (key) {
                case 'utm_source':
                    this.source = value;
                    break;
                case 'gclid':
                    this.gclid = value;
                    this.source = 'google';
                    this.medium = 'cpc';
                    break;
                case 'utm_campaign':
                    this.campaign = value;
                    break;
                case 'utm_medium':
                    this.medium = value;
                    break;
                case 'utm_term':
                    this.term = value;
                    break;
                case 'utm_content':                    
                    this.content = value;
                    break;
                case 'utm_id':                    
                    this.tableid = value;
                    break;                     
                case 'utm_nooverride':
                    if (value == '1' || value == 1) {
                        this.nooverride = true;
                    } else {
                        this.nooverride = false;
                    }
                    break;
            }
        }
    };

    UTMZCookie.prototype.cookieValue = function() {
        //123456789.1234567890.1.1.utmcsr=[source]|utmgclid=[ad click id]|utmccn=[campaign]|utmcmd=[medium]|utmctr=[keyword]
        var trafficSource = [];
        if (this.source) trafficSource.push("utmcsr=" + this.source);
        if (this.gclid) trafficSource.push("utmgclid=" + this.gclid);
        if (this.campaign) trafficSource.push("utmccn=" + this.campaign);
        if (this.medium) trafficSource.push("utmcmd=" + this.medium);
        if (this.term) trafficSource.push("utmctr=" + this.term);
        if (this.content) trafficSource.push("utmcct=" + this.content);
        if (this.tableid) trafficSource.push("utmcid=" + this.tableid);        

        var sourceString = trafficSource.join("|");
        var cookieValue = [this.domainHash, this.timestamp, this.sessionNumber, this.campaignNumber, sourceString].join('.');
        return cookieValue;
    };

    UTMZCookie.prototype.expirationDateValue = function() {
        if (!this.expirationDate) {
            if (!this.currentTime) this.currentTime = (new Date()).getTime();
            this.expirationDate = new Date();
            this.expirationDate.setTime(this.currentTime + (this.expirationDays * 86400000));
        }
        return this.expirationDate.toUTCString();
    };

    UTMZCookie.prototype.cookieString = function() {
        var cookieValues = [];
        cookieValues.push("__utmz=" + this.cookieValue());
        cookieValues.push("expires=" + this.expirationDateValue());
        if(this.domain) {cookieValues.push("domain=" + this.domain);}
        if(this.path) {cookieValues.push("path=" + this.path);}
        var cookieString = cookieValues.join("; ");
        return cookieString;
    };

    UTMZCookie.prototype.equivalent = function(other) {
        return (this.source == other.source && this.medium == other.medium &&
                this.campaign == other.campaign && this.term == other.term &&
                this.gclid == other.gclid && this.content ==  other.content &&
                this.tableid == other.tableid);
    };

    UTMZCookie.prototype.loadAsDirect = function(referrerString) {
        this.source = '(direct)';
        this.medium = '(none)';
        this.campaign = '(direct)';
        this.isLoaded = true;
    };
    
    UTMZCookie.prototype.loadFromReferrerString = function(referrerString) {
        var referrer = url.parse(referrerString);
        this.source = referrer.hostname.replace(/^www\./,'');
        this.term = referrer.path;
        this.medium = 'referral';
        this.campaign = '(referral)';
        this.isLoaded = true;
    };

    UTMZCookie.prototype.debugMessage = function(message) {
        if (!this.debug) return;
        if (console) console.debug('utmz: ' + message);
    };

module.exports = UTMZCookie;
