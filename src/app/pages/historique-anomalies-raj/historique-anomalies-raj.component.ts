import { Component, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { TableComponent } from '../../components/table/table.component';
import { NgIf, NgClass } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-historique-anomalies-raj',
    templateUrl: './historique-anomalies-raj.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, NgClass, TableComponent]
})
export class HistoriqueAnomaliesRajComponent implements OnInit {

	readonly tableAnomaliesRaj = viewChild.required<TableComponent>('tableAnomaliesRaj');

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
		this.tableAnomaliesRaj().setLoading(true);

		this.anomalies = await app.getExternalData(app.getUrl('urlGetHistoriqueAnomaliesRaj'), 'page > historique-anomalies-raj > getAnomalies');

		this.anomaliesCopy = app.copy(this.anomalies);

		await app.sleep(150);

		this.tableAnomaliesRaj().getItems();
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

		this.tableAnomaliesRaj().getItems();
	}

	async filterRajReset() {
		this.filterSelected = "";

		this.anomalies = this.anomaliesCopy;

		await app.sleep(150);

		this.tableAnomaliesRaj().resetPage();
		this.tableAnomaliesRaj().filterItems();
		this.tableAnomaliesRaj().sortByDefault();
		this.tableAnomaliesRaj().getItems();
	}

	filterRajSelected(value: any) {
		return this.filterSelected == value;
	}
}
