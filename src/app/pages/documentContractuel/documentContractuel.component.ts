import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContreValeurComponent  } from '../../components/contre-valeur/contre-valeur.component';
import { AutreDeviseComponent } from '../../components/autre-devise/autre-devise.component';
import { RubriquesComponent } from '../../components/rubriques/rubriques.component';
import { SelectBeneficiaireComponent } from '../../components/select-beneficiaire/select-beneficiaire.component';
import { InfosBeneficiaireComponent } from '../../components/infos-beneficiaire/infos-beneficiaire.component';
import { TeleportComponent } from '../../components/teleport/teleport.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';
import { NgIf, NgClass } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';
import { ModalComponent } from '../../components/modal/modal.component';


declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const urls: any;
declare const lang: any;

@Component({
    selector: 'app-documentContractuel',
    templateUrl: './documentContractuel.component.html',
    standalone: true,
    imports: [NgIf, NavActionsComponent, BtnComponent, ContentComponent, NgClass, CardComponent, InfosContextComponent, TeleportComponent,
		InfosBeneficiaireComponent, SelectBeneficiaireComponent, RubriquesComponent, AutreDeviseComponent, ContreValeurComponent]
})
export class DocumentContractuelComponent implements OnInit {

	@ViewChild('btnValidateDocumentContractuel') btnValidateDocumentContractuel!: BtnComponent;
	@ViewChild('tableRubriques') tableRubriques!: TableComponent;
	@ViewChild('rubriquesComponent') rubriquesComponent!: RubriquesComponent;
	@ViewChild('modalConfirmationRubrique') modalConfirmationRubrique!: ModalComponent;
	@ViewChild('cmpAutresDevises') cmpAutresDevises!: AutreDeviseComponent;
	@ViewChild('teleportRubriquesDC') teleportRubriquesDC!: TeleportComponent;
	@ViewChild('teleportAutresDevises') teleportAutresDevises!: TeleportComponent;
	@ViewChild('modalDeleteRubrique') modalDeleteRubrique!: ModalComponent;
	@ViewChild('contreValeurAFD') contreValeurAFD!: ContreValeurComponent;
	@ViewChild('contreValeurHT') contreValeurHT!: ContreValeurComponent;
	@ViewChild('teleportContrevaleurAFD') teleportContrevaleurAFD!: TeleportComponent;
	@ViewChild('teleportContrevaleurHT') teleportContrevaleurHT!: TeleportComponent;
	@ViewChild('teleportFournisseur') teleportFournisseur!: TeleportComponent;
	@ViewChild('infosFournisseurDC') infosFournisseurDC!: InfosBeneficiaireComponent;
	@ViewChild('selectbeneficaire') selectFournisseurDC!: SelectBeneficiaireComponent;
	@ViewChild('teleportSelectFournisseur') teleportSelectFournisseur!: TeleportComponent;

	@Input() paramDC: any;
	@Input() paramDR: any;
	@Input() isInsideModal: boolean = false;

