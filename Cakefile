fs           = require 'fs'
path         = require 'path'
uglify       = require 'uglify-js'
autoprefixer = require 'autoprefixer'
csso         = require 'csso'

current = path.dirname __filename

task "build", "Build project", ->
  js css () -> console.log 'All done.\n'

js = (fn) ->
  console.log "Minifying js..."
  file = path.normalize "#{current}/script.js"
  try
    js = fs.readFileSync file, 'utf8'
    #js = uglify.minify js, fromString: true
    fs.writeFileSync file, js.code
    console.log "Done.\n"
  catch err
    console.log err
    console.log "\n"

css = (fn) ->
  console.log "Minifying css..."
  file = path.normalize "#{current}/style.css"
  try
    css = fs.readFileSync file, "utf8"
    css = autoprefixer.compile css
    #css = csso.justDoIt autoprefixer.compile css
    fs.writeFileSync file, css
    console.log "Done.\n"
  catch err
    console.log err
    console.log "\n"

