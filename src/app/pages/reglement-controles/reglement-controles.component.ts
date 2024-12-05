import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Location, NgIf, NgClass, NgFor } from '@angular/common';
import { ModalComponent  } from '../../components/modal/modal.component';
import { ExportPdfControleComponent  } from '../../components/export-pdf-controle/export-pdf-controle.component';
import { ExportPdfBanComponent } from '../../components/export-pdf-ban/export-pdf-ban.component';
import { NotificationComponent  } from '../../components/notification/notification.component';
import { InfosReglementComponent  } from '../../components/infos-reglement/infos-reglement.component';
import { InfosAvanceComponent  } from '../../components/infos-avance/infos-avance.component';
import { ControlesComponent  } from '../../components/controles/controles.component';
import { TableComponent  } from '../../components/table/table.component';
import { InfosVersementComponent  } from '../../components/infos-versement/infos-versement.component';
import { InfosDossierComponent  } from '../../components/infos-dossier/infos-dossier.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent  } from '../../components/btn/btn.component';
import { BtnMenuComponent } from '../../components/btnMenu/btnMenu.component';
import { FormsModule } from '@angular/forms';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';

declare const app: any;
declare const urls: any;
declare const actions: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;
declare const $: any;
declare const refs: any;

@Component({
    selector: 'app-reglement-controles',
    templateUrl: './reglement-controles.component.html',
    standalone: true,
    imports: [NavActionsComponent, NgIf, FormsModule, BtnMenuComponent, BtnComponent, ContentComponent, NgClass, CardComponent, InfosContextComponent, SpinnerComponent,
         InfosDossierComponent, InfosVersementComponent, TableComponent, NgFor, ControlesComponent, InfosAvanceComponent, InfosReglementComponent, NotificationComponent, ExportPdfBanComponent, 
         ExportPdfControleComponent, ModalComponent]
})
export class ReglementControlesComponent implements OnInit {

    @ViewChild('btnSaveControles') btnSaveControles!: BtnComponent;
    @ViewChild('btnRemboursement') btnRemboursement!: BtnComponent;
    @ViewChild('reglementControles') reglementControles!: ControlesComponent;
    @ViewChild('detailsReglement') detailsReglement!: InfosReglementComponent;
    @ViewChild('detailsVersement') detailsVersement!: InfosVersementComponent;
    @ViewChild('tableVersements') tableVersements!: TableComponent;
    @ViewChild('tableReglements') tableReglements!: TableComponent;
    @ViewChild('notification') notification!: NotificationComponent;
    @ViewChild('infosDossier') infosDossier!: InfosDossierComponent;
    @ViewChild('btnAnnulerDossier') btnAnnulerDossier!: BtnComponent;
    @ViewChild('btnHistoriqueDossierAbandonne') btnHistoriqueDossierAbandonne!: BtnComponent;
    @ViewChild('infosAvance') infosAvance!: InfosAvanceComponent;
    @ViewChild('tableAnomalies') tableAnomalies!: TableComponent;
    @ViewChild('exportBan') exportBan!: ExportPdfBanComponent;
    @ViewChild('exportControleSecondNiveau') exportControleSecondNiveau!: ExportPdfControleComponent;
    @ViewChild('modalConfirmDdrDefinitif') modalConfirmDdrDefinitif!: ModalComponent;
    @ViewChild('modalConfirmationAddJustificatifRemboursement') modalConfirmationAddJustificatifRemboursement!: ModalComponent;
    @ViewChild('btnSaveDdrDefinif') btnSaveDdrDefinif!: BtnComponent;
    @ViewChild('btnExportFicheBan') btnExportFicheBan!: BtnComponent;

