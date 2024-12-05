import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BtnComponent } from 'src/app/components/btn/btn.component';
import { InfosReglementComponent } from 'src/app/components/infos-reglement/infos-reglement.component';
import { InfosVersementComponent } from 'src/app/components/infos-versement/infos-versement.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { StoreService } from 'src/app/services/store.service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { InfosDossierComponent } from 'src/app/components/infos-dossier/infos-dossier.component';
import { NotificationComponent as NotificationComponent_1 } from '../../components/notification/notification.component';
import { InfosReglementComponent as InfosReglementComponent_1 } from '../../components/infos-reglement/infos-reglement.component';
import { TableComponent as TableComponent_1 } from '../../components/table/table.component';
import { InfosVersementComponent as InfosVersementComponent_1 } from '../../components/infos-versement/infos-versement.component';
import { InfosDossierComponent as InfosDossierComponent_1 } from '../../components/infos-dossier/infos-dossier.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent as BtnComponent_1 } from '../../components/btn/btn.component';
import { BtnMenuComponent } from '../../components/btnMenu/btnMenu.component';
import { NgIf, NgClass } from '@angular/common';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';

declare const $: any;
declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-versement-reglements',
    templateUrl: './versement-reglements.component.html',
    standalone: true,
    imports: [NavActionsComponent, NgIf, BtnMenuComponent, BtnComponent_1, ContentComponent, NgClass, CardComponent, InfosContextComponent, SpinnerComponent, InfosDossierComponent_1, InfosVersementComponent_1, TableComponent_1, InfosReglementComponent_1, NotificationComponent_1]
})
export class VersementReglementsComponent implements OnInit {

	@ViewChild('btnSaveControles') btnSaveControles!: BtnComponent;
	@ViewChild('tableReglements') tableReglements!: TableComponent;
	@ViewChild('tableVersements') tableVersements!: TableComponent;
	@ViewChild('detailsReglement') detailsReglement!: InfosReglementComponent;
	@ViewChild('detailsVersement') detailsVersement!: InfosVersementComponent;
	@ViewChild('notification') notification!: NotificationComponent;
	@ViewChild('infosDossier') infosDossier!: InfosDossierComponent;
	@ViewChild('btnAnnulerDossier') btnAnnulerDossier!: BtnComponent;

