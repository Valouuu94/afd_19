import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';

import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const refs: any;

@Component({
    selector: 'app-pilotage-regles',
    templateUrl: './pilotage-regles.component.html',
    standalone: true,
    imports: [ContentComponent, CardComponent, FormsModule]
})
export class PilotageReglesComponent implements OnInit {
	app: any = app;
	lang: any = lang;
	refs: any = refs;

	dateBatch: any;
	delaiMax: any;
	nbCriteres: any;
	nbDossierMax: any;
	criteres: any = [];
	hasNoRight: boolean = false;

	constructor(public store: StoreService) { }

	ngOnInit() {
		this.getAffectations();
		this.enableToEdit();
	}

	enableToEdit() {
		this.hasNoRight = !app.hasRightButton(this.store, 'pilotage.regAffect');
	}

	async getAffectations() {
		var affectations = await app.getExternalData(app.getUrl('urlGetPilotageAffectations'), 'pilotage-regles > getAffectations');

		if (affectations != null) {
			this.delaiMax = affectations.delaiMaxControle;
			this.nbCriteres = affectations.nbrCriteresRisque;
			this.nbDossierMax = affectations.nbrMaxDossiersProjet;
			this.criteres = affectations.critereEligibiliteRef;

			this.sortCriteres();
		}

		var dateBatch = await app.getExternalData(app.getUrl('urlGetPilotageAffectationsBatchDate'), 'pilotage-regles > getAffectations date batch');

		if (dateBatch != null && dateBatch.length > 0)
			this.dateBatch = app.formatDate(dateBatch[0].start);
	}

	async saveAffectations() {
		var DO = {
			delaiMaxControle: this.delaiMax,
			nbrCriteresRisque: this.nbCriteres,
			nbrMaxDossiersProjet: this.nbDossierMax,
			critereEligibiliteRef: this.criteres
		};

		await app.setExternalData(app.getUrl('urlSetPilotageAffectations'), DO, 'PUT');

		app.showToast('toastPilotageReglesSave');
	}

	sortCriteres() {
		this.criteres.sort(function (a: any, b: any) {
			return a.ordre - b.ordre;
		});
	}

	changeOrder(item: any, diff: any, index: any) {
		if (item != null) {
			if ((index == 0 && diff < 0) || (index == this.criteres.length - 1 && diff > 0))
				return;

			var tmpOrder = this.criteres[index].ordre;
			this.criteres[index].ordre = this.criteres[index + diff].ordre;
			this.criteres[index + diff].ordre = tmpOrder;

			this.sortCriteres();
		}
	}
}