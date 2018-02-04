const async = require('async')

function pathToUrl (pathDesc) {
  var ret = []

  for (var i in pathDesc) {
    ret.push(encodeURIComponent(i) + '=' + encodeURIComponent(pathDesc[i]))
  }

  return '?' + ret.join('&')
}

class Translation {
  constructor (options) {
    this.options = options
  }

  loadTemplate (file, callback) {
    function reqListener () {
      if (req.status === 200) {
        callback(null, JSON.parse(this.responseText))
      } else {
        callback(this.statusText, null)
      }
    }

    var pathDesc = JSON.parse(JSON.stringify(this.options.path))
    pathDesc.file = file + '.json'

    var req = new XMLHttpRequest()
    req.addEventListener('load', reqListener)
    req.open('GET', 'asset.php' + pathToUrl(pathDesc))
    req.send()
  }

  formDef (data, callback) {
    async.parallel(
      [
        function (callback) {
          this.loadTemplate('template', function (err, result) {
            if (err) {
              this.template = null
              return callback(null)
            }

            this.template = result
            callback()
          }.bind(this))
        }.bind(this),
        function (callback) {
          this.loadTemplate('en', function (err, result) {
            this.otherLanguage = result
            callback(err)
          }.bind(this))
        }.bind(this)
      ],
      this._formDef2.bind(this, data, callback)
    )
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

  element (k, templateStr, otherLangStr) {
    return {
      type: 'form_chooser',
      order: false,
      removeable: false,
      name: this.getString(k, otherLangStr),
      desc: k + '<br>' + (templateStr ? templateStr.description || '' : ''),
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

  _formDef2 (data, callback, err) {
    if (this.template === null) {
      this.template = this.otherLanguage
    }

    var ret = {}

    for (var k in this.template) {
       ret[k] = this.element(k, this.template[k], this.otherLanguage[k])
    }

    for (var k in data) {
      if (!(k in ret)) {
        ret[k] = this.element(k, data[k], this.otherLanguage[k])
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

  updateOtherLanguage (lang, form) {
    this.loadTemplate(lang, function (err, result) {
      if (result) {
        this.otherLanguage = result
      } else {
        alert(err)
        this.otherLanguage = {}
      }

      for (var k in form.element.elements) {
        var row = form.element.elements[k].tr
        var td = row.cells[0]
        var el = this.element(k, this.template[k], this.otherLanguage[k])

        var f = td.getElementsByClassName('form_name')
        if (f.length) {
          f[0].innerHTML = el.name
        } else {
          td.innerHTML = el.name
        }
      }

    }.bind(this))
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

  setForm (form) {
    var thead = document.createElement('thead')
    form.table.insertBefore(thead, form.table.firstChild)
    thead.innerHTML = '<tr><th>Compare language </th><th>Translation</th>\n'

    if (typeof languages !== undefined) {
      var select = document.createElement('select')
      for (var i in languages) {
        var option = document.createElement('option')
        option.value = languages[i]
        option.innerHTML = languages[i] + ': ' + lang('lang_native:' + languages[i]) + ' (' + lang('lang:' + languages[i]) + ')'
        option.selected = languages[i] === 'en'
        select.appendChild(option)
      }
      thead.firstChild.firstChild.appendChild(select)

      select.onchange = function () {
        this.updateOtherLanguage(select.value, form)
      }.bind(this)
    }
  }
}

module.exports = Translation
