import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/components/table/table.component';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { TableComponent as TableComponent_1 } from '../../components/table/table.component';
import { NgIf, NgClass } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-historique-anomalies-raj',
    templateUrl: './historique-anomalies-raj.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, NgClass, TableComponent_1]
})
export class HistoriqueAnomaliesRajComponent implements OnInit {

	@ViewChild('tableAnomaliesRaj') tableAnomaliesRaj!: TableComponent;

	app: any = app;
	lang: any = lang;
	anomalies: any = [];
	anomaliesCopy: any = [];
	filterSelected: any = '';

	constructor(private router: Router, public store: StoreService) { }

	ngOnInit() { }

	async ngAfterViewInit() {
		await this.getAnomalies();
	}

	async getAnomalies() {
		this.tableAnomaliesRaj.setLoading(true);

		this.anomalies = await app.getExternalData(app.getUrl('urlGetHistoriqueAnomaliesRaj'), 'page > historique-anomalies-raj > getAnomalies');

		this.anomaliesCopy = app.copy(this.anomalies);

		await app.sleep(150);

		this.tableAnomaliesRaj.getItems();
	}

	async gotoAnomalie(item: any) {
		app.redirect(this.router, app.getUrl(((item.rajZero) ? 'urlGotoHistoriqueAnomalieRajZero' : 'urlGotoHistoriqueAnomalieRajDefaut'), item.persistenceIdAnomalie));
	}

	async filterRajBy(type: any) {
		this.filterSelected = type;

		var searchResult = [];
		for (var elt of this.anomaliesCopy)
			if ((type == '0' && elt.rajZero) || (type != '0' && !elt.rajZero))
				searchResult.push(elt);

		this.anomalies = searchResult;

		await app.sleep(50);

		this.tableAnomaliesRaj.getItems();
	}

	async filterRajReset() {
		this.filterSelected = "";

		this.anomalies = this.anomaliesCopy;

		await app.sleep(150);

		this.tableAnomaliesRaj.resetPage();
		this.tableAnomaliesRaj.filterItems();
		this.tableAnomaliesRaj.sortByDefault();
		this.tableAnomaliesRaj.getItems();
	}

	filterRajSelected(value: any) {
		return this.filterSelected == value;
	}
}