	versement: any = null;
	entite: any;
	tache: any;
	read: boolean = true;
	enableEdite: boolean = false;
	showReglement: boolean = false;
	role: string = '';
	app: any = app;
	lang: any = lang;
	caseId: any;
	reglements: any = null;
	showSidebar: boolean = true;
	perimetre: any;
	isDCV: boolean = false;
	loading: boolean = true;
	isLoadingValidate: boolean = false;
	retry: number = 0;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.role = this.store.getUserRole();
		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		app.setCurrentCmp('versement', this);
	}

	ngAfterViewInit() {
		this.getVersement();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	get isDossierAnnule() {
		return (this.versement != null ? app.isDossierAnnule(this.versement.code_statut_dossier) : false);
	}

	async validerTache(back?: any, DO?: any) {
		this.isLoadingValidate = true;

		await app.assignTache(this.tache.id, this.store.getUserId());

		await app.sleep(1000);

		await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), (DO != null ? DO : app.getRootDO('notification')));

		await app.sleep(5000);
		//ANOMALIE 3079 LIDIA
		app.resetDO('notification');

		var nbRetry = 50;
		for (var count = 1; count <= nbRetry; count++) {
			await app.sleep(100);
			var tache = await app.getExternalData(app.getUrl('urlGetTaskByCaseId', this.caseId), 'page-versement-reglements > validerTache', true);
			if (!Array.isArray(tache) && tache != null)
				break;
		}

		this.isLoadingValidate = false;

		if (back)
			app.redirect(this.router, app.getUrl('urlGotoVersementControles', this.versement.persistenceId));
	}

	annulerTache() {
		var originGotoDDV = app.getStorageItem('originGoto');
		if (originGotoDDV != null && originGotoDDV == 'projet') {
			app.setStorageItem('originGoto', '');

			app.redirect(this.router, app.getUrl('urlGotoProjetsType', app.getLocalStorageItem('projet'), 'DDV'));
		}
		else
			app.redirect(this.router, app.getUrl('urlGotoVersements'));
	}

	async getVersement() {
		this.loading = true;

		this.versement = await app.getExternalData(app.getUrl('urlGetVersement', this.route.snapshot.paramMap.get('id')), 'page-versement-reglements > getVersement', true);

		if (this.versement != null && app.isEmpty(this.versement.montant_versement) && app.isEmpty(this.versement.devise)) {
			this.retry++;

			if (this.retry > 10) {
				console.error('VersementReglementsComponent > getVersement() > RETRY MAX');
				return;
			}

			console.warn('VersementReglementsComponent > getVersement() > RETRY', this.retry);

			await app.sleep(500);

			this.getVersement();

			// return;
		} else
			this.retry = 0;

		if (await app.getPageError(this.versement.numero_projet)) {
			await this.getReglements();

			this.caseId = (app.isAFD(this.entite) ? 0 : this.versement.case_id);

			this.read = false;
			if (!app.isAFD(this.entite)) {
				this.read = await app.isReadTask(this, this.versement.case_id, this.store.getUserId());

				this.role = app.getRoleTache(this.tache); //recuperer le role de l utilisateur si c est proparco
			}

			if (app.isAuditeur(this.store.getUserRole()))
				this.read = true;

			this.loading = false;
		}
	}

	async getReglements() {
		var reglementsBDD = await app.getExternalData(app.getUrl('urlGetReglementsByNumVersement', this.versement.numero_dossier_versement), 'page-versement-reglements > getVersement > reglements');
		this.reglements = await app.mergeDataConcoursWithDDRs(reglementsBDD, this.versement.numero_projet);

		await app.sleep(500);

		this.tableReglements.getItems();
	}

	async gotoReglement(item?: any) {
		if (await app.getPageError(this.versement.numero_projet)) {
			if (item == null) { //ajout d'une DDR sur un versement
				app.setStorageItem('idAvanceContractuel', null);
				app.setStorageItem('idDocumentContractuel', null);
				app.setStorageItem('idReglementRefreshPage', null);
				app.setStorageItem('originGoto', null);

				await app.sleep(250);

				app.redirect(this.router, app.getUrl('urlAddReglement', this.versement.persistenceId));
			} else {
				var read = await app.isReadTask(this, (app.isAFD(this.entite) ? item.case_id : this.versement.case_id), this.store.getUserId());
				var ctrls = (app.isAFD(this.entite) ? await app.getExternalData(app.getUrl('urlGetControles', item.case_id), 'versement-reglements > gotoReglement - controles') : []);

				if (app.isAFD(this.entite) && (ctrls.length > 0 || !app.isEmpty(item.obj_ext_id)))
					app.redirect(this.router, app.getUrl('urlGotoReglementControles', item.persistenceId));
				else {
					var update = !read && !app.isDossierAnnule(item.code_statut_dossier) && (app.isRoleEnableEditDossier(this.role, this.versement) || app.isChargeProjet(this.role));

					this.showReglement = true;

					await app.sleep(150);

					await this.detailsReglement.gotoReglement(item, this.versement, update);

					this.tableReglements.setClickInProgress(false);
				}
			}
		}
	}

	async downloadFile(reglement?: any) {
		await app.downloadDocument(reglement, true);
	}

	async getAutresDevises() {
		await this.detailsVersement.getAutresDevises();
	}

	async getBeneficiaireVersement() {
		await this.detailsVersement.getBeneficiaire();
	}

	async annulerDossier(DONotification?: any) {
		if (DONotification == null) {
			this.annulerAction('-1');
			app.showToast('toastImpossibleAnnulerDossier');
		}
		else {
			if (!app.isAFD(this.entite))
				await this.validerTache(false, DONotification);
			else {
				var DO = app.getDO('versementUpdate');
				DO.numero_dossier_versement = this.versement.numero_dossier_versement;
				DO.numero_dossier_versement = this.versement.numero_dossier_versement;
				DO.notificationMailInput.corpNotification = DONotification.notificationMailInput.corpNotification;
				DO.decision = DONotification.decision;
				DO.urlDossier = DONotification.urlDossier;

				await app.postData(app.getRootDO('versementUpdate'), app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateVersement'));

				await app.sleep(50);

				app.resetDO('versementUpdate');
			}

			await app.sleep(1000);

			this.notification.setLoadingBtn();
			this.notification.hideModal();
			//ANOMALIE 3079 LIDIA
			app.resetDO('notification');
			app.resetDO('versementUpdate');
			
			app.showToast('toastVersementAnnulerOk');

			await app.sleep(250);

			await this.getVersement();

			await this.infosDossier.getNotifications();
		}
	}

	annulerAction(action: any) {
		if (action == '-1')
			this.btnAnnulerDossier.setLoading(false);
	}
}