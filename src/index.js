var OverpassFrontend = require('overpass-frontend')

var categoryTypes = {
  index: require('./CategoryIndex'),
  overpass: require('./CategoryOverpass'),
  translation: require('./Translation')
}

global.options = {}
global.overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')
global.currentPath = null

if (!global.config) {
  global.config = {}
}

function Editor (textarea) {
  this.textarea = textarea

  try {
    this.data = JSON.parse(this.textarea.value)
  }
  catch (err) {
    this.data = undefined
  }
}

Editor.prototype.getCategoryType = function (options) {
  return this.categoryType = new categoryTypes.translation(options)

  if (!this.data || !'type' in this.data) {
    return null
  }

  if (this.data.type in categoryTypes) {
    return this.categoryType = new categoryTypes[this.data.type](options)
  }

  return null
}

Editor.prototype.setCategoryType = function (typeId, options) {
  this.categoryType = new categoryTypes[typeId](options)
}

Editor.prototype.chooseType = function (callback) {
  this.textarea.style.display = 'none'

  this.parentDiv = document.createElement('div')
  this.parentDiv.setAttribute('style', 'position: relative; border: 1px solid black;')
  this.textarea.parentNode.insertBefore(this.parentDiv, this.textarea)

  this.parentDiv.appendChild(document.createTextNode(lang('editor:choose')))

  var ul = document.createElement('ul')
  this.parentDiv.appendChild(ul)

  var li = document.createElement('li')
  ul.appendChild(li)

  var a = document.createElement('a')
  a.href = '#'
  a.onclick = function () {
    this.parentDiv.parentNode.removeChild(this.parentDiv)
    callback(null)
    return false
  }.bind(this)
  a.appendChild(document.createTextNode(lang('editor:default')))
  li.appendChild(a)

  for (var k in categoryTypes) {
    var li = document.createElement('li')
    ul.appendChild(li)

    var a = document.createElement('a')
    a.href = '#'
    a.onclick = function (type) {
      this.parentDiv.parentNode.removeChild(this.parentDiv)
      callback(type)
      return false
    }.bind(this, k)
    a.appendChild(document.createTextNode(lang('editor:' + k)))
    li.appendChild(a)
  }
}

Editor.prototype.load = function () {
  this.categoryType.postLoad(this.data, this.load2.bind(this))
}

Editor.prototype.load2 = function (err, data) {
  this.data = data

  this.textarea.style.display = 'none'

  this.parentDiv = document.createElement('div')
  this.parentDiv.setAttribute('style', 'position: relative; border: 1px solid black;')
  this.textarea.parentNode.insertBefore(this.parentDiv, this.textarea)

  this.formDiv = document.createElement('div')
  this.parentDiv.appendChild(this.formDiv)

  if (this.categoryType.hasMap()) {
    this.formDiv.setAttribute('style', 'padding-bottom: 301px;')

    this.previewDiv = document.createElement('div')
    this.parentDiv.appendChild(this.previewDiv)
    this.previewDiv.setAttribute('style', 'background-color:#ddd; position: fixed; left: 0; width: 300px; bottom: 0%; height: 300px; border-top: 1px solid grey;')

    this.listDiv = document.createElement('div')
    this.listDiv.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 350px; height: 300px; border-right: 1px solid grey; border-bottom: 1px solid black; overflow: auto;')
    this.previewDiv.appendChild(this.listDiv)

    this.mapDiv = document.createElement('div')
    this.mapDiv.setAttribute('style', 'position: absolute; top: 0; left: 351px; bottom: 0; right: 0;')
    this.previewDiv.appendChild(this.mapDiv)
  }

  this.categoryType.formDef(this.data, this.loadForm.bind(this))

  if (this.categoryType.hasMap()) {
    this.map = L.map(this.mapDiv)
    global.map = this.map // TODO: remove this

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    if (global.config && global.config.defaultView) {
      this.map.setView({ lat: config.defaultView.lat, lng: config.defaultView.lon }, config.defaultView.zoom)
    } else {
      this.map.setView({ lat: 48.208, lng: 16.375 }, 16)
    }
  }

  this.initCategory()

  this.resize()

  window.addEventListener('scroll', this.resize.bind(this))
  window.addEventListener('resize', this.resize.bind(this))
}

