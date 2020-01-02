import baseEditForm from '../_classes/component/Component.form';

import SelectProductEditData from './editForm/SelectProduct.edit.data';
import SelectProductEditDisplay from './editForm/SelectProduct.edit.display';
import SelectProductEditValidation from './editForm/SelectProduct.edit.validation';

export default function(...extend) {
  return baseEditForm([
    {
      key: 'display',
      components: SelectProductEditDisplay
    },
    {
      key: 'data',
      components: SelectProductEditData
    },
    {
      key: 'validation',
      components: SelectProductEditValidation
    }
  ], ...extend);
}
