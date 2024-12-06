import { Component, OnInit, viewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { TableComponent } from '../table/table.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-type-avance',
    templateUrl: './type-avance.component.html',
    standalone: true,
    imports: [NgIf, TableComponent, ModalComponent, FormsModule]
})
export class TypeAvanceComponent implements OnInit {

	readonly tableTypesAvance = viewChild.required<TableComponent>('tableTypesAvance');
	readonly modalSaveTypeAvance = viewChild.required<ModalComponent>('modalSaveTypeAvance');

	type: string = '';
	typesAvance: any = [];
	typesAvanceByTypeSelected: any = null;
	typeAvance: string = 'typesAvance';
	typeAvanceItem: any;
	montant: number = 0;
	libelle: string = '';
	deviseCode: string = '';
	deviseLabel: string = '';
	numeroTypeAvance: string = '';
	labelTypeAvance: string = '';
	lang: any = lang;
	itemsByPage: number = 10;
	showTypeAvance: boolean = false;

	constructor() { }

	ngOnInit() { }

	async getTypesAvance(type: any, devise?: any, avanceContractuel?: any) {
		this.typeAvance = 'typesAvance';
		this.type = type;
		this.labelTypeAvance = app.getRefLabel('refLabelTypeAvance', type);

		this.typesAvanceByTypeSelected = [];

		this.typeAvance += app.getRefLabel('refTypeAvance', type);

		if (devise != null) {
			this.deviseCode = devise;
			this.deviseLabel = app.getRefLabel('refDevises', this.deviseCode);
		}

		if (avanceContractuel != null && avanceContractuel.choix_type_avance == this.type && this.typesAvance.length == 0) {
			this.typesAvanceByTypeSelected = avanceContractuel.typesAvance;
			this.typesAvance = avanceContractuel.typesAvance;

			if (this.typesAvance.length != 0) {
				this.deviseCode = this.typesAvance[0].devise;
				this.deviseLabel = app.getRefLabel('refDevises', this.deviseCode);
			}
		} else if (this.typesAvance.length != 0) {
			for (var typeAvance of this.typesAvance) {
				if (typeAvance.type == this.type)
					this.typesAvanceByTypeSelected.push(typeAvance);
			}
		}
		this.showTypeAvance = true;

		this.itemsByPage = this.typesAvanceByTypeSelected.length;

		await app.sleep(250);
		
		this.tableTypesAvance().getItems();
	}

	addTypeAvance(item: any) {
		if (item != null) {
			this.typeAvanceItem = item;
			this.montant = item.montant;
			this.libelle = item.libelle;
			this.numeroTypeAvance = item.numero_type_avance;
		}
		else
			this.numeroTypeAvance = '';

		app.showModal('modalAddTypeAvance');
	}

	async saveTypeAvance() {
		if (this.typeAvanceItem == null)
			this.typesAvance.push({ 'montant': this.montant, 'devise': this.deviseCode, 'libelle': this.libelle, 'type': this.type, 'persistenceId': 0, 'numero_type_avance': null });
		else {
			for (var typeAvance of this.typesAvanceByTypeSelected)
				if (typeAvance == this.typeAvanceItem) {
					typeAvance.montant = this.montant;
					typeAvance.libelle = this.libelle;
				}
		}

		this.typeAvanceItem = null;
		this.montant = 0;
		this.libelle = '';

		await app.sleep(150);

		this.getTypesAvance(this.type);

		this.modalSaveTypeAvance().setLoadingBtn();

		app.hideModal('modalAddTypeAvance');
	}

	getTypesAvanceUpdate() {
		return this.typesAvanceByTypeSelected;
	}
}