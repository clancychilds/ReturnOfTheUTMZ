var UTMZ = require('./utmz-plugin.js');
var UTMZsetter = new UTMZ([],{cookies:document.cookie,location:document.location});
UTMZsetter.runDefaultBehaviour();

