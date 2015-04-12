# ReturnOfTheUTMZ
Javascript plugin for Google Analytics analytics.js to recreate the functionality of the __utmz cookie (which no longer exists with Universal Analytics). Some Google Analytics users came to rely on the cookie format of __utmz, and would parse it for other data collection work. When that cookie went missing, stuff broke. This will hopefully fix those cases.

## Installation
There are two ways to use this: As a Universal Analytics Tracking Plugin or as a standalone script.

### Universal Analytics Plugin
1. Download the latest version of the GA plugin from [compiled/latest/utmz_ga.min.js](compiled/latest/utmz_ga.min.js)
2. Host it on your web server.
3. Add a `<script async src="/PATH_TO_JS/utmz_ga.min.js"></script>` on each page
4. Wherever your Google Analytics tag is, add `ga('require', 'utmz', { cookies: document.cookie });` directly after the `ga('create', ...)` command.
5. Add `ga('utmz:runDefaultBehaviour');` right after the `ga('send', ...)` command.

### Standalone Script
1. Download the latest version of the standalone script from [compiled/latest/utmz.min.js](compiled/latest/utmz.min.js)
2. Host it on your web server.
3. Add a `<script async src="/PATH_TO_JS/utmz.min.js"></script>` on each page (or via a tag manager)

That *should* be it. However, this is still in development.

## Known Bugs and Deficiencies
There are many. They will be tracked under Issues on github.
PLEASE feel free to contribute!

## Versions
### 0.0.1
Initial alpha. Supports utm_ tags and general referer parsing and cookie checking, but has a ton of TODOs. It will probably work for the most general cases (e.g. no tricky cookie settings) and doesn't capture timestamps. I'm not super happy with all of the hacked-together decisions to get this released, but at least it is a starting point to improve from.
### 0.0.2
Added the ability to run this as a non-GA tracking plugin. I had to do this because I realized that there are cases where people want the cookie but don't want GA and also that when using Google Tag Manager, it is not possible to specify Universal Analytics plugin requirements.
