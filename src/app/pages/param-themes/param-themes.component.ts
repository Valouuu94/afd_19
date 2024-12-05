import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/components/table/table.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { StoreService } from 'src/app/services/store.service';
import { ModalComponent as ModalComponent_1 } from '../../components/modal/modal.component';
import { TableComponent as TableComponent_1 } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const crossVars: any;
declare const appFormio: any;

@Component({
    selector: 'app-param-themes',
    templateUrl: './param-themes.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent_1, ModalComponent_1]
})
export class ParamThemesComponent implements OnInit {

	@ViewChild('tableParamThemes') tableParamThemes!: TableComponent;
	@ViewChild('modalTheme') modalTheme!: ModalComponent;
	@ViewChild('modalConfirmationTheme') modalConfirmationTheme!: ModalComponent;

	app: any = app;
	create: boolean = true;
	lang: any = lang;
	isDCV: boolean = false;
	entite: any;
	perimetre: any;
	themes: any = [];
	hasNoRight: boolean = false;

	constructor(public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		this.enableToEdit();
	}

	ngAfterViewInit() {
		this.getParamThemes();
	}

	get modalTitle() {
		return (this.create) ? lang.paramThemes.tooltipAdd : lang.paramThemes.edit;
	}

	getParamThemes() {
		this.tableParamThemes.getItems();
	}

	addTheme() {
		this.updateTheme(null);
	}

	async updateTheme(item: any) {
		var DO = app.getDO('theme');

		if (item == null) {
			this.create = true;

			app.resetDO('theme');

			DO.statutActif = 'Y';
		} else {
			this.create = false;

			app.mapDO(DO, item);
		}

		app.setBDM(DO);

		appFormio.loadFormIO('theme');

		await app.sleep(100);

		app.showModal('modalTheme');
	}

	async confirmSaveTheme() {
		if (!this.hasNoRight) {
			if (!app.isValidForm('formio_theme')) {
				app.showToast('toastThemeSaveError');
				this.modalTheme.setLoadingBtn();
				return;
			}

			if (this.create) {
				this.modalTheme.setLoadingBtn();
				app.showModal('modalConfirmationTheme');
			} else
				this.saveTheme();
		}
	}

	async saveTheme() {
		await app.saveFormData(app.getRootDO('theme'), crossVars.forms['formio_theme']);

		var DO = app.getDO('theme');

		if (this.create)
			await app.setExternalData(app.getUrl('urlAddTheme'), DO, 'POST');
		else
			await app.setExternalData(app.getUrl('urlUpdateTheme', DO.idTheme), DO, 'PUT');

		this.tableParamThemes.getItems();

		if (this.create) {
			this.modalConfirmationTheme.setLoadingBtn();
			app.hideModal('modalConfirmationTheme');
		}

		this.modalTheme.setLoadingBtn();

		await app.sleep(150);
		app.showToast('toastSaveSuccessThemes');
		await app.sleep(250);
		
		app.hideModal('modalTheme');
	}

	enableToEdit() {
		if (!app.hasRightButton(this.store, 'param.them')) {
			this.hasNoRight = true;
		} else
			this.hasNoRight = false;
	}
}