import { ChangeDetectorRef, Component, OnInit, input, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent  } from '../../components/modal/modal.component';
import { SelectBeneficiaireComponent  } from '../../components/select-beneficiaire/select-beneficiaire.component';
import { InfosBeneficiaireComponent  } from '../../components/infos-beneficiaire/infos-beneficiaire.component';
import { TableComponent  } from '../../components/table/table.component';
import { TeleportComponent  } from '../../components/teleport/teleport.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { TypeAvanceComponent } from '../../components/type-avance/type-avance.component';
import { StoreService } from '../../services/store.service';


declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;
declare const urls: any;
declare const formFields: any;
declare const refs: any;

@Component({
    selector: 'app-avance',
    templateUrl: './avance.component.html',
    standalone: true,
    imports: [NgIf, NavActionsComponent, BtnComponent, ContentComponent, NgClass, CardComponent, InfosContextComponent, TeleportComponent, TableComponent, InfosBeneficiaireComponent,
		 SelectBeneficiaireComponent, NgFor, ModalComponent]
})
export class AvanceComponent implements OnInit {

	readonly infosContext = viewChild.required<InfosContextComponent>('infosContext');
	readonly typeAvance = viewChild.required<TypeAvanceComponent>('typeAvance');
	readonly btnValidateAvance = viewChild.required<BtnComponent>('btnValidateAvance');
	readonly btnSaveAvance = viewChild.required<BtnComponent>('btnSaveAvance');
	readonly modalSaveAvenant = viewChild.required<ModalComponent>('modalSaveAvenant');
	readonly teleportTypeAvance = viewChild.required<TeleportComponent>('teleportTypeAvance');
	readonly saveJustificatif = viewChild.required<ModalComponent>('saveJustificatif');
	readonly tableJustificatifsAvance = viewChild.required<TableComponent>('tableJustificatifsAvance');
	readonly teleportJustificatifAvance = viewChild.required<TeleportComponent>('teleportJustificatifAvance');
	readonly tableTypesAvance = viewChild.required<TableComponent>('tableTypesAvance');
	readonly modalSaveTypeAvance = viewChild.required<ModalComponent>('modalSaveTypeAvance');
	readonly modalDeleteTypeAvance = viewChild.required<ModalComponent>('modalDeleteTypeAvance');
	readonly modalDeleteJustificatif = viewChild.required<ModalComponent>('modalDeleteJustificatif');
	readonly modalConfirmationAddJustificatifAvance = viewChild.required<ModalComponent>('modalConfirmationAddJustificatifAvance');
	readonly teleportAudit = viewChild.required<TeleportComponent>('teleportAudit');
	readonly selectEmetteurAvance = viewChild.required<SelectBeneficiaireComponent>('selectEmetteurAvance');
	readonly infosEmetteurJustificatifAvance = viewChild.required<InfosBeneficiaireComponent>('infosEmetteurJustificatifAvance');
	readonly teleportEmetteurJustificatifAvance = viewChild.required<TeleportComponent>('teleportEmetteurJustificatifAvance');
	readonly teleportSelectEmetteurJustificatifAvance = viewChild.required<TeleportComponent>('teleportSelectEmetteurJustificatifAvance');

	readonly paramAC = input<any>();
	readonly paramDR = input<any>();

	showTypeAvance: boolean = false;
	avanceContractuel: any = null;
	avenant: any = null;
	deviseVersement: any;
	DOAvenant: any;
	idReglement: any = null;
	justificatifUpdate: any = null;
	justificatifsAvance: any = [];
	showJustificatifsAvance: any = false;
	emetteurJustificatif: any = null;
	reglement: any = null;
	versement: any = null;
	lang: any = lang;
	caseId: any = null;
	notShowTypeAvance: boolean = true;
	typeAvanceUpdate: any = null;
	type: string = '';
	typesAvance: any = [];
	typesAvanceByTypeSelected: any = [];
	typeAvances: string = 'typesAvance';
	typeAvanceItem: any;
	montant: number = 0;
	countDdrByAvance: number = 0;
	libelle: string = '';
	typeAvanceLabel: string = '';
	justificatifLabel: string = '';
	deviseCode: string = '';
	deviseLabel: string = '';
	numeroTypeAvance: string = '';
	labelTypeAvance: string = '';
	typesAvances: any;
	itemsByPage: any;
	iconeModalTypeAvance: string = "plus";
	titleModalTypeAvance: any;
	titleModalConfirmSuppressionTypeAvance: any;
	titleModalConfirmSuppressionJustificatif: any;
	read: any = false;
	role: any;
	formioToBeLoaded: any;
	app: any = app;
	entite: string = '';
	currentItem: any;
	alreadyCreated: boolean = false;
	alreadyCreatedJustif: boolean = false;
	testDelete: boolean = false;
	listTypesAvanceAfterDeleteAction: any = [];
	testDeleteJustif: boolean = false;
	audits: any = [];
	checkAudit: boolean = false;
	checkDernierJustif: boolean = false;
	dernierJustifValue: boolean = false;
	disabledCheckBoxDernierJustif: boolean = false;
	//variables utilisées pour emetteur-justficatif-avance
	listEmetteursAvanceByCr: any = [];
	showSidebar: boolean = true;
	isDCV: boolean = false;
	perimetre: any;
	resteJustifierDecaisserDossier: any;
	resteJustifier: any;
	montantVerseTotal: any;
	currencySuffix: any;
	formFields: any = formFields;
	showRepriseVersement: boolean = false;
	loading: boolean = true;
	idVersement: any;
	acRepris: boolean = false;
	objectParentRepris: boolean;

	constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, public store: StoreService) { }

	ngOnInit() {
		app.setStorageItem('idAvanceContractuel', null);

		this.role = this.store.getUserRole();
		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		app.setCurrentCmp('avance', this);
		app.setCurrentCmp('reglement', this);
	}

	async ngAfterViewInit() {
		if (this.paramAC() == null)
			await this.getAvance();
		else {
			//si accès depuis modal, on vide les forms pour eviter les doubles chargements de teleports
			app.cleanDiv('formio_avanceContractuel' + this.entite);
			app.cleanDiv('formio_avanceContractuelAFDFinal');
			app.cleanDiv('formio_avanceContractuelPROPARCOFinal');
		}
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}
	verifMontantDDR(input: any) { }

	getMessagesErrorMontantDDR(input: any) { }

	async getAvance() {
		console.time('avance');

		this.loading = true;

		this.read = !(app.isAgentVersement(this.role) || app.isChargeAppui(this.role));

		//recup de l'avance contractuelle
		this.avanceContractuel = null;
		var id = this.route.snapshot.paramMap.get('id');
		const paramAC = this.paramAC();
  if (id != null && paramAC == null)
			this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvanceContractuel', id), 'page-avance > getAvance', true);
		else if (this.paramAC != null) {
			this.avanceContractuel = paramAC;
			this.read = true;
		}

		app.log('avance.getAvance - avanceContractuel', this.avanceContractuel);

		if (id == null)
			app.resetDO('avanceContractuel');

		var DO = app.copyJson(app.getDO('avanceContractuel'));

		var numeroConcours = app.getStorageItem('numeroConcours');
		if (this.avanceContractuel != null)
			numeroConcours = this.avanceContractuel.numero_concours;

		var numeroProjet = app.getStorageItem('numeroProjet');
		var deviseVersement = app.getStorageItem('deviseVersement');
		this.idVersement = app.getStorageItem('idVersement');
		var concoursByProjet = [];

		// VERIFIER SI L AVANCE A ETE UTILISE / ON ACCEDE DEPUIS LE REGLEMENT
		if (!app.isEmpty(this.avanceContractuel))
			this.countDdrByAvance = await app.getExternalData(app.getUrl('urlGetCountDdrByIdAvanceContractuel', (this.avanceContractuel.persistenceId)), 'page-avance > getAvance', true);

		if (!this.read) {
			var nameForm = this.avanceContractuel != null && app.isAFD(this.entite) ? 'avanceContractuelAFDFinal' : 'avanceContractuelPROPARCOFinal';
			var indexNumeroConcours = app.getIndexElementInArrayByValue(formFields[nameForm], 'name', 'numero_concours');
			formFields[nameForm][indexNumeroConcours].read = false;

			if (app.isEmpty(numeroProjet) || this.countDdrByAvance > 0)
				formFields[nameForm][indexNumeroConcours].read = true;
		}

		if (this.idVersement != null) {
			this.versement = await app.getExternalData(app.getUrl('urlGetVersement', this.idVersement), 'page-avance > getAvance- versement', true);
			this.deviseVersement = this.versement.devise;
		}

		this.idReglement = app.getStorageItem('idReglement');
		const paramDR = this.paramDR();
  if (this.idReglement != null && paramDR == null) {
			this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.idReglement), 'page-avance > getAvance - reglement', true);
			this.versement = await app.getExternalData(app.getUrl('urlGetVersementByNumero', this.reglement.numero_dossier_versement), 'page-avance > getAvance- versement', true);
			this.deviseVersement = this.versement.devise;
		} else if (this.paramDR != null)
			this.reglement = paramDR;

		this.caseId = (this.idReglement == null) ? 0 : this.reglement.case_id;

		var concours = null;
		if (!app.isEmpty(numeroConcours))
			concours = await app.getAllDataConcoursById(numeroConcours);

		if (this.avanceContractuel != null) {
			this.acRepris = !app.isEmpty(this.avanceContractuel.obj_ext_id);

			app.mapDO(DO, this.avanceContractuel);
			if (app.isEmpty(this.avenant) && !app.isEmpty(this.avanceContractuel.avenant))
				this.avenant = this.avanceContractuel.avenant;

			if (!app.isEmpty(this.avenant) && app.isAFD(this.entite)) {
				if (this.avenant.date_ljf_final != null)
					DO.date_ljf_final = this.avenant.date_ljf_final;

				if (this.avenant.pourcentage_final_dernier_versement != null)
					DO.pourcentage_final_dernier_versement = this.avenant.pourcentage_final_dernier_versement;

				if (this.avenant.date_luf_final != null)
					DO.date_limite_utilisation_fond_final = this.avenant.date_luf_final;
			}
			if (!app.isAFD(this.entite))
				DO.date_limite_utilisation_fond_final = appFormio.getDataValue(crossVars.forms['formio_avanceContractuelPROPARCOFinal'], 'date_limite_utilisation_fond_final');

			//ANO 2857 latence saisie AC
			this.justificatifsAvance = this.avanceContractuel.justificatifsAvance;
			for (var ja of this.justificatifsAvance)
				ja.renderEmetteur = app.getRefLabel('refBeneficiaires', ja.emetteur);
			DO.numero_avance_contractuel = this.avanceContractuel.code_fonctionnel;
			DO.montant_verse_total = app.formatNumberWithDecimals(this.avanceContractuel.montant_verse_total);
			DO.montant_justifie_total = app.formatNumberWithDecimals(this.avanceContractuel.montant_justifie_total);
			DO.raj_reste_justifier_total = app.formatNumberWithDecimals(app.getResteJustifier(this.avanceContractuel.montant_verse_total, this.avanceContractuel.montant_justifie_total));
			//EVOL 2509 => RAJ DESACTIVEE POUR LES AVANCES MIGREES
			DO.raj_decaisser_dossier = (!this.acRepris ? app.formatNumberWithDecimals(app.getResteJustifierDecaisserDossier(this.avanceContractuel)) : '-');
			DO.devise_avance = this.avanceContractuel.devise_avance;
		} else if (numeroConcours != null && deviseVersement != null) {
			DO.numero_concours = numeroConcours;
			DO.devise_avance = concours.idDevise;

			this.deviseVersement = deviseVersement;
		}

		if (this.avanceContractuel == null)
			DO.pourcentage_initial_dernier_versement = 80;

		if (numeroProjet != null) {
			var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', numeroProjet), 'page-avance > getAvance- projet > ', true);
			concoursByProjet = projet.listConcours;
		}

		app.setRef(concoursByProjet, 'concoursByProjet', 'numeroConcours', 'numeroConcours');

		this.teleportTypeAvance().unteleport();
		this.teleportJustificatifAvance().unteleport();
		if (!app.isAFD(this.entite))
			this.teleportAudit().unteleport();

		app.cleanDiv('formio_avanceContractuel' + this.entite);
		app.cleanDiv('formio_avanceContractuelAFDFinal');
		app.cleanDiv('formio_avanceContractuelPROPARCOFinal');

		app.setBDM(DO);

		if (this.avanceContractuel != null) {
			if (app.isAFD(this.entite)) {
				appFormio.loadFormIO('avanceContractuelAFDFinal', this.read);
				this.formioToBeLoaded = 'formio_avanceContractuelAFDFinal';
			}
			else {
				if (this.countDdrByAvance > 0) {
					appFormio.loadFormIO('avanceContractuelPROPARCOFinal', this.read);
					this.formioToBeLoaded = 'formio_avanceContractuelPROPARCOFinal';
				} else {
					appFormio.loadFormIO('avanceContractuel' + this.entite, this.read);
					this.formioToBeLoaded = 'formio_avanceContractuel' + this.entite;
				}
			}
		} else {
			appFormio.loadFormIO('avanceContractuel' + this.entite, this.read);
			this.formioToBeLoaded = 'formio_avanceContractuel' + this.entite;
		}

		await app.sleep(250);

		appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'numero_concours', numeroConcours);

		if (!app.isEmpty(concours))
			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'dlvf', concours.dlvf);

		if (this.formioToBeLoaded == 'formio_avanceContractuelAFDFinal' && this.avanceContractuel != null)
			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'date_ljf_initial', this.avanceContractuel.date_ljf_initial);

		if (this.formioToBeLoaded == 'formio_avanceContractuelPROPARCOFinal' && this.avanceContractuel != null)
			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'date_limite_utilisation_fond_final', this.avanceContractuel.date_limite_utilisation_fond_final);

		this.teleportTypeAvance().teleport();
		this.teleportTypeAvance().show();
		this.teleportJustificatifAvance().teleport();
		this.teleportJustificatifAvance().show();

		//NOUR + ARNAUD : audit formio in teleport
		if (!app.isAFD(this.entite)) {
			this.teleportAudit().teleport();
			this.teleportAudit().show();

			if (this.avanceContractuel != null && this.avanceContractuel.audit.length > 0) {
				for (var i = 0; i < this.avanceContractuel.audit.length; i++) {
					await this.addAudit();

					await app.sleep(250);

					appFormio.setDataValue(crossVars.forms['formio_avanceAudit_' + i], 'date_reception_rapport_annuel', this.avanceContractuel.audit[i].date_reception_rapport_annuel);
					appFormio.setDataValue(crossVars.forms['formio_avanceAudit_' + i], 'lien_rom_audit', this.avanceContractuel.audit[i].lien_rom_audit);
				}
			} else
				await this.addAudit();
		}
		if (this.avanceContractuel != null) {
			this.tableJustificatifsAvance().getItems();
			if (DO.choix_type_avance != null && DO.choix_type_avance.length != 0) {
				appFormio.selectToggle(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance', DO.choix_type_avance);

				await this.getTypesAvance(DO.choix_type_avance, true);

				await app.sleep(250);

				if (DO.choix_plafond != null && DO.choix_plafond.length != 0) {
					appFormio.selectToggle(crossVars.forms[this.formioToBeLoaded], 'choix_plafond', DO.choix_plafond);
					if (this.read)
						app.disableToggle(crossVars.forms[this.formioToBeLoaded], 'choix_plafond');
				}
			}

			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'avenant_hidden', '0');
			if (this.avenant != null)
				appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'avenant_hidden', '1');
		}

		if (this.read)
			app.disableToggle(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance');

		this.showCheckBoxDernierJustif();
		this.loading = false;

		console.timeEnd('avance');
	}

	async getTypesAvance(value: any, isAdd?: any) {
		this.type = value;
		this.labelTypeAvance = app.getRefLabel('refLabelTypeAvance', value);

		this.typesAvanceByTypeSelected = [];
		// this.typesAvances = 'typesAvance' + app.getRefLabel('refTypeAvance', value);

		for (var ref of refs['refTypeAvance'])
			if (ref.code == value)
				this.typesAvances = ref.key;

		if (this.deviseVersement != null) {
			this.deviseCode = this.deviseVersement;
			this.deviseLabel = app.getRefLabel('refDevises', this.deviseCode);
		}

		if (this.avanceContractuel != null && this.avanceContractuel.choix_type_avance == this.type && this.typesAvance.length == 0) {
			this.typesAvanceByTypeSelected = this.avanceContractuel.typesAvance;
			this.typesAvance = this.avanceContractuel.typesAvance;

			if (this.typesAvance.length != 0) {
				this.deviseCode = this.typesAvance[0].devise;
				this.deviseLabel = app.getRefLabel('refDevises', this.deviseVersement);
			}
		} else if (this.typesAvance.length != 0) {
			var listResult = [];
			for (var typeAvance of this.typesAvance) {
				if (typeAvance.type == this.type)
					listResult.push(typeAvance);
			}
			this.typesAvanceByTypeSelected = listResult;
		}
		this.showTypeAvance = true;

		if (app.isAFD(this.entite) && this.typesAvanceByTypeSelected.length != 0 && isAdd)
			app.disableToggle(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance');

		this.itemsByPage = this.typesAvanceByTypeSelected.length;

		await app.sleep(250);

		var choixTypeAvance = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance');
		if (choixTypeAvance == 0 || choixTypeAvance == 2)
			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_plafond_hidden', '1');
		else {
			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_plafond_hidden', '');
			appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_plafond', '');
		}

		this.tableTypesAvance().getItems();
	}

	async saveAvance(back: any) {
		if (!app.isValidForm(this.formioToBeLoaded)) {
			this.btnSaveAvance().setLoading(false);

			app.showToast('toastAvanceSaveError');
			return;
		}

		if (this.tableAvanceError()) {
			this.btnSaveAvance().setLoading(false);

			app.showToast('toastAvanceSaveError');
			return;
		}

		var numConcours = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'numero_concours');
		var concours = await app.getAllDataConcoursById(numConcours);
		var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', concours.numeroProjet), 'page-avance > getProjet - projet', true);

		if (this.verifAvance(concours))
			return;

		var DO = app.getDO('avanceContractuel');

		if (this.avanceContractuel != null)
			DO.persistence_id = this.avanceContractuel.persistenceId;
		else
			DO.persistence_id = 0;

		DO.entite = this.entite;
		DO.numero_projet = projet.numeroProjet;
		DO.produit_financier = (!app.isEmpty(concours.produit) ? concours.produit.idProduit : '');
		DO.libelle_projet = projet.nomProjet;
		DO.agence_gestion = projet.idAgenceGestion;
		DO.avenant = this.avenant;

		if (appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance').length != 0) {
			var listeResult = [];
			for (var typeAvance of this.typesAvanceByTypeSelected) {
				if (!typeAvance.deleted)
					listeResult.push(typeAvance);
			}
			DO.typesAvance = listeResult;
		}

		//NOUR + ARNAUD : save formio included in teleport (audit PROPARCO)
		if (this.audits != null && !app.isAFD(this.entite)) {
			for (var i = 0; i < this.audits.length; i++) {
				var dateReceptionAnnuel = appFormio.getDataValue(crossVars.forms['formio_avanceAudit_' + i], 'date_reception_rapport_annuel');
				var lienRomeAudit = appFormio.getDataValue(crossVars.forms['formio_avanceAudit_' + i], 'lien_rom_audit');
				if ((!app.isEmpty(dateReceptionAnnuel) && !app.isEmpty(lienRomeAudit)) || (app.isEmpty(dateReceptionAnnuel) && !app.isEmpty(lienRomeAudit))) {
					this.audits[i].date_reception_rapport_annuel = (dateReceptionAnnuel == '' ? null : dateReceptionAnnuel);
					this.audits[i].lien_rom_audit = lienRomeAudit;
				}
			}
			if (this.audits.length == 1 && app.isEmpty(dateReceptionAnnuel) && app.isEmpty(lienRomeAudit))
				this.audits = [];
			DO.audit = this.audits;
		}

		//apply rule to control the sum of tranches amounts
		var typeAvance = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance');

		var caseObject = await app.saveFormData(app.getRootDO('avanceContractuel'), crossVars.forms[this.formioToBeLoaded], app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateAddAvance'));

		await app.sleep(500);

		if (back) {
			var caseInfo = await app.getCaseInfo(true, caseObject.caseId, 'page-avance -> saveAvance - caseInfo');

			var caseContext = await app.getCaseContext(true, caseInfo.id, 'page-avance -> saveAvance - caseContext');

			if (caseContext[app.getFirstJsonKey(caseContext)].storageId == null) {
				console.error('page-avance -> saveAvance : context.storageId is null');
				return;
			}

			var idAvanceContractuel = caseContext[app.getFirstJsonKey(caseContext)].storageId;
			var originGotoAvance = app.getStorageItem('originGoto');

			app.setStorageItem('idAvanceContractuel', idAvanceContractuel);
			app.setStorageItem('idDocumentContractuel', null);

			await app.sleep(250);

			app.log("originGotoAvance > ", originGotoAvance);

			if (!app.isEmpty(originGotoAvance) && originGotoAvance == 'projet') {
				app.log("page-avance -> saveAvance > originGotoAvance NOT NULL > ");
				app.setStorageItem('originGoto', '');
				app.setStorageItem('numeroProjet', null);
				app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'AVANCE'));
			} else {
				app.log("page-avance -> saveAvance >  originGotoAvance IS NULL > ");

				//RESET LES STORAGES ITEMS
				app.setStorageItem('numeroConcours', null);
				app.setStorageItem('deviseVersement', null);
				app.setStorageItem('idVersement', null);

				//CAS ACCES DEPUIS LE FORMULAIRE ADD DDR
				if (this.idReglement == null && !app.isEmpty(this.idVersement))
					app.redirect(this.router, app.getUrl('urlAddReglement', this.idVersement));
				// CAS ACCES DEPUIS LE FORMULAIRE MODIF DDR
				else if (!app.isEmpty(this.idReglement))
					app.redirect(this.router, app.getUrl('urlGotoReglement', this.idReglement));
				// CAS ACCES DEPUIS LE LIEN MIS DANS LE MAIL
				else if (!app.isEmpty(this.avanceContractuel) && !app.isEmpty(this.avanceContractuel.numero_projet))
					app.redirect(this.router, app.getUrl('urlGotoProjetsType', this.avanceContractuel.numero_projet, 'AVANCE'));
			}
		}
		else if (this.btnSaveAvance != null)
			this.btnSaveAvance().setLoading(false);
	}

	verifAvance(concours: any) {
		var errorSave = false;

		if (!this.checkAudits()) {
			this.btnSaveAvance().setLoading(false);
			app.showToast('toastAvanceSaveError');
			errorSave = true;
		}

		return errorSave;
	}

	addAvenant() {
		this.DOAvenant = {
			"pourcentage_final_dernier_versement": null,
			"date_ljf_final": null,
			"date_luf_final": null
		};
		// this.DOAvenant = app.copyJson(app.getDO('avanceContractuel')).avenant; ANO2775

		if (!app.isEmpty(this.avenant))
			app.mapDO(this.DOAvenant, this.avenant);

		this.DOAvenant.pourcentage_initial_dernier_versement = this.avanceContractuel.pourcentage_initial_dernier_versement;
		this.DOAvenant.date_ljf_initial = this.avanceContractuel.date_ljf_initial;
		this.DOAvenant.date_limite_utilisation_fond = this.avanceContractuel.date_limite_utilisation_fond;
		this.DOAvenant.date_luf_final = this.avanceContractuel.date_limite_utilisation_fond_final;

		app.setBDM(this.DOAvenant);

		appFormio.loadFormIO('avenant');

		app.showModal('modalAddAvenant');
	}

	async saveAvenant() {
		if (!app.isValidForm('formio_avenant')) {
			this.modalSaveAvenant().setLoadingBtn();
			app.showToast('toastJAvenantSaveError');
			return;
		}

		var DOAvenant = app.getDO('avanceContractuel').avenant;
		if (DOAvenant == null) {
			DOAvenant = {
				"pourcentage_final_dernier_versement": null,
				"date_ljf_final": null,
				"date_luf_final": null
			};
		}
		var DO = { DOAvenant };

		this.avenant = await app.saveFormData(DO, crossVars.forms['formio_avenant']);
		this.avenant = this.avenant[app.getFirstJsonKey(this.avenant)];

		this.avanceContractuel.typesAvance = this.typesAvanceByTypeSelected;

		await this.getAvance();

		this.modalSaveAvenant().setLoadingBtn();

		app.hideModal('modalAddAvenant');
	}

	async annuler() {
		var originGotoAvance = app.getStorageItem('originGoto');
		if (!app.isEmpty(originGotoAvance) && originGotoAvance == 'projet') {
			app.setStorageItem('originGoto', '');
			app.setStorageItem('numeroProjet', null);
			app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'AVANCE'));
		}
		else if (!app.isEmpty(originGotoAvance) && originGotoAvance == 'context') {
			app.setStorageItem('originGoto', '');

			app.redirect(this.router, app.getUrl('urlGotoHistoriqueDossierRaj', app.getLocalStorageItem('numAvanceRAJ'), 'AVANCE'));
		} else {
			app.setStorageItem('idDocumentContractuel', null);

			await app.sleep(250);

			//CAS ACCES DEPUIS LE FORMULAIRE ADD DDR
			if (this.idReglement == null && !app.isEmpty(this.idVersement))
				app.redirect(this.router, app.getUrl('urlAddReglement', this.idVersement));
			// CAS ACCES DEPUIS LE FORMULAIRE MODIF DDR
			else if (!app.isEmpty(this.idReglement))
				app.redirect(this.router, app.getUrl('urlGotoReglement', this.idReglement));
			// CAS ACCES DEPUIS LE LIEN MIS DANS LE MAIL
			else if (!app.isEmpty(this.avanceContractuel) && !app.isEmpty(this.avanceContractuel.numero_projet))
				app.redirect(this.router, app.getUrl('urlGotoProjetsType', this.avanceContractuel.numero_projet, 'AVANCE'));
		}

		const idAC = this.route.snapshot.paramMap.get('id');

		app.setStorageItem('idAvanceContractuel', idAC);
	}

	async addJustificatifAvance(item: any) {
		if (!app.isAFD(this.entite)) {
			await this.save(false);
			await app.sleep(150);
			app.hideModal('modalConfirmationAddJustificatifAvance');
			this.modalConfirmationAddJustificatifAvance().setLoadingBtn();
		}

		app.resetDO('justificatifAvance');

		var DO = app.getDO('justificatifAvance');

		if (item != null) {
			this.alreadyCreatedJustif = true;
			this.justificatifUpdate = item;
			if (item.obj_ext_id != null)
				this.showRepriseVersement = true;

			this.disabledCheckBoxDernierJustif = this.verifDernierJustificatif(item);

			app.mapDO(DO, item);
			DO.persistence_id = item.persistenceId;
			const selectEmetteurAvance = this.selectEmetteurAvance();
   DO.emetteur = (this.selectEmetteurAvance != null && selectEmetteurAvance.tiersSelected != null) ? selectEmetteurAvance.tiersSelected.idTiers : "";

			if (DO.dernier_justificatif == "Y")
				this.dernierJustifValue = true;
			else this.dernierJustifValue = false;
		} else {
			this.alreadyCreatedJustif = false;
			this.justificatifUpdate = null;

			app.resetDO(DO);

			DO.devise = this.avanceContractuel.devise_avance;
		}

		this.teleportEmetteurJustificatifAvance().unteleport();
		this.teleportSelectEmetteurJustificatifAvance().unteleport();

		app.cleanDiv('formio_justificatifAvance' + this.entite);

		await app.sleep(250);

		app.setBDM(DO);

		appFormio.loadFormIO('justificatifAvance' + this.entite, this.read);

		await app.sleep(150);

		this.listEmetteursAvanceByCr = await app.getTiersUsedByConcours(this.avanceContractuel.numero_concours, this.entite, 'JA', (item != null ? item.emetteur : null));

		if (item != null) {
			var idEmetteurJustifAvance = app.getEltInArray(this.listEmetteursAvanceByCr, 'idTiers', item.emetteur);

			await app.sleep(250);

			await this.initSelectEmetteurAV(idEmetteurJustifAvance);

			await this.getEmetteurJustificatifAV(item.emetteur);
		}
		else
			await this.initSelectEmetteurAV();

		await app.sleep(500);

		this.teleportEmetteurJustificatifAvance().teleport();
		this.teleportEmetteurJustificatifAvance().show();
		this.teleportSelectEmetteurJustificatifAvance().teleport();
		this.teleportSelectEmetteurJustificatifAvance().show();

		await app.sleep(250);
		if (!app.isAFD(this.entite) && item != null && this.justificatifUpdate != null)
			appFormio.setDataValue(crossVars.forms['formio_justificatifAvance' + this.entite], 'numero_justificatif', this.justificatifUpdate.numero_justificatif);

		await app.sleep(250);

		app.showModal('modalAddJustificatifAvance');

		this.tableJustificatifsAvance().setClickInProgress(false);
	}

	async saveJustificatifAvance() {
		const selectEmetteurAvance = this.selectEmetteurAvance();
  if (!app.isValidForm('formio_justificatifAvance' + this.entite) ||
			(this.selectEmetteurAvance != null && selectEmetteurAvance.tiersSelected == null)) {
			this.saveJustificatif().setLoadingBtn();
			app.showToast('toastJustificatifAvanceSaveError');
			return;
		}

		// app.resetDO('justificatifAvance');

		var DO = app.getDO('justificatifAvance');

		DO.id_avance_contractuel = this.avanceContractuel.persistenceId;
		DO.dernier_justificatif = this.dernierJustifValue;
		DO.emetteur = (this.selectEmetteurAvance != null && selectEmetteurAvance.tiersSelected != null) ? selectEmetteurAvance.tiersSelected.idTiers : "";

		if (this.justificatifUpdate != null) { //lors de la validation au niv de createJustif
			DO.persistence_id = this.justificatifUpdate.persistenceId;
		}
		else
			DO.persistence_id = null;

		var caseObject = await app.saveFormData(app.getRootDO('justificatifAvance'), crossVars.forms['formio_justificatifAvance' + this.entite], urls['urlProcessInstanciation'], urls['urlProcessGererJustificatifAvance']);

		await app.sleep(500);

		var caseInfo = await app.getCaseInfo(true, caseObject.caseId, 'page-avance -> saveJustificatifAvance - caseInfo');

		var caseContext = await app.getCaseContext(true, caseInfo.id, 'page-avance -> saveJustificatifAvance - caseContext');

		if (caseContext[app.getFirstJsonKey(caseContext)].storageId == null) {
			console.error('page-avance -> saveJustificatifAvance- -> saveRubrique: context.storageId is null');
			return;
		}

		app.resetRootDO('justificatifAvance');

		this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvanceContractuel', this.avanceContractuel.persistenceId), 'page-avance -> saveJustificatifAvance- getAvance', true);

		await app.sleep(700);

		this.showCheckBoxDernierJustif();

		await app.sleep(100);

		this.tableJustificatifsAvance().getItems();

		this.saveJustificatif().setLoadingBtn();

		await this.getAvance();

		await app.sleep(150);
		app.showToast('toastSaveSuccessAvance');
		await app.sleep(250);

		app.hideModal('modalAddJustificatifAvance');
	}

	/* JUSTIFICATIF / EMETTEUR */
	async initSelectEmetteurAV(emetteurJustificatifAV?: any) {
		if (this.selectEmetteurAvance != null)
			await this.selectEmetteurAvance().initSelectBeneficaire(this.listEmetteursAvanceByCr, this.read, 'JA', emetteurJustificatifAV, 'modalAddJustificatifAvance');
	}

	async getEmetteurJustificatifAV(idEmetteurJustifAvance?: any) {
		var numeroConcours = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'numero_concours');
		var idEmetteurAV = !app.isEmpty(idEmetteurJustifAvance) ? idEmetteurJustifAvance : this.selectEmetteurAvance()?.tiersSelected?.idTiers;
		if (!app.isEmpty(idEmetteurAV))
			await this.infosEmetteurJustificatifAvance().getBeneficiaire(null, null, idEmetteurAV, numeroConcours, 'JA');
	}

	tableAvanceError() {
		return this.typesAvance.length === 0
	}

	async addTypeAvance(item: any) {
		var DO = app.getDO('typeAvance');

		if (item != null) {
			this.alreadyCreated = true;
			this.iconeModalTypeAvance = "edit";
			this.titleModalTypeAvance = lang.avance.titleModalEditTypeAvance;
			this.typeAvanceItem = item;
			app.mapDO(DO, item);
		}
		else {
			app.resetDO(DO);
			this.alreadyCreated = false;
			DO.devise = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'devise_avance');
			this.titleModalTypeAvance = lang.avance.titleModalAddTypeAvance;
		}

		app.setBDM(DO);

		appFormio.loadFormIO('typeAvance', this.read);

		app.showModal('modalAddTypeAvance');
	}

	async saveTypeAvance() {
		if (!app.isValidForm('formio_typeAvance')) {
			app.showToast('toastTypeAvanceSaveSaveError');
			this.modalSaveTypeAvance().setLoadingBtn();
			return;
		}
		var DO = app.getRootDO('typeAvance');

		var newTypeAvance = await app.saveFormData(DO, crossVars.forms['formio_typeAvance']);
		var typeAvanceInput = newTypeAvance[app.getFirstJsonKey(newTypeAvance)];

		if (this.typeAvanceItem == null)
			this.typesAvance.push({ 'montant': typeAvanceInput.montant, 'devise': typeAvanceInput.devise, 'libelle': typeAvanceInput.libelle, 'type': this.type, 'persistenceId': 0, 'numero_type_avance': null, 'deleted': false });
		else {
			for (var typeAvance of this.typesAvanceByTypeSelected)  //ici à l'update de typeAvance
				if (typeAvance == this.typeAvanceItem)
					app.mapDO(typeAvance, typeAvanceInput);

			this.typeAvanceItem = null;
		}

		await this.getTypesAvance(this.type, true);

		this.modalSaveTypeAvance().setLoadingBtn();

		app.hideModal('modalAddTypeAvance');
	}

	async deleteTypeAvance() {
		var item = this.typeAvanceItem;

		//verifier si ∃ au moins un type d'avance dans la base
		var existTypeAvanceBdd = false;

		if (this.typesAvanceByTypeSelected != null && this.typesAvanceByTypeSelected.length > 0) {
			for (var i = 0; i < this.typesAvanceByTypeSelected.length; i++) {
				if (!app.isEmpty(this.typesAvanceByTypeSelected[i].persistenceId))
					existTypeAvanceBdd = true;
				if (this.typesAvanceByTypeSelected[i] == item)
					this.typesAvanceByTypeSelected[i].deleted = true;
			}
		}
		this.typeAvanceItem = null;

		if (app.isAFD(this.entite) && !existTypeAvanceBdd)
			app.enableToggle(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance');

		await app.sleep(1000);

		this.tableTypesAvance().getItems();

		this.modalDeleteTypeAvance().setLoadingBtn();

		app.showToast('toastTypeAvanceDeleteSuccess');

		app.hideModal('modalConfirmSuppressionTypeAvance');
	}

	async showDeleteConfirmTypeAvance() {
		this.typeAvanceLabel = this.typeAvanceItem.libelle;

		this.labelTypeAvance = app.getRefLabel('refLabelTypeAvance', this.typeAvanceItem.type);

		this.titleModalConfirmSuppressionTypeAvance = lang.delete;

		if (this.avanceContractuel != null && this.avanceContractuel.dossiersReglement.length > 0)
			app.showToast('toastTypeAvanceDeleteError');
		else {
			app.hideModal('modalAddTypeAvance');
			await app.showModal('modalConfirmSuppressionTypeAvance');
		}
	}

	cancelTypeAvance() {
		this.typeAvanceItem = null;
	}

	cancelDeleteTypeAvance() {
		app.showModal('modalAddTypeAvance');
	}

	async deleteJustificatif() {
		var DO = app.getRootDO('justificatifAvance')
		DO.deleted = true;

		console.log('page-avance -> deleteJustificatif : DO ', DO);

		await this.saveJustificatifAvance();

		await app.sleep(700);

		this.tableJustificatifsAvance().getItems();

		app.resetRootDO('justificatifAvance');

		this.modalDeleteJustificatif().setLoadingBtn();

		app.showToast('toastJustificatifDeleteSuccess');

		app.hideModal('modalConfirmSuppressionJustificatif');
	}

	async showDeleteConfirmJustificatif() {
		this.currentItem = this.justificatifUpdate;

		this.justificatifLabel = this.currentItem.code_fonctionnel + ' ' + this.currentItem.reference;

		this.titleModalConfirmSuppressionJustificatif = lang.delete;

		app.hideModal('modalAddJustificatifAvance');

		app.showModal('modalConfirmSuppressionJustificatif');
	}

	cancelDeleteJustificatif() {
		app.showModal('modalAddJustificatifAvance');
	}

	confirmerAddJustificatifAvance(item?: any) {
		if (!app.isAFD(this.entite))
			app.showModal('modalConfirmationAddJustificatifAvance');
		else
			this.addJustificatifAvance(item);
	}

	deleteAudit(item: any) {
		var index = -1;
		for (var i = 0; i < this.audits.length; i++)
			if (item == this.audits[i])
				index = i;
		if (index != -1)
			this.audits.splice(index, 1);
	}

	async addAudit() {
		this.audits.push({
			date_reception_rapport_annuel: '',
			lien_rom_audit: ''
		});

		await app.sleep(100);

		appFormio.loadFormIO('avanceAudit', this.read, 'formio_avanceAudit_' + (this.audits.length - 1));
	}

	verifDateReceptionFinal() {
		var dateIsNull = false;
		var dateRapportFinal = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'date_reception_rapport_final');

		if (dateRapportFinal == null || dateRapportFinal == '')
			dateIsNull = true;

		return dateIsNull;
	}

	checkAudits() {
		var isCheckedFormAudit = true;

		if (app.isAFD(this.entite)) {
			var dateAudit = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'date_reception_rapport_final');
			var lienAudit = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'lien_rom_rapport_final');

			if (!app.isEmpty(dateAudit) && app.isEmpty(lienAudit))
				isCheckedFormAudit = false;
		} else {

			for (var i = 0; i < this.audits.length; i++) {
				if (!app.isValidForm('formio_avanceAudit_' + i)) {
					this.btnSaveAvance().setLoading(false);
					isCheckedFormAudit = false;
				}
			}
		}
		return isCheckedFormAudit;
	}

	// building new rule pour controler les montants tranches - Avance
	sommeTranches() {
		var sommeMontant = 0;

		//sum montants de tous les tranches
		if (this.typesAvance != null) {
			for (var tranche of this.typesAvance) {
				if (!tranche.deleted) {
					sommeMontant += tranche.montant;
				}
			}
		}

		var DO = app.copyJson(app.getDO('avanceContractuel'));
		DO.montant_total = sommeMontant
		
		return sommeMontant
	}

	checkSommeTranches(concours: any) {
		var sommeMontant = 0;

		//sum montants de tous les tranches
		if (app.isAFD(this.entite) && this.typesAvance != null) {
			for (var tranche of this.typesAvance) {
				if (!tranche.deleted) {
					sommeMontant += tranche.montant;
				}
			}
		}

		// substract montant concours de la somme tranches
		app.log("Le montant du concours est : ", concours.montantInitial);

		var result = 0;
		if (concours.montantInitial != null)
			result = concours.montantInitial - sommeMontant;

		if (result != 0)
			return true;
		return false;

	}

	cancelValidateSommeTranches() {
		app.hideModal('modalErrorTotalAmountTranches');
	}

	async validateErrorSommeTranches() {
		await this.save(true);
	}

	async save(redirect: any) {
		if (!app.isValidForm(this.formioToBeLoaded)) {
			this.btnSaveAvance().setLoading(false);

			app.showToast('toastAvanceSaveError');
			return;
		}

		var DO = app.getDO('avanceContractuel');
		if (this.avanceContractuel != null)
			DO.persistence_id = this.avanceContractuel.persistenceId;
		else
			DO.persistence_id = 0;

		if (appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'choix_type_avance').length != 0) {
			var listeResult = [];
			for (var typeAvance of this.typesAvanceByTypeSelected) {
				if (!typeAvance.deleted) {
					listeResult.push(typeAvance);
				}
			}
			DO.typesAvance = listeResult;
		}
		var numConcours = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'numero_concours');

		var concours = await app.getAllDataConcoursById(numConcours);

		var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', concours.numeroProjet), 'page-avance > getProjet - projet', true);

		DO.entite = this.entite;
		DO.numero_projet = projet.numeroProjet;
		DO.produit_financier = (!app.isEmpty(concours.produit) ? concours.produit.idProduit : '');
		DO.libelle_projet = projet.nomProjet;
		DO.agence_gestion = projet.idAgenceGestion;
		DO.avenant = this.avenant;

		//NOUR + ARNAUD : save formio included in teleport
		if (this.audits != null && !app.isAFD(this.entite)) {
			for (var i = 0; i < this.audits.length; i++) {
				var dateReceptionAnnuel = appFormio.getDataValue(crossVars.forms['formio_avanceAudit_' + i], 'date_reception_rapport_annuel');
				var lienRomeAudit = appFormio.getDataValue(crossVars.forms['formio_avanceAudit_' + i], 'lien_rom_audit');
				if ((!app.isEmpty(dateReceptionAnnuel) && !app.isEmpty(lienRomeAudit)) || (app.isEmpty(dateReceptionAnnuel) && !app.isEmpty(lienRomeAudit))) {
					this.audits[i].date_reception_rapport_annuel = (dateReceptionAnnuel == '' ? null : dateReceptionAnnuel);
					this.audits[i].lien_rom_audit = lienRomeAudit;
				}
			}
			if (this.audits.length == 1 && app.isEmpty(dateReceptionAnnuel) && app.isEmpty(lienRomeAudit))
				this.audits = [];
			DO.audit = this.audits;
		}

		var caseObject = await app.saveFormData(app.getRootDO('avanceContractuel'), crossVars.forms[this.formioToBeLoaded], app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateAddAvance'));

		await app.sleep(500);

		var caseInfo = await app.getCaseInfo(true, caseObject.caseId, 'page-avance -> save - caseInfo');

		var caseContext = await app.getCaseContext(true, caseInfo.id, 'page-avance -> save - caseContext');

		if (caseContext[app.getFirstJsonKey(caseContext)].storageId == null) {
			console.error('page-avance -> saveAvance : context.storageId is null');
			return;
		}

		var idAvanceContractuel = caseContext[app.getFirstJsonKey(caseContext)].storageId;

		app.setStorageItem('idAvanceContractuel', idAvanceContractuel);
		app.setStorageItem('idDocumentContractuel', null);

		await app.sleep(250);

		var originGotoAvance = app.getStorageItem('originGoto');
		if (!app.isEmpty(originGotoAvance) && originGotoAvance == 'projet' && redirect) {
			app.setStorageItem('originGoto', '');

			app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'AVANCE'));
		} else {
			if (redirect) {
				//RESET STORAGES ITEMS
				app.setStorageItem('numeroConcours', null);
				app.setStorageItem('deviseVersement', null);
				app.setStorageItem('idVersement', null);

				//CAS ACCES DEPUIS LE FORMULAIRE ADD DDR
				if (this.idReglement == null && !app.isEmpty(this.idVersement))
					app.redirect(this.router, app.getUrl('urlAddReglement', this.idVersement));
				// CAS ACCES DEPUIS LE FORMULAIRE MODIF DDR
				else if (!app.isEmpty(this.idReglement))
					app.redirect(this.router, app.getUrl('urlGotoReglement', this.idReglement));
				// CAS ACCES DEPUIS LE LIEN MIS DANS LE MAIL
				else if (!app.isEmpty(this.avanceContractuel) && !app.isEmpty(this.avanceContractuel.numero_projet))
					app.redirect(this.router, app.getUrl('urlGotoProjetsType', this.avanceContractuel.numero_projet, 'AVANCE'));
			}
		}
	}

	lastJustif() {
		this.dernierJustifValue = !this.dernierJustifValue;
	}

	verifDernierJustificatif(item: any) {
		for (var justificatif of this.avanceContractuel.justificatifsAvance)
			if (justificatif.persistenceId != item.persistenceId && justificatif.dernier_justificatif)
				return true;
		return false;
	}

	showCheckBoxDernierJustif() {
		this.checkDernierJustif = false;
		for (var justif of this.justificatifsAvance) {
			if (justif.dernier_justificatif) {
				this.checkDernierJustif = true;
				justif.dernier_justif = "<i class='fas fa-check-square dernier_justif_color'></i>";
				return;
			}
		}
	}

	async changeConcours() {
		var concoursVar = await app.getExternalData(app.getUrl("urlGetConcoursGCFByNumero", appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'numero_concours')), "page-avance > changeConcours", true);
		appFormio.setDataValue(crossVars.forms[this.formioToBeLoaded], 'dlvf', concoursVar.dlvf);

		var numeroConcours = appFormio.getDataValue(crossVars.forms[this.formioToBeLoaded], 'numero_concours');

		const infosContext = this.infosContext();
  if (infosContext)
			infosContext.setInfosConcours(numeroConcours);
	}
}