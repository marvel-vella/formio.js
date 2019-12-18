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
            valueProperty: 'vrn',
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
        super.init();

        // Trigger an update.
        this.triggerUpdate = _.debounce(this.updateItems.bind(this), 100);
    }

    get defaultSchema() {
        return VrnLookupComponent.schema();
    }

    get emptyValue() {
        if (this.valueProperty) {
            return '';
        }
        return {};
    }

    get isSelectResource() {
        return this.component.dataSrc === 'resource';
    }

    get isSelectURL() {
        return this.component.dataSrc === 'url';
    }

    /**
     * @param {*} data
     * @param {boolean} [forceUseValue=false] - if true, return 'value' property of the data
     * @return {*}
     */
    itemValue(data, forceUseValue = false) {
        return data;
    }

    /* eslint-enable max-statements */

    addPlaceholder() {
        if (!this.component.placeholder) {
            return;
        }
    }

    /**
     * Activate this select control.
     */
    activate() {
        if (this.active) {
            return;
        }
        this.activated = true;
    }

    get active() {
        return !this.component.lazyLoad || this.activated || this.options.readOnly;
    }

    render() {
        return super.render(this.renderTemplate('vrnlookup', {
            input: this.inputInfo,
            values: this.component.values,
            value: this.dataValue,
            tooltip: this.interpolate(this.t(this.component.tooltip) || '').replace(/(?:\r\n|\r|\n)/g, '<br />')
        }));
    }

    /* eslint-disable max-statements */
    attach(element) {
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

        const tabIndex = input.tabIndex;
        this.addPlaceholder();

        this.addEventListener(this.refs.make, 'change', (event) => {
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
        return superAttach;
    }

    set disabled(disabled) {
        super.disabled = disabled;
    }

    get disabled() {
        return super.disabled;
    }

    set visible(value) {
        // If we go from hidden to visible, trigger a refresh.
        super.visible = value;
    }

    get visible() {
        return super.visible;
    }

    getValue() {
        const value = {
            vrn: this.refs.vrnLookupContainer.value,
            make: (this.refs.make == null) ? '' : this.refs.make.value,
            model: (this.refs.model == null) ? '' : this.refs.model.value,
            colour: (this.refs.colour == null) ? '' : this.refs.colour.value,
        };
        return value;
    }

    redraw() {
        const done = super.redraw();
        return done;
    }

    setValue(value, flags) {
        flags = flags || {};
        const previousValue = this.dataValue;
        const changed = this.updateValue(value, flags);

        return changed;
    }

    /**
     * Deletes the value of the component.
     */
    deleteValue() {
        this.setValue('', {
            noUpdateEvent: true
        });
        _.unset(this.data, this.key);
    }

    detach() {
        super.detach();
    }

    focus() {
        if (this.focusableElement) {
            this.focusableElement.focus();
        }
    }

    setCustomValidity(message, dirty, external) {
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
