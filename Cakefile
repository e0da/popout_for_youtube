fs = require 'fs'

{print} = require 'util'
{spawn, exec} = require 'child_process'

pkg_files = [
  '_locales'
  'images'
  'lib'
  'analytics.js'
  'LICENSE'
  'manifest.json'
  'popout.html'
  'popout_for_youtube.css'
  'README.md'
].join ' '

version = ->
  JSON.parse(fs.readFileSync('manifest.json')).version

zip_out = ->
  "pkg/popout_for_youtube-#{version()}.zip"

build = (watch=false) ->
  options = ['-w', '-c', '-o', 'lib', 'src']
  options.shift '-w' unless watch
  coffee = spawn 'coffee', options
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()

zip = ->
  try fs.mkdirSync 'pkg', 0o0755
  exec "zip -r #{zip_out()} #{pkg_files}"

task 'build', 'build all CoffeeScript in src to JavaScript in lib', ->
  build()
task 'watch', 'watch for changes to CoffeeScript in src and build to JavaScript in lib', ->
  build true
task 'zip', "build an upload-ready Chrome extension to #{zip_out()}", ->
  build()
  zip()
