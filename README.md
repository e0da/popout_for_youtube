Popout for YouTube™
===================

An extension for Google Chrome™ that adds a button to videos on youtube.com to
"pop out" the video into a new window. Uses jQuery.

Download and Install
--------------------

Download and install via the [Chrome Web
Store](https://chrome.google.com/webstore/detail/pofekaindcmmojfnfgbpklepkjfilcep).

Implementation
--------------

Popout for YouTube™ is written in [CoffeeScript](http://coffeescript.org). The
source code is managed on GitHub at
http://github.com/sidewaysmilk/popout_for_youtube .

Development Requirements
------------------------

You need CoffeeScript and zip support to build it. If you have the bins
`coffee`, `cake`, and `zip`, you're good to go.

Compiling
---------

Run `cake` for a list of tasks. These are the big ones.

* `cake build` to compile
* `cake zip` runs `cake build` then prepares the Chrome extension as a zip file

Contributions
-------------

Thanks to the following developers for their contributions to the project!

* [sjb933][] - [#46][pr46]

Copyright and License
---------------------

Copyright © 2010-2014, Justin Force - Licensed under the MIT License

[sjb933]: https://github.com/sjb933
[pr46]: https://github.com/justinforce/popout_for_youtube/pull/46
