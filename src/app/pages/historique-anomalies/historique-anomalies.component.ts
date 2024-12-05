import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExportExcelComponent } from '../../components/export-excel/export-excel.component';
import { TableComponent } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';
import { StoreService } from '../../services/store.service';


declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-historique-anomalies',
    templateUrl: './historique-anomalies.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent, ExportExcelComponent]
})
export class HistoriqueAnomaliesComponent implements OnInit {

	@ViewChild('tableAnomalies') tableAnomalies!: TableComponent;
	@ViewChild('exportHistoAnos') exportHistoAnos!: ExportExcelComponent;

	entite: string = '';
	app: any = app;
	lang: any = lang;
	anomalies: any = [];
	rows: any = [];
	hasNoRight: boolean = false;

	constructor(private router: Router, public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.enableToEdit();
	}

	async ngAfterViewInit() {
		await this.getAnomalies();
	}

	async getAnomalies() {
		this.tableAnomalies.setLoading(true);

		this.anomalies = await app.getExternalData(app.getUrl('urlGetHistoriqueAnomalies'), 'page > historique-anomalies > getAnomalies');

		for (var anomalie of this.anomalies)
			anomalie.criticite = app.capitalize(anomalie.criticite);

		await app.sleep(150);

		this.tableAnomalies.getItems();
	}

	async gotoAnomalie(item: any) {
		app.redirect(this.router, app.getUrl('urlGotoHistoriqueAnomalie', item.persistenceIdAnomalie));
	}

	async exportExcel() {
		this.tableAnomalies.loadingExport = true;

		var items = this.tableAnomalies.itemsFiltered;

		for (var item of items) {
			item.agenceGestion = app.getRefLabel('refAgencesGestions', item.agenceGestion);
			item.lib_anomalie = item.libelleAnomalie + " (" + item.codeAnomalie + ")";
			item.userNameControleur = app.getRefLabel('refUsers', item.userNameControleur);
			item.dateCreationInfo = app.formatDate(item.dateCreation, true);
			item.dateModificationInfo = app.formatDate(item.dateModification, true);
		}

		this.rows = items;

		this.exportHistoAnos.exportExcel('histoAnos', this.rows, null, null);

		this.tableAnomalies.loadingExport = false;
	}

	enableToEdit() {
		this.hasNoRight = !app.hasRightButton(this.store, 'histo.histoAno');
	}
}