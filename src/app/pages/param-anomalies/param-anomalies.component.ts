import { Component, OnInit, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ModalComponent  } from '../../components/modal/modal.component';
import { TableComponent   } from '../../components/table/table.component';
import { NgIf, NgClass } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const crossVars: any;
declare const appFormio: any;

@Component({
    selector: 'app-param-anomalies',
    templateUrl: './param-anomalies.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, NgClass, TableComponent, ModalComponent]
})
export class ParamAnomaliesComponent implements OnInit {

	readonly tableParamAnomalies = viewChild.required<TableComponent>('tableParamAnomalies');
	readonly modalAnomalie = viewChild.required<ModalComponent>('modalAnomalie');
	readonly modalConfirmationAnomalie = viewChild.required<ModalComponent>('modalConfirmationAnomalie');

	app: any = app;
	lang: any = lang;
	entite: string = '';
	perimetre: string = '';
	isDCV: boolean = false;
	hasNoRight: boolean = false;
	paramAnomalies: any = null;
	create: boolean = true;
	anomalieUpdate: any = null;

	constructor(public store: StoreService) { }

	ngOnInit(): void {
		app.setCurrentCmp('paramAnomalie', this);

		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		this.enableToEdit();
	}

	async ngAfterViewInit() {
		await this.getParamAnomalies();

		this.filterAnomaliesBy('statutActif', '');
	}

	get modalTitle() {
		return (this.create) ? "Ajouter une anomalie" : "Modifier une anomalie";
	}

	async getParamAnomalies() {
		this.paramAnomalies = await app.getExternalData(app.getUrl('urlGetParamAnomalies'), 'param-anomalie > getParamAnomalies');

		await app.sleep(150);

		this.tableParamAnomalies().getItems();
	}

	async addAnomalie() {
		this.create = true;

		app.resetDO('typeAnomalie');

		var DO = app.getDO('typeAnomalie');

		app.setBDM(DO);

		appFormio.loadFormIO('typeAnomalie');

		await app.sleep(100);

		this.modalAnomalie().setLoadingBtn();

		app.showModal('modalAnomalie');
	}

	async updateAnomalie(item: any) {
		this.create = false;
		this.anomalieUpdate = item;

		var DO = app.getDO('typeAnomalie');

		await app.mapDO(DO, item);

		app.setBDM(DO);

		appFormio.loadFormIO('typeAnomalie');

		await app.sleep(100);

		this.modalAnomalie().setLoadingBtn();

		app.showModal('modalAnomalie');
	}

	async saveAnomalie() {
		await app.saveFormData(app.getRootDO('typeAnomalie'), crossVars.forms['formio_typeAnomalie']);

		var DO = app.getDO('typeAnomalie');

		if (DO.idTypeAnomalie != null && DO.idTypeAnomalie != '')
			await app.setExternalData(app.getUrl('urlUpdateAnomalie', DO.idTypeAnomalie), DO, 'PUT');
		else
			await app.setExternalData(app.getUrl('urlAddAnomalie'), DO, 'POST');

		if (this.create)
			app.hideModal('modalConfirmationAnomalie');

		await app.sleep(250);

		this.getParamAnomalies();

		this.anomalieUpdate = null;

		await app.sleep(150);
		app.showToast('toastSaveSuccessParamAnos');
		await app.sleep(250);

		app.hideModal('modalAnomalie');

		app.removeStorageItem('refControleAnomaliesCode');

		await app.loadRefs();
	}

	async confirmSaveAnomalie() {
		if (!this.hasNoRight) {
			if (!app.isValidForm('formio_typeAnomalie')) {
				app.showToast('toastTypeAnomalieSaveError');
				this.modalAnomalie().setLoadingBtn();
				return;
			}

			if (this.create) {
				this.modalAnomalie().setLoadingBtn();
				this.modalConfirmationAnomalie().setLoadingBtn();
				app.showModal('modalConfirmationAnomalie');
			} else
				this.saveAnomalie();
		}
	}

	anomalieNotExistInBdd(input: any) {
		var notExist = true;

		if (this.paramAnomalies != null && this.paramAnomalies.length != 0 && input != "")
			for (var anomalie of this.paramAnomalies)
				if ((input == anomalie.codeAnomalie && this.create)
					|| (this.anomalieUpdate != null && this.anomalieUpdate.idTypeAnomalie != anomalie.idTypeAnomalie && input == anomalie.codeAnomalie))
					notExist = false;

		return notExist;
	}

	filterAnomaliesBy(type: any, value: any) {
		const tableParamAnomalies = this.tableParamAnomalies();
  tableParamAnomalies.filters[type] = value;
		tableParamAnomalies.resetPage();
		tableParamAnomalies.filterItems();
		tableParamAnomalies.sortByDefault();
	}

	filterAnomaliesSelected(type: any, value: any) {
		return (this.tableParamAnomalies().filters[type] == value);
	}

	filterAnomaliesAllSelected() {
		return (this.tableParamAnomalies().filters['statutActif'] == '');
	}

	filterAnomaliesReset() {
		const tableParamAnomalies = this.tableParamAnomalies();
  tableParamAnomalies.filters['statutActif'] = '';
		tableParamAnomalies.resetPage();
		tableParamAnomalies.filterItems();
		tableParamAnomalies.sortByDefault();
	}
	
	enableToEdit() {
		if (!app.hasRightButton(this.store, 'param.ano'))
			this.hasNoRight = true;
		else
			this.hasNoRight = false;
	}
}