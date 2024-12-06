import { input, signal, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { AutreDeviseComponent } from '../autre-devise/autre-devise.component';
import { InfosBeneficiaireComponent } from '../infos-beneficiaire/infos-beneficiaire.component';
import { ModalComponent } from '../modal/modal.component';
import { TeleportComponent } from '../teleport/teleport.component';
import { Component, OnInit } from '@angular/core';
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

	readonly infosBeneficiaireVersement = viewChild.required<InfosBeneficiaireComponent>('infosBeneficiaireVersement');
	readonly autreDevise = viewChild.required<AutreDeviseComponent>('autreDevise');
	readonly modalSaveVersement = viewChild.required<ModalComponent>('modalSaveVersement');
	readonly teleportBeneficiaireVersement = viewChild.required<TeleportComponent>('teleportBeneficiaireVersement');
	readonly teleportAutreDevise = viewChild.required<TeleportComponent>('teleportAutreDevise');
	readonly tableVersements = viewChild.required<TableComponent>('tableVersements');
	readonly teleportErrorDatePaiement = viewChild.required<TeleportComponent>('teleportErrorDatePaiement');
	readonly selectbeneficaire = viewChild.required<SelectBeneficiaireComponent>('selectbeneficaire');
	readonly teleportSelectBeneficiareVersement = viewChild.required<TeleportComponent>('teleportSelectBeneficiareVersement');

	autresDevises = signal<any>([]);
	enableEdite = signal<boolean>(false);
	entite = signal<any>(null);
	devise = signal<string>('');
	devises = signal<any>([]);
	montant = signal<number>(0);
	showVersement = signal<boolean>(false);
	lang = signal<any>(lang);
	app = signal<any>(app);
	versements = signal<any>(null);
	showErrorDatePaiement = signal<boolean>(false);
	cancelModal = signal<boolean>(false);
	reglement = signal<any>(null);
	persistenceIDReglement = signal<any>(null);
	montant_DDR = signal<any>(null);
	listMontantsDV = signal<any>([]);
	listMontantsDDR = signal<any>([]);
	listEcartDvDDR = signal<any>([]);
	formFields = signal<any>(formFields);
	listTiersByConcours = signal<any>(null);
	loadingVersement = signal<boolean>(false);
	ddvReprise = signal<boolean>(false);

	readonly versement = input<any>();
	readonly caseId = input<any>();
	readonly read = input<boolean>(false);
	readonly role = input<any>();
	readonly tache = input<any>(null);

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit(): void {
		this.entite.set(this.store.getUserEntite());
	
		app.setCurrentCmp('versement', this);
	  }
	
	  ngAfterViewInit(): void {
		this.getVersement();
	  }

	async getVersement(): Promise<void> {
		console.time('info-versement');
	
		const versementData = await app.getExternalData(app.getUrl('urlGetVersement', this.versement().persistenceId), 'cmp-detail-versement > getVersement', true);
		this.versement().set(versementData);
		this.versements.set([this.versement()]);
	
		this.listMontantsDV.set([]);
		this.listMontantsDDR.set([]);
		this.listEcartDvDDR.set([]);
	
		this.ddvReprise.set(!app.isEmpty(this.versement().obj_ext_id));
	
		const versement = this.versement();
		versement.renderNumVersement = '<span class="text-dark">' + versement.code_fonctionnel + '</span>';
	
		versement.renderMontantDv = this.renderMontantDv(versement);
	
		versement.renderMontantDDR = await this.renderSommeMontantsDDR(versement);
	
		versement.renderEcheances = this.renderEcheances(versement);
	
		versement.renderEcart = await this.renderEcartDvDDR(versement);
	
		versement.canceled = app.isDossierAnnule(versement.code_statut_dossier);
	
		this.showVersement.set(true);
	
		await app.sleep(100);
	
		this.tableVersements().getItems();
	
		console.timeEnd('info-versement');
	  }

	isDvEditable(): boolean {
		if (!this.read()) {
		  const codeEtape = app.getEtapeTache(this.tache());
	
		  if (!app.isAFD(this.entite())) {
			const role = this.role();
			return (app.isChargeAppui(role) && (codeEtape === 'reglements' || codeEtape === 'controlesCG')) ||
				   (app.isChargeAffaire(role) && codeEtape === 'controlesCA') ||
				   (app.isMODAF(role) && codeEtape === 'controlesMODAF');
		  } else {
			return app.isAgentVersement(this.role()) && (codeEtape === 'enCours' || codeEtape === 'controleAgent');
		  }
		}
		return false;
	  }

async gotoVersement(): Promise<void> {
    console.time('info-versement-detail');

    this.loadingVersement.set(true);

    app.showModal('detailsDemandeVersement');

    this.autreDevise().displayIfValidate = false;

    const versement = this.versement();
    const readValue = this.read(); // Obtenez la valeur actuelle du InputSignal
	let newReadValue = readValue; // Initialise avec la valeur actuelle

	if (!readValue) {
		if (!app.isDossierAnnule(versement.code_statut_dossier)) {
			const caseId = this.caseId();
			if (caseId !== 0) {
			newReadValue = !this.isDvEditable();
			} else if (caseId === 0 && !app.isAgentVersement(this.role())) {
			newReadValue = true;
			}

			if (caseId === 0 && versement.code_statut_dossier === 'DDV3') {
			newReadValue = true;
			}
		} else {
			newReadValue = true;
		}
	}

		//verifier si la devise est utilisée par une DDR (AFD)
		if (!this.read() && app.isAFD(this.entite)) {
			var result = app.checkAutreDeviseUsedByDDR(versement, versement, false);
			if (!result) {
				var indexDevisePrincipale = app.getIndexElementInArrayByValue(formFields['versement' + this.entite], 'name', 'devise');
				formFields['versement' + this.entite][indexDevisePrincipale].read = true;
			}
		}

		this.teleportBeneficiaireVersement().unteleport();
		this.teleportAutreDevise().unteleport();
		this.teleportErrorDatePaiement().unteleport();
		if (app.isAFD(this.entite))
			this.teleportSelectBeneficiareVersement().unteleport();

		app.resetDO(app.copyJson(app.resetRootDO('versementUpdate')));
		app.resetDO(app.copyJson(app.getDO('versementUpdate')));

		var DO = app.copyJson(app.getDO('versementUpdate'));

		app.setBDM(app.mapDO(DO, versement));

		appFormio.loadFormIO('versement' + this.entite, true);

		if (app.isAFD(this.entite)) {
			if (!this.read()) {
				this.listTiersByConcours = await app.getTiersUsedByConcours(versement.numero_concours, this.entite, 'DV', !app.isEmpty(versement.id_emetteur_demande) ? versement.id_emetteur_demande : null);

				var tierVersement = app.getEltInArray(this.listTiersByConcours, 'idTiers', versement.id_emetteur_demande);

				await this.initSelectBeneficiaire(tierVersement);
			}
			await this.getBeneficiaireVersement();

			if (versement.autresDevises != null)
				this.getAutresDevises();
		}

		this.teleportBeneficiaireVersement().teleport();
		this.teleportAutreDevise().teleport();
		this.teleportErrorDatePaiement().teleport();
		this.teleportErrorDatePaiement().show();
		if (app.isAFD(this.entite)) {
			this.teleportSelectBeneficiareVersement().teleport();
			this.teleportSelectBeneficiareVersement().show();
		}

		this.verifDatePaiement();

		this.loadingVersement.set(false);

		this.tableVersements().setClickInProgress(false);

		console.timeEnd('info-versement-detail');
	}

	async saveVersement(): Promise<void> {
		const autreDevise = this.autreDevise();
		if (!app.isValidForm('formio_versement' + this.entite()) || !autreDevise.checkAutresDevises()) {
		  this.modalSaveVersement().setLoadingBtn();
		  app.showToast('toastVersementSaveError');
		  return;
		}
	
		const idDO = 'versementUpdate';
	
		const DO = app.getDO(idDO);

		DO.numero_dossier_versement = this.versement().numero_dossier_versement;
		if (app.isAFD(this.entite())) {
		  DO.id_emetteur_demande = this.selectbeneficaire()?.tiersSelected?.idTiers;
		}
	
		if (app.isAFD(this.entite()) && this.autresDevises() != null) {
		  DO.autresDevises = autreDevise.autresDevises();
		}
	
		await app.saveFormData(app.getRootDO(idDO), crossVars.forms['formio_versement' + this.entite()], app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateVersement'));
	
		await app.sleep(500);
	
		if (app.isAFD(this.entite()) && this.autresDevises() != null) {
		  this.autresDevises.set(app.getNumbersFormatList(DO.autresDevises, 'montant'));
		}
	
		this.cancelModal.set(false);
	
		await this.getVersement();
	
		this.modalSaveVersement().setLoadingBtn();
		app.showToast('toastVersementSave');
	
		app.hideModal('detailsDemandeVersement');
	
		app.getCurrentCmp('reglement').getMontantDDR();
	
		app.getCurrentCmp('reglement').calculImputationComptable();
		app.getCurrentCmp('reglement').changePretAdosse();
	  }

	async getBeneficiaire() {
		this.teleportBeneficiaireVersement().show();

		await this.infosBeneficiaireVersement().getBeneficiaire('formio_versement' + this.entite, 'id_emetteur_demande', null, this.versement().numero_concours, 'DV');
	}

	async getAutresDevises() {
		this.teleportAutreDevise().show();

		for (var autreDev of this.versement().autresDevises) {
			var checkDevise = app.checkAutreDeviseUsedByDDR(this.versement(), autreDev, false);
			autreDev.read = (checkDevise ? false : true);
		}

		var autresDevisesCopie = Object.assign([], this.versement().autresDevises);

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

	async getBeneficiaireVersement(): Promise<void> {
		this.teleportBeneficiaireVersement().show();
	
		const selectbeneficaire = this.selectbeneficaire();
		await this.infosBeneficiaireVersement().getBeneficiaire(null, null, !app.isEmpty(selectbeneficaire?.tiersSelected) ? selectbeneficaire.tiersSelected.idTiers : this.versement().id_emetteur_demande, this.versement().numero_concours, 'DV');
	  }

	renderMontantDv(versement: any): string {
		let result = app.formatMontantTrigramme(app.formatNumberWithDecimals(versement.montant_versement), versement.devise);
		this.listMontantsDV().push({
		  montant: versement.montant_versement,
		  devise: versement.devise
		});
	
		for (const autreDevise of versement.autresDevises) {
		  result += '<br>' + app.formatMontantTrigramme(app.formatNumberWithDecimals(autreDevise.montant), autreDevise.devise);
		  this.listMontantsDV().push({
			montant: autreDevise.montant,
			devise: autreDevise.devise
		  });
		}
		return result;
	  }

	async renderSommeMontantsDDR(versement: any): Promise<string> {
		let result = "";
	
		if (versement.dossier_reglement.length === 0) {
		  for (const montantDv of this.listMontantsDV()) {
			result += app.formatMontantTrigramme('0,00', montantDv.devise) + '<br>';
		  }
		} else {
		  for (const montantDevise of this.listMontantsDV()) {
			let devise = montantDevise.devise;
			let montant = 0;
	
			for (const reglement of versement.dossier_reglement) {
			  const deviseReglement = reglement.type_devise === "1" ? reglement.devise_reglement : reglement.devise_reference;
	
			  if (!app.isDossierAnnule(reglement.code_statut_dossier) && devise === deviseReglement) {
				montant += reglement.montant_reglement;
			  }
			}
	
			this.listMontantsDDR().push({
			  montant: montant,
			  devise: devise
			});
		  }
	
		  for (const res of this.listMontantsDDR()) {
			result += app.formatMontantTrigramme(app.formatNumberWithDecimals(res.montant), res.devise) + '<br>';
		  }
		}
	
		return result;
	  }

	async renderEcartDvDDR(versement: any): Promise<string> {
		let result = "";
	
		if (this.listMontantsDDR().length === 0) {
		  for (const montantDV of this.listMontantsDV()) {
			result += '<span class="text-danger">' + app.formatMontantTrigramme(app.formatNumberWithDecimals(montantDV.montant), montantDV.devise) + '</span><br>';
			this.listEcartDvDDR().push({
			  montant: montantDV.montant,
			  devise: montantDV.devise
			});
		  }
		} else {
		  for (const r of this.listMontantsDDR()) {
			if (r.devise === versement.devise) {
			  const newMontant = versement.montant_versement - r.montant;
			  this.listEcartDvDDR().push({
				montant: newMontant,
				devise: versement.devise
			  });
			}
			for (const autreDevise of versement.autresDevises) {
			  if (r.devise === autreDevise.devise) {
				const newMontantA = autreDevise.montant - r.montant;
				this.listEcartDvDDR().push({
				  montant: newMontantA,
				  devise: autreDevise.devise
				});
			  }
			}
		  }
		  for (const res of this.listEcartDvDDR()) {
			result += res.montant === 0 ? '<span class="text-success">' + app.formatMontantTrigramme(app.formatNumberWithDecimals(res.montant), res.devise) + '</span><br>' : '<span class="text-danger">' + app.formatMontantTrigramme(app.formatNumberWithDecimals(res.montant), res.devise) + '</span><br>';
		  }
		}
		return result;
	}

	calculNewMontantDDR(deviseddr: any): number | undefined {
		for (const ecart of this.listEcartDvDDR()) {
		  if (!app.isEmpty(deviseddr) && ecart.devise === deviseddr) {
			return ecart.montant;
		  }
		}
	  }

	renderEcheances(versement: any): string {
		if (app.isAFD(this.entite())) {
		  return 'Emise le ' + app.formatDate(versement.date_emission) + '<br>' + 'Reçue le ' + app.formatDate(versement.date_reception);
		} else {
		  return '<span class="text-dark">' + 'Pour le ' + app.formatDate(versement.date_reception) + '</span>' + '<br>' + 'Emise le ' + app.formatDate(versement.date_emission);
		}
	  }
	
	  annuler(): void {
		this.cancelModal.set(true);
	  }
	
	  async initSelectBeneficiaire(tierVersement?: any): Promise<void> {
		await this.selectbeneficaire().initSelectBeneficaire(this.listTiersByConcours(), true, 'DV', tierVersement);
	  }
	
	  switchToUpdate(): void {
		app.redirect(this.router, app.getUrl('urlGotoVersement', this.versement().persistenceId));
	  }
}