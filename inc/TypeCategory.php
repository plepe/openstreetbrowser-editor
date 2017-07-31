<?php
$types = array();

class TypeCategory {
  function __construct ($data) {
    $this->data = $data;
  }

  function formDef () {
    return array();
  }

  function postLoad (&$data) {
  }

  function preSave (&$data) {
    $data = array_merge(array('type' => 'overpass'), $data);
  }
}

function register_type($id, $type) {
  global $types;

  $types[$id] = $type;
}

function get_type($id) {
  global $types;

  return array_key_exists($id, $types) ? $types[$id] : null;
}
