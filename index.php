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

    if ($_REQUEST['file'] === '') {
      $file = "{$category_path}/{$data['id']}.json";
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
      page_reload();
    }
  }

  if ($form->is_empty()) {
    // load data from file
    $type->postLoad($data);
    $form->set_data($data);
  }

  $content  = "<a href='?'>Back</a>";
  $content .= "<form enctype='multipart/form-data' method='post'>\n";
  $content .= $form->show();
  $content .= "<input type='submit' value='Ok'>\n";
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
</head>
<body>
<?php print messages_print(); ?>
<?php
// show form
print $content;
?>
</body>
</html>
