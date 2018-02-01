function formDef (data) {
  var ret = {}

  for (var k in data) {
     ret[k] = {
       type: 'form_chooser',
       order: false,
       removeable: false,
       name: k,
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

  return ret
}

function postLoad (data) {
  for (var k in data) {
    if (data[k] === null) {
      data[k] = {}
    } else if (typeof data[k] === 'string') {
      data[k] = { message: data[k] }
    }
  }

  return data
}

function preSave (data) {
  for (var k in data) {
    var keys = Object.keys(data[k])
    if (keys.length === 0) {
      data[k] = null
    } else if (keys.length === 1 && keys[0] === 'message') {
      data[k] = data[k].message
    }
  }
  
  return data
}

module.exports = {
  formDef: formDef,
//  newData: newData,
  postLoad: postLoad,
  preSave: preSave,
  hasMap: x => false
}