Editor.prototype.loadForm = function (err, formDef) {
  this.form = new form(null, formDef, {
    type: 'form',
    order: false
  })
  this.form.show(this.formDiv)
  this.form.set_data(this.data)

  this.form.onchange = function () {
    this.data = this.form.get_data()

    var data = JSON.parse(JSON.stringify(this.data))
    data = JSON.stringify(this.categoryType.preSave(data), null, '    ')
    this.textarea.value = data + '\n'

    this.initCategory()
  }.bind(this)

  if ('setForm' in this.categoryType) {
    this.categoryType.setForm(this.form)
  }
}

Editor.prototype.resize = function () {
  if (!this.categoryType.hasMap()) {
    return
  }

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
    if (this.listDiv) {
      this.listDiv.innerHTML = ''
    }
  }

  this.layer = this.categoryType.getLayer(this.data)

  if (!this.layer) {
    return
  }

  this.layer.load(function () {
    if (this.categoryType.hasMap()) {
      this.layer.setMap(this.map)
    }

    this.layer.open()

    if (this.listDiv) {
      this.layer.setParentDom(this.listDiv)
    }
  }.bind(this))
}

Editor.prototype.reload = function () {
}

window.OpenStreetBrowserEditor = {
  set: function (textarea) {
    if (!textarea) {
      return false
    }

    if (textarea.length) {
      textarea = textarea[0]
    }

    if (typeof textarea.editor !== 'undefined') {
      if (textarea.editor === null) {
	return false
      } else {
	textarea.editor.reload()
	return true
      }
    }

    textarea.editor = new Editor(textarea)

    var options = {
      id: 'edit'
    }

    if (typeof repoId === 'undefined') {
      let link = location.href.split(/\//)
      let path = {}

      // Gitea edit link, e.g. http://openstreetbrowser.org/dev/user/repo/_edit/master/file.json -> 'user/repo'
      let linkp = link.indexOf('_edit')

      if (linkp === -1) {
        let linkp = link.indexOf('_new')

        if (linkp !== -1) {
          path.repo = link.slice(linkp - 2, linkp).join('/')
          path.branch = link[linkp + 1]
          path.dir = link.slice(linkp + 2).join('/')
          path.file = ''
          options.repoId = path.repo
        }
      } else {
        path.repo = link.slice(linkp - 2, linkp).join('/')
        path.branch = link[linkp + 1]
        path.dir = link.slice(linkp + 2, -1).join('/')
        path.file = link[link.length - 1]
        options.repoId = path.repo
      }

      options.path = path
    } else {
      options.repoId = repoId
      options.path = path
    }

    if (textarea.value === '') {
      var initState = {}
      call_hooks('init', initState)
      call_hooks_callback('init_callback', initState, function (initState) {
	textarea.editor.chooseType(function (typeId) {
	  if (typeId === null) {
            if (typeof setCodeMirror !== 'undefined') {
              setCodeMirror([textarea])
            } else {
              textarea.style.display = 'block'
            }
	  } else {
	    textarea.editor.setCategoryType(typeId, options)
            textarea.editor.categoryType.newData(function (err, data) {
              textarea.editor.data = data
            }.bind(this))
	    textarea.editor.load()
	  }
	})
      })

      return true
    }

    if (textarea.editor.getCategoryType(options)) {
      var initState = {}
      call_hooks('init', initState)
      call_hooks_callback('init_callback', initState, function (initState) {
	textarea.editor.load()
      })
      return true
    } else {
      textarea.editor = null
    }
  }
}
