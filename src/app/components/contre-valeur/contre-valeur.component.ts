import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-contre-valeur',
    templateUrl: './contre-valeur.component.html',
    standalone: true,
    imports: [NgIf, FormsModule]
})

export class ContreValeurComponent implements OnInit {
	@Input() contrevaleurVisible: boolean = false;
	@Input() contrevaleurDevise: any = '';
	@Input() contrevaleurMontant: any = null;
	@Input() contrevaleurDate: any = null;
	@Input() ref: any;
	@Input() isFormio: boolean = false;

	changeCssContrevaleur: boolean = false;
	contrevaleurMontantRender: any;
	contrevaleurDateRender: any;
	projet: any;
	montant: any;
	devise: any;
	lang: any = lang;

	@Output() displayToast = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	ngAfterViewInit() {
		this.renderContrevaleur();
	}

	async getContrevaleur(update?: any, montant?: any, devise?: any, projet?: any) {
		this.contrevaleurDevise = null;
		this.contrevaleurMontant = null;
		this.contrevaleurDate = null;

		if (!update) {
			this.projet = projet;
			this.montant = montant;
			this.devise = devise;
		}

		var deviseProjet = ((this.projet != null) ? this.projet.idDevise : null);
		this.contrevaleurDevise = deviseProjet;
		var result = false;
		var displayToast = false;
		var responseCtx = true;

		if (update || (deviseProjet != this.devise && !app.isEmpty(this.devise))) {
			//mise à jour des données contrevaleur
			var montantFloat = app.convertStringToFloat(this.montant);

			if (!app.isEmpty(montantFloat) && montantFloat > 0) {
				var resultCTX = null;

				if (((deviseProjet == "EUR" || deviseProjet == "USD") && (this.devise != "EUR" || this.devise != "USD")) || (this.devise == "USD" && deviseProjet == "EUR")) {
					resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), this.devise, deviseProjet));
					this.contrevaleurDevise = deviseProjet;

					if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {
						this.contrevaleurMontant = app.getMontantCTX(montantFloat, resultCTX.cours_devises[0].valeur_mid, deviseProjet, this.devise);
						this.contrevaleurDate = resultCTX.cours_devises[0].date_valeur;
					}
					else 
						responseCtx = false;
					
					this.renderContrevaleur();
				}
				else if ((this.devise == "EUR" && deviseProjet == "USD") || ((this.devise == "EUR" || this.devise == "USD") && (deviseProjet != "USD" && deviseProjet != "EUR"))) {
					resultCTX = await app.getExternalData(app.getUrl('urlCTX', app.getDate(), deviseProjet, this.devise));
					this.contrevaleurDevise = deviseProjet;

					if (resultCTX != null && resultCTX.cours_devises != null && resultCTX.cours_devises.length > 0) {
						this.contrevaleurMontant = app.getMontantCTX(montantFloat, resultCTX.cours_devises[0].valeur_mid, deviseProjet, deviseProjet);
						this.contrevaleurDate = resultCTX.cours_devises[0].date_valeur;
					}
					else
						responseCtx = false;

					this.renderContrevaleur();
				}
				else
					responseCtx = false;

				displayToast = true;
			}
			result = true;
		}
		this.contrevaleurVisible = result;

		var contrevaleurResult = {
			'contrevaleurDevise': (this.contrevaleurDevise == null ? '' : this.contrevaleurDevise),
			'contrevaleurMontant': (this.contrevaleurMontant == null ? null : this.contrevaleurMontant),
			'contrevaleurDate': (this.contrevaleurDate == null ? null : this.contrevaleurDate),
			'responseCtx': responseCtx,
			'displayToast': displayToast
		};

		if (update)
			this.displayToast.emit(contrevaleurResult);

		return contrevaleurResult;
	}

	renderContrevaleur() {
		if (!app.isEmpty(this.contrevaleurMontant))
			this.contrevaleurMontantRender = app.formatNumberWithDecimals(this.contrevaleurMontant);
		else
			this.contrevaleurMontantRender = null;

		if (!app.isEmpty(this.contrevaleurDate))
			this.contrevaleurDateRender = app.formatDate(this.contrevaleurDate);
	}
}
