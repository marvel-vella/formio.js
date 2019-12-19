import _ from 'lodash';
import Formio from '../../Formio';
import Field from '../_classes/field/Field';
import Form from '../../Form';
import NativePromise from 'native-promise-only';

export default class PostcodeLookupComponent extends Field {
    static schema(...extend) {
        return Field.schema({
            type: 'postcodelookup',
            label: 'Post Code Lookup',
            key: 'postcodelookup',
            data: {
                values: [],
                json: '',
                url: '/api/location/getAddressfrompostcode',
                resource: '',
                custom: ''
            },
            clearOnRefresh: false,
            limit: 100,
            dataSrc: 'url',
            valueProperty: 'address',
            lazyLoad: true,
            filter: '',
            searchEnabled: true,
            searchField: 'postcode',
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
            title: 'Post Code Lookup',
            group: 'basic',
            icon: 'search',
            weight: 70,
            documentation: 'http://help.form.io/userguide/#select',
            schema: PostcodeLookupComponent.schema()
        };
    }

    init() {
        //console.log('PostcodeLookup init');
        super.init();

        // Trigger an update.
        this.triggerUpdate = _.debounce(this.updateItems.bind(this), 100);
    }

    get dataReady() {
        //console.log('PostcodeLookup get dataReady');
        return this.itemsLoaded;
    }

    get defaultSchema() {
        //console.log('PostcodeLookup get defaultSchema');
        return PostcodeLookupComponent.schema();
    }

    get emptyValue() {
        //console.log('PostcodeLookup get emptyValue');
        if (this.valueProperty) {
            return '';
        }
        return {};
    }

    get valueProperty() {
        //console.log('PostcodeLookup get valueProperty');
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
        //console.log('PostcodeLookup inputInfo');
        const info = super.elementInfo();
        info.type = 'select';
        info.changeEvent = 'change';
        return info;
    }

    get isSelectResource() {
        //console.log('PostcodeLookup isSelectResource');
        return this.component.dataSrc === 'resource';
    }

    get isSelectURL() {
        //console.log('PostcodeLookup isSelectURL');
        return this.component.dataSrc === 'url';
    }

    get isInfiniteScrollProvided() {
        //console.log('PostcodeLookup isInfiniteScrollProvided');
        return this.isSelectResource || this.isSelectURL;
    }

    get shouldDisabled() {
        //console.log('PostcodeLookup shouldDisabled');
        return super.shouldDisabled || this.parentDisabled;
    }

    itemTemplate(data) {
        //console.log('PostcodeLookup itemTemplate');
        return JSON.stringify(data);
    }

    /**
     * @param {*} data
     * @param {boolean} [forceUseValue=false] - if true, return 'value' property of the data
     * @return {*}
     */
    itemValue(data, forceUseValue = false) {
        //console.log('PostcodeLookup itemValue');
        return data;
    }

    /**
     * Get the request headers for this select dropdown.
     */
    get requestHeaders() {
        //console.log('PostcodeLookup requestHeaders');
        // Create the headers object.
        const headers = new Formio.Headers();

        // Add custom headers to the url.
        if (this.component.data && this.component.data.headers) {
            try {
                _.each(this.component.data.headers, (header) => {
                    if (header.key) {
                        headers.set(header.key, this.interpolate(header.value));
                    }
                });
            }
            catch (err) {
                console.warn(err.message);
            }
        }

        return headers;
    }

    getCustomItems() {
        //console.log('PostcodeLookup getCustomItems');
        return this.evaluate(this.component.data.custom, {
            values: []
        }, 'values');
    }

    updateCustomItems() {
        //console.log('PostcodeLookup updateCustomItems');
        this.setItems(this.getCustomItems() || []);
    }

    refresh() {
        //console.log('PostcodeLookup refresh');
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
        //console.log('PostcodeLookup addPlaceholder');
        if (!this.component.placeholder) {
            return;
        }
    }

    /**
     * Activate this select control.
     */
    activate() {
        //console.log('PostcodeLookup activate');
        if (this.active) {
            return;
        }
        this.activated = true;
        this.triggerUpdate();
    }

    get active() {
        //console.log('PostcodeLookup active');
        return !this.component.lazyLoad || this.activated || this.options.readOnly;
    }

    render() {
        //console.log('PostcodeLookup render');
        const info = this.inputInfo;
        info.attr = info.attr || {};
        info.multiple = this.component.multiple;
        return super.render(this.renderTemplate('postcodelookup', {
            input: this.inputInfo,
            values: this.component.values,
            value: this.dataValue,
            tooltip: this.interpolate(this.t(this.component.tooltip) || '').replace(/(?:\r\n|\r|\n)/g, '<br />')
        }));
    }

    /* eslint-disable max-statements */
    attach(element) {
        //console.log('PostcodeLookup attach');
        const superAttach = super.attach(element);
        this.loadRefs(element, {
            postcodeLookupContainer: 'single',
            searchButton: 'single',
            address1: 'single',
            address2: 'single',
            address3: 'single',
            city: 'single',
            country: 'single',
            region: 'single'
        });

        const input = this.refs.postcodeLookupContainer;
        if (!input) {
            return;
        }

        this.addEventListener(input, this.inputInfo.changeEvent, () => this.updateValue(null, {
                modified: true
            }));

        const tabIndex = input.tabIndex;
        this.addPlaceholder();

        this.addEventListener(this.refs.address1, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.address2, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.address3, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.city, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.country, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.region, 'change', (event) => {
            var value = this.getValue();
            this.setValue(value);
        });

        this.addEventListener(this.refs.searchButton, 'click', (event) => {
            var search = this.refs.postcodeLookupContainer.value;
            var apiUrl = `${Formio.getProjectUrl()}${this.component.data.url}?postcode=${search}`;

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
                        if (response.status === 'OK') {
                            if (this.refs.address1 != null) {
                                this.refs.address1.value = response.address.address1;
                            }
                            if (this.refs.address2 != null) {
                                this.refs.address2.value = response.address.address2;
                            }
                            if (this.refs.address3 != null) {
                                this.refs.address3.value = response.address.address3;
                            }
                            if (this.refs.city != null) {
                                this.refs.city.value = response.address.city;
                            }
                            if (this.refs.country != null) {
                                this.refs.country.value = response.address.country;
                            }
                            if (this.refs.region != null) {
                                this.refs.region.value = response.address.region;
                            }

                            var value = this.getValue();
                            this.setValue(value);
                        }
                    })
                    .catch((err) => {
                        this.isScrollLoading = false;
                        this.loading = false;
                        this.itemsLoadedResolve();
                        this.emit('componentError', {
                            component: this.component,
                            message: err.toString(),
                        });
                        console.warn(`Unable to load resources for ${this.key}`);
                    });
        });

