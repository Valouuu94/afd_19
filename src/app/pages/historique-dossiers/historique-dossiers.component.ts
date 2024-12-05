import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent } from 'src/app/components/table/table.component';
import { StoreService } from 'src/app/services/store.service';
import { ExportExcelComponent } from 'src/app/components/export-excel/export-excel.component';
import { ExportExcelComponent as ExportExcelComponent_1 } from '../../components/export-excel/export-excel.component';
import { TableComponent as TableComponent_1 } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-historique-dossiers',
    templateUrl: './historique-dossiers.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent_1, ExportExcelComponent_1]
})
export class HistoriqueDossiersComponent implements OnInit {

	@ViewChild('tableDossiers') tableDossiers!: TableComponent;
	@ViewChild('exportDossiers') exportDossiers!: ExportExcelComponent;

	app: any = app;
	lang: any = lang;
	dossiers: any = [];

	constructor(private router: Router, public store: StoreService) { }

	ngOnInit() {}

	async ngAfterViewInit() {
		await this.getDossiers();
	}

	async getDossiers() {
		this.tableDossiers.setLoading(true);

		this.dossiers = await app.getExternalData(app.getUrl('urlGetHistoriqueDossiers'), 'historique-dossiers > getDossiers');

		await app.sleep(150);

		this.tableDossiers.getItems();
	}

	async gotoDossier(item: any) {
		app.redirect(this.router, app.getUrl('urlGotoHistoriqueDossier', item.persistenceId));
	}

	async exportExcel() {
		this.tableDossiers.loadingExport = true;

		var items = this.tableDossiers.itemsFiltered;

		for (var item of items) {
			item.lib_agence = app.getRefLabel('refAgencesGestions', item.agence_gestion);
			item.montant = item.montant_reglement + " " + item.devise_reglement;
			item.infosModalites = app.getRefLabel('refModalitesPaiement', item.modalite_paiement) + " (" + app.getRefLabel('refTypesVersement', item.type_versement) + ")";
			item.lib_produit = app.getRefLabel('refProduitsFinancier', item.id_produit);
			item.infosDatesMaj = app.formatDate(item.date_modification_2nd_niv) + " (crée le " + app.formatDate(item.date_creation_dossier_2nd_niv) + ")";
		}

		this.exportDossiers.exportExcel('histoDC', items, null, null);

		this.tableDossiers.loadingExport = false;
	}
}