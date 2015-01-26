var expect = require('chai').expect;
var UTMZCookie = require('../src/utmz-cookie.js');

describe('UTMZCookie', function(){
    describe('#loadFromCookieString()', function(){
        it("should parse '123456789.1234567890.1.1.utmcsr=cnc_source|utmgclid=12345|utmccn=cnccamp|utmcmd=social|utmctr=test'", function(){
            var cookie = new UTMZCookie({});
            var cookie_string = '123456789.1234567890.1.1.utmcsr=cnc_source|utmgclid=12345|utmccn=cnccamp|utmcmd=social|utmctr=test';
            cookie.loadFromCookieString(cookie_string);
            expect(cookie.source).to.equal("cnc_source");
            expect(cookie.medium).to.equal("social");
            expect(cookie.campaign).to.equal("cnccamp");
            expect(cookie.term).to.equal("test");
            expect(cookie.gclid).to.equal("12345");
        });
    });
    
    describe('#loadFromURLString()', function(){
        it("should parse 'http://www.test.com/test_page?utm_source=bing&utm_medium=cpc&utm_term=test_term&utm_campaign=test_campaign'", function(){
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page?utm_source=bing&utm_medium=cpc&utm_term=test_term&utm_campaign=test_campaign';
            cookie.loadFromURLString(url_string);
            expect(cookie.source).to.equal("bing");
            expect(cookie.medium).to.equal("cpc");
            expect(cookie.campaign).to.equal("test_campaign");
            expect(cookie.term).to.equal("test_term");
            expect(cookie.nooverride).to.equal(false);
        });
        
        it("should parse 'http://www.test.com/test_page?gclid=1039393939'", function(){
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page?gclid=1039393939';
            cookie.loadFromURLString(url_string);
            expect(cookie.source).to.equal("google");
            expect(cookie.medium).to.equal("cpc");
            expect(cookie.gclid).to.equal("1039393939");
            expect(cookie.nooverride).to.equal(false);
        });
        
        it("should do nothing with 'http://www.test.com/test_page'", function() {
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page';
            cookie.loadFromURLString(url_string);
            expect(cookie.source).to.be.undefined();
            expect(cookie.medium).to.be.undefined();
            expect(cookie.campaign).to.be.undefined();
            expect(cookie.term).to.be.undefined();
        });
        
        it("should do nothing with 'http://www.test.com/test_page?another=param'", function() {
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page?another=param';
            cookie.loadFromURLString(url_string);
            expect(cookie.source).to.be.undefined();
            expect(cookie.medium).to.be.undefined();
            expect(cookie.campaign).to.be.undefined();
            expect(cookie.term).to.be.undefined();
        });
        
        it("should correctly set nooverride with a URL containing utm_nooverride=1", function(){
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page?utm_source=bing&utm_medium=cpc&utm_term=test_term&utm_campaign=test_campaign&utm_nooverride=1';
            cookie.loadFromURLString(url_string);
            expect(cookie.source).to.equal("bing");
            expect(cookie.medium).to.equal("cpc");
            expect(cookie.campaign).to.equal("test_campaign");
            expect(cookie.term).to.equal("test_term");
            expect(cookie.nooverride).to.equal(true);
        });
    });
    
    describe('#cookieValue()', function(){
        it("should generate a cookie value for a standard traffic source", function() {
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page?utm_source=bing&utm_medium=cpc&utm_term=test_term&utm_campaign=test_campaign';
            cookie.loadFromURLString(url_string);
            var cookieString = cookie.cookieValue();
            expect(cookieString).to.equal("0.1234567890.1.1.utmcsr=bing|utmccn=test_campaign|utmcmd=cpc|utmctr=test_term");
        });
        
        it("should generate a cookie value for a gclid", function() {
            var cookie = new UTMZCookie({});
            var url_string = 'http://www.test.com/test_page?gclid=1039393939';
            cookie.loadFromURLString(url_string);
            var cookieString = cookie.cookieValue();
            expect(cookieString).to.equal("0.1234567890.1.1.utmcsr=google|utmgclid=1039393939|utmcmd=cpc");
        });
    });
    
    describe('#cookieString()', function(){
        it("should generate a cookie string for a traffic source with default expiration", function() {
            var cookie = new UTMZCookie({source: 'bing',
                                         medium: 'cpc',
                                         term: 'test_term',
                                         campaign: 'test_campaign'});
            cookie.currentTime = 1420905852189;
            var cookieString = cookie.cookieString();
            expect(cookieString).to.equal("__utmz=0.1234567890.1.1.utmcsr=bing|utmccn=test_campaign|utmcmd=cpc|utmctr=test_term; expires=Thu, 09 Jul 2015 16:04:12 GMT");
        });
        
        it("should generate a cookie string for a traffic source with 30d expiration", function() {
            var cookie = new UTMZCookie({source: 'bing',
                                         medium: 'cpc',
                                         term: 'test_term',
                                         campaign: 'test_campaign',
                                         expirationDays: 30});
            cookie.currentTime = 1420905852189;
            var cookieString = cookie.cookieString();
            expect(cookieString).to.equal("__utmz=0.1234567890.1.1.utmcsr=bing|utmccn=test_campaign|utmcmd=cpc|utmctr=test_term; expires=Mon, 09 Feb 2015 16:04:12 GMT");
        });
    });
});