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
    desc: template.desc || null,
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

  callback(null, ret)
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

module.exports = {
  formDef: formDef,
  newData: newData,
  postLoad: postLoad,
  preSave: preSave,
  hasMap: x => false
}
