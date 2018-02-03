class Translation {
  loadTemplate (file, callback) {
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

  formDef (data, callback) {
    this.loadTemplate(null, this._formDef2.bind(this, data, callback))
  }

  getString (k, langStr) {
    if (!langStr) {
      return k
    }

    if (typeof langStr === 'string') {
      return langStr
    } else if ('message' in langStr) {
      return langStr.message
    }

    return k
  }

  element (k, template) {
    return {
      type: 'form_chooser',
      order: false,
      removeable: false,
      name: this.getString(k, template),
      desc: k + '<br>' + (template.description || ''),
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

  _formDef2 (data, callback, err, template) {
    var ret = {}

    for (var k in template) {
       ret[k] = this.element(k, template[k])
    }

    for (var k in data) {
      if (!(k in ret)) {
        ret[k] = this.element(k, data[k])
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

  postLoad (data, callback) {
    for (var k in data) {
      if (data[k] === null) {
        data[k] = {}
      } else if (typeof data[k] === 'string') {
        data[k] = { message: data[k] }
      }
    }

    callback(null, data)
  }

  preSave (data) {
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

  newData (callback) {
    callback({})
  }

  hasMap () {
    return false
  }

  getLayer () {
    return null
  }
}

module.exports = Translation
