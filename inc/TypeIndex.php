<?php
class TypeIndex extends TypeCategory {
  function formDef () {
    $form_def = parent::formDef();

    $x = array(
      'type' => 'array',
      'name' => 'subCategories',
      'index_type' => 'array',
      'def' => array(
        'type' => 'form',
        'def' => array(
          'id' => array(
            'type' => 'text',
            'name' => 'id',
          ),
          'type' => array(
            'type' => 'select',
            'name' => 'type',
            'values' => array(
              'index' => 'Inline',
            ),
            'placeholder' => 'Separate file',
            'include_data' => 'not_null',
          ),
          'name' => $form_def['name'],
        ),
      ),
      'include_data' => 'not_null',
    );

    $x['def']['def']['name']['show_depend'] = array('check', 'type', array('is', 'index'));
    $form_def['subCategories'] = $x;
    $x['show_depend'] = array('check', 'type', array('is', 'index'));
    $form_def['subCategories']['def']['def']['subCategories'] = $x;
    $form_def['subCategories']['def']['def']['subCategories']['def']['def']['subCategories'] = $x;

    return $form_def;
  }

  function postLoad (&$data) {
    parent::postLoad($data);

    unset($data['type']);
  }

  function preSave (&$data) {
    parent::preSave($data);
    $data = array_merge(array('type' => 'index'), $data);
  }
}

register_type('index', 'TypeIndex');
