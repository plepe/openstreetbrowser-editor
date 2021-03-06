<?php
$name = "OpenStreetBrowser-editor";
$id = "openstreetbrowser-editor";
$depend = array(
  "modulekit-form",        // use modulekit-form and all its requirements
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
    'inc/*.js', // automatically include all files in inc-directory
    'dist/app.js',
  ),
  'css' => array(
    'style.css' // include style.css
  )
);
