# ReturnOfTheUTMZ
Javascript plugin for Google Analytics analytics.js to recreate the functionality of the __utmz cookie (which no longer exists with Universal Analytics). Some Google Analytics users came to rely on the cookie format of __utmz, and would parse it for other data collection work. When that cookie went missing, stuff broke. This will hopefully fix those cases.

## Installation
1. Download the latest version from [compiled/latest/utmz.min.js](compiled/latest/utmz.min.js)
2. Host it on your web server.
3. Add a <script async src="/PATH_TO_JS/utmz.min.js"></script> on each page (or via a tag manager)
4. Wherever your Google Analytics tag is, add ga('require', 'utmz', { cookies: document.cookie }); directly after the ga('create', ...) command.
5. Add ga('utmz:runDefaultBehaviour'); right after the ga('send', ...) command.


That *should* be it. However, this is still in development.


