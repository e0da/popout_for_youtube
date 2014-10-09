class Extension

  @saveOptions: (options, callback)->
    chrome.storage.local.set options, =>
      callback()
      @notifyOptionsSaved()

  @notifyOptionsSaved: ->
    chrome.extension.sendMessage action: 'optionsSaved'

  @loadOptions: (defaults, callback)->
    chrome.storage.local.get defaults, callback

class Options

  DEFAULTS =
    'revjet-optout': false
    'whatsNewDismissed': false

  constructor: ->

    Extension.loadOptions DEFAULTS, (options)=>
      @setOptions options

    $('#save').click => @saveOptions 'Options saved.'

    $('#restoreDefaults').click =>
      @setOptions DEFAULTS
      @saveOptions 'Defaults restored.'

    $('#resetWhatsNew').click => @resetWhatsNew()

    @notification = $('.alert')

  resetWhatsNew: ->
    Extension.saveOptions whatsNewDismissed: false, =>
      @notify "What's New Reset"

  saveOptions: (message)->
    Extension.saveOptions @options(), =>
      @notify message

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
