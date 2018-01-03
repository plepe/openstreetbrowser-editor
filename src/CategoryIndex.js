var jsonMultilineStrings = require('json-multiline-strings')
var CategoryBase = require('./CategoryBase')

function formDef (data) {
  var ret = CategoryBase.formDef(data)

  var x = {
    "type": "array",
    "name": "subCategories",
    "index_type": "array",
    "def": {
      "type": "form",
      "def": {
	"id": {
	  "type": "text",
	  "name": "id"
	},
	"type": {
	  "type": "select",
	  "name": "type",
	  "values": {
	    "index": "Inline",
	  },
	  "placeholder": "Separate file",
	  "include_data": "not_null"
	},
	"name": JSON.parse(JSON.stringify(ret.name))
      }
    },
    "include_data": "not_null"
  }

  x.def.def.name.show_depend = [ "check", "type", [ "is", "index" ]]
  ret.subCategories = x

  x = JSON.parse(JSON.stringify(x))
  x.show_depend = [ "check", "type", [ "is", "index" ]]
  ret.subCategories.def.def.subCategories = x
  ret.subCategories.def.def.subCategories.def.def.subCategories = JSON.parse(JSON.stringify(x))

  return ret
}

function newData () {
  return {
    "name": {
      "en": ""
    }
  }
}

function postLoad (data) {
  return data
}

function preSave (data) {
  var ret = {
    "type": "index"
  }

  for (var k in data) {
    ret[k] = data[k]
  }

  return ret
}

function hasMap () {
  return false
}

module.exports = {
  formDef: formDef,
  newData: newData,
  postLoad: postLoad,
  preSave: preSave,
  hasMap: hasMap
}
