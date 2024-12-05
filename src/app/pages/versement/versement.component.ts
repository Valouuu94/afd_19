import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutreDeviseComponent } from 'src/app/components/autre-devise/autre-devise.component';
import { BtnComponent } from 'src/app/components/btn/btn.component';
import { InfosBeneficiaireComponent } from 'src/app/components/infos-beneficiaire/infos-beneficiaire.component';
import { TeleportComponent } from 'src/app/components/teleport/teleport.component';
import { StoreService } from 'src/app/services/store.service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { InfosDossierComponent } from 'src/app/components/infos-dossier/infos-dossier.component';
import { SelectBeneficiaireComponent } from 'src/app/components/select-beneficiaire/select-beneficiaire.component';
import { SelectBeneficiaireComponent as SelectBeneficiaireComponent_1 } from '../../components/select-beneficiaire/select-beneficiaire.component';
import { InfosBeneficiaireComponent as InfosBeneficiaireComponent_1 } from '../../components/infos-beneficiaire/infos-beneficiaire.component';
import { AutreDeviseComponent as AutreDeviseComponent_1 } from '../../components/autre-devise/autre-devise.component';
import { TeleportComponent as TeleportComponent_1 } from '../../components/teleport/teleport.component';
import { NotificationComponent as NotificationComponent_1 } from '../../components/notification/notification.component';
import { InfosDossierComponent as InfosDossierComponent_1 } from '../../components/infos-dossier/infos-dossier.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent as BtnComponent_1 } from '../../components/btn/btn.component';
import { BtnMenuComponent } from '../../components/btnMenu/btnMenu.component';
import { NgIf, NgClass } from '@angular/common';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;
declare const $: any;
declare const formFields: any;

@Component({
    selector: 'app-versement',
    templateUrl: './versement.component.html',
    standalone: true,
    imports: [NavActionsComponent, NgIf, BtnMenuComponent, BtnComponent_1, ContentComponent, NgClass, CardComponent, InfosContextComponent, SpinnerComponent, InfosDossierComponent_1, NotificationComponent_1, TeleportComponent_1, AutreDeviseComponent_1, InfosBeneficiaireComponent_1, SelectBeneficiaireComponent_1]
})
export class VersementComponent implements OnInit {

	@ViewChild('btnSaveVersement') btnSaveVersement!: BtnComponent;
	@ViewChild('autreDevise') autreDevise!: AutreDeviseComponent;
	@ViewChild('teleportAutreDevise') teleportAutreDevise!: TeleportComponent;
	@ViewChild('teleportErrorDatePaiement') teleportErrorDatePaiement!: TeleportComponent;
	@ViewChild('notification') notification!: NotificationComponent;
	@ViewChild('infosDossier') infosDossier!: InfosDossierComponent;
	@ViewChild('btnAnnulerDossier') btnAnnulerDossier!: BtnComponent;
	@ViewChild('teleportBeneficiaireVersement') teleportBeneficiaireVersement!: TeleportComponent;
	@ViewChild('infosBeneficiaire') infosBeneficiaire!: InfosBeneficiaireComponent;
	@ViewChild('selectbeneficaire') selectbeneficaire!: SelectBeneficiaireComponent;
	@ViewChild('teleportSelectBeneficiareVersement') teleportSelectBeneficiareVersement!: TeleportComponent;

