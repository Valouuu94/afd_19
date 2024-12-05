import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ContreValeurComponent  } from '../contre-valeur/contre-valeur.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const app: any;
declare const lang: any;
declare const appFormio: any;
declare const crossVars: any;

@Component({
    selector: 'app-autre-devise',
    templateUrl: './autre-devise.component.html',
    imports: [CommonModule, ContreValeurComponent, FormsModule],
})

export class AutreDeviseComponent implements OnInit {
	@ViewChildren(ContreValeurComponent) contrevaleurs!: QueryList<ContreValeurComponent>;

	lang: any = lang;
	app: any = app;
	devises: any = [];
	montant: any;
	checkAtrDevise: boolean = false;
	displayIfValidate: boolean = false;

	@Input() autresDevises: any;
	@Input() filteredDevises: any;
	@Input() read: boolean;
	@Input() checkDuplicate: boolean;
	@Input() isInsideModal: boolean = false;
	@Input() parentObject: any = null;
	@Input() typeObject: any = '';
	@Input() maxDevises: any = 4;

	constructor() {
		this.autresDevises = [];
		this.filteredDevises = [];
		this.read = false;
		this.checkDuplicate = false;
	}

	ngOnInit() {
		this.loadFilteredDevises();
	}

	addAutreDevise() {
		this.autresDevises.push({
			montant: '',
			devise: ''
		});
	}

	async deleteAutreDevise(item: any) {
		var index = -1;
		for (var i = 0; i < this.autresDevises.length; i++)
			if (item == this.autresDevises[i])
				index = i;
		if (index != -1)
			this.autresDevises.splice(index, 1);

		if (this.typeObject == "DC") {
			var checkDevise = this.checkDuplicateDevises(item);
			app.getCurrentCmp('documentContractuel').getRubriques(item, checkDevise);
		}
	}

	checkAutresDevises() {
		this.checkAtrDevise = true;

		for (var autreDevise of this.autresDevises) {
			if (app.isEmpty(autreDevise.montant) || app.isEmpty(autreDevise.devise) || (this.checkDuplicate && this.checkDuplicateDevises(autreDevise)) || !this.checkAutreDeviseUsedByChildObject(autreDevise, true)) {
				this.displayIfValidate = true;
				return false;
			} else
				autreDevise.montant = parseFloat(autreDevise.montant.toString().replace(',', '.').replace(/\s/g, ''));
		}

		return true;
	}

	loadFilteredDevises() {
		if (this.filteredDevises == null || this.filteredDevises.length == 0)
			this.devises = app.getStorageItem('refDevises');
		else
			this.devises = this.filteredDevises;
	}

	checkDuplicateDevises(paramAutreDevise: any) {
		var listDevises: any = [];
		var devisePrincipale = '';

		if (this.typeObject == "DV")
			devisePrincipale = appFormio.getDataValue(crossVars.forms['formio_versementAFD'], 'devise');
		else if (this.typeObject == "DC")
			devisePrincipale = appFormio.getDataValue(crossVars.forms['formio_documentContractuel'], 'devise_afd');

		listDevises.push(devisePrincipale);

		for (var autreDevise of this.autresDevises)
			if (!app.isEmpty(autreDevise.devise))
				listDevises.push(autreDevise.devise);

		var currentDeviseCount = 0;
		for (var item of listDevises)
			if (item == paramAutreDevise.devise)
				currentDeviseCount++;

		if (paramAutreDevise != null)
			paramAutreDevise.isDuplicate = false;

		if (currentDeviseCount > 1) {
			if (paramAutreDevise != null)
				paramAutreDevise.isDuplicate = true;
			return true;
		}
		return false;
	}

	checkAutreDeviseUsedByChildObject(currentItem: any, isAmount: any) {
		if (this.typeObject == "DV") {
			this.checkAtrDevise = app.checkAutreDeviseUsedByDDR(this.parentObject, currentItem, isAmount);
			return this.checkAtrDevise;
		}
		return true;
	}

	async updateContrevaleur(autreDevise?: any, index?: any, isDevise?: any) {
		if (this.typeObject == "DC" && isDevise) {
			var checkDevise = this.checkDuplicateDevises(autreDevise);
			app.getCurrentCmp('documentContractuel').getRubriques(autreDevise, checkDevise);
		}
		await this.getContrevaleur(false, autreDevise, index);
	}

	async getContrevaleur(update?: any, autreDevise?: any, index?: any) {
		for (var contrevaleur of this.contrevaleurs) {
			if (contrevaleur.ref == 'contrevaleur-' + index) {
				var contrevaleurResult = await contrevaleur.getContrevaleur(update, autreDevise.montant, autreDevise.devise, this.parentObject);

				autreDevise.montant_contrevaleur = contrevaleurResult.contrevaleurMontant;
				autreDevise.devise_contrevaleur = contrevaleurResult.contrevaleurDevise;
				autreDevise.date_contrevaleur = contrevaleurResult.contrevaleurDate;

				this.displayToast(contrevaleurResult);
			}
		}
	}

	displayToast(contrevaleurResult: any) {
		if (contrevaleurResult.displayToast) {
			if (contrevaleurResult.responseCtx)
				app.showToast('toastUpdateContrevaleurSuccess');
			else
				app.showToast('toastUpdateContrevaleurError');
		}
	}
}
