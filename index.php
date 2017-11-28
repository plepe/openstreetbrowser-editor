<?php
Header("content-type: text/html; charset=utf-8");
// create file .nocache to disable caching
require "conf.php"; /* load configuration */
require __DIR__ . '/vendor/autoload.php';
include "modulekit/loader.php"; /* loads all php-includes */
session_start();
call_hooks("init");

if (isset($_REQUEST['file']) && preg_match('/^[A-Za-z0-9_\-]*$/', $_REQUEST['file'])) {
  if ($_REQUEST['file'] === '') {
    $typeClass = 'TypeOverpass';
    if (isset($_REQUEST['type'])) {
      $typeClass = get_type($_REQUEST['type']);
    }
    $data = $typeClass::newData();
  }
  else {
    $file = "{$category_path}/{$_REQUEST['file']}.json";
    $data = file_get_contents($file);
    if ($data === false ) {
      messages_add(error_get_last()['message'], MSG_ERROR);
    }
    $data = json_decode($data, true);
    $data = jsonMultilineStringsJoin($data, array('exclude' => array(array('const'))));

    if (array_key_exists('type', $data)) {
      if ($typeClass = get_type($data['type'])) {
      } else {
        $typeClass = 'TypeOverpass';
      }
    } else {
      $typeClass = 'TypeOverpass';
    }
  }
  html_export_var(array('data' => $data));
  $type = new $typeClass($data);

  $form_def = $type->formDef();

  if ($_REQUEST['file'] === '') {
    $data = array_merge(array('id' => ''), $data);
    $form_def = array_merge(array('id' => array('type' => 'text', 'req' => true, 'name' => 'ID', 'check' => array('regexp', '^[A-Za-z0-9_\-]+$', 'Use only ASCII characters, digits, "_" or "-"'))), $form_def);
  }

  $form = new form('data', $form_def, array('type' => 'form_chooser', 'order' => false));

  if($form->is_complete()) {
    // save data to file
    $data = $form->save_data();
    $new_url = null;

    if ($_REQUEST['file'] === '') {
      $file = "{$category_path}/{$data['id']}.json";
      $new_url = array('file' => $data['id']);
      unset($data['id']);
    }

    $type->preSave($data);
    $data = jsonMultilineStringsSplit($data, array('exclude' => array(array('const'))));
    $data = json_readable_encode($data) . "\n";
    if (file_put_contents($file, $data) === false) {
      messages_add(error_get_last()['message'], MSG_ERROR);
    }
    else {
      messages_add("Saved.");
      page_reload($new_url);
    }
  }

  if ($form->is_empty()) {
    // load data from file
    $type->postLoad($data);
    $form->set_data($data);
  }

  $content .= "<form enctype='multipart/form-data' method='post'>\n";
  $content .= "<div id='form'>\n";
  $content .= $form->show();
  $content .= "</div>";
  $content .= "<div id='actions'>\n";
  $content .= "<input type='submit' value='Save'>\n";
  $content .= "<input id='preview' type='button' value='Preview'>\n";
  $content .= "<a href='?'>Back to Index</a>";
  $content .= "</div>";
  $content .= "</form>\n";
} else {
  $d = opendir($category_path);
  $files = array();
  while ($f = readdir($d)) {
    if (preg_match("/^([^\.].*)\.json$/", $f, $m)) {
      $files[] = $m[1];
    }
  }

  $content = "Create new category: ";
  $content .= "<a href='?file=&type=index'>index</a>, ";
  $content .= "<a href='?file=&type=overpass'>overpass</a>";

  $content .= "<ul>\n";

  natsort($files);
  foreach ($files as $file) {
    $content .= "  <li><a href='?file=" . urlencode($file) . "'>{$file}</a></li>\n";
  }

  $content .= "</ul>\n";
}
?>
<!DOCTYPE HTML>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<?php print_add_html_headers(); ?>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="node_modules/leaflet/dist/leaflet.css" />
<link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css" />
<script src="node_modules/leaflet/dist/leaflet.js"></script>
<script src="node_modules/leaflet-textpath/leaflet.textpath.js"></script>
</head>
<body>
<div id='content'>
<?php print messages_print(); ?>
<?php
// show form
print $content;
?>
</div>

<div id='list'>
</div>
<div id='map'>
</div>
</body>
</html>
