var OverpassFrontend = require('overpass-frontend')
var OpenStreetBrowser = require('openstreetbrowser')

global.options = {}
global.map = null
global.overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')
/*
global.currentPath = null
var currentLayer
var currentList

window.onload = function () {
  var initState = {}
  map = L.map('map')
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.setView({ lat: config.defaultView.lat, lng: config.defaultView.lon }, config.defaultView.zoom)
  call_hooks('init')
  call_hooks_callback('init_callback', initState, onload2.bind(this, initState))

  var previewButton = document.getElementById('preview')
  if (previewButton) {
    previewButton.onclick = updateMap
  }
}

function onload2 (initState) {
  initCategory(data, function (err) { console.log('done', err) })
}

function updateMap () {
  currentLayer.close()
  var data = form_data.get_data()
  initCategory(data, function (err) { console.log('done', err) })
}

function initCategory (data, callback) {
  currentLayer = new OpenStreetBrowser.CategoryOverpass(id, data)
  currentLayer.load(function () {
    currentLayer.setMap(map)
    currentLayer.open()

    var dom = document.getElementById('list')
    dom.innerHTML = ''
    currentLayer.setParentDom(dom)

    callback(null)
  })
}
*/

function Editor (textarea) {
  if (textarea.length) {
    textarea = textarea[0]
  } else {
    return
  }

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
  var div = document.createElement('div')
  this.textarea.parentNode.insertBefore(div, this.textarea)
  div.innerHTML = 'foo'
  // this.map = L.map('map')
}

window.OpenStreetBrowserEditor = {
  set: function (textarea) {
    var editor = new Editor(textarea)

    if (editor.isCategory()) {
      editor.load()
      return true
    }
  }
}
