<?php
Header("content-type: text/html; charset=utf-8");
// create file .nocache to disable caching
require "conf.php"; /* load configuration */
include "modulekit/loader.php"; /* loads all php-includes */
call_hooks("init");

if (isset($_REQUEST['file']) && preg_match('/^[A-Za-z0-9_\-]+$/', $_REQUEST['file'])) {
  $file = "{$category_path}/{$_REQUEST['file']}.json";

  $form_def = array(
    'query' => array(
      'type' => 'textarea',
      'name' => 'Query',
      'desc' => 'Overpass QL query without "out" statement, e.g. "(node[amenity=bar];way[amenity=bar];)"',
    ),
    'feature' => array(
      'type' => 'form_chooser',
      'order' => false,
      'name' => 'Feature evaluation',
      'desc' => 'All sub values will be evaluated via the TwigJS language',
      'def'  => array(
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
      ),
    ),
  );

  $form = new form('data', $form_def);

  if($form->is_complete()) {
    // save data to file
    $data = $form->save_data();
    file_put_contents($file, json_readable_encode($data) . "\n");
  }

  if ($form->is_empty()) {
    // load data from file
    $data = json_decode(file_get_contents($file), true);
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
