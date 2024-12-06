import { Component, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { InfosCoordonneBancaireComponent } from '../../components/infos-coordonnee-bancaire/infos-coordonnee-bancaire.component';
import { InfosAvanceComponent } from '../../components/infos-avance/infos-avance.component';
import { SelectBeneficiaireComponent } from '../../components/select-beneficiaire/select-beneficiaire.component';
import { InfosDcComponent } from '../../components/infos-dc/infos-dc.component';
import { TableComponent  } from '../../components/table/table.component';
import { InfosBeneficiaireComponent } from '../../components/infos-beneficiaire/infos-beneficiaire.component';
import { RubriquesComponent } from '../../components/rubriques/rubriques.component';
import { TeleportComponent } from '../../components/teleport/teleport.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { InfosVersementComponent  } from '../../components/infos-versement/infos-versement.component';
import { InfosDossierComponent  } from '../../components/infos-dossier/infos-dossier.component';
import { InfosContextComponent  } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnMenuComponent } from '../../components/btnMenu/btnMenu.component';
import { NgClass } from '@angular/common';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';

declare const $: any;
declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const urls: any;
declare const tachesRedirect: any;
declare const lang: any;
declare const formFields: any;
declare const refs: any;

@Component({
    selector: 'app-reglement',
    templateUrl: './reglement.component.html',
    standalone: true,
    imports: [NavActionsComponent, BtnComponent, BtnMenuComponent, ContentComponent, SpinnerComponent, NgClass, CardComponent, InfosContextComponent, InfosDossierComponent, InfosVersementComponent, NotificationComponent, ModalComponent, FormsModule, TeleportComponent, RubriquesComponent, InfosBeneficiaireComponent, TableComponent, InfosDcComponent, SelectBeneficiaireComponent, InfosAvanceComponent, InfosCoordonneBancaireComponent]
})
export class ReglementComponent implements OnInit {

	readonly btnSaveReglement = viewChild.required<BtnComponent>('btnSaveReglement');
	readonly btnValidateTache = viewChild.required<BtnComponent>('btnValidateTache');
	readonly tableReglements = viewChild.required<TableComponent>('tableReglements');
	readonly tableVersements = viewChild.required<TableComponent>('tableVersements');
	readonly saveDocument = viewChild.required<ModalComponent>('saveDocument');
	readonly infosContext = viewChild.required<InfosContextComponent>('infosContext');
	readonly beneficiairePrimaire = viewChild.required<InfosBeneficiaireComponent>('beneficiairePrimaire');
	readonly teleportBeneficiairePrimaire = viewChild.required<TeleportComponent>('teleportBeneficiairePrimaire');
	readonly tableRubriquesDC = viewChild.required<TableComponent>('tableRubriquesDC');
	readonly tableJustificatifsReglement = viewChild.required<TableComponent>('tableJustificatifsReglement');
	readonly tableFournisseur = viewChild.required<TableComponent>('tableFournisseur');
	readonly detailsVersement = viewChild.required<InfosVersementComponent>('detailsVersement');
	readonly infosAvance = viewChild.required<InfosAvanceComponent>('infosAvance');
	readonly teleportFournisseur = viewChild.required<TeleportComponent>('teleportFournisseur');
	readonly teleportAvance = viewChild.required<TeleportComponent>('teleportAvance');
	readonly teleportNombreDC = viewChild.required<TeleportComponent>('teleportNombreDC');
	readonly teleportDC = viewChild.required<TeleportComponent>('teleportDC');
	readonly teleportAR = viewChild.required<TeleportComponent>('teleportAR');
	readonly teleportJustificatifReglement = viewChild.required<TeleportComponent>('teleportJustificatifReglement');
	readonly teleportRubriques = viewChild.required<TeleportComponent>('teleportRubriques');
	readonly teleportDetailAvanceContractuel = viewChild.required<TeleportComponent>('teleportDetailAvanceContractuel');
	readonly saveJustificatif = viewChild.required<ModalComponent>('saveJustificatif');
	readonly teleportDcJustificatif = viewChild.required<TeleportComponent>('teleportDcJustificatif');
	readonly teleportDerniereDFT = viewChild.required<TeleportComponent>('teleportDerniereDFT');
	readonly modalConfirmationAddJustificatifReglement = viewChild.required<ModalComponent>('modalConfirmationAddJustificatifReglement');
	readonly btnReturn = viewChild.required<BtnComponent>('btnReturn');
	readonly infosVersement = viewChild.required<InfosVersementComponent>('infosVersement');
	readonly notification = viewChild.required<NotificationComponent>('notification');
	readonly modalDeleteJustificatifReglement = viewChild.required<ModalComponent>('modalDeleteJustificatifReglement');
	readonly modalMessagePaysExecution = viewChild.required<ModalComponent>('modalMessagePaysExecution');
	readonly teleportContrevaleur = viewChild.required<TeleportComponent>('teleportContrevaleur');
	readonly teleportEquivalent = viewChild.required<TeleportComponent>('teleportEquivalent');
	readonly teleportDetailsCoordonneeBancaire = viewChild.required<TeleportComponent>('teleportDetailsCoordonneeBancaire');
	readonly teleportDevisesReglement = viewChild.required<TeleportComponent>('teleportDevisesReglement');
	readonly infosDossier = viewChild.required<InfosDossierComponent>('infosDossier');
	readonly btnAnnulerDossier = viewChild.required<BtnComponent>('btnAnnulerDossier');
	readonly infosCoordonneeBancaire = viewChild.required<InfosCoordonneBancaireComponent>('infosCoordonneeBancaire');
	//Tiers-reglement
	readonly selectbeneficaire = viewChild.required<SelectBeneficiaireComponent>('selectbeneficaire');
	readonly infosBeneficiaireReglement = viewChild.required<InfosBeneficiaireComponent>('infosBeneficiaireReglement');
	readonly teleportBeneficiaireReglement = viewChild.required<TeleportComponent>('teleportBeneficiaireReglement');
	readonly teleportSelectBeneficiareReglement = viewChild.required<TeleportComponent>('teleportSelectBeneficiareReglement');
	//Emetteur-justificatif
	readonly selectEmetteur = viewChild.required<SelectBeneficiaireComponent>('selectEmetteur');
	readonly infosEmetteurJustificatif = viewChild.required<InfosBeneficiaireComponent>('infosEmetteurJustificatif');
	readonly teleportEmetteurJustificatif = viewChild.required<TeleportComponent>('teleportEmetteurJustificatif');
	readonly teleportSelectEmetteurJustificatif = viewChild.required<TeleportComponent>('teleportSelectEmetteurJustificatif');
	readonly teleportEmetteurJustificatifDC = viewChild.required<TeleportComponent>('teleportEmetteurJustificatifDC');
	readonly rubriquesComponent = viewChild.required<RubriquesComponent>('rubriquesComponent');
	readonly teleportSelectAvance = viewChild.required<TeleportComponent>('teleportSelectAvance');
	readonly infosDc = viewChild.required<InfosDcComponent>('infosDc');