	versement: any;
	entite: string = '';
	tache: any;
	read: boolean = true;
	autresDevises: any = [];
	devises: any = [];
	montant: number = 0;
	devise: string = '';
	item: any;
	role: string = '';
	app: any = app;
	lang: any = lang;
	isDossierAnnule: boolean = false;
	listTiersByConcours: any;
	showSidebar: boolean = true;
	perimetre: any;
	isDCV: boolean = false;
	loading: boolean = true;
	formFields: any = formFields;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.role = this.store.getUserRole();
		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		app.setCurrentCmp('versement', this);
	}

	async ngAfterViewInit() {
		await this.getVersement();

		this.teleportAutreDevise.teleport();
		this.teleportBeneficiaireVersement.teleport();
		this.teleportErrorDatePaiement.teleport();
		this.teleportErrorDatePaiement.show();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	async annulerTache() {
		app.redirect(this.router, app.getUrl('urlGotoVersements'));
	}

	async validerTache() {
		//Si c'est AFD on fait le save car y a pas de tache(Lidia 03/10/2024)
		if ((app.isAFD(this.entite) || (!app.isAFD(this.entite) && app.taskIsNotControles(app.getEtapeTache(this.tache)))) && await this.saveVersement(true) == null)
			return;

		if (!app.isAFD(this.entite)) {
			var codeEtape = app.getEtapeTache(this.tache);

			//Anomalie 2223(Lidia 03/10/2024)
			if (!app.taskIsNotControles(codeEtape)) {
				//valider le formulaire
				var validForm = app.isValidForm('formio_versement' + this.entite);

				if (!validForm) {
					app.showToast('toastVersementSaveError');
					return;
				}

				//Envoyer toutes les informations a mettre à jour lors de l'éxecution de la tache pour eviter l'acces concurrent à la base
				var DO = app.getRootDO('notification');

				DO.montant_versement = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'montant_versement');
				DO.devise = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'devise');
				DO.lien_ged = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'lien_ged');
				DO.date_emission = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_emission') == '' ? null : appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_emission');
				DO.date_reception = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_reception') == '' ? null : appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_reception');
				DO.memo = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'memo');
				DO.date_leve_condition_suspensive = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_leve_condition_suspensive') == '' ? null : appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_leve_condition_suspensive'); await app.assignTache(this.tache.id, this.store.getUserId());
				DO.decision = "";
				await app.sleep(1000);

				await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), app.getRootDO('notification'));
			}

			if (codeEtape != 'reglements' && codeEtape != 'enCours') //TODO : c sur ???
				app.redirect(this.router, app.getUrl('urlGotoVersementControles', this.versement.persistenceId));
			else {
				//Verifier si la tache est créee quand c'est la premiere DDR
				if (this.versement.dossier_reglement.length == 0) {
					var nameNewTask = await app.verifTaskCreated(this.versement.case_id);
					if (nameNewTask != null)
						console.log("la tache " + nameNewTask + " a ete bien creee");
					else
						console.log("la tache " + nameNewTask + "n'a pas ete creee");
				}
				app.resetDO('notification');
				
				//faire le redirect dans tous les cas, soit la tache a été créée ou pas
				app.redirect(this.router, app.getUrl('urlGotoVersementReglements', this.versement.persistenceId));
			}
		}
		else
			app.redirect(this.router, app.getUrl('urlGotoVersementReglements', this.versement.persistenceId));
	}

	async getVersement() {
		console.time('versement');

		this.loading = true;

		var idVersement = this.route.snapshot.paramMap.get('id');

		app.cleanDiv('formio_versement' + this.entite);

		if (idVersement == null) {
			console.error('page-versement > getVersement : id versement is null');
			return;
		}

		this.versement = await app.getExternalData(app.getUrl('urlGetVersement', idVersement), 'page-versement > getVersement', true);

		if (await app.getPageError(this.versement.numero_projet)) {
			this.isDossierAnnule = app.isDossierAnnule(this.versement.code_statut_dossier);
			this.listTiersByConcours = await app.getTiersUsedByConcours(this.versement.numero_concours, this.entite, 'DV', !app.isEmpty(this.versement.id_emetteur_demande) ? this.versement.id_emetteur_demande : null);

			this.read = this.isDossierAnnule;
			if (!this.read) {
				if (!app.isAFD(this.entite))
					this.read = await app.isReadTask(this, this.versement.case_id, this.store.getUserId());
				else
					this.read = !app.isAgentVersement(this.role);
			}

			if (app.isAuditeur(this.role))
				this.read = true;

			//verifier si la devise est utilisée par une DDR (AFD)
			if (!this.read && app.isAFD(this.entite)) {
				var indexDevisePrincipale = app.getIndexElementInArrayByValue(formFields['versement' + this.entite], 'name', 'devise');

				formFields['versement' + this.entite][indexDevisePrincipale].read = false;

				var result = await app.checkAutreDeviseUsedByDDR(this.versement, this.versement, false);
				if (!result)
					formFields['versement' + this.entite][indexDevisePrincipale].read = true;
			}

			app.resetDO('versementUpdate');

			var DO = app.getDO('versementUpdate');

			app.setBDM(app.mapDO(DO, this.versement));

			//reverse teleport avant formio
			this.teleportAutreDevise.unteleport();
			this.teleportBeneficiaireVersement.unteleport();
			this.teleportErrorDatePaiement.unteleport();
			if (app.isAFD(this.entite) && this.versement != null)
				this.teleportSelectBeneficiareVersement.unteleport();

			appFormio.loadFormIO('versement' + this.entite, this.read);

			if (app.isAFD(this.entite) && this.versement != null) {
				if (this.versement.autresDevises != null)
					this.getAutresDevises();

				if (this.versement.id_emetteur_demande != null) {
					var tierVersement = app.getEltInArray(this.listTiersByConcours, 'idTiers', this.versement.id_emetteur_demande);

					this.initSelectBeneficiaire(tierVersement);

					this.getBeneficiaireVersement();
				} else
					this.initSelectBeneficiaire();

				this.teleportSelectBeneficiareVersement.teleport();
				this.teleportSelectBeneficiareVersement.show();
			}
			this.loading = false;
		}
		console.timeEnd('versement');
	}

	async saveVersement(validate: any) {
		var validForm = app.isValidForm('formio_versement' + this.entite) && this.autreDevise.checkAutresDevises();

		if (app.isAFD(this.entite) && this.selectbeneficaire.checkSelectedBeneficiaire())
			validForm = false;

		if (!validForm) {
			this.btnSaveVersement.setLoading(false);
			app.showToast('toastVersementSaveError');
			return;
		}

		var idDO = 'versementUpdate';

		var DO = app.getDO(idDO);
		DO.numero_dossier_versement = this.versement.numero_dossier_versement;
		DO.code_statut = ((validate && app.isAFD(this.entite)) ? 'reglements' : '');

		if (app.isAFD(this.entite))
			DO.id_emetteur_demande = this.selectbeneficaire?.tiersSelected?.idTiers;

		if (this.autreDevise != null && this.autreDevise != null && app.isAFD(this.entite))
			DO.autresDevises = this.autreDevise.autresDevises;

		await app.saveFormData(app.getRootDO(idDO), crossVars.forms['formio_versement' + this.entite], app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateVersement'));

		if (this.autreDevise != null && this.autreDevise != null && app.isAFD(this.entite))
			this.autresDevises = app.getNumbersFormatList(DO.autresDevises, 'montant');

		await app.sleep(1500);
		this.btnSaveVersement.setLoading(false);

		app.showToast('toastVersementSave');

		return true;
	}

	async annulerDossier(DONotification?: any) {
		if (DONotification == null) {
			this.btnAnnulerDossier.setLoading(false);
			app.showToast('toastImpossibleAnnulerDossier');
		}
		else {
			if (!app.isAFD(this.entite)) {
				await app.assignTache(this.tache.id, this.store.getUserId());

				await app.sleep(1000);

				await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), DONotification);

				app.resetDO(DONotification);
			} else {
				var idDO = 'versementUpdate';

				var DO = app.getDO(idDO);
				DO.numero_dossier_versement = this.versement.numero_dossier_versement;
				DO.notificationMailInput.corpNotification = DONotification.notificationMailInput.corpNotification;
				DO.decision = DONotification.decision;
				DO.urlDossier = DONotification.urlDossier;

				await app.postData(app.getRootDO(idDO), app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateVersement'));

				app.resetDO(DO);
			}

			await app.sleep(1000);

			this.notification.setLoadingBtn();
			this.notification.hideModal();

			app.showToast('toastVersementAnnulerOk');

			await this.getVersement();

			await this.infosDossier.getNotifications();

			await this.initSelectBeneficiaire(this.versement.id_emetteur_demande);
		}
	}

	annulerAction(action: any) {
		if (action == '-1')
			this.btnAnnulerDossier.setLoading(false);
	}

	async getAutresDevises() {
		this.teleportAutreDevise.show();

		for (var autreDev of this.versement.autresDevises) {
			var checkDevise = app.checkAutreDeviseUsedByDDR(this.versement, autreDev, false);
			autreDev.read = (checkDevise ? false : true);
		}

		this.autresDevises = app.getNumbersFormatList(this.versement.autresDevises, 'montant');
	}

	verifDatePaiement() {
		var date = null;
		if (!app.isAFD(this.entite)) {
			date = appFormio.getDataValue(crossVars.forms['formio_versement' + this.entite], 'date_reception');

			if (this.teleportErrorDatePaiement != null && date != null && date != "") {
				return (app.getLocalDate(date) < app.getCurrentDateAfterDays(4));
			}
		}

		return false;
	}

	async getBeneficiaireVersement() {
		this.teleportBeneficiaireVersement.show();

		await this.infosBeneficiaire.getBeneficiaire(null, null, this.selectbeneficaire.tiersSelected.idTiers, this.versement.numero_concours, 'DV');
	}

	async initSelectBeneficiaire(tierVersement?: any) {
		await this.selectbeneficaire.initSelectBeneficaire(this.listTiersByConcours, this.read, 'DV', tierVersement);
	}
}