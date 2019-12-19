import _ from 'lodash';
import Formio from '../../Formio';
import Field from '../_classes/field/Field';
import Form from '../../Form';
import NativePromise from 'native-promise-only';

export default class VrnLookupComponent extends Field {
    static schema(...extend) {
        return Field.schema({
            type: 'vrnlookup',
            label: 'VRN Lookup',
            key: 'vrnlookup',
            data: {
                values: [],
                json: '',
                url: '/api/vehicleexperian',
                resource: '',
                custom: ''
            },
            clearOnRefresh: false,
            limit: 100,
            dataSrc: 'url',
            valueProperty: 'vehicle',
            lazyLoad: true,
            filter: '',
            searchEnabled: true,
            searchField: 'vrn',
            minSearch: 0,
            readOnlyValue: false,
            authenticate: false,
            template: '<span>{{ item.label }}</span>',
            selectFields: '',
            searchThreshold: 0.3,
            tableView: true,
            fuseOptions: {
                include: 'score',
                threshold: 0.3,
            },
            customOptions: {}
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'VRN Lookup',
            group: 'basic',
            icon: 'search',
            weight: 70,
            documentation: 'http://help.form.io/userguide/#select',
            schema: VrnLookupComponent.schema()
        };
    }

    init() {
        //console.log('VrnLookup init');
        super.init();

        // Trigger an update.
        this.triggerUpdate = _.debounce(this.updateItems.bind(this), 100);
    }

    get defaultSchema() {
        //console.log('VrnLookup defaultSchema');
        return VrnLookupComponent.schema();
    }

    get emptyValue() {
        //console.log('VrnLookup emptyValue');
        if (this.valueProperty) {
            return '';
        }
        return {};
    }

    get valueProperty() {
        ////console.log('PostcodeLookup get valueProperty');
        if (this.component.valueProperty) {
        return this.component.valueProperty;
        }
        // Force values datasource to use values without actually setting it on the component settings.
        if (this.component.dataSrc === 'values') {
            return 'value';
        }

        return '';
    }

    get inputInfo() {
        //console.log('VrnLookup get inputInfo');
        const info = super.elementInfo();
        info.type = 'select';
        info.changeEvent = 'change';
        return info;
    }

    get shouldDisabled() {
        ////console.log('PostcodeLookup shouldDisabled');
        return super.shouldDisabled || this.parentDisabled;
    }

    refresh() {
        ////console.log('PostcodeLookup refresh');
        if (this.component.lazyLoad) {
            this.activated = false;
            this.loading = true;
            this.setItems([]);
        }

        if (this.component.clearOnRefresh) {
            this.setValue(this.emptyValue);
        }
        this.updateItems(null, true);
    }

    /* eslint-enable max-statements */

    addPlaceholder() {
        //console.log('VrnLookup addPlaceholder');
        if (!this.component.placeholder) {
            return;
        }
    }

    /**
     * Activate this select control.
     */
    activate() {
        //console.log('VrnLookup activate');
        if (this.active) {
            return;
        }
        this.activated = true;
    }

    get active() {
        //console.log('VrnLookup get active');
        return !this.component.lazyLoad || this.activated || this.options.readOnly;
    }

    render() {
        //console.log('VrnLookup render');
        const info = this.inputInfo;
        info.attr = info.attr || {};
        info.multiple = this.component.multiple;
        return super.render(this.renderTemplate('vrnlookup', {
            input: this.inputInfo,
            values: this.component.values,
            value: this.dataValue,
            tooltip: this.interpolate(this.t(this.component.tooltip) || '').replace(/(?:\r\n|\r|\n)/g, '<br />')
        }));
    }

    /* eslint-disable max-statements */
    attach(element) {
        //console.log('VrnLookup attach');
        const superAttach = super.attach(element);
        this.loadRefs(element, {
            vrnLookupContainer: 'single',
            searchButton: 'single',
            make: 'single',
            model: 'single',
            colour: 'single'
        });

        const input = this.refs.vrnLookupContainer;
        if (!input) {
            return;
        }

        this.addEventListener(input, this.inputInfo.changeEvent, () => this.updateValue(null, {
                modified: true
            }));

        const tabIndex = input.tabIndex;
        this.addPlaceholder();

        this.addEventListener(this.refs.make, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.model, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.colour, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.searchButton, 'click', (event) => {
            var search = this.refs.vrnLookupContainer.value;
            var apiUrl = `${Formio.getProjectUrl()}${this.component.data.url}?plate=${search}`;

            let method;
            let body;

            if (!this.component.data.method) {
                method = 'GET';
            }
            else {
                method = this.component.data.method;
                if (method.toUpperCase() === 'POST') {
                    body = this.component.data.body;
                }
                else {
                    body = null;
                }
            }
            var options = {};

            Formio.makeRequest(this.options.formio, 'select', apiUrl, method, body, options)
                    .then((response) => {
                        this.loading = false;
                        if (response !== null) {
                            if (this.refs.make != null) {
                                this.refs.make.value = response.make;
                            }
                            if (this.refs.model != null) {
                                this.refs.model.value = response.model;
                            }
                            if (this.refs.colour != null) {
                                this.refs.colour.value = response.colour;
                            }

                            var value = this.getValue();
                            this.setValue(value);
                        }
                    })
                    .catch((err) => {
                        this.emit('componentError', {
                            component: this.component,
                            message: err.toString(),
                        });
                        console.warn(`Unable to load resources for ${this.key} ${err.toString()}`);
                    });
        });

        // Force the disabled state with getters and setters.
        this.disabled = this.shouldDisabled;
        this.triggerUpdate();
        return superAttach;
    }

    set disabled(disabled) {
        //console.log('VrnLookup set disabled');
        super.disabled = disabled;
    }

    get disabled() {
        //console.log('VrnLookup get disabled');
        return super.disabled;
    }

    set visible(value) {
        //console.log('VrnLookup set visible');
        // If we go from hidden to visible, trigger a refresh.
        if (value && (!this._visible !== !value)) {
            this.triggerUpdate();
        }
        super.visible = value;
    }

    get visible() {
        //console.log('VrnLookup get visible');
        return super.visible;
    }

    getValue() {
        const value = {
            vrn: this.refs.vrnLookupContainer.value,
            make: (this.refs.make == null) ? '' : this.refs.make.value,
            model: (this.refs.model == null) ? '' : this.refs.model.value,
            colour: (this.refs.colour == null) ? '' : this.refs.colour.value,
        };
        //console.log(`VrnLookup getValue: ${JSON.stringify(value)}`);
        return value;
    }

    redraw() {
        //console.log('VrnLookup redraw');
        const done = super.redraw();
        this.triggerUpdate();
        return done;
    }

    /**
     * Normalize values coming into updateValue.
     *
     * @param value
     * @return {*}
     */
    normalizeValue(value) {
        //console.log(`VrnLookup normalizeValue ${JSON.stringify(value)}`);

        return super.normalizeValue(value);
    }

    setValue(value, flags) {
        //console.log(`VrnLookup setValue ${JSON.stringify(value)}`);
        flags = flags || {};
        const previousValue = this.dataValue;
        const changed = this.updateValue(value, flags);

        if (this.refs.vrnLookupContainer != null) {
            this.refs.vrnLookupContainer.value = value.vrn;
        }
        if (this.refs.make != null) {
            this.refs.make.value = value.make;
        }
        if (this.refs.model != null) {
            this.refs.model.value = value.model;
        }
        if (this.refs.colour != null) {
            this.refs.colour.value = value.colour;
        }

        return changed;
    }

    /**
     * Deletes the value of the component.
     */
    deleteValue() {
        //console.log('VrnLookup deleteValue');
        this.setValue('', {
            noUpdateEvent: true
        });
        _.unset(this.data, this.key);
    }

    /**
     * Check if a component is eligible for multiple validation
     *
     * @return {boolean}
     */
    validateMultiple() {
        ////console.log('PostcodeLookup validateMultiple');
        // Select component will contain one input when flagged as multiple.
        return false;
    }

    detach() {
        //console.log('VrnLookup detach');
        super.detach();
    }

    focus() {
        //console.log('VrnLookup focus');
        if (this.focusableElement) {
            this.focusableElement.focus();
        }
    }

    setCustomValidity(message, dirty, external) {
        //console.log('VrnLookup setCustomValidity');
        if (message) {
            if (this.refs.messageContainer) {
                this.empty(this.refs.messageContainer);
            }
            this.error = {
                component: this.component,
                message: message,
                external: !!external,
            };
            this.emit('componentError', this.error);
            if (this.refs.vrnLookupContainer) {
                this.addInputError(message, dirty, [this.refs.vrnLookupContainer]);
            }
        }
        else if (this.error && this.error.external === !!external) {
            if (this.refs.messageContainer) {
                this.empty(this.refs.messageContainer);
            }
            this.error = null;
            this.removeClass(this.refs.vrnLookupContainer, 'is-invalid');
            this.clearErrorClasses();
        }
    }
}
