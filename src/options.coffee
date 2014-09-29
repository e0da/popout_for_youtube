class Options

  DEFAULTS =
    adsEnabled: true

  constructor: ->

    $ => chrome.storage.sync.get DEFAULTS, @setOptions

    $('#save').click => @saveOptions 'Options saved.'

    $('#restoreDefaults').click =>
      @setOptions DEFAULTS
      @saveOptions 'Defaults restored.'

  saveOptions: (message)->
    chrome.storage.sync.set @options(), => @notify message

  setOptions: (options)->
    $('#adsEnabled').get(0).checked = options.adsEnabled

  notify: (message)->
    console.log message

  options: ->
    options = {}
    options.adsEnabled = $('#adsEnabled').get(0).checked
    options

new Options
