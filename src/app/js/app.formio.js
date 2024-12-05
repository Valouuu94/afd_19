const appFormio = {
    loadDataObject: function (data, config) {
        if (config != null && config.fields != null) {
            for (field of config.fields) {
                if (data != null) {
                    var initValue = data[field.name];

                    if (initValue != null)
                        field.value = initValue;
                }

                if (typeof field.data === 'string')
                    field.data = app.getRef(field.data);
            }
        }

        return config;
    },
    loadFormData: function (form, reset, read) {
        if (crossVars.bdm != null || reset) {
            if (crossVars.params.config != null && crossVars.params.config.fields != null) {
                for (field of crossVars.params.config.fields) {
                    var bdmData = ((reset) ? '' : crossVars.bdm[field.name]);

                    if (bdmData != null) {
                        if (bdmData == false && field.read === true && field.type != 'number')
                            bdmData = '';
                        if(read && field.isMontant)
                            bdmData = app.formatNumberWithDecimals(bdmData);

                        this.setDataValue(form, field.name, bdmData);
                    }
                }
            }
        }
    },
    loadFormIO: function (params, read, id) {
        if (typeof params === 'string') {
            params = {
                id: ((id != null) ? id : 'formio_' + params),
                clean: true,
                config: app.getFormFields(params),
                template: this.generateTemplate(params),
                forceRead: (read != null) ? read : false
            };
        }

        crossVars.params = params;

        if (params.data != null)
            crossVars.bdm = null;

        //objet source
        var dataObject = this.loadDataObject(params.data, params.config);

        //appel du RS2I.formio.connector pour traduire l'objet source en objet Formio avec template optionnel
        var jsonForm = this.translate(dataObject, params.template, params.forceRead);

        Formio.icons = 'fontawesome';

        var isWizard = false;
        var options = { decimalSeparator: ',' };
        if (jsonForm != null && jsonForm.display != null && jsonForm.display == 'wizard') {
            isWizard = true;
            options = {
                buttonSettings: {
                    showCancel: false,
                    showPrevious: false,
                    showNext: false,
                    showSubmit: false
                },
                decimalSeparator: ','
            };
        }

        //creation du formulaire depuis le json vers le div formio
        var formId = 'formio';
        if (params.id != null)
            formId = params.id;

        app.log('### loadFormIO(data, config, template) - DO - jsonForm', params.data, params.config, params.template, dataObject, jsonForm);

        if (crossVars.forms[formId] != undefined && app.getDiv(formId) != '' && !read) {
            app.log('### loadFormIO - form already exist (' + formId + ')');

            this.loadFormData(crossVars.forms[formId], (crossVars.bdm == null), read);
        } else {
            Formio.createForm(document.getElementById(formId), jsonForm, options)
                .then(function (form) {
                    app.log('### loadFormIO - createForm(' + formId + ') = OK', jsonForm);

                    form.nosubmit = true;

                    crossVars.forms[formId] = form;

                    appFormio.loadFormData(form, false, read);

                    form.on('change', function (event) {
                        if (event != null && event.changed != null && event.changed.component != null) {
                            if (event.changed.component.properties != null) {
                                if (event.changed.component.properties.change != null) {
                                    let change = event.changed.component.properties.change;

                                    app.log('formio.change > ', change);

                                    if (change != null && change.length > 0) {
                                        change = change.split('#');
                                        if (change.length == 1)
                                            app[change[0]](form);
                                        else if (change.length == 3)
                                            app[change[0]](change[1])[change[2]](form);
                                    }
                                    // eval(event.changed.component.properties.change + '(form);');
                                }
                            }
                        }
                    });

                    appFormio.setLinksEvent(form, params.config);

                    if (isWizard) {
                        form.on('gotoNextPage', function () {
                            form.nextPage();
                        });
                        form.on('gotoPreviousPage', function () {
                            form.prevPage();
                        });
                        form.on('wizardSave', function () {
                            form.submit().then(function () {
                                form.onChange();
                            });
                        });
                    }

                    form.on('submit', function (submission) {
                        //app.log('#submit', submission.data)
                        //app.setForm(form, params.urlSubmit);
                    });
                });
        }
    },
    getDataValue: function (form, fieldName) {
        var cmp = this.findComponent('key', fieldName, form, true);

        if (form != null && cmp != null)
            return cmp.getValue();

        return null;
    },
    setDataValue: function (form, fieldName, value) {
        if (form != null && form.getComponent(fieldName) != null)
            form.getComponent(fieldName).setValue(value);
    },
    setDataValueVisible: function (form, fieldName, value) {
        var cmp = this.findComponent('key', fieldName, form, true);

        if (form != null && cmp != null)
            cmp.setValue(value);
    },
    setReadOnly: function (form, fieldName, value) {
        var cmp = this.findComponent('key', fieldName, form, true);

        if (form != null && cmp != null) {
            if (cmp.type == 'select') {
                document.getElementById(cmp.id + '-' + fieldName).disabled = value;
                document.getElementById(cmp.id + '-' + fieldName).parentNode.parentNode.childNodes[1].style.display = (value) ? 'none' : 'block';
                if (value) {
                    document.getElementById(cmp.id + '-' + fieldName).parentNode.parentNode.classList.add('is-disabled');
                    document.getElementById(cmp.id + '-' + fieldName).parentNode.setAttribute('disabled', (value) ? 'disabled' : '');
                } else {
                    document.getElementById(cmp.id + '-' + fieldName).parentNode.parentNode.classList.remove('is-disabled');
                    document.getElementById(cmp.id + '-' + fieldName).parentNode.removeAttribute('disabled');
                }
            } else
                document.getElementById(cmp.id + '-' + fieldName).disabled = value;
        }
    },
    setProperty: function (element, name, value) {
        if (value != null)
            element[name] = value;
    },
    findComponent: function (propertyName, propertyValue, object, visible) {
        if (object != null) {
            if (object[propertyName] == propertyValue) {
                if (!visible || (visible && object.visible))
                    return object;
            }
            else if (Array.isArray(object)) {
                for (cmp of object) {
                    searchCmp = this.findComponent(propertyName, propertyValue, cmp, visible);
                    if (searchCmp != null)
                        return searchCmp;
                }
            }
            else if (object.components != null) {
                for (cmp of object.components) {
                    searchCmp = this.findComponent(propertyName, propertyValue, cmp, visible);
                    if (searchCmp != null)
                        return searchCmp;
                }
            }
            else if (object.fields != null) {
                for (cmp of object.fields) {
                    searchCmp = this.findComponent(propertyName, propertyValue, cmp, visible);
                    if (searchCmp != null)
                        return searchCmp;
                }
            }
            else if (object.columns != null) {
                for (col of object.columns) {
                    searchCol = this.findComponent(propertyName, propertyValue, col, visible);
                    if (searchCol != null)
                        return searchCol;
                }
            }
        }
        return null;
    },
    filterRef: function (ref, data, field) {
        var result = [];

        for (refEl of app.getRef(ref))
            if (refEl[field] == data[field])
                result.push(refEl);

        return result;
    },
    setLinksEvent: function (form, config) {
        if (form != null && config != null && config.fields != null && config.fields.length > 0) {
            for (var field of config.fields) {
                if (field.type == 'text' && field.action == 'link') {
                    var cmp = appFormio.findComponent('key', field.name, form, true);

                    var inputId = cmp?.id + '-' + field.name;
                    var input = document.getElementById(inputId);
                    var parent = input?.parentElement;

                    if (parent?.childNodes != null && parent?.childNodes?.length > 3) {
                        var suffix = parent.childNodes[3];
                        suffix.className = "input-group-append cursor-pointer";
                        suffix.inputId = inputId;

                        suffix.addEventListener('click', function (e) {
                            app.gotoLink(document.getElementById(this.inputId).value); 
                        });
                    }
                }
            }
        }
    },
    selectButton: function (form, instance, hiddenName, value) {
        instance.element.classList.toggle("selected");

        form.getComponent(hiddenName + '_' + ((value) ? 'N' : 'Y')).element.classList.remove("selected");

        this.setDataValue(form, hiddenName, value);
    },
    selectToggle: async function (form, hiddenName, value, action) {
        var cmp = form.getComponent(hiddenName);
        var cmpValue = form.getComponent(hiddenName + '_' + value);

        if (cmpValue.element == null) {
            for (var i = 1; i <= 50; i++) {
                console.warn('selectToggle RETRY ' + i + ' > ' + hiddenName);
                await app.sleep(100);
                if (cmpValue.element != null)
                    break;
            }
        }

        cmpValue.element.classList.add("selected");
        form.getComponent(hiddenName + '_' + ((value == 0) ? '1' : '0')).element.classList.remove("selected");

        for (var key of Object.keys(cmp._data)) {
            if (key.includes(hiddenName + "_") && key.charAt(key.length - 1) != value) {
                trouve = true;
                form.getComponent(key).element.classList.remove("selected");
            }
        }

        var actions = null;
        var cmpAction = null;

        if (action != null) {
            actions = action.split(',');

            if (actions != null && actions.length > 1)
                cmpAction = app.getCurrentCmp(actions[0]);

            if (actions.length == 3 && cmpAction != null)
                cmpAction[actions[2]]();
        }

        cmp.setValue(value);

        await app.sleep(100);

        if (actions != null && actions.length > 1 && cmpAction != null)
            cmpAction[actions[1]](value);
    },
    generateTemplate: function (id) {
        var result = { "components": [] };
        var gridWidth = 12;
        var rowCount = 0;

        for (var item of templates[id]) {
            rowCount++;

            if (item.title != undefined || item.subtitle != undefined) {
                var title = {
                    "type": "htmlelement",
                    "tag": "div",
                    "className": ((item.subtitle != undefined) ? "fieldset-subtitle" : "fieldset-title"),
                    "content": ((item.subtitle != undefined) ? item.subtitle : item.title),
                };

                if (item.displayIfValue != null) {
                    title.conditional = {
                        "show": item.displayIfValue.display,
                        "when": item.displayIfValue.field,
                        "eq": item.displayIfValue.value
                    }
                }

                result.components.push(title);
            }

            var row = {
                "type": "columns",
                "columns": []
            };

            var nbColumns = item.columns;
            if (Array.isArray(item.columns))
                nbColumns = item.columns.length;

            var columnWidth = 0;
            var columnSize = '';
            for (var i = 0; i < nbColumns;) {
                if (Array.isArray(item.columns))
                    columnWidth = item.columns[i];
                else
                    columnWidth = gridWidth / item.columns;

                if (item.small != undefined)
                    columnSize = " col-" + item.small[i] + " col-xl-" + columnWidth + " ";
                else {
                    if (columnWidth == 'full')
                        columnSize = " col ";
                    else
                        columnSize = "md";
                }

                i++;

                row.columns.push({
                    "components": [
                        {
                            "type": "fieldset",
                            "key": rowCount + "." + i,
                            "components": []
                        }
                    ],
                    "width": columnWidth,
                    "size": columnSize
                });
            }

            result.components.push(row);
        }

        return result;
    },
    translate: function (data, template, forceRead) {
        var json = {};
        if (data == null) return;

        main = function () {
            //objet json qui sera renvoyé à FormIO
            json = {
                "display": "form",
                "components": []
            };

            //chargement du template si présent pour pouvoir injecter le champs dans les zones cibles
            if (template != null)
                json = template;

            connector();
        };
        //fonction pour mettre une propriété sur un composant
        setProperty = function (element, name, value) {
            if (value != null)
                element[name] = value;
        };
        //fonction pour initialiser les données sur les composants liste
        setData = function (element, datas) {
            if (datas != null) {
                var values = [];

                for (data of datas) {
                    values.push({
                        "label": data.label,
                        "value": data.code
                    });
                }

                element['data'] = { values };
            }
        };
        //fonction pour ajouter un composant à une zone d'un template
        addComponentToTemplate = function (zone, component) {
            if (zone == null)
                zone = '0';

            var c = appFormio.findComponent('key', zone, json, false);
            if (c != null)
                c.components.push(component);
        };
        //fonction pour initialiser qq valeurs par défaut sur un composant Formio
        getDefaultElement = function () {
            return {
                "input": true,
                "labelPosition": "top",
                "validateOn": "change",
                "validate": {}
            };
        };
        //fonction pour ajouter un composant dans un formulaire Formio (classique ou template)
        addComponentToForm = function (element, field) {
            if (template == null)
                json.components.push(element);
            else
                addComponentToTemplate(field.template, element);
        };
        //fonction pour le rendu spécifique sur les contenus boolean 
        renderBoolean = function (element, field) {
            if (field.read != null && field.read) {
                var icone;
                if (field.value == "true")
                    icone = "fa-clipboard-check";
                else {
                    if (field.bloquant != null && field.bloquant)
                        icone = "fa-times false";
                    else
                        icone = "fa-exclamation-triangle falsealert";
                }

                setProperty(element, 'type', 'columns');
                setProperty(element, 'columns', [
                    {
                        "components": [
                            {
                                "type": "htmlelement",
                                "content": field.label,
                                "tag": "span",
                                "className": "col-form-label"
                            }
                        ],
                        "width": 10,
                        "size": "md"
                    },
                    {
                        "components": [
                            {
                                "type": "htmlelement",
                                "tag": "span",
                                "customClass": "text-center",
                                "className": "renderBoolean fa " + icone
                            }
                        ],
                        "width": 2,
                        "size": "md"
                    }
                ]);
            } else {
                if (field.displayIfValue != null) {
                    setProperty(element, 'conditional', {
                        show: field.displayIfValue.display,
                        when: field.displayIfValue.field,
                        eq: field.displayIfValue.value
                    });
                }

                setProperty(element, 'type', 'columns');
                setProperty(element, 'columns', [
                    {
                        "components": [
                            {
                                "type": "htmlelement",
                                "content": field.label,
                                "tag": "span",
                                "className": "col-form-label"
                            },
                            {
                                "type": "hidden",
                                "key": field.name,
                                "defaultValue": "-1"
                            }
                        ],
                        "width": 8,
                        "size": "md"
                    },
                    {
                        "components": [
                            {
                                "type": "columns",
                                "columns": [
                                    {
                                        "components": [
                                            {
                                                "label": "Oui",
                                                "key": field.name + "_Y",
                                                "action": "custom",
                                                "theme": "booleanY",
                                                "size": "sm",
                                                "custom": "appFormio.selectButton(form, instance, '" + field.name + "', true);",
                                                "block": true,
                                                "input": false,
                                                "type": "button"
                                            }
                                        ],
                                        "width": 6,
                                        "size": "md"
                                    },
                                    {
                                        "components": [
                                            {
                                                "label": "Non",
                                                "key": field.name + "_N",
                                                "action": "custom",
                                                "theme": "booleanN",
                                                "size": "sm",
                                                "custom": "appFormio.selectButton(form, instance, '" + field.name + "', false);",
                                                "block": true,
                                                "input": false,
                                                "type": "button"
                                            }
                                        ],
                                        "width": 6,
                                        "size": "md"
                                    }
                                ]
                            }
                        ],
                        "width": 4,
                        "size": "md"
                    }
                ]);
            }
        };
        renderToggle = function (element, field) {
            setProperty(element, 'type', 'columns');
            setProperty(element, 'columns', [
                {
                    "components": [
                        {
                            "type": "htmlelement",
                            "content": (field.hideLabel ? '' : field.label + (field.tooltip ? '<i class="fas fa-question-circle info-bulle" title="' + field.tooltip + '"></i>' : '')),
                            "tag": "span",
                            "className": "col-form-label" + ((field.required) ? ' field-required' : '')
                        }
                    ],
                    "width": 12,
                    "size": "md"
                },
                {
                    "components": [
                        {
                            "type": "fieldset",
                            "customClass": "d-flex formio-toggle",
                            "components": [
                                {
                                    "type": "button",
                                    "label": field.label1,
                                    "key": field.name + "_1",
                                    "theme": "toggle",
                                    "customClass": "toggle-1",
                                    "action": "custom",
                                    "custom": "appFormio.selectToggle(form, '" + field.name + "', '1', '" + field.action + "');"
                                },
                                {
                                    "type": "button",
                                    "label": field.label0,
                                    "key": field.name + "_0",
                                    "theme": "toggle",
                                    "customClass": (field.label2 != undefined ? "toggle-0 toggle-1" : "toggle-0"),
                                    "action": "custom",
                                    "custom": "appFormio.selectToggle(form, '" + field.name + "', '0', '" + field.action + "');"
                                },
                                {
                                    "type": (field.label2 != undefined ? "button" : "hidden"),
                                    "label": field.label2,
                                    "key": field.name + "_2",
                                    "theme": "toggle",
                                    "customClass": "toggle-0",
                                    "action": "custom",
                                    "custom": "appFormio.selectToggle(form, '" + field.name + "', '2', '" + field.action + "');"
                                }
                            ]
                        }
                    ],
                    "width": 12,
                    "size": "md"
                },
                {
                    "components": [
                        {
                            "type": "hidden",
                            "key": field.name,
                            "defaultValue": "",
                            "label": field.label,
                            "validate": {
                                "required": field.required
                            }
                        }
                    ],
                    "width": 12,
                    "size": "md"
                }
            ]);
        };
        renderTeleport = function (element, field) {
            setProperty(element, 'type', 'columns');
            setProperty(element, 'columns', [
                {
                    "components": [
                        {
                            "type": "htmlelement",
                            "tag": "span",
                            "className": field.ref,
                            "customClass": "teleport-element element-" + field.ref
                        }
                    ],
                    "width": 12,
                    "size": "md"
                }
            ]);
        };
        //fonction pour faire le mapping depuis un objet json vers le format formio
        connector = function () {
            if (data.fields != null && data.fields.length > 0) {
                for (field of data.fields) {
                    var element = getDefaultElement();

                    if (forceRead)
                        field.read = true;

                    if (field.read == true && field.type == 'boolean') {
                        field.type = 'combo';
                        field.data = refs['refBoolean'];
                    }

                    //mapping des proprietes communes
                    setProperty(element, 'key', field.name);
                    setProperty(element, 'label', field.label);
                    setProperty(element, 'label-position', 'left');
                    setProperty(element, 'defaultValue', field.value);
                    setProperty(element, 'placeholder', field.placeholder);
                    setProperty(element, 'tooltip', field.tooltip);
                    setProperty(element, 'disabled', field.read);
                    setProperty(element, 'customClass', field.css);
                    setProperty(element, 'description', field.helper);

                    if (field.label == null || field.label == '')
                        setProperty(element, 'hideLabel', 'true');
                    else
                        setProperty(element, 'hideLabel', field.hideLabel);

                    //mapping des proprietes en fonction du type de field
                    switch (field.type) {
                        case 'date': //champ de type saisie de date
                            setProperty(element, 'type', 'datetime');
                            setProperty(element, 'format', 'dd/MM/yyyy');
                            setProperty(element, 'placeholder', 'JJ/MM/AAAA');
                            setProperty(element, 'enableTime', false);
                            setProperty(element, 'customClass', 'formio-date');
                            // setProperty(element, 'datePicker', { disableFunction: "date > new Date('2023-05-01') && date < new Date('2023-05-08')" } );
                            if (field.limitNow != null && !field.read) {
                                if (field.limitNow == ">")
                                    setProperty(element, 'datePicker', { disableFunction: "date > new Date()" });
                                else
                                    setProperty(element, 'datePicker', { disableFunction: "date < new Date(new Date().setDate(new Date().getDate() - 1))" });
                            }
                            break;
                        case 'textarea': //champ de type saisie de texte long
                            setProperty(element, 'type', 'textarea');
                            setProperty(element, 'rows', '3');
                            break;
                        case 'number': //champ de type saisie de nombre
                            // ANOMALIE 2075 LIDIA
                            if(forceRead && field.isMontant)
                                setProperty(element, 'type', 'textfield');
                            else {
                                setProperty(element, 'type', 'number');
                                if (field.isMontant) 
                                    setProperty(element, 'delimiter', true);
                               
                                setProperty(element, 'decimalLimit', 2);
                                setProperty(element, 'decimalSymbol', ',');
                            } 
                            setProperty(element, 'customClass', (field.css != null ? field.css : 'formio-number') + (field.isMontant ? ' formio-amount' : '')); 
                            if (field.suffix != null) {
                                setProperty(element, 'suffix', field.suffix);
                                setProperty(element, 'customClass', (field.css != null ? field.css + ' formio-suffix' : 'formio-number formio-suffix'));
                            }
                            break;
                        case 'email': //champ de type saisie d'adresse mail
                            setProperty(element, 'type', 'email');
                            setProperty(element, 'prefix', '@');
                            setProperty(element.validate, 'customMessage', 'Le format de l\'adresse mail est incorrect');
                            break;
                        case 'combo': //champ de type liste deroulante
                            setProperty(element, 'type', 'select');
                            setProperty(element, 'multiple', field.multi);
                            setProperty(element, 'searchEnabled', field.search);
                            // setProperty(element, 'customOptions', { searchResultLimit: 10, searchFloor: 3, renderChoiceLimit: 10, fuseOptions: { threshold: 0.1, distance: 1000 }, position: ((field.search == undefined || field.search) ? 'bottom' : 'auto') });
                            setProperty(element, 'customOptions', { searchResultLimit: 999, fuseOptions: { threshold: 0.1, distance: 1000 }, position: ((field.search == undefined || field.search) ? 'bottom' : 'auto') });
                            // setProperty(element, 'useExactSearch', true);
                            // setProperty(element, 'searchThreshold', 0.7);

                            if (field.url != null) {
                                setProperty(element, 'dataSrc', 'url');
                                setProperty(element, 'lazyLoad', true);
                                setProperty(element, 'valueProperty', field.propertyCode);
                                setProperty(element, 'selectValues', 'Results');
                                setProperty(element, 'template', '<span>{{ item.' + field.propertyLabel + ' }}</span>');
                                //setProperty(element, 'data', { url: field.url });
                                setProperty(element, 'data', { url: field.url ,headers: [{key:"BToken",value:app.getStorageItem('userInfo').rawCookie}]});
                            } else {
                                setProperty(element, 'template', '<span>{{ item.label }}</span>');
                                if (field.filteredRef == null) {
                                    setProperty(element, 'dataSrc', 'values');
                                } else {
                                    setProperty(element, 'dataSrc', 'custom');
                                    setProperty(element, 'valueProperty', 'code');
                                    setProperty(element, 'data', {
                                        "custom": "values = appFormio.filterRef('" + field.dataRef + "', data, '" + field.filteredRef + "')"
                                    });
                                }
                            }
                            break;
                        case 'boolean': //champ de type case à cocher
                            setProperty(element, 'type', 'checkbox');
                            setProperty(element, 'inputType', 'checkbox');
                            setProperty(element, 'labelPosition', 'right');
                            break;
                        case 'datagrid':
                            setProperty(element, 'type', 'datagrid');
                            setProperty(element, 'hideLabel', true);
                            setProperty(element, 'components', field.cmps);
                            break;
                        case 'label':
                            setProperty(element, 'type', 'htmlelement');
                            setProperty(element, 'content', field.label);
                            setProperty(element, 'tag', 'span');
                            setProperty(element, 'className', 'col-form-label');
                            break;
                        case 'toggle':
                            element = getDefaultElement();
                            renderToggle(element, field);
                            break;
                        case 'button':
                            setProperty(element, 'type', 'button');
                            setProperty(element, 'theme', field.theme);
                            if (field.click != null) {
                                setProperty(element, 'action', 'custom');
                                setProperty(element, 'custom', field.click);
                            }
                            break;
                        case 'hidden':
                            setProperty(element, 'type', 'hidden');
                            break;
                        case 'teleport':
                            element = getDefaultElement();
                            renderTeleport(element, field);
                            setProperty(element, 'className', 'formio-teleport');
                            break;
                        default: //par default, on met un champ texte classique
                            setProperty(element, 'type', 'textfield');
                            setProperty(element, 'inputType', 'text');
                            setProperty(element, 'tooltip', field.tooltip);
                            setProperty(element, 'description', field.helper);

                            if (field.suffix != null) {
                                setProperty(element, 'suffix', field.suffix);
                            }
                            break;
                    }

                    //rendu specifique pour les boolean
                    if (field.renderBoolean != null && field.renderBoolean) {
                        element = getDefaultElement();
                        renderBoolean(element, field);
                    } else {
                        //mapping pour les proprietes de validation de la saisie
                        if (field.type != 'toggle')
                            setProperty(element.validate, 'required', field.required);

                        setProperty(element.validate, 'customMessage', field.error);
                        setProperty(element.validate, 'custom', field.customValidate);
                        if (field.type == 'number') {
                            setProperty(element.validate, 'max', field.max);
                            setProperty(element.validate, 'min', field.min);
                        } else {
                            setProperty(element.validate, 'maxLength', field.max);
                            setProperty(element.validate, 'minLength', field.min);
                        }
                        if (field.validIfValue != null)
                            setProperty(element.validate, 'custom', "valid = (input " + field.validIfValue.operator + " '" + field.validIfValue.value + "') ? true : '" + field.validIfValue.error + "';");

                        //mapping pour les conditions d'affichage
                        setProperty(element, 'customConditional', field.customConditional);
                        if (field.displayIfValue != null) {
                            setProperty(element, 'conditional', {
                                show: field.displayIfValue.display,
                                when: field.displayIfValue.field,
                                eq: field.displayIfValue.value
                            });
                        }

                        //mapping des données pour les elements listes
                        if (field.filteredRef == null)
                            setData(element, field.data);

                        if (field.change != null)
                            setProperty(element, 'properties', { "change": field.change });
                        //setProperty(element, 'attributes', { "v-on:change": "changeBeneficiaire" });
                    }

                    //ajout du composant au formulaire ou au template
                    addComponentToForm(element, field);
                }
            }
        };

        main();

        //on renvoie le json qui sera intégrer à la methode createForm de FormIo
        return json;
    }
};