    newTab: any;
    disableRemboursement: boolean = false;
    id: any;
    reglement: any;
    entite: any;
    role: any;
    tache: any;
    read: boolean = true;
    readDdrDefinitif: boolean = false;
    errorMessage: any;
    statut: string = '';
    step: any;
    versement: any = null;
    enableEdite: boolean = false;
    showBeneficiaire: boolean = false;
    autresDevises: any;
    showBeneficiaireReglement: boolean = false;
    showBeneficiaireVersement: boolean = false;
    showConcours: boolean = false;
    showReglement: boolean = false;
    isDefinitifDDR: boolean = false;
    showModal: boolean = false;
    isDCV: boolean = false;
    app: any = app;
    lang: any = lang;
    commentsDeployed: boolean = false;
    switchToggleComments: boolean = false;
    showSidebar: boolean = true;
    countControlesChecked: any;
    countControlesTotal: any;
    themesControles: any;
    criteres: any;
    reglements: any;
    concoursUsed: boolean = false;
    flagAvenant: boolean = false;
    anomalies: any = [];
    ControleParThemes: any;
    isAFD: boolean = false;
    ControleGroupeParPC: any;
    loading: boolean = true;
    notifications: any;
    concoursSIOP: any;
    isNotDdrDef: boolean = true;
    dateSaisieDdrDef: any = null;
    caseId: any = null;
    refCodesDdrValide: any = refs['refCodesDdrValide'];
    refCodesDossierValide2ndNiv: any = refs['refCodesDossierValide2ndNiv'];

    constructor(private router: Router, private route: ActivatedRoute, public store: StoreService, private location: Location) { }

    ngOnInit() {
        this.loading = true;

        this.entite = this.store.getUserEntite();
        this.isDCV = app.isDCV(this.entite, this.store.getUserPerimetre());
        this.isAFD = app.isAFD(this.entite);

        if (app.isAuditeur(this.store.getUserRole()))
            this.disableRemboursement = true;

        app.setCurrentCmp('controles', this);
    }

    async ngAfterViewInit() {
        await this.getReglement();

        if (this.isDCV)
            await this.getAnomalies();
    }

    get actions() {
        var results = [];
        for (var action of actions['reglement'])
            if (app.existStringInArray(action.steps, this.step))
                results.push(action);

        return results;
    }

    get titleSidebarToggle() {
        return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
    }

    async validerControles() {
        var controles = await this.reglementControles.saveControles(true);

        return !(controles == null);
    }

    async autoSave() {
        if (this.reglementControles.updatedValue) {
            app.showToast('toastControlesAutoSave');

            await app.sleep(5000);

            await this.validerTache(false, false);
        }
    }

    async validerTache(validate: any, DO?: any, showModal?: any, verifControle?: any) {
        //verification si la tache est active, avant l'execution
        var active = await app.isActiveTask(this.caseId, this.store.getUserId());
        if (!active) {
            app.showToast('toastControlesNotActiveTaskError');
            if (validate && this.notification != null) {
                this.notification.setLoadingBtn();
                this.notification.hideModal();
            } else
                this.btnSaveControles.setLoading(false);
            return;
        }

        var controles = await this.reglementControles.saveControles(verifControle);

        if (controles == null) {
            this.btnSaveControles.setLoading(false);
            return;
        }

        app.log('page-reglement-controles > validerTache - controles, rootDoControles', controles, app.getRootDO('controles'));

        await app.saveFormData(app.getRootDO('controles'), null, urls['urlProcessInstanciation'], urls['urlProcessUpdateControles']);

        if (validate) {
            if (this.isDCV)
                DO[app.getFirstJsonKey(DO)].decision = '';

            await app.sleep(1000);

            await app.assignTache(this.tache.id, this.store.getUserId());

            await app.sleep(1000);

            await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), DO);

            await app.sleep(1000);

            if (app.isDirecteur(this.role) && DO.decision == "")
                await this.validerReglement();

            this.notification.setLoadingBtn();
            this.notification.hideModal();

            //afficher le taost de confirmation indiquant que le dossier a �t� bien transmis
            if (app.isEmpty(DO.decision)) {
                if (!this.isDCV) {
                    if (app.isAgentVersement(this.role))
                        app.showToast('toastReglementValideAgentVersement');
                    else if (app.isChargeProjet(this.role))
                        app.showToast('toastReglementValideChargeProjet');
                    else if (app.isDirecteur(this.role))
                        app.showToast('toastReglementValideDir');
                    else
                        app.showToast('toastReglementValideDir');
                }
                else
                    app.showToast('toastReglementValideDCV');
                // message toastReglementValideDCV dont le role n'est pas (AV/CP/DIR) => DCV
            }
            else {
                if (DO.decision == "RETOUR_AV")
                    app.showToast('toastReglementRenvoiAgent');
                else
                    app.showToast('toastReglementRenvoiChargeProjet');
            }

