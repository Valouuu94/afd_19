import { ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { AutreDeviseComponent } from '../autre-devise/autre-devise.component';
import { InfosBeneficiaireComponent } from '../infos-beneficiaire/infos-beneficiaire.component';
import { ModalComponent } from '../modal/modal.component';
import { TeleportComponent } from '../teleport/teleport.component';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectBeneficiaireComponent } from '../select-beneficiaire/select-beneficiaire.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TableComponent } from '../table/table.component';
import { NgIf, NgClass } from '@angular/common';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;
declare const formFields: any;

@Component({
    selector: 'app-infos-versement',
    templateUrl: './infos-versement.component.html',
    standalone: true,
    imports: [NgIf, TableComponent, ModalComponent, SpinnerComponent, NgClass, TeleportComponent, InfosBeneficiaireComponent, AutreDeviseComponent, SelectBeneficiaireComponent]
})
export class InfosVersementComponent implements OnInit {

	@ViewChild('infosBeneficiaireVersement') infosBeneficiaireVersement!: InfosBeneficiaireComponent;
	@ViewChild('autreDevise') autreDevise!: AutreDeviseComponent;
	@ViewChild('modalSaveVersement') modalSaveVersement!: ModalComponent;
	@ViewChild('teleportBeneficiaireVersement') teleportBeneficiaireVersement!: TeleportComponent;
	@ViewChild('teleportAutreDevise') teleportAutreDevise!: TeleportComponent;
	@ViewChild('tableVersements') tableVersements!: TableComponent;
	@ViewChild('teleportErrorDatePaiement') teleportErrorDatePaiement!: TeleportComponent;
	@ViewChild('selectbeneficaire') selectbeneficaire!: SelectBeneficiaireComponent;
	@ViewChild('teleportSelectBeneficiareVersement') teleportSelectBeneficiareVersement!: TeleportComponent;

	autresDevises: any = [];
	enableEdite: boolean = false;
	entite: any;
	devise: string = '';
	devises: any = [];
	montant: number = 0;
	showVersement: Boolean = false;
	lang: any = lang;
	app: any = app;
	versements: any = null;
	showErrorDatePaiement: boolean = false;
	cancelModal: boolean = false;
	reglement: any;
	persistenceIDReglement: any;
	montant_DDR: any;
	listMontantsDV: any = [];
	listMontantsDDR: any = [];
	listEcartDvDDR: any = [];
	formFields: any = formFields;
	listTiersByConcours: any;
	loadingVersement: boolean = false;
	ddvReprise: boolean = false;

	@Input() versement: any;
	@Input() caseId: any;
	@Input() read: boolean = false;
	@Input() role: any;
	@Input() tache: any = null;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();

