import { Component, OnInit, Input, output, viewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { StoreService } from '../../services/store.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-select-beneficiaire',
    templateUrl: './select-beneficiaire.component.html',
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, ModalComponent, TableComponent]
})
export class SelectBeneficiaireComponent implements OnInit {
	readonly tableTiers = viewChild.required<TableComponent>('tableTiers');

	app: any = app;
	lang: any = lang;
	read: boolean = false;

	listTiers: any;
	listTiersUsed: any;
	tiersSelected: any;
	typeParentObject: any;
	nameModalParent: any;
	checkedSelectedBeneficiaire: boolean = false;

	isDV: boolean = false;
	isJR: boolean = false;
	isJA: boolean = false;
	isJDC: boolean = false;
	isDC: boolean = false;

	readonly change = output();

	constructor(public store: StoreService) { }

	async ngOnInit() {
		this.listTiers = [];
	}

	//chargement de tous les tiers pour le tableau de recherche
	async getTiers() {
		this.tableTiers().setLoading(true);

		var url = (this.typeParentObject == 'DR' ? 'urlGetBeneficiairesAdresseWithBank' : 'urlGetBeneficiairesAdresse');

		this.listTiers = await app.getExternalData(app.getUrl(url), 'select-beneficiaire > getTiers');

		for (var tiers of this.listTiers) {
			tiers.renderAdresseTiers = app.renderEmpty(tiers.adresse.adresse) + ', ' + app.renderEmpty(tiers.adresse.ville) + ', ' + app.renderEmpty(tiers.adresse.pays);
			tiers.renderInfoTiers = tiers.idTiers + ' - ' + tiers.libLong;
		}

		await app.sleep(1000);

		this.tableTiers().getItems();
	}

	//initialisation des données depuis le parent
	async initSelectBeneficaire(list: any, read: any, typeParentObject: any, itemSelected?: any, nameModalParent?: any) {
		this.nameModalParent = nameModalParent;
		this.typeParentObject = typeParentObject;
		this.read = read;

		this.isDV = (typeParentObject == 'DV');
		this.isJR = (typeParentObject == 'JR');
		this.isJA = (typeParentObject == 'JA');
		this.isJDC = (typeParentObject == 'JDC');
		this.isDC = (typeParentObject == 'DC');

		//liste deroulante des tiers utilisés (sans doublon)
		this.listTiersUsed = (Array.isArray(list) && list.length > 0) ? app.getArrayWithoutDuplicate(list, null, 'idTiers') : [];

		var selectedTiers = app.getElementInArray(this.listTiersUsed, 'idTiers', itemSelected?.idTiers);

		this.tiersSelected = selectedTiers;

		app.log('select-beneficiaire > initSelectBeneficaire : tiersSelected', this.tiersSelected);
	}

	//methode pour selectionner un tiers depuis la liste des tiers
	async selectTiers(item: any) {
		app.log('select-beneficiaire > selectTiers', item);

		//on ajoute le tiers s'il existe aps dans la liste des tiers utilisés
		var selectedTiers = app.getElementInArray(this.listTiersUsed, 'idTiers', item.idTiers);
		if (selectedTiers == null) {
			this.listTiersUsed.push(item);

			this.tiersSelected = item;
		} else
			this.tiersSelected = selectedTiers;

		//refresh des infos du beneficiaire selectionné
		this.getBeneficiaire();

		await app.sleep(500);

		app.hideModal('modalAddTiers' + this.typeParentObject);

		this.tableTiers().setClickInProgress(false);

		//si on appelle depuis une modale alors on refresh la modale appelante pour eviter le bug du scroll bootstrap
		if (!app.isEmpty(this.nameModalParent))
			app.refreshModal(this.nameModalParent, true);
	}

	//methode pour afficher le tableau qui permet l'affichage de tiers pour la recherche
	async searchTiers() {
		app.showModal('modalAddTiers' + this.typeParentObject);

		this.getTiers();
	}

	//pour tester si un tiers est selectionné
	checkSelectedBeneficiaire() {
		this.checkedSelectedBeneficiaire = true;

		return app.isEmpty(this.tiersSelected);
	}

	//appel event change pour mettre à jour les infos du tiers apres selection (select ou liste)
	getBeneficiaire() {
		this.change.emit();
	}
}