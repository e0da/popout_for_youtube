require 'jslint-v8'
require 'rb-inotify'
require 'json'

def version
  JSON.parse(File.read('manifest.json'))['version']
end

JSLintV8::RakeTask.new do |task|
  task.name = 'lint'
  task.include_pattern = '**/*.js'
  task.exclude_pattern = 'lib/jquery.js'
end

desc 'bundle the extension into an upload-ready zip file'
task :zip do
  out = "dist/popout-for-youtube-#{version}.zip"
  FileUtils.mkdir_p 'dist'
  FileUtils.rm_rf out
  files = %w[
    manifest.json
    _locales
    lib
    images
    background.html
    player.html
  ]
  `zip -r #{out} #{files.join(' ')}`
  puts "#{out} created"
end
