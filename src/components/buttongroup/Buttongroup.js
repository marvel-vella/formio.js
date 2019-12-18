import _ from 'lodash';
import Field from '../_classes/field/Field';

export default class ButtonGroupComponent extends Field {
  static schema(...extend) {
    return Field.schema({
      type: 'buttongroup',
      inputType: 'buttongroup',
      label: 'Button Group',
      key: 'buttongroup',
      labelPosition: 'top',
      value: ''
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Button Group',
      group: 'basic',
      icon: 'toggle-on',
      documentation: '',
      weight: 50,
      schema: ButtonGroupComponent.schema()
    };
  }

  get defaultSchema() {
    return ButtonGroupComponent.schema();
  }

  get defaultValue() {
    return this.component.name ? '' : (this.component.defaultValue || false).toString() === 'true';
  }

  get hasSetValue() {
    return this.hasValue();
  }

  get inputInfo() {
    const info = super.elementInfo();
    info.type = 'buttongroup';
    info.changeEvent = 'change';
    return info;
  }

  render() {
    return super.render(this.renderTemplate('buttongroup', {
      input: this.inputInfo,
      values: this.component.values,
      value: this.dataValue,
      tooltip: this.interpolate(this.t(this.component.tooltip) || '').replace(/(?:\r\n|\r|\n)/g, '<br />')
    }));
  }

  attach(element) {
    this.loadRefs(element, { buttonGroupItem: 'multiple' });
    this.refs.buttonGroupItem.forEach((item, index) => {
      this.addEventListener(item, 'click', (event) => {
        if (this.component.selectionType==='single') { //Single = Activate the clicked button and deactivate the others
            this.refs.buttonGroupItem.forEach((_item, _index) => {
                this.removeClass(_item,'btn-primary');
            });

            this.addClass(item, 'btn-primary');
        }
        else { //Multiple = toggle the clicked button
            if (!this.hasClass(item,'btn-primary')) {
                this.addClass(item, 'btn-primary');
            }
            else {
               this.removeClass(item,'btn-primary');
            }
        }

        var value = this.getValue();
        this.setValue(value);
      });
    });
    return super.attach(element);
  }

  detach(element) {
    if (element && this.input) {
      this.removeShortcut(this.input);
    }
  }

  get emptyValue() {
    return false;
  }

  isEmpty(value = this.dataValue) {
    return super.isEmpty(value) || value === false;
  }

  /**
   *
   * @param value {*}
   * @returns {*}
   */
  set dataValue(value) {
    const setValue = (super.dataValue = value);
    if (this.component.name) {
      _.set(this.data, this.component.key, setValue === this.component.value);
    }
    return setValue;
  }

  get key() {
    return this.component.name ? this.component.name : super.key;
  }

  getValue() {
      var value = '';
      this.refs.buttonGroupItem.forEach((item, index) => {
          if (this.hasClass(item,'btn-primary')) {
              if (value!=='') {
                  value += ',';
              }
              value += item.value;
          }
      });

      this.dataValue = value;
      return value;
  }

  setValue(value, flags) {
    flags = flags || {};

    return this.updateValue(value, flags);
  }
}
