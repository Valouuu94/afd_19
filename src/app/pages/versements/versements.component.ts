import { Component, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ModalComponent  } from '../../components/modal/modal.component';
import { ExportExcelComponent  } from '../../components/export-excel/export-excel.component';
import { TableComponent  } from '../../components/table/table.component';

import { ContentComponent } from '../../components/content/content.component';
import { StoreService } from '../../services/store.service';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const urls: any;
declare const tachesRedirect: any;
declare const lang: any;

@Component({
    selector: 'app-versements',
    templateUrl: './versements.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent, ExportExcelComponent, ModalComponent]
})
export class VersementsComponent implements OnInit {

	readonly tableVersements = viewChild.required<TableComponent>('tableVersements');
	readonly modalAddVersement = viewChild.required<ModalComponent>('modalAddVersement');
	readonly exportDV = viewChild.required<ExportExcelComponent>('exportDV');

	entite: string = '';
	role: string = '';
	app: any = app;
	versements: any = [];
	lang: any = lang;
	isAFD: any;
	filtersButtons: any;
	refsModalLoaded: boolean = true;
	loadingExport: boolean = false;

	constructor(private router: Router, public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.isAFD = app.isAFD(this.entite);

		this.filtersButtons = [
			{ key: 'hasTask', value: 'true', label: lang.versements.filterMesDossiers },
			{ key: 'hasTask', value: 'false', label: lang.versements.filterDossiersGroupes }
		];
	}

	async ngAfterViewInit() {
		await this.getVersements();

		this.tableVersements().filterItemsBy('hasTask', 'true');
	}

	async getVersements() {
		this.tableVersements().setLoading(true);

		this.versements = await app.getExternalData(app.getUrl('urlGetVersementsByEntite'), 'page > versements > getVersements');

		if (this.versements != null) {
			for (var versement of this.versements) {

				versement.canceled = (app.isDossierAnnule(versement.code_statut_dossier) ? true : false);
				versement.renderMontantDv = app.renderMontantDv(versement);

				if (!this.isAFD && !app.verifEcheancesPROARCO(versement))
					versement.customClass = 'text-danger';
			}
		}

		await app.sleep(150);

		this.tableVersements().getItems();
	}

	async getConcours() {
		var concours: any = [];
		this.refsModalLoaded = false;

		if (app.isAFD(this.entite)) {
			var concours = await app.getExternalData(app.getUrl('urlGetConcoursNewDVAfd', this.store.getUserName()), 'page > versements > getConcours');
			app.setRef(concours, 'concours', 'numeroConcours', 'numeroConcours');
		} else {
			var projetsPRO = await app.getExternalData(app.getUrl('urlGetProjetsNewDVPro', this.store.getUserName()), 'page > versements > getProjets');
			app.setRef(projetsPRO, 'projets', 'numeroProjet', 'numeroProjet');
		}

		this.refsModalLoaded = true;
	}

	async gotoVersement(item: any) {
		if (app.getPageError(item.numero_projet)) {
			if (!app.isAFD(this.entite)) {
				var tache = await app.getTacheFromCase(item.case_id, this.store.getUserId());
				var archivedTasks = await app.getExternalData(app.getUrl('urlgetArchivedTask', item.case_id), 'versements - gotoVersement > getArchivedTask');

				if (tache != null)
					app.redirect(this.router, app.getUrl(tachesRedirect[app.getTypeTache(tache)][app.getEtapeTache(tache)], item.persistenceId));
				else if (archivedTasks.length == 1)
					app.redirect(this.router, app.getUrl('urlGotoVersement', item.persistenceId));
				else if (archivedTasks.length == 2)
					app.redirect(this.router, app.getUrl('urlGotoVersementReglements', item.persistenceId));
				else
					app.redirect(this.router, app.getUrl('urlGotoVersementControles', item.persistenceId));
				return;
			} else {
				if (item.code_statut_dossier != 'reglements' && item.code_statut_dossier != 'DDV2' && item.code_statut_dossier != 'DDV3' && item.code_statut_dossier != 'DDV12' && item.code_statut_dossier != 'DDV13' && item.code_statut_dossier != 'DDV11_ddrs') {
					app.redirect(this.router, app.getUrl('urlGotoVersement', item.persistenceId));
					return;
				}
			}
			app.redirect(this.router, app.getUrl('urlGotoVersementReglements', item.persistenceId));
		}
	}

	async addVersement() {
		//chargement des concours de la modal pour la creation d'un dossier
		await this.getConcours();

		app.resetDO('versementCreate');

		app.cleanDiv('formio_versementInit' + this.entite);

		app.showModal('modalAddVersement');

		appFormio.loadFormIO('versementInit' + this.entite);
	}

