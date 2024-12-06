import { Component, OnInit, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';

import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../components/modal/modal.component';
import { TableComponent } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const refs: any;

@Component({
    selector: 'app-pilotage-perimetre',
    templateUrl: './pilotage-perimetre.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent, ModalComponent, FormsModule]
})
export class PilotagePerimetreComponent implements OnInit {

	readonly tablePerimetres = viewChild.required<TableComponent>('tablePerimetres');
	readonly modalPerimetre = viewChild.required<ModalComponent>('modalPerimetre');

	app: any = app;
	lang: any = lang;
	refs: any = refs;
	perimetre: any;
	perimetres: any;
	nbMoisAnnee: any;
	nbMoisEcoules: any;
	division: any;
	agence: any;
	operation: any;
	modalite: any;
	refDivisionsUnused: any = [];
	refAgencesUnused: any = [];
	refOperationsUnused: any = [];
	refModalitesUnused: any = [];
	refOperations: any = [];
	hasNoRight: boolean = false;
	itemsByPage: number = 10;

	constructor(public store: StoreService) { }

	async ngOnInit() {
		this.enableToEdit();

		this.refOperations = await app.getExternalData(app.getUrl('urlGetOperations'), 'refOperations > getOperations');
	}

	ngAfterViewInit() {
		this.nbMoisAnnee = 12;
		this.nbMoisEcoules = (new Date).getMonth();

		this.getPerimetres();
	}

	async getPerimetres() {
		var perimetres = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'pilotage-perimetre > getPerimetres');

		this.itemsByPage = perimetres.length;

		for (var perimetre of perimetres) {
			perimetre.user = perimetre.nom + ' ' + perimetre.prenom;
			perimetre.capaciteAnnuelle = perimetre.capaciteTraitementAnnuelle;
			// perimetre.nbDossiersControles = perimetre.nbrDossierTraite;
			perimetre.nbDossiersControles = perimetre.nbControleEffectueAn;
			perimetre.capaciteMensuelle = perimetre.capaciteTraitementMensuelle
			perimetre.capaciteMensuelleActualisee = this.getCapaciteMensuelleActualisee(perimetre.capaciteAnnuelle, perimetre.nbDossiersControles);
			perimetre.agences = app.isEmpty(perimetre.agenceGestion) ? [] : JSON.parse(perimetre.agenceGestion);
			perimetre.divisions = app.isEmpty(perimetre.divisionService) ? [] : JSON.parse(perimetre.divisionService); //ajout dans l'api ORGA 
			perimetre.operations = app.isEmpty(perimetre.operations) ? [] : JSON.parse(perimetre.operations);
			perimetre.modalites = app.isEmpty(perimetre.modalitesDecaissement) ? [] : JSON.parse(perimetre.modalitesDecaissement);
			perimetre.renderActif = ((perimetre.estActif) ? '1' : '0');

			perimetre.renderCapacite = '<div class="row mb-2 capacite-highlight"><div class="col">Annuelle</div><div class="col text-right">' + perimetre.capaciteAnnuelle + '</div></div>';
			perimetre.renderCapacite += '<div class="row mb-2"><div class="col">Mensuelle</div><div class="col text-right">' + perimetre.capaciteMensuelle + '</div></div>';
			perimetre.renderCapacite += '<div class="row font-weight-bold"><div class="col">Actualisée</div><div class="col text-right">' + perimetre.capaciteMensuelleActualisee + '</div></div>';

			//render des listes de valeurs en string
			perimetre.renderDivisions = '';
			for (var division of perimetre.divisions)
				if (!app.isEmpty(division))
					perimetre.renderDivisions += '- ' + division.label + '<br>';

			perimetre.renderAgence = '';
			for (var agence of perimetre.agences)
				if (!app.isEmpty(agence))
					perimetre.renderAgence += '<div class="badge-table">' + app.getRefLabel('refAgencesGestions', agence) + '</div>';

			perimetre.renderDivision = '';
			for (var division of perimetre.divisions)
				if (!app.isEmpty(division))
					perimetre.renderDivision += '<div class="badge-table">' + app.getRefLabel('refDivisions', division) + '</div>';

			perimetre.renderOperations = '';
			for (var operation of perimetre.operations)
				if (!app.isEmpty(operation))
					perimetre.renderOperations += '<div class="badge-table col3">' + app.getRefLabel('refOperations', operation) + '</div>';

			perimetre.renderModalites = '';
			for (var modalite of perimetre.modalites)
				if (!app.isEmpty(modalite))
					perimetre.renderModalites += '<div class="badge-table col2">' + app.getRefLabel('refModalitesPaiement', modalite) + '</div>';
		}

		this.perimetres = perimetres;

		await app.sleep(250);

		this.tablePerimetres().getItems();
	}

	async updatePerimetre(item: any) {
		this.perimetre = item;

		this.division = '';
		this.agence = '';
		this.division = '';
		this.operation = '';
		this.modalite = '';

		this.refAgencesUnused = await app.getExternalData(app.getUrl('urlGetPilotagePerimetresAgencesUnused'), 'pilotage-perimetre > updatePerimetre - agences');
		this.refDivisionsUnused = await app.getExternalData(app.getUrl('urlGetPilotagePerimetresDivisionssUnused'), 'pilotage-perimetre > updatePerimetre - divisions'); //ajout api pour divisions non affectées
		this.refOperationsUnused = await app.getExternalData(app.getUrl('urlGetPilotagePerimetresOperationsUnused'), 'pilotage-perimetre > updatePerimetre - operations');
		this.refModalitesUnused = await app.getExternalData(app.getUrl('urlGetPilotagePerimetresModalitesUnused'), 'pilotage-perimetre > updatePerimetre - modalites');

		this.refAgencesUnused.sort(function (a: any, b: any) {
			var varA = (a == null) ? '' : app.getRefLabel('refAgencesGestions', a);
			var varB = (b == null) ? '' : app.getRefLabel('refAgencesGestions', b);

			if (varA < varB)
				return -1;
			if (varA > varB)
				return 1;
			return 0;
		});

		this.refDivisionsUnused.sort(function (a: any, b: any) {
			var varA = (a == null) ? '' : app.getRefLabel('refDivisions', a);
			var varB = (b == null) ? '' : app.getRefLabel('refDivisions', b);

			if (varA < varB)
				return -1;
			if (varA > varB)
				return 1;
			return 0;
		});

		this.refOperationsUnused.sort(function (a: any, b: any) {
			var varA = (a == null) ? '' : app.getRefLabel('refOperations', a);
			var varB = (b == null) ? '' : app.getRefLabel('refOperations', b);

			if (varA < varB)
				return -1;
			if (varA > varB)
				return 1;
			return 0;
		});

		this.refModalitesUnused.sort(function (a: any, b: any) {
			var varA = (a == null) ? '' : app.getRefLabel('refModalitesPaiement', a);
			var varB = (b == null) ? '' : app.getRefLabel('refModalitesPaiement', b);

			if (varA < varB)
				return -1;
			if (varA > varB)
				return 1;
			return 0;
		});

		app.showModal('modalPerimetre');
	}
	async savePerimetre() {
		if (!this.hasNoRight) {
			var DO = {
				idUtilisateur: this.perimetre.idUtilisateur,
				capaciteTraitementAnnuelle: this.perimetre.capaciteAnnuelle,
				agenceGestion: this.perimetre.agences,
				divisionService: this.perimetre.divisions,
				modalitesDecaissement: this.perimetre.modalites,
				operations: this.perimetre.operations,
				capaciteTraitementMensuelle: this.getCapaciteMensuelle(this.perimetre.capaciteAnnuelle)
			};

			await app.setExternalData(app.getUrl('urlSetPilotagePerimetre'), DO, 'PUT');

			await this.getPerimetres();

			this.modalPerimetre().setLoadingBtn();

			app.showToast('toastSaveSuccessPerimetre');

			app.hideModal('modalPerimetre');
		}
	}

	addDivision() {
		if (!app.existStringInArray(this.perimetre.divisions, this.division))
			this.perimetre.divisions.push(this.division);
	}

	deleteDivision(index: any) {
		this.perimetre.divisions.splice(index, 1);
	}

	addAgence() {
		if (!app.existStringInArray(this.perimetre.agences, this.agence))
			this.perimetre.agences.push(this.agence);
	}

	deleteAgence(index: any) {
		this.perimetre.agences.splice(index, 1);
	}

	addOperation() {
		if (!app.existStringInArray(this.perimetre.operations, this.operation))
			this.perimetre.operations.push(this.operation);
	}

	deleteOperation(index: any) {
		this.perimetre.operations.splice(index, 1);
	}

	addModalite() {
		if (!app.existStringInArray(this.perimetre.modalites, this.modalite))
			this.perimetre.modalites.push(this.modalite);
	}

	deleteModalite(index: any) {
		this.perimetre.modalites.splice(index, 1);
	}

	getCapaciteMensuelleActualisee(capaciteAnnuelle: any, nbDossiersControles: any) {
		return Math.ceil((capaciteAnnuelle - nbDossiersControles) / (this.nbMoisAnnee - this.nbMoisEcoules));
	}

	getCapaciteMensuelle(capaciteAnnuelle: any) {
		return Math.ceil(capaciteAnnuelle / this.nbMoisAnnee)
	}

	enableToEdit() {
		if (!app.hasRightButton(this.store, 'pilotage.perimCtl'))
			this.hasNoRight = true;
		else
			this.hasNoRight = false;
	}
}