var OverpassFrontend = require('overpass-frontend')
var OpenStreetBrowser = require('openstreetbrowser')
var jsonMultilineStrings = require('json-multiline-strings')
var CategoryOverpass = require('./CategoryOverpass')

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

  this.parentDiv = document.createElement('div')
  this.parentDiv.setAttribute('style', 'position: relative; border: 1px solid black;')
  this.textarea.parentNode.insertBefore(this.parentDiv, this.textarea)

  this.formDiv = document.createElement('div')
  this.formDiv.setAttribute('style', 'padding-bottom: 301px;')
  this.parentDiv.appendChild(this.formDiv)

  this.previewDiv = document.createElement('div')
  this.parentDiv.appendChild(this.previewDiv)
  this.previewDiv.setAttribute('style', 'background-color:#ddd; position: fixed; left: 0; width: 300px; bottom: 0%; height: 300px; border-top: 1px solid grey;')

  this.listDiv = document.createElement('div')
  this.listDiv.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 350px; height: 300px; border-right: 1px solid grey; border-bottom: 1px solid black; overflow: auto;')
  this.previewDiv.appendChild(this.listDiv)

  this.mapDiv = document.createElement('div')
  this.mapDiv.setAttribute('style', 'position: absolute; top: 0; left: 351px; bottom: 0; right: 0;')
  this.previewDiv.appendChild(this.mapDiv)

  this.form = new form('data', CategoryOverpass.formDef(), {
    type: 'form_chooser',
    order: false
  })
  this.form.show(this.formDiv)
  this.form.set_data(this.data)

  this.form.onchange = function () {
    this.data = this.form.get_data()

    var data = JSON.parse(JSON.stringify(this.data))
    data = JSON.stringify(jsonMultilineStrings.split(data, { exclude: [ [ 'const' ] ] }), null, '    ')
    this.textarea.value = data

    this.initCategory()
  }.bind(this)

  this.map = L.map(this.mapDiv)
  global.map = this.map // TODO: remove this

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map)

  this.map.setView({ lat: 40, lng: 16 }, 14)

  this.initCategory()

  this.resize()

  window.addEventListener('scroll', this.resize.bind(this))
  window.addEventListener('resize', this.resize.bind(this))
}

Editor.prototype.resize = function () {
  var p = this.formDiv.getBoundingClientRect()
  var height = Math.min(300, window.innerHeight / 2)

  this.formDiv.style.paddingBottom = (height + 1) + 'px'
  this.listDiv.style.height = height + 'px'
    this.previewDiv.style.height = height + 'px'

  if (window.innerHeight - p.top < height) {
    this.previewDiv.style.display = 'none'
  } else if (p.top + p.height - window.innerHeight < 0) {
    this.previewDiv.style.display = 'block'
    this.previewDiv.style.position = 'absolute'
    this.previewDiv.style.left = '0'
    this.previewDiv.style.right = '0'
    this.previewDiv.style.width = 'auto'
  } else {
    this.previewDiv.style.display = 'block'
    this.previewDiv.style.position = 'fixed'
    this.previewDiv.style.left = p.left + 'px'
    this.previewDiv.style.width = p.width + 'px'
    if (window.innerHeight - p.top < height * 2) {
      this.previewDiv.style.bottom = (window.innerHeight - p.top - height * 2) + 'px'
    } else {
      this.previewDiv.style.bottom = '0'
    }
  }


  this.map.invalidateSize()
}


Editor.prototype.initCategory = function () {
  if (this.layer) {
    this.layer.close()
    this.listDiv.innerHTML = ''
  }

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
      window.setTimeout(function () {
	textarea.editor.load()
      }, 0)
      return true
    }
  }
}
