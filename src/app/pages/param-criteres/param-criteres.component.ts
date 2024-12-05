import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportExcelComponent } from 'src/app/components/export-excel/export-excel.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { StoreService } from 'src/app/services/store.service';
import { ModalComponent as ModalComponent_1 } from '../../components/modal/modal.component';
import { ExportExcelComponent as ExportExcelComponent_1 } from '../../components/export-excel/export-excel.component';
import { TableComponent as TableComponent_1 } from '../../components/table/table.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const refs: any;

@Component({
    selector: 'app-param-criteres',
    templateUrl: './param-criteres.component.html',
    standalone: true,
    imports: [ContentComponent, FormsModule, NgFor, NgIf, TableComponent_1, ExportExcelComponent_1, ModalComponent_1]
})
export class ParamCriteresComponent implements OnInit {

	@ViewChild('tableParamCriteres') tableParamCriteres!: TableComponent;
	@ViewChild('tableParamCriteresRef') tableParamCriteresRef!: TableComponent;
	@ViewChild('modalDeleteCritere') modalDeleteCritere!: ModalComponent;
	@ViewChild('exportCritereRisque') exportCritereRisque!: ExportExcelComponent;

	paramCriteres: any = null;
	criteres: any = [];
	paramCritere: any;
	critere: any;
	typeCritere: any;
	dateCritere: any;
	refType: string = '';
	urlType: string = '';
	lang: any = lang;
	refs: any = refs;
	entite: string = '';
	app: any = app;
	create: boolean = true;
	keyCritere: any;
	currentItem: any;
	paramCriteresRef: any = null;
	hasNoRight: boolean = false;
	rows: any = [];
	loadingExport: boolean = false;

	constructor(public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.enableToEdit();
	}

	get modalTitle() {
		if (this.typeCritere == "projet" || this.typeCritere == "agence" || this.typeCritere == "operation" || this.typeCritere == "directionRegionale")
			return (this.create) ? "Liste des " + this.typeCritere + "s" : lang.paramCriteres.titleAdd;
		else if (this.typeCritere == "concours" || this.typeCritere == "pays" || this.typeCritere == "modalitesPaiement")
			return (this.create) ? "Liste des " + this.typeCritere : lang.paramCriteres.titleAdd;
	}

	async getParamCriteres() {
		for (var refCritere of refs['refParamCritere']) {
			if (this.critere == refCritere.code) {
				this.typeCritere = refCritere.type;
				this.paramCriteres = await app.getExternalData(app.getUrl('urlGetParamCriteres', refCritere.type + '/' + this.critere));
				break;
			}
		}

		for (var i = 0; i < this.paramCriteres.length; i++)
			if (this.paramCriteres[i].dateCritere != null)
				this.paramCriteres[i].dateCritere = this.paramCriteres[i].dateCritere.substring(0, 10);

		this.tableParamCriteres.reset();

		await app.sleep(250);

		this.tableParamCriteres.getItems();
	}

	async addCritere() {
		if (this.typeCritere != "DossierReglement") {
			for (var ref of refs['refParamTypeCritere']) {
				if (ref.code == this.typeCritere) {
					this.refType = ref.ref;
					this.keyCritere = ref.key;

					this.urlType = 'urlGet' + app.capitalize(ref.ref, true);
					if (this.typeCritere == "projet")
						this.urlType += 'ByEntite';
				}
			}

			this.paramCriteresRef = [];

			await app.sleep(250);

			this.tableParamCriteresRef.reset();

			app.showModal('modalAddCritere');

			if (this.typeCritere != "concours")
				this.paramCriteresRef = await app.getExternalData(this.typeCritere == "projet" ? (app.getUrl('urlGetCritresRisquesProjet')) : app.getUrl(this.urlType));
			else
				this.paramCriteresRef = await app.getExternalData(app.getUrl('urlGetCritresRisquesConcours'));

			// modif Nour: pour harmoniser vu qu'on a tous les refs stockées dans le storage => pas la peine de re appeler les api ..(à voir pour implémenter)
			// if (this.typeCritere != "concours") {
			// 	if (this.typeCritere == "projet")
			// 		this.paramCriteresRef = await app.getExternalData(app.getUrl('urlGetCritresRisquesProjet'));
			// 	else if (this.typeCritere == "agence")
			// 		this.paramCriteresRef = app.getRef('refAgencesGestionsLibLong');
			// 	else if (this.typeCritere == "directionRegionale")
			// 		this.paramCriteresRef = app.getUrl(this.urlType);
			// 	else if (this.typeCritere == "pays")
			// 		this.paramCriteresRef = app.getRef('refPays');
			// 	else if (this.typeCritere == "modalitesPaiement")
			// 		this.paramCriteresRef = app.getRef('refModalitesPaiement');
			// 	else //operation
			// 		this.paramCriteresRef = app.getRef('refOperationsLibLong');
			// } else
			// 	this.paramCriteresRef = await app.getExternalData(app.getUrl('urlGetCritresRisquesConcours'));
			await app.sleep(500);

			this.tableParamCriteresRef.getItems();
		}
	}

