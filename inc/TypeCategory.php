<?php
$types = array();

class TypeCategory {
  function __construct ($data) {
    $this->data = $data;
  }

  function formDef () {
    global $languages;

    $langs = array_key_exists('name', $this->data) ? array_keys($this->data['name']) : array();
    $langs = array_merge($langs, $languages);
    ksort($langs);

    $values = array();
    foreach ($langs as $lang) {
      $values[$lang] = array(
        'type' => 'text',
        'name' => lang("lang:{$lang}") . " ({$lang})",
      );
    }

    return array(
      'name' => array(
        'type' => 'form_chooser',
        'name' => 'Names',
        'def' => $values,
        'order' => false,
        'include_data' => 'not_null',
        'button:add_element' => 'Add translated name',
      ),
    );
  }

  function postLoad (&$data) {
  }

  function preSave (&$data) {
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
