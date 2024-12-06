import { Component, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationComponent } from '../../components/notification/notification.component';
import { TableComponent } from '../../components/table/table.component';
import { ControlesComponent } from '../../components/controles/controles.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';
import { InfosDossierComponent } from '../../components/infos-dossier/infos-dossier.component';
import { StoreService } from '../../services/store.service';

declare const app: any;
declare const urls: any;
declare const lang: any;
declare const $: any;

@Component({
    selector: 'app-avance-contractuel-controles',
    templateUrl: './avance-contractuel-controles.component.html',
    standalone: true,
    imports: [NavActionsComponent, BtnComponent, ContentComponent, CardComponent, InfosContextComponent, SpinnerComponent, ControlesComponent, TableComponent, NotificationComponent]
})
export class AvanceContractuelControlesComponent implements OnInit {

	readonly btnSaveControles = viewChild.required<BtnComponent>('btnSaveControles');
	readonly avanceContractuelControles = viewChild.required<ControlesComponent>('avanceContractuelControles');
	readonly notification = viewChild.required<NotificationComponent>('notification');
	readonly infosDossier = viewChild.required<InfosDossierComponent>('infosDossier');
	readonly btnAnnulerDossier = viewChild.required<BtnComponent>('btnAnnulerDossier');
	readonly tableAnomalies = viewChild.required<TableComponent>('tableAnomalies');

	id: any;
	entite: any;
	role: any;
	tache: any;
	read: boolean = true;
	step: any;
	app: any = app;
	lang: any = lang;
	commentsDeployed: boolean = false;
	countControlesChecked: any;
	countControlesTotal: any;
	themesControles: any;
	avanceContractuel: any = null;
	avanceContratcuelRAJDefault: any = null;
	showSidebar: boolean = true;
	perimetre: any;
	isDCV: boolean = false;
	loading: boolean = true;
	anomalies: any = [];

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService, private location: Location) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.role = this.store.getUserRole();
		this.isDCV = app.isDCV(this.entite, this.store.getUserPerimetre());

		app.setCurrentCmp('controles', this);
	}

	async ngAfterViewInit() {
		await this.getAvanceContractuel();

		if (this.isDCV)
			await this.getAnomalies();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	async autoSave() {
		if (this.avanceContractuelControles().updatedValue) {
			app.showToast('toastControlesAutoSave');

			await app.sleep(5000);

			await this.validerTache(false);
		}
	}

	async validerTache(validate: any, DO?: any, showModal?: any, verifControle?: any) {
		var controles = await this.avanceContractuelControles().saveControles(verifControle);

		if (controles == null) {
			this.btnSaveControles().setLoading(false);
			return;
		}

		app.log('page-avance-contractuel-controles > validerTache - controles, rootDoControles', controles, app.getRootDO('controles'));

		await app.saveFormData(app.getRootDO('controles'), null, urls['urlProcessInstanciation'], urls['urlProcessUpdateControles']);

		if (validate) {
			await app.sleep(1000);

			await app.assignTache(this.tache.id, this.store.getUserId());

			await app.sleep(1000);

			await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), {});

			await app.sleep(250);

			this.notification().setLoadingBtn();
			this.notification().hideModal();

			app.showToast('toastControlesValid');

			await app.sleep(4000);
			
			app.redirect(this.router, app.getUrl('urlGotoTaches'));
		} else {
			//update statut avance contractuel
			var DOAvance = app.getDO("avanceContractuelRAJDefault");
			DOAvance.persistenceId = this.avanceContratcuelRAJDefault.persistenceId;

			await app.saveFormData(app.getRootDO('avanceContractuelRAJDefault'), null, urls['urlProcessInstanciation'], urls['urlProcessUpdateAvanceRAJDefault']);
			await app.sleep(250);

			this.btnSaveControles().setLoading(false);

			await this.getAvanceContractuel();

			this.notification().setLoadingBtn();
			this.notification().hideModal();

			app.showToast('toastControlesSave');
		}
	}

	async validerTacheDCV() {
		await this.notification().validerTache(true);
	}

	async annulerTache() {
		this.location.back();
	}

	async getAvanceContractuel() {
		this.loading = true;
		this.id = this.route.snapshot.paramMap.get('id');

		this.avanceContratcuelRAJDefault = await app.getExternalData(app.getUrl('urlGetAvanceRAJDefaultByPersistenceId', this.id), 'page-avanceContractuel-controles > getAvanceContractuelRAJDefault', true);
		this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvance', this.avanceContratcuelRAJDefault.persistenceId_avance_contractuel), 'page-avanceContractuel-controles > getAvanceContractuel', true);

		app.setLocalStorageItem('numAvanceRAJ', this.avanceContratcuelRAJDefault.persistenceId);

		var caseId = (app.isEmpty(this.avanceContratcuelRAJDefault.case_id_raj_default) ? this.avanceContratcuelRAJDefault.case_id_raj_zero : this.avanceContratcuelRAJDefault.case_id_raj_default);

		this.read = await app.isReadTask(this, caseId, this.store.getUserId());

		this.step = app.getEtapeTache(this.tache);

		await this.avanceContractuelControles().loadControles(caseId, this.tache);

		await app.sleep(100);

		this.loading = false;
	}

	toggleComments() {
		var controles = this.avanceContractuelControles().controles;

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

	async validerControles() {
		var controles = await this.avanceContractuelControles().saveControles(true);

		return !(controles == null);
	}

	async getAnomalies() {
		this.anomalies = await app.getExternalData(app.getUrl('urlGetAllAnomaliesByCaseIdDossier', this.avanceContractuelControles().caseId), 'page > historique-dossiers > getAnomaliesByDC');

		if (this.anomalies != null && this.anomalies.length > 0)
			for (var ano of this.anomalies)
				ano.acteur2ndNiveau = ano.name_controleur2nd;

		await app.sleep(150);

		this.tableAnomalies().getItems();
	}

	async gotoAnomalie(item: any) {
		const avanceContractuelControles = this.avanceContractuelControles();
  if (avanceContractuelControles.controles != null && avanceContractuelControles.controles.length > 0) {
			if (avanceContractuelControles.controles[0].type == "controlesRAJZero")
				app.redirect(this.router, app.getUrl('urlGotoHistoriqueAnomalieRajZero', item.persistenceId));
			else
				app.redirect(this.router, app.getUrl('urlGotoHistoriqueAnomalieRajDefaut', item.persistenceId));
		}
	}
}