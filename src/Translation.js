function loadTemplate (file, callback) {
  function reqListener () {
    if (req.status === 200) {
      callback(null, JSON.parse(this.responseText))
    }
  }

  var req = new XMLHttpRequest()
  req.addEventListener('load', reqListener)
  req.open('GET', 'asset.php?repo=lang&file=en.json')
  req.send()
}

function formDef (data, callback) {
  loadTemplate(null, _formDef2.bind(this, data, callback))
}

function element (k, template) {
  return {
    type: 'form_chooser',
    order: false,
    removeable: false,
    name: k,
    desc: template.description || null,
    result_keep_order: true,
    'default': { message: '' },
    include_data: true,
    def: {
      message: {
        type: 'text',
        name: 'message'
      },
      '!=1': {
        type: 'text',
        name: '!=1',
        desc: 'Plural and 0'
      }
    }
  }
}

function _formDef2 (data, callback, err, template) {
  var ret = {}

  for (var k in template) {
     ret[k] = element(k, template[k])
  }

  for (var k in data) {
    if (!(k in ret)) {
      ret[k] = element(k, data[k])
    }
  }

  var ret2 = {}
  var keys = Object.keys(ret)
  keys.sort()

  for (var i = 0; i < keys.length; i++) {
    ret2[keys[i]] = ret[keys[i]]
  }

  callback(null, ret2)
}

function postLoad (data, callback) {
  for (var k in data) {
    if (data[k] === null) {
      data[k] = {}
    } else if (typeof data[k] === 'string') {
      data[k] = { message: data[k] }
    }
  }

  callback(null, data)
}

function preSave (data) {
  for (var k in data) {

    var keys = []
    for (var m in data[k]) {
      if (!data[k][m]) {
        delete data[k][m]
      } else {
        keys.push(m)
      }
    }

    if (keys.length === 0) {
      data[k] = null
    } else if (keys.length === 1 && keys[0] === 'message') {
      data[k] = data[k].message
    }
  }
  
  return data
}

function newData (callback) {
  callback({})
}

function setForm (form) {
  loadTemplate(null, function (err, data) {
    for (var k in form.element.elements) {
      var row = form.element.elements[k].tr

      var td = document.createElement('td')
      if (k in data) {
        if (typeof data[k] === 'string') {
          td.appendChild(document.createTextNode(data[k]))
        } else if ('message' in data[k]) {
          td.appendChild(document.createTextNode(data[k].message || ''))
        }
      }
      row.appendChild(td)
    }

    form.resize()
  })
}

module.exports = {
  formDef: formDef,
  newData: newData,
  postLoad: postLoad,
  preSave: preSave,
  hasMap: x => false,
  setForm: setForm
}