		app.setCurrentCmp('versement', this);
	}

	ngAfterViewInit() {
		this.getVersement();
	}

	async getVersement() {
		console.time('info-versement');

		this.versement = await app.getExternalData(app.getUrl('urlGetVersement', this.versement.persistenceId), 'cmp-detail-versement > getVersement', true);
		this.versements = [this.versement];

		this.listMontantsDV = [];
		this.listMontantsDDR = [];
		this.listEcartDvDDR = [];

		this.ddvReprise = !app.isEmpty(this.versement.obj_ext_id);

		this.versement.renderNumVersement = '<span class="text-dark">' + this.versement.code_fonctionnel + '</span>'

		this.versement.renderMontantDv = this.renderMontantDv(this.versement);

		this.versement.renderMontantDDR = await this.renderSommeMontantsDDR(this.versement);

		this.versement.renderEcheances = this.renderEcheances(this.versement);

		this.versement.renderEcart = await this.renderEcartDvDDR(this.versement);

		this.versement.canceled = (app.isDossierAnnule(this.versement.code_statut_dossier) ? true : false);

		this.showVersement = true;

		await app.sleep(100);

		this.tableVersements.getItems();

		console.timeEnd('info-versement');
	}

	isDvEditable() {
		if (!this.read) {
			var codeEtape = app.getEtapeTache(this.tache);

			if (!app.isAFD(this.entite)) {
				var dvEditable = ((app.isChargeAppui(this.role) && (codeEtape == 'reglements' || codeEtape == 'controlesCG')) ||
					(app.isChargeAffaire(this.role) && codeEtape == 'controlesCA') ||
					(app.isMODAF(this.role) && codeEtape == 'controlesMODAF'));
			}
			else
				var dvEditable = (app.isAgentVersement(this.role) && (codeEtape == 'enCours' || codeEtape == 'controleAgent'));
			return dvEditable;
		}
		return false;
	}

	async gotoVersement() {
		console.time('info-versement-detail');

		this.loadingVersement = true;

		app.showModal('detailsDemandeVersement');

		this.autreDevise.displayIfValidate = false;

		if (!this.read) {
			if (!app.isDossierAnnule(this.versement.code_statut_dossier)) {
				if (this.caseId != 0)
					this.read = !this.isDvEditable();
				else if (this.caseId == 0 && !app.isAgentVersement(this.role))
					this.read = true;

				if (this.caseId == 0 && this.versement.code_statut_dossier == 'DDV3')
					this.read = true;
			} else
				this.read = true;
		}

		//verifier si la devise est utilisée par une DDR (AFD)
		if (!this.read && app.isAFD(this.entite)) {
			var result = app.checkAutreDeviseUsedByDDR(this.versement, this.versement, false);
			if (!result) {
				var indexDevisePrincipale = app.getIndexElementInArrayByValue(formFields['versement' + this.entite], 'name', 'devise');
				formFields['versement' + this.entite][indexDevisePrincipale].read = true;
			}
		}

		this.teleportBeneficiaireVersement.unteleport();
		this.teleportAutreDevise.unteleport();
		this.teleportErrorDatePaiement.unteleport();
		if (app.isAFD(this.entite))
			this.teleportSelectBeneficiareVersement.unteleport();

		app.resetDO(app.copyJson(app.resetRootDO('versementUpdate')));
		app.resetDO(app.copyJson(app.getDO('versementUpdate')));

		var DO = app.copyJson(app.getDO('versementUpdate'));

		app.setBDM(app.mapDO(DO, this.versement));

		appFormio.loadFormIO('versement' + this.entite, true);

		if (app.isAFD(this.entite)) {
			if (!this.read) {
				this.listTiersByConcours = await app.getTiersUsedByConcours(this.versement.numero_concours, this.entite, 'DV', !app.isEmpty(this.versement.id_emetteur_demande) ? this.versement.id_emetteur_demande : null);

				var tierVersement = app.getEltInArray(this.listTiersByConcours, 'idTiers', this.versement.id_emetteur_demande);

				await this.initSelectBeneficiaire(tierVersement);
			}
			await this.getBeneficiaireVersement();

			if (this.versement.autresDevises != null)
				this.getAutresDevises();
		}

		this.teleportBeneficiaireVersement.teleport();
		this.teleportAutreDevise.teleport();
		this.teleportErrorDatePaiement.teleport();
		this.teleportErrorDatePaiement.show();
		if (app.isAFD(this.entite)) {
			this.teleportSelectBeneficiareVersement.teleport();
			this.teleportSelectBeneficiareVersement.show();
		}

		this.verifDatePaiement();

		this.loadingVersement = false;

		this.tableVersements.setClickInProgress(false);

		console.timeEnd('info-versement-detail');
	}

	async saveVersement() {
		if (!app.isValidForm('formio_versement' + this.entite) || !this.autreDevise.checkAutresDevises()) {
			this.modalSaveVersement.setLoadingBtn();
			app.showToast('toastVersementSaveError');
			return;
		}

		var idDO = 'versementUpdate';

		var DO = app.getDO(idDO);

		DO.numero_dossier_versement = this.versement.numero_dossier_versement;
		if (app.isAFD(this.entite))
			DO.id_emetteur_demande = this.selectbeneficaire?.tiersSelected?.idTiers;

		if (app.isAFD(this.entite) && this.autresDevises != null)
			DO.autresDevises = this.autreDevise.autresDevises;

		await app.saveFormData(app.getRootDO(idDO), crossVars.forms['formio_versement' + this.entite], app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateVersement'));

		await app.sleep(500);

		if (app.isAFD(this.entite) && this.autresDevises != null)
			this.autresDevises = app.getNumbersFormatList(DO.autresDevises, 'montant');

		this.cancelModal = false;

		await this.getVersement();

		this.modalSaveVersement.setLoadingBtn();
		app.showToast('toastVersementSave');

		app.hideModal('detailsDemandeVersement');

		//appel pour recalcul montant DDR
		app.getCurrentCmp('reglement').getMontantDDR();

		//appel pour recalcul imputationComptable et pret adossé
		app.getCurrentCmp('reglement').calculImputationComptable();
		app.getCurrentCmp('reglement').changePretAdosse();
	}

	async getBeneficiaire() {
		this.teleportBeneficiaireVersement.show();

		await this.infosBeneficiaireVersement.getBeneficiaire('formio_versement' + this.entite, 'id_emetteur_demande', null, this.versement.numero_concours, 'DV');
	}

	async getAutresDevises() {
		this.teleportAutreDevise.show();

		for (var autreDev of this.versement.autresDevises) {
			var checkDevise = app.checkAutreDeviseUsedByDDR(this.versement, autreDev, false);
			autreDev.read = (checkDevise ? false : true);
		}

		var autresDevisesCopie = Object.assign([], this.versement.autresDevises);

		if (!this.cancelModal)
			this.autresDevises = app.getNumbersFormatList(autresDevisesCopie, 'montant');
		else
			this.autresDevises = autresDevisesCopie;
	}

	verifDatePaiement() {
		var date = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_reception');

		if (!app.isAFD(this.entite) && this.teleportErrorDatePaiement != null && date != null && date != "") {
			return (app.getLocalDate(date) < app.getCurrentDateAfterDays(4));
		}

		return false;
	}

	async getBeneficiaireVersement() {
		this.teleportBeneficiaireVersement.show();

		await this.infosBeneficiaireVersement.getBeneficiaire(null, null, (!app.isEmpty(this.selectbeneficaire?.tiersSelected) ? this.selectbeneficaire.tiersSelected.idTiers : this.versement.id_emetteur_demande), this.versement.numero_concours, 'DV');
	}

	renderMontantDv(versement: any) {
		var result = app.formatMontantTrigramme(app.formatNumberWithDecimals(versement.montant_versement), versement.devise);
		this.listMontantsDV.push({
			montant: versement.montant_versement,
			devise: versement.devise
		});

		for (var autreDevise of versement.autresDevises) {
			result += '<br>' + app.formatMontantTrigramme(app.formatNumberWithDecimals(autreDevise.montant), autreDevise.devise);
			this.listMontantsDV.push({
				montant: autreDevise.montant,
				devise: autreDevise.devise
			});
		}
		return result;
	}

	async renderSommeMontantsDDR(versement: any) {
		var devise, montant;
		var result = "";

		if (versement.dossier_reglement.length == 0)
			for (var montantDv of this.listMontantsDV)
				result += app.formatMontantTrigramme('0,00', montantDv.devise) + '<br>';
		else {
			for (var montantDevise of this.listMontantsDV) {
				devise = montantDevise.devise;
				montant = 0;

				for (var reglement of versement.dossier_reglement) {
					var deviseReglement = "";
					deviseReglement = ((reglement.type_devise == "1") ? reglement.devise_reglement : reglement.devise_reference);
					// if (app.isAFD(this.entite))
					// 	deviseReglement = ((reglement.type_devise == "1") ? reglement.devise_reglement : reglement.autre_devise);
					// else

					if (!app.isDossierAnnule(reglement.code_statut_dossier) && (devise == deviseReglement))
						montant = montant + reglement.montant_reglement;
				}

				this.listMontantsDDR.push({
					"montant": montant,
					"devise": devise
				});
			}

			for (var res of this.listMontantsDDR)
				result += app.formatMontantTrigramme(app.formatNumberWithDecimals(res.montant), res.devise) + '<br>';
		}

		return result;
	}

	async renderEcartDvDDR(versement: any) {
		var result = "";

		if (this.listMontantsDDR.length == 0) {
			for (var montantDV of this.listMontantsDV) {
				result += '<span class="text-danger">' + app.formatMontantTrigramme(app.formatNumberWithDecimals(montantDV.montant), montantDV.devise) + '</span><br>';
				this.listEcartDvDDR.push({
					"montant": montantDV.montant,
					"devise": montantDV.devise
				});
			}
		} else {
			for (var r of this.listMontantsDDR) {
				if (r.devise == versement.devise) {
					var newMontant = versement.montant_versement - r.montant;
					this.listEcartDvDDR.push({
						"montant": newMontant,
						"devise": versement.devise
					});
				}
				for (var autreDevise of versement.autresDevises) {
					if (r.devise == autreDevise.devise) {
						var newMontantA = autreDevise.montant - r.montant;
						this.listEcartDvDDR.push({
							"montant": newMontantA,
							"devise": autreDevise.devise
						});
					}
				}
			}
			for (var res of this.listEcartDvDDR)
				result += ((res.montant == 0) ? ('<span class="text-success">' + app.formatMontantTrigramme(app.formatNumberWithDecimals(res.montant), res.devise) + '</span><br>') : ('<span class="text-danger">' + app.formatMontantTrigramme(app.formatNumberWithDecimals(res.montant), res.devise) + '</span><br>'));
		}
		return result;
	}

	calculNewMontantDDR(deviseddr: any) {
		for (var ecart of this.listEcartDvDDR)
			if (!app.isEmpty(deviseddr) && ecart.devise == deviseddr)
				return ecart.montant;
	}

	renderEcheances(versement: any) {
		if (app.isAFD(this.entite))
			return 'Emise le ' + app.formatDate(versement.date_emission) + '<br>' + 'Reçue le ' + app.formatDate(versement.date_reception);
		else
			return '<span class="text-dark">' + 'Pour le ' + app.formatDate(versement.date_reception) + '</span>' + '<br>' + 'Emise le ' + app.formatDate(versement.date_emission);
	}

	annuler() {
		this.cancelModal = true;
	}

	async initSelectBeneficiaire(tierVersement?: any) {
		await this.selectbeneficaire.initSelectBeneficaire(this.listTiersByConcours, true, 'DV', tierVersement);
	}

	switchToUpdate() {
		app.redirect(this.router, app.getUrl('urlGotoVersement', this.versement.persistenceId));
	}
}