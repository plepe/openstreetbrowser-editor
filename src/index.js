var OverpassFrontend = require('overpass-frontend')
var OpenStreetBrowser = require('openstreetbrowser')
global.options = {}
global.config = {}
global.map = null
global.overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')
global.currentPath = null
var currentLayer
var currentList

window.onload = function () {
  var initState = {}
  map = L.map('map')
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.setView({ lat: 48.2, lng: 16.4 }, 16)
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
