/* eslint-disable no-underscore-dangle */
window._gaq = window._gaq || []
window._gaq.push(["_setAccount", "UA-21885508-1"])
window._gaq.push(["_trackPageview"])
;(() => {
  const ga = document.createElement("script")
  ga.type = "text/javascript"
  ga.async = true
  ga.src = "https://ssl.google-analytics.com/ga.js"
  const s = document.getElementsByTagName("script")[0]
  s.parentNode.insertBefore(ga, s)
})()
