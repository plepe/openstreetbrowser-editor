<?php
require "conf.php"; /* load configuration */
require __DIR__ . '/vendor/autoload.php';
include "modulekit/loader.php"; /* loads all php-includes */
include "node_modules/openstreetbrowser/src/repositories.php";
include "node_modules/openstreetbrowser/src/RepositoryBase.php";
include "node_modules/openstreetbrowser/src/RepositoryDir.php";
include "node_modules/openstreetbrowser/src/RepositoryGit.php";
?>
<?php call_hooks("init"); /* initialize submodules */ ?>
<?php
$allRepositories = getRepositories();

$repoId = $_REQUEST['repo'];
if (!array_key_exists($repoId, $allRepositories)) {
  Header("HTTP/1.1 404 Repository not found");
  exit(0);
}

$repoData = $allRepositories[$repoId];
$repo = getRepo($repoId, $repoData);

if (!array_key_exists('dir', $_REQUEST)) {
  $_REQUEST['dir'] = '.';
}

if (array_key_exists('list', $_REQUEST)) {
  $contents = array();
  foreach ($repo->scandir($_REQUEST['dir']) as $f) {
    if (substr($f, 0, 1) !== '.') {
      $contents[] = array('name' => $f);
    }
  }

  $mime_type = 'application/json; charset=utf-8';
  $contents = json_encode($contents);
}
else {
  $tmpfile = tempnam('/tmp', 'osb-asset-');
  $contents = $repo->file_get_contents("{$_REQUEST['dir']}/{$_REQUEST['file']}");

  if ($contents === false) {
    Header("HTTP/1.1 401 Permission denied");
    exit(0);
  }

  file_put_contents($tmpfile, $contents);
  $mime_type = mime_content_type($tmpfile);
}

Header("Content-Type: {$mime_type}; charset=utf-8");
print $contents;
