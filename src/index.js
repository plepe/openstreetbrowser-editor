var OverpassFrontend = require('overpass-frontend')
var OpenStreetBrowser = require('openstreetbrowser')
var jsonMultilineStrings = require('json-multiline-strings')

global.options = {}
global.overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')
global.ui_lang = 'en'
global.config = {}
global.currentPath = null

function Editor (textarea) {
  this.textarea = textarea

  try {
    this.data = JSON.parse(this.textarea.value)
  }
  catch (err) {
    this.data = undefined
  }
}

Editor.prototype.isCategory = function () {
  return (this.data && 'type' in this.data && [ 'index', 'overpass' ].indexOf(this.data.type) !== -1)
}

Editor.prototype.load = function () {
  this.data = jsonMultilineStrings.join(this.data, { exclude: [ [ 'const' ] ] })

  initState = {}
  call_hooks('init')
  call_hooks_callback('init_callback', initState, this.load2.bind(this, initState))
}

Editor.prototype.load2 = function (initState) {
  this.textarea.style.display = 'none'

  this.previewDiv = document.createElement('div')
  this.textarea.parentNode.insertBefore(this.previewDiv, this.textarea)
  this.previewDiv.setAttribute('style', 'height: 300px; position: relative;')

  this.listDiv = document.createElement('div')
  this.listDiv.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 250px; bottom: 0; border-right: 1px solid black;')
  this.previewDiv.appendChild(this.listDiv)

  this.mapDiv = document.createElement('div')
  this.mapDiv.setAttribute('style', 'position: absolute; top: 0; left: 251px; bottom: 0; right: 0;')
  this.previewDiv.appendChild(this.mapDiv)

  this.map = L.map(this.mapDiv)
  global.map = this.map // TODO: remove this

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map)

  this.map.setView({ lat: 40, lng: 16 }, 14)

  this.layer = new OpenStreetBrowser.CategoryOverpass('edit', this.data)
  this.layer.load(function () {
    this.layer.setMap(this.map)
    this.layer.open()

    this.layer.setParentDom(this.listDiv)
  }.bind(this))
}

Editor.prototype.reload = function () {
}

window.OpenStreetBrowserEditor = {
  set: function (textarea) {
    if (textarea.length) {
      textarea = textarea[0]
    }

    if (textarea.editor) {
      textarea.editor.reload()
      return true
    }

    textarea.editor = new Editor(textarea)

    if (textarea.editor.isCategory()) {
      textarea.editor.load()
      return true
    }
  }
}
