import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ModalComponent as ModalComponent_1 } from '../../components/modal/modal.component';
import { TableComponent as TableComponent_1 } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const appFormio: any;
declare const lang: any;
declare const crossVars: any;

@Component({
    selector: 'app-admin-organisation',
    templateUrl: './admin-organisation.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, CardComponent, NgFor, NgClass, TableComponent_1, ModalComponent_1]
})
export class AdminOrganisationComponent implements OnInit {

	@ViewChild('tableEntites') tableEntites!: TableComponent;
	@ViewChild('modalUpdateEntite') modalUpdateEntite!: ModalComponent;

	app: any = app;
	lang: any = lang;
	titleModal: any;
	errorMessage: any;
	parent: any;
	level: any;
	history: any = [];
	entites: any = [];
	entite: any;
	editEntite: any;
	entiteRoot: any = 'SOCIETE';

	constructor() { }

	async ngOnInit() {
		this.parent = this.entiteRoot;

		this.level = 0;

		this.history.push({
			level: this.level,
			entite: null,
			label: lang.entitesOrga.historyRoot
		});

		await this.getEntites();
	}

	async getEntites() {
		var url = (this.level > 0) ? 'urlGetEntitesOrgaByParent' : 'urlGetEntitesOrgaByType';

		var entites = await app.getExternalData(app.getUrl(url, this.parent), 'admin-organisation > getEntites ' + this.level + ' ' + this.parent);

		this.entites = [];
		for (var entite of entites) {
			if (this.entite == null ||
				(this.entite != null && this.entite.codeEntiteOrga != entite.codeEntiteOrga && this.entite.typeEntiteOrga != entite.typeEntiteOrga)) {
				entite.statut = lang.entitesOrga.statutActif;

				this.entites.push(entite);
			}
		}

		await app.sleep(250);

		this.tableEntites.getItems();
	}

	async setEntite(item: any, level?: any) {
		this.entite = item;
		
		this.parent = (item != null) ? item.codeEntiteOrga : this.entiteRoot;
		
		if (level == null) {
			this.level++;

			this.history.push({
				level: this.level,
				entite: item
			});
		} else {
			this.level = level;
			
			this.history = this.history.slice(0, level + 1);
		}
		
		app.log('admin-orga > setEntite history', this.history);

		this.getEntites();
	}

	getHistoryTitle(index: any, item: any) {
		return (this.level != index && item.entite != null) ? item.entite.libCourt + ' (' + item.entite.typeEntiteOrga + ')' : '';
	}

	async updateEntite(item?: any) {
		this.titleModal = (item == null) ? lang.entitesOrga.titleAdd : lang.entitesOrga.titleUpdate;

		app.showModal('modalUpdateEntite');

		appFormio.loadFormIO('entiteOrga');

		this.editEntite = item;

		await app.sleep(250);

		if (item != null) {
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteOrga', item.codeEntiteOrga);
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'libCourt', item.libCourt);
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'typeEntiteOrga', item.typeEntiteOrga);
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntitePere', item.codeEntitePere);
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteRoot', item.codeEntiteRoot);
		} else {
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteOrga', '');
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'libCourt', '');
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'typeEntiteOrga', '');
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntitePere', (this.level > 1) ? this.history[this.history.length - 1].entite.codeEntiteOrga : this.history[1].entite.codeEntiteOrga);
			appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteRoot',(this.level > 2) ? this.history[this.history.length - 2].entite.codeEntiteOrga : this.history[1].entite.codeEntiteOrga);
		}

		appFormio.setReadOnly(crossVars.forms['formio_entiteOrga'], 'codeEntiteOrga', (item != null));
		appFormio.setReadOnly(crossVars.forms['formio_entiteOrga'], 'typeEntiteOrga', (item != null));

		appFormio.setDataValue(crossVars.forms['formio_entiteOrga'], 'statut', 'Oui');
	}

	async saveEntite() {
		if (!app.isValidForm('formio_entiteOrga')) {
			this.modalUpdateEntite.setLoadingBtn();
			this.errorMessage = lang.failedFormSave;
			app.showToast('toastEntiteSaveError');
			return;
		}

		var DO: any = {
			"codeEntiteOrga": appFormio.getDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteOrga'),
			"libCourt": appFormio.getDataValue(crossVars.forms['formio_entiteOrga'], 'libCourt'),
			"typeEntiteOrga": appFormio.getDataValue(crossVars.forms['formio_entiteOrga'], 'typeEntiteOrga'),
			"codeEntitePere": appFormio.getDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntitePere'),
			"codeEntiteRoot": appFormio.getDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteRoot'),
			//"codeSociete": appFormio.getDataValue(crossVars.forms['formio_entiteOrga'], 'codeEntiteRoot'),
			"codeSociete": this.history[1].entite.codeEntiteOrga,
		};

		if (this.editEntite != null)
			DO.id = {
				"codeEntiteOrga": this.editEntite.codeEntiteOrga,
				"typeEntiteOrga": this.editEntite.typeEntiteOrga
			};

		app.log('saveEntite', DO);

		var result = await app.setExternalDataWithResult(app.getUrl('urlSetEntiteOrga'), DO, (this.editEntite == null) ? 'POST' : 'PUT');

		this.modalUpdateEntite.setLoadingBtn();

		if (result.status >= 300) {
			this.errorMessage = result.detail;

			app.showToast('toastEntiteSaveError');
		} else {
			this.getEntites();

			app.hideModal('modalUpdateEntite');
		}
	}

	async deleteEntite() {
		if (this.editEntite == null)
			return;

		var result = await app.setExternalDataWithResult(app.getUrl('urlDeleteEntiteOrga', this.editEntite.codeEntiteOrga, this.editEntite.typeEntiteOrga), null, 'DELETE');

		if (result.status >= 300) {
			this.errorMessage = result.detail;

			app.showToast('toastEntiteSaveError');
		} else {
			this.getEntites();

			app.hideModal('modalUpdateEntite');
		}
	}
}