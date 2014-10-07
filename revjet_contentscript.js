(function () {

  'use strict';

  chrome.storage.local.get('revjet-optout', function (results) {
    if (results['revjet-optout']) return;
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://ads.dfgio.com/loader.js?client=jf9214';
    document.getElementsByTagName('head')[0].appendChild(s);
  });
}());
