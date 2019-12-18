import BuilderUtils from '../../../utils/builder';
import _ from 'lodash';

export default [
  {
    key: 'multiple',
    ignore: true
  },
  {
    type: 'datagrid',
    input: true,
    label: 'Values',
    key: 'values',
    tooltip: 'The button values that will be displayed in this button group. Values are text submitted with the form data. Labels are text that appears in the buttons on the form.',
    weight: 10,
    reorder: true,
    components: [
      {
        label: 'Label',
        key: 'label',
        input: true,
        type: 'textfield',
      },
      {
        label: 'Value',
        key: 'value',
        input: true,
        type: 'textfield',
        allowCalculateOverride: true,
        calculateValue: { _camelCase: [{ var: 'row.label' }] },
        validate: {
          required: true
        }
      },
      {
        type: 'select',
        input: true,
        weight: 180,
        label: 'Shortcut',
        key: 'shortcut',
        tooltip: 'The shortcut key for this option.',
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
        label: 'Selected',
        key: 'selected',
        input: true,
        type: 'checkbox',
      },
    ],
  }
];
