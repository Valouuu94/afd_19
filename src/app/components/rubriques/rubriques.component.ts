import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { TableComponent } from "../table/table.component";
import { StoreService } from '../../services/store.service';
import { ModalComponent } from "../modal/modal.component";
import { NgIf } from "@angular/common";


declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;
declare const columns: any;

@Component({
    selector: "app-rubriques",
    templateUrl: "./rubriques.component.html",
    standalone: true,
    imports: [NgIf, TableComponent, ModalComponent]
})
export class RubriquesComponent implements OnInit {
    @ViewChild("tableRubriques") tableRubriques!: TableComponent;
    @ViewChild("tableRubriquesAR") tableRubriquesAR!: TableComponent;
    @ViewChild('modalDeleteRubrique') modalDeleteRubrique!: ModalComponent;

    isAFD: boolean = false;
    lang: any = lang;
    rubriques: any = null;
    showRubriques: boolean = false;
    rubriquesAR: any = null;
    avanceRembRubriques: any = null;
    showRubriquesAR: boolean = false;
    dc: any;
    devisesDC: any;
    rubriqueSelected: any;
    firstLoad: any;
    isAvanceRemboursable: any;
    isFirstDdrVentilatedRubs: any;
    rubriqueDeleted: any;
    loading: any;
    deviseAFD: any;
    classCssLevel0: any = "td-level-0";
    classCssLevel1: any = "td-level-1";
    classCssLevel2: any = "td-level-2";
    classCssLevel3: any = "td-level-3";
    isVentilation: any;
    justificatif: any;
    justificatifRemboursement: any;
    deviseDR: any;
    hasDuplicateDevise: boolean = false;
    isJustifRembIntegral: boolean = false;

    @Input() enableAdd: boolean = true;
    @Input() readOnly: boolean = false;
    @Input() isInsideModal: boolean = false;
    @Input() isJustificatifRemboursment: boolean = false;

    @Output() change = new EventEmitter();

    constructor(public store: StoreService) { }

    ngOnInit() {
        app.setCurrentCmp('rubriques', this);
    }

    async getRubriques(devisesDC: any, dc: any, addRubrique: any, firstLoad: any, changeAutreDevise: any, changeDeviseAFD: any, changeLibelle: any, rubriquesVar: any, isVentilation?: any, justificatif?: any, deviseDR?: any, ddr?: any, justificatifRemboursement?: any) {
        console.time('getRubriques');

        this.loading = false;
        this.isVentilation = isVentilation;
        this.justificatif = justificatif;
        this.justificatifRemboursement = justificatifRemboursement;
        this.deviseDR = deviseDR;
        this.dc = dc;
        this.firstLoad = firstLoad;

        this.devisesDC = Object.assign([], devisesDC);

        app.log('rubriques > getRubriques - isJustifRembIntegral', this.isJustifRembIntegral);
        app.log('rubriques > getRubriques - isJustificatifRemboursment', this.isJustificatifRemboursment);

        // recuperation de la devise AFD de DC
        if (!this.isVentilation) {
            this.deviseAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');

            if (changeDeviseAFD && app.existInArray(this.devisesDC, "devise", this.deviseAFD))
                return;

        }
        else {
            this.resetListRubriques();
            this.deviseAFD = this.dc.devise_afd;
            this.isAvanceRemboursable = this.dc.avance_remboursable == '1';
            // this.isFirstDdrVentilatedRubs = (this.dc.dossiers_reglements.length == 0 || (this.dc.dossiers_reglements.length == 1 && this.dc.dossiers_reglements[0].persistenceId == ddr.persistenceId));

            var count = 0;
            var ddrVar = null;

            for (var dr of this.dc.dossiers_reglements) {
                if (!app.isDossierAnnule(dr.code_statut_dossier))
                    count += 1;
                if (dr.persistenceId == ddr.persistenceId)
                    ddrVar = dr;
            }

            this.isFirstDdrVentilatedRubs = (count == 1 && ddrVar != null);
        }
        //avance remboursable
        await app.sleep(150);
        var toggle = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'avance_remboursable');

        this.isAvanceRemboursable = false;
        if (toggle == '1' || (this.dc != null && this.dc.avance_remboursable == '1'))
            this.isAvanceRemboursable = true;

        var rubs = null;
        if (rubriquesVar != null)
            rubs = rubriquesVar;
        else if (this.rubriques != null && !this.isAvanceRemboursable)
            rubs = this.rubriques;
        else if (this.rubriquesAR != null && this.isAvanceRemboursable)
            rubs = this.rubriquesAR;
        else
            rubs = [];

