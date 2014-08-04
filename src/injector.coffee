class YouTubePageScriptInjector

  EVENT       = 'YouTubePageScriptInjector'
  SCRIPT_NAME = 'popout_for_youtube'

  constructor: ->
    @injectYouTubePageScript()

  injectYouTubePageScript: ->
    document.body.addEventListener EVENT, (event)->
      script = document.createElement('script')
      script.src = chrome.extension.getURL("lib/#{SCRIPT_NAME}.js")
      this.appendChild script
    document.body.dispatchEvent new CustomEvent EVENT

new YouTubePageScriptInjector
