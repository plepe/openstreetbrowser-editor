module.exports = function nameFieldDef (data) {
  let ret = {
    "type": "form_chooser",
    "name": "Names",
    "order": false,
    "include_data": "not_null",
    "button:add_element": "Add translated name",
    "def": {}
  }

  for (var k in language_list) {
    ret.def[k] = {
      "type": "text",
      "name": lang('lang:' + k) + ' (' + lang('lang_native:' + k) + ')',
      "include_data": "not_null",
    }
  }

  for (var k in data) {
    if (!(k in language_list)) {
      ret.def[k] = {
        "type": "text",
        "name": 'Language "' + k + '"',
        "include_data": "not_null",
      }
    }
  }

  return ret
}
