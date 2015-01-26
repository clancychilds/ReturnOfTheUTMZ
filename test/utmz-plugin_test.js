var expect = require('chai').expect;
var UTMZ = require('../src/utmz-plugin.js');

describe('BringBackTheUTMZ', function(){
    describe('#isSameDomain()', function(){
        it("should find equivalent domains equal", function(){
            var utmz = new UTMZ({}, {});
            var referrer = "http://kingcontent.com/index.html";
            var url = "http://kingcontent.com/index.html";
            var result = utmz.isSameDomain(referrer, url);
            expect(result).to.equal(true);
        });
        it("should find equivalent domains with different pages equal", function(){
            var utmz = new UTMZ({}, {});
            var referrer = "http://kingcontent.com/link.html";
            var url = "http://kingcontent.com/index.html";
            var result = utmz.isSameDomain(referrer, url);
            expect(result).to.equal(true);
        });
        it("should ignore www", function(){
            var utmz = new UTMZ({}, {});
            var referrer = "http://kingcontent.com/index.html";
            var url = "http://www.kingcontent.com/index.html";
            var result = utmz.isSameDomain(referrer, url);
            expect(result).to.equal(true);
        });
        it("should not find subdomains to be a match", function(){
            var utmz = new UTMZ({}, {});
            var referrer = "http://subdomain.kingcontent.com/link.html";
            var url = "http://kingcontent.com/index.html";
            var result = utmz.isSameDomain(referrer, url);
            expect(result).to.equal(false);
        });
        it("should not find different domains to be a match", function(){
            var utmz = new UTMZ({}, {});
            var referrer = "http://technologysauce.com/link.html";
            var url = "http://kingcontent.com/index.html";
            var result = utmz.isSameDomain(referrer, url);
            expect(result).to.equal(false);
        });
    });
    
    describe('#hasCampaignTags()', function(){
        it("should return false when no tags are found", function(){
            var utmz = new UTMZ({}, {});
            var url = "http://kingcontent.com/index.html";
            var result = utmz.hasCampaignTags(url);
            expect(result).to.equal(false);
        });
        it("should return true when mandatory tags are found", function(){
            var utmz = new UTMZ({}, {});
            var url = "http://kingcontent.com/index.html?utm_source=test&utm_medium=test&utm_campaign=test";
            var result = utmz.hasCampaignTags(url);
            expect(result).to.equal(true);
        });
        it("should return false when a mandatory tag is missing", function(){
            var utmz = new UTMZ({}, {});
            var url = "http://kingcontent.com/index.html?utm_source=test&utm_campaign=test";
            var result = utmz.hasCampaignTags(url);
            expect(result).to.equal(false);
        });
    });
});