        // Force the disabled state with getters and setters.
        this.disabled = this.shouldDisabled;
        this.triggerUpdate();
        return superAttach;
    }

    set disabled(disabled) {
        //console.log('PostcodeLookup set disabled');
        super.disabled = disabled;
        if (!this.choices) {
            return;
        }
        if (disabled) {
            this.setDisabled(this.choices.containerInner.element, true);
            this.focusableElement.removeAttribute('tabIndex');
            this.choices.disable();
        }
        else {
            this.setDisabled(this.choices.containerInner.element, false);
            this.focusableElement.setAttribute('tabIndex', this.component.tabindex || 0);
            this.choices.enable();
        }
    }

    get disabled() {
        //console.log('PostcodeLookup get disabled');
        return super.disabled;
    }

    set visible(value) {
        //console.log('PostcodeLookup set visible');
        // If we go from hidden to visible, trigger a refresh.
        if (value && (!this._visible !== !value)) {
            this.triggerUpdate();
        }
        super.visible = value;
    }

    get visible() {
        //console.log('PostcodeLookup get visible');
        return super.visible;
    }

    getValue() {
        //console.log('PostcodeLookup getValue');
        const value = {
            postcode: this.refs.postcodeLookupContainer.value,
            address1: (this.refs.address1 == null) ? '' : this.refs.address1.value,
            address2: (this.refs.address2 == null) ? '' : this.refs.address2.value,
            address3: (this.refs.address3 == null) ? '' : this.refs.address3.value,
            city: (this.refs.city == null) ? '' : this.refs.city.value,
            country: (this.refs.country == null) ? '' : this.refs.country.value,
            region: (this.refs.region == null) ? '' : this.refs.region.value,
        };
        return value;
    }

    redraw() {
        //console.log('PostcodeLookup redraw');
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
        //console.log(`Postcodelookup normalizeValue ${JSON.stringify(value)}`);
        const dataType = _.get(this.component, 'dataType', 'auto');
        switch (dataType) {
            case 'auto':
                if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    value = +value;
                }
                if (value === 'true') {
                    value = true;
                }
                if (value === 'false') {
                    value = false;
                }
                break;
            case 'number':
                value = +value;
                break;
            case 'string':
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                else {
                    value = value.toString();
                }
                break;
            case 'boolean':
                value = !!value;
                break;
        }
        return super.normalizeValue(value);
    }

    setValue(value, flags) {
        //console.log(`Postcodelookup setValue ${JSON.stringify(value)}`);
        flags = flags || {};
        const previousValue = this.dataValue;
        const changed = this.updateValue(value, flags);

        if (this.refs.postcodeLookupContainer != null) {
            this.refs.postcodeLookupContainer.value = value.postcode;
        }
        if (this.refs.address1 != null) {
            this.refs.address1.value = value.address1;
        }
        if (this.refs.address2 != null) {
            this.refs.address2.value = value.address2;
        }
        if (this.refs.address3 != null) {
            this.refs.address3.value = value.address3;
        }
        if (this.refs.city != null) {
            this.refs.city.value = value.city;
        }
        if (this.refs.country != null) {
            this.refs.country.value = value.country;
        }
        if (this.refs.region != null) {
            this.refs.region.value = value.region;
        }

        return changed;
    }

    /**
     * Deletes the value of the component.
     */
    deleteValue() {
        //console.log('Postcodelookup deleteValue');
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
        //console.log('PostcodeLookup validateMultiple');
        // Select component will contain one input when flagged as multiple.
        return false;
    }

    detach() {
        //console.log('PostcodeLookup detach');
        super.detach();
        if (this.choices) {
            this.choices.destroyed = true;
            this.choices.destroy();
            this.choices = null;
        }
    }

    focus() {
        //console.log('PostcodeLookup focus');
        if (this.focusableElement) {
            this.focusableElement.focus();
        }
    }

    setCustomValidity(message, dirty, external) {
        //console.log('PostcodeLookup setCustomValidity');
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
            if (this.refs.postcodeLookupContainer) {
                this.addInputError(message, dirty, [this.refs.postcodeLookupContainer]);
            }
        }
        else if (this.error && this.error.external === !!external) {
            if (this.refs.messageContainer) {
                this.empty(this.refs.messageContainer);
            }
            this.error = null;
            this.removeClass(this.refs.postcodeLookupContainer, 'is-invalid');
            this.clearErrorClasses();
        }
    }
}
