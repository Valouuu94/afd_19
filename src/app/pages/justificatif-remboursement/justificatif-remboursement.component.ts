import { Component, OnInit, Input, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RubriquesComponent   } from '../../components/rubriques/rubriques.component';
import { TableComponent   } from '../../components/table/table.component';
import { TeleportComponent   } from '../../components/teleport/teleport.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { NgIf, NgClass } from '@angular/common';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;

@Component({
    selector: 'app-justificatif-remboursement',
    templateUrl: './justificatif-remboursement.component.html',
    standalone: true,
    imports: [NavActionsComponent, BtnComponent, NgIf, ContentComponent, CardComponent, InfosContextComponent, SpinnerComponent, NgClass, TeleportComponent, TableComponent, RubriquesComponent]
})
export class JustificatifRemboursementComponent implements OnInit {

	readonly btnSaveJustifRemboursement = viewChild.required<BtnComponent>('btnSaveJustifRemboursement');
	readonly teleportDcJustifRemboursement = viewChild.required<TeleportComponent>('teleportDcJustifRemboursement');
	readonly teleportJustifRemboursementRubriques = viewChild.required<TeleportComponent>('teleportJustifRemboursementRubriques');
	readonly rubriquesComponent = viewChild.required<RubriquesComponent>('rubriquesComponent');
	readonly tableRubriques = viewChild.required<TableComponent>('tableRubriques');

	role: any;
	entite: any;
	isAFD: any;
	perimetre: any;
	isDCV: any;
	read: any;
	lang: any = lang;
	app: any = app;
	loading: boolean = false;

	justificatifRemboursement: any;
	idReglement: any;
	idVersement: any;
	reglement: any;
	rubriquesDC: any;
	infosDcJustificatif: any;
	formioFormName: any;
	sommeMntJustifsRemboursement: any;
	mntRemboursement: any;
	showSidebar: boolean = true;
	showRubriquesDC: boolean = false;
	isIntegral: boolean = false;
	disabled: boolean = false;
	isValidMontantRemboursement: boolean = false;
	ventilatedRubriques: any = null;
	caseId: any;
	rubriqueV: any;
	autresDevises: any = [];
	projet: any = null;
	dc: any;
	deviseReglement: any = null;
	manualReloadDone: boolean = false;

