<?php
class TypeOverpass extends TypeCategory {
  function formDef () {
    $form_def = parent::formDef();

    $style_form_def = array(
      'type' => 'form_chooser',
      'order' => false,
      'result_keep_order' => true,
      'def' => array(
        'stroke' => array(
          'type' => 'textarea',
          'name' => 'stroke',
          'default' => '1',
        ),
        'weight' => array(
          'type' => 'textarea',
          'name' => 'weight',
          'default' => '3',
        ),
        'color' => array(
          'type' => 'textarea',
          'name' => 'color',
          'default' => '#3388ff',
        ),
        'offset' => array(
          'type' => 'textarea',
          'name' => 'offset',
          'default' => '0',
        ),
        'opacity' => array(
          'type' => 'textarea',
          'name' => 'opacity',
          'default' => '1'
        ),
        'lineCap' => array(
          'type' => 'textarea',
          'name' => 'lineCap',
          'default' => 'round',
        ),
        'lineJoin' => array(
          'type' => 'textarea',
          'name' => 'lineJoin',
          'default' => 'round',
        ),
        'dashArray' => array(
          'type' => 'textarea',
          'name' => 'dashArray',
        ),
        'dashOffset' => array(
          'type' => 'textarea',
          'name' => 'dashOffset',
        ),
        'fill' => array(
          'type' => 'textarea',
          'name' => 'fill',
        ),
        'fillColor' => array(
          'type' => 'textarea',
          'name' => 'fillColor',
          'default' => '#3388ff',
        ),
        'fillOpacity' => array(
          'type' => 'textarea',
          'name' => 'fillOpacity',
          'default' => '0.2',
        ),
        'fillRule' => array(
          'type' => 'textarea',
          'name' => 'fillRule',
        ),
        'smoothFactor' => array(
          'type' => 'textarea',
          'name' => 'smoothFactor',
          'default' => '1.0',
        ),
        'nodeFeature' => array(
          'type' => 'textarea',
          'name' => 'nodeFeature',
          'default' => 'CircleMarker',
        ),
        'radius' => array(
          'type' => 'textarea',
          'name' => 'radius',
          'default' => '10',
        ),
        'noClip' => array(
          'type' => 'textarea',
          'name' => 'noClip',
          'default' => '1',
        ),
        'text' => array(
          'type' => 'textarea',
          'name' => 'text',
          'default' => '',
          'desc' => 'Text along lines. See <a href="https://github.com/makinacorpus/Leaflet.TextPath">documentation</a> for details',
        ),
        'textRepeat' => array(
          'type' => 'textarea',
          'name' => 'textRepeat',
          'default' => '1',
        ),
        'textOffset' => array(
          'type' => 'textarea',
          'name' => 'textOffset',
          'default' => '0',
        ),
        'textBelow' => array(
          'type' => 'textarea',
          'name' => 'textBelow',
          'default' => '',
        ),
        'textOrientation' => array(
          'type' => 'textarea',
          'name' => 'textOrientation',
          'default' => 'Either a value in degrees or "flip" or "perpendicular"',
        ),
        'textLetterSpacing' => array(
          'type' => 'textarea',
          'name' => 'textLetterSpacing',
          'default' => '',
        ),
        'textFontSize' => array(
          'type' => 'textarea',
          'name' => 'textFontSize',
          'default' => '12',
        ),
        'textFontFamily' => array(
          'type' => 'textarea',
          'name' => 'textFontFamily',
          'default' => 'Arial',
        ),
        'textFill' => array(
          'type' => 'textarea',
          'name' => 'textFill',
          'default' => '#000000',
        ),
        'textFillOpacity' => array(
          'type' => 'textarea',
          'name' => 'textFillOpacity',
          'default' => '#000000',
        ),
      ),
    );

    $form_def = array_merge($form_def, array(
      'query' => array(
        'type' => 'hash',
        'order' => false, // TODO: form could automatically order by key
        'name' => 'Queries',
        'desc' => '',
        'key_def' => array(
          'type' => 'integer',
          'name' => 'minZoom',
          'desc' => 'When several queries are defined, the queries are used from minZoom level to the next higher zoom level-1',
        ),
        'def' => array(
          'type' => 'textarea',
          'name' => 'Query',
          'desc' => 'Overpass QL query without "out" statement, e.g.:<br/><code>(node[amenity=bar];way[amenity=bar];)</code>',
        ),
        'min' => 1,
        'button:add_element' => 'Add query at different zoom level',
      ),
      'info' => array(
        'type' => 'textarea',
        'name' => 'Info (e.g. map key)',
        'desc' => 'You can use TwigJS markup in this field.',
      ),
      'feature' => array(
        'type' => 'form_chooser',
        'order' => false,
        'name' => 'Feature evaluation',
        'desc' => 'This codes will be evaluated for each map feature. You can set different styles, texts, etc. All sub values will be evaluated via the <a href="https://github.com/twigjs/twig.js">TwigJS language</a>.',
        'result_keep_order' => true,
        'def'  => array(
          'pre' => array(
            'type' => 'textarea',
            'name' => 'pre',
            'desc' => 'This code will be executed before any other code. You might want to set variables, e.g.: <code>{% set foo = tags.amenity %}</code>',
          ),
          'title' => array(
            'type' => 'textarea',
            'name' => 'title',
            'default' => "{{ localizedTag(tags, 'name') |default(localizedTag(tags, 'operator')) | default(localizedTag(tags, 'ref')) | default(trans('unnamed')) }}",
          ),
          'description' => array(
            'type' => 'textarea',
            'name' => 'description',
          ),
          'popupDescription' => array(
            'type' => 'textarea',
            'name' => 'popupDescription',
          ),
          'body' => array(
            'type' => 'textarea',
            'name' => 'body',
          ),
          'markerSign' => array(
            'type' => 'textarea',
            'name' => 'markerSign',
          ),
          'markerSymbol' => array(
            'type' => 'textarea',
            'name' => 'markerSymbol',
            'default' => '{{ markerPointer({})|raw }}',
          ),
          'listMarkerSymbol' => array(
            'type' => 'textarea',
            'name' => 'listMarkerSymbol',
            'default' => '{{ markerCircle({})|raw }}',
          ),
          'priority' => array(
            'type' => 'textarea',
            'name' => 'priority',
          ),
          'styles' => array(
            'type' => 'textarea',
            'name' => 'styles',
          ),
        ),
        'button:add_element' => 'Add feature code',
      ),
      'const' => array(
        'type' => 'json',
        'name' => 'const',
        'desc' => 'Constants which can be accessed via <code>{{ const }}<code> in twig templates',
      ),
    ));

    foreach (array('style', 'style:casing', 'style:highlight', 'style:left', 'style:right') as $k) {
      $form_def['feature']['def'][$k] = $style_form_def;
      $form_def['feature']['def'][$k]['name'] = $k;
    }

    return $form_def;
  }

  function postLoad (&$data) {
    parent::postLoad($data);

    unset($data['type']);

    if (is_string($data['query'])) {
      $data['query'] = array($data['minZoom'] => $data['query']);
    }

    if (array_key_exists('minZoom', $data)) {
      unset($data['minZoom']);
    }
  }

  function preSave (&$data) {
    parent::preSave($data);
    $data = array_merge(array('type' => 'overpass'), $data);
  }

  static function newData () {
    return array(
      'name' => array('en' => ''),
      'query' => array('14' => ''),
    );
  }
}

register_type('overpass', 'TypeOverpass');
