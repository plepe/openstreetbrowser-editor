var jsonMultilineStrings = require('json-multiline-strings')
var CategoryBase = require('./CategoryBase')
const nameFieldDef = require('./nameFieldDef')
var OpenStreetBrowser = require('openstreetbrowser')

class CategoryOverpass extends CategoryBase {
  formDef (data, callback) {
    var ret = super.formDef(data)

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
        "desc": "<a href='https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL'>Overpass QL</a> query without \"out\" statement, e.g.:<br/><code>(node[amenity=bar];way[amenity=bar];)</code>"
      },
      "min": 1,
      "button:add_element": "Add query at different zoom level"
    }

    ret["lists"] = {
      "type": "hash",
      "order": true,
      "name": "lists",
      "desc": "Add sub lists (e.g. stops / routes of public transportation)",
      "key_def": {
        "type": "text",
        "name": "id",
        "desc": "ID of the list"
      },
      "def": {
        "type": "form",
        "def": {
          "prefix": {
            "type": "text",
            "name": "prefix",
            "desc": "Will be used as prefix for further fields (e.g. 'listFoo' => 'listFooExclude')",
          },
          // find all used languages in all lists
          "name": data.lists && Object.keys(data.lists).length ? nameFieldDef(Object.assign.apply(this, Object.values(JSON.parse(JSON.stringify(data.lists))).map(x => x.name))) : null
        }
      }
    }

    var styleDef = {
      "type": "form_chooser",
      "order": false,
      "result_keep_order": true,
      "def": {
        "stroke": {
          "type": "textarea",
          "name": "stroke",
          "desc": "(boolean) Whether to draw stroke along the path. Set it to empty string or values '0', 'false' to disable borders on polygons or circles.",
          "empty_value": "",
          "default": "1"
        },
        "width": {
          "type": "textarea",
          "name": "width",
          "desc": "(number) Stroke width in pixels",
          "empty_value": "",
          "default": "3"
        },
        "color": {
          "type": "textarea",
          "name": "color",
          "desc": "(color) Stroke color, e.g. '#3388ff' or 'red'",
          "empty_value": "",
          "default": "#3388ff"
        },
        "offset": {
          "type": "textarea",
          "name": "offset",
          "desc": "(number) Offset polylines to left (negative value) or right (positive value) in pixels.",
          "empty_value": "",
          "default": "0"
        },
        "opacity": {
          "type": "textarea",
          "name": "opacity",
          "desc": "(number) Stroke opacity: 0..transparent, 1..fully opaque.",
          "empty_value": "",
          "default": "1"
        },
        "lineCap": {
          "type": "textarea",
          "name": "lineCap",
          "desc": "(string) A string that defines shape to be used at the end of the stroke: 'butt', 'round' or 'square'.",
          "empty_value": "",
          "default": "round"
        },
        "lineJoin": {
          "type": "textarea",
          "name": "lineJoin",
          "desc": "(string) A string that defines shape to be used at the corners of the stroke: 'miter', 'round', 'bevel'.",
          "empty_value": "",
          "default": "round"
        },
        "dashArray": {
          "type": "textarea",
          "name": "dashArray",
          "desc": "(string) A string that defines the stroke dash pattern. It's a list of comma and/or white space separated numbers that specify the lengths of alternating dashes and gaps, e.g. '2,2' or '10,5,5,10'.",
          "empty_value": ""
        },
        "dashOffset": {
          "type": "textarea",
          "name": "dashOffset",
          "desc": "(number) Defines the distance into the dash pattern to start the dash.",
          "empty_value": ""
        },
        "fill": {
          "type": "textarea",
          "name": "fill",
          "desc": "(boolean) Whether to fill the path with color. Set it to empty string or values '0', 'false' to disable filling on polygons or circles.",
          "empty_value": ""
        },
        "fillColor": {
          "type": "textarea",
          "name": "fillColor",
          "desc": "(color) Fill color. Defaults to the value of the color option.",
          "default": "#3388ff",
          "empty_value": ""
        },
        "fillOpacity": {
          "type": "textarea",
          "name": "fillOpacity",
          "desc": "Fill opacity: 0..transparent, 1..fully opaque.",
          "default": "0.2",
          "empty_value": ""
        },
        "fillRule": {
          "type": "textarea",
          "name": "fillRule",
          "desc": "(string) A string that defines how the inside of a shape is determined: 'evenodd', 'nonzero'.",
          "default": "evenodd",
          "empty_value": ""
        },
        "smoothFactor": {
          "type": "textarea",
          "name": "smoothFactor",
          "desc": "(number) How much to simplify the polyline on each zoom level.",
          "default": "1.0",
          "empty_value": ""
        },
        "nodeFeature": {
          "type": "textarea",
          "name": "nodeFeature",
          "desc": "(string) What feature type to use for nodes: 'Marker', 'Circle' or 'CircleMarker'.",
          "default": "CircleMarker",
          "empty_value": ""
        },
        "radius": {
          "type": "textarea",
          "name": "radius",
          "desc": "(number) Radius of the circle. For features of type 'Circle' in meters, for type 'CircleMarker' in pixels.",
          "default": "10",
          "empty_value": ""
        },
        "noClip": {
          "type": "textarea",
          "name": "noClip",
          "desc": "(boolean) Disable polyline clipping.",
          "default": "0",
          "empty_value": ""
        },
        "text": {
          "type": "textarea",
          "name": "text",
          "desc": "(string) Text along lines. See <a href=\"https://github.com/makinacorpus/Leaflet.TextPath\">documentation</a> for details",
          "default": "",
          "empty_value": ""
        },
        "textRepeat": {
          "type": "textarea",
          "name": "textRepeat",
          "desc": "(boolean) Specifies if the text should be repeated along the polyline.",
          "default": "1",
          "empty_value": ""
        },
        "textOffset": {
          "type": "textarea",
          "name": "textOffset",
          "desc": "(number) Set an offset to position text relative to the polyline.",
          "default": "0",
          "empty_value": ""
        },
        "textBelow": {
          "type": "textarea",
          "name": "textBelow",
          "desc": "(boolean) Show text below the path.",
          "default": "",
          "empty_value": ""
        },
        "textOrientation": {
          "type": "textarea",
          "name": "textOrientation",
          "desc": "(number/string) Rotate text. Either a value in degrees or \"flip\" or \"perpendicular\"",
          "default": "0",
          "empty_value": ""
        },
        "textLetterSpacing": {
          "type": "textarea",
          "name": "textLetterSpacing",
          "desc": "(number/number with unit) controls spacing between text characters",
          "default": "",
          "empty_value": ""
        },
        "textFontSize": {
          "type": "textarea",
          "name": "textFontSize",
          "default": "12",
          "empty_value": ""
        },
        "textFontFamily": {
          "type": "textarea",
          "name": "textFontFamily",
          "default": "Arial",
          "empty_value": ""
        },
        "textFill": {
          "type": "textarea",
          "name": "textFill",
          "desc": "(color) Text color.",
          "default": "#000000",
          "empty_value": ""
        },
        "textFillOpacity": {
          "type": "textarea",
          "name": "textFillOpacity",
          "desc": "(number) Font opacity: 0..transparent, 1..fully opaque.",
          "default": "1",
          "empty_value": ""
        }
      },
    }

    ret["feature"] = {
      "type": "form_chooser",
      "order": false,
      "name": "Feature evaluation",
      "desc": "This codes will be evaluated for each map feature. You can set different styles, texts, etc. All sub values will be evaluated via <a href=\"https://github.com/plepe/OpenStreetBrowser/blob/master/doc/TwigJS.md\">TwigJS markup</a>. Fields where HTML code is expected may include <a href=\"https://github.com/plepe/OpenStreetBrowser/blob/master/doc/Icons.md\">Icons</a>.",
      "result_keep_order": true,
      "include_data": "not_null",
      "button:add_element": "Add feature code",
      "def": {
        "pre": {
          "type": "textarea",
          "name": "pre",
          "desc": "This code will be executed before any other code. You might want to set variables, e.g.: <code>{% set foo = tags.amenity %}</code>",
          "empty_value": ""
        },
        "title": {
          "type": "textarea",
          "name": "title",
          "desc": "(string) Title to use in the popup and the list",
          "default": "{{ localizedTag(tags, 'name') |default(localizedTag(tags, 'operator')) | default(localizedTag(tags, 'ref')) | default(trans('unnamed')) }}",
          "empty_value": ""
        },
        "description": {
          "type": "textarea",
          "name": "description",
          "desc": "(string) Description which will be shown in the list next to the title and in the popup (if no <tt>popupDescription</tt> is set).",
          "default": "",
          "empty_value": ""
        },
        "popupDescription": {
          "type": "textarea",
          "name": "popupDescription",
          "desc": "(string) Description which will be shown in the popup.",
          "empty_value": ""
        },
        "body": {
          "type": "textarea",
          "name": "body",
          "desc": "(string) Longer text which will be shown in the popup and in the detailed view.",
          "empty_value": ""
        },
        "markerSign": {
          "type": "textarea",
          "name": "markerSign",
          "desc": "(string) HTML Text which will be shown in the marker (if there is a marker). You may use <a href='https://github.com/plepe/OpenStreetBrowser/blob/master/doc/Icons.md'>included icons</a>.",
          "empty_value": ""
        },
        "listMarkerSign": {
          "type": "textarea",
          "name": "listMarkerSign",
          "desc": "(string) HTML Text which will be shown in the marker in the list. You may use <a href='https://github.com/plepe/OpenStreetBrowser/blob/master/doc/Icons.md'>included icons</a>.",
          "empty_value": ""
        },
        "markerSymbol": {
          "type": "textarea",
          "name": "markerSymbol",
          "desc": "(string) An DIV or SVG which will be shown as marker on the centroid of the map feature. The element should have <tt>width</tt>, <tt>height</tt> attributes. Specify <tt>anchorX</tt> and <tt>anchorY</tt> attributes for positioning, otherwise it will be centered. Specify <tt>signAnchorX</tt> and <tt>signAnchorY</tt> to specify where the sign should be located (centered around this point), default: at anchor. Specify <tt>popupAnchorX</tt> and <tt>popupAnchorY</tt> to specify where the popup should open, default: at anchor.<br/>You can use the markerXYZ functions to create an SVG, e.g. <tt>{{ markerPointer({})|raw }}</tt>.",
          "default": "{{ markerPointer({})|raw }}",
          "empty_value": ""
        },
        "listMarkerSymbol": {
          "type": "textarea",
          "name": "listMarkerSymbol",
          "desc": "(string) A symbol which will be shown in the list. Either a SVG similar to 'markerSymbol' or the strings 'line' or 'polygon' (show a line or a rectangle with the definition from the styles).",
          "default": "{{ markerCircle({})|raw }}",
          "empty_value": ""
        },
        "listExclude": {
          "type": "textarea",
          "name": "listExclude",
          "desc": "(boolean) If true, object will not be shown in the list.",
          "default": "false",
          "empty_value": ""
        },
        "listTitle": {
          "type": "textarea",
          "name": "listTitle",
          "desc": "(string) Override the title for the list.",
          "default": "{{ localizedTag(tags, 'name') |default(localizedTag(tags, 'operator')) | default(localizedTag(tags, 'ref')) | default(trans('unnamed')) }}",
          "empty_value": ""
        },
        "listDescription": {
          "type": "textarea",
          "name": "listDescription",
          "desc": "(string) Override the description for the list.",
          "default": "",
          "empty_value": ""
        },
        "priority": {
          "type": "textarea",
          "name": "priority",
          "desc": "(number) Order of map features in the list. Map features with lower value will be shown first.",
          "empty_value": ""
        },
        "styles": {
          "type": "textarea",
          "name": "styles",
          "desc": "(string) Comma-separated list of style-ids which should be shown for this particular map features. Defaults to all styles (except 'hover').",
          "default": "default",
          "empty_value": ""
        },
        "preferredZoom": {
          "type": "textarea",
          "name": "preferredZoom",
          "desc": "At which max. zoom level will the map zoom when showing details",
          "default": "16",
          "empty_value": ""
        }
      }
    }

    ret["feature"]["def"]["style"] = JSON.parse(JSON.stringify(styleDef))
    ret["feature"]["def"]["style"]["name"] = "style"

    var l = [ "casing", "highlight", "left", "right", "hover", "selected" ]
    for (var i in l) {
      var k = l[i]
      ret["feature"]["def"]["style:" + k] = JSON.parse(JSON.stringify(styleDef))
      ret["feature"]["def"]["style:" + k]["name"] = "style:" + k
    }

    if (data.feature) {
      for (var k in data.feature) {
        let m = k.match(/^style:(.*)$/)
        if (m && !(k in ret.feature.def)) {
          ret["feature"]["def"]["style:" + m[1]] = JSON.parse(JSON.stringify(styleDef))
          ret["feature"]["def"]["style:" + m[1]]["name"] = k
        }
      }
    }

    ret["feature"]["def"]["style:hover"]["desc"] = "Will be shown when hovering over object in list."
    ret["feature"]["def"]["style:hover"]["color"] = "black"
    ret["feature"]["def"]["style:hover"]["radius"] = "12"

    ret["feature"]["def"]["style:selected"]["desc"] = "Will be shown when popup is shown and/or details."
    ret["feature"]["def"]["style:hover"]["color"] = "#3f3f3f"
    ret["feature"]["def"]["style:hover"]["radius"] = "12"

    if (data.lists) {
      Object.keys(data.lists).forEach(listId => {
        let prefix = data.lists[listId].prefix

        ret["feature"]["def"][prefix + "MarkerSign"] = {
          "type": "textarea",
          "name": prefix + "MarkerSign",
          "desc": "(string) HTML Text which will be shown in the marker in the list \"" + listId + "\". You may use <a href='https://github.com/plepe/OpenStreetBrowser/blob/master/doc/Icons.md'>included icons</a>.",
          "default": ""
        }

        ret["feature"]["def"][prefix + "MarkerSymbol"] = {
          "type": "textarea",
          "name": prefix + "MarkerSymbol",
          "desc": "(string) A symbol which will be shown in the list \"" + listId + "\". Either a SVG similar to 'markerSymbol' or the strings 'line' or 'polygon' (show a line or a rectangle with the definition from the styles).",
          "default": "{{ markerCircle({})|raw }}"
        }
        ret["feature"]["def"][prefix + "Exclude"] = {
          "type": "textarea",
          "name": prefix + "Exclude",
          "desc": "(boolean) If true, object will not be shown in the list \"" + listId + "\".",
          "default": "false"
        }
        ret["feature"]["def"][prefix + "Title"] = {
          "type": "textarea",
          "name": prefix + "Title",
          "desc": "(string) Override the title for the list \"" + listId + "\".",
          "default": "{{ localizedTag(tags, 'name') |default(localizedTag(tags, 'operator')) | default(localizedTag(tags, 'ref')) | default(trans('unnamed')) }}",
          "empty_value": ""
        }
        ret["feature"]["def"][prefix + "Description"] = {
          "type": "textarea",
          "name": prefix + "Description",
          "desc": "(string) Override the description for the list \"" + listId + "\"",
          "default": "",
          "empty_value": ""
        }
      })
    }

    ret["members"] = {
      "type": "boolean",
      "name": "members",
      "desc": "If set to true, relations won't be loaded with their full geometry, but only members within the bbox. Also, the members can be styled via \"memberFeature\""
    }

    ret["memberFeature"] = JSON.parse(JSON.stringify(ret["feature"]))
    ret["memberFeature"]["name"] = "memberFeature"
    ret["memberFeature"]["desc"] = "This codes will be evaluated for each member of a relation, if \"members\" is set to true. You can set different styles, texts, etc. All sub values will be evaluated via <a href=\"https://github.com/plepe/OpenStreetBrowser/blob/master/doc/TwigJS.md\">TwigJS markup</a>. Fields where HTML code is expected may include <a href=\"https://github.com/plepe/OpenStreetBrowser/blob/master/doc/Icons.md\">Icons</a>."

    if (data.memberFeature) {
      for (var k in data.memberFeature) {
        let m = k.match(/^style:(.*)$/)
        if (m && !(k in ret.memberFeature.def)) {
          ret["memberFeature"]["def"]["style:" + m[1]] = JSON.parse(JSON.stringify(styleDef))
          ret["memberFeature"]["def"]["style:" + m[1]]["name"] = k
        }
      }
    }

    ret["info"] = {
      "type": "textarea",
      "name": "Info (e.g. map key)",
      "desc": "You can use <a href=\"https://github.com/plepe/OpenStreetBrowser/blob/master/doc/TwigJS.md\">TwigJS markup</a> in this field. You may use <a href=\"https://github.com/plepe/OpenStreetBrowser/blob/master/doc/Icons.md\">Icons</a>.",
      "include_data": "not_null"
    }

    ret["const"] = {
      "type": "json",
      "name": "const",
      "desc": "Constants which can be accessed via <code>{{ const }}<code> in twig templates",
      "include_data": "not_null"
    }

    callback(null, ret)
  }

  newData (callback) {
    callback(null, {
      "name": {
        "en": ""
      },
      "query": {
        "16": ""
      }
    })
  }

  postLoad (data, callback) {
    var result = jsonMultilineStrings.join(data, { exclude: [ [ 'const' ] ] })
    callback(null, result)
  }

  preSave (data) {
    var ret = {
      "type": "overpass"
    }

    for (var k in data) {
      ret[k] = data[k]
    }

    return jsonMultilineStrings.split(ret, { exclude: [ [ 'const' ] ] })
  }

  hasMap () {
    return true
  }

  getLayer ( data) {
    return new OpenStreetBrowser.CategoryOverpass(this.options, data)
  }
}

module.exports = CategoryOverpass