	loading: boolean = true;
	isLoading: boolean = false;
	loadingJustificatif: boolean = false;
	reglement: any = null;
	versement: any = null;
	concours: any;
	newConcours: any;
	tache: any;
	persistenceId: any;
	caseId: any = null;
	entite: string = '';
	step: any;
	read: boolean = false;
	statut: string = '';
	documentsContractuel: any = [];
	enableEdite: boolean = false;
	showFournisseur: boolean = false;
	checkPaysExecution: boolean = true;
	autresDevises: any;
	showConcours: boolean = false;
	typeDateConcours: string = 'dateConcours';
	typeProduitFinancier: string = 'produitFinancierReversement';
	beneficiairePrim: any = null;
	persistenceIDReglement: any = null;
	etapeTache: any;
	documentContractuel: any;
	isAR: boolean = false;
	showTypeAvance: boolean = false;
	idAvanceContractuel: any;
	nbrDocumentContractuel: any = null;
	libelleProjet: any;
	detailDocumentContractuel: any = null;
	showJustificatifsReglement: any = false;
	justificatifsReglement: any = [];
	role: any;
	app: any = app;
	rubriquesDC: any = [];
	showRubriquesDC: any = false;
	emetteurJustificatif: any = null;
	justificatifUpdate: any = null;
	avancesContractuel: any = null;
	avanceContractuel: any = null;
	infosDcJustificatif: any = null;
	lang: any = lang;
	montantNewDDR: any = 0;
	arInitiale: any = 0;
	rembEffectuee: any = 0;
	resteARembourser: any = 0;
	projet: any;
	toggleDeviseReglement: string = '';
	toggleMontantReglement: string = '';
	toggleAutreDeviseReglement: string = '';
	dft: any = null;
	typeRubrique: any = 'rubriquesDC';
	saisieSousObjets: any = '';
	identifiantBeneficiaire: any = '';
	formFields: any = formFields;
	currentItem: any;
	justificatifReglementLabel: string = '';
	titleModalConfirmSuppressionJustificatif: string = '';
	justificatifReglement: any = null;
	alreadyCreatedJustifReg: boolean = false;
	document: any = null;
	renderVilleTier: any;
	renderAdresseTier: any;
	natureTaux: any;
	resteJustifierDecaisserDossier: any;
	initDC: any;
	/* contrevaleur */
	contrevaleurVisible: boolean = false;
	contrevaleurMontant: any;
	contrevaleurMontantRender: any;
	contrevaleurDevise: any;
	contrevaleurDeviseRender: any;
	contrevaleurDate: any;
	contrevaleurDateRender: any;
	contrevaleurDeviseReglement: any;
	contrevaleurMontantReglement: any;
	contrevaleurDeviseVersement: any;
	contrevaleurTypeDeviseReglement: any;
	/* equivalent */
	equivalentVisible: boolean = false;
	equivalentMontant: any;
	equivalentMontantRender: any;
	equivalentDevise: any;
	equivalentDeviseRender: any;
	equivalentDate: any;
	equivalentDateRender: any;
	//boolean pour verifier si le montant DDR < (RAV de document contarctuel && ecartDV)
	montantDdrNotSupRav: boolean = true;
	montantDdrNotSupDv: boolean = true;
	montantDdrNotSupRavConcours: boolean = true;
	montantOldDDR: any;
	avanceRemboursable: boolean = false;
	showDetailsCoordonneeBancaire: boolean = false;
	listTiersByConcours: any;
	devisesReglement: any;
	deviseSelected: any;
	labelDeviseSelected: any;
	checkSelectDeviseReglement: boolean = false;
	showSidebar: boolean = true;
	perimetre: any;
	isDCV: boolean = false;
	listEmetteursJustifByCr: any;
	montantPlafondAvance: any;
	montantDdrNotSupPlaf: boolean = true;
	initToggleDeviseReglement: boolean = false;
	deviseAvance: any;
	deviseReglementChecker: any;
	showRepriseVersement: boolean = false;
	isAddJustificatif: boolean = false;
	idAvanceContractuelDR: any;
	concoursGCF: any;
	concoursNotFiltred: any;
	concoursSIOP: any;
	checkForm: boolean = true;
	idReglement: any;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.role = this.store.getUserRole();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		app.setCurrentCmp('reglement', this);
	}

	ngAfterViewInit() {
		this.getReglement();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	get isDossierAnnule() {
		if (app.isAFD(this.entite) && this.reglement != null)
			return app.isDossierAnnule(this.reglement.code_statut_dossier);
		else if (app.isAFD(this.entite) && this.reglement == null)
			return false;
		else if (!app.isAFD(this.entite))
			return app.isDossierAnnule(this.versement.code_statut_dossier);
	}

	/* REGLEMENT */
	async getReglement() {
		console.time('reglement');
		this.loading = true;

		//id reglement
		this.persistenceIDReglement = null;
		if (app.getStorageItem('idReglementRefreshPage') != null)
			this.persistenceIDReglement = app.getStorageItem('idReglementRefreshPage');

		this.idReglement = (this.route.snapshot.paramMap.get('id') == null) ? this.persistenceIDReglement : this.route.snapshot.paramMap.get('id');

		app.resetDO('reglement');
		app.setStorageItem('idReglement', null);
		app.setStorageItem('idVersement', null);
		this.initToggleDeviseReglement = false;

		var DO = app.copyJson(app.getDO('reglement'));

		if (this.idReglement != null) { //modification
			this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.idReglement), 'page-reglement > getReglement - reglement', true);
			this.versement = await app.getExternalData(app.getUrl('urlGetVersementByNumero', this.reglement.numero_dossier_versement), 'page-reglement > getReglement - versement', true);

			this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.versement.numero_projet), 'page-reglement > getReglement - projet', true);

			this.persistenceIDReglement = this.reglement.persistenceId;

			app.mapDO(DO, this.reglement);

			DO.saisie_sous_objets = "";
			if (this.reglement.documentContractuel != null)
				DO.id_document_contractuel = this.reglement.documentContractuel.persistenceId;
		} else { //creation
			this.reglement = null;

			var idVersement = this.route.snapshot.paramMap.get('idVersement');
			this.versement = await app.getExternalData(app.getUrl('urlGetVersement', idVersement), 'page-reglement > getReglement - versement', true);

			this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.versement.numero_projet), 'page-reglement > getReglement - projet', true);

			//pour initialiser la devise de règlement 
			this.deviseSelected = this.versement.devise;

			this.idAvanceContractuel = (!app.isEmpty(app.getStorageItem('idAvanceContractuel'))) ? (app.getStorageItem('idAvanceContractuel')) : null;

			if (this.idAvanceContractuel != null) {
				DO.id_avance_contractuel = this.idAvanceContractuel;

				app.setStorageItem('idAvanceContractuel', null);
			}

			var idDocumentContractuel = app.getStorageItem('idDocumentContractuel');
			if (idDocumentContractuel != null) {
				DO.id_document_contractuel = idDocumentContractuel;
				DO.dc_attache = '1';

				app.setStorageItem('idDocumentContractuel', null);
			}
		}
		if (await app.getPageError(this.versement.numero_projet)) {
			//liste des DC du projet
			if (app.isAFD(this.entite) && app.isPaiementDirectAndMoad(this.versement.modalite_paiement, this.versement.type_versement)) {
				this.documentsContractuel = await app.getExternalData(app.getUrl('urlGetDocumentsContractuel', this.versement.numero_projet), 'page-reglement > getReglement - documentsContractuel');

				app.setRef(this.documentsContractuel, 'documentsContractuel', 'persistenceId', ['code_fonctionnel', 'libelle']);
			}

			//save du current DC à l'initialisation
			this.initDC = app.getStorageItem('idDocumentContractuel');

			this.versement.canceled = (app.isDossierAnnule(this.versement.code_statut_dossier) ? true : false);

			//a revoir, gestion du caseID
			if (app.isAFD(this.entite) && this.reglement != null)
				this.caseId = this.reglement.case_id;
			else if (app.isAFD(this.entite) && this.reglement == null)
				this.caseId = 0;
			else if (!app.isAFD(this.entite))
				this.caseId = this.versement.case_id;

			//maj DO
			if (app.isAFD(this.entite) && app.isEmpty(DO.devise_reglement))
				DO.devise_reglement = this.versement.devise;

			DO.entite = this.entite;
			DO.numero_dossier_versement = this.versement.numero_dossier_versement;

			if (this.reglement == null)
				DO.numero_concours = this.versement.numero_concours;

			if (DO.type_at == '0')
				DO.type_at = '';

			// if (!app.isAFD(this.entite))
			// 	DO.devise_reglement = this.versement.devise;

			//concours
			this.concoursNotFiltred = this.projet.listConcours;
			this.concoursGCF = await app.getExternalData(app.getUrl('urlGetConcoursGCFByProjet', this.projet.numeroProjet), 'reglement > getConcoursGCF');
			if (app.isAFD(this.entite))
				this.concours = this.filterConcoursByResteAVerser(this.concoursNotFiltred, this.concoursGCF);
			else
				this.concours = this.concoursNotFiltred;

			app.setRef(this.concours, 'concours', 'numeroConcours', 'numeroConcours');

			//read / task
			if (this.reglement != null && app.isDossierAnnule(this.reglement.code_statut_dossier))
				this.read = true;
			else {
				if (app.isAFD(this.entite) && this.reglement != null)
					this.read = await app.isReadTask(this, this.reglement.case_id, this.store.getUserId());
				else if (!app.isAFD(this.entite))
					this.read = await app.isReadTask(this, this.versement.case_id, this.store.getUserId());

				if (!this.read)
					this.read = !(app.isRoleEnableEditDossier(this.role, this.versement) || app.isChargeProjet(this.role));

				if (this.tache != null && !Array.isArray(this.tache)) {
					this.role = app.getRoleTache(this.tache);
					this.etapeTache = app.getEtapeTache(this.tache);
				}
			}

			if (app.isAuditeur(this.role))
				this.read = true;

			app.setBDM(DO);

			//liste des avances du concours
			if (app.isAvance(this.versement.modalite_paiement)) {
				this.avancesContractuel = await app.getExternalData(app.getUrl('urlGetAvancesByConcours', (this.reglement != null ? this.reglement.numero_concours : this.versement.numero_concours)), 'page-reglement -> avances contractuel by concours');
				app.sortBy(this.avancesContractuel, [{ key: 'libelle' }]);
			}

			//chargement des devises du versement 
			this.devisesReglement = [{ code: this.versement.devise, label: app.getRefLabel('refDevises', this.versement.devise) }];
			for (var autreDevisesVersement of this.versement.autresDevises)
				this.devisesReglement.push({ code: autreDevisesVersement.devise, label: app.getRefLabel('refDevises', autreDevisesVersement.devise) });

			//afficher la devise de versement par defaut si y a pas autres devise
			if (this.versement.autresDevises.length == 0)
				this.deviseSelected = this.versement.devise;

			this.natureTaux = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'nature_taux');

			if (DO.dc_attache == '1')
				appFormio.setDataValue(crossVars.forms['formio_reglementAFD'], 'nature_taux', app.getRefLabel('refNatureTaux', this.natureTaux));

			//reverse teleport avant formio
			this.teleportBeneficiairePrimaire().unteleport();
			this.teleportBeneficiaireReglement().unteleport();
			this.teleportSelectBeneficiareReglement().unteleport();
			this.teleportDetailsCoordonneeBancaire().unteleport();
			this.teleportDetailAvanceContractuel().unteleport();
			this.teleportNombreDC().unteleport();
			this.teleportDC().unteleport();
			this.teleportAR().unteleport();
			this.teleportSelectAvance().unteleport();
			if (app.isAFD(this.entite)) {
				this.teleportDevisesReglement().unteleport();
				this.teleportJustificatifReglement().unteleport();
				this.teleportContrevaleur().unteleport();
				this.teleportEquivalent().unteleport();

				if (this.reglement != null)
					this.deviseSelected = (this.reglement.type_devise == "1" ? this.reglement.devise_reglement : this.reglement.devise_reference);
			}

			//chargement de formio
			appFormio.loadFormIO('reglement' + this.entite, this.read);

			await app.sleep(150);

			if (!app.isAFD(this.entite) && this.reglement != null) {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_decaissement', this.reglement.numero_decaissement);

				if (!app.isReversement(this.versement.modalite_paiement)) {
					appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_adosse_subvention_seche', this.reglement.pret_adosse_subvention_seche);
					appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_auto_finance', this.reglement.pret_auto_finance);
				}
			}

			await this.getConcours();

			this.getBeneficiairePrimaire();

			this.listTiersByConcours = await app.getTiersUsedByConcours(this.reglement != null ? this.reglement.numero_concours : this.versement.numero_concours, this.entite, 'DR', (this.reglement != null ? this.reglement.id_beneficiaire_reglement : null));

			if (this.reglement != null) {
				this.idAvanceContractuel = ""; //réinitialisation de l'idAvance pour qu'en modif il prend la bonne valeur
				if (!app.isEmpty(this.reglement.id_avance_contractuel))
					this.idAvanceContractuel = this.reglement.id_avance_contractuel;

				if (app.isAFD(this.entite)) {
					this.getContrevaleurEtEquivalent();

					appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_decaissement', this.reglement.numero_decaissement);
				}
				else
					appFormio.setDataValue(crossVars.forms['formio_reglementPROPARCO'], 'numero_compte_ktp', app.getRefLabel('refNumeroCompteKTP', this.reglement.numero_compte_ktp));

				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'lien_rom_raj', this.reglement.justificatif_complementaire_RAJ);

				//recuperer les infos du tiers selectionné
				var tierReglement = app.getEltInArray(this.listTiersByConcours, 'idTiers', this.reglement.id_beneficiaire_reglement);

				this.initSelectBeneficiaire(tierReglement);

				this.getBeneficiaireReglement();

				if (DO.type_devise != null && DO.type_devise.length != 0) {
					appFormio.selectToggle(crossVars.forms['formio_reglement' + this.entite], 'type_devise', DO.type_devise);

					if (this.read)
						app.disableToggle(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
				}
			}
			else
				appFormio.selectToggle(crossVars.forms['formio_reglement' + this.entite], 'type_devise', '1');

			if (app.isAFD(this.entite)) {
				if (app.isPaiementDirectAndMoad(this.versement.modalite_paiement, this.versement.type_versement)) {
					appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'doc_show', 'show');
					if (DO.dc_attache != null && DO.dc_attache.length != 0) {
						if (this.read)
							app.disableToggle(crossVars.forms['formio_reglement' + this.entite], 'dc_attache');

						await appFormio.selectToggle(crossVars.forms['formio_reglement' + this.entite], 'dc_attache', DO.dc_attache);

						this.showEditeButton();

						this.getDetailDocumentContractuel();
					}
					if (this.documentsContractuel.length != 0 && this.reglement != null && this.reglement.dc_attache == '1')
						appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'edite_document', 'edite');

					await this.getLibelleProjet();
				}
				if (app.isPaiementDirect(this.versement.modalite_paiement) || app.isAvance(this.versement.modalite_paiement)) {
					if (app.produitIsPret(this.concoursSIOP.idFamilleProduit))
						appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_produit', 'pret');
				}
			}
			else {
				await this.calculImputationComptable();

				await this.changePretAdosse();
			}

			if (!app.isAFD(this.entite) && app.isReversement(this.versement.modalite_paiement)) {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_reversement', 'reversement');
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_adosse_subvention_seche', '');
				appFormio.setProperty(crossVars.forms['formio_reglement' + this.entite].getComponent('type_devise' + '_' + 0).component, 'disabled', true);
			}
			if (this.reglement == null)
				this.initSelectBeneficiaire();

			if (app.isAFD(this.entite))
				this.getLabelDeviseByTypeDeviseRegSelected(this.reglement != null ? this.reglement.type_devise : appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise'));

			//contrevaleur
			this.contrevaleurMontant = DO.montant_contrevaleur;
			this.contrevaleurDevise = DO.devise_contrevaleur;
			this.contrevaleurDate = DO.date_contrevaleur;
			this.equivalentMontant = DO.montant_equivalent;
			this.equivalentDevise = DO.devise_reglement;
			this.equivalentDate = DO.date_equivalent;

			if (this.versement.modalite_paiement == 'sur_avance' || this.versement.modalite_paiement == 'avance_refinancement') {
				if (this.avancesContractuel.length != 0) {
					appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_avance_contractuel', 'liste_avance');
					if (!app.isEmpty(this.idAvanceContractuel))
						this.getAvanceContractuel();
				} else
					appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_avance_contractuel', 'add_avance');

				if (this.reglement == null || (this.reglement != null && !this.read))
					if ((app.isAFD(this.entite) && app.isAgentVersement(this.role)) || (!app.isAFD(this.entite) && app.isChargeAppui(this.role)))
						appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_avance_by_role', 'add_actif');

				if (this.reglement != null)
					this.getAvanceContractuel();
			} else if (app.isRefinancementOrPaiementDirect(this.versement.modalite_paiement)) {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'show_justificatif', 'show');

				this.showJustificatifsReglement = true;

				await app.sleep(150);

				if (this.reglement != null) {
					if (this.versement.modalite_paiement == "sur_avance")
						this.getAvanceContractuel();

					this.justificatifsReglement = this.reglement.justificatifs;
				}

				await app.sleep(150);

				this.tableJustificatifsReglement().getItems();
			}

			await app.sleep(250);

			this.teleportBeneficiairePrimaire().teleport();
			this.teleportBeneficiairePrimaire().show();
			this.teleportBeneficiaireReglement().teleport();
			this.teleportBeneficiaireReglement().show();
			this.teleportSelectBeneficiareReglement().teleport();
			this.teleportSelectBeneficiareReglement().show();
			this.teleportDetailsCoordonneeBancaire().teleport();
			this.teleportDetailsCoordonneeBancaire().show();
			if (app.isAFD(this.entite)) {
				this.teleportDevisesReglement().teleport();
				this.teleportDevisesReglement().show();
			}

			//récupérer le montant réglement des anciens DDRs
			this.montantOldDDR = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement');

			if (app.isAvance(this.versement.modalite_paiement) || app.isAvanceOrRefinancement(this.versement.modalite_paiement, this.entite)) {
				this.teleportSelectAvance().teleport();
				this.teleportSelectAvance().show();
				this.teleportDetailAvanceContractuel().teleport();
				this.teleportDetailAvanceContractuel().show();
			}

			if (app.isPaiementDirectAndMoad(this.versement.modalite_paiement, this.versement.type_versement)) {
				this.teleportNombreDC().teleport();
				this.teleportNombreDC().show();
				this.teleportDC().teleport();
				this.teleportDC().show();
				this.teleportAR().teleport();
				this.teleportAR().show();
			}

			if (app.isAFD(this.entite)) {
				this.teleportJustificatifReglement().teleport();
				this.teleportJustificatifReglement().show();
				this.teleportContrevaleur().teleport();
				this.teleportContrevaleur().show();
				this.teleportEquivalent().teleport();
				this.teleportEquivalent().show();
			}

			if (!app.isAFD(this.entite))
				app.setStorageItem('reglement_autre_devise', this.versement.devise);

			if (this.reglement != null) {
				this.contrevaleurMontant = this.reglement.montant_contrevaleur;
				this.contrevaleurDevise = this.reglement.devise_contrevaleur;
				this.contrevaleurDate = this.reglement.date_contrevaleur;

				this.renderContrevaleur();
			}

			if (!this.loadingJustificatif)
				this.loading = false;
		}
		console.timeEnd('reglement');
	}

	getMontantNewDdrByDevise() {
		var deviseReglement = this.deviseSelected;

		return this.infosVersement().calculNewMontantDDR(deviseReglement);
	}

	montantNewDdrSupRav(input: any) {
		var deviseReglement = this.deviseSelected;
		var existDdrByDeviseRav = false;
		var ravPrevisionnel = 0;

		const infosDc = this.infosDc();
  if (this.infosDc != null && infosDc.documentContractuel != null && infosDc.documentContractuel.montantsDevises != null && infosDc.documentContractuel.montantsDevises.length > 0) {
			for (var montantDevise of infosDc.documentContractuel.montantsDevises) {
				if (deviseReglement == montantDevise.devise) {
					existDdrByDeviseRav = true;
					ravPrevisionnel = montantDevise.rav_previsionnel;
					break;
				}
			}
		}
		return ((existDdrByDeviseRav && ravPrevisionnel >= input) || (!existDdrByDeviseRav));
	}

	//methode pour comparer le rav concours avec le montant reglement
	montantNewDdrSupRavConcours(input: any) {
		var newMontantDDR = input;
		var montantDDR = 0;
		var ravConcours = 0;
		if (app.isAFD(this.entite)) {
			const infosContext = this.infosContext();
   if (this.infosContext != null && infosContext.concours != null) {
				var ravBackOffice = infosContext.concours.resteAVerser;
				var sommeMontantsDDRs = ravBackOffice - infosContext.concours.ravPrevisionnel;
				sommeMontantsDDRs = app.convertStringToFloat(sommeMontantsDDRs.toFixed(2));
				var deviseDDR = this.deviseSelected;
				var deviseConcours = infosContext.concours.idDevise;

				if (((this.contrevaleurVisible && app.isEmpty(this.contrevaleurMontantReglement)) || (this.equivalentVisible && app.isEmpty(this.equivalentMontant))) && deviseConcours != deviseDDR) {
					return true;
				}
				else if (deviseConcours == deviseDDR) {
					montantDDR = (this.reglement != null ? this.reglement.montant_reglement : 0);
					newMontantDDR = input;
				}
				else if (this.contrevaleurVisible) {
					newMontantDDR = this.contrevaleurMontant;
					if (this.reglement != null)
						montantDDR = this.reglement.montant_contrevaleur;
				} else if (this.equivalentVisible) {
					newMontantDDR = this.equivalentMontant;
					if (this.reglement != null)
						montantDDR = this.reglement.montant_equivalent;
				}
				ravConcours = ravBackOffice - ((sommeMontantsDDRs - app.convertStringToFloat(montantDDR)) + app.convertStringToFloat(newMontantDDR));

				return (ravConcours >= 0);
			}
		}
		return true;
	}

	async saveReglement(back: any, checkMontantsJustif: any) {
		var lienRomeRAJ = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'lien_rom_raj');

		const infosAvance = this.infosAvance();
  if (this.resteJustifierDecaisserDossier > 0 && app.isEmpty(lienRomeRAJ) && !infosAvance.acRepris) {
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'raj_sup_zero', 'show');

			await app.sleep(250);

			app.setLinkEvent(crossVars.forms['formio_reglement' + this.entite], "lien_rom_raj");

			this.verifFormulaireReglement();

			return;
		}

		//validation du formulaire
		if (!this.verifFormulaireReglement() || (app.isAFD(this.entite) && app.isEmpty(this.deviseSelected))) {
			if (app.isAFD(this.entite) && app.isEmpty(this.deviseSelected))
				this.checkSelectDeviseReglement = true;
			this.btnSaveReglement().setLoading(false);
			this.checkForm = false;
			app.showToast('toastReglementSaveError');
			return;
		}

		if (this.checkPaysExecution && back) {
			if (app.isAFD(this.entite) && this.verifPaysExecution() && !this.isAddJustificatif) {
				this.btnSaveReglement().setLoading(false);
				app.showModal('modalMessagePaysExecution');
				return;
			}
		}
		this.isAddJustificatif = false;

		var deviseDR = "";
		var typeDeviseReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');

		if (app.isAFD(this.entite))
			deviseDR = (typeDeviseReglement == '0' ? appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement') : this.deviseSelected);
		else
			deviseDR = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], (typeDeviseReglement == '0' ? 'devise_reference' : 'devise_reglement'));

		var toasterDeviseError = app.isAvanceOrRefinancement(this.versement.modalite_paiement, this.entite) && !app.isEmpty(infosAvance) && !app.isEmpty(infosAvance.avanceContractuel) && infosAvance.avanceContractuel.devise_avance != deviseDR;

		if (toasterDeviseError) {
			this.btnSaveReglement().setLoading(false);
			app.showToast('toastDeviseReglementSurAvanceError');
			return;
		}
		if (checkMontantsJustif && app.isAFD(this.entite)) {
			var idDocument = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel');
			var document = await app.getExternalData(app.getUrl('urlGetDoContractuelById', idDocument), 'page-reglement > getDocumentContractuel', true);
			var persistenceIdAR = 0;
			var sommeMntsRem = 0;
			var sommeMntsJustif = 0;

			if (document.avance_remboursable == '1') {
				if (document.rubriques.length > 0) {
					for (var rub of document.rubriques) {
						if (rub.libelle_rubrique == "Avance remboursable")
							persistenceIdAR = rub.persistenceId;
					}
				}

				if (document.dossiers_reglements.length > 0) {
					for (var dossier_reglement of document.dossiers_reglements) {
						for (var justificatif of dossier_reglement.justificatifs) {
							for (var montant of justificatif.montantsJustificatifRubrique) {
								if (montant.level_rubrique == "0" && montant.id_rubrique != persistenceIdAR) {
									if (this.reglement != null) {
										if (dossier_reglement.persistenceId == this.reglement.persistenceId)
											sommeMntsRem += montant.montant_a_rembourser;
									}
								}
							}
						}
					}
				}
			}

			if (this.justificatifsReglement.length != 0)
				for (var justif of this.justificatifsReglement)
					sommeMntsJustif += app.convertStringToFloat(justif.montant_finance_afd);

			//ANOMALIE NEWV-3140
			if (sommeMntsJustif.toString().includes("."))
				sommeMntsJustif = app.convertStringToFloat(sommeMntsJustif.toFixed(2));

			app.log("somme mnts à rembourser des rubriquesAR, somme mnts justificatifs, final result >>> ", sommeMntsRem, sommeMntsJustif, sommeMntsJustif - sommeMntsRem);

			console.warn("somme justificatif > ", sommeMntsJustif);

			var validateMontantsJustificatifs = (document.avance_remboursable == "1") ? (appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement') != sommeMntsJustif - sommeMntsRem) : (appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement') != sommeMntsJustif);

			if (this.justificatifsReglement.length != 0) {
				if (validateMontantsJustificatifs) {
					//ANOMALIE 3068 HORS HOT FIX
					if (this.btnSaveReglement != null)
						this.btnSaveReglement().setLoading(false);
					else if (this.btnValidateTache != null)
						this.btnValidateTache().setLoading(false);
					console.warn("btnValidateTache2 > ", this.btnValidateTache());
					console.warn("btnSaveReglement2 > ", this.btnSaveReglement());
					if (document.avance_remboursable == "1")
						app.showToast('toastARMontantJustificatifsError');
					else
						app.showToast('toastMontantJustificatifsError');

					return;
				}
			}
		}
		//TODO : a revoir lidia
		if (!app.isAFD(this.entite)) {
			var impayesSirpIsPositif = await this.impayesSirpIsPositif();
			var commentaire = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'commentaire');

			if (impayesSirpIsPositif && commentaire == null && commentaire.length != 0) {
				this.btnSaveReglement().setLoading(false);
				app.showToast('toastCommentMondatoryError');
				return;
			}
		}

		this.isLoading = true;

		var DO = app.getDO('reglement');

		//TODO a verifier si type operation == operation
		DO.id_coordonnee_bancaire = this.infosCoordonneeBancaire().coordonneeBancaireSelected.idCbInterne;
		DO.id_operation = this.concoursSIOP.idOperation;
		DO.id_produit = (!app.isEmpty(this.concoursSIOP.produit) ? this.concoursSIOP.produit.idProduit : '');
		DO.justificatifs_reglement = this.justificatifsReglement;
		DO.taux = appFormio.getDataValue(crossVars.forms['formio_reglementAFD'], app.getRefLabel('refNatureTaux', 'nature_taux'));
		DO.numero_compte_ktp = appFormio.getDataValue(crossVars.forms['formio_reglementPROPARCO'], 'numero_compte_ktp');
		DO.id_beneficiaire_reglement = this.selectbeneficaire()?.tiersSelected?.idTiers;
		DO.id_beneficiaire_primaire = (this.beneficiairePrim != null) ? this.beneficiairePrim.idTiers : "";
		DO.numero_dossier_versement = this.versement.numero_dossier_versement;
		DO.numero_dossier_reglement = (app.isEmpty(this.reglement) ? 0 : this.reglement.numero_dossier_reglement);
		DO.entite = this.entite;
		DO.justificatif_complementaire_RAJ = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'lien_rom_raj');
		DO.id_division = this.projet.idDivisionProparco;
		DO.agence_gestion = this.projet.idAgenceGestion;
		DO.direction_regionale = this.projet.idDirectionRegionale;
		DO.id_avance_contractuel = app.isEmpty(this.idAvanceContractuel) ? "" : this.idAvanceContractuel;

		if (this.concoursSIOP.convention != null)
			DO.date_signature_convention = this.concoursSIOP.convention.dateSignature;
		if (app.isAFD(this.entite)) {
			DO.direction_regionale = '';
			var typeDeviseDdr = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
			DO.devise_reglement = (typeDeviseDdr == "1" ? this.deviseSelected : '');
			DO.devise_reference = (typeDeviseDdr == "0" ? this.deviseSelected : '');
		}

		if (!app.isAFD(this.entite)) //proparco
			app.getPaysRealisation(this.projet, DO);

		//si paiement direct et pas de DC
		if (app.isPaiementDirect(this.versement.modalite_paiement) && appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'dc_attache') == '0')
			DO.id_document_contractuel = '';

		//contrevaleur 
		DO.montant_contrevaleur = null;
		DO.devise_contrevaleur = '';
		DO.date_contrevaleur = null;
		if (this.contrevaleurVisible) {
			DO.montant_contrevaleur = this.contrevaleurMontant;
			DO.devise_contrevaleur = this.contrevaleurDevise;
			DO.date_contrevaleur = this.contrevaleurDate;
		}

		//equivalent
		DO.montant_equivalent = null;
		DO.date_equivalent = null;
		if (this.equivalentVisible) {
			DO.montant_equivalent = this.equivalentMontant;
			DO.date_equivalent = this.equivalentDate;
		}

		if (back)
			DO.generer_pdf = true;

		//save et recup du case
		await app.sleep(500);

		var caseObject = await app.saveFormData(app.getRootDO('reglement'), crossVars.forms['formio_reglement' + this.entite], urls['urlProcessInstanciation'], urls['urlProcessUpdateReglement']);

		await app.sleep(2000);

		//CAS DE CREATION DE DDR AVEC JUSTIFICATIF => validation
		if (this.reglement != null && app.isAFD(this.entite) && !app.taskIsNotControles(app.getEtapeTache(this.tache)) && back)
			return;
		else {
			//si create et proparco, on recuperer le case context pour recuperer le persistence id du reglement
			if (this.reglement == null && !app.isAFD(this.entite)) {
				var caseInfo = await app.getCaseInfo(false, caseObject.caseId, 'page-reglement > saveReglement - get caseInfo');

				var caseContext = await app.getCaseContext(false, caseInfo.id, 'page-reglement > saveReglement - get caseContext');

				// await app.sleep(500);

				if (!back) {
					if (caseContext == null) {
						console.error('page-reglement -> saveReglement : caseContext is null');
						return;
					}

					this.persistenceIDReglement = app.getStorageIdByCaseContext('dossierReglement', caseContext);

					if (this.persistenceIDReglement == null) {
						console.error('page-reglement -> saveReglement : context.storageId is null');
						return;
					}
				}
			}

			await app.sleep(1000);

			//redirect apres save
			if (!back) {
				await this.infosVersement().getVersement();

				if (this.persistenceIDReglement != null && this.reglement == null)
					app.setStorageItem('idReglementRefreshPage', this.persistenceIDReglement);

				await this.getReglement();
			} else {
				//AVANCE-FIGEE PROPARCO
				if (infosAvance && app.isEmpty(DO.id_avance_contractuel))
					infosAvance.getAvance(parseInt(DO.id_avance_contractuel), this.entite, this.versement.persistenceId, (this.reglement != null ? this.reglement.persistenceId : null));
				//capture(add) Avance Figee
				//si role agent de versement ou charge d'appui => save copy => faire photo (si y a des AR entre les autres agents la photo ne change jamais mais si elle est retourn� )
				if (!app.isEmpty(DO.id_avance_contractuel) && app.isChargeAppui(this.role)) {
					var avanceFigeeDO = app.getDO('avanceFigee');
					avanceFigeeDO.id_avance_contractuel = parseInt(DO.id_avance_contractuel);
					avanceFigeeDO.reste_justifier_decaisser_dossier_copy = infosAvance.resteJustifierDecaisserDossier;
					avanceFigeeDO.reste_justifier_copy = infosAvance.resteJustifier;
					avanceFigeeDO.montant_total_justificatifs_avance_copy = infosAvance.montantTotalJustificatifsAvance;
					avanceFigeeDO.montant_verse_total_copy = infosAvance.montantVerseTotal;

					if (this.reglement != null)
						avanceFigeeDO.id_dossier_reglement = this.reglement.persistenceId;
					else
						avanceFigeeDO.id_dossier_reglement = this.persistenceIDReglement;

					await app.saveFormData(app.getRootDO('avanceFigee'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessGererAvanceFigee'));

					// var avanceFg = await app.getExternalData(app.getUrl('urlGetAvanceFigeeByIdDrAndIdAvance', avanceFigeeDO.id_dossier_reglement, this.infosAvance.avanceContractuel.persistenceId), true);
				}

				await app.sleep(2000);

				this.gotoReglements();

			}

			if (this.btnSaveReglement != null)
				this.btnSaveReglement().setLoading(false);
		}
		app.showToast('toastReglementSave');
		this.isLoading = false;
	}

	async gotoReglements() {
		app.setStorageItem('idReglementRefreshPage', null);
		app.log("page_reglement > gotoReglements > this.etapeTache > ", this.etapeTache);
		if (this.etapeTache != null && this.etapeTache != '' && (!app.isAFD(this.entite) || (app.isAFD(this.entite) && app.taskIsNotControles(app.getEtapeTache(this.tache))))) {
			var persistenceId = app.isAFD(this.entite) ? this.persistenceIDReglement : this.versement.persistenceId;

			app.redirect(this.router, app.getUrl(tachesRedirect[app.getTypeTache(this.tache)][app.getEtapeTache(this.tache)], persistenceId));
		} else {
			await app.sleep(1000);

			app.redirect(this.router, app.getUrl('urlGotoVersementReglements', this.versement.persistenceId));
		}
	}

	async showValiderReglement() {
		await app.sleep(100);

		app.showModal('modalValiderReglement');
	}

	async validerReglement() {
		app.mapDO(app.getDO('reglementPDFInput'), this.reglement);

		var DO = app.getRootDO('reglementPDFInput');
		DO.statut = "B";

		await app.generateFile(DO, 'urlProcessExportPdfDDR', false);

		DO.statut = "";
		app.hideModal('modalValiderReglement');
	}

	async validerTache(back: any) {
		//test si on doit affiche le lien rome complementaire
		const infosAvance = this.infosAvance();
  if (infosAvance?.resteJustifierDecaisserDossier > 0) {
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'raj_sup_zero', 'show');

			await app.sleep(250);

			app.setLinkEvent(crossVars.forms['formio_reglement' + this.entite], "lien_rom_raj");
		}

		//validation des données
		if (!this.verifFormulaireReglement() || (app.isAFD(this.entite) && app.isEmpty(this.deviseSelected))) {
			if (app.isAFD(this.entite) && app.isEmpty(this.deviseSelected))
				this.checkSelectDeviseReglement = true;
			this.btnValidateTache().setLoading(false);
			app.showToast('toastReglementSaveError');
			return;
		}

		var deviseDR = "";
		var typeDeviseReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');

		if (app.isAFD(this.entite))
			deviseDR = (typeDeviseReglement == '0' ? appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement') : this.deviseSelected);
		else
			deviseDR = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], typeDeviseReglement == '0' ? 'devise_reference' : 'devise_reglement');

		var toasterDeviseError = app.isAvanceOrRefinancement(this.versement.modalite_paiement, this.entite) && !app.isEmpty(infosAvance) && !app.isEmpty(infosAvance.avanceContractuel) && infosAvance.avanceContractuel.devise_avance != deviseDR;

		if (toasterDeviseError) {
			this.btnValidateTache().setLoading(false);
			app.showToast('toastDeviseReglementSurAvanceError');
			return;
		}

		if (this.checkPaysExecution && back) {
			if (app.isAFD(this.entite) && this.verifPaysExecution() && !this.isAddJustificatif) {
				this.btnValidateTache().setLoading(false);
				app.showModal('modalMessagePaysExecution');
				return;
			}
		}
		this.isAddJustificatif = false;

		var idDocument = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel');

		var document = await app.getExternalData(app.getUrl('urlGetDoContractuelById', idDocument), 'page-reglement > getDocumentContractuel', true);

		var persistenceIdAR = 0;
		var sommeMntsRem = 0;
		var sommeMntsJustif = 0;

		if (document.avance_remboursable == '1') {
			if (document.rubriques.length > 0) {
				for (var rub of document.rubriques) {
					if (rub.libelle_rubrique == "Avance remboursable")
						persistenceIdAR = rub.persistenceId;
				}
			}

			if (document.dossiers_reglements.length > 0) {
				for (var dossier_reglement of document.dossiers_reglements) {
					if (this.reglement != null && dossier_reglement.persistenceId == this.reglement.persistenceId) {
						for (var justificatif of dossier_reglement.justificatifs) {
							for (var montant of justificatif.montantsJustificatifRubrique) {
								if (montant.level_rubrique == "0" && montant.id_rubrique != persistenceIdAR)
									sommeMntsRem += montant.montant_a_rembourser;
							}
						}
					}
				}
			}
		}

		if (this.justificatifsReglement.length != 0) {
			for (var justif of this.justificatifsReglement)
				sommeMntsJustif += app.convertStringToFloat(justif.montant_finance_afd);
		}
		//ANOMALIE NEWV-3140
		if (sommeMntsJustif.toString().includes("."))
			sommeMntsJustif = app.convertStringToFloat(sommeMntsJustif.toFixed(2));

		app.log("somme mnts à rembourser des rubriquesAR, somme mnts justificatifs, final result >>> ", sommeMntsRem, sommeMntsJustif, sommeMntsJustif - sommeMntsRem);

		console.warn("somme justificatif > ", sommeMntsJustif);

		var validateMontantsJustificatifs = (document.avance_remboursable == "1") ? (appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement') != sommeMntsJustif - sommeMntsRem) :
			(appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement') != sommeMntsJustif);

		if (this.justificatifsReglement.length != 0 && this.btnValidateTache != null) {
			if (validateMontantsJustificatifs) {

				//ANOMALIE 3068 HORS HOT FIX
				this.btnValidateTache().setLoading(false);

				console.warn("btnValidateTache1 > ", this.btnValidateTache());
				console.warn("btnSaveReglement1 > ", this.btnSaveReglement());

				if (document.avance_remboursable == "1")
					app.showToast('toastARMontantJustificatifsError');
				else
					app.showToast('toastMontantJustificatifsError');

				return;
			}
		}

		//chargement du DO
		var DO = app.getDO('reglement');
		DO.justificatifs_reglement = this.justificatifsReglement;

		//creation
		if (this.reglement == null) {
			DO.numero_dossier_versement = this.versement.numero_dossier_versement;
			DO.numero_dossier_reglement = 0; //le forcer à 0 car des fois il l'envoie en "" ce qui bloque le process
			DO.pays_gestion = this.versement.pays_gestion;

			if (this.concoursSIOP.convention != null)
				DO.date_signature_convention = this.concoursSIOP.convention.dateSignature;
			DO.id_operation = this.concoursSIOP.idOperation;
			DO.id_produit = (!app.isEmpty(this.concoursSIOP.produit) ? this.concoursSIOP.produit.idProduit : '');
			DO.taux = appFormio.getDataValue(crossVars.forms['formio_reglementAFD'], app.getRefLabel('refNatureTaux', 'nature_taux'));
			DO.numero_compte_ktp = appFormio.getDataValue(crossVars.forms['formio_reglementPROPARCO'], 'numero_compte_ktp');
			DO.id_beneficiaire_reglement = this.selectbeneficaire()?.tiersSelected?.idTiers;
			DO.id_beneficiaire_primaire = (this.beneficiairePrim != null) ? this.beneficiairePrim.idTiers : "";
			DO.justificatif_complementaire_RAJ = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'lien_rom_raj');

			// this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.versement.numero_projet), 'page-reglement > getReglement - projet', true);

			app.getPaysRealisation(this.projet, DO);

			DO.entite = this.entite;
			DO.id_coordonnee_bancaire = this.infosCoordonneeBancaire().coordonneeBancaireSelected.idCbInterne;
			DO.id_division = this.projet.idDivisionProparco;
			DO.agence_gestion = this.projet.idAgenceGestion;
			DO.direction_regionale = this.projet.idDirectionRegionale;
			DO.id_avance_contractuel = app.isEmpty(this.idAvanceContractuel) ? "" : this.idAvanceContractuel;

			if (app.isAFD(this.entite)) {
				DO.direction_regionale = '';
				var typeDeviseDdr = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
				DO.devise_reglement = (typeDeviseDdr == "1" ? this.deviseSelected : '');
				DO.devise_reference = (typeDeviseDdr == "0" ? this.deviseSelected : '');
			}

			if (app.isAFD(this.entite))
				DO.saisie_sous_objets = this.saisieSousObjets;

			//contrevaleur 
			DO.montant_contrevaleur = null;
			DO.devise_contrevaleur = '';
			DO.date_contrevaleur = null;
			if (this.contrevaleurVisible) {
				DO.montant_contrevaleur = this.contrevaleurMontant;
				DO.devise_contrevaleur = this.contrevaleurDevise;
				DO.date_contrevaleur = this.contrevaleurDate;
			}

			//equivalent
			DO.montant_equivalent = null;
			DO.date_equivalent = null;
			if (this.equivalentVisible) {
				DO.montant_equivalent = this.equivalentMontant;
				DO.date_equivalent = this.equivalentDate;
			}

			//gestion du CASE
			var caseObject = await app.saveFormData(app.getRootDO('reglement'), crossVars.forms['formio_reglement' + this.entite], urls['urlProcessInstanciation'], urls['urlProcessAddReglement']);

			await app.sleep(500);

			var caseInfo = await app.getCaseInfo(false, caseObject.caseId, 'page-reglement > validerTache - get caseInfo');

			this.caseId = caseInfo.id;

			var caseContext = await app.getCaseContext(false, caseInfo.id, 'page-reglement > validerTache - get caseContext');

			for (var key of Object.keys(caseContext)) {
				if (key.toLowerCase().includes('reglement')) {
					app.log('page-taches > gotoTache - key - context[key].storageId', key + ' - ' + caseContext[key].storageId);

					this.persistenceIDReglement = caseContext[key].storageId;
					break;
				}
			}
		} else {
			await this.saveReglement(back, true);

			await app.assignTache(this.tache.id, this.store.getUserId());

			await app.sleep(1000);


			await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), app.getRootDO('notification'));

			await app.sleep(250);
		}

		await app.sleep(500);

		if (!back) { //sans retour, on affiche le reglement
			//faire un redirect quand on crée pour la premiere fois le reglement 
			if (this.persistenceIDReglement != null && this.reglement == null)
				app.setStorageItem('idReglementRefreshPage', this.persistenceIDReglement);
			//await app.sleep(500);
			await this.getReglement();
		} else { //retour à la liste des reglements
			var nbRetry = 50;
			for (var count = 1; count <= nbRetry; count++) {
				await app.sleep(200);

				this.tache = await app.getExternalData(app.getUrl('urlGetTaskByCaseId', this.caseId), 'page-reglement > gotoReglements > getEtapes', true);

				if (!Array.isArray(this.tache) && this.tache != null) {
					this.etapeTache = app.getEtapeTache(this.tache);
					break;
				}
			}

			app.setStorageItem('idReglementRefreshPage', null);

			if (this.reglement != null)
				this.persistenceIDReglement = this.reglement.persistenceId;

			this.gotoReglements();
		}
	}

	async annulerDossier(DONotification?: any) {
		var codeRetourOk = false;

		if (app.isAFD(this.entite)) {
			await app.assignTache(this.tache.id, this.store.getUserId());

			await app.sleep(1000);

			codeRetourOk = await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), DONotification);

			//anomalie NEWV-2993
			app.resetRootDO('notification');
		} else {
			var DO = app.getDO('reglement');
			DO.notificationMailInput.corpNotification = DONotification.notificationMailInput.corpNotification;
			DO.decision = DONotification.decision;
			DO.urlDossier = DONotification.urlDossier;
			DO.numero_dossier_reglement = this.reglement.numero_dossier_reglement;
			DO.numero_dossier_versement = this.reglement.numero_dossier_versement;
			DO.entite = this.entite;

			var codeObject = await app.saveFormData(app.getRootDO('reglement'), crossVars.forms['formio_reglement' + this.entite], urls['urlProcessInstanciation'], urls['urlProcessUpdateReglement']);

			await app.sleep(1500);

			//anomalie NEWV-2993
			app.resetRootDO('notification');

			codeRetourOk = (codeObject != null);
		}

		if (codeRetourOk) {
			this.notification().setLoadingBtn();
			this.notification().hideModal();
			app.showToast('toastReglementAnnulerOk');

			await app.sleep(250);

			await this.getReglement();

			await this.infosVersement().getVersement();

			await this.infosDossier().getNotifications();
		} else {
			this.annulerAction('-1');
			app.showToast('toastReglementAnnulerKo');
		}
	}

	annulerAction(action: any) {
		if (action == '-1')
			this.btnAnnulerDossier().setLoading(false);
	}

	/* DOCUMENT CONTRACTUEL */
	async addDocumentContractuel() {
		if (this.reglement != null)
			app.setStorageItem('idReglement', this.reglement.persistenceId);
		else {
			this.natureTaux = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'nature_taux');

			app.setStorageItem('numeroProjetDC', this.versement.numero_projet);

			app.log("addDocumentContractuel > numero projet > ", app.getStorageItem('numeroProjetDC'), this.versement.numero_projet, this.versement);

			app.setStorageItem('idVersement', this.versement.persistenceId);
		}

		app.redirect(this.router, app.getUrl('urlAddDocumentContractuel'));
	}

	async getDetailDocumentContractuel() {
		var idDocument = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel');
		var deviseDDREnCours = this.deviseSelected;
		var montantDDREnCours = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement');

		await this.infosDc().getDetailDocumentContractuel(idDocument, this.reglement, deviseDDREnCours, montantDDREnCours);

		this.resteARembourser = this.infosDc().resteARembourser;
		this.arInitiale = this.infosDc().arInitiale;
		this.rembEffectuee = this.infosDc().rembEffectuee;
	}
	showDetailsAR() {
		const infosDc = this.infosDc();
  return (this.infosDc != null && infosDc.documentContractuel != null && infosDc.isAR);
	}

	/* GET DES DONNEES LIEES AU REGLEMENT */
	async getAutresDevises() {
		await this.detailsVersement().getAutresDevises();
	}

	async getBeneficiaireVersement() {
		await this.detailsVersement().getBeneficiaire();
	}

	async getBeneficiaireReglement(input?: any) {
		var numeroConcours = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours');

		const selectbeneficaire = this.selectbeneficaire();
  if (this.selectbeneficaire != null && selectbeneficaire.tiersSelected != null) {
			var idTiersVersement = selectbeneficaire.tiersSelected.idTiers;

			if (!app.isEmpty(idTiersVersement)) {
				await this.infosBeneficiaireReglement().getBeneficiaire(null, null, idTiersVersement, numeroConcours, 'DR');

				//remplir la liste des coordonnées bancaire de benficiaire selectionne
				this.showDetailsCoordonneeBancaire = true;

				this.infosCoordonneeBancaire().setListCoordonneesBancaires(this.infosBeneficiaireReglement().beneficiaire.comptes, this.read, app.getEltInArray(this.infosBeneficiaireReglement().beneficiaire.comptes, 'idCbInterne', (this.reglement != null ? this.reglement.id_coordonnee_bancaire : null)));
			}
		}
	}

	async getConcours() {
		this.showConcours = true;

		var numeroConcours = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours');

		this.concoursSIOP = await app.getExternalData(app.getUrl('urlGetConcoursSIOPByNumero', numeroConcours), 'page-reglement > getConcours - concours');

		if (!app.isAFD(this.entite)) {
			if (app.isUnionEurop(this.concoursSIOP.idOperation))
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'num_compte_ktp', '');
			else
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'num_compte_ktp', 'show');

			await this.calculImputationComptable();
			await this.changePretAdosse();
			
		}

		this.infosAvance().avanceContractuel = null;

		if (!this.loading)
			this.infosContext().setInfosConcours(numeroConcours);
	}

	async getFournisseur() {
		var idBeneficiaire = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'id_fournisseur');

		this.showFournisseur = true;

		await app.sleep(250);

		this.tableFournisseur().setUrlParam(idBeneficiaire);
		this.tableFournisseur().getItems();
	}

	async getBeneficiairePrimaire() {
		var idBenefPrim = app.getBeneficiairePrimaireByConcours(this.concoursSIOP.concoursTiers);

		if (!app.isEmpty(idBenefPrim)) {
			this.beneficiairePrim = await app.getExternalData(app.getUrl('urlGetBeneficiaireById', idBenefPrim), 'page-reglement > beneficiaire-primaire', true);

			if (this.beneficiairePrim != null) {
				var tierAdresses = this.beneficiairePrim.tiersAdresses;

				for (var adr of tierAdresses)
					if (adr.typeAdresse == "ADREXP")
						this.renderAdresseTier = app.renderEmpty(adr.numRue) + ', ' + app.renderEmpty(adr.nomRue) + ' ' + app.renderEmpty(adr.infoComplAdr);

				this.renderVilleTier = app.renderEmpty(adr.codePostal) + ' ' + app.renderEmpty(adr.ville);
			}
		}
	}

	async getLibelleProjet() {
		this.libelleProjet = this.projet.nomProjet;
		this.nbrDocumentContractuel = this.documentsContractuel.length;
	}

	/* AVANCE */
	addAvanceContractuel() {
		app.setStorageItem('numeroConcours', appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours'));
		app.setStorageItem('deviseVersement', this.versement.devise);

		if (!app.isEmpty(this.versement.numero_projet)) //ANO-2850
			app.setStorageItem('numeroProjet', this.versement.numero_projet);

		if (this.reglement != null)
			app.setStorageItem('idReglement', this.reglement.persistenceId);
		else
			app.setStorageItem('idVersement', this.versement.persistenceId);

		app.redirect(this.router, app.getUrl('urlAddAvance'));
	}

	async getAvanceContractuel(id?: any) {
		app.setStorageItem('numeroConcours', appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours'));

		appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'raj_sup_zero', '');

		const infosAvance = this.infosAvance();
  if (infosAvance) {
			await infosAvance.getAvance(this.idAvanceContractuel, this.entite, this.versement.persistenceId, (this.reglement != null ? this.reglement.persistenceId : null));

			this.resteJustifierDecaisserDossier = infosAvance.resteJustifierDecaisserDossier;
			this.montantPlafondAvance = infosAvance.montantPlafondAvance;
			if (infosAvance.avanceContractuel != null)
				this.deviseAvance = infosAvance.avanceContractuel.devise_avance;

			if (this.resteJustifierDecaisserDossier > 0 && this.reglement != null) {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'raj_sup_zero', 'show');

				await app.sleep(250);

				app.setLinkEvent(crossVars.forms['formio_reglement' + this.entite], "lien_rom_raj");
			}
		}
	}

	/* JUSTIFICATIF / EMETTEUR DC */
	async getEmetteurJustificatifDC(idEmetteurVar?: any) {
		var idEmetteur = appFormio.getDataValue(crossVars.forms['formio_justificatifReglement'], 'emetteur');

		this.emetteurJustificatif = await app.getExternalData(app.getUrl('urlGetBeneficiaireById', idEmetteur), 'page-reglement > getEmetteurJustificatifDC');
	}

	async initSelectEmetteur(emetteurJustificatif?: any) {
		if (this.selectEmetteur != null)
			await this.selectEmetteur().initSelectBeneficaire(this.listEmetteursJustifByCr == null ? [] : this.listEmetteursJustifByCr, this.read, !app.isPaiementDirect(this.versement.modalite_paiement) ? 'JR' : 'JDC', emetteurJustificatif, 'modalAddJustificatifReglement');
	}

	async getEmetteurJustificatifDDR() {
		var numeroConcours = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours');

		const selectEmetteur = this.selectEmetteur();
  if (this.selectEmetteur != null && selectEmetteur.tiersSelected != null) {
			var idEmetteur = selectEmetteur.tiersSelected.idTiers;
			if (!app.isEmpty(idEmetteur)) {
				if (!app.isPaiementDirect(this.versement.modalite_paiement))
					await this.infosEmetteurJustificatif().getBeneficiaire(null, null, idEmetteur, numeroConcours, 'JR');
				else
					await this.infosEmetteurJustificatif().getBeneficiaire(null, null, idEmetteur, null, 'JDC');
			}
		}
	}

	async confirmerAddJustificatifReglement(item?: any) {
		if (this.reglement == null)
			app.showModal('modalConfirmationAddJustificatifReglement');
		else {

			this.typeRubrique = 'rubriquesDC';
			await this.addJustificatifReglement(item);
		}
	}

	async addJustificatifReglement(item: any, update?: any) {
		this.isAddJustificatif = true;
		this.loadingJustificatif = true;

		//sauvegarde si nouveau reglement
		if (this.reglement == null) {
			this.loading = true;
			app.scrollToTop();

			this.modalConfirmationAddJustificatifReglement().setLoadingBtn();
			app.hideModal('modalConfirmationAddJustificatifReglement');

			if (!app.isValidForm('formio_reglement' + this.entite) || (!this.verifFormulaireReglement() || (app.isAFD(this.entite) && app.isEmpty(this.deviseSelected)))) {
				app.showToast('toastReglementSaveError');
				this.loading = false;
				this.loadingJustificatif = false;
				return;
			}

			this.saisieSousObjets = 'add';

			await this.validerTache(false);

			await app.sleep(500);
		}
		else if (item == null) {
			if (!this.checkForm)
				return;
		}

		this.showRubriquesDC = false;
		this.infosDcJustificatif = null;
		this.avanceRemboursable = false;

		await app.sleep(250);

		if (item != null && !update)
			app.showModal('modalAddJustificatifReglement');

		//mode lecture
		var readJustificatif = true;
		if (!this.read)
			if (app.isAgentVersement(this.role))
				readJustificatif = false;

		if (readJustificatif)
			this.typeRubrique = 'rubriquesDCNotEditable';

		this.teleportDcJustificatif().unteleport();
		this.teleportRubriques().unteleport();
		if (this.reglement != null) {
			this.teleportEmetteurJustificatif().unteleport();
			this.teleportSelectEmetteurJustificatif().unteleport();
		}

		app.cleanDiv('formio_justificatifReglement');

		await app.sleep(150);

		var typeDeviseReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
		var ddrDevise = (typeDeviseReglement == '0' ? appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement') : this.deviseSelected);

		//gestion du DO
		var DO = app.getDO('justificatifReglement');
		var rootDO = app.getRootDO('justificatifReglement');

		if (item != null) {
			this.alreadyCreatedJustifReg = true;
			this.justificatifReglement = item;
			if (item.obj_ext_id != null)
				this.showRepriseVersement = true;

			app.mapDO(DO, item);

			DO.persistence_id = item.persistenceId;
			const selectEmetteur = this.selectEmetteur();
   if (!app.isPaiementDirect(this.versement.modalite_paiement))
				DO.emetteur = (this.selectEmetteur != null && selectEmetteur.tiersSelected != null) ? selectEmetteur.tiersSelected.idTiers : "";
		} else {
			this.justificatifReglement = null;
			this.alreadyCreatedJustifReg = false;

			app.resetRootDO(rootDO);
			app.resetDO(DO);

			this.listEmetteursJustifByCr = [];

			if (typeDeviseReglement == "1")
				DO.devise = ddrDevise;

			DO.date_emission = null;
		}

		DO.id_document_contractuel = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel');

		app.setBDM(DO);

		if (this.reglement != null) {
			this.contrevaleurMontant = this.reglement.montant_contrevaleur;
			this.contrevaleurDevise = this.reglement.devise_contrevaleur;
			this.contrevaleurDate = this.reglement.date_contrevaleur;

			this.renderContrevaleur();
		}

		// //recuperation devise du reglement
		// if (app.isEmpty(ddrDevise))
		// 	ddrDevise = this.reglement.devise_reglement;

		//si document contractuel
		if (!app.isEmpty(DO.id_document_contractuel)) {
			var documentContractuel = await app.getExternalData(app.getUrl('urlGetDoContractuelById', DO.id_document_contractuel), 'page-reglement > getDocumentContractuel', true);

			if (documentContractuel != null) {
				if (documentContractuel.rubriques != null && documentContractuel.rubriques.length > 0) {
					if (documentContractuel.avance_remboursable != null && documentContractuel.avance_remboursable == '1')
						this.avanceRemboursable = true;
				}
			}

			this.showRubriquesDC = true;

			await app.sleep(150);
		}

		await app.sleep(200);

		appFormio.loadFormIO('justificatifReglement', readJustificatif);

		await app.sleep(100);

		//emetteur
		var idDocument = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel');
		if (idDocument != null) {
			appFormio.setDataValue(crossVars.forms['formio_justificatifReglement'], 'emetteurDC_show', '1');

			await app.sleep(150);

			appFormio.setDataValue(crossVars.forms['formio_justificatifReglement'], 'emetteur', (item != null ? item.emetteur : ""));
		}

		//ANOMALIE 305 lidia
		appFormio.setDataValue(crossVars.forms['formio_justificatifReglement'], 'devise_equivalente', typeDeviseReglement);

		if (!app.isPaiementDirect(this.versement.modalite_paiement))
			this.listEmetteursJustifByCr = await app.getTiersUsedByConcours(this.reglement != null ? this.reglement.numero_concours : this.versement.numero_concours, this.entite, 'JR', (item != null ? item.emetteur : null));

		if (this.reglement != null) {
			if (item != null) {
				//recuperer les infos de l'emetteur selectionne
				var emetteurVar = null;
				if (app.isPaiementDirect(this.versement.modalite_paiement)) {
					emetteurVar = await app.getExternalData(app.getUrl('urlGetBeneficiaireById', item.emetteur), 'page-reglement > addJustif REG', true);
					this.listEmetteursJustifByCr = [emetteurVar];
				}
				else
					emetteurVar = app.getEltInArray(this.listEmetteursJustifByCr, 'idTiers', item.emetteur);

				await app.sleep(250);

				await this.initSelectEmetteur(emetteurVar);

				await this.getEmetteurJustificatifDDR();
			}
			else {
				await this.initSelectEmetteur(null);

				if (this.infosEmetteurJustificatif != null)
					this.infosEmetteurJustificatif().beneficiaire = null;
			}
		}

		await app.sleep(150);

		//ano 2213
		if (app.isPaiementDirectAndMoad(this.versement.modalite_paiement, this.versement.type_versement)) {
			this.teleportDcJustificatif().teleport();
			this.teleportDcJustificatif().show();
			this.teleportRubriques().teleport();
			this.teleportRubriques().show();
		}
		if (this.reglement != null) {
			this.teleportEmetteurJustificatif().teleport();
			this.teleportEmetteurJustificatif().show();
			this.teleportSelectEmetteurJustificatif().teleport();
			this.teleportSelectEmetteurJustificatif().show();
		}

		//si document contractuel
		if (!app.isEmpty(DO.id_document_contractuel)) {
			appFormio.setDataValue(crossVars.forms['formio_justificatifReglement'], 'show_dc', 'show_dc');

			this.document = await app.getExternalData(app.getUrl('urlGetDoContractuelById', DO.id_document_contractuel), 'page-reglement > getDocumentContractuel', true);

			this.infosDcJustificatif = this.document.code_fonctionnel + ' - ' + this.document.libelle;

			await this.rubriquesComponent().getRubriques(this.document.autre_devise != null ? this.document.autre_devise : [], this.document, false, true, false, false, false, (this.document != null ? this.document.rubriques : null), true, item, ddrDevise, this.reglement, null);
		}

		if (item != null && !update)
			await app.refreshModal('modalAddJustificatifReglement');
		else
			app.showModal('modalAddJustificatifReglement');

		this.loadingJustificatif = false;

		this.tableJustificatifsReglement().setClickInProgress(false);

		this.loading = false;
	}

	async saveJustificatifReglement() {
		this.isAddJustificatif = false;

		const selectEmetteur = this.selectEmetteur();
  if (!app.isValidForm('formio_justificatifReglement') ||
			(this.selectEmetteur != null && selectEmetteur.tiersSelected == null)) {
			this.saveJustificatif().setLoadingBtn();
			app.showToast('toastJustificatifsReglementSaveError');
			return;
		}

		var idDC = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel');
		var DO = app.getRootDO('justificatifReglement');

		const rubriquesComponent = this.rubriquesComponent();
  if (!app.isEmpty(idDC) && !DO.deleted) {
			if (!rubriquesComponent.verifSommesMntsRubVentileWithMntJustificatif(this.avanceRemboursable, appFormio.getDataValue(crossVars.forms['formio_justificatifReglement'], 'montant_finance_afd'))) {
				this.saveJustificatif().setLoadingBtn();
				app.showToast('toastMontantsVentilationError');
				return;
			}
			if (this.avanceRemboursable && !rubriquesComponent.verifMntsARembourser(this.resteARembourser)) {
				this.saveJustificatif().setLoadingBtn();
				app.showToast('toastMontantAPayerError');
				return;
			}
			if (!this.avanceRemboursable && !rubriquesComponent.verifRavMontantAPayer()) {
				this.saveJustificatif().setLoadingBtn();
				app.showToast('toastMontantAPayerDCError');
				return;
			}
			if (this.avanceRemboursable && !rubriquesComponent.verifravsRubriquesAR()) {
				this.saveJustificatif().setLoadingBtn();
				app.showToast('toastMontantsRubriqueSaveError');
				return;
			}
		}

		var jutificatifInput = DO.jutificatifInput;

		if (!app.isEmpty(idDC)) {
			var montants = rubriquesComponent.getListeMontantsJustificatifs();
			DO.documentContractuel = rubriquesComponent.getDcAndRubVentile(this.avanceRemboursable, DO.deleted);
			jutificatifInput.montantsJustificatifRubrique = montants;
			jutificatifInput.montant_ventile = rubriquesComponent.getMontantVentileJustif(this.avanceRemboursable);
			jutificatifInput.montant_a_rembourser = (this.document.dossiers_reglements.length == 1) ? null : ((this.avanceRemboursable) ? rubriquesComponent.getMontantARembJustif() : null);
		}

		jutificatifInput.id_dossier_reglement = this.reglement.persistenceId;
		jutificatifInput.emetteur = (this.selectEmetteur != null && selectEmetteur.tiersSelected != null) ? selectEmetteur.tiersSelected.idTiers : "";

		DO.jutificatifInput = jutificatifInput;

		var caseObject = await app.saveFormData(app.getRootDO('justificatifReglement'), crossVars.forms['formio_justificatifReglement'], urls['urlProcessInstanciation'], urls['urlProcessGererJustificatifReglement']);

		await app.sleep(500);

		var caseInfo = await app.getCaseInfo(true, caseObject.caseId, 'page-reglement -> saveJustificatifReglement - caseInfo');

		var caseContext = await app.getCaseContext(true, caseInfo.id, 'page-reglement -> saveJustificatifReglement - caseContext');

		if (!app.getRootDO('justificatifReglement').deleted) {
			if (caseContext[app.getFirstJsonKey(caseContext)].storageId == null) {
				console.error('page-reglement -> saveReglement- saveJustificatifReglement: context.storageId is null');
				return;
			}
		}

		await app.sleep(250);

		this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.reglement.persistenceId), 'page-reglement > getReglement - reglement', true);
		this.justificatifsReglement = this.reglement.justificatifs;

		await app.sleep(250);

		this.tableJustificatifsReglement().getItems();

		this.saveJustificatif().setLoadingBtn();

		await this.getDetailDocumentContractuel();

		await app.sleep(150);
		app.showToast('toastReglementSave');
		await app.sleep(250);

		app.hideModal('modalAddJustificatifReglement');
	}

	sommesJustificatifs() {
		var sommeMontants = 0;
		if (this.justificatifsReglement.length > 0)
			for (var justificatif of this.justificatifsReglement)
				sommeMontants = sommeMontants + justificatif.montant_finance_afd;

		return sommeMontants;
	}

	getMontantARembourserJustificatifByRubrique(id: any, items: any) {
		for (var item of items)
			if (item.id_rubrique == id)
				return item.montant_a_rembourser;
		return '';
	}

	sommeVentilation() {
		var sommeAPayer = 0;
		var sommeMntARembourser = 0;
		var sommeVentilation = 0;
		for (var rubrique of this.rubriquesDC) {
			if (!rubrique.disabled && rubrique.libelle_rubrique != 'Avance remboursable') {
				sommeAPayer += app.convertStringToFloat(rubrique.montant_a_payer);
				sommeMntARembourser += app.convertStringToFloat(rubrique.montant_a_rembourser);
				sommeVentilation = app.convertStringToFloat(sommeAPayer - sommeMntARembourser);
			}
			else if (!rubrique.disabled)
				sommeVentilation = sommeVentilation + app.convertStringToFloat(rubrique.montant_a_payer);
		}
		return sommeVentilation;
	}

	async deleteJustificatifReglement() {
		var DO = app.getRootDO('justificatifReglement');
		DO.deleted = true; //psq deleted est hors l'input

		console.log('page-reglement -> deleteJustificatifReglement : DO ', DO);

		await this.saveJustificatifReglement();

		await app.sleep(700);

		this.tableJustificatifsReglement().getItems();

		this.modalDeleteJustificatifReglement().setLoadingBtn();

		app.showToast('toastJustificatifDeleteSuccess');

		app.hideModal('modalConfirmSuppressionJustificatifReglement');
	}

	async showDeleteConfirmJustificatifReglement() {
		this.currentItem = this.justificatifReglement;

		this.justificatifReglementLabel = this.currentItem.code_fonctionnel + ' ' + this.currentItem.reference;

		this.titleModalConfirmSuppressionJustificatif = lang.delete;

		app.hideModal('modalAddJustificatifReglement');

		app.showModal('modalConfirmSuppressionJustificatifReglement');
	}

	cancelDeleteJustificatifReglement() {
		app.showModal('modalAddJustificatifReglement');
	}

	/* CONTREVALEUR / EQUIVALENT */
	async getContrevaleurEtEquivalent(updateContrevaleur?: any, updateEquivalent?: any) {
		//recuperation devise reglement et montant reglement en fonction du type
		this.contrevaleurTypeDeviseReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
		var montantReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement');
		var deviseReglement = (this.contrevaleurTypeDeviseReglement == '0' ? appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement') : this.deviseSelected);

		//recuperation info devise concours et versement
		var deviseConcours = ((this.concoursSIOP != null) ? this.concoursSIOP.idDevise : null);
		var deviseVersement = ((this.versement != null) ? this.versement.devise : null);
		if (this.contrevaleurTypeDeviseReglement == '0')
			deviseVersement = this.deviseSelected;

		app.log('reglement > getContrevaleurEtEquivalent : deviseConcours/deviseversement/devisereglement/typeDeviseReglement : ', deviseConcours, deviseVersement, deviseReglement, this.contrevaleurTypeDeviseReglement);

		this.deviseReglementChecker = deviseReglement;

		var resultContrevaleur = false;

		if (!app.isEmpty(this.contrevaleurTypeDeviseReglement)
			&& !app.isEmpty(deviseConcours)
			&& !app.isEmpty(deviseReglement)
			&& (this.contrevaleurTypeDeviseReglement != '0' || (this.contrevaleurTypeDeviseReglement == '0' && deviseConcours != deviseVersement))) {
			//on affiche la zone contrevaleur si devise concours differente de devise reglement 
			if (deviseConcours != deviseReglement) {
				//remettre toutes les valeurs à null
				this.contrevaleurDevise = null;
				this.contrevaleurMontant = null;
				this.contrevaleurDate = null;

				//mise à jour des données contrevaleur
				if (updateContrevaleur && montantReglement != null && montantReglement > 0) {
					var devise_cotation = null;
					var devise_reference = null;
					var resultCTX = null;

					// TODO à revoir et a optimiser
					//CAS 1 : deviseConcours = EUR && deviseReference = EUR && deviseReglement != EUR
					if ((deviseConcours == "EUR" && deviseVersement != "EUR" && deviseReglement != "EUR") || (deviseConcours == "USD" && this.deviseSelected == "EUR")) {
						resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), (this.contrevaleurTypeDeviseReglement == '1') ? deviseReglement : deviseVersement, deviseConcours));
						
						this.contrevaleurDevise = deviseConcours;

						if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {
							this.contrevaleurMontant = app.getMontantCTX(app.convertStringToFloat(montantReglement), parseFloat(resultCTX.cours_devises[0].valeur_mid), deviseVersement, deviseConcours);
							this.contrevaleurDate = resultCTX.cours_devises[0].date_valeur;

							app.showToast('toastUpdateReglementEquivalentSuccess');
						} else
							app.showToast('toastUpdateReglementEquivalentError');
					}
					else {
						//CAS EXOTIQUE > EUR/USD OU USD > EUR
						if (((deviseConcours == "EUR" || deviseConcours == "USD") && (deviseReglement != "EUR" || deviseReglement != "USD")) || (deviseConcours == "EUR" && deviseReglement == "USD")) {
							devise_cotation = deviseReglement;
							devise_reference = deviseConcours;
						}
						resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), devise_cotation, devise_reference));

						if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {

							this.contrevaleurDevise = deviseConcours;

							var montantFormate = app.convertStringToFloat(montantReglement);
							var valMid = parseFloat(resultCTX.cours_devises[0].valeur_mid);
							if (((deviseConcours == "EUR" || deviseConcours == "USD") && (deviseReglement != "EUR" || deviseReglement != "USD")) || (deviseConcours == "EUR" && deviseReglement == "USD"))
								this.contrevaleurMontant = montantFormate / valMid;
							else
								this.contrevaleurMontant = montantFormate * valMid;

							this.contrevaleurDate = resultCTX.cours_devises[0].date_valeur;

							app.showToast('toastUpdateReglementContrevaleurSuccess');
						} else
							app.showToast('toastUpdateReglementContrevaleurError');
					}
				}
				this.renderContrevaleur();

				resultContrevaleur = true;
			}
		}
		this.contrevaleurVisible = resultContrevaleur;

		var resultEquivalent = false;
		if (!app.isEmpty(this.contrevaleurTypeDeviseReglement) && !app.isEmpty(deviseVersement) && !app.isEmpty(deviseReglement)) {
			//on affiche la zone equivalent si devise versement differente de devise reglement et seulement pour devise equivalente
			if (this.contrevaleurTypeDeviseReglement == '0' && deviseVersement != deviseReglement) {

				//mise à jour des données equivalent
				if (updateEquivalent && montantReglement != null && montantReglement > 0) {
					this.equivalentDevise = null;
					this.equivalentMontant = null;
					this.equivalentDate = null;

					//CAS 1 : deviseConcours = EUR && deviseReference = EUR && deviseReglement != EUR
					if (deviseConcours == "EUR" && deviseVersement == "EUR" && deviseReglement != "EUR") {
						resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), deviseReglement, deviseConcours));

						if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {
							this.equivalentDevise = deviseReglement;
							this.equivalentMontant = app.getMontantCTX(app.convertStringToFloat(montantReglement), parseFloat(resultCTX.cours_devises[0].valeur_mid), deviseConcours, deviseConcours);
							this.equivalentDate = resultCTX.cours_devises[0].date_valeur;

							app.showToast('toastUpdateReglementEquivalentSuccess');
						} else
							app.showToast('toastUpdateReglementEquivalentError');
					}
					else if (deviseConcours == "EUR" && deviseVersement != "EUR" && deviseReglement == "EUR") {
						resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), deviseVersement, deviseConcours));

						if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {
							this.equivalentDevise = deviseReglement;
							this.equivalentMontant = app.getMontantCTX(app.convertStringToFloat(montantReglement), parseFloat(resultCTX.cours_devises[0].valeur_mid), deviseVersement, deviseConcours);
							this.equivalentDate = resultCTX.cours_devises[0].date_valeur;

							app.showToast('toastUpdateReglementEquivalentSuccess');
						} else
							app.showToast('toastUpdateReglementEquivalentError');
					}
					else {
						resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), deviseVersement, deviseReglement));

						if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {
							this.equivalentDevise = deviseReglement;
							this.equivalentMontant = app.getMontantCTX(app.convertStringToFloat(montantReglement), parseFloat(resultCTX.cours_devises[0].valeur_mid), deviseVersement, deviseReglement);
							this.equivalentDate = resultCTX.cours_devises[0].date_valeur;

							app.showToast('toastUpdateReglementEquivalentSuccess');
						} else
							app.showToast('toastUpdateReglementEquivalentError');
					}
				}

				this.renderEquivalent();

				resultEquivalent = true;
			}
		}
		this.equivalentVisible = resultEquivalent;

		//pour la phrase de rappel
		this.contrevaleurDeviseReglement = app.getRefLabel('refDevises', deviseReglement);
		this.contrevaleurMontantReglement = app.formatNumberWithDecimals(montantReglement);
		this.contrevaleurDeviseVersement = app.getRefLabel('refDevises', deviseVersement);

		//validation du montant saisie
		if (crossVars.forms['formio_reglement' + this.entite] != null) {
			var cmpMntReg = appFormio.findComponent('key', 'montant_reglement', crossVars.forms["formio_reglement" + this.entite], true);
			if (cmpMntReg != null)
				cmpMntReg.checkValidity();
		}
	}

	renderContrevaleur() {
		this.contrevaleurMontantRender = app.formatNumberWithDecimals(this.contrevaleurMontant);
		this.contrevaleurDeviseRender = app.getRefLabel('refDevises', this.contrevaleurDevise);
		this.contrevaleurDateRender = app.formatDate(this.contrevaleurDate);
	}

	renderEquivalent() {
		this.equivalentMontantRender = app.formatNumberWithDecimals(this.equivalentMontant);
		this.equivalentDeviseRender = app.getRefLabel('refDevises', this.equivalentDevise);
		this.equivalentDateRender = app.formatDate(this.equivalentDate);
	}

	updateContrevaleur() {
		if (app.isAFD(this.entite)) {
			app.log('reglement > updateContrevaleur');

			this.getContrevaleurEtEquivalent(true, false);
		}
		else
			this.calculImputationComptable();
	}

	updateEquivalent() {
		app.log('reglement > updateEquivalent');

		this.getContrevaleurEtEquivalent(false, true);
	}

	updateContrevaleurEtEquivalent() {
		this.updateContrevaleur();
		this.updateEquivalent();
		this.changeMontantReglement();
		this.getDetailDocumentContractuel();
	}

	/* CALCULS MONTANTS */
	changeMontantReglement() {
		this.updateContrevaleur();
		this.updateEquivalent();
		this.getDetailDocumentContractuel();
	}

	trim(input: any) {
		return input.trim();
	}

	async changePretAdosse() {
		if (!app.isAFD(this.entite)) {
			var dv = this.infosVersement().versement();
			var idOperation = this.trim(this.concoursSIOP.idOperation);

			var pretAdosse = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_adosse_subvention_seche');
			var pretAutoFinance = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_auto_finance');
			if (pretAdosse != "0") {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'nom_facilite', "");
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'concours_miroir_afd', "");
			}

			var idFamilleTrim = this.concoursSIOP.idFamilleProduit.trim();
			console.warn("dv> ", dv);
			console.warn("dv.devise == 'EUR' > ", dv.devise == 'EUR');
			console.warn("app.getRefLabel('refDeviseVersement', '1') == dv.devise >  ", app.getRefLabel('refDeviseVersement', '1') == dv.devise);
			console.warn("app.getRefLabel('refTypeProduit', '0') == idFamilleTrim >  ", app.getRefLabel('refTypeProduit', '0') == idFamilleTrim);
			console.warn("pretAutoFinance == '1' >  ", pretAutoFinance, '> fff > ', pretAutoFinance == '1');
			console.warn("dv.montant_versement >= 1000000 > ", app.getRefLabel('refDeviseVersement', '1') == dv.devise && app.getRefLabel('refTypeProduit', '0') == idFamilleTrim && pretAutoFinance == '1' && dv.montant_versement >= 1000000);
			
			//NOUVELLES REGLES US NEWV-3049
			if (dv.devise == 'EUR')/*regle1*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '0');
			else if (app.getRefLabel('refDeviseVersement', '0') != dv.devise && app.getRefLabel('refDeviseVersement', '1') != dv.devise)/*regle2*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '-1');
			else if (app.getRefLabel('refDeviseVersement', '1') == dv.devise && (app.getRefLabel('refTypeProduit', '0') == idFamilleTrim || app.getRefLabel('refTypeProduit', '3') == idFamilleTrim) && pretAutoFinance == '-1' && (refs['refIdOperationFvc'][0] != idOperation && refs['refIdOperationFvc'][1] != idOperation))/*regle3*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '1');
			else if (app.getRefLabel('refDeviseVersement', '1') == dv.devise && app.getRefLabel('refTypeProduit', '0') == idFamilleTrim && pretAutoFinance == '1' && dv.montant_versement < 1000000)/*regle4*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '0');
			else if (app.getRefLabel('refDeviseVersement', '1') == dv.devise && app.getRefLabel('refTypeProduit', '0') == idFamilleTrim && pretAutoFinance == '1' && dv.montant_versement >= 1000000)/*regle5*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '1');
			else if (app.getRefLabel('refDeviseVersement', '1') == dv.devise && app.getRefLabel('refTypeProduit', '1') == idFamilleTrim && dv.montant_versement < 1000000)/*regle6*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '0');
			else if (app.getRefLabel('refDeviseVersement', '1') == dv.devise && app.getRefLabel('refTypeProduit', '1') == idFamilleTrim && (refs['refIdOperationFvc'][0] != idOperation && refs['refIdOperationFvc'][1] != idOperation) && dv.montant_versement >= 1000000)/*regle7*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '1');
			else if (app.getRefLabel('refDeviseVersement', '1') == dv.devise && (refs['refIdOperationFvc'][0] == idOperation || refs['refIdOperationFvc'][1] == idOperation))/*regle8*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '0');
			else if (app.isReversement(dv.modalite_paiement))/*new regle 9*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '0');
			else if (dv.devise == 'USD' && (app.getRefLabel('refTypeProduit', '0') == idFamilleTrim || app.getRefLabel('refTypeProduit', '3') == idFamilleTrim) && pretAutoFinance == '-1' &&
				(refs['refIdOperationFvc'][0] == idOperation || refs['refIdOperationFvc'][1] == idOperation))/*new regle 9*/
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', '0');

		}
	}

	async getMontantDDR() {
		this.versement = await app.getExternalData(app.getUrl('urlGetVersement', (this.versement == null ? this.route.snapshot.paramMap.get('idVersement') : this.versement.persistenceId)), 'page-reglement > getMontantDDR', true);

		var montantsDDR = await app.montantsDDR(this.versement, (this.reglement != null ? this.reglement.persistenceId : null));

		this.montantNewDDR = this.versement.montant_versement - montantsDDR;

		//refresh de la liste des devises
		this.devisesReglement = [{ code: this.versement.devise, label: app.getRefLabel('refDevises', this.versement.devise) }];
		for (var autreDevisesVersement of this.versement.autresDevises)
			this.devisesReglement.push({ code: autreDevisesVersement.devise, label: app.getRefLabel('refDevises', autreDevisesVersement.devise) });
	}

	async calculImputationComptable() {
		if (this.reglement != null)
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'imputation_comptable', this.reglement.imputation_comptable);
		else {
			this.versement = await app.getExternalData(app.getUrl('urlGetVersement', (this.versement == null ? this.route.snapshot.paramMap.get('idVersement') : this.versement.persistenceId)), 'page-reglement > getMontantDDR', true);

			var typeDevise = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
			var typeAt = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_at');

			var deviseReg = ((typeDevise == "1") ? appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement') : appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reference'));

			await app.sleep(100);

			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'imputation_comptable', app.getImputationComptable(this.versement, deviseReg, this.concoursSIOP, typeAt));
		}
	}

	async impayesSirpIsPositif() {
		return this.concoursSIOP.impayesSIRP > 0;
	}

	/* TOGGLE BUTTON */
	selectToggleTypeDeviseBeforeSet() {
		var typeDevise = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
		if (app.isAFD(this.entite)) {
			this.toggleDeviseReglement = this.deviseSelected;
			this.toggleAutreDeviseReglement = (typeDevise == "0" ? appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement') : '');
		}
		else {
			this.toggleDeviseReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement');
			this.toggleAutreDeviseReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reference');
		}
		this.toggleMontantReglement = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement');

		if ((!app.isAFD(this.entite) && appFormio.findComponent('key', 'devise_reference', crossVars.forms['formio_reglement' + this.entite], true) == null) || (app.isAFD(this.entite) && typeDevise == "1"))
			this.toggleAutreDeviseReglement = app.getStorageItem('reglement_autre_devise');

		/* mis en commentaire le 20/09/23 suite ano 2113
		if (!app.isAFD(this.entite) && typeDevise == "1" && !this.initToggleDeviseReglement) { //flag pour réinitialiser la devise de versement pour proparco
			this.toggleDeviseReglement = '';
			this.initToggleDeviseReglement = true;
		}*/
	}

	selectToggleTypeDeviseAfterSet(value: any) {
		var typeDevise = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'type_devise');
		if (app.isAFD(this.entite))
			this.getLabelDeviseByTypeDeviseRegSelected(typeDevise);

		if ((!app.isAFD(this.entite) && typeDevise != "0") || (app.isAFD(this.entite) && typeDevise == "0"))
			appFormio.setDataValueVisible(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement', (!app.isAFD(this.entite) ? this.toggleDeviseReglement : this.toggleAutreDeviseReglement));
		else if (!app.isAFD(this.entite) && typeDevise == "0")
			appFormio.setDataValueVisible(crossVars.forms['formio_reglement' + this.entite], 'devise_reglement', '');
		else
			this.deviseSelected = this.toggleDeviseReglement;

		// appFormio.setDataValueVisible(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement', this.toggleMontantReglement);
		appFormio.setDataValueVisible(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement', ''); //reset du montant reglement when change Select toggle type_devise
		if (!app.isAFD(this.entite))
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'devise_reference', this.toggleAutreDeviseReglement);

		app.setStorageItem('reglement_autre_devise', this.toggleAutreDeviseReglement);

		this.getContrevaleurEtEquivalent();
	}

	/* DIVERS */
	async downloadFile(reglement: any) {
		await app.downloadDocument(reglement);
	}

	async changeDisabledField() {
		var pret_adosse = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_adosse');
		if (pret_adosse != "0") {
			appFormio.setProperty(crossVars.forms['formio_reglement' + this.entite].getComponent('nom_facilite').component, 'disabled', true);
			appFormio.setProperty(crossVars.forms['formio_reglement' + this.entite].getComponent('concours_miroir_afd').component, 'disabled', true);
		}
	}

	showEditeButton() {
		appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_dc_by_role', '');

		var valeurToggleBtn = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'dc_attache');
		if (valeurToggleBtn == '0') {
			if (this.infosDc != null)
				this.infosDc().documentContractuel = null;
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel', '');
		}
		else if ((valeurToggleBtn == '1') && ((this.reglement != null && !this.read && app.isAgentVersement(this.role)) || this.reglement == null))
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_dc_by_role', 'true');
	}

	validateErrorDDRPaysExecution() {
		this.checkPaysExecution = false;

		this.validerTache(true);

		this.modalMessagePaysExecution().setLoadingBtn();

		app.hideModal('modalMessagePaysExecution');
	}

	cancelErrorDDRPaysExecution() {
		app.hideModal('modalMessagePaysExecution');
	}

	verifPaysExecution() {
		var montantDDR = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'montant_reglement');
		var lieuExec = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'lieu_execution');

		if ((this.deviseSelected == "EUR" && montantDDR > 75000) || (this.contrevaleurDevise == "EUR" && this.contrevaleurMontant > 75000) || (this.equivalentDevise == "EUR" && this.equivalentMontant > 75000)) {
			return (lieuExec != "FR");
		}
		else
			return false;
	}

	verifMontantDDR(input: any) {
		if (app.isAFD(this.entite)) {
			var montantNewDDR = this.getMontantNewDdrByDevise(); //ecart par devise
			this.montantDdrNotSupRav = this.montantNewDdrSupRav(input);
			this.montantDdrNotSupRavConcours = this.montantNewDdrSupRavConcours(input);

			if (this.montantOldDDR == null)
				this.montantOldDDR = 0;

			this.montantDdrNotSupDv = (montantNewDDR + this.montantOldDDR) >= input;

			if (app.isAvance(this.versement.modalite_paiement)) {
				this.montantPlafondAvance = this.infosAvance().montantPlafondAvance;
				this.montantDdrNotSupPlaf = this.montantPlafondAvance == null || this.montantPlafondAvance >= input;

				return (this.montantDdrNotSupPlaf && this.montantDdrNotSupRav && this.montantDdrNotSupDv && this.montantDdrNotSupRavConcours && input != 0);
			}
			else
				return (this.montantDdrNotSupRav && this.montantDdrNotSupDv && this.montantDdrNotSupRavConcours && input != 0);
		}
		else if (app.isAvanceOrRefinancement(this.versement.modalite_paiement, this.entite)) {
			this.montantPlafondAvance = this.infosAvance().montantPlafondAvance;
			this.montantDdrNotSupPlaf = this.montantPlafondAvance == null || this.montantPlafondAvance >= input;

			return (this.montantDdrNotSupPlaf && input != 0);
		}
		return true;
	}

	//methode pour savoir quel message d'erreur à afficher quand le controle sur le montant de la DDR n'est pas verifie
	getMessagesErrorMontantDDR(input: any) {
		var deviseReglement = this.deviseSelected;

		if (input == 0)
			return lang.errorValueEqualsZero;
		else if (app.isEmpty(deviseReglement))
			return true;
		else if (!this.montantDdrNotSupDv)
			return lang.errors.reglement.errorMontantReglement;
		else if (!this.montantDdrNotSupRav)
			return lang.errors.reglement.errorMontantReglementSupRav;
		else if (!this.montantDdrNotSupRavConcours)
			return lang.errors.reglement.errorMontantReglementSupRavConcours;
		if (!this.montantDdrNotSupPlaf)
			return lang.errors.reglement.errorMontantReglementSupPlafond;
	}

	//methode pour mettre a jour le RAV lors de la ventilation des rubriques
	updateRavRubrique(rubrique: any) {
		var montantApaye = app.convertStringToFloat(rubrique.montant_a_payer);
		if ((montantApaye.toString().match(/^[0-9,]+$/) != null || app.isEmpty(rubrique.montant_a_payer))) {
			var montantApayeDisabled = app.convertStringToFloat(rubrique.montant_a_payer_disabled);
			var ravDisabled = app.convertStringToFloat(rubrique.ravDisabled.split(' ')[0]);
			var resultDifference = (this.justificatifReglement == null ? (ravDisabled - montantApaye) : (rubrique.montant_rubrique - ((rubrique.sommeMontantJustificatifs - montantApayeDisabled) + montantApaye)));

			return app.formatNumberWithDecimals(resultDifference)
				+ ' ' + rubrique.devise_rubrique;
		}
		return rubrique.renderRAVRubriquesJustificatifs;
	}

	//AVANCE REMBOURSABLE
	renderPourcentageAvance(value: any) {
		if (value != null)
			return value + ' %';
		return '';
	}

	renderMontantAvance(montant: any, devise: any) {
		if (montant != null && devise != null)
			return app.formatMontantTrigramme(app.formatNumberWithDecimals(montant), devise);
		return '';
	}

	async initSelectBeneficiaire(tierReglement?: any) {
		await this.selectbeneficaire().initSelectBeneficaire(this.listTiersByConcours, this.read, 'DR', tierReglement);
	}

	verifFormulaireReglement() {
		return (app.isValidForm('formio_reglement' + this.entite) && !this.selectbeneficaire().checkSelectedBeneficiaire() && !this.infosCoordonneeBancaire().checkCoordonneeBancaire());
	}

	getLabelDeviseByTypeDeviseRegSelected(typeDevise: any) {
		if (typeDevise == "0")
			this.labelDeviseSelected = lang.reglement.deviseReference;
		else
			this.labelDeviseSelected = lang.reglement.deviseReglement;
	}

	filterConcoursByResteAVerser(concours: any, concoursGCF: any) {
		// Step 1: Filter concoursGCF by "resteAVerser" not equal to 0
		const filteredConcoursGCF = concoursGCF.filter((concours: { resteAVerser: number; }) => concours.resteAVerser !== 0);

		// Step 2: Get the list of "numeroConcours" from the filteredConcoursGCF
		const numeroConcoursList = filteredConcoursGCF.map((concours: { numeroConcours: any; }) => concours.numeroConcours);

		// Step 3: Filter concours to have the same array of objects based on numeroConcours
		const filteredConcours = concours.filter((concours: { numeroConcours: any; }) => numeroConcoursList.includes(concours.numeroConcours));

		return filteredConcours;
	}
}