	typeTableRubriquesRemboursement: any;
	rubriques: any;
	ventilationRubriques: any;
	montantARemb: any;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.role = this.store.getUserRole();
		this.entite = this.store.getUserEntite();
		this.isAFD = app.isAFD(this.entite);
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		app.setCurrentCmp('justificatif-remboursement', this);
	}

	ngAfterViewInit() {
		this.getJustifRemboursement();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	async getJustifRemboursement() {
		this.loading = true;
		this.justificatifRemboursement = null;
		this.showRubriquesDC = false;
		this.infosDcJustificatif = '';
		var formName = 'justificatifRemboursement';
		this.isIntegral = true;

		this.read = !(app.isAgentVersement(this.role) || app.isChargeAppui(this.role));

		//recup du reglement
		this.idReglement = app.isEmpty(app.getStorageItem('idReglement')) ? this.route.snapshot.paramMap.get('idReglement') : app.getStorageItem('idReglement');

		this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.idReglement), 'justificatif-remboursement > getJustifRemboursement - reglement', true);

		this.deviseReglement = (this.reglement.type_devise == '1' ? this.reglement.devise_reglement : this.reglement.devise_reference);

		//recup du justificatifRemboursement
		if (this.route.snapshot.paramMap.get('id') != null) //TODO : get existe pas ???? a supprimer je pense Nour
			this.justificatifRemboursement = await app.getExternalData(app.getUrl('urlGetJustificatifRemboursement', this.route.snapshot.paramMap.get('id')), 'justificatif-remboursement > getJustificatifRemboursement - justif', true);

		//chargement et mapping du DO
		var DO = app.getDO(formName);

		if (this.justificatifRemboursement != null)
			app.mapDO(DO, this.justificatifRemboursement);
		else {
			app.resetDO(formName);

			DO.devise_remboursement = this.deviseReglement;
			DO.date_valeur = null;
		}

		app.setBDM(DO);

		app.log('justificatif-remboursement > getJustificatifRemboursement - DO', DO);

		//unteleports et reset form
		if (this.reglement != null && this.reglement.id_document_contractuel != null && this.isAFD) {
			this.teleportDcJustifRemboursement().unteleport();
			this.teleportJustifRemboursementRubriques().unteleport();
		}
		app.cleanDiv('formio_' + formName);

		await app.sleep(250);

		//chargement du formulaire
		appFormio.loadFormIO(formName, this.read);

		await app.sleep(250);

		this.formioFormName = 'formio_' + formName;

		appFormio.setDataValue(crossVars.forms[this.formioFormName], 'devise', this.deviseReglement);
		appFormio.selectToggle(crossVars.forms[this.formioFormName], 'type', '1'); //integral par défaut

		//chargement du document contractuel
		await this.getDC();

		//traiter le cas integral et partiel
		await this.selectTypeRemboursement();

		this.loading = false;
	}

	async selectTypeRemboursement(manualReload?: any) {
		// integral / partiel
		var type = appFormio.getDataValue(crossVars.forms['formio_justificatifRemboursement'], 'type');
		this.isIntegral = (type != '0');

		app.log("justificatif-remboursement > selectTypeRemboursement - isIntegral", this.isIntegral);

		//montant remboursement cas intégral (si ∈ ou pas des remboursements partiels auparavant)
		if (this.reglement != null) {
			if (this.reglement.justificatifsRemboursement.length > 0) {
				app.log("**** Cas multi-remboursement effectués * Montant du remboursement ****");

				var sommeMntsDejaRembourses = 0;
				for (var justificatifRemb of this.reglement.justificatifsRemboursement)
					sommeMntsDejaRembourses += justificatifRemb.montant_remboursement;

				this.mntRemboursement = this.reglement.montant_reglement - sommeMntsDejaRembourses;
			}
			else {
				app.log("**** Cas aucun remboursement effectué * Montant du remboursement ****");
				this.mntRemboursement = this.reglement.montant_reglement;
			}
		}

		appFormio.setDataValue(crossVars.forms[this.formioFormName], 'montant_remboursement', (this.isIntegral && this.reglement != null) ? this.mntRemboursement : '');

		appFormio.setReadOnly(crossVars.forms[this.formioFormName], 'montant_remboursement', this.isIntegral);

		//chargement des rubriques
		await this.getRubriques();

		//si manualReload est renseignée c'est qu'on est sur le selectToggle After donc on va rappeler le click pour simuler une action utilisateur et faire le render angular
		if (manualReload != null && manualReload != '') {
			if (this.manualReloadDone)
				this.manualReloadDone = false; //pour reinitialiser apres le click simulé
			else {
				await app.sleep(500);

				console.warn('justificatif-remboursement > selectTypeRemboursement - MANUAL RELOAD');

				this.manualReloadDone = true;

				//on recupere l'element button du toggle qui est clické et on simule un click pour forcer le rendering
				app.getFormElementByName('type_' + manualReload).click();
			}
		}
	}

	async getRubriques() {
		if (this.reglement != null && this.reglement.id_document_contractuel != null && this.dc != null) {
			this.rubriquesComponent().setIsJustifRembIntegral(this.isIntegral);

			this.typeTableRubriquesRemboursement = "rubriquesRemboursement";
			this.rubriques = await app.getExternalData(app.getUrl('urlGetVentilationRubrique', this.reglement.persistenceId), 'justificatif-remboursement > getRubriques - rubriques');

			app.log('rubriquesVentilation', this.rubriques);

			await app.sleep(250);

			this.tableRubriques().getItems();

			const tableRubriques = this.tableRubriques();
   if (tableRubriques) {
				this.ventilationRubriques = [];

				for (var rub of this.rubriques) {
					var disabled = !rub.isUsed;

					if (this.isIntegral) {
						disabled = true;
						this.typeTableRubriquesRemboursement = "rubriquesRemboursementNotEditable";

						this.montantARemb = app.convertStringToFloat(rub.montant - rub.montantRembourse);
					}

					this.ventilationRubriques.push({
						'rubriqueId': rub.idRubrique,
						'parentId': rub.parentId,
						["libelle_rubrique"]: rub.libelleRubrique,
						["montantRegle"]: (rub.montantFinalA != 0) ? rub.montantFinalA : (rub.montantFinalB != 0) ? rub.montantFinalB : (rub.montantFinalC != 0) ? rub.montantFinalC : rub.montantFinalAvance,
						["resteAVerser"]: (rub.montantResteAVerserA != 0) ? rub.montantResteAVerserA : (rub.montantResteAVerserB != 0) ? rub.montantResteAVerserB : (rub.montantResteAVerserC != 0) ? rub.montantResteAVerserC : rub.montantResteAVerser,
						["mntARembourser"]: (this.isIntegral) ? this.montantARemb : null,
						"collumnsDisabled": { ["montantRegle"]: disabled, ["resteAVerser"]: disabled, ["mntARembourser"]: disabled },
						'rubriqueLevel': rub.levelRubrique,
						'cmpCurrent': 'justificatif-remboursement',
						'nameFunction': 'updateMarRubrique'
					});
				}

				await app.sleep(500);

				tableRubriques.getItems();
			}


		}
	}

	async getDC() {
		if (this.reglement != null && this.reglement.id_document_contractuel != null) {
			this.dc = await app.getExternalData(app.getUrl('urlGetDoContractuelById', this.reglement.id_document_contractuel), 'justificatif-remboursement > getDC - dc', true);

			if (this.dc != null) {
				appFormio.setDataValue(crossVars.forms[this.formioFormName], 'show_dc', '1');

				this.infosDcJustificatif = this.dc.numero_document_contractuel + ' : ' + this.dc.libelle;

				this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.reglement.numero_projet), 'justificatif-remboursement > getDC - projet', true);

				//recuperation des autres devises
				this.autresDevises = [];
				for (var autre_devise of this.dc.autre_devise) {
					autre_devise.devise_contrevaleur = this.dc.devise_contrevaleur;
					autre_devise.contrevaleurVisible = (!app.isEmpty(this.projet.idDevise) && this.projet.idDevise != autre_devise.devise);
				}
				this.autresDevises = app.getNumbersFormatList(this.dc.autre_devise, 'montant');

				this.showRubriquesDC = true;
			}

			if (this.isAFD) {
				this.teleportDcJustifRemboursement().teleport();
				this.teleportDcJustifRemboursement().show();
				this.teleportJustifRemboursementRubriques().teleport();
				this.teleportJustifRemboursementRubriques().show();
			}
		}
	}

	backToControles() {
		app.log("justificatif-remboursement > backToControles - idReglement, idVersement", app.getStorageItem('idReglement'), app.getStorageItem('idVersement'));

		if (app.isAFD(this.entite))
			app.redirect(this.router, app.getUrl('urlGotoReglementControles', app.getStorageItem('idReglement')));
		else
			app.redirect(this.router, app.getUrl('urlGotoVersementControles', app.getStorageItem('idVersement')));
	}

	async saveJustifRemboursement(back: any) {
		app.log("justificatif-remboursement > saveJustifRemboursement - idReglement, reglement", app.getStorageItem('idReglement'), this.reglement);

		if (this.reglement == null)
			return;

		//verif form
		if (!app.isValidForm(this.formioFormName)) {
			this.btnSaveJustifRemboursement().setLoading(false);
			app.showToast('toastJustificatifsReglementSaveError');
			return;
		}

		//verif montants ventilation
		if (!this.isIntegral && this.reglement.id_document_contractuel != null && this.dc != null
			&& this.sommeVentilation() != appFormio.getDataValue(crossVars.forms[this.formioFormName], 'montant_remboursement')) {
			app.showToast('toastMontantsVentilationError');
			this.btnSaveJustifRemboursement().setLoading(false);
			return;
		}

		//verif montant remboursement
		if (!this.isIntegral && this.reglement.montant_reglement < appFormio.getDataValue(crossVars.forms[this.formioFormName], 'montant_remboursement')) {
			app.showToast('toastMontantsRembSupReglementError');
			this.btnSaveJustifRemboursement().setLoading(false);
			return;
		}

		//gestion du DO et RootDO
		var DO = app.getDO('justificatifRemboursement');
		DO.id_dossier_reglement = this.reglement.persistenceId;
		DO.id_document_contractuel = this.reglement.id_document_contractuel;
		DO.id_avance_contractuel = this.reglement.id_avance_contractuel;
		DO.typeRemboursement = appFormio.getDataValue(crossVars.forms[this.formioFormName], 'type');
		DO.reference = appFormio.getDataValue(crossVars.forms[this.formioFormName], 'reference');
		DO.lien_rome = appFormio.getDataValue(crossVars.forms[this.formioFormName], 'lien_rome');
		DO.memo = appFormio.getDataValue(crossVars.forms[this.formioFormName], 'memo');
		DO.date_valeur = appFormio.getDataValue(crossVars.forms[this.formioFormName], 'date_valeur');
		DO.montant_remboursement = appFormio.getDataValue(crossVars.forms[this.formioFormName], 'montant_remboursement');
		DO.montantJustifRemboursement = (!app.isEmpty(this.reglement.id_document_contractuel)) ? this.getListeMontantsJustificatifRemboursement() : [];

		var rootDO = app.getRootDO('justificatifRemboursement');

		app.log('justificatif-remboursement > saveJustifRemboursement - rootDO', rootDO);

		//recuperation de la tache
		var task = await app.getExternalData(app.getUrl('urlGetTaskByParentCaseId', this.reglement.case_id_remboursement));

		if (task != null && task[0] != null) {
			//assignation de la tache
			if (task[0].assigned_id == '' || task[0].assigned_id == this.store.getUserId()) {
				await app.assignTache(task[0].id, this.store.getUserId());

				await app.sleep(1000);
			}

			//sauvegarde des données
			await app.setExternalData(app.getUrl('urlTaskExecute', task[0].id), rootDO);

			await app.sleep(1000);

			//redirect vers les controles
			this.backToControles();
		}
	}
	verifMontantRemboursement(input: any) {
		if (this.reglement != null && this.reglement.justificatifsRemboursement.length > 0) {
			this.sommeMntJustifsRemboursement = 0;
			for (var justifRemboursement of this.reglement.justificatifsRemboursement)
				this.sommeMntJustifsRemboursement += justifRemboursement.montant_remboursement;

			this.sommeMntJustifsRemboursement += input;
			this.isValidMontantRemboursement = this.sommeMntJustifsRemboursement <= this.reglement.montant_reglement;

			return this.isValidMontantRemboursement;
		}
		return true;
	}
	getMessageErrorMontantRemboursement(input: any) {
		var deviseReglement = (this.reglement.type_devise == '1' ? this.reglement.devise_reglement : this.reglement.devise_reference);

		if (input == 0)
			return lang.errorValueEqualsZero;
		else if (app.isEmpty(deviseReglement))
			return true;
		else if (!this.isValidMontantRemboursement)
			return lang.reglement.sommeMntsRembSupReglementError;
	}
	sommeVentilation() {
		var sommeMntARembourser = 0;

		//TODO : somme des rubs level 0 
		const tableRubriques = this.tableRubriques();
  for (var i = 0; i < this.tableRubriques().items.length; i++)
			if (tableRubriques.items[i].rubriqueLevel == "0")
				sommeMntARembourser += app.convertStringToFloat(tableRubriques.items[i].mntARembourser);

		app.log("< sommeVentilation() >> sommeMntARembourser", sommeMntARembourser);
		return sommeMntARembourser;
	}

	getListeMontantsJustificatifRemboursement() {
		var result = [];

		if (this.tableRubriques().items.length > 0) {
			for (var item of this.tableRubriques().items)
				if (!app.isEmpty(item.mntARembourser))
					result.push({
						'id_rubrique': item.rubriqueId,
						'montant_a_rembourser': app.convertStringToFloat(item.mntARembourser),
						'level_rubrique': (app.convertStringToFloat(item.rubriqueLevel))
					});
		}
		console.log("ListeMontantsJustificatifRemboursement>>", result);
		return result;
	}
	//methode pour mettre a jour le MAR lors de la ventilation des rubriques
	updateMarRubrique(item: any) {
		var indexParent = app.getIndexElementInArrayByValue(this.tableRubriques().items, "rubriqueId", item.parentId, false);
		var parentId = item.parentId;

		//on boucle jusqu'à remonter au level root 0
		while (indexParent != null) {
			//on recalcule la somme pour le parent
			const tableRubriques = this.tableRubriques();
   tableRubriques.items[indexParent]["mntARembourser"] = this.getSommeMntsParent(parentId);

			//on recupere le parent suivant
			parentId = tableRubriques.items[indexParent].parentId;
			indexParent = app.getIndexElementInArrayByValue(tableRubriques.items, "rubriqueId", parentId, false);
		}
	}

	getSommeMntsParent(parentId: any) {
		var sommeMAR = 0;

		for (var rubrique of this.tableRubriques().items)
			if (rubrique.parentId == parentId)
				sommeMAR += app.convertStringToFloat(rubrique.mntARembourser);

		return sommeMAR;
	}
}