import { Component, OnInit, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ExportExcelComponent } from '../../components/export-excel/export-excel.component';
import { TableComponent } from '../../components/table/table.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { NgIf } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const refs: any;
declare const appFormio: any;
declare const crossVars: any;

@Component({
    selector: 'app-pilotage-ddr',
    templateUrl: './pilotage-ddr.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, BtnComponent, TableComponent, ExportExcelComponent, ModalComponent]
})
export class PilotageDDRComponent implements OnInit {

	readonly btnExportDDR = viewChild.required<BtnComponent>('btnExportDDR');
	readonly tableDDR = viewChild.required<TableComponent>('tableDDR');
	readonly modalConfirmUpdateControleur = viewChild.required<ModalComponent>('modalConfirmUpdateControleur');
	readonly exportDdrEligibles = viewChild.required<ExportExcelComponent>('exportDdrEligibles');

	app: any = app;
	lang: any = lang;
	refs: any = refs;
	dossiers: any;
	dossier: any;
	managersDCV: any;
	rows: any = [];
	hasNoRight: boolean = false;

	constructor(public store: StoreService) { }

	ngOnInit() {
		this.enableToEdit();
	}

	ngAfterViewInit() {
		this.getDDREligibles();
	}

	async getDDREligibles() {
		var dossiers = await app.getExternalData(app.getUrl('urlGetPilotageDDR'), 'pilotage-ddr > getDDREligibles');

		for (var dossier of dossiers) {
			dossier.renderInfos = '<div class="row mb-2"><div class="col capacite-highlight">' + dossier.numeroConcours + '</div><div class="col text-right font-weight-bold mr-3">' + dossier.codeFonctionnel + '</div></div>';
			dossier.renderInfos += '<div class="row mb-2"><div class="col">' + (!app.isEmpty(dossier.produitFinancier) ? app.getRefLabel('refProduitsFinancier', dossier.produitFinancier) : '') + '</div></div>';
			dossier.renderInfos += '<div class="row mb-2"><div class="col">' + app.getRefLabel('refModalitesPaiement', dossier.modaliteDecaissementDossierReglement) + '</div></div>';

			dossier.agenceGestionDossierReglement = app.getRefLabel('refAgencesGestions', dossier.agenceGestion);
			dossier.natureCritereRisqueDossierReglement = [...new Set(dossier.natureCritereRisqueDossierReglement)];
			dossier.nbCriteres = dossier.natureCritereRisqueDossierReglement.length;

			dossier.renderCriteres = '';
			for (var critere of dossier.natureCritereRisqueDossierReglement)
				dossier.renderCriteres += '<div class="badge-table">' + app.getRefLabel('refParamCritere', critere) + '</div>';

			//dossier.sort = dossier.nbCriteres + '-' + dossier.datePaiementDossierReglement;
			if (!app.isEmpty(dossier.nomControleur))
				dossier.renderControleur = dossier.nomControleur + ' ' + dossier.prenomControleur;
		}

		this.dossiers = dossiers;

		await app.sleep(250);

		//multisort
		// app.sortBy(dossiers, [
		// 	{key: 'nbCriteres', order: 'desc' },
		// 	{ key: 'datePaiementDossierReglement', order: 'asc' },
		// 	{ key: 'libelleStatut2Nd', order: 'asc' }
		// ]); 

		this.tableDDR().getItems();
	}

	async confirmUpdateControleur(item: any) {
		this.dossier = item;

		//Recuperation des managers DCV pour liste deroulante dans modal
		this.managersDCV = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'managers-dcv > getManagersDCV');

		for (var manager of this.managersDCV)
			manager.nom = manager.nom.toUpperCase();

		app.setRef(this.managersDCV, 'managers', 'idUtilisateur', ['nom', 'prenom']);

		var managers = app.getRef("managers");

		for (var manager of managers)
			manager.label = manager.label.replace("- ", "");

		appFormio.loadFormIO('managersDCV');

		await app.sleep(100);

		if (this.dossier.idControleur != null)
			appFormio.setDataValue(crossVars.forms['formio_managersDCV'], 'identite_managers', this.dossier.idControleur);

		app.showModal('modalConfirmUpdateControleur');
	}

	async updateControleur() {
		if (!this.hasNoRight) {
			var idControleur = appFormio.getDataValue(crossVars.forms['formio_managersDCV'], 'identite_managers');

			var result = await app.setExternalData(app.getUrl('urlUpdateDdrUser2ndNiv', this.dossier.persistenceId, ((idControleur != null) ? idControleur : this.dossier.idControleur)), {}, 'PUT', true);

			if (!app.isValidForm('formio_managersDCV'))
				return;

			if (result) {
				var DO = app.getDO('controleur');
				DO.persistenceId = this.dossier.persistenceId;

				await app.saveFormData(app.getRootDO('controleur'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessControleSecondNiveau'));

				this.getDDREligibles();

				app.showToast('toastUpdateControleurSuccess');
			} else
				app.showToast('toastErreurTechnique');

			this.modalConfirmUpdateControleur().setLoadingBtn();
			app.hideModal('modalConfirmUpdateControleur');
		}
	}

	async exportExcel() {
		this.btnExportDDR().setLoading(true);
		var dossiers = this.tableDDR().itemsFiltered;

		var items = dossiers;

		for (var item of items) {
			item.infosDDR = 'Concours : ' + item.numeroConcours + ' / ' + lang.reporting.ddrEligibles.numDDR + ' : ' + item.codeFonctionnel;
			item.infosDDR += (!app.isEmpty(item.produitFinancier) ? " / Produit financier : " + app.getRefLabel('refProduitsFinancier', item.produitFinancier) : '');
			item.infosDDR += ' / ' + lang.reporting.ddrEligibles.modalitePaiement + ' : ' + app.getRefLabel('refModalitesPaiement', item.modaliteDecaissementDossierReglement);

			item.infosCriteres = '';
			var last = app.getRefLabel('refParamCritere', item.natureCritereRisqueDossierReglement.slice(-1));

			for (var critere of item.natureCritereRisqueDossierReglement)
				if (last != app.getRefLabel('refParamCritere', critere))
					item.infosCriteres += app.getRefLabel('refParamCritere', critere) + " / ";
				else item.infosCriteres += app.getRefLabel('refParamCritere', critere);

			item.infosControleur = item.renderControleur;
		}

		this.rows = items;

		await app.sleep(2000);

		this.exportDdrEligibles().exportExcel('ddrEligibles', this.rows, null, null);

		this.btnExportDDR().setLoading(false);
	}

	enableToEdit() {
		if (!app.hasRightButton(this.store, 'pilotage.ddrEligible'))
			this.hasNoRight = true;
		else
			this.hasNoRight = false;
	}
}