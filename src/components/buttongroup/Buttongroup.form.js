import baseEditForm from '../_classes/component/Component.form';

import ButtonGroupEditData from './editForm/ButtonGroup.edit.data';
import ButtonGroupEditDisplay from './editForm/ButtonGroup.edit.display';
import ButtonGroupEditValidation from './editForm/ButtonGroup.edit.validation';

export default function(...extend) {
  return baseEditForm([
    {
      key: 'data',
      components: ButtonGroupEditData
    },
    {
      key: 'display',
      components: ButtonGroupEditDisplay
    },
    {
      key: 'validation',
      components: ButtonGroupEditValidation
    },
  ], ...extend);
}