        //recuperer le libelle de DC
        if (!this.isVentilation) {
            var libelleDC = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'libelle');
            libelleDC = (this.dc != null ? (this.dc.code_fonctionnel + " " + libelleDC) : libelleDC);
        }
        else
            libelleDC = this.dc.code_fonctionnel + " " + this.dc.libelle;

        if (!app.existInArray(this.devisesDC, "devise", this.deviseAFD))
            this.devisesDC.unshift({ "devise": this.deviseAFD, "isDeviseAFD": true });

        if (changeLibelle) {
            if (!this.isAvanceRemboursable) {
                var indexElt = app.getIndexElementInArrayByValue(this.rubriques, "type", "DC", false);
                this.rubriques[indexElt]["libelle"] = libelleDC;
            } else {
                var indexElt = app.getIndexElementInArrayByValue(this.rubriquesAR, "type", "DC", false);
                this.rubriquesAR[indexElt]["libelle"] = libelleDC;
            }
        }
        else {
            //reinitialiser quand il y a un changement de devise
            if (changeAutreDevise || changeDeviseAFD) {
                if (!this.isAvanceRemboursable) {
                    columns["rubriquesTemplate"] = [
                        { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", uniqueChoice: true, isFixed: true },
                        { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }];

                    for (var autreDevise of this.devisesDC) {
                        columns["rubriquesTemplate"].push({ "label": lang.rubriques.montantInitial + autreDevise.devise, "key": "montant_initial_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                            { "label": lang.rubriques.montantFinal + autreDevise.devise, "key": "montant_final_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                            { "label": lang.rubriques.montantEnregistre + autreDevise.devise, "key": "montant_enregistre_" + autreDevise.devise, "type": "number", "amount": true, width: "250px", "editable": true, "separator": true, read: true },
                            { "label": lang.rubriques.rav + autreDevise.devise, "key": "montant_reste_a_verser_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, read: true, applyBorderRight: true });
                    }

                    columns["rubriquesTemplate"].push({ action: true, type: 'delete' });

                    var rubriquesResult = [];
                    for (var autreDevise of this.devisesDC) {
                        var newDevise = null;

                        for (var rubr of this.rubriques) {
                            var existDevise = false;
                            for (var key of Object.keys(rubr)) {
                                if (key.includes(autreDevise.devise)) {
                                    existDevise = true;
                                    break;
                                }
                            }

                            if (!existDevise)
                                newDevise = autreDevise.devise;

                            if (existDevise) {
                                var indexElt = app.getIndexElementInArrayByValue(rubriquesResult, 'libelle', rubr.libelle, false);
                                if (indexElt == -1) {
                                    var disabled = (rubr.type == "DC" ? true : rubr.deleted);

                                    rubriquesResult.push({
                                        "libelle": rubr.libelle,
                                        ["montant_initial_" + autreDevise.devise]: rubr["montant_initial_" + autreDevise.devise],
                                        ["montant_final_" + autreDevise.devise]: rubr["montant_final_" + autreDevise.devise],
                                        ["montant_enregistre_" + autreDevise.devise]: rubr["montant_enregistre_" + autreDevise.devise],
                                        ["montant_reste_a_verser_" + autreDevise.devise]: rubr["montant_reste_a_verser_" + autreDevise.devise],
                                        "type": rubr.type,
                                        "level": rubr.level,
                                        "collumnsDisabled": rubr.collumnsDisabled,
                                        "rubriqueSelected": false,
                                        'cmpCurrent': rubr.cmpCurrent,
                                        'nameFunction': rubr.nameFunction,
                                        "libelleParent": rubr.libelleParent,
                                        "updateParentsItems": rubr.updateParentsItems,
                                        "disabled": disabled,
                                        "id": rubr.id,
                                        "devisesCodes": (!app.isEmpty(rubr.devisesCodes) ? [app.getEltInArray(rubr.devisesCodes, 'devise', autreDevise.devise)] : []),
                                        "classCss": (rubr.type != "DC" ? rubr.classCss : null),
                                        "applyBorderDanger": { "nameFunction": "labelRubIsNullOrDoubling" },
                                        "deleted": disabled && rubr.type != "DC",
                                        "disabledCheckBox": disabled && rubr.type != "DC"

                                    });
                                }
                                else {
                                    rubriquesResult[indexElt]["montant_initial_" + autreDevise.devise] = rubr["montant_initial_" + autreDevise.devise];
                                    rubriquesResult[indexElt]["montant_final_" + autreDevise.devise] = rubr["montant_final_" + autreDevise.devise];
                                    rubriquesResult[indexElt]["montant_enregistre_" + autreDevise.devise] = rubr["montant_enregistre_" + autreDevise.devise];
                                    rubriquesResult[indexElt]["montant_reste_a_verser_" + autreDevise.devise] = rubr["montant_reste_a_verser_" + autreDevise.devise];

                                    if (rubriquesResult[indexElt]["type"] != "DC") {
                                        if (!app.existInArray(rubriquesResult[indexElt]["devisesCodes"], "code", 'A'))
                                            codeDevise = "A";
                                        if (!app.existInArray(rubriquesResult[indexElt]["devisesCodes"], "code", 'B'))
                                            codeDevise = "B";
                                        else
                                            codeDevise = "C";
                                        if (rubr.deleted) {
                                            rubriquesResult[indexElt]['deleted'] = true;
                                            rubriquesResult[indexElt]['disabled'] = true;
                                            rubriquesResult[indexElt]['disabledCheckBox'] = true;
                                        }
                                        rubriquesResult[indexElt]["devisesCodes"].push({ "devise": autreDevise.devise, "code": codeDevise });
                                        var columnsDisabledByDevise = rubriquesResult[indexElt].collumnsDisabled;
                                        columnsDisabledByDevise["montant_final_" + autreDevise.devise] = this.haveChildren(this.rubriques, rubriquesResult[indexElt].libelle);
                                        columnsDisabledByDevise["montant_initial_" + autreDevise.devise] = this.haveChildren(this.rubriques, rubriquesResult[indexElt].libelle);
                                        rubriquesResult[indexElt].collumnsDisabled = columnsDisabledByDevise;
                                    }
                                }
                            }
                            else {
                                var indexElt = app.getIndexElementInArrayByValue(rubriquesResult, 'libelle', rubr.libelle, false);
                                if (indexElt != -1) {
                                    var codeDevise = "";

                                    if (rubriquesResult[indexElt]["type"] != "DC") {
                                        if (!app.existInArray(rubriquesResult[indexElt]["devisesCodes"], "code", 'A'))
                                            codeDevise = "A";
                                        if (!app.existInArray(rubriquesResult[indexElt]["devisesCodes"], "code", 'B'))
                                            codeDevise = "B";
                                        else
                                            codeDevise = "C";
                                    }

                                    rubriquesResult[indexElt]["montant_initial_" + autreDevise.devise] = "";
                                    rubriquesResult[indexElt]["montant_final_" + autreDevise.devise] = "";
                                    rubriquesResult[indexElt]["montant_enregistre_" + autreDevise.devise] = "";
                                    rubriquesResult[indexElt]["montant_reste_a_verser_" + autreDevise.devise] = "";

                                    if (rubriquesResult[indexElt]["type"] != "DC") {
                                        rubriquesResult[indexElt]["devisesCodes"].push({ "devise": autreDevise.devise, "code": codeDevise });

                                        if (rubr.deleted) {
                                            rubriquesResult[indexElt]['deleted'] = true;
                                            rubriquesResult[indexElt]['disabled'] = true;
                                            rubriquesResult[indexElt]['disabledCheckBox'] = true;
                                        }
                                        var columnsDisabledByDevise = rubriquesResult[indexElt].collumnsDisabled;
                                        columnsDisabledByDevise["montant_final_" + autreDevise.devise] = this.haveChildren(this.rubriques, rubriquesResult[indexElt].libelle);
                                        columnsDisabledByDevise["montant_initial_" + autreDevise.devise] = this.haveChildren(this.rubriques, rubriquesResult[indexElt].libelle);
                                        rubriquesResult[indexElt].collumnsDisabled = columnsDisabledByDevise;
                                    }
                                }
                                else if (indexElt == -1) {
                                    if (this.rubriques.length == 1)

                                        rubriquesResult.push({
                                            "libelle": rubr.libelle,
                                            ["montant_initial_" + autreDevise.devise]: "",
                                            ["montant_final_" + autreDevise.devise]: "",
                                            ["montant_enregistre_" + autreDevise.devise]: "",
                                            ["montant_reste_a_verser_" + autreDevise.devise]: "",

                                            "type": rubr.type,
                                            "disabled": true,
                                            "rubriqueSelected": false
                                        });
                                    else if (this.devisesDC.length == 1)
                                        rubriquesResult.push({
                                            "libelle": rubr.libelle,
                                            ["montant_initial_" + autreDevise.devise]: "",
                                            ["montant_final_" + autreDevise.devise]: "",
                                            ["montant_enregistre_" + autreDevise.devise]: "",
                                            ["montant_reste_a_verser_" + autreDevise.devise]: "",
                                            "type": rubr.type,
                                            "level": rubr.level,
                                            "collumnsDisabled": rubr.collumnsDisabled,
                                            "rubriqueSelected": false,
                                            'cmpCurrent': rubr.cmpCurrent,
                                            'nameFunction': rubr.nameFunction,
                                            "libelleParent": rubr.libelleParent,
                                            "updateParentsItems": rubr.updateParentsItems,
                                            "disabled": rubr.disabled,
                                            "id": rubr.id,
                                            "devisesCodes": [{ "devise": autreDevise.devise, "code": 'A' }],
                                            "classCss": rubr.classCss,
                                            "applyBorderDanger": { "nameFunction": "labelRubIsNullOrDoubling" }
                                        });
                                    else if (this.rubriques.length > 1) {
                                        var disabled = (rubr.type == "DC" ? true : rubr.deleted);
                                        console.warn("existedevise element new lidia", disabled)
                                        var codeDevise = '';
                                        if (rubr.type != "DC") {
                                            if (!app.existInArray(rubr["devisesCodes"], "code", 'A'))
                                                codeDevise = "A";
                                            if (!app.existInArray(rubr["devisesCodes"], "code", 'B'))
                                                codeDevise = "B";
                                            else
                                                codeDevise = "C";
                                        }
                                        rubriquesResult.push({
                                            "libelle": rubr.libelle,
                                            ["montant_initial_" + autreDevise.devise]: "",
                                            ["montant_final_" + autreDevise.devise]: "",
                                            ["montant_enregistre_" + autreDevise.devise]: "",
                                            ["montant_reste_a_verser_" + autreDevise.devise]: "",
                                            "type": rubr.type,
                                            "level": rubr.level,
                                            "collumnsDisabled": rubr.collumnsDisabled,
                                            "rubriqueSelected": false,
                                            'cmpCurrent': rubr.cmpCurrent,
                                            'nameFunction': rubr.nameFunction,
                                            "libelleParent": rubr.libelleParent,
                                            "updateParentsItems": rubr.updateParentsItems,
                                            "disabled": disabled,
                                            "id": rubr.id,
                                            "devisesCodes": [{ "devise": autreDevise.devise, "code": codeDevise }],
                                            "classCss": (rubr.type != "DC" ? rubr.classCss : null),
                                            "applyBorderDanger": { "nameFunction": "labelRubIsNullOrDoubling" },
                                            "deleted": disabled && rubr.type != "DC",
                                            "disabledCheckBox": disabled && rubr.type != "DC"

                                        });
                                    }
                                }
                            }
                        }
                    }
                    this.rubriques = rubriquesResult;
                }
                else {
                    var existDevise = false;
                    for (var rubr of this.rubriquesAR) {
                        for (var key of Object.keys(rubr)) {
                            if (key.includes(this.deviseAFD)) {
                                existDevise = true;
                                break;
                            }
                        }
                    }

                    if (!existDevise) {
                        //quand c pas de ventilation
                        columns["rubriquesTemplateAR"] = [
                            { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", uniqueChoice: true, isFixed: true },
                            { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
                        ]

                        columns["rubriquesTemplateAR"].push(
                            { "label": lang.rubriques.montantInitial + this.deviseAFD, "key": "montant_initial", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                            { "label": lang.rubriques.montantFinal + this.deviseAFD, "key": "montant_final", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                            { "label": lang.rubriques.pourcentageAR, tooltip: lang.rubriques.pourcentageArLibLong, key: 'pourcentage_avance', "type": "number", "amount": true, width: "150px", "editable": true, "separator": true },
                            { "label": lang.rubriques.montantAR, tooltip: lang.rubriques.montantArLibLong, key: 'montant_avance', "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, read: true },
                            { action: true, type: 'delete' });

                        var rubriquesArResult = [];
                        for (var rubAR of this.rubriquesAR) {
                            if (rubAR.type == "DC")
                                rubriquesArResult.push({
                                    "libelle": rubAR.libelle,
                                    ["montant_initial"]: "",
                                    ["montant_final"]: "",
                                    ["montant_avance"]: "",
                                    ["pourcentage_avance"]: "",
                                    "type": rubAR.type,
                                    'cmpCurrent': rubAR.cmpCurrent,
                                    "showDeleteIcon": rubAR.showDeleteIcon,
                                    "applyBorderDanger": rubAR.applyBorderDanger,
                                    "rubriqueSelected": rubAR.rubriqueSelected,
                                    "disabled": true,
                                });
                            else {
                                rubriquesArResult.push({
                                    "libelle": rubAR.libelle,
                                    ["montant_initial"]: rubAR.montant_initial,
                                    ["montant_final"]: rubAR.montant_final,
                                    ["montant_avance"]: rubAR.montant_avance,
                                    ["pourcentage_avance"]: rubAR.pourcentage_avance,
                                    ["devise"]: rubAR.devise,
                                    "type": rubAR.type,
                                    "showDeleteIcon": rubAR.showDeleteIcon,
                                    "level": rubAR.level,
                                    "rubriqueSelected": rubAR.rubriqueSelected,
                                    "classCss": rubAR.classCss,
                                    'cmpCurrent': rubAR.cmpCurrent,
                                    'nameFunction': rubAR.nameFunction,
                                    "updateParentsItems": rubAR.updateParentsItems,
                                    "id": rubAR.id,
                                    "libelleParent": rubAR.libelleParent,
                                    "applyBorderDanger": rubAR.applyBorderDanger,
                                    "clumnsIcons": rubAR.pourcentage_avance,
                                    "collumnsDisabled": rubAR.collumnsDisabled,
                                    "deleted": rubAR.deleted,
                                    "disabledCheckBox": rubAR.disabledCheckBox,
                                    "disabled": rubAR.disabled
                                });
                            }
                        }
                        this.rubriquesAR = rubriquesArResult;
                    }

                }
            }

            // RECUPERER LES DEVISES DE DC et RAJOUTER LE MAPPING DANS COLUMNS
            if (!addRubrique) {
                if (this.isAvanceRemboursable && this.rubriquesAR == null) {
                    if (this.isJustificatifRemboursment && this.isVentilation) {
                        //faut pas afficher la case a cocher quand c'est en lecture seule
                        columns["rubriquesTemplateAR"] = [
                            { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
                        ];
                        columns["rubriquesTemplateAR"].push(
                            { "label": lang.rubriquesDC.mntRegle + this.deviseAFD, "key": "montant_final", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                            { "label": "Reste à verser", "key": "montant_reste_a_verser", "type": "number", "amount": true, width: "200px", "separator": true, editable: true, read: true },
                            { "label": lang.rubriquesDC.mntARembourser, key: 'montant_a_rembourser_justificatif', "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, applyBorderRight: true });
                    }
                    else {
                        if (!this.isVentilation) {
                            if (this.readOnly)
                                columns["rubriquesTemplateAR"] = [
                                    { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
                                ];
                            else
                                columns["rubriquesTemplateAR"] = [
                                    { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", uniqueChoice: true, isFixed: true },
                                    { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
                                ];

                            columns["rubriquesTemplateAR"] = [
                                { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", uniqueChoice: true, isFixed: true },
                                { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
                            ];

                            columns["rubriquesTemplateAR"].push({ "label": lang.rubriques.montantInitial + this.deviseAFD, "key": "montant_initial", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                { "label": lang.rubriques.montantFinal + this.deviseAFD, "key": "montant_final", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                { "label": "RAV", "key": "montant_reste_a_verser", "type": "number", "amount": true, width: "200px", "separator": true, editable: true, read: true },
                                { "label": lang.rubriques.pourcentageAR, tooltip: lang.rubriques.pourcentageArLibLong, key: 'pourcentage_avance', "type": "number", "amount": true, width: "150px", "editable": true, "separator": true },
                                { "label": lang.rubriques.montantAR, tooltip: lang.rubriques.montantArLibLong, key: 'montant_avance', "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, read: true },
                                { action: true, type: 'delete' });
                        }
                        else {
                            columns["rubriquesTemplateAR"] = [
                                { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
                            ];

                            columns["rubriquesTemplateAR"].push({ "label": lang.rubriques.montantInitial + this.deviseAFD, "key": "montant_initial", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                { "label": lang.rubriques.montantFinal + this.deviseAFD, "key": "montant_final", "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                { "label": "RAV", "key": "montant_reste_a_verser", "type": "number", "amount": true, width: "200px", "separator": true, editable: true, read: true },
                                { "label": lang.rubriques.pourcentageAR, tooltip: lang.rubriques.pourcentageArLibLong, key: 'pourcentage_avance', "type": "number", "amount": true, width: "150px", "editable": true, "separator": true, read: true },
                                { "label": lang.rubriquesDC.mntRemb, tooltip: lang.rubriques.montantArLibLong, key: 'montant_avance', "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, read: true },
                                { "label": lang.rubriques.montantAR, key: 'montant_a_rembourser', "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, applyBorderRight: true },
                                { "label": lang.rubriques.montantAPayer, key: 'montant_ventile', "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, applyBorderRight: true, applyBorderDanger: true }
                            );
                        }
                    }
                    if (this.rubriquesAR == null)
                        this.rubriquesAR = [];

                    var montantARembourserDc = 0;
                    if (this.isJustifRembIntegral)
                        montantARembourserDc = dc.montant_enregistreAFD;
                    else
                        montantARembourserDc = this.isInsideModal ? (this.justificatifRemboursement != null) ? this.justificatifRemboursement.montant_remboursement : '' : '';

                    this.rubriquesAR.push({
                        "libelle": libelleDC,
                        ["montant_initial"]: ((dc != null && this.dc.avance_remboursable == "1") ? dc.montant_initialAFD : "0"),
                        ["montant_final"]: ((dc != null && this.dc.avance_remboursable == "1") ? dc.montant_finalAFD : "0"),
                        ["montant_avance"]: "-",
                        ["pourcentage_avance"]: "-",
                        ["montant_ventile"]: (!app.isEmpty(this.justificatif) ? (dc.devise_afd == this.deviseDR ? this.justificatif.montant_ventile : "0") : "0"),
                        ["montant_a_rembourser"]: (!app.isEmpty(this.justificatif) ? (dc.devise_afd == this.deviseDR ? this.justificatif.montant_a_rembourser : "0") : "0"),
                        ["montant_a_rembourser_justificatif"]: montantARembourserDc,
                        ["montant_reste_a_verser"]: (dc != null ? dc.montant_reste_a_verserAFD : "0"),
                        ["montant_reste_a_verser_fixe"]: (dc != null ? dc.montant_reste_a_verserAFD : "0"),
                        "type": "DC",
                        'cmpCurrent': 'rubriques',
                        "showDeleteIcon": false,
                        "applyBorderDanger": null,
                        "rubriqueSelected": false,
                        "disabled": true
                    });

                    if (rubs != null && rubs.length > 0) {
                        app.sortBy(rubs, [
                            { key: 'persistenceId', order: 'asc' }
                        ]);

                        for (var rubrique of rubs) {
                            var indexElt = app.getIndexElementInArrayByValue(this.rubriquesAR, 'libelle', rubrique.libelle_rubrique, false);
                            if (indexElt == -1) {
                                var disabledMontantFinal = ((rubrique.sous_rubriques_level1 != null && rubrique.sous_rubriques_level1.length > 0) || this.isVentilation || rubrique.libelle_rubrique == "Avance remboursable") ? true : false;
                                var montantVentile = 0;
                                var montantARemb = 0;
                                var disabledMontantVentile = false;
                                var disabledMontantARemb = false;
                                let disabledMontantARembJustiflvl0 = false;
                                var disabledLibelle = (rubrique.libelle_rubrique == "Avance remboursable") ? true : false;

                                // Rajouter la colonne montant ventile quand c'est une ventilsation
                                if (this.isVentilation) {
                                    if (rubrique.libelle_rubrique != "Avance remboursable") {
                                        disabledMontantVentile = ((rubrique.sous_rubriques_level1 != null && rubrique.sous_rubriques_level1.length > 0) || this.isFirstDdrVentilatedRubs || rubrique.devise_avance != this.deviseDR);
                                        disabledMontantARemb = ((rubrique.sous_rubriques_level1 != null && rubrique.sous_rubriques_level1.length > 0) || this.isFirstDdrVentilatedRubs || rubrique.devise_avance != this.deviseDR);
                                        disabledMontantARembJustiflvl0 = this.getRubriquesVentilatedJutificatif(dc, ddr, rubrique) || this.isJustifRembIntegral;
                                    }
                                    else {
                                        disabledMontantVentile = (!this.isFirstDdrVentilatedRubs || rubrique.devise_avance != this.deviseDR);
                                        disabledMontantARemb = (!this.isFirstDdrVentilatedRubs || rubrique.devise_avance != this.deviseDR);
                                        disabledMontantARembJustiflvl0 = true;
                                    }

                                    disabledLibelle = true;

                                    montantVentile = this.getMontantJustificatifByRubriqueAR(dc, rubrique, this.justificatif, this.deviseDR);
                                    montantARemb = this.getMontantARembJustificatifByRubriqueAR(dc, rubrique, this.justificatif, this.deviseDR);
                                }
                                var rbVentile = await this.checkRubriqueVentile(rubrique.persistenceId);

                                var montantARembourserJustif: any;
                                if (rubrique.libelle_rubrique == "Avance remboursable")
                                    montantARembourserJustif = '-';
                                else
                                    montantARembourserJustif = (this.isJustifRembIntegral) ? await this.getSommeMntsVentileByRubriques(rubrique, ddr) : rubrique.montant_a_rembourser_justificatif;

                                this.rubriquesAR.push({
                                    "libelle": rubrique.libelle_rubrique,
                                    ["montant_initial"]: rubrique.montant_initial_avance,
                                    ["montant_final"]: rubrique.montant_final_avance,
                                    ["montant_avance"]: (rubrique.libelle_rubrique == "Avance remboursable") ? "-" : rubrique.montant_avance,
                                    ["pourcentage_avance"]: (rubrique.libelle_rubrique == "Avance remboursable" || rubrique.sous_rubriques_level1.length > 0) ? "-" : rubrique.pourcentage_avance,
                                    ["montant_ventile"]: montantVentile,
                                    ["montant_a_rembourser"]: (rubrique.libelle_rubrique == "Avance remboursable") ? "-" : montantARemb,
                                    ["montant_a_rembourser_justificatif"]: montantARembourserJustif,
                                    ["montant_reste_a_verser"]: rubrique.montant_reste_a_verser,
                                    ["montant_reste_a_verser_fixe"]: rubrique.montant_reste_a_verser,
                                    ["devise"]: rubrique.devise_avance,
                                    "type": "RUB",
                                    "showDeleteIcon": true,
                                    "level": "0",
                                    "rubriqueSelected": false,
                                    "classCss": this.classCssLevel0,
                                    'cmpCurrent': 'rubriques',
                                    'nameFunction': 'updateMontantsCalcules',
                                    "updateParentsItems": true,
                                    "id": (rubrique.persistenceId != null ? rubrique.persistenceId : '0'),
                                    "libelleParent": libelleDC,
                                    "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                    "clumnsIcons": { "pourcentage_avance": "fa fa-percent" },
                                    "disabled": this.readOnly,
                                    "collumnsDisabled": {
                                        "montant_initial": true,
                                        "montant_final": disabledMontantFinal,
                                        "montant_ventile": disabledMontantVentile,
                                        "pourcentage_avance": (rubrique.libelle_rubrique == "Avance remboursable") || rubrique.sous_rubriques_level1.length > 0,
                                        "montant_a_rembourser": disabledMontantARemb,
                                        "montant_a_rembourser_justificatif": disabledMontantARembJustiflvl0,
                                        "libelle": disabledLibelle
                                    }
                                });
                            }
                            // SOUS RUBRIQUES LEVEL 1
                            if (rubrique.sous_rubriques_level1 != null) {
                                var subRubriquesARLevel1 = rubrique.sous_rubriques_level1;
                                app.sortBy(subRubriquesARLevel1, [
                                    { key: 'persistenceId', order: 'asc' }
                                ]);

                                for (var sousRubrique of rubrique.sous_rubriques_level1) {
                                    var indexElt = app.getIndexElementInArrayByValue(this.rubriquesAR, 'libelle', sousRubrique.libelle, false);

                                    if (indexElt == -1) {
                                        var disabledMontantFinal = ((sousRubrique.sous_rubriques_level2.length > 0) || (this.isVentilation)) ? true : false;
                                        var montantVentile = 0;
                                        var montantARemb = 0;
                                        var disabledMontantVentile = false;
                                        let disabledMontantARembJustiflvl1 = false;

                                        // Rajouter la colonne montant ventile quand c'est une ventilsation
                                        if (this.isVentilation) {
                                            disabledMontantVentile = (sousRubrique.sous_rubriques_level2.length > 0 || sousRubrique.devise_avance != this.deviseDR || this.isFirstDdrVentilatedRubs);
                                            disabledMontantARembJustiflvl1 = this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubrique) || this.isJustifRembIntegral;

                                            montantVentile = this.getMontantJustificatifByRubriqueAR(dc, sousRubrique, this.justificatif, this.deviseDR);
                                            montantARemb = this.getMontantARembJustificatifByRubriqueAR(dc, sousRubrique, this.justificatif, this.deviseDR);
                                        }
                                        var rbVentile = await this.checkRubriqueVentile(sousRubrique.persistenceId);

                                        var montantARembourserJustif: any;
                                        montantARembourserJustif = (this.isJustifRembIntegral) ? await this.getSommeMntsVentileByRubriques(sousRubrique, ddr) : sousRubrique.montant_a_rembourser_justificatif;

                                        this.rubriquesAR.push({
                                            "libelle": sousRubrique.libelle,
                                            ["montant_initial"]: sousRubrique.montant_initial_avance,
                                            ["montant_final"]: sousRubrique.montant_final_avance,
                                            ["montant_avance"]: sousRubrique.montant_avance,
                                            ["pourcentage_avance"]: (sousRubrique.sous_rubriques_level2.length > 0) ? "-" : sousRubrique.pourcentage_avance,
                                            ["montant_ventile"]: montantVentile,
                                            ["montant_a_rembourser"]: montantARemb,
                                            ["montant_a_rembourser_justificatif"]: montantARembourserJustif,
                                            ["montant_reste_a_verser"]: sousRubrique.montant_reste_a_verser,
                                            ["montant_reste_a_verser_fixe"]: sousRubrique.montant_reste_a_verser,
                                            "type": "SUBRUB",
                                            "showDeleteIcon": true,
                                            "level": "1",
                                            "rubriqueSelected": false,
                                            ["devise"]: sousRubrique.devise_avance,
                                            'cmpCurrent': 'rubriques',
                                            "classCss": this.classCssLevel1,
                                            'nameFunction': 'updateMontantsCalcules',
                                            "updateParentsItems": true,
                                            "id": (sousRubrique.persistenceId != null ? sousRubrique.persistenceId : '0'),
                                            "libelleParent": rubrique.libelle_rubrique,
                                            "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                            "clumnsIcons": { "pourcentage_avance": "fa fa-percent" },
                                            "disabled": this.readOnly,
                                            "collumnsDisabled": {
                                                "montant_initial": true,
                                                "montant_final": disabledMontantFinal,
                                                "montant_ventile": disabledMontantVentile,
                                                "montant_a_rembourser": disabledMontantVentile,
                                                "montant_a_rembourser_justificatif": disabledMontantARembJustiflvl1,
                                                "libelle": isVentilation,
                                                "pourcentage_avance": sousRubrique.sous_rubriques_level2.length > 0
                                            }
                                        });
                                    }

                                    //SOUS RUBRIQUE LEVEL 2
                                    if (sousRubrique.sous_rubriques_level2 != null && sousRubrique.sous_rubriques_level2.length > 0) {
                                        var subRubriquesARLevel2 = sousRubrique.sous_rubriques_level2;

                                        app.sortBy(subRubriquesARLevel2, [
                                            { key: 'persistenceId', order: 'asc' }
                                        ]);

                                        for (var sousRubriqueLevel2 of sousRubrique.sous_rubriques_level2) {
                                            var indexElt = app.getIndexElementInArrayByValue(this.rubriquesAR, 'libelle', sousRubriqueLevel2.libelle, false);
                                            if (indexElt == -1) {
                                                var disabledMontantFinal = ((sousRubrique.sous_rubriques_level2.length > 0) || (this.isVentilation)) ? true : false;
                                                var montantVentile = 0;
                                                var montantARemb = 0;
                                                var disabledMontantVentile = false;
                                                let disabledMontantARembJustiflvl2 = false;

                                                // Rajouter la colonne montant ventile quand c'est une ventilsation
                                                if (this.isVentilation) {
                                                    disabledMontantVentile = (sousRubriqueLevel2.sous_rubriques_level3.length > 0 || sousRubriqueLevel2.devise_avance != this.deviseDR || this.isFirstDdrVentilatedRubs);
                                                    disabledMontantARembJustiflvl2 = this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubriqueLevel2) || this.isJustifRembIntegral;
                                                    montantVentile = this.getMontantJustificatifByRubriqueAR(dc, sousRubriqueLevel2, this.justificatif, this.deviseDR);
                                                    montantARemb = this.getMontantARembJustificatifByRubriqueAR(dc, sousRubriqueLevel2, this.justificatif, this.deviseDR);
                                                }

                                                var rbVentile = await this.checkRubriqueVentile(sousRubriqueLevel2.persistenceId);
                                                var montantARembourserJustif: any;

                                                montantARembourserJustif = (this.isJustifRembIntegral) ? await this.getSommeMntsVentileByRubriques(sousRubriqueLevel2, ddr) : sousRubriqueLevel2.montant_a_rembourser_justificatif;

                                                this.rubriquesAR.push({
                                                    "libelle": sousRubriqueLevel2.libelle,
                                                    ["montant_initial"]: sousRubriqueLevel2.montant_initial_avance,
                                                    ["montant_final"]: sousRubriqueLevel2.montant_final_avance,
                                                    ["montant_avance"]: sousRubriqueLevel2.montant_avance,
                                                    ["pourcentage_avance"]: (sousRubriqueLevel2.sous_rubriques_level3.length > 0) ? "-" : sousRubriqueLevel2.pourcentage_avance,
                                                    ["montant_ventile"]: montantVentile,
                                                    ["montant_a_rembourser"]: montantARemb,
                                                    ["montant_a_rembourser_justificatif"]: montantARembourserJustif,
                                                    ["montant_reste_a_verser"]: sousRubriqueLevel2.montant_reste_a_verser,
                                                    ["montant_reste_a_verser_fixe"]: sousRubriqueLevel2.montant_reste_a_verser,
                                                    "type": "SUBRUB",
                                                    "showDeleteIcon": true,
                                                    "level": "2",
                                                    "rubriqueSelected": false,
                                                    "classCss": this.classCssLevel2,
                                                    ["devise"]: sousRubriqueLevel2.devise_avance,
                                                    'cmpCurrent': 'rubriques',
                                                    'nameFunction': 'updateMontantsCalcules',
                                                    "updateParentsItems": true,
                                                    "clumnsIcons": { "pourcentage_avance": "fa fa-percent" },
                                                    "id": (sousRubriqueLevel2.persistenceId != null ? sousRubriqueLevel2.persistenceId : '0'),
                                                    "libelleParent": sousRubrique.libelle,
                                                    "disabled": this.readOnly,
                                                    "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                                    "collumnsDisabled": {
                                                        "montant_initial": true,
                                                        "montant_final": disabledMontantFinal,
                                                        "montant_ventile": disabledMontantVentile,
                                                        "montant_a_rembourser": disabledMontantVentile,
                                                        "montant_a_rembourser_justificatif": disabledMontantARembJustiflvl2,
                                                        "libelle": isVentilation,
                                                        "pourcentage_avance": sousRubriqueLevel2.sous_rubriques_level3.length > 0
                                                    }
                                                });
                                            }

                                            //SOUS RUBRIQUE LEVEL 3
                                            if (sousRubriqueLevel2.sous_rubriques_level3 != null && sousRubriqueLevel2.sous_rubriques_level3.length > 0) {
                                                var subRubriquesARLevel3 = sousRubriqueLevel2.sous_rubriques_level3;

                                                app.sortBy(subRubriquesARLevel3, [
                                                    { key: 'persistenceId', order: 'asc' }
                                                ]);
                                                for (var sousRubriqueLevel3 of sousRubriqueLevel2.sous_rubriques_level3) {
                                                    var indexElt = app.getIndexElementInArrayByValue(this.rubriques, 'libelle', sousRubriqueLevel3.libelle, false);
                                                    if (indexElt == -1) {
                                                        var montantVentile = 0;
                                                        var montantARemb = 0;

                                                        // Rajouter la colonne montant ventile quand c'est une ventilsation
                                                        if (this.isVentilation) {
                                                            montantVentile = this.getMontantJustificatifByRubriqueAR(dc, sousRubriqueLevel3, this.justificatif, this.deviseDR);
                                                            montantARemb = this.getMontantARembJustificatifByRubriqueAR(dc, sousRubriqueLevel3, this.justificatif, this.deviseDR);
                                                        }
                                                        var rbVentile = await this.checkRubriqueVentile(sousRubriqueLevel3.persistenceId);
                                                        var montantARembourserJustif: any;

                                                        montantARembourserJustif = (this.isJustifRembIntegral) ? await this.getSommeMntsVentileByRubriques(sousRubriqueLevel3, ddr) : sousRubriqueLevel3.montant_a_rembourser_justificatif;

                                                        this.rubriquesAR.push({
                                                            "libelle": sousRubriqueLevel3.libelle,
                                                            ["montant_initial"]: sousRubriqueLevel3.montant_initial_avance,
                                                            ["montant_final"]: sousRubriqueLevel3.montant_final_avance,
                                                            ["montant_avance"]: sousRubriqueLevel3.montant_avance,
                                                            ["pourcentage_avance"]: sousRubriqueLevel3.pourcentage_avance,
                                                            ["montant_ventile"]: montantVentile,
                                                            ["montant_a_rembourser"]: montantARemb,
                                                            ["montant_a_rembourser_justificatif"]: montantARembourserJustif,
                                                            ["montant_reste_a_verser"]: sousRubriqueLevel3.montant_reste_a_verser,
                                                            ["montant_reste_a_verser_fixe"]: sousRubriqueLevel3.montant_reste_a_verser,
                                                            "type": "SUBRUB",
                                                            "level": "3",
                                                            "showDeleteIcon": true,
                                                            "rubriqueSelected": false,
                                                            "clumnsIcons": { "pourcentage_avance": "fa fa-percent" },
                                                            "classCss": this.classCssLevel3,
                                                            'cmpCurrent': 'rubriques',
                                                            'nameFunction': 'updateMontantsCalcules',
                                                            "updateParentsItems": true,
                                                            ["devise"]: sousRubriqueLevel3.devise_avance,
                                                            "id": (sousRubriqueLevel3.persistenceId != null ? sousRubriqueLevel3.persistenceId : '0'),
                                                            "libelleParent": sousRubrique.libelle_rubrique,
                                                            "disabled": this.readOnly,
                                                            "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                                            "collumnsDisabled": {
                                                                "montant_initial": true,
                                                                "montant_final": isVentilation,
                                                                "montant_ventile": sousRubriqueLevel3.devise_avance != this.deviseDR,
                                                                "montant_a_rembourser": sousRubriqueLevel3.devise_avance != this.deviseDR,
                                                                "montant_a_rembourser_justificatif": this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubriqueLevel3) || this.isJustifRembIntegral,
                                                                "libelle": isVentilation
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (this.firstLoad || this.rubriques == null) {
                        //reinitialiser la liste des columns
                        if (!this.isVentilation && !this.readOnly) {
                            columns["rubriquesTemplate"] = [
                                { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", fixed: true, uniqueChoice: true, isFixed: true },
                                { label: lang.rubriques.label, key: 'libelle', width: "200px", editable: true, changeCss: true, fixed: true, applyBorderDanger: true, isFixed: true }];
                        } else {
                            columns["rubriquesTemplate"] = [
                                { label: lang.rubriques.label, key: 'libelle', width: "200px", fixed: true, editable: true, changeCss: true, isFixed: true, applyBorderDanger: true }];
                        }
                        for (var autreDevise of this.devisesDC) {
                            if (this.isJustificatifRemboursment && this.isVentilation) {
                                columns["rubriquesTemplate"].push(
                                    { "label": lang.rubriquesDC.mntRegle + autreDevise.devise, "key": "montant_final_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                    { "label": lang.rubriques.rav + autreDevise.devise, "key": "montant_reste_a_verser_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, read: true, applyBorderRight: (this.isVentilation ? false : true) },
                                    { "label": lang.rubriquesDC.mntARembourser + autreDevise.devise, key: "montant_a_rembourser_justificatif_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, applyBorderRight: true });
                            }
                            else {
                                columns["rubriquesTemplate"].push({ "label": lang.rubriques.montantInitial + autreDevise.devise, "key": "montant_initial_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                    { "label": lang.rubriques.montantFinal + autreDevise.devise, "key": "montant_final_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true },
                                    { "label": lang.rubriques.montantEnregistre + autreDevise.devise, "key": "montant_enregistre_" + autreDevise.devise, "type": "number", "amount": true, width: "250px", "editable": true, "separator": true, read: true },
                                    { "label": lang.rubriques.rav + autreDevise.devise, "key": "montant_reste_a_verser_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, read: true, applyBorderRight: (this.isVentilation ? false : true) });
                                if (this.isVentilation) {
                                    columns["rubriquesTemplate"].push({ "label": lang.rubriques.montantVentile + autreDevise.devise, "key": "montant_ventile_" + autreDevise.devise, "type": "number", "amount": true, width: "200px", "editable": true, "separator": true, applyBorderRight: true, applyBorderDanger: true });
                                }
                            }
                        }
                        if (!this.isVentilation && !this.readOnly)
                            columns["rubriquesTemplate"].push({ action: true, type: 'delete' });

                        if (this.rubriques == null)
                            this.rubriques = [];


                        var montantARembourserDc = 0;
                        if (this.isJustifRembIntegral)
                            montantARembourserDc = dc.montant_enregistreAFD;
                        else
                            montantARembourserDc = this.isInsideModal ? (this.justificatifRemboursement != null) ? this.justificatifRemboursement.montant_remboursement : '' : '';

                        var indexDC = ((this.rubriques != null && this.rubriques.length > 0) ? app.getIndexElementInArrayByValue(this.rubriques, "type", "DC", false) : -1);
                        if (indexDC == -1)
                            this.rubriques.push({
                                "libelle": libelleDC,
                                ["montant_initial_" + this.deviseAFD]: (dc != null ? dc.montant_initialAFD : "0"),
                                ["montant_final_" + this.deviseAFD]: (dc != null ? dc.montant_finalAFD : "0"),
                                ["montant_enregistre_" + this.deviseAFD]: (dc != null ? dc.montant_enregistreAFD : "0"),
                                ["montant_reste_a_verser_" + this.deviseAFD]: (dc != null ? dc.montant_reste_a_verserAFD : "0"),
                                ["montant_ventile_" + (!app.isEmpty(this.deviseAFD) ? this.deviseAFD : dc.devise_afd)]: (!app.isEmpty(this.justificatif) ? (dc.devise_afd == this.deviseDR ? this.justificatif.montant_ventile : "0") : "0"),
                                ["montant_a_rembourser_justificatif_" + (!app.isEmpty(this.deviseAFD) ? this.deviseAFD : dc.devise_afd)]: (this.isJustificatifRemboursment) ? montantARembourserDc : "",
                                "type": "DC",
                                "showRightIcon": false,
                                "disabled": true,
                                'cmpCurrent': 'rubriques',
                                "applyBorderDanger": null,
                                "rubriqueSelected": false
                            });

                        for (var autreDevise of this.devisesDC) {
                            var indexElt = app.getIndexElementInArrayByValue(this.rubriques, "type", "DC", false);
                            //reconstruire la liste des rubriques
                            if (!autreDevise.isDeviseAFD) {
                                this.rubriques[indexElt]["libelle"] = libelleDC;
                                this.rubriques[indexElt]["montant_initial_" + autreDevise.devise] = (dc != null ? autreDevise.montant_initial : "0");
                                this.rubriques[indexElt]["montant_final_" + autreDevise.devise] = (dc != null ? autreDevise.montant_final : "0");
                                this.rubriques[indexElt]["montant_enregistre_" + autreDevise.devise] = (dc != null ? autreDevise.montant_enregistre : "0");
                                this.rubriques[indexElt]["montant_reste_a_verser_" + autreDevise.devise] = (dc != null ? autreDevise.montant_reste_a_verser : "0");
                                this.rubriques[indexElt]["montant_ventile_initial" + autreDevise.devise] = "0";
                                this.rubriques[indexElt]["montant_ventile_" + autreDevise.devise] = (!app.isEmpty(this.justificatif) ? (autreDevise.devise == this.deviseDR ? this.justificatif.montant_ventile : "0") : "0");
                                this.rubriques[indexElt]["montant_a_rembourser_justificatif_" + autreDevise.devise] = "0";
                            }
                        }

                        for (var autreDevise of this.devisesDC) {
                            if (rubs != null && rubs.length > 0) {
                                app.sortBy(rubs, [
                                    { key: 'persistenceId', order: 'asc' }
                                ]);

                                for (var rubrique of rubs) {
                                    var devisesMontants = this.getListeDevisesMontantsRubriques(rubrique, libelleDC);
                                    if (devisesMontants != null && devisesMontants.length > 0) {
                                        for (var deviseMontantRub of devisesMontants) {
                                            var haveChild = (rubrique.sous_rubriques_level1 != null && rubrique.sous_rubriques_level1.length > 0);
                                            var montantVentile = 0;
                                            var montantARembJustificatif = 0;

                                            if (deviseMontantRub.devise == autreDevise.devise) {
                                                var rbVentile = await this.checkRubriqueVentile(rubrique.persistenceId);
                                                var indexElt = app.getIndexElementInArrayByValue(this.rubriques, 'libelle', rubrique.libelle_rubrique, false);
                                                // Rajouter la colonne montant ventile quand c'est une ventilsation
                                                if (this.isVentilation) {
                                                    montantVentile = this.getMontantJustificatifByRubrique(rubrique.persistenceId, this.justificatif, deviseMontantRub.devise);
                                                    montantARembJustificatif = this.getMontantJustificatifRembByRubrique(rubrique.persistenceId, this.justificatifRemboursement, deviseMontantRub.devise);
                                                }
                                                if (indexElt == -1) {
                                                    var columnDisabled = { ["montant_initial_" + deviseMontantRub.devise]: true };

                                                    if (this.isVentilation)
                                                        columnDisabled = {
                                                            ["montant_initial_" + deviseMontantRub.devise]: true,
                                                            ["montant_final_" + deviseMontantRub.devise]: true,
                                                            libelle: true,
                                                            ["montant_ventile_" + deviseMontantRub.devise]: (haveChild || deviseMontantRub.devise != this.deviseDR),
                                                            ["montant_a_rembourser_justificatif_" + deviseMontantRub.devise]: this.getRubriquesVentilatedJutificatif(dc, ddr, rubrique) || this.isJustifRembIntegral || deviseMontantRub.devise != this.deviseDR
                                                        };
                                                    else if (haveChild)
                                                        columnDisabled = { ["montant_initial_" + deviseMontantRub.devise]: true, ["montant_final_" + deviseMontantRub.devise]: true };


                                                    this.rubriques.push({
                                                        "libelle": rubrique.libelle_rubrique,
                                                        ["montant_initial_" + deviseMontantRub.devise]: deviseMontantRub.montant_initial,
                                                        ["montant_final_" + deviseMontantRub.devise]: deviseMontantRub.montant_final,
                                                        ["montant_enregistre_" + deviseMontantRub.devise]: deviseMontantRub.montant_enregistre,
                                                        ["montant_reste_a_verser_" + deviseMontantRub.devise]: deviseMontantRub.montant_reste_a_verser,
                                                        ["montant_ventile_" + deviseMontantRub.devise]: montantVentile,
                                                        ["montant_a_rembourser_justificatif_" + deviseMontantRub.devise]: (this.isJustifRembIntegral) ? deviseMontantRub.montant_enregistre : montantARembJustificatif,
                                                        ["montant_ventile_initial_" + deviseMontantRub.devise]: montantVentile,
                                                        ["montant_enregistre_initial_" + deviseMontantRub.devise]: deviseMontantRub.montant_enregistre,

                                                        "type": "RUB",
                                                        "showDeleteIcon": !rbVentile,
                                                        "level": "0",
                                                        "classCss": this.classCssLevel0,
                                                        "rubriqueSelected": false,
                                                        'cmpCurrent': 'rubriques',
                                                        'nameFunction': 'updateMontantsCalcules',
                                                        "updateParentsItems": true,
                                                        "disabled": this.readOnly,
                                                        "disabledCheckBox": this.readOnly,
                                                        "persistenceId": (rubrique.persistenceId != null ? rubrique.persistenceId : '0'),
                                                        "id": (rubrique.persistenceId != null ? rubrique.persistenceId : '0'),
                                                        "libelleParent": libelleDC,
                                                        "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                                        "devisesCodes": deviseMontantRub.devisesCodes,
                                                        "collumnsDisabled": columnDisabled
                                                    });
                                                }
                                                else {
                                                    this.rubriques[indexElt]["montant_initial_" + deviseMontantRub.devise] = deviseMontantRub.montant_initial;
                                                    this.rubriques[indexElt]["montant_final_" + deviseMontantRub.devise] = deviseMontantRub.montant_final;
                                                    this.rubriques[indexElt]["montant_enregistre_" + deviseMontantRub.devise] = deviseMontantRub.montant_enregistre;
                                                    this.rubriques[indexElt]["montant_enregistre_initial_" + deviseMontantRub.devise] = deviseMontantRub.montant_enregistre;

                                                    this.rubriques[indexElt]["montant_reste_a_verser_" + deviseMontantRub.devise] = deviseMontantRub.montant_reste_a_verser;
                                                    this.rubriques[indexElt]["devisesCodes"] = this.rubriques[indexElt]["devisesCodes"].concat(deviseMontantRub.devisesCodes);
                                                    this.rubriques[indexElt]["montant_ventile_" + deviseMontantRub.devise] = montantVentile;
                                                    this.rubriques[indexElt]["montant_a_rembourser_justificatif_" + deviseMontantRub.devise] = (this.isJustifRembIntegral) ? deviseMontantRub.montant_enregistre : montantARembJustificatif;

                                                    this.rubriques[indexElt]["montant_ventile_initial_" + deviseMontantRub.devise] = montantVentile;
                                                    var columnsDisabledByDevise = this.rubriques[indexElt]["collumnsDisabled"];
                                                    columnsDisabledByDevise["montant_final_" + deviseMontantRub.devise] = (haveChild || this.isVentilation);
                                                    columnsDisabledByDevise["montant_initial_" + deviseMontantRub.devise] = true;
                                                    columnsDisabledByDevise["libelle"] = this.isVentilation;
                                                    columnsDisabledByDevise["montant_ventile_" + deviseMontantRub.devise] = haveChild || deviseMontantRub.devise != this.deviseDR;
                                                    columnsDisabledByDevise["montant_a_rembourser_justificatif_" + deviseMontantRub.devise] = this.getRubriquesVentilatedJutificatif(dc, ddr, rubrique) || this.isJustifRembIntegral || deviseMontantRub.devise != this.deviseDR;
                                                    this.rubriques[indexElt]["collumnsDisabled"] = columnsDisabledByDevise;
                                                }
                                            }
                                        }

                                        // SOUS RUBRIQUES LEVEL 1
                                        if (rubrique.sous_rubriques_level1 != null) {
                                            var subRubriquesLevel1 = rubrique.sous_rubriques_level1;
                                            app.sortBy(subRubriquesLevel1, [
                                                { key: 'persistenceId', order: 'asc' }
                                            ]);

                                            for (var sousRubrique of subRubriquesLevel1) {
                                                var devisesMontantsSousRub = this.getListeDevisesMontantsRubriques(sousRubrique, rubrique.liblle_rubrique);
                                                for (var deviseMontantSousRub of devisesMontantsSousRub) {
                                                    var haveChild = (sousRubrique.sous_rubriques_level2.length > 0);

                                                    if (deviseMontantSousRub.devise == autreDevise.devise) {
                                                        var montantVentile = 0;
                                                        var montantARembJustificatif = 0;

                                                        var rbVentile = await this.checkRubriqueVentile(sousRubrique.persistenceId);
                                                        if (this.isVentilation) {
                                                            montantVentile = this.getMontantJustificatifByRubrique(sousRubrique.persistenceId, this.justificatif, deviseMontantSousRub.devise);
                                                            montantARembJustificatif = this.getMontantJustificatifRembByRubrique(sousRubrique.persistenceId, this.justificatifRemboursement, deviseMontantSousRub.devise);
                                                        }
                                                        var indexElt = app.getIndexElementInArrayByValue(this.rubriques, 'libelle', sousRubrique.libelle, false);
                                                        if (indexElt == -1) {

                                                            var columnDisabled = { ["montant_initial_" + deviseMontantSousRub.devise]: true };
                                                            if (this.isVentilation)
                                                                columnDisabled = {
                                                                    ["montant_initial_" + deviseMontantSousRub.devise]: true,
                                                                    ["montant_final_" + deviseMontantSousRub.devise]: true,
                                                                    libelle: true,
                                                                    ["montant_ventile_" + deviseMontantSousRub.devise]: (haveChild || deviseMontantSousRub.devise != this.deviseDR),
                                                                    ["montant_a_rembourser_justificatif_" + deviseMontantSousRub.devise]: this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubrique) || this.isJustifRembIntegral || deviseMontantSousRub.devise != this.deviseDR
                                                                };
                                                            else if (haveChild)
                                                                columnDisabled = { ["montant_initial_" + deviseMontantSousRub.devise]: true, ["montant_final_" + deviseMontantSousRub.devise]: true };

                                                            var montantARembourserJustif: any;
                                                            montantARembourserJustif = (this.isJustifRembIntegral) ? await this.getSommeMntsVentileByRubriques(sousRubrique, ddr) : deviseMontantSousRub.montant_a_rembourser_justificatif;

                                                            this.rubriques.push({
                                                                "libelle": sousRubrique.libelle,
                                                                ["montant_initial_" + deviseMontantSousRub.devise]: deviseMontantSousRub.montant_initial,
                                                                ["montant_final_" + deviseMontantSousRub.devise]: deviseMontantSousRub.montant_final,
                                                                ["montant_enregistre_" + deviseMontantSousRub.devise]: deviseMontantSousRub.montant_enregistre,
                                                                ["montant_enregistre_initial_" + deviseMontantSousRub.devise]: deviseMontantSousRub.montant_enregistre,

                                                                ["montant_reste_a_verser_" + deviseMontantSousRub.devise]: deviseMontantSousRub.montant_reste_a_verser,
                                                                ["montant_reste_a_verser_initial_" + deviseMontantSousRub.devise]: deviseMontantSousRub.montant_reste_a_verser,

                                                                ["montant_ventile_" + deviseMontantSousRub.devise]: montantVentile,
                                                                ["montant_a_rembourser_justificatif_" + deviseMontantSousRub.devise]: (this.isJustifRembIntegral) ? deviseMontantSousRub.montant_enregistre : montantARembJustificatif,
                                                                ["montant_ventile_initial_" + deviseMontantSousRub.devise]: montantVentile,
                                                                "type": "SUBRUB",
                                                                "level": "1",
                                                                "classCss": this.classCssLevel1,
                                                                "persistenceId": (sousRubrique.persistenceId != null ? sousRubrique.persistenceId : '0'),
                                                                "id": (sousRubrique.persistenceId != null ? sousRubrique.persistenceId : '0'),
                                                                "libelleParent": rubrique.libelle_rubrique,
                                                                "rubriqueSelected": false,
                                                                'cmpCurrent': 'rubriques',
                                                                "disabled": this.readOnly,
                                                                "disabledCheckBox": this.readOnly,
                                                                'nameFunction': 'updateMontantsCalcules',
                                                                "updateParentsItems": true,
                                                                "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                                                "devisesCodes": deviseMontantSousRub.devisesCodes,
                                                                "collumnsDisabled": columnDisabled
                                                            });
                                                        }
                                                        else {
                                                            this.rubriques[indexElt]["montant_initial_" + deviseMontantSousRub.devise] = deviseMontantSousRub.montant_initial;
                                                            this.rubriques[indexElt]["montant_final_" + deviseMontantSousRub.devise] = deviseMontantSousRub.montant_final;
                                                            this.rubriques[indexElt]["montant_enregistre_" + deviseMontantSousRub.devise] = deviseMontantSousRub.montant_enregistre;
                                                            this.rubriques[indexElt]["montant_enregistre_initial_" + deviseMontantSousRub.devise] = deviseMontantSousRub.montant_enregistre;

                                                            this.rubriques[indexElt]["montant_reste_a_verser_" + deviseMontantSousRub.devise] = deviseMontantSousRub.montant_reste_a_verser;
                                                            this.rubriques[indexElt]["montant_reste_a_verser_initial_" + deviseMontantSousRub.devise] = deviseMontantSousRub.montant_reste_a_verser;
                                                            this.rubriques[indexElt]["devisesCodes"] = this.rubriques[indexElt]["devisesCodes"].concat(deviseMontantSousRub.devisesCodes);
                                                            this.rubriques[indexElt]["montant_ventile_" + deviseMontantSousRub.devise] = montantVentile;
                                                            this.rubriques[indexElt]["montant_a_rembourser_justificatif_" + deviseMontantSousRub.devise] = (this.isJustifRembIntegral) ? deviseMontantSousRub.montant_enregistre : montantARembJustificatif;

                                                            this.rubriques[indexElt]["montant_ventile_initial_" + deviseMontantSousRub.devise] = montantVentile;
                                                            var columnsDisabledByDevise = this.rubriques[indexElt]["collumnsDisabled"];
                                                            columnsDisabledByDevise["montant_final_" + deviseMontantSousRub.devise] = (this.isVentilation || haveChild);
                                                            columnsDisabledByDevise["montant_initial_" + deviseMontantSousRub.devise] = true;
                                                            columnsDisabledByDevise["libelle"] = this.isVentilation;
                                                            columnsDisabledByDevise["montant_ventile_" + deviseMontantSousRub.devise] = haveChild || deviseMontantSousRub.devise != this.deviseDR;
                                                            columnsDisabledByDevise["montant_a_rembourser_justificatif_" + deviseMontantSousRub.devise] = this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubrique) || this.isJustifRembIntegral || deviseMontantSousRub.devise != this.deviseDR;
                                                            this.rubriques[indexElt]["collumnsDisabled"] = columnsDisabledByDevise;
                                                        }
                                                    }

                                                    //SOUS RUBRIQUE LEVEL 2
                                                    if (sousRubrique.sous_rubriques_level2 != null && sousRubrique.sous_rubriques_level2.length > 0) {
                                                        var subRubriquesLevel2 = sousRubrique.sous_rubriques_level2;

                                                        app.sortBy(subRubriquesLevel2, [
                                                            { key: 'persistenceId', order: 'asc' }
                                                        ]);

                                                        for (var sousRubriqueLevel2 of subRubriquesLevel2) {
                                                            var devisesMontantsSousRubLvel2 = this.getListeDevisesMontantsRubriques(sousRubriqueLevel2, sousRubrique.liblle);
                                                            var haveChild = (sousRubriqueLevel2.sous_rubriques_level3.length > 0);

                                                            for (var deviseMontantSousRub2 of devisesMontantsSousRubLvel2) {
                                                                if (deviseMontantSousRub2.devise == autreDevise.devise) {
                                                                    var rbVentile = await this.checkRubriqueVentile(sousRubriqueLevel2.persistenceId);
                                                                    var indexElt = app.getIndexElementInArrayByValue(this.rubriques, 'libelle', sousRubriqueLevel2.libelle, false);
                                                                    var montantVentile = 0;
                                                                    var montantARembJustificatif = 0;

                                                                    if (this.isVentilation) {
                                                                        montantVentile = this.getMontantJustificatifByRubrique(sousRubriqueLevel2.persistenceId, this.justificatif, deviseMontantSousRub2.devise);
                                                                        montantARembJustificatif = this.getMontantJustificatifRembByRubrique(sousRubriqueLevel2.persistenceId, this.justificatifRemboursement, deviseMontantSousRub2.devise);
                                                                    }
                                                                    if (indexElt == -1) {
                                                                        var columnDisabled = { ["montant_initial_" + deviseMontantSousRub2.devise]: true };

                                                                        if (haveChild)
                                                                            columnDisabled = { ["montant_initial_" + deviseMontantSousRub2.devise]: true };
                                                                        if (this.isVentilation)
                                                                            columnDisabled = {
                                                                                ["montant_initial_" + deviseMontantSousRub2.devise]: true,
                                                                                ["montant_final_" + deviseMontantSousRub2.devise]: true,
                                                                                libelle: true,
                                                                                ["montant_ventile_" + deviseMontantSousRub2.devise]: (haveChild || deviseMontantSousRub2.devise != this.deviseDR),
                                                                                ["montant_a_rembourser_justificatif_" + deviseMontantSousRub2.devise]: this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubriqueLevel2) || this.isJustifRembIntegral || deviseMontantSousRub2.devise != this.deviseDR
                                                                            };

                                                                        this.rubriques.push({
                                                                            "libelle": sousRubriqueLevel2.libelle,
                                                                            ["montant_initial_" + deviseMontantSousRub2.devise]: deviseMontantSousRub2.montant_initial,
                                                                            ["montant_final_" + deviseMontantSousRub2.devise]: deviseMontantSousRub2.montant_final,
                                                                            ["montant_enregistre_" + deviseMontantSousRub2.devise]: deviseMontantSousRub2.montant_enregistre,
                                                                            ["montant_enregistre_initial_" + deviseMontantSousRub2.devise]: deviseMontantSousRub2.montant_enregistre,

                                                                            ["montant_reste_a_verser_" + deviseMontantSousRub2.devise]: deviseMontantSousRub2.montant_reste_a_verser,
                                                                            ["montant_reste_a_verser_initial_" + deviseMontantSousRub2.devise]: deviseMontantSousRub2.montant_reste_a_verser,
                                                                            ["montant_ventile_" + deviseMontantSousRub2.devise]: montantVentile,
                                                                            ["montant_a_rembourser_justificatif_" + deviseMontantSousRub2.devise]: (this.isJustifRembIntegral) ? deviseMontantSousRub2.montant_enregistre : montantARembJustificatif,
                                                                            ["montant_ventile_initial_" + deviseMontantSousRub2.devise]: montantVentile,
                                                                            "type": "SUBRUB",
                                                                            "disabled": this.readOnly,
                                                                            "level": "2",
                                                                            "classCss": this.classCssLevel2,
                                                                            'cmpCurrent': 'rubriques',
                                                                            'nameFunction': 'updateMontantsCalcules',
                                                                            "updateParentsItems": true,
                                                                            "persistenceId": (sousRubriqueLevel2.persistenceId != null ? sousRubriqueLevel2.persistenceId : '0'),
                                                                            "libelleParent": sousRubrique.libelle,
                                                                            "id": (sousRubriqueLevel2.persistenceId != null ? sousRubriqueLevel2.persistenceId : '0'),
                                                                            "rubriqueSelected": false,
                                                                            "devisesCodes": deviseMontantSousRub2.devisesCodes,
                                                                            "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                                                            "collumnsDisabled": columnDisabled
                                                                        });
                                                                    }
                                                                    else {
                                                                        this.rubriques[indexElt]["montant_initial_" + deviseMontantSousRub2.devise] = deviseMontantSousRub2.montant_initial;
                                                                        this.rubriques[indexElt]["montant_final_" + deviseMontantSousRub2.devise] = deviseMontantSousRub2.montant_final;
                                                                        this.rubriques[indexElt]["montant_enregistre_" + deviseMontantSousRub2.devise] = deviseMontantSousRub2.montant_enregistre;
                                                                        this.rubriques[indexElt]["montant_enregistre_initial_" + deviseMontantSousRub2.devise] = deviseMontantSousRub2.montant_enregistre;

                                                                        this.rubriques[indexElt]["montant_reste_a_verser_" + deviseMontantSousRub2.devise] = deviseMontantSousRub2.montant_reste_a_verser;
                                                                        this.rubriques[indexElt]["montant_reste_a_verser_initial" + deviseMontantSousRub2.devise] = deviseMontantSousRub2.montant_reste_a_verser;
                                                                        this.rubriques[indexElt]["devisesCodes"] = this.rubriques[indexElt]["devisesCodes"].concat(deviseMontantSousRub2.devisesCodes);
                                                                        this.rubriques[indexElt]["montant_ventile_" + deviseMontantSousRub2.devise] = montantVentile;
                                                                        this.rubriques[indexElt]["montant_a_rembourser_justificatif_" + deviseMontantSousRub2.devise] = (this.isJustifRembIntegral) ? deviseMontantSousRub2.montant_enregistre : montantARembJustificatif;

                                                                        this.rubriques[indexElt]["montant_ventile_initial_" + deviseMontantSousRub2.devise] = montantVentile;

                                                                        var columnsDisabledByDevise = this.rubriques[indexElt]["collumnsDisabled"];
                                                                        columnsDisabledByDevise["montant_final_" + deviseMontantSousRub2.devise] = (haveChild || this.isVentilation);
                                                                        columnsDisabledByDevise["montant_initial_" + deviseMontantSousRub2.devise] = true;
                                                                        columnsDisabledByDevise["libelle"] = this.isVentilation;
                                                                        columnsDisabledByDevise["montant_ventile_" + deviseMontantSousRub2.devise] = haveChild || deviseMontantSousRub2.devise != this.deviseDR;
                                                                        columnsDisabledByDevise["montant_a_rembourser_justificatif_" + deviseMontantSousRub2.devise] = this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubriqueLevel2) || this.isJustifRembIntegral || deviseMontantSousRub2.devise != this.deviseDR;
                                                                        this.rubriques[indexElt]["collumnsDisabled"] = columnsDisabledByDevise;
                                                                    }
                                                                }

                                                                //SOUS RUBRIQUE LEVEL 3
                                                                if (sousRubriqueLevel2.sous_rubriques_level3 != null && sousRubriqueLevel2.sous_rubriques_level3.length > 0) {
                                                                    var subRubriquesLevel3 = sousRubriqueLevel2.sous_rubriques_level3;

                                                                    app.sortBy(subRubriquesLevel3, [
                                                                        { key: 'persistenceId', order: 'asc' }
                                                                    ]);

                                                                    for (var sousRubriqueLevel3 of subRubriquesLevel3) {

                                                                        var devisesMontantsSousRubLvel3 = this.getListeDevisesMontantsRubriques(sousRubriqueLevel3, sousRubriqueLevel2.liblle);
                                                                        for (var deviseMontantSousRub3 of devisesMontantsSousRubLvel3) {
                                                                            if (deviseMontantSousRub3.devise == autreDevise.devise) {
                                                                                var rbVentile = await this.checkRubriqueVentile(sousRubriqueLevel3.persistenceId);
                                                                                var indexElt = app.getIndexElementInArrayByValue(this.rubriques, 'libelle', sousRubriqueLevel3.libelle, false);
                                                                                var montantVentile = 0;
                                                                                var montantARembJustificatif = 0;

                                                                                if (this.isVentilation) {
                                                                                    montantVentile = this.getMontantJustificatifByRubrique(sousRubriqueLevel3.persistenceId, this.justificatif, deviseMontantSousRub3.devise);
                                                                                    montantARembJustificatif = this.getMontantJustificatifRembByRubrique(sousRubriqueLevel3.persistenceId, this.justificatifRemboursement, deviseMontantSousRub3.devise);
                                                                                }
                                                                                if (indexElt == -1)
                                                                                    this.rubriques.push({
                                                                                        "libelle": sousRubriqueLevel3.libelle,
                                                                                        ["montant_initial_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.montant_initial,
                                                                                        ["montant_final_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.montant_final,
                                                                                        ["montant_enregistre_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.montant_enregistre,
                                                                                        ["montant_enregistre_initial_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.montant_enregistre,

                                                                                        ["montant_reste_a_verser_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.montant_reste_a_verser,
                                                                                        ["montant_reste_a_verser_initial_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.montant_reste_a_verser,
                                                                                        ["montant_ventile_" + deviseMontantSousRub3.devise]: montantVentile,
                                                                                        ["montant_a_rembourser_justificatif_" + deviseMontantSousRub3.devise]: (this.isJustifRembIntegral) ? deviseMontantSousRub3.montant_enregistre : montantARembJustificatif,
                                                                                        ["montant_ventile_initial_" + deviseMontantSousRub3.devise]: montantVentile,
                                                                                        "type": "SUBRUB",
                                                                                        "classCss": this.classCssLevel3,
                                                                                        "level": "3",
                                                                                        'cmpCurrent': 'rubriques',
                                                                                        'nameFunction': 'updateMontantsCalcules',
                                                                                        "updateParentsItems": true,
                                                                                        "disabledCheckBox": true,
                                                                                        "disabled": this.readOnly,
                                                                                        "persistenceId": (sousRubriqueLevel3.persistenceId != null ? sousRubriqueLevel3.persistenceId : '0'),
                                                                                        "libelleParent": sousRubriqueLevel2.libelle,
                                                                                        "id": (sousRubriqueLevel3.persistenceId != null ? sousRubriqueLevel3.persistenceId : '0'),
                                                                                        "rubriqueSelected": false,
                                                                                        "devisesCodes": deviseMontantSousRub3.devisesCodes,
                                                                                        "applyBorderDanger": { "nameFunction": (!this.isVentilation ? "labelRubIsNullOrDoubling" : "checkMontantAPayer") },
                                                                                        "collumnsDisabled": {
                                                                                            ["montant_initial_" + deviseMontantSousRub3.devise]: true,
                                                                                            ["montant_final_" + deviseMontantSousRub3.devise]: isVentilation,
                                                                                            libelle: isVentilation,
                                                                                            ["montant_ventile_" + deviseMontantSousRub3.devise]: deviseMontantSousRub3.devise != this.deviseDR,
                                                                                            ["montant_a_rembourser_justificatif_" + deviseMontantSousRub2.devise]: this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubriqueLevel3) || this.isJustifRembIntegral || deviseMontantSousRub3.devise != this.deviseDR
                                                                                        }
                                                                                    });
                                                                                else {
                                                                                    this.rubriques[indexElt]["montant_initial_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.montant_initial;
                                                                                    this.rubriques[indexElt]["montant_final_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.montant_final;
                                                                                    this.rubriques[indexElt]["montant_enregistre_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.montant_enregistre;
                                                                                    this.rubriques[indexElt]["montant_enregistre_initial_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.montant_enregistre;

                                                                                    this.rubriques[indexElt]["montant_reste_a_verser_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.montant_reste_a_verser;
                                                                                    this.rubriques[indexElt]["montant_reste_a_verser_initial_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.montant_reste_a_verser;
                                                                                    this.rubriques[indexElt]["devisesCodes"] = this.rubriques[indexElt]["devisesCodes"].concat(deviseMontantSousRub3.devisesCodes);
                                                                                    this.rubriques[indexElt]["montant_ventile_" + deviseMontantSousRub3.devise] = montantVentile;
                                                                                    this.rubriques[indexElt]["montant_a_rembourser_justificatif_" + deviseMontantSousRub3.devise] = (this.isJustifRembIntegral) ? deviseMontantSousRub3.montant_enregistre : montantARembJustificatif;
                                                                                    this.rubriques[indexElt]["montant_ventile_initial_" + deviseMontantSousRub3.devise] = montantVentile;

                                                                                    var columnsDisabledByDevise = this.rubriques[indexElt]["collumnsDisabled"];
                                                                                    columnsDisabledByDevise["montant_initial_" + deviseMontantSousRub3.devise] = true;
                                                                                    columnsDisabledByDevise["montant_ventile_" + deviseMontantSousRub3.devise] = deviseMontantSousRub3.devise != this.deviseDR;
                                                                                    columnsDisabledByDevise["montant_a_rembourser_justificatif_" + deviseMontantSousRub3.devise] = this.getRubriquesVentilatedJutificatif(dc, ddr, sousRubriqueLevel3) || this.isJustifRembIntegral || deviseMontantSousRub3.devise != this.deviseDR;
                                                                                    columnsDisabledByDevise["montant_final_" + deviseMontantSousRub3.devise] = this.isVentilation;
                                                                                    columnsDisabledByDevise["libelle"] = this.isVentilation;

                                                                                    this.rubriques[indexElt]["collumnsDisabled"] = columnsDisabledByDevise;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                var level = '';
                var classCss = '';
                if ((!app.isEmpty(this.rubriqueSelected) && this.rubriqueSelected.type == "DC") || app.isEmpty(this.rubriqueSelected)) {
                    level = '0';
                    classCss = this.classCssLevel0;
                }
                else if (this.rubriqueSelected.level == "0") {
                    level = '1';
                    classCss = this.classCssLevel1;
                }
                else if (this.rubriqueSelected.level == "1") {
                    level = '2';
                    classCss = this.classCssLevel2;
                }
                else {
                    level = '3';
                    classCss = this.classCssLevel3;
                }

                var type = (level == "0" ? "RUB" : "SUBRUB");

                var newListRubriques = [];
                if (!this.isAvanceRemboursable) {
                    newListRubriques.push({
                        "libelle": "",
                        ["montant_initial_" + this.devisesDC[0].devise]: "",
                        ["montant_final_" + this.devisesDC[0].devise]: "",
                        ["montant_enregistre_" + this.devisesDC[0].devise]: "",
                        ["montant_reste_a_verser_" + this.devisesDC[0].devise]: "",
                        "type": type,
                        "libelleParent": (level == "0" ? libelleDC : this.rubriqueSelected.libelle),
                        "level": level,
                        "disabledCheckBox": (level == "3"),
                        "classCss": classCss,
                        "rubriqueSelected": false,
                        'cmpCurrent': 'rubriques',
                        "id": "0",
                        'nameFunction': 'updateMontantsCalcules',
                        "applyBorderDanger": { "nameFunction": "labelRubIsNullOrDoubling" },
                        "updateParentsItems": true,
                        "collumnsDisabled": { ["montant_enregistre_" + this.devisesDC[0].devise]: true, ["montant_reste_a_verser_" + this.devisesDC[0].devise]: true }
                    });

                    var codes = ['A', 'B', 'C'];
                    newListRubriques[0]["devisesCodes"] = [];
                    for (var index = 0; index < this.devisesDC.length; index++) {
                        newListRubriques[0]["montant_initial_" + this.devisesDC[index].devise] = "";
                        newListRubriques[0]["montant_final_" + this.devisesDC[index].devise] = "";
                        newListRubriques[0]["montant_enregistre_" + this.devisesDC[index].devise] = "";
                        newListRubriques[0]["montant_reste_a_verser_" + this.devisesDC[index].devise] = "";
                        newListRubriques[0]["devisesCodes"].push({ "devise": this.devisesDC[index].devise, "code": codes[index] });
                        newListRubriques[0]["collumnsDisabled"]["montant_enregistre_" + this.devisesDC[index].devise] = true;
                        newListRubriques[0]["collumnsDisabled"]["montant_reste_a_verser_" + this.devisesDC[index].devise] = true;
                    }
                }
                else {
                    newListRubriques.push({
                        "libelle": "",
                        ["montant_initial"]: "",
                        ["montant_final"]: "",
                        ["montant_avance"]: "",
                        ["pourcentage_avance"]: "",
                        ["montant_reste_a_verser"]: "",
                        "type": type,
                        "libelleParent": (level == "0" ? libelleDC : this.rubriqueSelected.libelle),
                        "level": level,
                        "disabledCheckBox": (level == "3"),
                        "classCss": classCss,
                        "rubriqueSelected": false,
                        'cmpCurrent': 'rubriques',
                        "devise": this.deviseAFD,
                        "id": "0",
                        'nameFunction': 'updateMontantsCalcules',
                        "applyBorderDanger": { "nameFunction": "labelRubIsNullOrDoubling" },
                        "updateParentsItems": true,
                        "clumnsIcons": { "pourcentage_avance": "fa fa-percent" },
                        "collumnsDisabled": { "montant_reste_a_verser": true, "montant_avance": true }
                    });

                    //ligne automatique d'avance remboursable
                    if (this.rubriquesAR.length == 1) {
                        var montantAvanceDemarrage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_avance_demarrage');
                        var pourcentage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'pourcentage_avance_demarrage');

                        var indexParentEltAR = app.getIndexElementInArrayByValue(this.rubriquesAR, "libelle", libelleDC, false);
                        var rubAvance = [];
                        rubAvance.push({
                            "libelle": "Avance remboursable",
                            ["montant_initial"]: montantAvanceDemarrage,
                            ["montant_final"]: montantAvanceDemarrage,
                            ["montant_avance"]: "",
                            ["pourcentage_avance"]: "",
                            ["montant_reste_a_verser"]: "",
                            "type": type,
                            "libelleParent": libelleDC,
                            "level": "0",
                            "disabledCheckBox": true,
                            "classCss": this.classCssLevel0,
                            "disabled": true,
                            "rubriqueSelected": false,
                            'cmpCurrent': 'rubriques',
                            "devise": this.deviseAFD,
                            "id": "0",
                            "applyBorderDanger": { "nameFunction": "labelRubIsNullOrDoubling" },
                            "updateParentsItems": true,
                            "clumnsIcons": { "pourcentage_avance": "fa fa-percent" },
                            "collumnsDisabled": { "montant_reste_a_verser": true, "montant_initial": true, "montant_final": true, "montant_avance": true }
                        });
                        this.rubriquesAR.splice(indexParentEltAR + 1, 0, rubAvance[0]);
                    }
                }
                var rubriquesT = (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques);

                //vider toutes les lignes superieurs
                this.resetUpperLines(app.isEmpty(this.rubriqueSelected) ? app.getEltInArray(rubriquesT, "type", "DC") : this.rubriqueSelected);

                //recuperer l'index de dernier element das le mem niveau + pere identique
                var indexEltSameLevelAndParent = app.getIndexElementInArrayByValue(rubriquesT, "libelleParent", (level == "0" ? libelleDC : this.rubriqueSelected.libelle), true);

                //verifier s'il y a des sous niveau
                var eltSameLevelAndParent = rubriquesT[indexEltSameLevelAndParent];
                while (indexEltSameLevelAndParent != -1 && this.haveChildren(rubriquesT, eltSameLevelAndParent.libelle)) {
                    indexEltSameLevelAndParent = app.getIndexElementInArrayByValue(rubriquesT, "libelleParent", eltSameLevelAndParent.libelle, true);
                    eltSameLevelAndParent = rubriquesT[indexEltSameLevelAndParent];
                }

                var indexParentElt = app.getIndexElementInArrayByValue(rubriquesT, "libelle", (!app.isEmpty(this.rubriqueSelected) ? this.rubriqueSelected.libelle : libelleDC), false);
                var indexNewElet = (indexEltSameLevelAndParent != -1 ? indexEltSameLevelAndParent : indexParentElt);

                if (!this.isAvanceRemboursable)
                    this.rubriques.splice(indexNewElet + 1, 0, newListRubriques[0]);
                else
                    this.rubriquesAR.splice(indexNewElet + 1, 0, newListRubriques[0]);
            }
        }

        this.loading = true;

        if (!this.isAvanceRemboursable) {
            this.showRubriquesAR = false;
            this.showRubriques = true;
            this.rubriques = this.formatMontantRubriques();
            await app.sleep(500);

            this.tableRubriques.getItems();
        }
        else {
            this.showRubriques = false;
            this.showRubriquesAR = true;
            this.rubriquesAR = this.formatMontantRubriques();
            await app.sleep(500);

            this.tableRubriquesAR.getItems();
        }

        console.timeEnd('getRubriques');
    }

    async addRubriquesSousRubrique() {
        if (this.labelRubIsNullOrDoubling(this.rubriqueSelected, true))
            return;
        if (this.hasDuplicateDevise) {
            app.showToast('toastDeviseDoublingError');
            return;
        }
        await this.getRubriques(this.devisesDC, this.dc, true, false, false, false, false, null);
    }

    updateMontantvanceRemboursable() {
        if (this.isAvanceRemboursable) {
            var montantAvanceDemarrage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_avance_demarrage');
            var pourcentage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'pourcentage_avance_demarrage');
            var indexEltAR = app.getIndexElementInArrayByValue(this.rubriquesAR, "libelle", "Avance remboursable", false);

            // this.tableRubriquesAR.items[indexEltAR]["montant_avance"] = app.convertStringToFloat(montantAvanceDemarrage) * app.convertStringToFloat(pourcentage) / 100;
            this.tableRubriquesAR.items[indexEltAR]["montant_initial"] = montantAvanceDemarrage;
            this.tableRubriquesAR.items[indexEltAR]["montant_final"] = montantAvanceDemarrage;
            // this.tableRubriquesAR.items[indexEltAR]["pourcentage_avance"] = pourcentage;
        }

    }

    rubriqueIsSelected(item: any) {
        if (!app.isEmpty(item)) {
            if (!app.isEmpty(this.rubriqueSelected)) {
                var itemVar = app.getEltInArray((!this.isAvanceRemboursable ? this.tableRubriques.items : this.tableRubriquesAR.items), 'libelle', this.rubriqueSelected.libelle);
                if (itemVar != null && itemVar.rubriqueSelected && this.rubriqueSelected.rubriqueSelected)
                    return;
            }

            if (item.rubriqueSelected)
                this.rubriqueSelected = item;
            else
                this.rubriqueSelected = null;
        }
    }

    getListeDevisesMontantsRubriques(rubriqueVar: any, parentLibelleVar: any) {
        var listResult = [];
        var codes = ['A', 'B', 'C'];

        for (var alph of codes) {
            if (!app.isEmpty(rubriqueVar["devise" + alph])) {
                listResult.push({
                    "montant_initial": app.isEmpty(rubriqueVar["montant_initial" + alph]) ? '0' : rubriqueVar["montant_initial" + alph],
                    "montant_final": app.isEmpty(rubriqueVar["montant_final" + alph]) ? '0' : rubriqueVar["montant_final" + alph],
                    "montant_enregistre": app.isEmpty(rubriqueVar["montant_enregistre" + alph]) ? '0' : rubriqueVar["montant_enregistre" + alph],
                    "montant_reste_a_verser": app.isEmpty(rubriqueVar["montant_reste_a_verser" + alph]) ? '0' : rubriqueVar["montant_reste_a_verser" + alph],
                    "montant_a_rembourser_justificatif": app.isEmpty(rubriqueVar["montant_a_rembourser_justificatif" + alph]) ? '0' : rubriqueVar["montant_a_rembourser_justificatif" + alph],
                    "devise": rubriqueVar["devise" + alph],
                    "devisesCodes": [{ "devise": rubriqueVar["devise" + alph], "code": alph }],
                    "libelleParent": parentLibelleVar
                });
            }
        }
        return listResult;
    }

    getSommeMontantVentileByLevel(listeRubriques: any, nameColumn: any, level: any, libellePere: any) {
        var resultSommeMontants = 0;

        for (var rub of listeRubriques) {
            if (this.isFirstDdrVentilatedRubs) {
                if (libellePere != rub.libelle && rub.level == level && rub.libelleParent == libellePere && nameColumn.toString().includes("montant_ventile") && !rub.deleted)
                    resultSommeMontants = resultSommeMontants + app.convertStringToFloat(rub[nameColumn]);
            }
            else {
                if (libellePere != rub.libelle && rub.level == level && rub.libelleParent == libellePere && nameColumn.toString().includes("montant_ventile") && !rub.deleted && rub.libelle != "Avance remboursable")
                    resultSommeMontants = resultSommeMontants + app.convertStringToFloat(rub[nameColumn]);
            }

        }
        return resultSommeMontants;
    }
    getSommeMontantsByLevel(listeRubriques: any, nameColumn: any, level: any, libellePere: any) {
        var resultSommeMontants = 0;

        for (var rub of listeRubriques) {
            if (libellePere != rub.libelle && rub.level == level && rub.libelleParent == libellePere && nameColumn.toString().includes("montant") && !rub.deleted && rub.libelle != "Avance remboursable") {
                console.warn("rub[nameColumn] > ", rub[nameColumn])
                resultSommeMontants = resultSommeMontants + app.convertStringToFloat(rub[nameColumn]);
            }
        }
        return resultSommeMontants;
    }

    getmontantResteAVerserByItem(item: any, columnChange: any) {
        var devise = this.getDevise(columnChange);
        var resultSomme = (this.isAvanceRemboursable ? app.convertStringToFloat(item["montant_final"]) : app.convertStringToFloat(item["montant_final_" + devise]));
        var nameRAVColumn = (this.isAvanceRemboursable ? "montant_reste_a_verser" : "montant_reste_a_verser_");

        return { "nameColumn": nameRAVColumn + devise, "value": resultSomme };
    }

    getDevise(nameColumn: any) {
        var columnsSplit = nameColumn.toString().split("_");
        return columnsSplit[2];
    }

    async updateMontantsCalcules(item: any, deleted?: any) {
        var isNumber = true;

        if (!deleted)
            isNumber = (!app.isEmpty(item[item.columnName].match(/[0-9]/g)) || item[item.columnName].length == 0);

        if (!this.isVentilation && isNumber) {
            var itemVar = item;
            var libelleParent = item.libelleParent;
            var columnChange = itemVar.columnName;
            var typeTableRubriques = this.isAvanceRemboursable ? this.tableRubriquesAR : this.tableRubriques;
            var index;

            if (!deleted) {
                var nbrTry = 0;
                while (!app.isEmpty(libelleParent) && (columnChange.toString().includes("montant") || columnChange.toString().includes("pourcentage"))) {
                    index = this.getIndexRubrique(typeTableRubriques.items, itemVar.libelleParent);
                    var itemParent = typeTableRubriques.items[index];
                    var resultSommeMontantByLevel = this.getSommeMontantsByLevel(typeTableRubriques.items, columnChange, itemVar.level, itemVar.libelleParent);

                    // if (columnChange.toString().includes("montant") && itemVar.type != "DC") { //NOUR � voir psq �a marche pas psq il trouve au moment de la cr�ation de l'AR que la colonne rav n'existe pas dans la table => typeTableRubriques.items est null
                    if (columnChange.toString().includes("montant") && itemVar.type != "DC") {
                        var resultSommeRAV = this.getmontantResteAVerserByItem(itemVar, columnChange);
                        //mettre a jour la ligne dans la tableau
                        index = this.getIndexRubrique(typeTableRubriques.items, itemVar.libelle);

                        typeTableRubriques.items[index][resultSommeRAV.nameColumn] = app.formatNumberWithDecimals(resultSommeRAV.value);

                    }

                    if (itemVar.type != "DC") {
                        if (columnChange.toString().includes("montant_initial") && nbrTry == 0) {
                            var deviseVar = this.getDevise(columnChange);
                            index = this.getIndexRubrique(typeTableRubriques.items, itemVar.libelle);

                            if (!this.isAvanceRemboursable) {
                                var montantInitial = (!app.isEmpty(itemVar["montant_initial_" + deviseVar]) ? app.formatNumberWithDecimals(app.convertStringToFloat(itemVar["montant_initial_" + deviseVar])) : '');
                                typeTableRubriques.items[index]["montant_final_" + deviseVar] = montantInitial;
                                typeTableRubriques.items[index]["montant_reste_a_verser_" + deviseVar] = montantInitial;
                            } else {
                                var montantInitial = app.formatNumberWithDecimals(app.convertStringToFloat(itemVar["montant_initial"]));

                                typeTableRubriques.items[index]["montant_final"] = montantInitial;

                                if (this.isVentilation)
                                    typeTableRubriques.items[index]["montant_reste_a_verser"] = montantInitial;
                            }
                        }

                        //CAS AVANCE REMBOURSABLE > CALCUL DE MONTANT AVANCE A REMBOURSER
                        if (this.isAvanceRemboursable) { //US2125
                            index = this.getIndexRubrique(typeTableRubriques.items, itemVar.libelle);
                            var montantAvanceDemarrage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_avance_demarrage');

                            // var resultPAR = app.convertStringToFloat(typeTableRubriques.items[index]["montant_final"]) * app.convertStringToFloat(typeTableRubriques.items[index]["pourcentage_avance"]) / 100;
                            var resultPAR = montantAvanceDemarrage * app.convertStringToFloat(typeTableRubriques.items[index]["pourcentage_avance"]) / 100;
                            typeTableRubriques.items[index]["montant_avance"] = app.formatNumberWithDecimals(resultPAR);
                        }
                    }

                    if (columnChange.toString().includes("montant_initial")) {
                        var deviseVar = this.getDevise(columnChange);
                        var resultSommeMontantByLevelMontantFinal = this.getSommeMontantsByLevel(typeTableRubriques.items, (this.isAvanceRemboursable ? "montant_final" : "montant_final_" + deviseVar), itemVar.level, itemVar.libelleParent);
                        index = this.getIndexRubrique(typeTableRubriques.items, itemVar.libelleParent);

                        if (itemParent != null) {
                            if (!this.isAvanceRemboursable)
                                itemParent["montant_final_" + deviseVar] = app.formatNumberWithDecimals(resultSommeMontantByLevelMontantFinal);
                            else
                                itemParent["montant_final"] = app.formatNumberWithDecimals(resultSommeMontantByLevelMontantFinal);
                        }
                    }

                    //mettre a jour la ligne dans la tableau
                    index = this.getIndexRubrique(typeTableRubriques.items, itemVar.libelleParent);

                    if (!this.isAvanceRemboursable) {
                        var devise = this.getDevise(columnChange);
                        itemParent["montant_reste_a_verser_" + devise] = app.formatNumberWithDecimals(app.convertStringToFloat(resultSommeMontantByLevel) - app.convertStringToFloat(itemParent["montant_enregistre_" + devise]));
                    }
                    else {
                        itemParent["montant_reste_a_verser"] = app.formatNumberWithDecimals(app.convertStringToFloat(resultSommeMontantByLevel) - app.convertStringToFloat(itemParent["montant_ventile"]));
                    }

                    if (!columnChange.toString().includes("pourcentage")) {
                        itemParent[columnChange] = app.formatNumberWithDecimals(resultSommeMontantByLevel);
                        if (!this.isAvanceRemboursable)
                            this.tableRubriques.items[index] = itemParent;
                        else
                            this.tableRubriquesAR.items[index] = itemParent;
                    }
                    libelleParent = itemParent.libelleParent;
                    itemVar = itemParent;
                    nbrTry++;
                }
            }
            else {
                while (!app.isEmpty(libelleParent)) {
                    index = this.getIndexRubrique(typeTableRubriques.items, libelleParent);
                    var itemParent = typeTableRubriques.items[index];
                    for (var dev of this.devisesDC) {
                        for (var key of Object.keys(itemParent)) {
                            if ((key.includes("montant_initial") || key.includes("montant_final") || key.includes("montant_reste_a_verser"))) {
                                var indexVar;
                                if (this.isAvanceRemboursable) {
                                    indexVar = this.getIndexRubrique(this.tableRubriquesAR.items, libelleParent);
                                    if (app.convertStringToFloat(item[key]) == 0.0) {
                                        var resultCalcul = this.getSommeMontantsByLevel(typeTableRubriques.items, key, itemVar.level, itemVar.libelleParent);
                                        console.warn("resultCalcul > ", resultCalcul)
                                        itemParent[key] = app.formatNumberWithDecimals(resultCalcul);
                                    } else
                                        itemParent[key] = app.formatNumberWithDecimals(app.convertStringToFloat(itemParent[key]) - app.convertStringToFloat(item[key]));

                                    itemParent.disabled = !this.haveChildren(this.rubriquesAR, itemParent.libelle);
                                    if (itemParent.type != 'DC' && ((key.includes("montant_initial") && (item.persistenceId == null || item.persistenceId == 0 || item.persistenceId == '')) || key.includes("montant_final")))
                                        item.collumnsDisabled[key] = false;

                                    this.tableRubriquesAR.items[indexVar] = itemParent;
                                }
                                else {
                                    if (key.includes(dev.devise)) {
                                        indexVar = this.getIndexRubrique(this.tableRubriques.items, libelleParent);
                                        if (app.convertStringToFloat(item[key]) == 0.0) {
                                            var resultCalcul = this.getSommeMontantsByLevel(typeTableRubriques.items, key, itemVar.level, itemVar.libelleParent);
                                            itemParent[key] = app.formatNumberWithDecimals(resultCalcul);
                                        }
                                        else
                                            itemParent[key] = app.formatNumberWithDecimals(app.convertStringToFloat(itemParent[key]) - app.convertStringToFloat(item[key]));

                                        if (itemParent.type != 'DC' && !this.haveChildren(this.rubriques, itemParent.libelle) && ((key.includes("montant_initial") && (item.persistenceId == null || item.persistenceId == 0 || item.persistenceId == '')) || key.includes("montant_final")))
                                            itemParent.collumnsDisabled[key] = false;

                                        this.tableRubriques.items[indexVar] = itemParent;
                                    }
                                }
                            }
                        }
                    }
                    libelleParent = itemParent.libelleParent;
                    itemVar = itemParent;
                }

            }
        }
    }

    getRubriquesFormated() {
        var rubriquesResult = [];

        if (!this.isAvanceRemboursable) {
            for (var rubrique of this.rubriques) {
                //anomalie 2134
                if (!rubrique.deleted && rubrique.level == "0" && rubrique.type != "DC") {
                    var deviseA = app.getEltInArray(rubrique.devisesCodes, 'code', 'A');
                    var deviseB = app.getEltInArray(rubrique.devisesCodes, 'code', 'B');
                    var deviseC = app.getEltInArray(rubrique.devisesCodes, 'code', 'C');

                    rubriquesResult.push({
                        'id_rubrique': rubrique.id,
                        'libelle_rubrique': rubrique.libelle,
                        'pourcentage_avance': 0,
                        'montant_avance': null,
                        'devise_avance': '',
                        "level": rubrique.level,
                        'montant_initialA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_initial_" + deviseA.devise]) : null),
                        'montant_initialB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_initial_" + deviseB.devise]) : null),
                        'montant_initialC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_initial_" + deviseC.devise]) : null),
                        'montant_finalA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_final_" + deviseA.devise]) : null),
                        'montant_finalB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_final_" + deviseB.devise]) : null),
                        'montant_finalC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_final_" + deviseC.devise]) : null),
                        'montant_enregistreB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_enregistre_" + deviseB.devise]) : null),
                        'montant_enregistreA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_enregistre_" + deviseA.devise]) : null),
                        'montant_enregistreC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_enregistre_" + deviseC.devise]) : null),
                        'montant_reste_a_verserA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_reste_a_verser_" + deviseA.devise]) : null),
                        'montant_reste_a_verserB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_reste_a_verser_" + deviseB.devise]) : null),
                        'montant_reste_a_verserC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_reste_a_verser_" + deviseC.devise]) : null),
                        'deviseA': (deviseA != null ? deviseA.devise : ""),
                        'deviseB': (deviseB != null ? deviseB.devise : ""),
                        'deviseC': (deviseC != null ? deviseC.devise : ""),
                        'montant_initial_avance': null,
                        'montant_final_avance': null,
                        'montant_reste_a_verser': null
                    });
                }
            }
        }
        else {
            for (var rubrique of this.rubriquesAR) {
                if (!rubrique.deleted && rubrique.level == "0" && rubrique.type != "DC") {
                    rubriquesResult.push({
                        'id_rubrique': rubrique.id,
                        'libelle_rubrique': rubrique.libelle,
                        'pourcentage_avance': app.convertStringToFloat(rubrique.pourcentage_avance),
                        'montant_initial_avance': app.convertStringToFloat(rubrique.montant_initial),
                        'montant_final_avance': app.convertStringToFloat(rubrique.montant_final),
                        'montant_avance': app.convertStringToFloat(rubrique.montant_avance),
                        'montant_reste_a_verser': app.convertStringToFloat(rubrique.montant_initial),
                        'devise_avance': rubrique.devise,
                        "level": rubrique.level,
                        'montant_initialA': null,
                        'montant_initialB': null,
                        'montant_initialC': null,
                        'montant_finalA': null,
                        'montant_finalB': null,
                        'montant_finalC': null,
                        'montant_enregistreB': null,
                        'montant_enregistreA': null,
                        'montant_enregistreC': null,
                        'montant_reste_a_verserA': null,
                        'montant_reste_a_verserB': null,
                        'montant_reste_a_verserC': null,
                        'deviseA': "",
                        'deviseB': "",
                        'deviseC': "",
                    });
                }
            }

        }
        return rubriquesResult;
    }

    getSousRubriquesFormated() {
        var sousRubriquesResult = [];

        if (this.isAvanceRemboursable) {
            for (var rubrique of this.rubriquesAR) {
                //anomalie 2134
                if (!rubrique.deleted && rubrique.level != "0" && rubrique.type != "DC") {
                    sousRubriquesResult.push({
                        'id_sous_rubrique': rubrique.id,
                        'libelle_parent_object': rubrique.libelleParent,
                        'libelle': rubrique.libelle,
                        'montant_initialA': null,
                        'montant_initialB': null,
                        'montant_initialC': null,
                        'montant_avance': app.convertStringToFloat(rubrique.montant_avance),
                        'montant_initial_avance': app.convertStringToFloat(rubrique.montant_initial),
                        'pourcentage_avance': app.convertStringToFloat(rubrique.pourcentage_avance),
                        'montant_final_avance': app.convertStringToFloat(rubrique.montant_final),
                        'montant_reste_a_verser': app.convertStringToFloat(rubrique.montant_initial),
                        'devise_avance': rubrique.devise,
                        'montant_finalA': null,
                        'montant_finalB': null,
                        'montant_finalC': null,
                        'montant_enregistreB': null,
                        'montant_enregistreA': null,
                        'montant_enregistreC': null,
                        'montant_reste_a_verserA': null,
                        'montant_reste_a_verserB': null,
                        'montant_reste_a_verserC': null,
                        'deviseA': "",
                        'deviseB': "",
                        'deviseC': "",
                        "level": rubrique.level
                    });
                }
            }
        }
        else {
            for (var rubrique of this.rubriques) {
                if (!rubrique.deleted && rubrique.level != "0" && rubrique.type != "DC") {
                    var deviseA = app.getEltInArray(rubrique.devisesCodes, 'code', 'A');
                    var deviseB = app.getEltInArray(rubrique.devisesCodes, 'code', 'B');
                    var deviseC = app.getEltInArray(rubrique.devisesCodes, 'code', 'C');

                    sousRubriquesResult.push({
                        'id_sous_rubrique': rubrique.id,
                        'libelle_parent_object': rubrique.libelleParent,
                        'libelle': rubrique.libelle,
                        'pourcentage_avance': null,
                        'devise_avance': "",
                        "montant_avance": null,
                        'montant_initialA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_initial_" + deviseA.devise]) : null),
                        'montant_initialB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_initial_" + deviseB.devise]) : null),
                        'montant_initialC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_initial_" + deviseC.devise]) : null),
                        'montant_finalA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_final_" + deviseA.devise]) : null),
                        'montant_finalB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_final_" + deviseB.devise]) : null),
                        'montant_finalC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_final_" + deviseC.devise]) : null),
                        'montant_enregistreB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_enregistre_" + deviseB.devise]) : null),
                        'montant_enregistreA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_enregistre_" + deviseA.devise]) : null),
                        'montant_enregistreC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_enregistre_" + deviseC.devise]) : null),
                        'montant_reste_a_verserA': (deviseA != null ? app.convertStringToFloat(rubrique["montant_reste_a_verser_" + deviseA.devise]) : null),
                        'montant_reste_a_verserB': (deviseB != null ? app.convertStringToFloat(rubrique["montant_reste_a_verser_" + deviseB.devise]) : null),
                        'montant_reste_a_verserC': (deviseC != null ? app.convertStringToFloat(rubrique["montant_reste_a_verser_" + deviseC.devise]) : null),
                        'deviseA': (deviseA != null ? deviseA.devise : ""),
                        'deviseB': (deviseB != null ? deviseB.devise : ""),
                        'deviseC': (deviseC != null ? deviseC.devise : ""),
                        "level": rubrique.level,
                        'montant_initial_avance': null,
                        'montant_final_avance': null,
                        'montant_reste_a_verser': null
                    });
                }
            }
        }
        return sousRubriquesResult;
    }

    resetUpperLines(item: any) {
        var itemVar = item;
        var libelle = item.libelle;

        while (!app.isEmpty(libelle)) {
            var itemParent = app.getEltInArray((this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques), 'libelle', itemVar.libelleParent);
            itemVar["collumnsDisabled"] = {};

            if (!this.isAvanceRemboursable) {
                for (var deviseVar of this.devisesDC) {
                    itemVar["montant_initial_" + deviseVar.devise] = "";
                    itemVar["montant_final_" + deviseVar.devise] = "";
                    itemVar["montant_reste_a_verser_" + deviseVar.devise] = "";
                    itemVar["collumnsDisabled"]["montant_initial_" + deviseVar.devise] = true;
                    itemVar["collumnsDisabled"]["montant_final_" + deviseVar.devise] = true;
                    itemVar.costumsCss = { "libelle": "input-width-rubrique" };
                }
            }
            else {
                for (var deviseVar of this.devisesDC) {
                    itemVar["montant_initial"] = "";
                    itemVar["montant_final"] = "";
                    itemVar["montant_reste_a_verser"] = "";
                    itemVar["collumnsDisabled"]["montant_initial"] = true;
                    itemVar["collumnsDisabled"]["montant_final"] = true;
                    itemVar.widthInput = "input-width-rubrique";
                    itemVar.costumsCss = { "libelle": "input-width-rubrique" };
                }
            }

            //mettre a jour la ligne dans la tableau
            var index = app.getIndexElementInArrayByValue((this.isAvanceRemboursable ? this.tableRubriquesAR.items : this.tableRubriques.items), "libelle", itemVar.libelle, false);

            if (!this.isAvanceRemboursable)
                this.tableRubriques.items[index] = itemVar;
            else
                this.tableRubriquesAR.items[index] = itemVar;

            libelle = itemVar.libelleParent;
            itemVar = itemParent;
        }
    }

    haveChildren(items: any, libelle: any) {
        for (var itVar of items)
            if (itVar.libelleParent == libelle && !itVar.deleted)
                return true;

        return false;
    }

    checkExistRubriques() {
        var rubriquesCheck = (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques);

        for (var rubriqueItem of rubriquesCheck)
            if (rubriqueItem.type != "DC")
                return true;

        return false;
    }

    getMontantsDC() {
        var DC = app.getEltInArray((this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques), "type", "DC");
        var montansDC = { montant_initialAFD: 0, montant_finalAFD: 0, montant_enregistreAFD: 0, montant_reste_a_verserAFD: 0 };
        var deviseAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');

        if (!this.isAvanceRemboursable) {
            montansDC.montant_initialAFD = app.convertStringToFloat(DC["montant_initial_" + deviseAFD]);
            montansDC.montant_finalAFD = app.convertStringToFloat(DC["montant_final_" + deviseAFD]);
            montansDC.montant_enregistreAFD = app.convertStringToFloat(DC["montant_enregistre_" + deviseAFD]);
            montansDC.montant_reste_a_verserAFD = app.convertStringToFloat(DC["montant_reste_a_verser_" + deviseAFD]);
        }
        else {
            montansDC.montant_initialAFD = app.convertStringToFloat(DC["montant_initial"]);
            montansDC.montant_finalAFD = app.convertStringToFloat(DC["montant_final"]);
            montansDC.montant_reste_a_verserAFD = app.convertStringToFloat(DC["montant_reste_a_verser"]);
        }

        return montansDC;
    }

    getMontantsAutreDevise(autresDevises: any) {
        var DC = app.getEltInArray(this.rubriques, "type", "DC");

        for (var autrDev of autresDevises) {
            autrDev.montant_initial = app.convertStringToFloat(DC["montant_initial_" + autrDev.devise]);
            autrDev.montant_final = app.convertStringToFloat(DC["montant_final_" + autrDev.devise]);
            autrDev.montant_enregistre = app.convertStringToFloat(DC["montant_enregistre_" + autrDev.devise]);
            autrDev.montant_reste_a_verser = app.convertStringToFloat(DC["montant_reste_a_verser_" + autrDev.devise]);
        }
        return autresDevises;
    }

    labelRubIsNullOrDoubling(item: any, checkNull?: any) {
        var typeRubriques = (!this.isAvanceRemboursable) ? this.rubriques : this.rubriquesAR;

        if (checkNull && ((app.isEmpty(item) && app.isEmpty(app.getEltInArray(typeRubriques, "type", "DC").libelle)) || (!app.isEmpty(this.rubriqueSelected) && app.isEmpty(this.rubriqueSelected.libelle) && app.isEmpty(item.libelle)))) {
            if (app.isEmpty(app.getEltInArray(typeRubriques, "type", "DC").libelle))
                app.showToast('toastLibelleDcRequiredError');
            else
                app.showToast('toastLibelleRubriqueRequiredError');
            return true;
        }
        else if (!app.isEmpty(item) && !app.isEmpty(item.libelle) && this.existDoublingLibelleRub(item)) {
            app.showToast('toastLibelleRubriqueDoublingError');
            return true;
        }

        return false;
    }

    checkMontantAPayer(item: any) {
        var isNumber = false;
        if (item["columnName"] != null)
            isNumber = (!app.isEmpty(item[item.columnName].match(/[0-9]/g)) || item[item.columnName].length == 0);

        if (item != null && isNumber) {
            var columnCurrent = item["columnName"];
            var devise = columnCurrent.split("_")[2];

            //METTRE A JOUR LE RAV de la ligne concernee
            if (!this.isAvanceRemboursable) {
                var index = app.getIndexElementInArrayByValue(this.tableRubriques.items, "libelle", item.libelle, false);

                this.tableRubriques.items[index]["montant_enregistre_" + devise] = app.formatNumberWithDecimals((app.convertStringToFloat(this.tableRubriques.items[index]["montant_enregistre_initial_" + devise]) - app.convertStringToFloat(this.tableRubriques.items[index]["montant_ventile_initial_" + devise])) + app.convertStringToFloat(this.tableRubriques.items[index][columnCurrent]));

                this.tableRubriques.items[index]["montant_reste_a_verser_" + devise] = (!this.isJustificatifRemboursment) ? app.formatNumberWithDecimals(app.convertStringToFloat(item["montant_final_" + devise]) - app.convertStringToFloat(item["montant_enregistre_" + devise])) : app.formatNumberWithDecimals(app.convertStringToFloat(item["montant_reste_a_verser_" + devise]) + app.convertStringToFloat(item["montant_a_rembourser_justificatif_" + devise]));
            }
            else {
                var index = app.getIndexElementInArrayByValue(this.tableRubriquesAR.items, "libelle", item.libelle, false);
                // if ((this.tableRubriquesAR.items[index].libelle != "Avance remboursable")) {
                // if (!this.isJustificatifRemboursment)
                // 	this.tableRubriquesAR.items[index]["montant_reste_a_verser"] = (app.convertStringToFloat(item["montant_final"]) != app.convertStringToFloat(item["montant_ventile"])) ? app.convertStringToFloat(this.tableRubriquesAR.items[index]["montant_reste_a_verser"]) - app.convertStringToFloat(item["montant_ventile"]) : app.convertStringToFloat(item["montant_final"]) - app.convertStringToFloat(item["montant_ventile"]);
                // else
                // 	app.convertStringToFloat(item["montant_reste_a_verser"]);
                // var montant = app.convertStringToFloat(item["montant_reste_a_verser"]);
                this.tableRubriquesAR.items[index]["montant_reste_a_verser"] = app.formatNumberWithDecimals((!this.isJustificatifRemboursment) ? ((app.convertStringToFloat(item["montant_final"]) != app.convertStringToFloat(item["montant_ventile"]) && app.convertStringToFloat(item["montant_reste_a_verser_fixe"]) != 0) ? app.convertStringToFloat(item["montant_reste_a_verser_fixe"]) : app.convertStringToFloat(item["montant_final"])) - app.convertStringToFloat(item["montant_ventile"]) : app.convertStringToFloat(item["montant_reste_a_verser"]));
                // } 
                // 	else
                // this.tableRubriquesAR.items[index]["montant_reste_a_verser"] = '-';
            }
            this.updateMontantVentileParentElt(item);
            var resultBoolean = (!this.isAvanceRemboursable) ? app.convertStringToFloat(item["montant_reste_a_verser_" + devise]) < 0 : app.convertStringToFloat(item["montant_reste_a_verser"]) < 0;

            return resultBoolean;
        }
        return false;
    }
    updateMontantVentileParentElt(item: any) {
        var itemVar = item;
        var libelleParent = item.libelleParent;
        var columnChange = "";

        if (!app.isEmpty(itemVar.columnName))
            columnChange = itemVar.columnName;

        var devise = columnChange.split("_")[2];

        while (!app.isEmpty(libelleParent)) {
            var typeRubriques = (!this.isAvanceRemboursable) ? this.rubriques : this.rubriquesAR;

            var itemParent = app.getEltInArray(typeRubriques, 'libelle', itemVar.libelleParent);

            var resultSommeMontantVentileByLevel = this.getSommeMontantsByLevel(typeRubriques, columnChange, itemVar.level, itemVar.libelleParent);
            var column = "montant_enregistre_" + devise;

            var indexVar = (!this.isAvanceRemboursable) ? app.getIndexElementInArrayByValue(this.tableRubriques.items, "libelle", itemVar.libelleParent, false) : app.getIndexElementInArrayByValue(this.tableRubriquesAR.items, "libelle", itemVar.libelleParent, false);

            if (this.isAvanceRemboursable) { //pour le parent DC
                this.tableRubriquesAR.items[indexVar][columnChange] = app.formatNumberWithDecimals(resultSommeMontantVentileByLevel);
                this.tableRubriquesAR.items[indexVar]["montant_reste_a_verser"] = app.formatNumberWithDecimals((!this.isJustificatifRemboursment) ? ((app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_final"]) != app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_ventile"]) && app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_reste_a_verser_fixe"]) != 0) ? app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_reste_a_verser_fixe"]) : app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_final"])) - app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_ventile"]) : app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_reste_a_verser"]));
                // this.tableRubriquesAR.items[indexVar]["montant_reste_a_verser"] = (!this.isJustificatifRemboursment) ? app.formatNumberWithDecimals(app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_final"]) - app.convertStringToFloat(resultSommeMontantVentileByLevel)) : app.formatNumberWithDecimals(app.convertStringToFloat(this.tableRubriquesAR.items[indexVar]["montant_reste_a_verser"]));
                this.tableRubriquesAR.items[indexVar]["montant_ventile"] = this.getSommeMontantVentileByLevel(typeRubriques, columnChange, itemVar.level, itemVar.libelleParent);
            }
            else {
                var resultSommeMontantEnregistreByLevel = this.getSommeMontantsByLevel(this.rubriques, column, itemVar.level, itemVar.libelleParent);

                this.tableRubriques.items[indexVar][columnChange] = app.formatNumberWithDecimals(resultSommeMontantVentileByLevel);
                this.tableRubriques.items[indexVar]["montant_enregistre_" + devise] = app.formatNumberWithDecimals(resultSommeMontantEnregistreByLevel);
                this.tableRubriques.items[indexVar]["montant_reste_a_verser_" + devise] = app.formatNumberWithDecimals(app.convertStringToFloat(this.tableRubriques.items[indexVar]["montant_final_" + devise]) - app.convertStringToFloat(resultSommeMontantEnregistreByLevel));
            }
            libelleParent = itemParent.libelleParent;
            itemVar = itemParent;
        }
    }
    existDoublingLibelleRub(item: any) {
        var rubriques = (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques)
        var count = 0;

        for (var rub of rubriques)
            if (rub.libelle == item.libelle && !rub.deleted)
                count++;

        return (count > 1);
    }

    async deleteRubrique() {
        if (this.isAvanceRemboursable) {
            var indeElt = this.getIndexRubriqueDeleted(this.rubriquesAR, this.rubriqueDeleted);

            this.rubriquesAR[indeElt].deleted = true;
            this.rubriquesAR[indeElt].disabled = true;
            this.rubriquesAR[indeElt].disabledCheckBox = true;

            if (this.rubriqueDeleted.rubriqueSelected) {
                this.rubriquesAR[indeElt].rubriqueSelected = false;
                this.rubriqueSelected = null;
            }

            await this.updateMontantsCalcules(this.rubriqueDeleted, true);

            await app.sleep(1000);

            this.tableRubriquesAR.getItems();
        }
        else {
            var indeElt = this.getIndexRubriqueDeleted(this.rubriques, this.rubriqueDeleted);

            this.rubriques[indeElt].deleted = true;
            this.rubriques[indeElt].disabled = true;
            this.rubriques[indeElt].disabledCheckBox = true;

            if (this.rubriqueDeleted.rubriqueSelected) {
                this.rubriques[indeElt].rubriqueSelected = false;
                this.rubriqueSelected = null;
            }
            await this.updateMontantsCalcules(this.rubriqueDeleted, true);

            await app.sleep(1000);

            this.tableRubriques.getItems();
        }
        this.modalDeleteRubrique.setLoadingBtn();
        app.hideModal('modalConfirmSuppressionRubrique');
    }

    cancelDeleteRubrique() {
        app.hideModal('modalConfirmSuppressionRubrique');
    }

    async showDeleteConfirmRubrique(item: any) {
        this.rubriqueDeleted = item;
        var rubriques = (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques);
        var rubVentilated = false;

        if (!app.isEmpty(item.id))
            rubVentilated = await this.checkRubriqueVentile(item.id);

        //verifier si la rubrique a des sous rubriques / elle est ventile
        if (this.haveChildren(rubriques, item.libelle))
            app.showToast('toastDeleteRubriqueError');
        else if (rubVentilated)
            app.showToast('toastDeleteRubriqueVentilatedError');
        else
            app.showModal('modalConfirmSuppressionRubrique');
    }

    getRubriquesByType() {
        return (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques);
    }

    getMontantJustificatifByRubrique(id: any, justificatif: any, devise: any) {
        if (!app.isEmpty(justificatif)) {
            for (var item of justificatif.montantsJustificatifRubrique) {
                if (item.id_rubrique == id && devise == this.deviseDR)
                    return item.montant_ventile;
            }
        }
        return '0';
    }
    getMontantJustificatifByRubriqueAR(dc: any, rubrique: any, justificatif: any, devise: any) {
        var persistenceIdAR = 0;

        if (!app.isEmpty(justificatif)) {
            for (var item of justificatif.montantsJustificatifRubrique) {
                if (item.id_rubrique == rubrique.persistenceId && devise == this.deviseDR)
                    return item.montant_ventile;
            }
        }
        else {
            if (!app.isEmpty(dc)) {
                if (rubrique.libelle_rubrique == "Avance remboursable")
                    persistenceIdAR = rubrique.persistenceId;

                if (dc.dossiers_reglements.length > 0) {
                    for (var dossier_reglement of dc.dossiers_reglements) {
                        for (var justif of dossier_reglement.justificatifs) {
                            for (var montant of justif.montantsJustificatifRubrique) {
                                if (montant.level_rubrique == "0" && montant.id_rubrique == persistenceIdAR) {
                                    return montant.montant_ventile;
                                }
                            }
                        }
                    }
                }
            }
        }
        return '';
    }
    getMontantJustificatifRembByRubrique(id: any, justifRemboursement: any, devise: any) {
        if (!app.isEmpty(justifRemboursement)) {
            for (var item of justifRemboursement.montantJustifRemboursement) {
                if (item.id_rubrique == id && devise == this.deviseDR)
                    return item.montant_a_rembourser;
            }
        }
        return '';
    }
    getMontantARembJustificatifByRubriqueAR(dc: any, rubrique: any, justificatif: any, devise: any) {
        var persistenceIdAR = 0;
        if (!app.isEmpty(justificatif)) {
            for (var item of justificatif.montantsJustificatifRubrique) {
                if (item.id_rubrique == rubrique.persistenceId && devise == this.deviseDR)
                    return item.montant_a_rembourser;
            }
        }
        else {
            if (!app.isEmpty(dc)) {
                if (rubrique.libelle_rubrique == "Avance remboursable")
                    persistenceIdAR = rubrique.persistenceId;

                if (dc.dossiers_reglements.length > 0) {
                    for (var dossier_reglement of dc.dossiers_reglements) {
                        for (var justificatif of dossier_reglement.justificatifs) {
                            for (var montant of justificatif.montantsJustificatifRubrique) {
                                if (montant.level_rubrique == "0" && montant.id_rubrique == persistenceIdAR) {
                                    return montant.montant_a_rembourser;
                                }
                            }
                        }
                    }
                }
            }
        }
        return '';
    }
    getMontantARembJustifRembByRubrique(dc: any, rubrique: any, justificatif: any, devise: any) {
        var persistenceIdAR = 0;
        if (!app.isEmpty(justificatif)) {
            for (var item of justificatif.montantsJustificatifRubrique) {
                if (item.id_rubrique == rubrique.persistenceId && devise == this.deviseDR)
                    return item.montant_a_rembourser;
            }
        }
        else {
            if (!app.isEmpty(dc)) {
                if (rubrique.libelle_rubrique == "Avance remboursable")
                    persistenceIdAR = rubrique.persistenceId;

                if (dc.dossiers_reglements.length > 0) {
                    for (var dossier_reglement of dc.dossiers_reglements) {
                        for (var justificatif of dossier_reglement.justificatifs) {
                            for (var montant of justificatif.montantsJustificatifRubrique) {
                                if (montant.level_rubrique == "0" && montant.id_rubrique == persistenceIdAR) {
                                    return montant.montant_a_rembourser;
                                }
                            }
                        }
                    }
                }
            }
        }
        return '';
    }
    resetListRubriques() {
        this.rubriques = null;
        this.rubriquesAR = null;
    }
    getMontantsRubriques(justificatifDeleted?: any) {
        var typeRubriques = (!this.isAvanceRemboursable) ? this.rubriques : this.rubriquesAR;
        var result = [];

        for (var rubrique of typeRubriques) {
            if (rubrique.type != "DC") {
                result.push({
                    "id_rubrique": rubrique.id,
                    "montant_enregistre": (!this.isAvanceRemboursable ? (app.convertStringToFloat(rubrique["montant_enregistre_" + this.deviseDR]) - (justificatifDeleted ? app.convertStringToFloat(rubrique["montant_ventile_" + this.deviseDR]) : 0)) : null),
                    "level": rubrique.level,
                    "montant_reste_a_verser": (this.isAvanceRemboursable) ? (app.convertStringToFloat(rubrique["montant_reste_a_verser"]) + (justificatifDeleted ? app.convertStringToFloat(rubrique["montant_ventile"]) : 0)) : null
                });
            }
        }
        return result;
    }
    getListeMontantsJustificatifs() {
        var result = [];
        var typeRubriques = (!this.isAvanceRemboursable) ? this.rubriques : this.rubriquesAR;

        if (typeRubriques.length > 0) {
            for (var rubrique of typeRubriques) {
                if (rubrique.type != "DC") {
                    if (!this.isAvanceRemboursable) {
                        if (!app.isEmpty(rubrique["montant_ventile_" + this.deviseDR]) && rubrique["montant_ventile_" + this.deviseDR] != "0,00")
                            result.push({
                                'id_rubrique': rubrique.id.toString(),
                                'montant_ventile': (app.convertStringToFloat(rubrique["montant_ventile_" + this.deviseDR])),
                                'montant_a_rembourser': null,
                                "level_rubrique": rubrique.level,
                                "isUsed": (rubrique["collumnsDisabled"]["montant_ventile_" + this.deviseDR] == false)
                            });
                    }
                    else {
                        if ((!app.isEmpty(rubrique["montant_ventile"]) && rubrique["montant_ventile"] != "0,00") || (!app.isEmpty(rubrique["montant_a_rembourser"]) && rubrique["montant_a_rembourser"] != "0,00")) {
                            if (this.isFirstDdrVentilatedRubs)
                                result.push({
                                    'id_rubrique': rubrique.id.toString(),
                                    'montant_ventile': (app.convertStringToFloat(rubrique["montant_ventile"])),
                                    'montant_a_rembourser': (app.convertStringToFloat(rubrique["montant_a_rembourser"])),
                                    "level_rubrique": rubrique.level,
                                    "isUsed": (rubrique["collumnsDisabled"]["montant_ventile"] == false)
                                });
                            else {
                                console.log("Not the first DDR attached");
                                if (rubrique.libelle != "Avance remboursable")
                                    result.push({
                                        'id_rubrique': rubrique.id.toString(),
                                        'montant_ventile': (app.convertStringToFloat(rubrique["montant_ventile"])),
                                        'montant_a_rembourser': (app.convertStringToFloat(rubrique["montant_a_rembourser"])),
                                        "level_rubrique": rubrique.level,
                                        "isUsed": (rubrique["collumnsDisabled"]["montant_ventile"] == false)
                                    });
                            }
                        }
                    }
                }
            }
        }
        app.log("ListeMontantsJustificatifsRubriques >>>", result);
        return result;
    }
    getRubriquesVentilatedJutificatif(document: any, dossierReglement: any, rubrique: any) {
        var isCurrentDdr = false;
        var disabledVentilation = true;
        var ddr = null;

        if (document != null) {
            if (document.dossiers_reglements.length > 0) {
                for (var dossier_reglement of document.dossiers_reglements) {
                    if (dossierReglement != null && dossier_reglement.persistenceId == dossierReglement.persistenceId) {
                        isCurrentDdr = true;
                        ddr = dossier_reglement;
                        break;
                    }
                }
                if (isCurrentDdr) {
                    for (var justificatif of ddr.justificatifs) {
                        for (var mjr of justificatif.montantsJustificatifRubrique) {
                            if (mjr.id_rubrique == rubrique.persistenceId && mjr.isUsed == true) {
                                disabledVentilation = false;
                            }
                        }
                    }
                }
            }
        }
        return disabledVentilation;
    }

    verifRavMontantAPayer() {
        if (this.rubriques != null && this.rubriques.length > 0) {
            for (var rubrique of this.rubriques) {
                if (app.convertStringToFloat(rubrique["montant_reste_a_verser_" + this.deviseDR]) < 0) {
                    return false;
                }
            }
        }
        return true;
    }
    verifravsRubriquesAR() {
        var valid = true;
        if (this.rubriquesAR != null && this.rubriquesAR.length > 0) {
            for (var rubrique of this.rubriquesAR) {
                if (this.checkMontantAPayer(rubrique)) {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }
    verifMntsARembourser(resteARembourser: any) {
        var sommeMnts = 0;
        var montantAPayerAR = 0;

        if (this.rubriquesAR != null && this.rubriquesAR.length > 0) {
            for (var rubrique of this.rubriquesAR) {
                if (rubrique.libelle == "Avance remboursable")
                    montantAPayerAR = app.convertStringToFloat(rubrique.montant_ventile);

                if (rubrique.level == "0")
                    sommeMnts += app.convertStringToFloat(rubrique.montant_a_rembourser);
            }

            if (app.isEmpty(resteARembourser)) {
                app.log("montantAPayerAR/sommeMnts > ", montantAPayerAR, sommeMnts);

                if (montantAPayerAR < sommeMnts)
                    return false;
            }
            else {
                app.log("resteARembourser/sommeMnts > ", resteARembourser, sommeMnts);

                if (resteARembourser < sommeMnts)
                    return false;
            }
        }
        return true;
    }
    verifSommesMntsRubVentileWithMntJustificatif(isAR: any, montantJustificatif: any) {
        var typeRubriques = (isAR) ? this.rubriquesAR : this.rubriques;
        var dc = app.getEltInArray(typeRubriques, "type", "DC");

        return (!this.isAvanceRemboursable) ? (dc != null && app.convertStringToFloat(dc["montant_ventile_" + this.deviseDR]) == app.convertStringToFloat(montantJustificatif)) : (dc != null && app.convertStringToFloat(dc["montant_ventile"]) == app.convertStringToFloat(montantJustificatif));
    }
    getMontantVentileJustif(isAR: any) {
        var typeRubriques = (isAR) ? this.rubriquesAR : this.rubriques;
        var dc = app.getEltInArray(typeRubriques, "type", "DC");

        return ((!isAR) ? app.convertStringToFloat(dc["montant_ventile_" + this.deviseDR]) : app.convertStringToFloat(dc["montant_ventile"]));
    }
    getMontantARembJustif() {
        var dc = app.getEltInArray(this.rubriquesAR, "type", "DC");

        return app.convertStringToFloat(dc["montant_a_rembourser"]);
    }
    getDcAndRubVentile(isAR: any, justificatifDeleted?: any) {
        if (this.isFirstDdrVentilatedRubs && isAR)
            justificatifDeleted = false;

        var typeRubriques = (isAR) ? this.rubriquesAR : this.rubriques;
        var dc = app.getEltInArray(typeRubriques, "type", "DC");
        var idAutreDevise = "";
        var rubriques = this.getMontantsRubriques(justificatifDeleted);

        if (!isAR)
            idAutreDevise = (this.deviseDR == this.dc.devise_afd ? "" : app.getEltInArray(this.dc.autre_devise, "devise", this.deviseDR).persistenceId);

        var montantEnregistre = justificatifDeleted ? this.getSommesRubLevel0(rubriques, "montant_enregistre") : app.convertStringToFloat(dc["montant_enregistre_" + this.deviseDR]);
        var resteAverser = app.convertStringToFloat(dc['montant_final_' + this.deviseDR]) - montantEnregistre;

        var resteAverserAR = app.convertStringToFloat(dc["montant_reste_a_verser"]) + (justificatifDeleted ? app.convertStringToFloat(dc["montant_ventile"]) : 0);

        return {
            "rubriques": rubriques,
            "montant_enregistre": !isAR ? montantEnregistre : (app.convertStringToFloat(dc["montant_final"]) - resteAverserAR),
            "montant_reste_a_verser": !isAR ? (justificatifDeleted ? resteAverser : app.convertStringToFloat(dc["montant_reste_a_verser_" + this.deviseDR])) : resteAverserAR,
            "persistence_id_autre_devise": idAutreDevise
        };
    }
    getSommesRubLevel0(listeRubriques: any, code: any) {
        var result = 0;
        if (listeRubriques.length > 0)
            for (var rub of listeRubriques)
                if (rub.level == '0')
                    result += rub[code];

        return result;
    }
    async checkRubriqueVentile(id: any) {
        if (!this.isJustificatifRemboursment) {
            var result = await app.getExternalData(app.getUrl('urlGetMontantJustificatifRubriqueById', id), 'page-checkRubriqueVentile > checkRubriqueVentile', true);
            if (app.isEmpty(result))
                return false;
            else
                return true;
        }
        return false;
    }
    async getSommeMntsVentileByRubriques(rub: any, ddr: any) {
        var justifs = await app.getExternalData(app.getUrl('urlGetJustificatifsByIdDdr', ddr.persistenceId), 'page-justificatifRemboursement > getSommeMntsVentileByRubriques');
        var sommeMontantsVentile = 0;

        if (justifs != null && justifs.length > 0) {
            for (var justificatif of justifs) {
                for (var mjr of justificatif.montantsJustificatifRubrique) {
                    if (mjr.id_rubrique == rub.persistenceId) {
                        sommeMontantsVentile += mjr.montant_ventile;
                        app.log("<< libelle de la rubrique >> sommeMontantsVentile >> ", rub.libelle_rubrique, app.convertStringToFloat(sommeMontantsVentile));
                    }
                }
            }
        }
        return app.convertStringToFloat(sommeMontantsVentile);
    }
    formatMontantRubriques() {
        // FORMATER LES MONTANTS
        var rubriquesResult = (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques);
        if (rubriquesResult.length > 0) {
            for (var index = 0; index < rubriquesResult.length; index++) {
                if (!rubriquesResult[index].deleted) {
                    for (var key of Object.keys(rubriquesResult[index])) {
                        if (key.includes("montant")) {
                            if (this.verifRubrique(rubriquesResult[index], key) || (this.readOnly && rubriquesResult[index][key] != '-')) {
                                rubriquesResult[index][key] = app.formatNumberWithDecimals(app.isEmpty(rubriquesResult[index][key]) ? '0' : app.convertStringToFloat(rubriquesResult[index][key]));
                            } else if (!this.readOnly)
                                rubriquesResult[index][key] = '';
                        }
                    }
                }
            }
        }

        return rubriquesResult;
    }
    verifRubrique(rubriqueVar: any, key: any) {
        //appliquer le formattage pour les rubriques meres + les colonnes disabled + DC => anomalie 2150
        return (!app.isEmpty(rubriqueVar.libelle) && rubriqueVar[key] != '-' &&
            ((app.isEmpty(rubriqueVar[key]) && !app.isEmpty(rubriqueVar["collumnsDisabled"]) &&
                rubriqueVar["collumnsDisabled"][key]) ||
                ((!app.isEmpty(rubriqueVar[key]) && !this.isVentilation) || (!app.isEmpty(rubriqueVar[key]) && rubriqueVar[key] > 0 && this.isVentilation)) ||
                (!app.isEmpty(rubriqueVar.type) && rubriqueVar.type == "DC") ||
                key.includes('montant_enregistre') || key.includes('montant_reste_a_verser')
            )
        );

    }
    getIndexRubrique(rubriquesVar: any, libelle: any) {
        for (var index = 0; index < rubriquesVar.length; index++) {
            if (rubriquesVar[index].libelle == libelle && !rubriquesVar[index].deleted) {
                return index;
            }
        }
        return -1;
    }

    setHasDuplicateDevise(value: any) {
        this.hasDuplicateDevise = value;
    }

    //verifeir si une ligne des rubriques est vide (libelle vide + tous les montants sont vides) = > anomalie 2134
    ckeckLibelleAndMontant() {
        var listRubriques = (this.isAvanceRemboursable ? this.rubriquesAR : this.rubriques);

        for (var rubrique of listRubriques) {
            var result = true;
            if (!rubrique.deleted) {
                for (var key of Object.keys(rubrique))
                    if ((key.includes("montant_final") && app.isEmpty(rubrique[key])) || (key == 'libelle' && app.isEmpty(rubrique[key])))
                        result = false;
                if (!result)
                    return false;
            }
        }
        return true;
    }

    getIndexRubriqueDeleted(list: any, rub: any) {
        for (var index = 0; index < list.length; index++)
            if (list[index].libelle == rub.libelle && !list[index].deleted)
                return index;

        return -1;
    }

    setIsJustifRembIntegral(value: any) {
        this.isJustifRembIntegral = value;
    }
}