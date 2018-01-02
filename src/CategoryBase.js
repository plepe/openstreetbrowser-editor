function formDef () {
  var ret = {
    "name": {
      "type": "form_chooser",
      "name": "Names",
      "order": false,
      "include_data": "not_null",
      "button:add_element": "Add translated name",
      "def": {}
    }
  }

  for (var k in languages) {
    var l = languages[k]
    ret.name.def[l] = {
      "type": "text",
      "name": lang('lang:' + l) + ' (' + lang('lang_native:' + l) + ')'
    }
  }

  return ret
}

module.exports = {
  formDef: formDef
}