	app: any = app;
	lang: any = lang;
	entite: string = '';
	role: any;
	read: boolean = false;
	DC: any = null;
	caseId: any = null;
	idVersement: any = null;
	idReglement: any = null;
	reglement: any = null;
	versement: any = null;
	rubrique: any = null;
	rubriques: any = [];
	filteredDevises: any = [];
	autresDevises: any = [];
	autresDevisesRubrique: any = [];
	titleModalConfirmSuppressionRubrique: string = '';
	rubriqueLabel: string = '';
	alreadyCreatedRub: boolean = false;
	detailMontantJustificatifRubrique: any = null;
	MontantJustificatifRubriqueById: any = null;
	justificatifsReglement: any = [];
	projet: any = null;
	showSidebar: boolean = true;
	isDCV: boolean = false;
	perimetre: any;
	/* contrevaleur */
	contrevaleurVisible: boolean = false;
	contrevaleurMontant: any;
	contrevaleurDevise: any;
	contrevaleurDate: any;
	ventilatedRub: boolean = false;
	avanceRemboursable: boolean = false;
	libRubriqueAutoAR: any;
	dcRepris: boolean = false;
	loading: boolean = true;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.role = this.store.getUserRole();
		this.read = !app.isAgentVersement(this.role);
		this.libRubriqueAutoAR = 'Avance remboursable';
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		app.setCurrentCmp('documentContractuel', this);
	}

	async ngAfterViewInit() {
		if (this.paramDC == null) {
			await this.getDC();

			window.scrollTo(0, 0);
		} else {
			//si accès depuis modal, on vide les forms pour eviter les doubles chargements de teleports
			app.cleanDiv('formio_documentContractuel');
		}
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	async getDC() {
		console.time('documentContractuel');

		this.loading = true;

		this.idVersement = app.getStorageItem('idVersement');

		var DO = app.getDO('documentContractuel');

		//recup du document contractuel
		this.DC = null;
		var idDC = this.route.snapshot.paramMap.get('id');
		if (idDC != null && this.paramDC == null)
			this.DC = await app.getExternalData(app.getUrl('urlGetDoContractuelById', idDC), 'page-documentContractuel > getDocumentContractuel', true);
		else if (this.paramDC != null) {
			this.DC = this.paramDC;
			this.read = true;
		}

		//recup versement
		var idVersement = app.getStorageItem('idVersement');
		if (idVersement != null)
			this.versement = await app.getExternalData(app.getUrl('urlGetVersement', idVersement), 'page-documentContractuel > getDocumentContractuel - versement', true);

		//recup du reglement
		this.idReglement = app.getStorageItem('idReglement');
		if (this.idReglement != null && this.paramDR == null)
			this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.idReglement), 'page-documentContractuel > getDocumentContractuel - reglement', true);
		else if (this.paramDR != null)
			this.reglement = this.paramDR;

		this.caseId = (this.reglement == null) ? 0 : this.reglement.case_id;

		if (this.DC != null) {
			app.mapDO(DO, this.DC);

			DO.numero_document_contractuel = this.DC.numero_document_contractuel;
			DO.dc_persistenceid = this.DC.persistenceId;
			DO.mode_attribution = this.DC.mode_attribution;

			this.dcRepris = !app.isEmpty(this.DC.obj_ext_id);
		} else
			app.resetDO('documentContractuel');

		DO.show_avance_remboursable = '1';

		//lancement des reverses teleports avant le formio (pour eviter le bug du 2e chargement)
		this.teleportFournisseur.unteleport();
		this.teleportSelectFournisseur.unteleport();
		this.teleportRubriquesDC.unteleport();
		this.teleportAutresDevises.unteleport();
		this.teleportContrevaleurAFD.unteleport();
		this.teleportContrevaleurHT.unteleport();

		app.cleanDiv('formio_documentContractuel');

		await app.sleep(100);

		//get projet pour la contrevaleur
		app.log('DC getDC - NP', app.getStorageItem('numeroProjetDC'));

		this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', (this.DC == null ? app.getStorageItem('numeroProjetDC') : this.DC.numero_projet)), 'page-documentContractuel > getDC - projet', true);

		app.setBDM(DO);

		appFormio.loadFormIO('documentContractuel', this.read);

		await app.sleep(250);

		//lancement des teleports apres le formio
		this.teleportSelectFournisseur.teleport();
		this.teleportSelectFournisseur.show();
		this.teleportRubriquesDC.teleport();
		this.teleportRubriquesDC.show();
		this.teleportAutresDevises.teleport();
		this.teleportAutresDevises.show();
		this.teleportContrevaleurAFD.teleport();
		this.teleportContrevaleurAFD.show();
		this.teleportContrevaleurHT.teleport();
		this.teleportContrevaleurHT.show();
		this.teleportFournisseur.teleport();
		this.teleportFournisseur.show();

		//init des données des teleports apres leurs chargements
		this.autresDevises = [];

		if (this.DC != null) {
			appFormio.setDataValue(crossVars.forms['documentContractuel'], 'mode_attribution', app.getRefLabel('refModesAttribution', this.DC.mode_attribution));

			if (this.DC.id_fournisseur != null) {
				var fournisseur = await app.getTiers(this.DC.id_fournisseur);

				if (!this.isInsideModal)
					await this.initSelectFournisseur(fournisseur);

				await this.getFournisseur(this.DC.id_fournisseur);
			}

			for (var autre_devise of this.DC.autre_devise) {
				autre_devise.devise_contrevaleur = this.DC.devise_contrevaleur;
				autre_devise.contrevaleurVisible = (!app.isEmpty(this.projet.idDevise) && this.projet.idDevise != autre_devise.devise) ? true : false;
			}

			this.autresDevises = app.getNumbersFormatList(this.DC.autre_devise, 'montant');
		}
		else
			this.initSelectFournisseur();

		//contrevaleur
		this.updateContrevaleurAFD(true);
		this.updateContrevaleurHT();

		await this.rubriquesComponent.getRubriques(this.autresDevises != null ? this.autresDevises : [], this.DC, false, true, false, false, false, (this.DC != null ? this.DC.rubriques : null));

		//avance remboursable
		this.avanceRemboursable = (DO != null && DO.avance_remboursable == '1');
		await appFormio.selectToggle(crossVars.forms['formio_documentContractuel'], 'avance_remboursable', ((this.avanceRemboursable) ? '1' : '0'));

		//on desactive le toggle si au moins une DDR rattachée au DC
		if (this.DC != null && this.DC.dossiers_reglements != null && this.DC.dossiers_reglements.length > 0)
			app.disableToggle(crossVars.forms['formio_documentContractuel'], 'avance_remboursable');

		this.loading = false;

		console.timeEnd('documentContractuel');
	}

	async annulerDC() {
		app.setStorageItem('idDocumentContractuel', (this.DC != null) ? this.DC.persistenceId : null);
		app.setStorageItem('idAvanceContractuel', null);

		await app.sleep(250);

		var originGotoDC = app.getStorageItem('originGoto');
		if (originGotoDC != null && originGotoDC == 'projet') {
			app.setStorageItem('originGoto', '');

			app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'DC'));
		} else
			app.redirect(this.router, app.getUrl((this.idVersement == null ? 'urlGotoReglement' : 'urlAddReglement'), (this.idVersement == null ? this.idReglement : this.idVersement)));
	}

	async saveDC(back: any) {
		if (this.verifDC())
			return;

		//mise à jour des attributs du DO
		var DO = app.getDO('documentContractuel');

		if (this.DC == null)
			DO.numero_projet = app.getStorageItem('numeroProjetDC');
		else
			DO.dc_persistenceid = this.DC.persistenceId;

		DO.id_fournisseur = this.selectFournisseurDC?.tiersSelected?.idTiers;

		//formatte les rubriques avant sauvegarde
		DO.rubriques = this.rubriquesComponent.getRubriquesFormated();
		DO.sous_rubriques = this.rubriquesComponent.getSousRubriquesFormated();

		if (!this.avanceRemboursable)
			DO.montant_avance_demarrage = null;

		// SET MONTANTS AFD
		var montantsDC = this.rubriquesComponent.getMontantsDC();
		DO.montant_initialAFD = montantsDC.montant_initialAFD;
		DO.montant_finalAFD = montantsDC.montant_finalAFD;
		DO.montant_enregistreAFD = montantsDC.montant_enregistreAFD;
		DO.montant_reste_a_verserAFD = montantsDC.montant_reste_a_verserAFD;

		if (this.autresDevises != null && app.isAFD(this.entite) && this.cmpAutresDevises != null) {
			var autresDevisesVar = this.cmpAutresDevises.autresDevises;
			DO.autre_devise = this.rubriquesComponent.getMontantsAutreDevise(autresDevisesVar);
		}
		else
			DO.autre_devise = [];

		this.getFilteredDevises();

		//save du form et recup des 3 cases
		var caseObject = await app.saveFormData(app.getRootDO('documentContractuel'), crossVars.forms['formio_documentContractuel'], urls['urlProcessInstanciation'], urls['urlProcessAddDocContractuel']);

		await app.sleep(500); //2000 ?

		var caseInfo = await app.getCaseInfo(true, caseObject.caseId, 'page-dc > saveDC - get caseInfo');

		var caseContext = await app.getCaseContext(true, caseInfo.id, 'page-dc > saveDC - get caseContext');

		await app.sleep(500);

		//recup du storageId
		var storageId = null;

		for (var key of Object.keys(caseContext)) {
			if (key.toLowerCase().includes("document")) {
				storageId = caseContext[key].storageId;
				app.log('documentContractuel created - key - context[key].storageId', key + ' - ' + storageId);
			}
		}

		app.setStorageItem('idDocumentContractuel', storageId);
		app.setStorageItem('idAvanceContractuel', null);

		await app.sleep(250);

		//TODO : formatage ici ou dans le getDC ???

		if (this.autresDevises != null && app.isAFD(this.entite))
			this.autresDevises = app.getNumbersFormatList(DO.autre_devise, 'montant');

		await app.sleep(150);
		app.showToast('toastSaveSuccessDC');
		await app.sleep(250);

		//fin du save : stop chargement bouton et redirect si retour
		this.btnValidateDocumentContractuel.setLoading(false);

		var originGotoDC = app.getStorageItem('originGoto');
		if (originGotoDC != null && originGotoDC == 'projet') {
			app.setStorageItem('originGoto', '');

			app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'DC'));
		} else {
			if (back) {
				if (this.idReglement != null)
					app.redirect(this.router, app.getUrl('urlGotoReglement', this.idReglement));
				else
					app.redirect(this.router, app.getUrl('urlAddReglement', this.idVersement));
			} else //TODO : pkoi pas faire un getDC ???
				this.DC = await app.getExternalData(app.getUrl('urlGetDoContractuelById', storageId), 'page-dc > saveDocumentContractuel', true);
		}
	}

	verifDC() {
		var error = false;

		var validForm = app.isValidForm('formio_documentContractuel') && !this.selectFournisseurDC.checkSelectedBeneficiaire();

		if (this.cmpAutresDevises != null && !this.cmpAutresDevises.checkAutresDevises())
			validForm = false;

		//verif global des champs du form
		if (!validForm) {
			this.btnValidateDocumentContractuel.setLoading(false);
			app.showToast('toastDCSaveError');
			error = true;
		}

		// verif si au moins une rubriques a été saisie
		if (!this.rubriquesComponent.checkExistRubriques()) {
			this.btnValidateDocumentContractuel.setLoading(false);
			app.showToast('toastRubriquesDCError');
			error = true;
		}

		//verif entre montant total du DC et le montant AFD 
		var montantTotal = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_total_document');
		var montantAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_afd');
		if (montantAFD > montantTotal) {
			this.btnValidateDocumentContractuel.setLoading(false);
			app.showToast('toastDCMontantError');
			error = true;
		}

		if (this.rubriquesComponent.getRubriquesByType().length > 0) {
			if (!this.checkCoherenceMultiDevisesDC()) {
				this.btnValidateDocumentContractuel.setLoading(false);
				app.showToast('toastDCMontantRubriqueError');
				error = true;
			}
			//verifeir si une ligne des rubriques est vide (libelle vide + tous les montants sont vides) = > anomalie 2134
			else if (!this.rubriquesComponent.ckeckLibelleAndMontant()) {
				this.btnValidateDocumentContractuel.setLoading(false);
				app.showToast('toastDCLibelleMontantRubriqueError');
				error = true;
			}
		}

		return error;
	}

	async initSelectFournisseur(fournisseur?: any) {
		await this.selectFournisseurDC.initSelectBeneficaire(((fournisseur != null) ? [fournisseur] : []), this.read, 'DC', fournisseur);
	}

	async getFournisseur(fournisseur?: any) {
		await this.infosFournisseurDC.getBeneficiaire(null, null, (fournisseur != null ? fournisseur : this.selectFournisseurDC?.tiersSelected?.idTiers), null, 'DC', null);
	}

	getFilteredDevises() {
		this.filteredDevises = [];
		if (this.autresDevises != null && app.isAFD(this.entite)) {
			if (this.cmpAutresDevises != null)
				for (var autreDevise of this.cmpAutresDevises.autresDevises)
					this.filteredDevises.push({ idDevise: autreDevise.devise, libelleCourtDevise: app.getRefLabel('refDevises', autreDevise.devise) });

			//ajout de la devise afd à la liste des devises
			var deviseAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');
			this.filteredDevises.push({ idDevise: deviseAFD, libelleCourtDevise: app.getRefLabel('refDevises', deviseAFD) });
		}
	}

	//building new rule pour controler la multidevise - DC
	checkCoherenceMultiDevisesDC() {
		var montantsDC = this.rubriquesComponent.getMontantsDC();
		var montantAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_afd');

		if (montantsDC.montant_finalAFD != montantAFD)
			return false;

		if (!this.avanceRemboursable) {
			var autresDevises = this.rubriquesComponent.getMontantsAutreDevise(this.cmpAutresDevises.autresDevises);

			for (var autreD of autresDevises) {
				if (autreD.montant_final != app.convertStringToFloat(autreD.montant))
					return false;
			}
		}

		return true;
	}

	/* RUBRIQUES */

	renderRubriqueMontants(rubrique: any) {
		var result = app.formatNumberWithDecimals(rubrique.montant_rubrique) + ' ' + rubrique.devise_rubrique;
		if (rubrique.autre_devise != null)
			for (var autreDevise of rubrique.autre_devise)
				result += '<br>' + app.formatNumberWithDecimals(autreDevise.montant) + ' ' + autreDevise.devise;
		return result;
	}

	async deleteRubrique() {
		var item = this.rubrique;

		if (this.rubriques != null && this.rubriques.length > 0) {
			for (var i = 0; i < this.rubriques.length; i++) {
				if (this.rubriques[i] == item)
					this.rubriques[i].deleted = true;
			}
		}

		this.rubrique = null;

		await app.sleep(1000);

		this.tableRubriques.getItems();

		this.modalDeleteRubrique.setLoadingBtn();

		app.showToast('toastRubriqueDeleteSuccess');

		app.hideModal('modalConfirmSuppressionRubrique');
	}

	async updateContrevaleurAFD(isNotGetRubriques?: any) {

		await this.updateMontantAvanceDemarrage();

		var montantAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_afd');

		var deviseAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');
		var contrevaleurResultAFD = await this.contreValeurAFD.getContrevaleur(false, montantAFD, deviseAFD, this.projet);
		var DO = app.getDO('documentContractuel');

		DO.montant_contrevaleur_afd = contrevaleurResultAFD.contrevaleurMontant;
		DO.devise_contrevaleur = contrevaleurResultAFD.contrevaleurDevise;
		DO.date_contrevaleur_afd = contrevaleurResultAFD.contrevaleurDate;

		// condition pour ne pas appeler le composant ruubriques en cas de modification de montant LIDIA
		if (!isNotGetRubriques && this.rubriquesComponent.deviseAFD != deviseAFD)
			await this.rubriquesComponent.getRubriques(this.autresDevises, this.DC, false, false, false, true, false, null);

		this.displayToast(contrevaleurResultAFD);
	}

	async updateContrevaleurHT() {
		app.log('DC > updateContrevaleur HT');

		await this.updateMontantAvanceDemarrage();

		var montantTotal = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_total_document');
		var deviseTotal = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise');

		var deviseAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');

		if (app.isEmpty(deviseAFD))
			appFormio.setDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd', app.getRefLabel('refDevises', deviseTotal));

		var contrevaleurResultTotal = await this.contreValeurHT.getContrevaleur(false, montantTotal, deviseTotal, this.projet);

		var DO = app.getDO('documentContractuel');

		DO.montant_contrevaleur_ht = contrevaleurResultTotal.contrevaleurMontant;
		DO.devise_contrevaleur = contrevaleurResultTotal.contrevaleurDevise;
		DO.date_contrevaleur_ht = contrevaleurResultTotal.contrevaleurDate;

		this.displayToast(contrevaleurResultTotal);
	}

	displayToast(contrevaleurResult: any) {
		if (contrevaleurResult.displayToast)
			if (contrevaleurResult.responseCtx)
				app.showToast('toastUpdateContrevaleurSuccess');
			else
				app.showToast('toastUpdateContrevaleurError');
	}

	verifVentilatedRubrique(DC: any, rubriqueDC: any, isDevisePrincipale: any) {
		var isVentilatedRubrique = false;

		if (DC != null) {
			for (var reglement of DC.dossiers_reglements) {
				for (var justificatif of reglement.justificatifs) {
					if (justificatif.montantsJustificatifRubrique != null) {
						for (var montantJustifRubrique of justificatif.montantsJustificatifRubrique) {
							if (rubriqueDC.id_rubrique == montantJustifRubrique.id_rubrique) {
								if (isDevisePrincipale && rubriqueDC.devise_rubrique == justificatif.devise) {
									isVentilatedRubrique = true;
									break;
								}
								else if (!isDevisePrincipale) {
									for (var index = 0; index < this.autresDevisesRubrique.length; index++) {
										if (this.autresDevisesRubrique[index].devise == justificatif.devise) {
											this.autresDevisesRubrique[index].read = true;
											this.autresDevisesRubrique[index].readAmount = true;
										}
										else {
											this.autresDevisesRubrique[index].read = this.read;
											this.autresDevisesRubrique[index].readMontant = this.read;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return isVentilatedRubrique;
	}

	async updateMontantAvanceDemarrage() {
		app.log('DC > updateMontantAvanceDemarrage');

		var montantPartAFD = app.convertStringToFloat(appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_afd'));
		var deviseAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');
		var pourcentage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'pourcentage_avance_demarrage');

		appFormio.setDataValue(crossVars.forms['formio_documentContractuel'], 'devise_avance_demarrage', deviseAFD);

		var montant = '';
		if (!app.isEmpty(montantPartAFD) && !app.isEmpty(pourcentage))
			montant = String(montantPartAFD * pourcentage / 100);

		await app.sleep(100);
		appFormio.setDataValue(crossVars.forms['formio_documentContractuel'], 'montant_avance_demarrage', montant);

		this.rubriquesComponent.updateMontantvanceRemboursable();
	}

	updateMontantAvanceRubrique() {
		app.log('DC > updateMontantAvanceRubrique');

		this.rubriquesComponent.updateMontantvanceRemboursable();
	}

	async checkAvanceRemboursable() {
		var toggle = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'avance_remboursable');

		this.avanceRemboursable = false;
		if (toggle == '1')
			this.avanceRemboursable = true;

		this.rubriquesComponent.getRubriques(this.autresDevises != null ? this.autresDevises : [], this.DC, false, false, false, false, false, null);
	}

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
	async addRubriqueRecapAvance() {
		app.log('DC > addRubriqueRecapAvance');

		if (this.rubriques != null && this.rubriques.length > 0) {
			var montantPartAFD = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_afd');
			var pourcentage = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'pourcentage_avance_demarrage');

			if (!app.isEmpty(montantPartAFD) && !app.isEmpty(pourcentage)) {
				var recap = {
					'id_rubrique': 0,
					'libelle_rubrique': this.libRubriqueAutoAR,
					'montant_rubrique': appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_avance_demarrage'),
					'devise_rubrique': appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd'),
					'renderMontants': '',
					'renderRAV': '',
					'renderPourcentageAvance': '-',
					'renderMontantAvance': '-',
					'numero_rubrique': '',
					'montant_a_payer': 0,
					'autre_devise': [],
					'deleted': false,
					'pourcentage_avance': null,
					'montant_avance': null,
					'devise_avance': null
				};

				recap.renderMontants = this.renderRubriqueMontants(recap);
				recap.renderRAV = app.renderRAVRub(this.DC, recap);

				var find = false;
				for (var rubrique of this.rubriques) {
					if (rubrique.libelle_rubrique == this.libRubriqueAutoAR) {
						rubrique.montant_rubrique = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'montant_avance_demarrage');
						rubrique.devise_rubrique = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');
						rubrique.renderMontants = this.renderRubriqueMontants(recap);
						// rubrique.renderRAV = app.renderRAVRub(this.DC, recap);
						rubrique.renderPourcentageAvance = '-';
						rubrique.renderMontantAvance = '-';
						//rubrique.numero_rubrique = '1';

						find = true;
						app.log('DC > addRubriqueRecapAvance : mise à jour recap', recap);
						break;
					}
				}
				if (!find) {
					this.rubriques.splice(0, 0, recap);
					app.log('DC > addRubriqueRecapAvance : ajout recap', recap);
				}

				await app.sleep(1000);

				app.sortBy(this.rubriques, [
					{ key: 'numero_rubrique' },
					{ key: 'libelle_rubrique' }
				]);
			}
		}
	}

	async libelleDocumentContractuel() {
		await this.rubriquesComponent.getRubriques(this.autresDevises != null ? this.autresDevises : [], this.DC, false, false, false, false, true, null);
	}

	async getRubriques(item: any, hasDuplicateDevise: any) {
		this.rubriquesComponent.setHasDuplicateDevise(hasDuplicateDevise);
		if (!hasDuplicateDevise)
			await this.rubriquesComponent.getRubriques(this.autresDevises, this.DC, false, false, true, false, false, null);
	}
}