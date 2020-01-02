import { eachComponent } from '../../../utils/utils';

export default [
   {
    key: 'defaultValue',
    ignore: true
  },
   {
    type: 'select',
    input: true,
    weight: 0,
    tooltip: 'The source to use for the select data. Values lets you provide your own values and labels. JSON lets you provide raw JSON data. URL lets you provide a URL to retrieve the JSON data from.',
    key: 'productType',
    defaultValue: 'blueBadge',
    label: 'Product Type',
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Blue Badge', value: 'blueBadge' },
        { label: 'Unpaid Charges', value: 'unpaidCharges' },
        { label: 'Prebook Bay', value: 'prebookbay' },
        { label: 'Custom', value: 'custom' }
      ],
    },
    onChange(context) {
        //console.log('SelectProduct.edit.data productType Change');
        context.instance.root.getComponent('data.url').setValue('');
        context.instance.root.getComponent('selectValues').setValue('');
        context.instance.root.getComponent('valueProperty').setValue('');
    },
  },
  {
    type: 'textfield',
    input: true,
    key: 'data.url',
    weight: 10,
    label: 'Data Source URL',
    placeholder: 'Data Source URL',
    tooltip: 'A URL that returns a JSON array to use as the data source.',
    calculateValue:(context) => {
        //console.log('SelectProduct.edit.data - data.url calculateValue');
        const productType = context.instance.data.productType;
        var url = context.instance.data.data.url;

        if (url==='') {
            url = `/api/productsportal/${productType}`;
        }
        return url;
    }
  },
  {
    type: 'checkbox',
    input: true,
    label: 'Lazy Load Data',
    key: 'lazyLoad',
    tooltip: 'When set, this will not fire off the request to the URL until this control is within focus. This can improve performance if you have many Select dropdowns on your form where the API\'s will only fire when the control is activated.',
    weight: 11,
    conditional: {
      json: {
        in: [
          { var: 'data.dataSrc' },
          [
            'resource',
            'url',
          ],
        ],
      },
    },
  },
  {
    type: 'textfield',
    input: true,
    label: 'Data Path',
    key: 'selectValues',
    weight: 12,
    description: 'The object path to the iterable items.',
    tooltip: 'The property within the source data, where iterable items reside. For example: results.items or results[0].items',
    calculateValue:(context) => {
        const productType = context.instance.data.productType;
        var dataPath = context.instance.data.selectValues;

        if (dataPath==='' && productType==='blueBadge') {
            dataPath = 'products.product_list';
        }
        else if (dataPath==='' && productType==='unpaidCharges') {
            dataPath = 'product_list';
        }
        else if (dataPath==='' && productType==='prebookbay') {
            dataPath = 'product_list';
        }
        return dataPath;
    }
  },
  {
    type: 'textfield',
    input: true,
    label: 'Value Property',
    key: 'valueProperty',
    skipMerge: true,
    clearOnHide: false,
    weight: 13,
    description: "The selected item's property to save.",
    tooltip: 'The property of each item in the data source to use as the select value. If not specified, the item itself will be used.',
    calculateValue:(context) => {
        const productType = context.instance.data.productType;
        var valueTemplate = context.instance.data.valueProperty;

        if (valueTemplate==='' && productType==='blueBadge') {
            valueTemplate = '{{site_product_id}}_{{site_product_server_id}}';
        }
        else if (valueTemplate==='' && productType==='unpaidCharges') {
            valueTemplate = '{{site_product_id}}_{{site_product_server_id}}';
        }
        else if (valueTemplate==='' && productType==='prebookbay') {
            valueTemplate = '{{site_product_id}}_{{site_product_server_id}}';
        }
        return valueTemplate;
    }
  },
  {
    type: 'textarea',
    input: true,
    key: 'template',
    label: 'Item Template',
    editor: 'ace',
    as: 'html',
    rows: 3,
    weight: 18,
    tooltip: 'The HTML template for the result data items.',
    calculateValue: (context) => {
        return '{{ item.name }}';
    }
  },
  {
    type: 'checkbox',
    input: true,
    weight: 21,
    key: 'searchEnabled',
    label: 'Enable Static Search',
    defaultValue: true,
    tooltip: 'When checked, the select dropdown will allow for searching within the static list of items provided.',
  },
  {
    label: 'Search Threshold',
    mask: false,
    tableView: true,
    alwaysEnabled: false,
    type: 'number',
    input: true,
    key: 'selectThreshold',
    validate: {
      min: 0,
      customMessage: '',
      json: '',
      max: 1,
    },
    delimiter: false,
    requireDecimal: false,
    encrypted: false,
    defaultValue: 0.3,
    weight: 22,
    tooltip: 'At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match, a threshold of 1.0 would match anything.',
  }
];