	async updateCritere(item: any) {
		var DO = {
			id: "",
			object: "",
			codeObject: "",
			codeCritere: "",
			description: "",
			dateCritere: new Date(),
			valCritere: false,
			acteur: "",
			acteurIdentifiant: 0
		};

		app.mapDO(DO, item);

		await app.setExternalData(app.getUrl('urlUpdateParamCriteres', item.id), DO, 'PUT');

		await this.getParamCriteres();
	}

	async deleteCritere() {
		if (!this.hasNoRight) {
			var item = this.currentItem;

			await app.setExternalData(app.getUrl('urlDeleteParamCritere', item.id), null, 'DELETE');

			await this.getParamCriteres();

			this.modalDeleteCritere.setLoadingBtn();

			app.hideModal('modalConfirmSuppressionCritere');
		}
	}

	async changeCritere() {
		if (app.isNotEmpty(this.critere))
			await this.getParamCriteres();
	}

	async selectParentCritere(item: any) {
		if (!this.hasNoRight) {
			var user = await app.getExternalData(app.getUrl('urlGetUser', this.store.getUserId()), 'page param-criteres > getUser');

			var description = "";
			if (this.typeCritere == "projet")
				description = item.libelleProjet + " / " + app.getRefLabel('refAgencesGestions', item.idAgenceGestion) + " / " + app.getRefLabel('refPays', item.paysRealisation);
			else if (this.typeCritere == "concours")
				description = item.libLongProduit;
			else if (this.typeCritere == "pays")
				description = item.libelleCourtPays + " / " + item.libelleLongPays + " / " + item.idDevise;
			else if (this.typeCritere == "agence")
				description = item.libelleLongAgenceGestion;
			else if (this.typeCritere == "directionRegionale")
				description = item.libLong + " / " + item.codeEntitePere;
			else if (this.typeCritere == "modalitesPaiement")
				description = item.libelleModalite + " / " + item.entite;
			else if (this.typeCritere == "operation")
				description = item.libelleCourtOperation + " / " + item.libelleLongOperation;

			var DO = {
				object: this.typeCritere,
				idObject: 0,
				codeObject: item[this.keyCritere],
				codeCritere: this.critere,
				description: description,
				dateCritere: new Date(),
				valCritere: true,
				acteur: user.userName,
				acteurIdentifiant: 0
			};

			app.log("param-criteres > selectParentCritere - DO", DO);

			var existItem = false;
			for (var pC of this.paramCriteres)
				if ((this.typeCritere == "projet" && pC.codeObject == item.numeroProjet)
					|| (this.typeCritere == "concours" && pC.codeObject == item.numeroConcours)
					|| (this.typeCritere == "directionRegionale" && pC.codeObject == item.codeEntiteOrga)
					|| (this.typeCritere == "agence" && pC.codeObject == item.idAgenceGestion)
					|| (this.typeCritere == "modalitesPaiement" && pC.codeObject == item.nomModalite)
					|| (this.typeCritere == "operation" && pC.codeObject == item.idOperation)
					|| (this.typeCritere == "pays" && pC.codeObject == item.idPays))
					existItem = true;

			if (!existItem) {
				await app.setExternalData(app.getUrl('urlAddParamCritere'), DO, 'POST');
				await this.getParamCriteres();
			} else
				app.showToast('toastParamCritereAlreadyExist');

			app.hideModal('modalAddCritere');
		}
	}

	async showDeleteConfirm(item: any) {
		this.currentItem = item;

		await app.showModal('modalConfirmSuppressionCritere');
	}

	enableToEdit() {
		if (!app.hasRightButton(this.store, 'param.critRisque'))
			this.hasNoRight = true;
		else
			this.hasNoRight = false;
	}

	async exportExcel() {
		this.tableParamCriteres.loadingExport = true;
		let codecritere;
		var items = this.tableParamCriteres.itemsFiltered;

		for (var item of items) {
			item.objectcritere = app.getRefLabel('refParamTypeCritere', item.object);
			item.valcritere = app.getRefLabel('refBoolean', item.valCritere);
			codecritere = item.codeCritere;
		}

		this.rows = items;

		await app.sleep(2000);

		var filtresCritereRisque = [
			[lang.exportCritereRisque.critere, app.getRefLabel('refParamCritere', codecritere)]
		];

		this.exportCritereRisque.exportExcel('exportCriteresRisque', this.rows, filtresCritereRisque, null);

		this.tableParamCriteres.loadingExport = false;
	}
}