	async saveVersement() {
		if (!app.isValidForm('formio_versementInit' + this.entite)) {
			app.showToast('toastVersementSaveError');
			this.modalAddVersement().setLoadingBtn();
			return;
		}

		var DO = app.getDO('versementCreate');

		var numeroConcours = appFormio.getDataValue(crossVars.forms['formio_versementInit' + this.entite], 'numero_concours');
		var concours = await app.getExternalData(app.getUrl('urlGetConcoursSIOPByNumero', numeroConcours), 'page-versements > saveVersement - concours');
		var numeroProjet = (!app.isAFD(this.entite)) ? appFormio.getDataValue(crossVars.forms['formio_versementInit' + this.entite], 'numero_projet') : concours.numeroProjet;
		var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', numeroProjet), 'page-versements > saveVersement - projet', true);

		//recuperer le pays de gestion dont ordrePays = 1
		for (var paysRealisation of projet.projetPaysRealisation)
			if (paysRealisation.ordrePays == 1)
				DO.pays_realisation = paysRealisation.pays.idPays;

		DO.numero_projet = (!app.isAFD(this.entite)) ? numeroProjet : concours.numeroProjet;
		DO.libelle_projet = projet.nomProjet;
		DO.devise = (projet.idDevise == null ? '' : projet.idDevise);
		DO.entite = this.entite;
		DO.id_division = projet.idDivisionProparco;

		if (!app.isAFD(this.entite)) {
			DO.agence_gestion = projet.idAgenceGestion;

			for (var concours of projet.listConcours) {
				if (concours.flgValiditeConcours == 1) {
					DO.numero_concours = concours.numeroConcours;
					break;
				}
			}
		}

		await app.sleep(250);

		var caseObject = await app.saveFormData(app.getRootDO('versementCreate'), crossVars.forms['formio_versementInit' + this.entite], urls['urlProcessInstanciation'], urls['urlProcessAddVersement' + this.entite]);
		if (caseObject == null) {
			console.error('page-versements -> saveVersement -> caseObject is null');
			return;
		}

		var caseId = caseObject.caseId;
		if (app.isAFD(this.entite)) {
			var caseInfo = await app.getCaseInfo(true, caseId, 'page-versements > saveVersement - get caseInfo');

			caseId = caseInfo.id;
		}

		var caseContext = await app.getCaseContext(app.isAFD(this.entite), caseId, 'page-versements > saveVersement - get caseContext');

		this.modalAddVersement().setLoadingBtn();

		app.hideModal('modalAddVersement');

		app.redirect(this.router, app.getUrl('urlGotoVersement', app.getStorageIdByCaseContext('dossierVersement', caseContext)));
	}

	async exportExcel() {
		const tableVersements = this.tableVersements();
  tableVersements.loadingExport = true;

		var items = tableVersements.itemsFiltered.map((item: any) => {
			item.date_reception = app.formatDate(item.date_reception, true);

			app.log(item);

			return item;
		});

		this.checkOtherDevise(items);

		await app.sleep(2000);

		this.exportDV().exportExcel('dossierVersementexport' + ((this.isAFD) ? '' : 'pro'), items, null, null);

		tableVersements.loadingExport = false;
	}

	checkOtherDevise(items: any) {
		for (var row of items) {
			if (row.autresDevises != null && row.autresDevises.length > 0) {
				for (let i = 0; i < row.autresDevises.length; i++) {
					let item = {
						code_fonctionnel: row.code_fonctionnel,
						persistenceId: row.persistenceId,
						numero_dossier_versement: row.numero_dossier_versement,
						numero_projet: row.numero_projet,
						agenceGestion: row.agenceGestion,
						tiers: row.tiers,
						traitant: row.traitant,
						montant_versement: row.autresDevises[i].montant,
						devise: row.autresDevises[i].devise,
						autresDevises: null, // You can modify this if needed
						lib_statut_dossier: row.lib_statut_dossier,
						code_statut_dossier: row.code_statut_dossier,
						libelle_projet: row.libelle_projet,
						case_id: row.case_id,
						hasTask: row.hasTask,
						canceled: row.canceled,
						renderMontantDv: row.renderMontantDv,
						date_reception: row.date_reception
					};

					// Push the item directly into the this.rows array
					items.push(item);
				}
			}
		}

		items.sort((a: any, b: any) => {
			if (a.code_fonctionnel > b.code_fonctionnel)
				return -1;
			else if (a.code_fonctionnel < b.code_fonctionnel)
				return 1;
			return 0;
		});
	}
}