import { Component, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { NgForm, FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ExportPdfBanComponent } from '../../components/export-pdf-ban/export-pdf-ban.component';
import { NotificationComponent  } from '../../components/notification/notification.component';
import { InfosReglementComponent } from '../../components/infos-reglement/infos-reglement.component';
import { ControlesComponent } from '../../components/controles/controles.component';
import { TableComponent  } from '../../components/table/table.component';
import { InfosVersementComponent } from '../../components/infos-versement/infos-versement.component';
import { InfosDossierComponent  } from '../../components/infos-dossier/infos-dossier.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { BtnMenuComponent } from '../../components/btnMenu/btnMenu.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';

declare const app: any;
declare const appFormio: any;
declare const urls: any;
declare const lang: any;
declare const $: any;
declare const refs: any;

@Component({
    selector: 'app-versement-controles',
    templateUrl: './versement-controles.component.html',
    standalone: true,
    imports: [NavActionsComponent, NgIf, BtnMenuComponent, BtnComponent, ContentComponent, NgClass, CardComponent, InfosContextComponent, SpinnerComponent, InfosDossierComponent,
		 InfosVersementComponent, TableComponent, NgFor, ControlesComponent, InfosReglementComponent, NotificationComponent, ExportPdfBanComponent, ModalComponent, FormsModule]
})
export class VersementControlesComponent implements OnInit {

	readonly versementControles = viewChild.required<ControlesComponent>('versementControles');
	readonly btnSaveControles = viewChild.required<BtnComponent>('btnSaveControles');
	readonly tableReglements = viewChild.required<TableComponent>('tableReglements');
	readonly tableDDrsDefinitif = viewChild.required<TableComponent>('tableDDrsDefinitif');
	readonly tableConfirmationPaiment = viewChild.required<TableComponent>('tableConfirmationPaiment');
	readonly tableVersements = viewChild.required<TableComponent>('tableVersements');
	readonly detailsReglement = viewChild.required<InfosReglementComponent>('detailsReglement');
	readonly notification = viewChild.required<NotificationComponent>('notification');
	readonly modalValidateReglement = viewChild.required<ModalComponent>('modalValidateReglement');
	readonly infosDossier = viewChild.required<InfosDossierComponent>('infosDossier');
	readonly btnAnnulerDossier = viewChild.required<BtnComponent>('btnAnnulerDossier');
	readonly exportBan = viewChild.required<ExportPdfBanComponent>('exportBan');
	readonly btnSaveDdrDefinif = viewChild.required<BtnComponent>('btnSaveDdrDefinif');
	readonly btnRemboursement = viewChild.required<BtnComponent>('btnRemboursement');
	readonly modalConfirmDdrDefinitif = viewChild.required<ModalComponent>('modalConfirmDdrDefinitif');
	readonly myForm = viewChild<NgForm>('myForm');
	readonly btnExportPDFBan = viewChild.required<BtnComponent>('btnExportPDFBan');

	versement: any;
	entite: any;
	perimetre: any;
	tache: any;
	read: boolean = true;
	errorMessage: any;
	statut: string = '';
	reglement: any = null;
	editeEnable: boolean = false;
	showBeneficiaireReglement: boolean = false;
	showConcours: boolean = false;
	showReglement: boolean = false;
	role: any;
	app: any = app;
	lang: any = lang;
	commentsDeployed: boolean = false;
	reglements: any = null;
	reglementsDefinitif: any = null;
	countControlesChecked: any;
	countControlesTotal: any;
	themesControles: any;
	toastEnvoiRenvoiVersement: any;
	ControleParThemes: any;
	isAFD: boolean = false;
	isDCV: boolean = false;
	showSidebar: boolean = true;
	loading: boolean = true;
	concoursSIOP: any;
	typeTableDDrDefinitif: any;
	readDdrDefinitif: boolean = false;
	isLoadingValidate: boolean = false;
	caseId: any;
	persistenceIdReglement: any;
	refCodesDdvValide: any = refs['refCodesDdvValide'];

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.loading = true;

		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isAFD = app.isAFD(this.entite);
		this.isDCV = app.isDCV(this.entite, this.store.getUserPerimetre());

		app.setCurrentCmp('controles', this);
	}

	ngAfterViewInit() {
		this.getVersement();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	async validerControles() {
		var controles = await this.versementControles().saveControles(true);

		return !(controles == null);
	}

	async autoSave() {
		if (this.versementControles().updatedValue) {
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
				this.notification().setLoadingBtn();
				this.notification().hideModal();
			} else
				this.btnSaveControles().setLoading(false);
			return;
		}

		var controles = await this.versementControles().saveControles(verifControle);

		if (controles == null) {
			this.btnSaveControles().setLoading(false);
			return;
		}

		app.log('page-versement-controles > validerTache - controles', controles);

		await app.saveFormData(app.getRootDO('controles'), null, urls['urlProcessInstanciation'], urls['urlProcessUpdateControles']);

		if (validate) {
			await app.sleep(1000);

			await app.assignTache(this.tache.id, this.store.getUserId());

			await app.sleep(1000);

			await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), DO);

			if (this.notification != null) {
				this.notification().setLoadingBtn(); //TODO notification object
				this.notification().hideModal();
			}

			if (app.isEmpty(DO.decision)) {
				if (app.isChargeAppui(this.role) && this.versement.decision != "RETOUR_MODAF_CG")
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementValideCP;
				else if (app.isChargeAppui(this.role) && this.versement.decision == "RETOUR_MODAF_CG")
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementValideCA;
				else if (app.isChargeAffaire(this.role))
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementValideCA;
				else if (app.isMODAF(this.role))
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementValideModaf;
				else if (app.isDirecteur(this.role))
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementValideDir;
			}
			else {
				if (DO.decision == "RETOUR_CG" || DO.decision == "RETOUR_MODAF_CG")
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementRenvoiCP;
				else if (DO.decision == "RETOUR_CA")
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementRenvoiCA;
				else if (DO.decision == "RETOUR_MODAF")
					this.toastEnvoiRenvoiVersement = lang.versement.toastVersementRenvoiModaf;
			}

			app.showToast("toastEnvoiRenvoiVersement");

			await app.sleep(4000);

			app.redirect(this.router, app.getUrl('urlGotoTaches'));
		} else {
			this.btnSaveControles().setLoading(false);

			app.showToast('toastControlesSave');
		}
	}

	annulerTache() {
		app.redirect(this.router, app.getUrl('urlGotoVersements'));
	}

	async getVersement() {
		this.loading = true;

		this.versement = await app.getExternalData(app.getUrl('urlGetVersement', this.route.snapshot.paramMap.get('id')), 'page-versement-controles > getVersement', true);

		if (await app.getPageError(this.versement.numero_projet)) {
			this.versement.canceled = (app.isDossierAnnule(this.versement.code_statut_dossier) ? true : false);

			this.read = await app.isReadTask(this, this.versement.case_id, this.store.getUserId());
			this.caseId = this.versement.case_id;

			await this.getReglements();

			//recuperer le role qui est dans la description de la tache
			if (!app.isEmpty(this.tache))
				this.role = app.getRoleTache(this.tache);

			await this.versementControles().loadControles(this.versement.case_id, this.tache);

			this.loading = false;
		}
	}

	async getReglements() {
		this.typeTableDDrDefinitif = "confirmationPaiementPROPARCO";

		var reglementsBDD = await app.getExternalData(app.getUrl('urlGetReglementsByNumVersement', this.versement.numero_dossier_versement), 'page-versement-reglements > getVersement > reglements');

		this.reglements = await app.mergeDataConcoursWithDDRs(reglementsBDD, this.versement.numero_projet);

		app.log('reglementsALL', this.reglements);

		await app.sleep(250);

		this.tableReglements().getItems();

		this.readDdrDefinitif = true;

		for (var reglement of this.reglements)
			if (reglement.code_statut_dossier != "DDR8") {
				this.readDdrDefinitif = false;
				break;
			}

		for (var reglement of this.reglements)
			if (app.enableShowBtnRemboursement(reglement) && !app.isEmpty(reglement.devise_paiement))
				reglement.devisePaiement = reglement.devise_paiement;

		for (var i = 0; i < this.reglements.length; i++)
			if (this.reglements[i].dateDdrDefinitif != null)
				this.reglements[i].dateDdrDefinitif = this.reglements[i].dateDdrDefinitif.substring(0, 10);

		await app.sleep(150);

		const tableDDrsDefinitif = this.tableDDrsDefinitif();
  if (tableDDrsDefinitif) {
			this.reglementsDefinitif = [];

			for (var reg of this.reglements) {
				var disabled = false;

				if ((reg.montant_definitif_reglement != null && reg.date_paiement != null) || this.read) {
					disabled = true;
					this.typeTableDDrDefinitif = "confirmationPaiementPROPARCONotEditable";
				}

				this.reglementsDefinitif.push({
					'drPersistenceId': reg.persistenceId,
					["code_fonctionnel"]: reg.code_fonctionnel,
					["montantPaiement"]: app.isEmpty(reg.montant_definitif_reglement) ? null : app.formatNumberWithDecimals(reg.montant_definitif_reglement),
					["datePaiement"]: reg.date_paiement,
					["devisePaiement"]: reg.devisePaiement,
					'code_statut_dossier': reg.code_statut_dossier,
					"collumnsDisabled": { ["montantPaiement"]: disabled, ["devisePaiement"]: disabled, ["datePaiement"]: disabled },
					"ddrValidee": reg.code_statut_dossier == 'DDR8'
				});
			}

			await app.sleep(500);

			tableDDrsDefinitif.getItems();
		}
	}

	async showValiderReglement(item: any) {
		this.reglement = item;

		await app.sleep(100);

		app.showModal('modalValiderReglement');
	}

	async validerReglement() {
		app.mapDO(app.getDO('reglementPDFInput'), this.reglement);

		var DO = app.getRootDO('reglementPDFInput');
		DO.statut = this.statut;

		await app.generateFile(DO, 'urlProcessExportPdfDDR', true);

		this.statut = '';

		this.modalValidateReglement().setLoadingBtn();

		app.hideModal('modalValiderReglement');

		await app.sleep(5000); //TODO pkoi encore la ???

		this.tableReglements().setUrlParam(this.versement.numero_dossier_versement);
		this.tableReglements().getItems();
	}

	async downloadFile(reglement: any) {
		await app.downloadDocument(reglement, true);
	}

	async gotoReglement(item?: any) {
		if (!this.read && item == null) {
			await this.autoSave();

			app.setStorageItem('idAvanceContractuel', null);
			app.setStorageItem('idDocumentContractuel', null);

			await app.sleep(250);

			app.redirect(this.router, app.getUrl('urlAddReglement', this.versement.persistenceId));
		} else {
			var update = !this.read && app.isRoleEnableEditDossier(this.role, this.versement);

			app.log('versementControles > gotoReglement > update', update);
			app.log('versementControles > gotoReglement > versement.case_id', this.versement.case_id);
			app.log('versementControles > gotoReglement > isRoleEnableEditDossier', app.isRoleEnableEditDossier(this.role, this.versement));

			if (update)
				await this.autoSave();

			this.showReglement = true;

			await app.sleep(150);

			await this.detailsReglement().gotoReglement(item, this.versement, update);

			this.tableReglements().setClickInProgress(false);
		}
	}

	toggleComments() {
		var controles = this.versementControles().controles;

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
		if (DONotification == null) {
			this.btnAnnulerDossier().setLoading(false);
			app.showToast('toastImpossibleAnnulerDossier');
		}
		else {
			await app.assignTache(this.tache.id, this.store.getUserId());

			await app.sleep(1000);

			var codeStatut = await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), DONotification);

			//ANOMALIE 3079 LIDIA
			app.resetDO('notification');

			if (codeStatut) {
				await app.sleep(500);

				this.notification().setLoadingBtn();
				this.notification().hideModal();

				app.showToast('toastVersementAnnulerOk');

				await app.sleep(250);

				await this.getVersement();

				await this.infosDossier().getNotifications();
			}
			else
				app.showToast('toastVersementAnnulerKo');
		}
	}

	annulerAction(action: any) {
		if (action == '-1')
			this.btnAnnulerDossier().setLoading(false);
	}

	async validerTacheDir() {
		this.isLoadingValidate = true;
		var isControlesOk = true;

		if (app.isDirecteur(this.role)) {
			var valideControle = await this.validerControles();
			if (!valideControle) {
				this.btnSaveControles().setLoading(false);
				return;
			}

			for (var controle of this.versementControles().controles) {
				var valueControle = controle.value;
				if ((valueControle != '1') && controle.show && !controle.isAuto && controle.type == app.getEtapeTache(this.tache))
					isControlesOk = false;
			}
		}

		await this.notification().validerTache(isControlesOk);

		this.isLoadingValidate = false;
	}

	async exportControlesToPDF() {
		let listeControl: any[] = [];

		const versementControles = this.versementControles();
  if (Array.isArray(versementControles.controles))
			for (var element of versementControles.controles)
				listeControl.push(element);

		for (let element of listeControl)
			element[element.type] = element.value;

		for (let i = 0; i < listeControl.length; i++) {
			var commentaire = await app.getExternalData(app.getUrl('urlGetCommentaires', listeControl[i].firstStepPersistenceId));

			listeControl[i].commentaire = null;

			if (commentaire.length > 0) {
				for (let j = 0; j < commentaire.length; j++) {
					if (commentaire[j].commentaireAnnule === false) {
						listeControl[i].commentaire = commentaire[j];
						listeControl[i].roleAgent = app.getRefLabel('refRoles', this.store.getUserRole());;
					}
				}
			}
		}

		listeControl.sort((a, b) => (a.codeTheme > b.codeTheme) ? 1 : -1);

		// Regrouper les éléments par thème
		this.ControleParThemes = {};
		for (let element of listeControl) {
			if (!(element.codeTheme in this.ControleParThemes))
				this.ControleParThemes[element.codeTheme] = [];

			this.ControleParThemes[element.codeTheme].push(element);
		}

		this.versement.modalitePaiement = app.getRefLabel('refModalitesPaiementPROPARCO', this.versement.modalite_paiement, true);

		this.exportBan().generate(listeControl, this.reglements, this.versement, this.ControleParThemes, this.isAFD);

		this.btnExportPDFBan().setLoading(false);
	}

	//verifier que le dossier de versement est en status paiement confirmé
	ddvIsValide() {
		return ((!app.isEmpty(this.versement) && this.versement.code_statut_dossier == 'DDV10') || (!app.isEmpty(this.versement) && this.refCodesDdvValide.includes(this.versement.code_statut_dossier)));
	}

	async verifDDRDefinitif() {
		var flagError = false;

		for (var item of this.tableDDrsDefinitif().items) {
			if (item.datePaiement == null && app.isEmpty(item.montantPaiement) && app.isEmpty(item.devisePaiement))
				console.log('versements-controles > verifDDRDefinitif - item', item);
			else if (item.datePaiement == null || app.isEmpty(item.montantPaiement) || app.isEmpty(item.devisePaiement)) {
				flagError = true;
				console.error('versements-controles > verifDDRDefinitif - item', item);
				break;
			}
		}

		this.btnSaveDdrDefinif().setLoading(false);
		if (!flagError)
			app.showModal('modalConfirmDdrDefinitif');
		else
			app.showToast('toastErrorSaveDdrDefinitif');
	}

	cancelValidateDdrDefinitif() {
		app.hideModal('modalConfirmDdrDefinitif');
	}

	async validateDdrDefinitif() {
		var allRenseignes = true;

		for (var item of this.tableDDrsDefinitif().items) {
			if (app.isEmpty(item.montantPaiement) && item.datePaiement == null && app.isEmpty(item.devisePaiement)) {
				allRenseignes = false;
				break;
			}
		}

		if (allRenseignes) {
			app.log("## ALL Ddrs en PDéfinitif RENSEIGNES ##");

			var response = await app.getExternalData(app.getUrl('urlGetTaskByParentCaseId', this.versement.case_id));

			const dossierReglementInput: Array<any> = [];

			for (var i = 0; i < this.tableDDrsDefinitif().items.length; i++) {
				//IL FAUT PAS ENVOYER LES DDR DEJA VALIDEES
				const tableDDrsDefinitif = this.tableDDrsDefinitif();
    if (!tableDDrsDefinitif.items[i].ddrValidee) {
					const DOcomplet = {
						date_paiement: tableDDrsDefinitif.items[i].datePaiement,
						montant_definitif_reglement: app.convertStringToFloat(tableDDrsDefinitif.items[i].montantPaiement),
						devise_paiement: tableDDrsDefinitif.items[i].devisePaiement,
						persistenceId: tableDDrsDefinitif.items[i].drPersistenceId,
					};
					dossierReglementInput.push(DOcomplet);
				}
			}

			const dataToSend = {
				dossiersReglementsInput: dossierReglementInput,
			};

			app.log('modal-infos-reglement > DDR -Definitif > dossierReglementInput ', dossierReglementInput);

			if (response[0] != null && (response[0].assigned_id == '' || response[0].assigned_id == this.store.getUserId()))
				await app.assignTache(response[0].id, this.store.getUserId());

			await app.sleep(1000);

			await app.setExternalData(app.getUrl('urlTaskExecute', response[0].id), dataToSend);

			await app.sleep(100);

			app.showToast('toastAllDdrsDefinitifs');
		} else {
			app.log("## SOME Ddrs en PDéfinitif ##");
			var ddrsDefinitif = this.getInfosDdrDefinitif(this.tableDDrsDefinitif());

			//MODIF LIDIA => INSTANCIER LE PROCESS SEULEMENT S IL Y A DES DDRS A VALIDER
			if (ddrsDefinitif.length > 0) {
				var DO = app.getRootDO('confirmationPaiementDR');
				var versementInput = DO.dossierVersementInput;

				versementInput.persistenceId = this.versement.persistenceId;
				versementInput.dossiersReglement = ddrsDefinitif;

				DO.dossierVersementInput = versementInput;
				app.log("reglementsToBeSend> ", DO);

				var caseObject = await app.saveFormData(DO, null, urls['urlProcessInstanciation'], urls['urlProcessPROConfirmationPaiementDR']);

				await app.sleep(500);

				var caseInfo = await app.getCaseInfo(true, caseObject.caseId, 'page-versement-controles -> validateDdrDefinitif- caseInfo');

				var caseContext = await app.getCaseContext(true, caseInfo.id, 'page-versement-controles -> validateDdrDefinitif- caseContext');

				for (var key of Object.keys(caseContext)) {
					if (key.toLowerCase().includes("versement")) {
						app.log('validateDdrDefinitif > dossierVersement - key - context[key].storageId', key + ' - ' + caseContext[key].storageId);
						var storageId = caseContext[key].storageId;
					}
				}
				await app.sleep(100);

				app.showToast('toastErrorNotAllDdrsDefinitifs');

				this.versement = await app.getExternalData(app.getUrl('urlGetVersement', storageId), 'validateDdrDefinitif > getVersement', true);
			}
		}
		this.modalConfirmDdrDefinitif().setLoadingBtn();

		app.hideModal('modalConfirmDdrDefinitif');

		await app.sleep(100);

		app.hideModal('detailsDemandeReglement');

		await app.sleep(1000);

		await this.getVersement();
	}

	async addJustificatifRemboursement() {
		app.setStorageItem('idVersement', this.versement.persistenceId);
		app.setStorageItem('idReglement', this.persistenceIdReglement);

		var DOReg = app.getDO('remboursement');
		DOReg.persistenceId = this.persistenceIdReglement;

		var caseObject = await app.saveFormData(app.getRootDO('remboursement'), null, urls['urlProcessInstanciation'], urls['urlProcessGererJustificatifRemboursement']);

		await app.sleep(200);

		var caseInfo = await app.getExternalData(app.getUrl('urlGetCasePROPARCO', caseObject.caseId), 'page-versement-controles -> addJustificatifRemboursement - caseInfo', true);
		var caseId = caseInfo.id;

		await app.sleep(200);

		var tacheGererRemboursementPRO = await app.getExternalData(app.getUrl('urlGetTaskByCaseId', caseId), 'page-versement-controles > addJustificatifRemboursement > getHumanTask', true);

		if (!Array.isArray(tacheGererRemboursementPRO) && tacheGererRemboursementPRO != null) {
			app.hideModal('modalConfirmationAddJustifRemboursement');
			app.redirect(this.router, app.getUrl('urlAddJustficatifRemboursement', this.versement.persistenceId));
		}
	}

	getInfosDdrDefinitif(table: any) {
		var result = [];
		for (var item of table.items) {
			// LIDIA MODIF => faut pas envoyer une ddr déja validée
			if (!app.isEmpty(item.montantPaiement) && item.datePaiement != null && !item.ddrValidee)
				result.push({
					"datePaiement": item.datePaiement,
					"montantPaiement": app.convertStringToFloat(item.montantPaiement),
					"devisePaiement": item.devisePaiement,
					"drPersistenceId": item.drPersistenceId,
				});
		}
		return result;
	}
	showBtnMenu() {
		if (app.isAuditeur(this.store.getUserRole()))
			return false;

		if (!app.isEmpty(this.versement)) {
			return (this.ddvIsValide() ||
				((!app.isEmpty(this.tache) && !app.taskIsMisePaiement(this.tache))));
		}
		return false;
	}
	async confirmAddJustifRemboursement(item: any) {
		this.persistenceIdReglement = item.drPersistenceId;
		this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.persistenceIdReglement), 'page-versement-controles > confirmAddJustifRemboursement - reglement', true);
		item.code_statut_dossier = this.reglement.code_statut_dossier;

		if (!app.isEmpty(item.montantPaiement) && this.reglement.code_statut_dossier != 'DDR12')
			app.showModal('modalConfirmationAddJustifRemboursement');
	}
}