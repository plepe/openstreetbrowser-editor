<?php
$name = "OpenStreetBrowser-editor";
$id = "openstreetbrowser-editor";
$depend = array(
  "html",
  "messages",
  "hooks",
  "page",
  'openstreetmap-tag-translations',
);

$include = array(
  'php' => array(
    'inc/*.php' // automatically include all files in inc-directory
  ),
  'js' => array(
  ),
  'css' => array(
    'style.css' // include style.css
  )
);
