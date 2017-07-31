<?php
$types = array();

class TypeCategory {
  function formDef () {
    return array();
  }

  function postLoad (&$data) {
  }

  function preSave (&$data) {
    $data = array_merge(array('type' => 'overpass'), $data);
  }
}