            await app.sleep(4000);

            app.redirect(this.router, app.getUrl('urlGotoTaches'));
        } else {
            this.btnSaveControles.setLoading(false);
            if (this.isDCV)
                await this.getReglement();

            this.notification.setLoadingBtn();
            this.notification.hideModal();

            app.showToast('toastControlesSave');
        }

        //AVANCE-FIGEE
        if (this.infosAvance && this.reglement.id_avance_contractuel != null)
            await this.infosAvance.getAvance(this.reglement.id_avance_contractuel, this.entite, this.versement.persistenceId, (this.reglement != null ? this.reglement.persistenceId : null));

        //capture(add) Avance Figee
        //si role agent de versement ou charge d'appui => save copy => faire photo (si y a des AR entre les autres agents la photo ne change jamais mais si elle est retourn� )
        if (this.reglement.id_avance_contractuel != null && (app.isAgentVersement(this.role) || app.isChargeAppui(this.role))) {
            var avanceFigeeDO = app.getDO('avanceFigee');
            avanceFigeeDO.id_avance_contractuel = this.reglement.id_avance_contractuel;
            avanceFigeeDO.reste_justifier_decaisser_dossier_copy = (!this.infosAvance.acRepris ? this.infosAvance.resteJustifierDecaisserDossier : 0);
            avanceFigeeDO.reste_justifier_copy = this.infosAvance.resteJustifier;
            avanceFigeeDO.montant_total_justificatifs_avance_copy = this.infosAvance.montantTotalJustificatifsAvance;
            avanceFigeeDO.montant_verse_total_copy = this.infosAvance.montantVerseTotal;
            if (this.reglement != null)
                avanceFigeeDO.id_dossier_reglement = this.reglement.persistenceId;

            // Assuming you have the JSON array in a variable named 'justificatifsAvanceFigee'
            const justificatifsAvanceFigee = this.infosAvance.avanceContractuel.justificatifsAvance;

            // Create a new array by mapping the specified fields from 'justificatifsAvanceFigee'
            const justificatifsAvanceFigeeCopy = justificatifsAvanceFigee.map((item: any) => ({
                "persistenceIdNum": item.persistenceId,
                "date_creation": item.date_creation,
                "montant_finance_afd": item.montant_finance_afd,
                "montant_justifie": item.montant_justifie,
                "lien_rom": item.lien_rom,
                "devise": item.devise
            }));

            // Now, you can add the 'justificatifs_avance_figee' array to 'avanceFigeeDO'
            avanceFigeeDO.justificatifs_avance_figee = justificatifsAvanceFigeeCopy;

            await app.saveFormData(app.getRootDO('avanceFigee'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessGererAvanceFigee'));

            await app.getExternalData(app.getUrl('urlGetAvanceFigeeByIdDrAndIdAvance', this.reglement.persistenceId, this.infosAvance.avanceContractuel.persistenceId), true);
        }
    }

    async annulerTache() {
        var originGotoDDR = app.getStorageItem('originGoto');

        if (originGotoDDR != null && originGotoDDR == 'projet') {
            app.setStorageItem('originGoto', '');

            app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'DDR'));
        } else
            this.location.back();
    }

    async getReglement() {
        console.time('reglement-controles');

        this.loading = true;

        this.newTab = (this.router.url.indexOf('newTab') != -1);
        // this.forcedToLvl1 = (this.router.url.indexOf('fLvl1') != -1) || this.isDCV;

        this.id = this.route.snapshot.paramMap.get('id');

        this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.id), 'page-reglement-controles > getReglement', true);

        if (await app.getPageError(this.reglement.numero_projet)) {
            this.versement = await app.getExternalData(app.getUrl('urlGetVersementByNumero', this.reglement.numero_dossier_versement), 'page-reglement-controles > getVersement', true);

            this.versement.canceled = (app.isDossierAnnule(this.versement.code_statut_dossier) ? true : false);
            this.reglement.canceled = (app.isDossierAnnule(this.reglement.code_statut_dossier) ? true : false);

            this.criteres = await app.getExternalData(app.getUrl('urlGetCriteresRisqueByDDR', this.reglement.persistenceId), 'page-reglement-controles > getCriteres');

            var caseId = this.reglement.case_id;

            this.notifications = await app.getExternalData(app.getUrl('urlGetNotifications2NdNiv', this.reglement.case_id_2nd_niv));

            //detection du mode DCV niveau 1 ou niveau 2
            var secondToFirstLevel = false;
            if (this.isDCV) {
                this.disableRemboursement = true;

                //verifier que le concours a été déja utilisé dans un autre controle
                var countConcoursUsed = await app.getExternalData(app.getUrl('urlGetCountConcoursBdm', this.reglement.numero_concours, this.reglement.case_id_2nd_niv), 'page-reglement-controles > getCountConcoursBdm', true);

                if (countConcoursUsed != 0)
                    this.concoursUsed = true;

                var concoursBdm = await app.getExternalData(app.getUrl('urlGetConcoursBdm', this.reglement.numero_concours), 'page-reglement-controles > getConcoursBdm', true);

                if (concoursBdm != null && concoursBdm.flg_avenant)
                    this.flagAvenant = true;

                if (this.reglement.case_id_2nd_niv != null && this.router.url.indexOf('fLvl1') == -1)
                    caseId = this.reglement.case_id_2nd_niv;
                else {
                    this.isDCV = false;
                    secondToFirstLevel = true;
                }
            }

            this.read = await app.isReadTask(this, caseId, this.store.getUserId());
            this.caseId = caseId;

            //recuperer le role qui est dans la description de la tache
            if (!app.isEmpty(this.tache))
                this.role = app.getRoleTache(this.tache);

            this.step = app.getEtapeTache(this.tache);

            //fusionner les données de concours SIOP/GCF avec celles de reglements
            if (!this.isDCV || (this.isDCV && secondToFirstLevel))
                await this.getReglements();

            //si acces DCV niveau 1, on force en mode niveau 1
            await app.sleep(50);
            if (secondToFirstLevel)
                this.reglementControles.isDCV = false;

            await this.reglementControles.loadControles(caseId, this.tache);

            //deploiement des commentaires automatique si acces DCV niveau 1
            if (secondToFirstLevel) {
                this.toggleComments();
                this.switchToggleComments = true;
            }

            this.isDefinitifDDR = ((this.reglement.code_statut_dossier == 'DDR5' || this.reglement.code_statut_dossier == 'DDR5B' || this.reglement.code_statut_dossier == 'DDR14' || this.reglement.code_statut_dossier == 'DDR7' || this.reglement.code_statut_dossier == 'DDR8'));

            if (app.isAFD(this.entite)) {
                var montantDDRDef = appFormio.getDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'montant_definitif');

                this.readDdrDefinitif = (((this.reglement.montant_definitif_reglement != null || montantDDRDef != null) && (this.reglement.code_statut_dossier == 'DDR7' || this.reglement.code_statut_dossier == 'DDR8')) || !app.isAgentVersement(this.role));

                await app.sleep(500); //TODO : à enlever et faire differement , on peut pas rajouter une demi seconde dans le vent comme ca 

                appFormio.loadFormIO('reglementDefinitifAFD', this.readDdrDefinitif);

                await app.sleep(250);

                if (this.readDdrDefinitif) {
                    appFormio.setDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'devise_concours', app.isEmpty(this.reglement.date_paiement) ? this.reglement.devise_reglement : this.reglement.devise_paiement);
                    appFormio.setDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'montant_definitif', app.formatNumberWithDecimals(this.reglement.montant_definitif_reglement));
                    appFormio.setDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'date_valeur', this.reglement.date_paiement);
                } else {
                    appFormio.setDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'devise_concours', this.reglement.devise_reglement);
                    appFormio.setDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'montant_definitif', this.reglement.montant_definitif_reglement); //ligne en commun pk la dupliquer??
                    appFormio.setDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'date_valeur', this.reglement.date_paiement);//ligne en commun pk la dupliquer??
                }
            }

            this.loading = false;

            await app.sleep(50);
            if (secondToFirstLevel)
                this.infosDossier.isDCV = false;
        }
        console.timeEnd('reglement-controles');
    }

    async getReglements() {
        this.reglements = await app.mergeDataConcoursWithDDRs([this.reglement], this.versement.numero_projet);

        await app.sleep(100);

        this.tableReglements.getItems();
    }

    async executeAction(action: any) {
        if (action == 'DR')
            this.showValiderReglement();
        else if (action == 'RETOUR' || action == 'ANNULER_DR') {
            var DO = app.getDO('reglementTacheInput');
            DO.decision = action;

            await app.assignTache(this.tache.id, this.store.getUserId());

            await app.sleep(1000);

            await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), app.getRootDO('reglementTacheInput'));

            app.redirect(this.router, urls['urlGotoTaches']);
        }
    }

    async gotoReglement(item: any) {
        var update = !this.read && !this.isDCV && app.isAgentVersement(this.role) && !app.isAfterValidByDirecteurDdr(item);

        if (update)
            await this.autoSave();

        this.showReglement = true;

        await app.sleep(150);

        await this.detailsReglement.gotoReglement(item, this.versement, update);

        this.tableReglements.setClickInProgress(false);
    }

    async getAutresDevises() {
        await this.detailsVersement.getAutresDevises();
    }

    async getBeneficiaireVersement() {
        await this.detailsVersement.getBeneficiaire();
    }

    async showValiderReglement() {
        this.showModal = true;

        await app.sleep(100);

        app.showModal('modalValiderReglement');
    }

    async validerReglement() {
        app.mapDO(app.getDO('reglementPDFInput'), this.reglement);

        var DO = app.getRootDO('reglementPDFInput');
        DO.statut = "";

        await app.generateFile(DO, 'urlProcessExportPdfDDR', false);

        if (!this.isDCV) {
            this.tableReglements.setUrlParam(this.versement.numero_dossier_versement);
            this.tableReglements.getItems();
        }
    }

    async downloadFile(reglement: any) {
        await app.downloadDocument(reglement, true);
    }

    toggleComments() {
        var controles = this.reglementControles.controles;

        if (controles != null) {
            for (var i = 0; i < controles.length; i++) {
                if (!this.commentsDeployed)
                    app.showCollapse('collapseControleComment-' + i);
                else
                    app.hideCollapse('collapseControleComment-' + i);
            }

            this.commentsDeployed = !this.commentsDeployed;
        }
    }

    async annulerDossier(DONotification?: any) {
        await app.assignTache(this.tache.id, this.store.getUserId());

        await app.sleep(1000);

        var codeStatut = await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), DONotification);

        //anomalie NEWV-2993
		app.resetRootDO('notification');

        if (codeStatut) {
            this.notification.setLoadingBtn();
            this.notification.hideModal();

            if (!this.isDCV)
                app.showToast('toastReglementAnnulerOk');
            else
                app.showToast('toastReglementDCVAnnulerOk');

            await app.sleep(500);

            await this.getReglement();

            await this.infosDossier.getNotifications();

            await this.infosDossier.updateDossier(this.reglement);
        }
        else
            app.showToast('toastReglementAnnulerKo');
    }

    annulerAction(action: any) {
        if (action == '-1')
            this.btnAnnulerDossier.setLoading(false);
    }

    async validerTacheDir() {
        var isControlesOk = true;

        if (app.isDirecteur(this.role)) {
            var valideControle = await this.validerControles();
            if (!valideControle) {
                this.btnSaveControles.setLoading(false);
                return;
            }

            for (var controle of this.reglementControles.controles) {
                var valueControle = controle.value;
                if (valueControle == '0' && controle.show)
                    isControlesOk = false;
            }
        }

        await this.notification.validerTache(isControlesOk);
    }

    async getAnomalies() {
        this.anomalies = await app.getExternalData(app.getUrl('urlGetAllAnomaliesByCaseIdDossier', this.reglement.case_id_2nd_niv), 'page > historique-dossiers > getAnomaliesByDC');

        if (this.anomalies != null && this.anomalies.length > 0)
            for (var ano of this.anomalies)
                ano.acteur2ndNiveau = ano.name_controleur2nd;

        await app.sleep(100);

        this.tableAnomalies.getItems();
    }

    async gotoAnomalie(item: any) {
        app.redirect(this.router, app.getUrl('urlGotoHistoriqueAnomalie', item.persistenceId));
    }

    async exportBanToPDF() {
        let listeControl: any[] = [];
        var table: any[] = [];

        if (Array.isArray(this.reglementControles.controles))
            for (var element of this.reglementControles.controles)
                listeControl.push(element);

        for (var element of listeControl) {
            const existing_element = table.findIndex((mergedAgent) => mergedAgent.code === element.code);

            if (existing_element === -1)
                table.push(element);
            else
                table[existing_element] = { ...table[existing_element], [element.type]: element.value };
        }

        for (var element of table)
            element[element.type] = element.value;

        // On récupère les commentaires
        for (let i = 0; i < table.length; i++) {
            var commentaire = await app.getExternalData(app.getUrl('urlGetCommentaires', table[i].firstStepPersistenceId));

            table[i].commentaire = [];

            if (commentaire.length > 0) {
                for (let j = 0; j < commentaire.length; j++) {
                    if (commentaire[j].commentaireAnnule === false) {
                        commentaire[j].roleCommentaire = app.getRefLabel('refRoles', commentaire[j].roleCommentaire);
                        table[i].commentaire[j] = commentaire[j];
                    }
                }
            }
        }

        // Trie du tableau par thématique 
        table = table.filter(element => element.codeTheme !== null);
        // table.sort((a, b) => (a.codeTheme > b.codeTheme) ? 1 : -1);

        app.sortBy(table, [
            { key: 'codeTheme', order: 'asc' },
            { key: 'ordre', order: 'asc' },
            { key: 'libelle', order: 'asc' }
        ]);

        // Regroupement controles par thématique
        this.ControleParThemes = {};
        for (let element of table) {
            if (!(element.codeTheme in this.ControleParThemes)) {
                this.ControleParThemes[element.codeTheme] = [];
            }
            this.ControleParThemes[element.codeTheme].push(element);
        }

        // On récupère le le libellé de la l'émetteur de la DV du bénéficiaire de la DV ainsi la modalité de paiement
        this.versement.emetteurDV = app.getRefLabel('refBeneficiaires', this.versement.id_emetteur_demande, true);
        this.reglement.beneficiaireVersement = app.getRefLabel('refBeneficiaires', this.reglement.id_beneficiaire_reglement, true);
        this.versement.modalitePaiement = app.getRefLabel('refModalitesPaiement', this.versement.modalite_paiement, true);
        this.exportBan.generate(table, this.reglement, this.versement, this.ControleParThemes, this.isAFD);

        this.btnExportFicheBan.setLoading(false);
    }

    async exportControleToPDF() {
        let listeDesControl: any[] = [];

        if (Array.isArray(this.reglementControles.controles))
            for (var element of this.reglementControles.controles)
                listeDesControl.push(element);

        // On rajoute les commentaires assocés à un point de controle PC = point de controle
        for (let i = 0; i < listeDesControl.length; i++) {
            if (listeDesControl[i].parentCode != "") {
                var commentaire = await app.getExternalData(app.getUrl('urlGetCommentaires', listeDesControl[i].firstStepPersistenceId));

                listeDesControl[i].commentaire = null;

                if (commentaire.length > 0)
                    for (let j = 0; j < commentaire.length; j++)
                        if (commentaire[j].commentaireAnnule === false)
                            listeDesControl[i].commentaire = commentaire[j];
            }

            //si le controle est OK alors on supprime le commentaire de l'anomalie
            if ((listeDesControl[i].value == "1" || listeDesControl[i].value == "-1") && listeDesControl[i].anomalies.length > 0)
                for (let ano of listeDesControl[i].anomalies)
                    ano.commentaire = null;
        }

        this.ControleGroupeParPC = {};
        for (let element of listeDesControl) {
            if (!(element.parentCode in this.ControleGroupeParPC))
                this.ControleGroupeParPC[element.parentCode] = [];

            this.ControleGroupeParPC[element.parentCode].push(element);
        }

        // Afficher le tableau de codes uniques
        this.exportControleSecondNiveau.generate(this.reglement, this.ControleGroupeParPC, listeDesControl);
    }

    //verifier que le dossier de reglement est en status paiement confirmé
    ddrIsValide() {
        return (!app.isEmpty(this.reglement) && !this.isDCV && !app.isDossierAnnule(this.reglement.code_statut_dossier) && this.refCodesDdrValide.includes(this.reglement.code_statut_dossier));
    }
    verifExportDdrNiv2() {
        return (this.reglement != null && this.isDCV && this.reglement.code_statut_dossier_2nd != null && this.refCodesDossierValide2ndNiv.includes(this.reglement.code_statut_dossier_2nd));
    }
    showNotifAbandonDossierNiv2() {
        return (this.reglement != null && this.reglement.code_statut_dossier_2nd != null && this.isDCV && app.isDossierAnnule(this.reglement.code_statut_dossier_2nd));
    }
    historiqueDossierAbandonne() {
        app.showModal('modalHistoriqueDossierAbandonne' + this.reglement.persistenceId);

        this.btnHistoriqueDossierAbandonne.setLoading(false);
    }

    async verifDDRDefinitif() {
        this.btnSaveDdrDefinif.setLoading(false);

        if (!app.isValidForm('formio_reglementDefinitifAFD')) {
            app.showToast('toastErrorSaveDdrDefinitif');
            return;
        } else
            app.showModal('modalConfirmDdrDefinitif');
    }

    cancelValidateDdrDefinitif() {
        app.hideModal('modalConfirmDdrDefinitif');
    }

    async validateDdrDefinitif() {
        var response = await app.getExternalData(app.getUrl('urlGetTaskByParentCaseId', this.reglement.case_id));

        var DO = app.getDO('reglementDefinitif');
        DO.date_paiement = appFormio.getDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'date_valeur');
        DO.montant_definitif_reglement = appFormio.getDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'montant_definitif');
        DO.devise_paiement = appFormio.getDataValue(crossVars.forms['formio_reglementDefinitifAFD'], 'devise_concours');

        this.dateSaisieDdrDef = app.formatDate(this.reglement.date_modification);

        app.log('modal-infos-reglement > DDR -Definitif > DO ', DO);

        if (response[0] != null && (response[0].assigned_id == '' || response[0].assigned_id == this.store.getUserId()))
            await app.assignTache(response[0].id, this.store.getUserId());

        await app.sleep(1000);

        await app.setExternalData(app.getUrl('urlTaskExecute', response[0].id), app.getRootDO('reglementDefinitif'));

        app.hideModal('modalConfirmDdrDefinitif');

        await app.sleep(100);

        app.hideModal('detailsDemandeReglement');

        await app.sleep(1000);

        this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.reglement.persistenceId), 'page-reglement-controles > validateDdrDefinitif', true);

        await this.getReglement();
    }

    async confirmAddJustifRemboursement() {
        app.showModal('modalConfirmationAddJustificatifRemboursement');

        this.btnRemboursement.setLoading(false);
    }
    async addJustificatifRemboursement() {
        app.setStorageItem('idReglement', this.reglement.persistenceId);

        app.hideModal('modalConfirmationAddJustificatifRemboursement');

        var DOReg = app.getDO('remboursement');
        DOReg.persistenceId = this.reglement.persistenceId;

        var caseObject = await app.saveFormData(app.getRootDO('remboursement'), null, urls['urlProcessInstanciation'], urls['urlProcessGererJustificatifRemboursement']);

        await app.sleep(200);

        var caseInfo = await app.getExternalData(app.getUrl('urlGetCasePROPARCO', caseObject.caseId), 'page-reglement-controles -> addJustificatifRemboursement - caseInfo', true);
        var caseId = caseInfo.id;

        await app.sleep(200);

        var tacheGererRemboursement = await app.getExternalData(app.getUrl('urlGetTaskByCaseId', caseId), 'page-reglement-controles > addJustificatifRemboursement > getHumanTask', true);

        if (!Array.isArray(tacheGererRemboursement) && tacheGererRemboursement != null)
            app.redirect(this.router, app.getUrl('urlAddJustficatifRemboursement', this.reglement.persistenceId));
    }

    showBtnMenu() {
        if (!app.isEmpty(this.reglement)) {
            return (
                (!app.isEmpty(this.tache) && !app.taskIsMisePaiement(this.tache)) ||
                this.ddrIsValide() ||
                this.verifExportDdrNiv2() || this.showNotifAbandonDossierNiv2() ||
                (app.enableShowBtnRemboursement(this.reglement) && !this.isDCV)
            );
        }
        return false;
    }
}