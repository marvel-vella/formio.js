export default [
   {
    weight: 1200,
    type: 'checkbox',
    label: 'Hide Label',
    tooltip: 'Hide the label of this component. This allows you to show the label in the form builder, but not when it is rendered.',
    key: 'hideLabel',
    input: true,
    defaultValue: true,
   },
   {
    type: 'checkbox',
    input: true,
    label: 'Make',
    key: 'displayMake',
    tooltip: 'When set, this will show the Make field',
    weight: 1,
    defaultValue: true,
  },
  {
    type: 'checkbox',
    input: true,
    label: 'Model',
    key: 'displayModel',
    tooltip: 'When set, this will show the Model field',
    weight: 1,
    defaultValue: true,
  },
  {
    type: 'checkbox',
    input: true,
    label: 'Colour',
    key: 'displayColour',
    tooltip: 'When set, this will show the Colour field',
    weight: 1,
    defaultValue: true,
  },
  {
    type: 'select',
    input: true,
    weight: 0,
    tooltip: 'Show the fields vertically or horizontally',
    key: 'fieldFlow',
    defaultValue: 'horizontal',
    label: 'Field Display Flow',
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' }
      ],
    },
  }
];
