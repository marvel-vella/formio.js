import baseEditForm from '../_classes/component/Component.form';

import PostcodeLookupEditData from './editForm/PostcodeLookup.edit.data';
import PostcodeLookupEditDisplay from './editForm/PostcodeLookup.edit.display';
import PostcodeLookupEditValidation from './editForm/PostcodeLookup.edit.validation';

export default function(...extend) {
  return baseEditForm([
    {
      key: 'display',
      components: PostcodeLookupEditDisplay
    },
    {
      key: 'data',
      components: PostcodeLookupEditData
    },
    {
      key: 'validation',
      components: PostcodeLookupEditValidation
    }
  ], ...extend);
}
