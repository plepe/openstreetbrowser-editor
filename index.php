<?php
Header("content-type: text/html; charset=utf-8");
// create file .nocache to disable caching
require "conf.php"; /* load configuration */
require __DIR__ . '/vendor/autoload.php';
include "modulekit/loader.php"; /* loads all php-includes */
include "node_modules/openstreetbrowser/src/repositories.php";
include "node_modules/openstreetbrowser/src/RepositoryBase.php";
include "node_modules/openstreetbrowser/src/RepositoryDir.php";
include "node_modules/openstreetbrowser/src/RepositoryGit.php";
session_start();
call_hooks("init");

html_export_var(array(
  'config' => $config,
));

$repositories = getRepositories();
if (sizeof($repositories) === 1) {
  $_REQUEST['repoId'] = array_keys($repositories)[0];
}
if (array_key_exists($_REQUEST['repoId'], $repositories)) {
  $repo = getRepo($_REQUEST['repoId'], $repositories[$_REQUEST['repoId']]);
}
$repoIdHTML = htmlspecialchars($_REQUEST['repoId']);

if (!isset($repo)) {
  $content .= "<ul>\n";
  foreach ($repositories as $repoId => $repoData) {
    $content .= '<li><a href="?repoId=' . htmlspecialchars($repoId) . '">Repository "'. htmlspecialchars($repoId) . "\"</a></li>\n";
  }
  $content .= "</ul>";
}
else if (isset($_REQUEST['file']) && preg_match('/^[A-Za-z0-9_\-]*$/', $_REQUEST['file'])) {
  if ($_REQUEST['file'] === '') {
    $typeClass = 'TypeOverpass';
    if (isset($_REQUEST['type'])) {
      $typeClass = get_type($_REQUEST['type']);
    }
    $data = $typeClass::newData();
  }
  else {
    $file = "{$_REQUEST['file']}.json";
    $data = $repo->file_get_contents($file);
    if ($data === false ) {
      messages_add(error_get_last()['message'], MSG_ERROR);
    }

  }

  if ($_REQUEST['file'] === '') {
    $data = array_merge(array('id' => ''), $data);
    $form_def = array_merge(array('id' => array('type' => 'text', 'req' => true, 'name' => 'ID', 'check' => array('regexp', '^[A-Za-z0-9_\-]+$', 'Use only ASCII characters, digits, "_" or "-"'))), $form_def);
  }

  if ($_REQUEST['data']) {
    $data = trim(str_replace("\r\n", "\n", $_REQUEST['data'])) . "\n";
    $error = false;

    if (!preg_match('/^[A-Za-z0-9_\-]*$/', $_REQUEST['id'])) {
      $error = true;
      messages_add("Invalid ID", MSG_ERROR);
    }
    // save data to file
    elseif ($_REQUEST['id'] !== $_REQUEST['file']) {
      $file = "{$_REQUEST['id']}.json";
      $new_url = array('file' => $_REQUEST['id']);
    }

    if ($error) {
    }
    elseif ($repo->file_put_contents($file, $data) === false) {
      messages_add(error_get_last()['message'], MSG_ERROR);
    }
    else {
      messages_add("Saved.");
      page_reload($new_url);
    }
  }

  $content .= "<form enctype='multipart/form-data' method='post'>\n";
  $content .= "<textarea id='editor' name='data'>";
  $content .= htmlspecialchars($data);
  $content .= "</textarea>";
  $content .= "<div id='actions'>\n";
  $content .= "Filename: <input type='text' name='id' value=\"" . htmlspecialchars($_REQUEST['file']) . "\"><br/>";
  $content .= "<input type='submit' value='Save'>\n";
  $content .= "<a href=\"?repoId={$repoIdHTML}\">Back to Repository</a>";
  $content .= "</div>";
  $content .= "</form>\n";
} else {
  $files = array();
  foreach ($repo->scandir() as $f) {
    if (preg_match("/^([^\.].*)\.json$/", $f, $m)) {
      $files[] = $m[1];
    }
  }

  $content = "<a href=\".\">Back to Index</a> ";
  $content .= "Create new category: ";
  $content .= "<a href='?repoId={$repoIdHTML}&amp;file=&amp;type=index'>index</a>, ";
  $content .= "<a href='?repoId={$repoIdHTML}&amp;file=&amp;type=overpass'>overpass</a>";

  $content .= "<ul>\n";

  natsort($files);
  foreach ($files as $file) {
    $content .= "  <li><a href='?repoId={$repoIdHTML}&amp;file=" . urlencode($file) . "'>{$file}</a></li>\n";
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
<script src="node_modules/leaflet-polylineoffset/leaflet.polylineoffset.js"></script>
<script>
window.onload = function () {
  OpenStreetBrowserEditor.set(document.getElementById('editor'))
}
</script>
</head>
<body>
<div id='content'>
<?php print messages_print(); ?>
<?php
// show form
print $content;
?>
</div>

</body>
</html>
