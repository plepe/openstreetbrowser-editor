var OverpassFrontend = require('overpass-frontend')
var OverpassLayer = require('overpass-layer')
global.map = null
global.overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')
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
  currentLayer = new OverpassLayer(data)
  currentLayer.addTo(map)
  currentList = new OverpassLayer.List(document.getElementById('list'), currentLayer)
}

function updateMap () {
  var data = form_data.get_data()

  currentLayer.remove()
  currentLayer = new OverpassLayer(data)
  currentLayer.addTo(map)
  currentList = new OverpassLayer.List(document.getElementById('list'), currentLayer)
}
