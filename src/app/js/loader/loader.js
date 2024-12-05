var urlHttpServer = 

var scriptsJs = [
    '/js/lib/flatpickr.js',
    '/js/lib/formio.full.min.js',
    '/js/app.js',
    '/js/config.langs.js',
    '/js/config.urls.js',
    '/js/config.templates.js',
    '/js/config.tables.js',
    '/js/config.js',
    '/js/app.formio.js',
    '/js/config.dataobjects.js',
    '/js/config.formio.js',
    '/js/lib/jquery.min.js',
    '/js/lib/bootstrap.bundle.min.js',
    '/js/lib/jquery.easing.min.js',
    '/js/lib/sb-admin-2.js'
];

var linksCss = [
    '/css/lib/formio.full.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css',
    '/css/lib/sb-admin-2.css',
    '/css/lib/flatpickr.css',
    '/css/style.css',
    '/css/style.boolean.css',
    '/css/style.builder.css',
    '/css/style.buttons.css',
    '/css/style.card.css',
    '/css/style.chartjs.css',
    '/css/style.dashboard.css',
    '/css/style.dates.css',
    '/css/style.filariane.css',
    '/css/style.formio.css',
    '/css/style.infos.css',
    '/css/style.modal.css',
    '/css/style.navbar.css',
    '/css/style.sidebar.css',
    '/css/style.table.css',
    '/css/style.tabs.css',
    '/css/style.controles.css',
    '/css/style.tree.css'
];

function addScriptToPage(script) {
    var element = document.createElement('script');
    element.src = urlHttpServer + script;
    element.async = false;
    document.head.appendChild(element);
}

function addScriptToPageAsync(script) {
    var element = document.createElement('script');
    element.src = urlHttpServer + script;
    element.async = true;
    document.head.appendChild(element);
}

function addScriptToBody(script) {
    var element = document.createElement('script');
    element.src = urlHttpServer + script;
    element.type = "module";
    document.body.appendChild(element);
}

function addLinkToPage(link) {
    var element = document.createElement('link');
    if (link.indexOf('http') != -1)
        element.href = link;
    else
        element.href = urlHttpServer + link;
    element.rel = 'stylesheet';
    document.head.appendChild(element);
}

function changeAppTitle() {
    document.title = 'Verso';

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/img/favicon_verso.png';
    document.getElementsByTagName('head')[0].appendChild(link);
}

function initApp() {
    console.log('#loader : initApp');

    //transfert de la frame bonita dans le parent window
    if (window.parent.frames != null && window.parent.frames.length > 0) {
        var frameHref = window.parent.frames[0].document.location.href;
        frameHref = frameHref.substring(0, frameHref.lastIndexOf('?'));

        window.parent.document.location.href = frameHref;
    }

    //desactivation du header bonita
    //window.parent.document.getElementsByClassName("row")[0].style.display = "none";

    //base 
    var base = document.createElement('base');
    base.href = window.parent.document.location.pathname;
    document.head.appendChild(base);

    //remplacement de la page par le container angular
    document.body.appendChild(document.createElement('app-root'));

    //desactivation des styles bonita
    for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href != null && (
            document.styleSheets[i].href.indexOf('bootstrap.min.css') != -1 ||
            document.styleSheets[i].href.indexOf('theme/theme.css') != -1)) {
            document.styleSheets[i].disabled = true;
        }
    }

    //ajout des css
    console.log('#loader : initApp > css');
    for (var link of linksCss)
        addLinkToPage(link);

    //ajout des lib js
    console.log('#loader : initApp > libs');
    for (var script of scriptsJs)
        addScriptToPage(script);

    addScriptToPageAsync('/js/lib/pdfmake.min.js');
    addScriptToPageAsync('/js/lib/pdfmake.fonts.js');

    addScriptToPage('/js/angular/runtime.js');
    addScriptToPage('/js/angular/polyfills.js');
    addScriptToPage('/js/angular/main.js');

    changeAppTitle();
}