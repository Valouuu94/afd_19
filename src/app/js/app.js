String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a;
};
var crossVars = {
    params: null,
    form: null,
    forms: [],
    bdm: null,
    currentCmps: {}
};

const app = {
    getExternalData: async function (url, parentLog, getFirstResult, noCookie) {
        var logLabel = 'getExternalData' + ((parentLog != undefined) ? ' (' + parentLog + ')' : '');

        try {
            var response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'BToken': (noCookie) ? '' : this.getStorageItem('userInfo').rawCookie
                }
            });

            if (response.status >= 300) {
                console.error(logLabel + ' - status', response.status);
                return;
            }
            var text = await response.text();

            if (text.length != 0) {

                var json = await JSON.parse(text);

                this.log(logLabel, url, 'result', json);
                if (getFirstResult && json != null && json.length > 0)
                    return json[0];
                else
                    return json;
            }
            return null;
        } catch (error) {
            console.error(logLabel, error);
            return;
        }
    },
    setExternalData: async function (url, data, method, auth) {
        var headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Bonita-API-Token': this.getCookie('X-Bonita-API-Token'),
            'BToken': this.getStorageItem('userInfo').rawCookie
        };

        if (auth)
            headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'BToken': this.getStorageItem('userInfo').rawCookie
            };

        this.log('setExternalData - url', url);

        try {
            var response = await fetch(url, {
                method: ((method == null) ? 'POST' : method),
                headers: headers,
                body: JSON.stringify(data)
            });

            if (response.status >= 300) {
                console.error(' - status', response.status);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return;
        }
    },
    setExternalDataWithResult: async function (url, data, method) {
        var headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Bonita-API-Token': this.getCookie('X-Bonita-API-Token'),
            'BToken': this.getStorageItem('userInfo').rawCookie
        };

        this.log('setExternalDataWithResult - url', url);

        var response = await fetch(url, {
            method: ((method == null) ? 'POST' : method),
            headers: headers,
            body: JSON.stringify(data)
        });

        var json = await response.json();

        return json;
    },
    getCurrentLang: function () {
        var lang = this.getLocalStorageItem('currentLang');

        if (lang == null) { //langue par défaut
            this.setLocalStorageItem('currentLang', 'fr');
            return 'fr';
        } else
            return lang;
    },
    redirect: function (router, url) {
        this.log('redirect', url);
        if (url != null && url.indexOf('/controles') != -1 && url.indexOf('/param/controles') == -1)
            this.redirectUrl(url, true, true);
        else
            router.navigate([url]);
    },
    redirectUrl: function (url, addPath, reload) {
        var url = ((addPath) ? document.location.origin + document.location.pathname + '#' + url : url);
        this.log('redirectUrl', url);
        window.top.location.assign(url);
        if (reload)
            window.top.location.reload();
    },
    gotoLink: function (url) {
        if (!app.isEmpty(url))
            window.open(url);
    },
    gotoLinkById: function (id) {
        var url = document.getElementById(id).value;
        if (!app.isEmpty(url))
            window.open(url);
    },
    log: function (value, ...object) {
        if (enableLog)
            console.log(value, ...object);
    },
    copyJson: function (json) {
        return JSON.parse(JSON.stringify(json));
    },
    cleanDiv: function (id) {
        $('#' + id).html('');
    },
    getDiv: function (id) {
        return $('#' + id).html();
    },
    showModal: function (id) {
        $('#' + id).modal('show');
    },
    hideModal: function (id) {
        $('#' + id).modal('hide');
    },
    refreshModal: async function (id, skipSleep) {
        console.warn('refreshModal > ' + id);

        if (skipSleep)
            $('#' + id).removeClass('fade');

        this.hideModal(id);

        if (!skipSleep)
            await this.sleep(1000);
        else {
            document.getElementById(id).style.display = 'block';

            await this.sleep(500);
        }

        this.showModal(id);

        if (skipSleep)
            $('#' + id).addClass('fade');
    },
    changeCssIndex: function (id, index) {
        $('#' + id).css('z-index', index);
    },
    showToast: function (id, long) {
        var toast = document.getElementById(id);
        if (toast.className.indexOf('show') == -1) {
            toast.className += ' show';

            setTimeout(function () {
                toast.className = toast.className.replace(' show', '');
            }, ((long) ? 14000 : 7000));
        }
    },
    getFirstJsonKey: function (json) {
        return Object.keys(json)[0];
    },
    isNotEmpty: function (value) {
        return (value != null && value != '');
    },
    isEmpty: function (value) {
        return (value == null || value == '');
    },
    renderEmpty: function (value) {
        if (value != null && typeof value == 'string' && value.indexOf('undefined') != -1)
            return '';
        else
            return (value == null || typeof value == 'object' || this.trim(value) == '') ? '-' : value;
    },
    nvl: function (value, prefix) {
        return (this.isEmpty(value)) ? '' : ((prefix != null) ? prefix + value : value);
    },
    setFocus: function (id) {
        $('#' + id).focus();
    },
    getUrlHost: function () {
        return window.location.origin;
    },
    getUrl: function (urlName, ...params) {
        var url = urls[urlName];

        if (url == undefined) {
            console.error('getUrl : url not found', urlName);
            return;
        }

        if (params != undefined && params.length > 0)
            return new String(url).format(...params);
        else
            return url;
    },
    formatString: function (value, ...params) {
        return new String(value).format(...params);
    },
    formatTextMultiLines: function (text) {
        return (text != null) ? text.replace(/\n/g, '<br>') : text;
    },
    formatDate: function (date, reverse) {
        var result = date;

        if (date == null || date == 'null')
            return '';
        else if (date != null && date.length >= 10) {
            if (date.indexOf('T') != - 1) {
                var split = date.split('T');

                if (split != null && split.length == 2) {
                    var splitDate = split[0].split('-');

                    if (splitDate != null && splitDate.length == 3) {
                        if (reverse)
                            result = splitDate[0] + '-' + splitDate[1] + '-' + splitDate[2];
                        else
                            result = splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];
                    }
                }
            } else
                return date.substring(8, 10) + '/' + date.substring(5, 7) + '/' + date.substring(0, 4);
        }
        return result;
    },
    formatHours: function (value) {
        return (value != null) ? value.substr(11, 8) : '';
    },
    formatNumber: function (number) {
        if (number != null)
            return this.convertStringToFloat(number).toLocaleString('fr');
        return '';
    },

    formatNumberWithDecimals(number) {
        if (number == null)
            number = 0;

        const formattedNumber = parseFloat(number).toFixed(2);
        const parts = formattedNumber.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Add space as thousands separator

        return parts.join(',');
    },
    capitalize: function (s, keepCase) {
        if (s == null || s.length < 2)
            return s;
        if (keepCase)
            return s[0].toUpperCase() + s.slice(1);
        else
            return s[0].toUpperCase() + s.slice(1).toLowerCase();
    },
    removeSpaces: function (s) {
        if (s != null)
            return s.replace(new RegExp(" ", 'g'), '').toLowerCase();
    },
    scrollTo: function (id) {
        // document.getElementById(id).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        const y = document.getElementById(id).getBoundingClientRect().top + window.pageYOffset - 150;
        this.log('scrollTo : ', y, id);
        window.scrollTo({ top: y, behavior: 'smooth' });
        return false;
    },
    scrollToTop: function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    },
    getCookie: function (name) {
        var cookieArr = document.cookie.split(";");

        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");

            if (name == cookiePair[0].trim())
                return decodeURIComponent(cookiePair[1]);
        }

        return null;
    },
    loadChart: function (type, containerId, data) {
        this.log('loadChart : ', type, containerId, data);

        var ctx = document.getElementById(containerId);

        if (ctx == null) {
            console.error('loadChart : ' + containerId + ' not exist');
            return;
        }

        var labels = [];
        var values = [];
        var colors = [];

        for (el of data) {
            labels.push(el.label);
            values.push(el.value);
            colors.push(el.color);
        }

        var myChart = new Chart(ctx, {
            type: type,
            borderColor: '#FFFFFF',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 5
                }]
            },
            options: {
                cutoutPercentage: 60,
                responsive: true,
                legend: {
                    display: false,
                    position: 'bottom'
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10
                }
            }
        });

        this.log('loadChart end : ', myChart);
    },
    toggleMenuSidebar: function () {
        $('#sidebar').toggleClass('active');
        // $('[data-tooltip="true"]').tooltip('toggleEnabled');
    },
    initMenuSidebar: function () {
        // $('[data-tooltip="true"]').tooltip();
        // $('[data-tooltip="true"]').tooltip('disable');
        $('#sidebar .list-unstyled.components').show();
        // $('[data-toggle="tooltip"]').tooltip();
    },
    renderTooltips: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    destroyTooltips: function () {
        $('[data-toggle="tooltip"]').tooltip('dispose');
    },
    findInArray: function (items, key, value) {
        for (var item of items)
            if (item[key] == value)
                return item;
    },
    findInArrayOrga: function (items, key1, value1, key2, value2) {
        for (var item of items)
            if (item[key1] == value1 && item[key2] == value2)
                return item;
    },
    getElementInArray: function (items, key, value) {
        if (items != null && items.length > 0) {
            for (var item of items)
                if (item != null && item[key] == value)
                    return item;
        }
        return null;
    },
    existInArray: function (items, key, value) {
        if (items != null) {
            if (items.length > 0) {
                for (var item of items)
                    if (item != null && item[key] == value)
                        return true;
            }
        }
        return false;
    },
    existStringInArray: function (items, value) {
        if (items == null)
            return true;
        for (var item of items)
            if (item == value)
                return true;
        return false;
    },
    getFormFields: function (type) {
        return this.copyJson({ fields: formFields[type] });
    },
    sleep: async function (time) {
        await new Promise(r => setTimeout(r, time));
    },
    getDO: function (name) {
        var DO = dataObjects[name];
        var DOResult = DO[this.getFirstJsonKey(DO)];

        for (var key of Object.keys(DO[this.getFirstJsonKey(DO)]))
            if (DOResult[key] == undefined)
                DOResult[key] = null;

        return DOResult;
    },
    getRootDO: function (name) {
        return dataObjects[name];
    },
    resetDO: function (item) {
        var DO = (typeof item == 'string') ? this.getDO(item) : item;

        for (var key of Object.keys(DO)) {
            if (DO[key] != null && typeof DO[key] == 'object' && Object.keys(DO[key]).length != 0)
                this.resetDO(DO[key]);
            else if (DO[key] != null) {
                if (typeof DO[key] == 'boolean')
                    DO[key] = false;
                else if (Array.isArray(DO[key]))
                    DO[key] = [];
                else if (key.startsWith('date') || DO[key] == 0)
                    DO[key] = null;
                else
                    DO[key] = "";
            }
        }
        return DO;
    },
    resetRootDO: function (item) {
        var DORoot = (typeof item == 'string') ? this.getRootDO(item) : item;

        for (var key of Object.keys(DORoot)) {
            if (DORoot[key] != null && typeof DORoot[key] == 'object' && Object.keys(DORoot[key]).length != 0)
                this.resetRootDO(DORoot[key]);
            else if (DORoot[key] != null) {
                if (typeof DORoot[key] == 'boolean')
                    DORoot[key] = false;
                else if (Array.isArray(DORoot[key]))
                    DORoot[key] = [];
                else if (key.startsWith('date') || DORoot[key] == 0)
                    DORoot[key] = null;
                else
                    DORoot[key] = "";
            }
        }
        return DORoot;
    },
    mapDO: function (DO, object, skipBoolean) {
        if (DO != null) {
            for (var key of Object.keys(DO)) {
                if (!(DO[key] != null && typeof DO[key] == 'object' && Object.keys(DO[key]).length != 0)) {
                    if (object[key] == null && !typeof DO[key] == 'number')
                        DO[key] = (key.includes('date')) ? null : '';
                    else
                        DO[key] = object[key];
                }

                if (skipBoolean == null && (typeof DO[key] == "boolean" || (typeof DO[key] == "string" && (DO[key] == "Y" || DO[key] == "N"))))
                    DO[key] = this.mapBoolean(DO[key]);
            }
        }

        return DO;
    },
    mapBoolean: function (value) {
        if (typeof value == 'string')
            return (value == 'Y') ? true : false;
        else
            return (Boolean(value)) ? 'Y' : 'N';
    },
    setBDM: function (DO) {
        crossVars.bdm = DO;
    },
    fillRef: function (name, items, code, label) {
        var ref = [];
        for (var item of items)
            ref.push({ code: item[code], label: item[label] });
        return refs[name] = ref;
    },
    getCurrentCmp: function (type) {
        return crossVars.currentCmps[type];
    },
    setCurrentCmp: function (type, cmp) {
        crossVars.currentCmps[type] = cmp;
    },
    getStorageItem: function (key) {
        var item = sessionStorage.getItem(key);
        if ((!Array.isArray(item) && item != null && item != undefined && item != "undefined") || (Array.isArray(item) && item.length > 0))
            return JSON.parse(item);
    },
    setStorageItem: function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    removeStorageItem: function (key) {
        sessionStorage.removeItem(key);
    },
    getLocalStorageItem: function (key) {
        var item = localStorage.getItem(key);
        if ((!Array.isArray(item) && item != null && item != undefined && item != "undefined") || (Array.isArray(item) && item.length > 0))
            return JSON.parse(item);
    },
    setLocalStorageItem: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    removeLocalStorageItem: function (key) {
        localStorage.removeItem(key);
    },
    hasRightButton: function (store, rightParentPage) {
        return (app.getRight(store, rightParentPage) > 1);
    },
    hasRight: function (store, right) {
        return (app.getRight(store, right) != 0);
    },
    getRight: function (store, key) {
        var rights = store.getRights(); //récup droits depuis l'api habilitation
        var userName = store.getUserName();  //rôle current user
        var rubrique = null;
        var fonction = null;
        var droit = 0;

        if (key != null && key.indexOf('.') != -1) {
            var split = key.split('.');

            rubrique = split[0];
            fonction = split[1];
        }

        if (rights != null && rights.user != null && rights.user == userName && rubrique != null && fonction != null) {
            // droit = 0
            for (var right of rights.userHabilitations) {
                if (right.codeRubrique == rubrique && right.codeFonctionnalite == fonction) {

                    if (right.niveauHabilitation != null) {
                        droit = right.niveauHabilitation;
                        break;
                    }
                }
            }
        }

        return droit;
    },
    loadRights: async function (userName) {
        return await this.getExternalData(this.getUrl('urlHabilitationsByUserId', userName), 'loadRights > ' + userName);
    },
    loadRefs: async function () {
        for (var ref of Object.keys(refs))
            if (!Array.isArray(refs[ref]))
                await this.loadRef(ref);
    },
    loadRef: async function (ref) {
        if (this.getStorageItem(ref) == null) {
            var items = await this.getExternalData(this.getUrl(refs[ref].url, refs[ref].param), 'loadRef > ' + ref);
            if (items != null) {
                this.setStorageItem(ref, items.map(item => {
                    if (item.code == null)
                        item.code = item[refs[ref].code];
                    if (item.label == null) {
                        if (Array.isArray(refs[ref].label))
                            for (var labelItem of refs[ref].label)
                                item.label = (item.label != null ? item.label : '') + item[labelItem] + ' ';
                        else
                            item.label = item[refs[ref].label];
                        if (refs[ref].labelLong != null)
                            item.labelLong = item[refs[ref].labelLong];
                    }

                    if (refs[ref].mergeCodelabel)
                        item.label = item.code + ' - ' + item.label;
                        
                    if (refs[ref].keepOnlyCodeLabel) {
                        return {
                            code: item.code,
                            label: item.label
                        };
                    } else
                        return item;
                }));
            }
        }
    },
    getRefLabel: function (ref, value, isLabelLong) {
        var refStorage, refCode, refLabel;
        refCode = 'code';
        refLabel = 'label';

        if (Array.isArray(refs[ref]))
            refStorage = refs[ref];
        else {
            refStorage = this.getStorageItem(ref);
            if (refs[ref] != null && !refs[ref].keepOnlyCodeLabel && !Array.isArray(refs[ref].label)) {
                refCode = refs[ref].code;
                refLabel = refs[ref].label;
            }
        }

        if (refStorage != null) {
            for (var item of refStorage)
                if (item[refCode] == String(value))
                    return item[refLabel];
        }
        return value;
    },
    getObjectLabelByKey: function (list, keyCode, keyLabel, value) { //Nour 28/03 : récupérer lib d'un objet json dans une liste (ref)
        if (list != null && list.length > 0) {
            for (var item of list) {
                if (item[keyCode] == String(value))
                    return item[keyLabel];
            }
        }
        return value;
    },
    getRef: function (ref) {
        if (Array.isArray(refs[ref]))
            return refs[ref];
        else
            return this.getStorageItem(ref);
    },
    //à modifier LIDIA
    setRef: function (ref, nameRef, refCode, refLabels) {
        var refResult = [];
        for (var item of ref) {

            var label = '';

            if (Array.isArray(refLabels))
                for (var refLabel of refLabels)
                    label = label + (label == '' ? '' : ' - ') + item[refLabel];
            else
                label = item[refLabels];

            refResult.push({ code: item[refCode], label: label });
        }
        refs[nameRef] = refResult;
    },
    setRefParam: function (ref, param) {
        if (refs[ref] != null && !Array.isArray(refs[ref]))
            refs[ref].param = param;
    },
    isValidForm: function (id) {
        crossVars.forms[id].submit();

        return crossVars.forms[id].checkValidity(crossVars.forms[id].submission.data);
    },
    getUser: async function () {
        var user = {
            id: null,
            name: null
        };
        var session = await this.getExternalData(this.getUrl('urlGetSession'), 'getUserId > session');
        if (session == undefined)
            return; //TODO rajouter une erreur IHM si pas de session (erreur 401)

        user.id = session.user_id;
        user.name = session.user_name;

        return user;
    },
    getUserRole: async function (userContext) {
        var rolesResult = [];
        if (userContext != null && userContext.utilisateurEntites != null && userContext.utilisateurEntites.length > 0) {
            for (var utilisateurEntite of userContext.utilisateurEntites)
                if (!rolesResult.includes(utilisateurEntite.id.roleUtilisateur))
                    rolesResult.push(utilisateurEntite.id.roleUtilisateur);
        }
        return rolesResult;
    },
    getUserGroup: async function (userId) {
        if (userId == null)
            userId = await this.getUserId();

        var userGroup = await this.getExternalData(this.getUrl('urlGetGroupUser', userId), 'getUserGroup', true);

        if (userGroup == null || userGroup.group_id == null)
            return;
        if (userGroup.group_id.parent_path.length > 0)
            return userGroup.group_id.parent_path.replace('/', '');
        else
            return userGroup.group_id.name;
    },
    getUserPerimetre: async function (userId) {
        var userGroup = await this.getExternalData(this.getUrl('urlGetGroupUser', userId), 'getUserPerimetre', true);

        if (userGroup != null && userGroup.group_id != null && userGroup.group_id.path != null &&
            userGroup.group_id.path.includes(ent.afd) && userGroup.group_id.displayName == 'DCV')
            return 'niveau_2';
        else
            return 'niveau_1';
    },
    getUserContext: async function () {
        var userContext = await this.getExternalData(this.getUrl('urlGetUserContext'), 'getUserContext', true);
        return userContext;
    },

    getRoleUser: async function () {
		var userCtx = await this.getUserContext();
		return userCtx.utilisateurEntites[0].roleUtilisateur ;
	},

    getUserInitiales(value) {
        var result = '';
        if (value != null) {
            var split = value.split(' ');
            if (split != null && split.length >= 2)
                result = split[0].substring(0, 1).toUpperCase() + split[1].substring(0, 1).toUpperCase();
        }
        return result;
    },
    getTacheFromCase: async function (caseId, userId) {
        var tache = await this.getExternalData(this.getUrl('urlGetTachesByCase', userId, caseId), 'getTacheFromCase');

        if (tache != null && tache.length > 0)
            return tache[0];
        return null;
    },
    isReadTask: async function (page, caseId, userId) {
        var read = true;

        page.tache = await this.getTacheFromCase(caseId, userId);

        if (page.tache != null && (page.tache.assigned_id == '' || page.tache.assigned_id == userId)) {
            read = false;
            //await this.assignTache(page.tache.id, userId);
        }

        return read;
    },
    isActiveTask: async function (caseId, userId) {
        var tache = await this.getTacheFromCase(caseId, userId);
        this.log('isActiveTask > caseId - userId - tache', caseId, userId, tache);
        return (tache != null && tache.state == 'ready');
    },
    getEtapeTache: function (tache) {
        this.log('getEtapeTache', tache);

        if (tache != null && tache.description != null) {
            var description = tache.description.split('-');

            this.log('getEtapeTache desc', description);

            if (description.length > 1)
                return description[1];
        }
        return '';
    },
    getTypeTache: function (tache) {
        if (tache != null && tache.description != null) {
            var description = tache.description.split('-');

            if (description.length > 1)
                return description[0];
        }
        return '';
    },
    getRoleTache: function (tache) {
        if (tache != null && tache.description != null) {
            var description = tache.description.split('-');

            if (description.length > 1)
                return description[2];
        }
        return '';
    },
    saveFormData: async function (DO, form, urlSetDO, urlProcess) {
        this.log('saveFormData before update', DO);

        var mainKey = this.getFirstJsonKey(DO);

        if (form != null && Object.keys(DO).length > 0) {
            for (var key of Object.keys(DO[mainKey])) {
                var value = appFormio.getDataValue(form, key);

                if (value != null) {
                    if (value == '' && key.startsWith('date'))
                        DO[mainKey][key] = null;
                    else if (Array.isArray(value)) {
                        var resultValue = [];

                        for (var valueC of value)
                            resultValue.push({ 'persistenceId': valueC });

                        DO[mainKey][key] = resultValue;
                    }
                    else if (typeof value == "string" && (value == "Y" || value == "N"))
                        DO[mainKey][key] = this.mapBoolean(value);
                    else
                        DO[mainKey][key] = value;
                }
            }
        }

        this.log('saveFormData after update', DO);

        if (urlProcess != undefined)
            return await this.postData(DO, urlSetDO, urlProcess);
        else
            return DO;
    },
    postData: async function (DO, urlSetDO, urlProcess) {
        //process definition id
        var process = await this.getExternalData(urlProcess);
        var processDefinitionId = process[0].id;
        this.log('postData - processDefinitionId', processDefinitionId);

        //url save
        urlSetDO = new String(urlSetDO).format(processDefinitionId);
        this.log('postData - urlSetDO', urlSetDO);

        var headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Bonita-API-Token': this.getCookie('X-Bonita-API-Token'),
            'BToken': this.getStorageItem('userInfo').rawCookie
        };

        this.log('postData - headers', headers);

        var response = await fetch(urlSetDO, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(DO)
        });

        if (response.status >= 300) {
            console.error('postData : ERROR - status', response.status, urlSetDO);
            return;
        }

        var json = await response.json();

        this.log('postData : OK', json);

        return json;
    },
    assignTache: async function (tacheId, value) {
        var DO = this.getDO('updateTache');
        DO.assigned_id = value;

        await this.setExternalData(this.getUrl('urlUpdateTask', tacheId), DO, 'PUT');
    },
    changeBeneficiaireVersement: function () {
        this.getCurrentCmp('versement').getBeneficiaireVersement();
    },
    changePretAdosse: function () {
        this.getCurrentCmp('reglement').changePretAdosse();
    },
    changeDetailAvanceContractuel: function () {
        this.getCurrentCmp('reglement').getAvanceContractuel();
    },
    changeBeneficiaireReglement: function () {
        this.getCurrentCmp('reglement').getBeneficiaireReglement();
    },
    changeDetailDocumentContractuel: function () {
        this.getCurrentCmp('reglement').getDetailDocumentContractuel();
    },
    changeConcoursReglement: function () {
        this.getCurrentCmp('reglement').getConcours();
    },
    saveCommentaire: async function (parentId, parentType, caseId, value) {
        var DO = this.getDO('commentaire');
        DO.typePartentObject = parentType;
        DO.persistanceIdParentObject = parentId;
        DO.caseIdParentObject = caseId;
        DO.texteCommentaire = value;

        await this.saveFormData(this.getRootDO('commentaire'), null, this.getUrl('urlProcessInstanciation'), this.getUrl('urlProcessAddCommentaire'));
    },

    getDateForFile: function() {
        var date = new Date();
        var month = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
        var hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        var seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        return date.getFullYear().toString() + month + day + '-' + hours + minutes + seconds;
    },

    downloadDocument: async function (reglement, download, caseId) {
        this.log("downloadDocument > reglement, caseId", reglement, caseId);

        if (reglement != null && !app.isEmpty(reglement.path_pdf_final)) {
            await app.getExternalData(app.getUrl('urlGetAuthorization'), 'giveMeAuthorization > getAuthorization');
            this.log("GIGA TEST");
            this.log("downloadDocument final > open pdf direct url", this.getUrl('urlGetDdrPdfFinal', reglement.persistenceId));

            fetch(this.getUrl('urlGetDdrPdfFinal', reglement.persistenceId),
                {
                    method: 'GET',
                    headers: {
                        'BToken': this.getStorageItem('userInfo').rawCookie
                    }
                })
                .then((response) => response.blob())
                .then((blob) => {
                    var filename = 'DDR_' + reglement.code_fonctionnel + '_' + this.getDateForFile();
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.setAttribute('download', filename);
                    link.setAttribute('target', '_blank');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);  
                })

        } else {

            await app.getExternalData(app.getUrl('urlGetAuthorization'), 'giveMeAuthorization > getAuthorization');

            this.log("download Document DR intérmédiaire > open pdf direct url", this.getUrl('urlGetArchivedCaseDocuments', reglement.persistenceId));

            fetch(this.getUrl('urlGetArchivedCaseDocuments', reglement.persistenceId),
                {
                    method: 'GET',
                    headers: {
                        'BToken': this.getStorageItem('userInfo').rawCookie
                    }
                })
                .then((response) => response.blob())
                .then((blob) => {
                    // var _url = window.URL.createObjectURL(blob);
                    // window.open(_url, "_blank").focus();

                    var filename = 'DDR_' + reglement.code_fonctionnel + '_' + this.getDateForFile();
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.setAttribute('download', filename);
                    link.setAttribute('target', '_blank');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })

            await this.sleep(1000);

            // var documents = [];
            // var nbRetry = 10;

            // for (var count = 1; count <= nbRetry; count++) {
            //     documents = await this.getExternalData(this.getUrl('urlGetArchivedCaseDocuments', ((caseId != null) ? caseId : reglement.case_id_DR)), 'downloadDocument');

            //     if (documents != null && documents.length > 0) {
            //         if (download)
            //             window.open(documents[0].url);
            //         break;
            //     }

            //     await this.sleep(1000);
            // }
        }
    },

    //     this.log("downloadDocument > reglement, caseId", reglement, caseId);

    //     if (reglement != null && !app.isEmpty(reglement.path_pdf_final)) {
    //         await app.getExternalData(app.getUrl('urlGetAuthorization'), 'giveMeAuthorization > getAuthorization');
    //         this.log("GIGA TEST");
    //         this.log("downloadDocument > open pdf direct url", this.getUrl('urlGetDdrPdfFinal', reglement.persistenceId));

    //         window.open(this.getUrl('urlGetDdrPdfFinal', reglement.persistenceId));
    //     } else {
    //         var documents = [];
    //         var nbRetry = 10;

    //         for (var count = 1; count <= nbRetry; count++) {
    //             documents = await this.getExternalData(this.getUrl('urlGetArchivedCaseDocuments', ((caseId != null) ? caseId : reglement.case_id_DR)), 'downloadDocument');

    //             if (documents != null && documents.length > 0) {
    //                 if (download)
    //                     window.open(documents[0].url);
    //                 break;
    //             }

    //             await this.sleep(1000);
    //         }
    //     }
    // },
    enableTableAction: function (type, item) {
        if (type == 'reglements-validate')
            if (item['code_statut_dossier'] == 'F' || window.location.href.includes('reglements'))
                return false;
        return true;
    },
    changeFournisseurDocumentContractuel: function () {
        this.getCurrentCmp('documentContractuel').getFournisseur();
    },
    onChangeSelectTypeVersement: function () {
        var choixType = appFormio.getDataValue(crossVars.forms['formio_versementInitAFD'], 'type_versement');

        if (choixType !== null && choixType !== "")
            appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'type_versement', choixType);
        else {
            appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'type_versement', '');
            appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'modalite_paiement', '');
        }
    },
    changeRubriquesDC: function () {
        this.getCurrentCmp('reglement').getRubriquesDC();
    },
    addAutreDdevise: function () {
        appFormio.setDataValue(crossVars.forms['formio_versementAFD'], 'show_autre_devise', 'showAutreDevise');
    },
    disableToggle: function (form, hiddenName) {
        var toggle1 = this.getFormElementByName(hiddenName + '_1');
        if (toggle1 != null)
            toggle1.disabled = true;
        var toggle0 = this.getFormElementByName(hiddenName + '_0');
        if (toggle0 != null)
            toggle0.disabled = true;
        var toggle2 = this.getFormElementByName(hiddenName + '_2');
        if (toggle2 != null) {
            toggle2.disabled = true;
            appFormio.setProperty(form.getComponent(hiddenName + '_' + 2).component, 'disabled', true);
        }
        appFormio.setProperty(form.getComponent(hiddenName + '_' + 1).component, 'disabled', true);
        appFormio.setProperty(form.getComponent(hiddenName + '_' + 0).component, 'disabled', true);
    },
    enableToggle: function (form, hiddenName) {
        var toggle1 = this.getFormElementByName(hiddenName + '_1');
        if (toggle1 != null)
            toggle1.disabled = false;
        var toggle0 = this.getFormElementByName(hiddenName + '_0');
        if (toggle0 != null)
            toggle0.disabled = false;
        var toggle2 = this.getFormElementByName(hiddenName + '_2');
        if (toggle2 != null) {
            toggle2.disabled = false;
            appFormio.setProperty(form.getComponent(hiddenName + '_' + 2).component, 'disabled', false);
        }
        appFormio.setProperty(form.getComponent(hiddenName + '_' + 1).component, 'disabled', false);
        appFormio.setProperty(form.getComponent(hiddenName + '_' + 0).component, 'disabled', false);
    },
    getFormElementByName(name) {
        var element = document.getElementsByName('data[columns][' + name + ']');
        if (element != null && element.length > 0)
            return element[0];
        return;
    },
    generateFile: async function (DO, url, download) {
        var caseObject = await this.postData(DO, urls['urlProcessInstanciation'], urls[url]);
        if (download)
            this.downloadDocument(null, download, caseObject.caseId);
    },
    changeMontantDeviseAFD: function () {
        this.getCurrentCmp('documentContractuel').updateContrevaleurAFD();
    },
    changeMontantDeviseHT: function () {
        this.getCurrentCmp('documentContractuel').updateContrevaleurHT();
    },
    isChargeAppui: function (role) {
        if (!Array.isArray(role))
            return (role == 'CHGAPPUI');
        else
            return app.existStringInArray(role, 'CHGAPPUI');
    },
    isAgentVersement: function (role) {
        if (!Array.isArray(role))
            return (role == 'AGENTVERSEMENT');
        else
            return app.existStringInArray(role, 'AGENTVERSEMENT');
    },
    isDirecteur: function (role) {
        if (!Array.isArray(role))
            return (role == 'MANAGER' || role == 'DIRVALID' || role == 'DIRECTEUR');
        else
            return (app.existStringInArray(role, 'MANAGER') || app.existStringInArray(role, 'DIRVALID') || app.existStringInArray(role, 'DIRECTEUR'));
    },
    isAgentDCV: function (role) {
        if (!Array.isArray(role))
            return (role == 'RL_AGENT_DCV');
        else
            return app.existStringInArray(role, 'RL_AGENT_DCV');
    },
    isManagerDCV: function (role) {
        if (!Array.isArray(role))
            return (role == 'MANAGER2ND');
        else
            return app.existStringInArray(role, 'MANAGER2ND');
    },
    isMODAF: function (role) {
        if (!Array.isArray(role))
            return (role == 'MODAF');
        else
            return app.existStringInArray(role, 'MODAF');
    },
    isAFD: function (value) {
        return (value == ent.afd);
    },
    isChargeProjet: function (role) {
        if (!Array.isArray(role))
            return (role == 'CHGPROJET');
        else
            return app.existStringInArray(role, 'CHGPROJET');
    },
    isChargeAffaire: function (role) {
        if (!Array.isArray(role))
            return (role == 'CHGAFF');
        else
            return app.existStringInArray(role, 'CHGAFF');
    },
    isChargeAppui: function (role) {
        if (!Array.isArray(role))
            return (role == 'CHGAPPUI');
        else
            return app.existStringInArray(role, 'CHGAPPUI');
    },
    isDCV: function (entite, perimetre) {
        return (entite == ent.afd && perimetre == 'niveau_2');
    },
    isReversement: function (value) {
        return (value == 'reversement');
    },
    isRA: function (role) {
        return (role == 'RA');
    },
    isAuditeur: function (role) {
        if (!Array.isArray(role))
            return (role == 'AUDITEUR');
        else
            return app.existStringInArray(role, 'AUDITEUR');
    },
    toggleCollapse: function (id) {
        $('#' + id).collapse('toggle');

        var classChevron = $('#chevron-' + id).attr('class');

        if (classChevron.indexOf('-up') != -1)
            $('#chevron-' + id).attr('class', classChevron.replace('-up', '-down'));
        else
            $('#chevron-' + id).attr('class', classChevron.replace('-down', '-up'));
    },
    showCollapse: function (id) {
        $('#' + id).collapse('show');
        var classChevron = $("#chevron-collapseControleComment-" + id.slice(24)).attr("class");

        if (classChevron != undefined)
            $("#chevron-collapseControleComment-" + id.slice(24)).attr("class", classChevron.replace("-down", "-up"));
    },
    hideCollapse: function (id) {
        $('#' + id).collapse('hide'); //TODO : AAmina -> à revoir un jour
        var classChevron = $("#chevron-collapseControleComment-" + id.slice(24)).attr("class");

        if (classChevron != undefined)
            $("#chevron-collapseControleComment-" + id.slice(24)).attr("class", classChevron.replace("-up", "-down"));
    },
    isTrue: function (value) {
        if (value != null) {
            if (typeof value == 'boolean')
                return value;
            else if (typeof value == 'string' && (value.toLowerCase() == 'true' || value.toUpperCase() == 'Y'))
                return true;
        }
        return false;
    },
    toggleBoolean: function (value) {
        if (value != null) {
            if (typeof value == 'boolean')
                return !value;
            else if (typeof value == 'string') {
                if (value.toLowerCase() == 'true')
                    return 'false';
                else if (value.toLowerCase() == 'false')
                    return 'true';
                else if (value.toUpperCase() == 'Y')
                    return 'N';
                else if (value.toUpperCase() == 'N')
                    return 'Y';
            }
        }
    },
    isRefinancementOrPaiementDirect: function (modalitePaiement) {
        return (modalitePaiement == 'paiement_direct' || modalitePaiement == 'refinancement');
    },
    isPaiementDirect: function (modalitePaiement) {
        return modalitePaiement == 'paiement_direct';
    },
    isPaiementDirectAndMoad: function (modalitePaiement, typeVersement) {
        return (modalitePaiement == 'paiement_direct' || typeVersement == 'cas_moad');
    },
    isAvance: function (modalitePaiement) {
        return modalitePaiement == 'sur_avance' || modalitePaiement == 'avance_refinancement';
    },
    changeEmetteurJustificatif: function () {
        this.getCurrentCmp('reglement').getEmetteurJustificatifDC();
    },
    changeEmetteurJustificatifAvance: function () {
        this.getCurrentCmp('avance').getEmetteurJustificatif();
    },
    equalsAmount: function (amount, items, key) {
        let sommeMontants = 0;
        for (var item of items) {
            sommeMontants += item[key];
        }
        return (amount == sommeMontants);
    },
    getCurrentDateAfterDays: function (days) {
        var date = new Date();
        if (days != undefined) {
            var index = 0;
            while (index < days) {

                if (date.getDay() != 6 && date.getDay() != 0) {
                    date.setDate(date.getDate() + 1);
                    index = index + 1;
                }
                else if (date.getDay() == 6)
                    date.setDate(date.getDate() + 2);
            }
        }
        return date.getTime();
    },
    getLocalDate: function (input) {
        return new Date(input).getTime();
    },
    getDate: function (date) {
        if (date == null)
            date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    },
    getPreviousDate: function (dateNow) {
        if (dateNow == null)
            dateNow = new Date();
        return dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1).toString().padStart(2, '0') + '-' + (dateNow.getDate() - 1).toString().padStart(2, '0');
    },
    montantsDDR: async function (versement, idReglement) {
        var reglements = await app.getExternalData(app.getUrl('urlGetReglementsByNumVersement', versement.numero_dossier_versement));

        var montantsDDR = 0;
        if (reglements != null && reglements.length > 0)
            for (var reglement of reglements)
                if ((idReglement != null && idReglement != reglement.persistenceId) || idReglement == null)
                    //exclure les DDRs annulées dans le calcul pour proparco
                    if ((!this.isAFD(versement.entite) && !this.isDossierAnnule(reglement.code_statut_dossier)) || this.isAFD(versement.entite))
                        montantsDDR += reglement.montant_reglement;

        return montantsDDR;
    },
    findNonDuplicate: function (list) {
        var resultToReturn = false;
        for (var i = 0; i < list.length; i++) { // nested for loop
            for (var j = 0; j < list.length; j++) { // prevents the element from comparing with itself
                if (i !== j) {
                    // check if we have at least a non duplicate element value
                    if (list[i].idDevise != list[j].idDevise) {
                        this.log("**∄ devise concours doublante**"); // duplicate devise present
                        resultToReturn = true;
                        break; // terminate inner loop
                    }
                }
            }
            // terminate outer loop
            if (resultToReturn) {
                break;
            }
        }
        return resultToReturn;
    },
    async montantVerseAvance(numProjet) {
        var totalAv = 0;
        var renderTotalVerseAV = "";

        var reglements = await app.getExternalData(app.getUrl('urlGetReglementsByNumProjet', numProjet), 'page-projet> getReglements');

        if (reglements.length > 0) {
            for (reg of reglements) {
                if (reg.modalite_paiement == "sur_avance") {
                    var deviseDDR = (reg.type_devise == "1" ? reg.devise_reglement : reg.devise_reference);

                    totalAv += reg.montant_reglement;
                    renderTotalVerseAV = this.formatNumberWithDecimals(totalAv) + ' <span class="trigramme-devise">' + deviseDDR + '</span>';
                }
            }
        }
        return renderTotalVerseAV;
    },
    async montantVerseDC(numProjet) {
        var totalDc = 0;
        var renderTotalVerseDC = "";

        var dC = await app.getExternalData(app.getUrl('urlGetDocumentsContractuel', numProjet), 'page-projet> getDocContractuel - documentContractuel');

        if (dC != null) {
            if (dC.dossiers_reglements.length > 0) {
                for (reg of dC.dossiers_reglements) {
                    totalDc += reg.montant_reglement;
                    renderTotalVerseDC = this.formatNumberWithDecimals(totalDc) + ' <span class="trigramme-devise">' + reg.devise_reglement + '</span>';
                }
            }
        }
        return renderTotalVerseDC;
    },
    async montantVerseHorsDC(numProjet) {
        var totalHorsDc = 0;
        var renderTotalVerseHorsDC = "";

        var reglements = await app.getExternalData(app.getUrl('urlGetReglementsByNumProjet', numProjet), 'page-projet> getReglements');

        if (reglements.length > 0) {
            for (reg of reglements) {
                if (reg.id_document_contractuel != null && reg.id_avance_contractuel != null) {
                    var deviseDDR = (reg.type_devise == "1" ? reg.devise_reglement : reg.devise_reference);

                    totalHorsDc += reg.montant_reglement;
                    renderTotalVerseHorsDC = this.formatNumberWithDecimals(totalHorsDc) + ' <span class="trigramme-devise">' + deviseDDR + '</span>';
                }
            }
        }
        return renderTotalVerseHorsDC;
    },
    montantInitialProjet: function (concours, projet) {
        var total = 0;
        var renderTotal = "";
        var listMntsInitialConcours = [];

        if (this.findNonDuplicate(projet.listConcours)) {
            this.log("**** Cas multi-devise concours  AFD * TotalMontantsInitiaux Projet ****");

            for (cr of concours) {
                listMntsInitialConcours.push({
                    montant: cr.montantInitial,
                    devise: this.getEltInArray(projet.listConcours, 'numeroConcours', cr.numeroConcours).idDevise
                });

            }
            console.log("listMntsInitialConcours>> ", listMntsInitialConcours);
            for (var mntMntInit of this.groupByMontantDevise(listMntsInitialConcours))
                renderTotal += this.formatNumberWithDecimals(mntMntInit.montant) + ' <span class="trigramme-devise">' + mntMntInit.devise + '</span>' + '<br>';
        }
        else {
            this.log("**** Cas une seule devise AFD * TotalMontantsInitiaux Projet ****");
            for (var concoursItem of concours) {
                total += concoursItem.montantInitial;
                var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);
                renderTotal = this.formatNumberWithDecimals(total) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
            }
        }
        return renderTotal;
    },
    montantTotal: function (concours, projet) {
        var total = 0;
        var renderTotal = "";
        var listEngNetsConcours = [];

        if (this.findNonDuplicate(projet.listConcours)) {
            this.log("**** Cas multi-devise concours AFD * TotalAmount Projet ****");
            for (cr of concours) {
                listEngNetsConcours.push({
                    montant: cr.montantEngagementsNets,
                    devise: this.getEltInArray(projet.listConcours, 'numeroConcours', cr.numeroConcours).idDevise
                });

            }
            console.log("listEngNetsConcours>> ", listEngNetsConcours);
            for (var mntEngNet of this.groupByMontantDevise(listEngNetsConcours))
                renderTotal += this.formatNumberWithDecimals(mntEngNet.montant) + ' <span class="trigramme-devise">' + mntEngNet.devise + '</span>' + '<br>';
        }
        else {
            this.log("*** Cas une seule devise AFD * TotalAmount Projet ****");
            for (var concoursItem of concours) {
                total += concoursItem.montantEngagementsNets;
                var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);
                renderTotal = this.formatNumberWithDecimals(total) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
            }
        }
        return renderTotal;
    },
    groupByMontantDevise: function (tab) {
        var newTab = [];
        for (var e of tab) {
            if (this.existInArray(newTab, 'devise', e.devise)) {
                var updateE = this.getElementInArray(newTab, 'devise', e.devise);
                if (updateE != null)
                    updateE.montant += e.montant;
            } else
                newTab.push(e);
        }
        return newTab;
    },
    sommeRav: function (concours, entite, projet) { //changement ANO-2939
        var sommeRav = 0;
        var renderSommeRAV = "";
        listRavConcours = [];

        if (!this.isAFD(entite)) {
            if (this.findNonDuplicate(projet.listConcours)) {
                this.log("**** Cas multi-devise concours concours * RAV Projet ****");
                return "Projet multi-devise";
            }
            else {
                this.log("**** Cas une seule devise * RAV Projet ****");
                for (var concoursItem of concours) {
                    sommeRav = sommeRav + concoursItem.resteAVerser;
                    var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);

                    renderSommeRAV = this.formatNumberWithDecimals(sommeRav) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
                }
            }
            return renderSommeRAV;
        }
        else {
            if (this.findNonDuplicate(projet.listConcours)) {
                this.log("**** Cas multi-devise concours AFD * RAV Projet ****");
                for (cr of concours) {
                    listRavConcours.push({
                        montant: cr.resteAVerser,
                        devise: this.getEltInArray(projet.listConcours, 'numeroConcours', cr.numeroConcours).idDevise
                    });
                }

                console.log("listRavConcours>> ", listRavConcours);
                for (var sRav of this.groupByMontantDevise(listRavConcours))
                    renderSommeRAV += this.formatNumberWithDecimals(sRav.montant) + ' <span class="trigramme-devise">' + sRav.devise + '</span>' + '<br>';
            }
            else {
                this.log("**** Cas une seule devise AFD * RAV Projet ****");
                for (var concoursItem of concours) {
                    sommeRav = sommeRav + concoursItem.resteAVerser;
                    var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);

                    renderSommeRAV = this.formatNumberWithDecimals(sommeRav) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
                }
            }
            return renderSommeRAV;
        }
    },
    sommeTotalVerse: function (concours, entite, projet) {
        var sommeTotalVerse = 0;
        var renderSommeTotalVerse = "";
        var tabRenderSommeTotalVerse = [];

        if (!this.isAFD(entite)) {
            if (this.findNonDuplicate(projet.listConcours)) {
                this.log("**** Cas multi-devise concours concours * TotalVerse Projet ****");
                return "Projet multi-devise";
            }
            else {
                this.log("**** Cas une seule devise * TotalVerse Projet ****");
                for (var concoursItem of concours) {
                    sommeTotalVerse = sommeTotalVerse + concoursItem.montantVersementsEffectues;
                    var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);
                    renderSommeTotalVerse = this.formatNumberWithDecimals(sommeTotalVerse) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
                }
            }
            return renderSommeTotalVerse;
        }
        else {
            if (this.findNonDuplicate(projet.listConcours)) {
                this.log("**** Cas multi-devise concours concours AFD * TotalVerse Projet ****");
                for (var j = 0; j < concours.length; j++) {
                    var concoursJ = this.getEltInArray(projet.listConcours, 'numeroConcours', concours[j].numeroConcours);
                    for (var i = concours.length - 1; i >= 0; i--) {
                        var concoursI = this.getEltInArray(projet.listConcours, 'numeroConcours', concours[i].numeroConcours);

                        if (concoursJ.idDevise == concoursI.idDevise)
                            sommeTotalVerse += concours[j].montantVersementsEffectues;
                    }

                    tabRenderSommeTotalVerse.push({ montant: sommeTotalVerse, devise: concoursJ.idDevise });
                }

                for (var sTotalVerse of this.groupByMontantDevise(tabRenderSommeTotalVerse))
                    renderSommeTotalVerse += this.formatNumberWithDecimals(sTotalVerse.montant) + ' <span class="trigramme-devise">' + sTotalVerse.devise + '</span>' + '<br>';
            }
            else {
                this.log("**** Cas une seule devise AFD * TotalVerse Projet ****");
                for (var concoursItem of concours) {
                    sommeTotalVerse = sommeTotalVerse + concoursItem.montantVersementsEffectues;
                    var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);
                    renderSommeTotalVerse = this.formatNumberWithDecimals(sommeTotalVerse) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
                }
            }
            return renderSommeTotalVerse;
        }
    },
    convertStringToJSON: function (inputString) {
        // Extract the numeric part from the string
        const numericPart = inputString.match(/\d+,\d+/)?.[0];
        if (!numericPart) {
            return null; // Return null if no numeric part found
        }

        // Extract the currency part from the string
        const currencyPart = inputString.match(/<span class="trigramme-devise">(.+)<\/span>/)?.[1];
        if (!currencyPart) {
            return null; // Return null if no currency part found
        }

        // Convert the numeric part to a number (removing the comma)
        const montant = parseFloat(numericPart.replace(',', '.'));

        // Create the JSON object with the desired format
        const result = { montant, devise: currencyPart };

        return result;
    },
    getImpayeSIRP: async function (concours, entite, projet) {
        var sommeImpayeSIRP = 0;
        var renderImpayeSIRP = "";
        var montantConverted = 0;

        if (!this.isAFD(entite)) {
            if (this.findNonDuplicate(projet.listConcours)) {
                this.log("**** Cas multi-devise * ImpayesSIRP Projet ****");
                for (var concoursItem of concours) { //convertir tous les montants en EUR (CTX)
                    var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);
                    if (concoursElt.idDevise != "EUR") {
                        var resultCTX = await app.getExternalData(app.getUrl('urlCTX', this.getPreviousDate(), concoursElt.idDevise, "EUR"));
                        if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0)
                            montantConverted += app.getMontantCTX(concoursItem.impayesSIRP, resultCTX.cours_devises[0].valeur_mid, concoursElt.idDevise, 'EUR');
                    }
                    else
                        montantConverted += concoursItem.impayesSIRP;

                    renderImpayeSIRP = this.formatNumberWithDecimals(montantConverted) + ' <span class="trigramme-devise">' + "EUR" + '</span>';
                }
            }
            else {
                this.log("**** Cas une seule devise * ImpayesSIRP Projet ****");
                for (var concoursItem of concours) {
                    var concoursElt = this.getEltInArray(projet.listConcours, 'numeroConcours', concoursItem.numeroConcours);
                    sommeImpayeSIRP = sommeImpayeSIRP + concoursItem.impayesSIRP;
                    renderImpayeSIRP = this.formatNumberWithDecimals(sommeImpayeSIRP) + ' <span class="trigramme-devise">' + concoursElt.idDevise + '</span>';
                }
            }
            return renderImpayeSIRP;
        }
        else {
            for (var concoursItem of concours)
                sommeImpayeSIRP += concoursItem.impayesSIRP;

            if (sommeImpayeSIRP == 0)
                return 'NON';
            else
                return 'OUI';
        }

    },
    getDLVFMax: async function (concours) {
        if (concours != null && concours.length > 0) {
            var dates = [];
            for (var concoursItem of concours) {
                dates.push(concoursItem.dlvf);
            }
            var dateMin = dates.reduce(function (a, b) { return a < b ? a : b; });
            return dateMin;
        }
    },
    getDifferenceDates: function (date1, date2) {
        if (date2 != null && date2 != undefined)
            return Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
        else
            return Math.abs(new Date().getTime() - new Date(date1).getTime());
    },
    isMiseEnPaiementTask(task) {
        return (task?.description == "reglement-miseEnPaiement-AGENTVERSEMENT" || task?.description == "versement-miseEnPaiement-CHGAPPUI");
    },
    isAvanceOrRefinancement: function (modalitePaiement, entite) {
        if (app.isAFD(entite))
            return (modalitePaiement == 'refinancement' || modalitePaiement == 'sur_avance');
        else
            return (modalitePaiement == 'avance_refinancement');
    },
    getImputationComptable: function (versement, deviseReg, concours, typeAt) {
        var idFamilleProduit = this.trim(concours.idFamilleProduit);
        var idOperation = this.trim(!app.isEmpty(concours.operation) ? concours.operation.codeFonctionnelOperation : concours.idOperation);
        var idProduitFinancier = this.trim(concours.idProduitFinancier);

        //SI Modalité de Paiement = "Reversement" ET SI DDR_Devise de versement >< "EUR" ET >< "USD" ALORS "Compte pivot du CC Autre monnaie"
        if (app.isReversement(versement.modalite_paiement) && this.getRefLabel('refDeviseVersement', '0') != deviseReg && this.getRefLabel('refDeviseVersement', '1') != deviseReg)
            return this.getRefLabel('refImputationComptable', '0');
        //SI Modalité de Paiement = "Reversement" ET SI DDR_Devise de versement = "EUR" ALORS "Compte pivot du CC Euro"
        else if (app.isReversement(versement.modalite_paiement) && this.getRefLabel('refDeviseVersement', '0') == deviseReg)
            return this.getRefLabel('refImputationComptable', '3');
        //SI Modalité de Paiement = "Reversement" ET SI DDR_Devise de versement = "USD" ALORS "Compte pivot du CC en Dollar"
        else if (app.isReversement(versement.modalite_paiement) && this.getRefLabel('refDeviseVersement', '1') == deviseReg)
            return this.getRefLabel('refImputationComptable', '4');
        //SI Modalité de Paiement = "Paiement direct" ET Type d'AT = ("FISEA" OU "FISEA+") ALORS indiquer "Compte courant FISEA"
        else if (app.isPaiementDirect(versement.modalite_paiement) && (this.getRefLabel('refTypeAt', '1') == typeAt || (this.getRefLabel('refTypeAt', '2') == typeAt)))
            return this.getRefLabel('refImputationComptable', '5');
        //SI Modalité de Paiement = "Paiement direct" ET Type d'AT >< ("FISEA" OU "FISEA+")  ET Groupe de Produit =(«Prêt» OU «Prêt Stand by»)  ALORS "Compte pivot des prêts"
        else if (app.isPaiementDirect(versement.modalite_paiement) && (this.getRefLabel('refTypeAt', '1') != typeAt || this.getRefLabel('refTypeAt', '2') != typeAt) && (this.getRefLabel('refTypeProduit', '0') == idFamilleProduit || this.getRefLabel('refTypeProduit', '3') == idFamilleProduit))
            return this.getRefLabel('refImputationComptable', '1');
        //SI Modalité de Paiement = "Paiement direct" ET Type d'AT >< ("FISEA" OU "FISEA+") ET Groupe de Produit = "Subvention" ET Opération = ("UNION EUROP" OU "UE-FIV" OU "UE-FFU" OU "UE-THEMATIQUE" OU "UE-AUTRES" OU "UE-AIP" OU "UE-NIP" OU "UE-AIF" OU "UE-ITF") ALORS "Compte pivot des prêts - UE" [Idéalement on  prend toutes les Opérations qui commencent par "UE-"]
        else if (app.isPaiementDirect(versement.modalite_paiement) && (this.getRefLabel('refTypeAt', '1') != typeAt || this.getRefLabel('refTypeAt', '2') != typeAt) && this.getRefLabel('refTypeProduit', '1') == idFamilleProduit && idOperation.startsWith('UE'))
            return this.getRefLabel('refImputationComptable', '6');
        //SI Modalité de Paiement = "Paiement direct" ET Type d'AT >< ("FISEA" OU "FISEA+") ET Groupe de Produit ="Subvention" ET Opération ("Composante subv" OU "FAPS" OU "Op Courante" OU "Micro-finance") ALORS "Compte pivot des prêts
        else if (app.isPaiementDirect(versement.modalite_paiement) && (this.getRefLabel('refTypeAt', '1') != typeAt || this.getRefLabel('refTypeAt', '2') != typeAt) && this.getRefLabel('refTypeProduit', '1') == idFamilleProduit && this.existStringInArray(refs['refOperationsImputation'], idOperation))
            return this.getRefLabel('refImputationComptable', '1');
        //SI Modalité de Paiement = "Paiement direct" ET Type d'AT >< ("FISEA" OU "FISEA+") ET Groupe de Produit ="Subvention" ET Opération ("FVC TFSC"  OU "FVClimat") ALORS "Compte pivot des prêts - FVC"
        else if (app.isPaiementDirect(versement.modalite_paiement) && (this.getRefLabel('refTypeAt', '1') != typeAt || this.getRefLabel('refTypeAt', '2') != typeAt) && this.getRefLabel('refTypeProduit', '1') == idFamilleProduit && refs['refIdOperationFvc'].includes(idOperation))
            return this.getRefLabel('refImputationComptable', '7');
        //SI Modalité de Paiement = "Paiement direct" ET Type d'AT >< ("FISEA" OU "FISEA+") ET Groupe de Produit ="Fonds Propres" ET Produit ("Oblig Convert" OU "Prêt Part") ALORS "Compte pivot des prêts"
        else if (app.isPaiementDirect(versement.modalite_paiement) && (this.getRefLabel('refTypeAt', '1') != typeAt || this.getRefLabel('refTypeAt', '2') != typeAt) && this.getRefLabel('refTypeProduit', '2') == idFamilleProduit && refs['refProduit'].includes(idProduitFinancier))
            return this.getRefLabel('refImputationComptable', '1');
        //Si vide indiquer "A renseigner"
        else
            return '';
    },
    getMontantReglementDC: async function (documentContractuel, statutDDR) {
        var montant = await this.getExternalData(this.getUrl('urlGeSommeDDRByDCAndStatut', 'AFD', documentContractuel.persistenceId, statutDDR), true);

        return montant
    },
    getRavActuelDC: async function (documentContractuel) {
        var montant = await this.getMontantReglementDC(documentContractuel, 'DDR8');
        return (documentContractuel.montant_afd - montant);
    },
    getRavProvisionnelRavActuelDC: async function (documentContractuel, idDDREnCours, isAR) {
        var montantsDevises = [];
        var autreDeviseDC = documentContractuel.autre_devise;
        autreDeviseDC.unshift({ 'montant': documentContractuel.montant_afd, 'devise': documentContractuel.devise_afd, 'reste_a_verser_reel_dc': documentContractuel.reste_a_verser_reel_dc });

        if (autreDeviseDC.length > 0) {
            for (var autreDevise of autreDeviseDC) {
                var montantDevise = { 'montant': autreDevise.montant, 'devise': autreDevise.devise, 'rav_previsionnel': 0 };
                var sommeDDRsNonPayes = 0;
                var sommeMontantsAPayerEnCours = 0;
                var persistenceIdAR = 0;

                if (documentContractuel.dossiers_reglements.length > 0) {
                    for (var dossier_reglement of documentContractuel.dossiers_reglements) {
                        if (!app.isDossierAnnule(dossier_reglement.code_statut_dossier)) {
                            var deviseDDR = (dossier_reglement.type_devise == "1" ? dossier_reglement.devise_reglement : dossier_reglement.autre_devise)
                            if (deviseDDR == autreDevise.devise && dossier_reglement.persistenceId != idDDREnCours) {
                                if (dossier_reglement.code_statut_dossier != 'DDR8' && (dossier_reglement.code_statut_dossier != 'DDR11' && dossier_reglement.code_statut_dossier != 'DDR12' && dossier_reglement.code_statut_dossier != 'DDR13')) {
                                    sommeDDRsNonPayes += dossier_reglement.montant_reglement;

                                    //Cas de l'avance remboursable :
                                    //rav reel = montant afd - somme montants a payer des rubriques(montant_ventile)
                                    // rav previsionnel = rav reel - somme montants a payer (montant_ventile)
                                    if (isAR) {
                                        if (documentContractuel.rubriques.length > 0) {
                                            for (var rub of documentContractuel.rubriques)
                                                if (rub.libelle_rubrique == "Avance remboursable")
                                                    persistenceIdAR = rub.persistenceId;
                                        }

                                        for (var justificatif of dossier_reglement.justificatifs)
                                            for (var montant of justificatif.montantsJustificatifRubrique)
                                                if (montant.level_rubrique == "0" && montant.id_rubrique != persistenceIdAR)
                                                    sommeMontantsAPayerEnCours += montant.montant_ventile;
                                    }
                                }
                            }
                        }
                    }
                }
                // montantDevise.rav_actuel = (this.isEmpty(autreDevise.reste_a_verser_reel_dc) ? montantDevise.montant : autreDevise.reste_a_verser_reel_dc);
                montantDevise.rav_actuel = (autreDevise.reste_a_verser_reel_dc == null) ? montantDevise.montant : autreDevise.reste_a_verser_reel_dc;
                montantDevise.rav_previsionnel = (!isAR) ? (montantDevise.rav_actuel - sommeDDRsNonPayes) : (montantDevise.rav_actuel - sommeMontantsAPayerEnCours);

                montantsDevises.push(montantDevise);
            }
        }
        documentContractuel.montantsDevises = montantsDevises;
        return documentContractuel;
    },
    getMontants: async function (liste, key) {
        var somme = 0;
        if (liste.length > 0) {
            for (var item of liste)
                somme += item[key];
        }
        return somme;
    },
    produitIsPret: function (produitFinancier) {
        return (produitFinancier == this.getRefLabel('refTypeProduit', '0'));
    },
    isEgaux: function (item1, item2) {
        return item1 == item2;
    },
    renderTypeDossier: function (type) {
        return (type == 'reglement') ? 'règlement' : type;
    },
    natureRisqueIsHorsAFD: function (natureRisque) {
        return (natureRisque == 'Sous-part. hors AFD');
    },
    verifDatePaiement: function () {
        this.getCurrentCmp('versement').verifDatePaiement();
    },
    getArrayWithoutDuplicate(liste, elementCurrent, code) {
        var listeResult = [];
        for (var element of liste) {
            if (listeResult != []) {
                if (element != null && !this.existInArray(listeResult, code, element[code]))
                    listeResult.push(element)
            }
            else
                listeResult.push(element)
        }

        if (elementCurrent != undefined && elementCurrent != null && !Array.isArray(elementCurrent)) {
            var trouve = false;
            var count = 0;
            var result = [];

            while (!trouve && count < listeResult.length) {
                if (listeResult[count].name != elementCurrent.name) {
                    result.push(listeResult[count]);
                    count++;
                }
                else {
                    result.push(listeResult[count]);
                    trouve = true;
                }
            }
            if (!trouve)
                result.push(elementCurrent);
            listeResult = result;
        }
        return listeResult;
    },
    isUnionEurop: function (operation) {
        return operation.includes('UE');
    },
    getMessagesError: function (input) {
        if (input == 0)
            return lang.errorValueEqualsZero;
        else
            return lang.errors.reglement.errorMontantReglement
    },
    isMemberProjetProparco: function () {
        this.getCurrentCmp('notification').isMemberProjet();
    },
    isRoleEnableEditDossier: function (role, versement) {
        var statutDdvPROAfterDir = versement.code_statut_dossier != 'DDV8';

        if (!Array.isArray(role))
            return (this.isAgentVersement(role) || ((this.isChargeAppui(role) || this.isChargeAffaire(role) || this.isMODAF(role)) && statutDdvPROAfterDir));
        else {
            for (var r of role) {
                if (this.isAgentVersement(r) || ((this.isChargeAppui(r) || this.isChargeAffaire(r) || this.isMODAF(r)) && statutDdvPROAfterDir))
                    return true;
            }
        }
        return false;
    },
    montantsDDRStatutEnCours: async function (concours) {
        if (concours != null || concours.length > 0) {
            var reglements = await this.getExternalData(this.getUrl('urlDDRsEnCoursByConcours', concours.numeroConcours));
            var result = 0;
            for (var reglement of reglements) {
                var deviseReglement = (reglement.type_devise == "1" ? reglement.devise_reglement : reglement.devise_reference);
                if (deviseReglement == concours.idDevise)
                    result += reglement.montant_reglement;
                else if (!this.isEmpty(reglement.montant_contrevaleur))
                    result += reglement.montant_contrevaleur;
                else if (!this.isEmpty(reglement.montant_equivalent))
                    result += reglement.montant_equivalent;

                if (reglement.justificatifsRemboursement.length > 0)
                    for (var justif of reglement.justificatifsRemboursement)
                        result -= justif.montant_remboursement;
            }
            return result;
        }
    },
    getNumbersFormatList: function (list, key) {
        var newList = list;
        for (var element of newList) {
            var numberFormate = app.formatNumber(element[key]);
            element[key] = numberFormate;
        }
        return newList;
    },
    taskIsNotControles: function (etapeTache) {
        return (etapeTache != 'enCours')
    },
    convertStringToFloat(input) {
        return (this.isEmpty(input) ? 0 : parseFloat(input.toString().replace(',', '.').replace(/\s/g, '')));
    },
    compareTwoElement(paramString, paramNumber) {
        return (this.isEmpty(paramString) ? false : (this.convertStringToFloat(paramString) > paramNumber));
    },
    isValidLengthCodeAnomalie: function (codeAno) {
        return (codeAno != null && codeAno.length >= 5)
    },
    getIndexElementInArrayByValue(array, key, value, lastElt) {
        indexElt = -1;
        for (var index = 0; index < array.length; index++) {
            if (array[index][key] == value) {
                if (!lastElt)
                    return index;
                indexElt = index;
            }
        }
        return indexElt;
    },
    isDossierAnnule(codeStatut) {
        return (codeStatut == 'DDR10' || codeStatut == 'DDV11' || codeStatut == 'ddr10' || codeStatut == 'DDV11_ddrs' || codeStatut == 'ABOND');
    },
    isDossierRembourse(codeStatut) {
        return (codeStatut == 'DDR11' || codeStatut == 'DDR12' || codeStatut == 'DDR13');
    },
    enableShowBtnRemboursement(reglement) {
        return reglement != null && reglement.code_statut_dossier != null && (reglement.code_statut_dossier == 'DDR8' || reglement.code_statut_dossier == 'DDR11' || reglement.code_statut_dossier == 'DDR12' || reglement.code_statut_dossier == 'DDR13');
    },
    enableShowTableDDrsDefinitifProparco(versement) {
        return versement != null && versement.code_statut_dossier != null && (versement.code_statut_dossier == 'DDV8' || versement.code_statut_dossier == 'DDV10' || versement.code_statut_dossier == 'DDV12' || versement.code_statut_dossier == 'DDV13' || versement.code_statut_dossier == 'DDV14');
    },
    async checkDDRsIsAnnule(numerVersement) {
        var countDDRStatutNonAnnule = await app.getExternalData(app.getUrl('urlCountDDRStatutNonAnnuleByNumVersement', numerVersement), 'pgetcountDDRStatutNonAnnule >', true);
        return (countDDRStatutNonAnnule == 0);
    },
    isNotDownloadable(item) {
        if ((!this.isAFD(item.entite) && (this.isDossierAnnule(item.code_statut_dossier) || item.case_id_DR == null)) || (this.isAFD(item.entite) && item.case_id_DR == null))
            return false;
        return true;
    },
    isRefundable(item) {
        if (item.code_statut_dossier == 'DDR13' || item.code_statut_dossier == 'DDR8')
            return true;
        return false;
    },
    sortBy: function (arr, keys) {
        return arr.sort(function sort(i1, i2, sKeys = keys) {
            const compareKey = (sKeys[0].key) ? sKeys[0].key : sKeys[0];
            const order = sKeys[0].order || 'ASC'; // ASC || DESC
            let compareValue = i1[compareKey]?.toString().localeCompare(i2[compareKey]?.toString())
            compareValue = (order.toUpperCase() === 'DESC') ? compareValue * -1 : compareValue
            const checkNextKey = compareValue === 0 && sKeys.length !== 1
            return (checkNextKey) ? sort(i1, i2, sKeys.slice(1)) : compareValue;
        })
    },
    sortByBis: function (arr, keys) {
        return arr.sort((a, b) => {
            for (let i = 0; i < 3; i++) {
                if (!keys[i]) break; // If no more keys to compare, exit loop
                const keyObj = keys[i];
                const key = keyObj.key || keyObj; // Extract the key from keyObj
                const order = keyObj.order || 'ASC'; // Default to ASC if order is not specified
                const valA = a[key];
                const valB = b[key];

                if (valA < valB) return order === 'ASC' ? -1 : 1;
                if (valA > valB) return order === 'ASC' ? 1 : -1;
            }
            return 0; // Objects are equal
        });
    },
    getStorageIdByCaseContext(name, caseContext) {
        for (var key of Object.keys(caseContext))
            if (caseContext[key].name == name)
                return caseContext[key].storageId;
    },
    getSommeMontantJustificatifByRubrique(documentContractuel, rubriqueDC) {
        var sommeMontantsJustificatiByfRubrique = 0;
        for (var regl of documentContractuel.dossiers_reglements) {
            if (!this.isDossierAnnule(regl.code_statut_dossier)) {
                for (var justificatif of regl.justificatifs) {
                    for (var montant of justificatif.montantsJustificatifRubrique) {
                        if (rubriqueDC.id == montant.id_rubrique && rubriqueDC.devise_rubrique == regl.devise_reglement) {
                            sommeMontantsJustificatiByfRubrique += montant.montant_a_payer;
                        }
                    }
                }
            }
        }
        return sommeMontantsJustificatiByfRubrique;
    },
    async renderRAVRubriqueJustificatif(reglement, documentContractuel, rubriqueDC) {
        var result = "";
        var detailMontantJustificatifRubrique = await this.getExternalData(app.getUrl('urlGetMontantJustificatifRubriqueById', rubriqueDC.id), 'page-document > getMontantJustificatifRubrique - MJR', true);
        if (detailMontantJustificatifRubrique != null)
            return result = app.formatNumberWithDecimals(rubriqueDC.montant_rubrique - this.getSommeMontantJustificatifByRubrique(documentContractuel, rubriqueDC))
                + ' ' + rubriqueDC.devise_rubrique;
        else
            return app.formatNumberWithDecimals(rubriqueDC.montant_rubrique) + ' ' + rubriqueDC.devise_rubrique;
    },
    async renderRAVRubriqueJustificatifRemb(reglement, documentContractuel, rubriqueDC) {
        var result = "";
        // var detailMontantJustificatifRubrique = await this.getExternalData(app.getUrl('urlGetMontantJustificatifRubriqueById', rubriqueDC.id), 'page-document > getMontantJustificatifRubrique - MJR', true);
        // if (detailMontantJustificatifRubrique != null)
        //     return result = app.formatNumberWithDecimals(rubriqueDC.montant_rubrique - this.getSommeMontantJustificatifByRubrique(documentContractuel, rubriqueDC))
        //         + ' ' + rubriqueDC.devise_rubrique;
        // else
        return app.formatNumberWithDecimals(rubriqueDC.montant_rubrique) + ' ' + rubriqueDC.devise_rubrique;
    },
    getSommeMontantJustificatifByRubr(documentContractuel, rubrique) {
        var sommeMontantsJustificatiByfRubrique = 0;
        if (documentContractuel != null) {
            for (var regl of documentContractuel.dossiers_reglements) {
                if (!this.isDossierAnnule(regl.code_statut_dossier)) {
                    for (var justificatif of regl.justificatifs) {
                        for (var montant of justificatif.montantsJustificatifRubrique) {
                            if (rubrique.persistenceId == montant.id_rubrique && rubrique.devise_rubrique == regl.devise_reglement) {
                                sommeMontantsJustificatiByfRubrique += montant.montant_a_payer;
                            }
                        }
                    }
                }
            }
        }
        return sommeMontantsJustificatiByfRubrique;
    },
    getSommeMontantJustificatifByRubri(documentContractuel, rubrique) {
        var sommeMontantsJustificatiByfRubriqu = 0;
        if (documentContractuel != null) {
            for (var regl of documentContractuel.dossiers_reglements) {
                if (!this.isDossierAnnule(regl.code_statut_dossier)) {
                    for (var justificatif of regl.justificatifs) {
                        for (var montant of justificatif.montantsJustificatifRubrique) {
                            if (rubrique.persistenceId == montant.id_rubrique && rubrique.devise_rubrique != regl.devise_reglement) {
                                sommeMontantsJustificatiByfRubriqu += montant.montant_a_payer;
                            }
                        }
                    }
                }
            }
        }
        return sommeMontantsJustificatiByfRubriqu;
    },
    renderRAVRub(documentContractuel, rubrique) {
        var result = ((this.getSommeMontantJustificatifByRubr(documentContractuel, rubrique) == 0) ? app.formatNumberWithDecimals(rubrique.montant_rubrique) + ' ' + rubrique.devise_rubrique : (app.formatNumberWithDecimals(rubrique.montant_rubrique - this.getSommeMontantJustificatifByRubr(documentContractuel, rubrique))) + ' ' + rubrique.devise_rubrique);
        if (rubrique.autre_devise != null)
            for (var autreDevise of rubrique.autre_devise)
                result += '<br>' + ((this.getSommeMontantJustificatifByRubri(documentContractuel, rubrique) == 0) ? app.formatNumberWithDecimals(autreDevise.montant) + ' ' + autreDevise.devise : (app.formatNumberWithDecimals(autreDevise.montant - this.getSommeMontantJustificatifByRubri(documentContractuel, rubrique))) + ' ' + autreDevise.devise);
        return result;
    },
    getMontantARInitiale(documentContractuel) {
        var mnt = 0;
        var persistenceIdAR = 0;

        if (documentContractuel.rubriques.length > 0) {
            for (var rub of documentContractuel.rubriques) {
                if (rub.libelle_rubrique == "Avance remboursable")
                    persistenceIdAR = rub.persistenceId;
            }
        }

        for (var regl of documentContractuel.dossiers_reglements) {
            if (!this.isDossierAnnule(regl.code_statut_dossier)) {
                for (var justificatif of regl.justificatifs) {
                    for (var montant of justificatif.montantsJustificatifRubrique) {
                        //récupérer juste le montant à payer de l'avance remboursable
                        if (montant.id_rubrique == persistenceIdAR) {
                            mnt = this.convertStringToFloat(montant.montant_ventile);
                        }
                    }
                }
            }
        }
        return mnt;
    },
    getSommeMontantARembourser(documentContractuel, rubrique) {
        var somme = 0;
        for (var regl of documentContractuel.dossiers_reglements) {
            if (!this.isDossierAnnule(regl.code_statut_dossier)) {
                for (var justificatif of regl.justificatifs) {
                    for (var montant of justificatif.montantsJustificatifRubrique) {
                        //récupérer la somme des mnts à rembourser ventilées au niveau des rubriques
                        // if (rubrique.persistenceId == montant.id_rubrique && rubrique.devise_rubrique == regl.devise_reglement) {
                        if (rubrique.devise_avance == regl.devise_reglement) {
                            somme += montant.montant_a_rembourser;
                        }
                    }
                }
            }
        }
        return somme;
    },
    checkAutreDeviseUsedByDDR(parentObject, currentItem, isAmount) {
        if (parentObject.dossier_reglement.length == 0)
            return true;
        else {
            var sommesDDR = 0;
            var deviseUsed = false;
            for (reglement of parentObject.dossier_reglement) {
                if (!this.isDossierAnnule(reglement.code_statut_dossier)) {
                    var deviseReglement = ((reglement.type_devise == "1") ? reglement.devise_reglement : reglement.devise_reference);
                    if (deviseReglement == currentItem.devise) {
                        deviseUsed = true;
                        if (isAmount)
                            sommesDDR += reglement.montant_reglement;
                        else
                            return false;
                    }
                }
            }
            if (sommesDDR == 0 || !deviseUsed)
                return true;
            else
                return (this.convertStringToFloat(currentItem.montant) >= sommesDDR);
        }
    },
    verifMontantDV(input) {
        var deviseVersement = appFormio.getDataValue(crossVars.forms['formio_versementAFD'], 'devise');
        var montantDevise = { 'montant': input, 'devise': deviseVersement };
        return (this.checkAutreDeviseUsedByDDR(this.getCurrentCmp('versement').versement, montantDevise, true) && input != 0);
    },
    verifDeviseDV(input) {
        var formVersement = crossVars.forms['formio_versementAFD'];
        var componentDevise = null;
        if (formVersement != undefined)
            componentDevise = formVersement.getComponent('devise').component;
        if (componentDevise != null && !componentDevise.disabled && input != '') {
            var deviseVersement = appFormio.getDataValue(crossVars.forms['formio_versementAFD'], 'devise');
            var montantDevise = { 'montant': input, 'devise': deviseVersement };

            return (this.checkAutreDeviseUsedByDDR(this.getCurrentCmp('versement').versement, montantDevise, false) && input != 0);
        }
        return true;
    },
    getMessagesErrorMontantDV: function (input) {
        if (input != null)
            if (input == 0)
                return lang.errorValueEqualsZero;
            else
                return lang.versement.errorSumDDRs;

        return '';
    },
    evalFunction: function (cmpCurrent, param, nameFunction) {
        return app.getCurrentCmp(cmpCurrent)[nameFunction](param);
        // return eval("app.getCurrentCmp('" + cmpCurrent + "')." + nameFunction + "(" + JSON.stringify(param) + "," + ")");
    },
    copy: function (srcObject) {
        var newObject = Array.isArray(srcObject) ? [] : {};

        for (const key in srcObject)
            newObject[key] = (srcObject[key] === null) ? null : (typeof srcObject[key] === "object") ? this.copy(srcObject[key]) : srcObject[key];

        return newObject;
    },
    verifAuditAvance(dateValue, lienValue) {
        if (((dateValue != null || dateValue != '') && !app.isEmpty(lienValue)) || app.isEmpty(dateValue))
            return true;
        return false;
    },
    isFixed(role) {
        return !app.isAgentVersement(role) && !app.isChargeAppui(role);
    },
    formatMontantTrigramme(montant, devise) {
        return montant + ' <span class="trigramme-devise">' + devise + '</span>';
    },
    verifDateReception: function (date) {
        return !(app.getLocalDate(date) < app.getCurrentDateAfterDays(4));
    },
    //methode pour recuperer un element dans une liste selon une cle/valeur
    getEltInArray: function (items, key, value) {
        if (items != null && items.length > 0) {
            for (var item of items)
                if (item != null && item[key] == value)
                    return item;
        }
        return null;
    },
    //methode pour recuperer le beneficiaire primaire depuis le concours
    getBeneficiairePrimaireByConcours: function (concoursTiers) {
        var idTiers = 0;
        for (var tiers of concoursTiers) {
            if (tiers.typeRole.idTypeRole == 24) {
                idTiers = tiers.idTiers;
                break;
            }
        }
        return idTiers;
    },
    //methode pour fusionner deux objets
    mergeTwoObject(objectA, objectB) {
        return Object.assign({}, objectA, objectB);
    },
    //methode pour recuperer les infos de cconcours GCF + SIOP
    async getAllDataConcoursById(idConcours) {
        this.log('getAllDataConcoursById() > idConcours > ', idConcours);
        var concoursSIOP = await this.getExternalData(app.getUrl('urlGetConcoursSIOPByNumero', idConcours), 'getAllDataConcoursById  > concoursSIOP');
        //recuperer les infos de concours depuis GCF
        var concoursGCF = await this.getExternalData(app.getUrl('urlGetConcoursGCFByNumero', idConcours), 'getAllDataConcoursById  > concoursGCF');
        var projet = await this.getExternalData(app.getUrl('urlGetProjetByNum', concoursSIOP.numeroProjet), 'getAllDataConcoursById  > projet', true);
        //add date Signature convention to concours
        if (concoursGCF != null) {
            concoursGCF.dateSignatureConvention = (!app.isEmpty(concoursSIOP.convention) ? concoursSIOP.convention.dateSignature : null);
            //concoursGCF.dateSignatureConvention = (!app.isEmpty(concoursSIOP.convention) ? concoursSIOP.convention.dateSignature : '');
            //add libelle Produit to concours
            concoursGCF.libelleCourtProduit = (!app.isEmpty(concoursSIOP.produit) ? concoursSIOP.produit.libelleCourtProduit : '');
            //add libelle Operation to concours
            concoursGCF.libelleCourtOperation = (!app.isEmpty(concoursSIOP.operation) ? concoursSIOP.operation.libelleCourtOperation : '');
            //add libelle famille produit
            concoursGCF.libelleCourtFamilleProduit = (!app.isEmpty(concoursSIOP.produit) ? concoursSIOP.produit.familleProduit.libelleCourtFamilleProduit : '');
            //add libelle vehicule Cofinancement
            concoursGCF.libelleCourtVehiculeCofinancement = (!app.isEmpty(concoursSIOP.vehiculeCofinancement) ? concoursSIOP.vehiculeCofinancement.libelleCourtVehiculeCofinancement : '');
            //add achevement operationel de projet dans concours
            concoursGCF.dateAchevementOperationnel = projet.dateAchevementOperationnel;
            //fusionner les deux resultat dans un sul object
            var concoursResult = this.mergeTwoObject(concoursSIOP, concoursGCF);

            await this.sleep(100);
            this.log("getAllDataConcoursById result > ", concoursResult);
            return concoursResult;
        }
        else
            return null;
    },
    //methode pour supprimer les espaces inutils dans une chaine de caracteres
    trim(input) {
        return input.toString().trim();
    },
    //methode pour savoir si un projet est AFD et utilisé par proparco
    isProjetAFDUsedByPro(projet) {
        return (projet.idSociete == 'C' && projet.flgSecteurPrive == '1');
    },
    //methode pour recuperer le pays de realisation à afficher pour critere de risque DCV
    getPaysRealisationDCV(paysRealisation) {
        if (paysRealisation.length == 1)
            return paysRealisation[0].pays.libelleCourtPays
        else {
            for (var paysItem of paysRealisation)
                if (paysItem.ordrePays == 1)
                    return paysItem.pays.libelleCourtPays;
        }
        return '';
    },
    //TODO add methode pour recuperer les concours a travers les projets
    async getConcoursByProjets(entite) {
        var listConcoursResult = [];
        var projets = await this.getExternalData(this.getUrl('urlGetProjetsByEntite', entite));
        if (projets.length > 0) {
            for (var projet of projets) {
                listConcoursResult = listConcoursResult.concat(projet.listConcours);
                //TODO : pas de concat mais un push, a refaire
            }
        }
        return listConcoursResult;
    },
    async getRubriquesDCVentilatedJustifs(idDc, idDdr) {
        var listMontantsRubriquesInAllJustifsDdr = [];
        var listMontantsRubriquesInAllJustifsDdrVentilated = [];
        var justificatifsByDDr = await this.getExternalData(this.getUrl('urlGetJustificatifsByIdDcAnIdDdr', idDc, idDdr));

        if (justificatifsByDDr.length > 0) {
            for (var jr of justificatifsByDDr) {
                if (jr.montantsJustificatifRubrique.length > 0)
                    listMontantsRubriquesInAllJustifsDdr = listMontantsRubriquesInAllJustifsDdr.concat(jr.montantsJustificatifRubrique);
            }
        }

        for (var rubrique of listMontantsRubriquesInAllJustifsDdr) {
            if (!app.isEmpty(rubrique.montant_ventile))
                listMontantsRubriquesInAllJustifsDdrVentilated.push(rubrique);
        }
        return listMontantsRubriquesInAllJustifsDdrVentilated;
    },

    async getConcoursUserByEntite(entite, userId) {
        listConcoursResultByEntite = [];
        var projets = await app.getExternalData(app.getUrl('urlGetProjetsByEntiteAndUserId', entite, userId), 'page > versements > getConcours');
        if (projets.length > 0) {
            for (var projet of projets) {
                listConcoursResultByEntite = listConcoursResultByEntite.concat(projet.listConcours);
            }
        }
        return listConcoursResultByEntite;
    },
    //methode pour render montant versement par devise
    renderMontantDv(versement) {
        var result = this.formatMontantTrigramme(this.formatNumberWithDecimals((versement.montant_versement == null ? 0 : versement.montant_versement)), this.renderEmpty(versement.devise));
        if (versement.autresDevises != null && versement.autresDevises.length > 0)
            for (var autreDevise of versement.autresDevises)
                result += '<br>' + app.formatMontantTrigramme(app.formatNumberWithDecimals(autreDevise.montant), autreDevise.devise);
        return result;
    },
    //methode pour voir quel acteur à afficher dans le tableau de versements PROPARCO
    getActeurTraitantDV(versement) {
        if (!this.isEmpty(versement.tache_affectee_A) && versement.code_statut_dossier != 'DDV8')
            return versement.tache_affectee_A;

        return versement.initiateur;
    },
    //methode pour recuperer le render date echeance d'un versement PROPARCO
    verifEcheancesPROARCO(versement) {
        if (!app.isEmpty(versement.date_reception)) {
            if (versement.code_statut_dossier == "DDV10" || app.getLocalDate(versement.date_reception) >= app.getCurrentDateAfterDays(4))
                return true;
            else if (app.getLocalDate(versement.date_reception) < app.getCurrentDateAfterDays(4))
                return false;
        }
    },
    //methode pour recuperer le beneficiaire primaire de la premiere DDR crée d'un versement
    getTiersVersementPROPARCO(versement) {
        if (versement.dossier_reglement.length > 0)
            return versement.dossier_reglement[0].id_beneficiaire_primaire;
        return '';
    },
    getMontantCTX(montant, taux, deviseCotation, devise) {
        if (deviseCotation == devise)
            return montant * taux;
        else
            return montant / taux;
    },
    //methode qui fait le render de montant DDR
    getRendermontantDDR(ddr) {
        if (app.isAFD(ddr.entite)) {
            if (ddr.type_devise == '1')
                return this.formatMontantTrigramme(this.formatNumberWithDecimals((ddr.montant_reglement == null ? 0 : ddr.montant_reglement)), ddr.devise_reglement);
            else {
                return this.formatMontantTrigramme(this.formatNumberWithDecimals((ddr.montant_reglement == null ? 0 : ddr.montant_reglement)), ddr.devise_reference)
                    + '<br> en ' + ddr.devise_reglement;
            }
        }
        else {
            if (ddr.type_devise == '1')
                return this.formatMontantTrigramme(this.formatNumberWithDecimals((ddr.montant_reglement == null ? 0 : ddr.montant_reglement)), ddr.devise_reglement);
            else {
                return this.formatMontantTrigramme(this.formatNumberWithDecimals((ddr.montant_reglement == null ? 0 : ddr.montant_reglement)), ddr.devise_reference)
                    + '<br> en ' + ddr.devise_reglement;
            }
        }
    },
    //methode pour recuperer un element dans une liste
    getElementInArray(array, code, value) {
        for (var elt of array)
            if (elt[code] == value)
                return elt;
        return null;
    },
    //methode pour fusionner les données de concours SIOP/GCF avec celles de reglements
    async mergeDataConcoursWithDDRs(ddrs, numeroProjet) {
        //recuperer les concours gcfs lié au projet
        var concoursGCFs = await app.getExternalData(app.getUrl('urlGetConcoursGCFByProjet', numeroProjet), 'mergeDataConcoursWithDDRs > concoursGcfs');
        var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', numeroProjet), 'mergeDataConcoursWithDDRs > getProjet', true);
        for (var ddr of ddrs) {
            ddr.canceled = (this.isDossierAnnule(ddr.code_statut_dossier) ? true : false);
            ddr.renderMontant = this.getRendermontantDDR(ddr);
            if (!this.isReversement(ddr.modalite_paiement) && !app.isAFD(ddr.entite))
                ddr.renderDecaissement = ddr.numero_decaissement + '<sup>e</sup> ' + lang.disbursement;
            //recuperer les infos de concours lié a ce reglement
            var concoursGCF = this.getElementInArray(concoursGCFs, 'numeroConcours', ddr.numero_concours);
            var concoursSIOP = this.getElementInArray(projet.listConcours, 'numeroConcours', ddr.numero_concours);
            ddr.renderDlvfRav = app.formatMontantTrigramme(app.formatNumberWithDecimals(concoursGCF.resteAVerser), concoursSIOP.idDevise) + '<br>' + this.formatDate(concoursGCF.dlvf);
            ddr.renderDatePaiement = this.renderEmpty(this.formatDate(ddr.date_paiement));
            ddr.renderMontantPaiement = (this.isEmpty(ddr.montant_definitif_reglement)) ? this.renderEmpty(ddr.montant_definitif_reglement) : app.formatMontantTrigramme(app.formatNumberWithDecimals(ddr.montant_definitif_reglement), ddr.devise_paiement);
        }
        return ddrs;
    },
    //methode pour recuperer le pays de realisation de projet
    getPaysRealisationProjet(projetPaysRealisation) {
        if (projetPaysRealisation != null && projetPaysRealisation.length == 1) {
            if (projetPaysRealisation[0].pays.idPays == 'ZZ')
                return lang.multiPays;
            else
                return projetPaysRealisation[0].pays.libelleCourtPays;
        }
        else
            return lang.multiPays;
    },
    async getTiers(id) {
        if (this.isEmpty(id))
            return;

        var beneficiaire = await this.getExternalData(app.getUrl('urlGetBeneficiaireById', id), 'app.getTiers');

        if (beneficiaire != null) {
            //recuperation de l'adresse et formatage
            if (beneficiaire.tiersAdresses != null && beneficiaire.tiersAdresses.length > 0) {
                for (var adresse of beneficiaire.tiersAdresses) {
                    if (adresse.typeAdresse == 'ADREXP') {
                        beneficiaire.adresse = adresse;
                        beneficiaire.adresse.adresse = app.nvl(adresse.numRue) + app.nvl(adresse.nomRue, ' ') + app.nvl(adresse.infoComplAdr, ', ').trim();
                        if (!this.isEmpty(adresse.codePostal))
                            beneficiaire.adresse.ville = adresse.codePostal + ' ' + beneficiaire.adresse.ville;
                    }
                }
            }
            //recuperation des comptes
            var comptes = [];
            if (beneficiaire.swiftCompteTiers != null && beneficiaire.swiftCompteTiers.length > 0) {
                for (var compte of beneficiaire.swiftCompteTiers) {
                    comptes.push({
                        bankIntermed: compte.swiftCompte.nomBankIntermed,
                        banque: compte.swiftCompte.nomBank,
                        bic11: compte.swiftCompte.bic11,
                        bic11Bankintermed: compte.swiftCompte.bic11BankIntermed,
                        idCbInterne: compte.swiftCompte.id,
                        idNumCpt: compte.swiftCompte.idNumCpt,
                        libCourtPays: compte.swiftCompte.paysCB.libelleCourtPays,
                        libCpte: compte.swiftCompte.libCpte
                    });
                }
            }
            beneficiaire.comptes = comptes;
        }

        return beneficiaire;
    },
    async getTiersUsedByConcours(numeroConcours, entite, typeParentObject, idBeneficiaire) {
        var tiersUsedByConcours = await this.getExternalData(this.getUrl('urlGetTiersUsedByConcours', numeroConcours, typeParentObject, entite), 'app.getTiersUsedByConcours');

        if (tiersUsedByConcours != null) {
            for (var tiers of tiersUsedByConcours) {
                tiers.idTiers = tiers.id_tiers;
                tiers.libLong = app.getRefLabel('refBeneficiaires', tiers.idTiers);
            }
        }

        //si le tiers n'existe pas dans la liste des tiers utilisés par le concours alors on l'ajoute
        var beneficiaire = await this.getTiers(idBeneficiaire);

        var beneficiaireExist = this.existInArray(tiersUsedByConcours, 'idTiers', idBeneficiaire);

        if (idBeneficiaire != null && !beneficiaireExist)
            tiersUsedByConcours.push(beneficiaire);

        return tiersUsedByConcours;
    },
    hideElement(id) {
        document.getElementById(id).style.display = 'none';
    },
    showElement(id) {
        document.getElementById(id).style.display = 'block';
    },
    getElementValue(id) {
        var element = document.getElementById(id);
        return (element != null) ? element.value : '';
    },
    setElementValue(id, value) {
        var element = document.getElementById(id);
        if (element != null)
            element.value = value;
    },
    clickElement(id) {
        $('#' + id).click();
    },
    //methode pour verifier que les elements de tableau A sont inclus dans le tableau B
    arrayAIsIncludesInArrayB(arrayA, arrayB) {
        if (arrayA.length > arrayB.length)
            return false;
        else {
            for (var eltA of arrayA) {
                var isExist = false;
                for (var eltB of arrayB) {
                    if (eltB == eltA)
                        isExist = true;
                }
                if (!isExist)
                    return false;
            }
            return true;
        }
    },
    async toggleSidebar(cmp) {
        cmp.showSidebar = !cmp.showSidebar;

        var id = '#ico-sidebar-context';
        var cls = $(id).attr('class');

        if (cls.indexOf('compress') != -1) {
            $(id).attr('class', cls.replace('compress', 'expand'));
            $('#sidebar-col').attr('class', 'col-auto sidebar-col');
            $('#sidebar-col-content').attr('class', 'col');
            $('#sidebar-container').attr('class', 'container infos-dossier sidebar-container');
        } else {
            $(id).attr('class', cls.replace('expand', 'compress'));
            $('#sidebar-col').attr('class', 'col-12 col-md-4 col-xl-3');
            $('#sidebar-col-content').attr('class', 'col-12 col-md-8 col-xl-9');
            $('#sidebar-container').attr('class', 'container infos-dossier');
        }
    },
    isTrueAll(items, key) {
        for (var item of items)
            if (!app.isTrue(item[key]))
                return false;
        return true;
    },
    findObjectEltInArray(items, obj) {
        if (items.length == 0)
            return false;
        else {
            for (var item of items) {
                if (JSON.stringify(obj) === JSON.stringify(item))
                    return true;
            }
        }
        return false;
    },
    isReportingItemAddable(item, filters) {
        var foundNotEmpty = false;
        for (var filter of filters) {
            if ((!app.isEmpty(filter.value) && !filter.multiple) || (filter.value != null && filter.value.length > 0 && filter.multiple)) {
                foundNotEmpty = true;
                break;
            }
        }
        if (!foundNotEmpty)
            return true;

        for (var filter of filters) {
            if (!filter.multiple) {
                if (app.isNotEmpty(filter.value) && item[filter.name] != filter.value)
                    return false;
            } else {
                if (filter.value != null && filter.value.length > 0)
                    return this.existStringInArray(filter.value, item[filter.name]);
            }
        }

        return true;
    },
    //verifier que la tache a terminée son execution
    async verifTaskArchived(caseId, idTask) {
        var nbRetry = 50;
        for (var count = 1; count <= nbRetry; count++) {
            await app.sleep(200);
            var tache = await app.getExternalData(app.getUrl('urlGetTaskByCaseId', caseId), 'getArchivedTask', true);
            if (!Array.isArray(tache) && tache != null && tache.id != idTask) {
                break;
            }
        }
    },
    getElementDifferentsInTwoArrays(arrayA, arrayB, code) {
        var arrayResult = [];
        for (var eltA of arrayA) {
            var exist = false;
            for (var eltB of arrayB) {
                if (eltA[code] == eltB[code]) {
                    exist = true;
                }
            }
            if (!exist)
                arrayResult.push(eltA);
        }
        return arrayResult;
    },
    getPaysRealisation(projet, DO) {
        if (projet.projetPaysRealisation != null && projet.projetPaysRealisation.length > 0) {
            for (var paysRealisation of projet.projetPaysRealisation) {
                if (paysRealisation.ordrePays == 1 && paysRealisation.pays.idPays == "ZZ" && projet.projetPaysRealisation.length > 1) {
                    for (var element of projet.projetPaysRealisation) {
                        if (element.ordrePays == 2 && element.pays.idPays != "ZZ") {
                            DO.pays_realisation = element.pays.idPays;
                            break;
                        }
                    }

                }
                else if (paysRealisation.ordrePays == 1 && paysRealisation.pays.idPays == "ZZ" && projet.projetPaysRealisation.length == 1) {
                    DO.pays_realisation = paysRealisation.pays.idPays;
                    break;
                }
                else {
                    if (paysRealisation.ordrePays == 1)
                        DO.pays_realisation = paysRealisation.pays.idPays;

                }
            }
        }
        return DO;
    },
    getCorpNotifFormat(input) {
        return (input.replace("<pre>", "").replace("</pre>", ""));
    },
    taskIsMisePaiement(tache) {
        if (!this.isEmpty(tache) && !this.isEmpty(tache.description))
            return (tache.description.includes('miseEnPaiement') || tache.description.includes('justificatifRemboursement'));
        return false;
    },
    isAfterValidByDirecteurDdr(reglement) {
        return reglement != null && reglement.code_statut_dossier != null && (reglement.code_statut_dossier == 'DDR5' || reglement.code_statut_dossier == 'DDR5B' || reglement.code_statut_dossier == 'DDR14' || reglement.code_statut_dossier == 'DDR7' || reglement.code_statut_dossier == 'DDR8' || reglement.code_statut_dossier == 'DDR11' || reglement.code_statut_dossier == 'DDR12' || reglement.code_statut_dossier == 'DDR13');
    },
    //methode pour extraire seulement les DDRs payées pour une avance dans une liste passée en parametre
    getDdrsPayeesForAvance(dossiersRgelement) {
        var listeResult = [];

        if (dossiersRgelement != null && dossiersRgelement.length > 0) {
            for (var dossierReglement of dossiersRgelement) {
                if (refs['refCodesDdrValide'].includes(dossierReglement.code_statut_dossier) && (dossierReglement.code_statut_dossier != 'DDR5' || dossierReglement.code_statut_dossier != 'DDR5B' || dossierReglement.code_statut_dossier != 'DDR14'))
                    listeResult.push(dossierReglement);
            }
            //trier la liste selon la date de paiement
            app.sortBy(listeResult, [
                { key: 'date_paiement', order: 'asc' }
            ]);
        }
        return listeResult;
    },
    // METHODE POUR LE CANICOULE DES MONTANTS AVANCE
    getResteJustifierDecaisserDossier(avanceContractuel) {
        var resteJustifierDecaisserDossier = 0;

        //enlever les DDRs non payées
        var dossiersReglement = this.getDdrsPayeesForAvance(avanceContractuel.dossiersReglement);
        var montantVerseSaufDernier = this.montantVerseSaufDernier(dossiersReglement);
        var montantVerseDernier = this.getMontantVerseDernier(dossiersReglement);

        var pourcentage = ((this.isEmpty(avanceContractuel.avenant) || this.isEmpty(avanceContractuel.avenant.pourcentage_final_dernier_versement)) ? avanceContractuel.pourcentage_initial_dernier_versement : avanceContractuel.avenant.pourcentage_final_dernier_versement);
        resteJustifierDecaisserDossier = (montantVerseSaufDernier + (montantVerseDernier * pourcentage / 100)) - avanceContractuel.montant_justifie_total;

        if (resteJustifierDecaisserDossier < 0 && this.isAFD(avanceContractuel.entite))
            resteJustifierDecaisserDossier = 0;

        return resteJustifierDecaisserDossier;
    },
    getMontantVerseDernier(dossiersReglement) {
        var montantVerseDernier = 0;

        if (dossiersReglement != null && dossiersReglement.length != 0) {
            var size = (dossiersReglement.length) - 1;
            var somme = 0;

            if (dossiersReglement[size].justificatifsRemboursement.length > 0) {
                for (var justifRemb of dossiersReglement[size].justificatifsRemboursement)
                    somme += justifRemb.montant_remboursement;
            }
            // montantVerseDernier = dossiersReglement[size].montant_reglement;
            montantVerseDernier = dossiersReglement[size].montant_reglement - somme;
        }
        return montantVerseDernier;
    },
    montantVerseSaufDernier(dossiersReglement) {
        var montantVerseSaufDernier = 0;
        var sommeDdrsSaufDernier = 0;

        if (dossiersReglement != null && dossiersReglement.length > 1) {
            var somme = 0;
            for (var index = 0; index < dossiersReglement.length - 1; index++) {
                sommeDdrsSaufDernier += dossiersReglement[index].montant_reglement;

                if (dossiersReglement[index].justificatifsRemboursement.length > 0) {
                    for (var justifRemb of dossiersReglement[index].justificatifsRemboursement)
                        somme += justifRemb.montant_remboursement;
                }
                montantVerseSaufDernier = sommeDdrsSaufDernier - somme;
            }
        }
        return montantVerseSaufDernier;
    },
    getResteJustifier(montantVerseTotal, montantTotalJustificatifsAvance) {
        var resteJustifier = (this.isEmpty(montantVerseTotal) ? 0 : montantVerseTotal) - (app.isEmpty(montantTotalJustificatifsAvance) ? 0 : montantTotalJustificatifsAvance);

        return resteJustifier;
    },
    setLinkEvent: function (form, name) { //NOUR§ARNAUD 13/02/2024
        var cmp = appFormio.findComponent('key', name, form, true);

        var inputId = cmp?.id + '-' + name;
        var input = document.getElementById(inputId);
        var parent = input?.parentElement;

        if (parent?.childNodes != null && parent?.childNodes?.length > 3) {
            var suffix = parent.childNodes[3];
            suffix.className = "input-group-append cursor-pointer";

            suffix.addEventListener('click', function (e) {
                app.gotoLink(document.getElementById(inputId).value);
            });
        }
    },
    async verifTaskCreated(caseId) {
        var nbRetry = 50;
        var nameTache = null;

        for (var count = 1; count <= nbRetry; count++) {
            await app.sleep(200);

            var tache = await this.getExternalData(app.getUrl('urlGetTaskByCaseId', caseId), 'app > verifTaskCreated', true);

            if (!Array.isArray(tache) && tache != null) {
                nameTache = tache.name;
                break;
            }
        }

        return nameTache;
    },
    async getPageError(numProjet) {
        var accessObj = await app.getExternalData(app.getUrl('urlGetAccessObjectBdm', numProjet), '> getAccessObject');

        console.log(JSON.stringify(accessObj).includes("1"));
        return (JSON.stringify(accessObj).includes("1"));
    },
    controlMailFormat(input) {
        console.log("input email>>", input);

        if ((input.indexOf('@afd.fr') != -1) || (input.indexOf('@proparco.fr') != -1))
            return true;
        else
            return false;
    },
    async getCaseInfo(archived, caseId, parent) {
        var nbRetry = 15;

        for (var count = 1; count <= nbRetry; count++) {
            await app.sleep(500);

            console.warn(parent + ' -> getCaseInfo(caseId=' + caseId + ') >> count ' + count);

            var caseInfo = await this.getExternalData(this.getUrl('urlGetCase' + ((archived) ? 'AFD' : 'PROPARCO'), caseId), parent, true);

            if (caseInfo != null && caseInfo.id != undefined)
                return caseInfo;
        }

        console.error(parent + ' -> getCaseInfo(caseId=' + caseId + ') >> caseInfo is null ');
        return;
    },
    async getCaseContext(archived, caseId, parent) {
        var nbRetry = 25;

        for (var count = 1; count <= nbRetry; count++) {
            await app.sleep(500);

            console.warn(parent + ' -> getCaseContext(caseId=' + caseId + ') >> count ' + count);

            var caseContext = await this.getExternalData(this.getUrl('urlGetCaseContext' + ((archived) ? 'AFD' : 'PROPARCO'), caseId), parent);

            if (caseContext != null)
                return caseContext;
        }

        console.error(parent + ' -> getCaseContext(caseId=' + caseId + ') >> caseContext is null ');
        return;
    }
};