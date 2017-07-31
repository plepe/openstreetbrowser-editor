<?php
Header("content-type: text/html; charset=utf-8");
// create file .nocache to disable caching
require "conf.php"; /* load configuration */
include "modulekit/loader.php"; /* loads all php-includes */
call_hooks("init");

if (isset($_REQUEST['file']) && preg_match('/^[A-Za-z0-9_\-]+$/', $_REQUEST['file'])) {
  $file = "{$category_path}/{$_REQUEST['file']}.json";

  $style_form_def = array(
    'type' => 'form_chooser',
    'order' => false,
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
        'name' => '',
      ),
      'fillColor' => array(
        'type' => 'textarea',
        'name' => '#3388ff',
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
    ),
  );

  $form_def = array(
    'query' => array(
      'type' => 'hash',
      'order' => false, // TODO: form could automatically order by key
      'name' => 'Queries',
      'desc' => '',
      'key_def' => array(
        'type' => 'integer',
        'name' => 'minZoom',
        'desc' => 'When several queries are defined, the queries are used from minZoom level to (exclusive) the next higher zoom level',
      ),
      'def' => array(
        'type' => 'textarea',
        'name' => 'Query',
        'desc' => 'Overpass QL query without "out" statement, e.g. "(node[amenity=bar];way[amenity=bar];)"',
      ),
      'min' => 1,
      'button:add_element' => 'Add query',
    ),
    'feature' => array(
      'type' => 'form_chooser',
      'order' => false,
      'name' => 'Feature evaluation',
      'desc' => 'All sub values will be evaluated via the TwigJS language',
      'def'  => array(
        'pre' => array(
          'type' => 'textarea',
          'name' => 'pre',
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
        'body' => array(
          'type' => 'textarea',
          'name' => 'body',
        ),
        'markerSign' => array(
          'type' => 'textarea',
          'name' => 'markerSign',
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
  );

  foreach (array('style', 'style:casing', 'style:highlight') as $k) {
    $form_def['feature']['def'][$k] = $style_form_def;
    $form_def['feature']['def'][$k]['name'] = $k;
  }

  $form = new form('data', $form_def, array('type' => 'form_chooser', 'order' => false));

  if($form->is_complete()) {
    // save data to file
    $data = $form->save_data();
    $data = array_merge(array('type' => 'overpass'), $data);
    file_put_contents($file, json_readable_encode($data) . "\n");
  }

  if ($form->is_empty()) {
    // load data from file
    $data = json_decode(file_get_contents($file), true);
    unset($data['type']);
    $form->set_data($data);
  }
}

?>
<!DOCTYPE HTML>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<?php print_add_html_headers(); ?>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<?php
// show form
print "<form enctype='multipart/form-data' method='post'>\n";
print $form->show();
print "<input type='submit' value='Ok'>\n";
print "</form>\n";
?>
</body>
</html>
