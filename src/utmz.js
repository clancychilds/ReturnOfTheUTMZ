var UTMZ = require('./utmz-plugin.js');
var window = global.window || [];

function providePlugin(pluginName, pluginConstructor) {
    var ga = window[window.GoogleAnalyticsObject || 'ga'];
    
    if (ga) {
        ga('provide', pluginName, pluginConstructor);
    }
}

// Register the plugin.
providePlugin('utmz', UTMZ);
