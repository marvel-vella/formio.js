import BuilderUtils from '../../../utils/builder';
import _ from 'lodash';

export default [
  {
    key: 'placeholder',
    ignore: true,
  },
  {
    type: 'select',
    input: true,
    weight: 350,
    label: 'Shortcut',
    key: 'shortcut',
    tooltip: 'Shortcut for this component.',
    dataSrc: 'custom',
    valueProperty: 'value',
    customDefaultValue: () => '',
    template: '{{ item.label }}',
    data: {
      custom(context) {
        return BuilderUtils.getAvailableShortcuts(
          _.get(context, 'instance.options.editForm', {}),
          _.get(context, 'instance.options.editComponent', {})
        );
      },
    },
  },
  {
    type: 'select',
    input: true,
    key: 'selectionType',
    label: 'Selection Type',
    tooltip: 'This is the selection type of this Button Group',
    dataSrc: 'values',
    weight: 410,
    defaultValue: 'single',
    data: {
      values: [
        { label: 'Single', value: 'single' },
        { label: 'Multiple', value: 'multiple' },
      ],
    },
  }
];
