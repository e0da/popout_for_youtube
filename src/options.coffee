class Options

  DEFAULTS =
    'revjet-optout': false

  constructor: ->

    $ => chrome.storage.local.get DEFAULTS, @setOptions

    $('#save').click => @saveOptions 'Options saved.'

    $('#restoreDefaults').click =>
      @setOptions DEFAULTS
      @saveOptions 'Defaults restored.'

    @notification = $('.alert')

  saveOptions: (message)->
    chrome.storage.local.set @options(), => @notify message

  setOptions: (options)->
    $('#revjet-optout').get(0).checked = !!options['revjet-optout']

  notify: (message, klass='success')->
    @notification.stop().show().text message
    @notification.addClass "alert-#{klass}"
    clearInterval(@notificationTimeout) if @notificationTimeout
    @notificationTimeout = setTimeout =>
      @resetNotification()
    , 1000

  resetNotification: ->
    @notification.stop().show().fadeOut =>
      @notification.text ''
      @notification.attr 'class', 'alert'
      @notification.show()

  options: ->
    options = {}
    options['revjet-optout'] = $('#revjet-optout').get(0).checked
    options

new Options
