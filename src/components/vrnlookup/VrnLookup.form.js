import baseEditForm from '../_classes/component/Component.form';

import VrnLookupEditData from './editForm/VrnLookup.edit.data';
import VrnLookupEditDisplay from './editForm/VrnLookup.edit.display';
import VrnLookupEditValidation from './editForm/VrnLookup.edit.validation';

export default function(...extend) {
  return baseEditForm([
    {
      key: 'display',
      components: VrnLookupEditDisplay
    },
    {
      key: 'data',
      components: VrnLookupEditData
    },
    {
      key: 'validation',
      components: VrnLookupEditValidation
    }
  ], ...extend);
}
