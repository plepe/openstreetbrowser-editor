var jsonMultilineStrings = require('json-multiline-strings')
var CategoryBase = require('./CategoryBase')

function formDef () {
  var ret = CategoryBase.formDef()

  ret["query"] = {
    "type": "hash",
    "order": false,
    "name": "Queries",
    "desc": "",
    "key_def": {
      "type": "integer",
      "name": "minZoom",
      "desc": "When several queries are defined, the queries are used from minZoom level to the next higher zoom level-1"
    },
    "def": {
      "type": "textarea",
      "name": "Query",
      "desc": "Overpass QL query without \"out\" statement, e.g.:<br/><code>(node[amenity=bar];way[amenity=bar];)</code>"
    },
    "min": 1,
    "button:add_element": "Add query at different zoom level"
  }

  var styleDef = {
    "type": "form_chooser",
    "order": false,
    "result_keep_order": true,
    "def": {
      "stroke": {
	"type": "textarea",
	"name": "stroke",
	"default": "1"
      },
      "weight": {
	"type": "textarea",
	"name": "weight",
	"default": "3"
      },
      "color": {
	"type": "textarea",
	"name": "color",
	"default": "#3388ff"
      },
      "offset": {
	"type": "textarea",
	"name": "offset",
	"default": "0"
      },
      "opacity": {
	"type": "textarea",
	"name": "opacity",
	"default": "1"
      },
      "lineCap": {
	"type": "textarea",
	"name": "lineCap",
	"default": "round"
      },
      "lineJoin": {
	"type": "textarea",
	"name": "lineJoin",
	"default": "round"
      },
      "dashArray": {
	"type": "textarea",
	"name": "dashArray"
      },
      "dashOffset": {
	"type": "textarea",
	"name": "dashOffset"
      },
      "fill": {
	"type": "textarea",
	"name": "fill"
      },
      "fillColor": {
	"type": "textarea",
	"name": "fillColor",
	"default": "#3388ff"
      },
      "fillOpacity": {
	"type": "textarea",
	"name": "fillOpacity",
	"default": "0.2"
      },
      "fillRule": {
	"type": "textarea",
	"name": "fillRule"
      },
      "smoothFactor": {
	"type": "textarea",
	"name": "smoothFactor",
	"default": "1.0"
      },
      "nodeFeature": {
	"type": "textarea",
	"name": "nodeFeature",
	"default": "CircleMarker"
      },
      "radius": {
	"type": "textarea",
	"name": "radius",
	"default": "10"
      },
      "noClip": {
	"type": "textarea",
	"name": "noClip",
	"default": "1"
      },
      "text": {
	"type": "textarea",
	"name": "text",
	"default": "",
	"desc": "Text along lines. See <a href=\"https://github.com/makinacorpus/Leaflet.TextPath\">documentation</a> for details"
      },
      "textRepeat": {
	"type": "textarea",
	"name": "textRepeat",
	"default": "1"
      },
      "textOffset": {
	"type": "textarea",
	"name": "textOffset",
	"default": "0"
      },
      "textBelow": {
	"type": "textarea",
	"name": "textBelow",
	"default": ""
      },
      "textOrientation": {
	"type": "textarea",
	"name": "textOrientation",
	"default": "Either a value in degrees or \"flip\" or \"perpendicular\""
      },
      "textLetterSpacing": {
	"type": "textarea",
	"name": "textLetterSpacing",
	"default": ""
      },
      "textFontSize": {
	"type": "textarea",
	"name": "textFontSize",
	"default": "12"
      },
      "textFontFamily": {
	"type": "textarea",
	"name": "textFontFamily",
	"default": "Arial"
      },
      "textFill": {
	"type": "textarea",
	"name": "textFill",
	"default": "#000000"
      },
      "textFillOpacity": {
	"type": "textarea",
	"name": "textFillOpacity",
	"default": "#000000"
      }
    },
  }

  ret["feature"] = {
    "type": "form_chooser",
    "order": false,
    "name": "Feature evaluation",
    "desc": "This codes will be evaluated for each map feature. You can set different styles, texts, etc. All sub values will be evaluated via the <a href=\"https://github.com/twigjs/twig.js\">TwigJS language</a>.",
    "result_keep_order": true,
    "button:add_element": "Add feature code",
    "def": {
      "pre": {
	"type": "textarea",
	"name": "pre",
	"desc": "This code will be executed before any other code. You might want to set variables, e.g.: <code>{% set foo = tags.amenity %}</code>"
      },
      "title": {
	"type": "textarea",
	"name": "title",
	"default": "{{ localizedTag(tags, 'name') |default(localizedTag(tags, 'operator')) | default(localizedTag(tags, 'ref')) | default(trans('unnamed')) }}"
      },
      "description": {
	"type": "textarea",
	"name": "description"
      },
      "popupDescription": {
	"type": "textarea",
	"name": "popupDescription"
      },
      "body": {
	"type": "textarea",
	"name": "body"
      },
      "markerSign": {
	"type": "textarea",
	"name": "markerSign"
      },
      "markerSymbol": {
	"type": "textarea",
	"name": "markerSymbol",
	"default": "{{ markerPointer({})|raw }}"
      },
      "listMarkerSymbol": {
	"type": "textarea",
	"name": "listMarkerSymbol",
	"default": "{{ markerCircle({})|raw }}"
      },
      "priority": {
	"type": "textarea",
	"name": "priority"
      },
      "styles": {
	"type": "textarea",
	"name": "styles"
      }
    }
  }

  ret["feature"]["def"]["style"] = JSON.parse(JSON.stringify(styleDef))
  ret["feature"]["def"]["style"]["name"] = "style"

  var l = [ "casing", "highlight", "left", "right" ]
  for (var i in l) {
    var k = l[i]
    ret["feature"]["def"]["style:" + k] = JSON.parse(JSON.stringify(styleDef))
    ret["feature"]["def"]["style:" + k]["name"] = "style:" + k
  }

  ret["info"] = {
    "type": "textarea",
    "name": "Info (e.g. map key)",
    "desc": "You can use TwigJS markup in this field."
  }

  ret["const"] = {
    "type": "json",
    "name": "const",
    "desc": "Constants which can be accessed via <code>{{ const }}<code> in twig templates"
  }

  return ret
}

function newData () {
  return {
    "name": {
      "en": ""
    },
    "query": {
      "16": ""
    }
  }
}

function postLoad (data) {
  return jsonMultilineStrings.join(data, { exclude: [ [ 'const' ] ] })
}

function preSave (data) {
  var ret = {
    "type": "overpass"
  }

  for (var k in data) {
    ret[k] = data[k]
  }

  return jsonMultilineStrings.split(ret, { exclude: [ [ 'const' ] ] })
}

module.exports = {
  formDef: formDef,
  newData: newData,
  postLoad: postLoad,
  preSave: preSave
}
