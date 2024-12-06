import { Component, OnInit, ViewChild, input, output } from '@angular/core';
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
	readonly contrevaleurVisible = input<boolean>(false);
	readonly contrevaleurDevise = input<any>('');
	readonly contrevaleurMontant = input<any>(null);
	readonly contrevaleurDate = input<any>(null);
	readonly ref = input<any>();
	readonly isFormio = input<boolean>(false);

	changeCssContrevaleur: boolean = false;
	contrevaleurMontantRender: any;
	contrevaleurDateRender: any;
	projet: any;
	montant: any;
	devise: any;
	lang: any = lang;

	readonly displayToast = output();

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

		const contrevaleurDevise = this.contrevaleurDevise();
  const contrevaleurMontant = this.contrevaleurMontant();
  const contrevaleurDate = this.contrevaleurDate();
  var contrevaleurResult = {
			'contrevaleurDevise': (contrevaleurDevise == null ? '' : contrevaleurDevise),
			'contrevaleurMontant': (contrevaleurMontant == null ? null : contrevaleurMontant),
			'contrevaleurDate': (contrevaleurDate == null ? null : contrevaleurDate),
			'responseCtx': responseCtx,
			'displayToast': displayToast
		};

		if (update)
			this.displayToast.emit(contrevaleurResult);

		return contrevaleurResult;
	}

	renderContrevaleur() {
		const contrevaleurMontant = this.contrevaleurMontant();
  if (!app.isEmpty(contrevaleurMontant))
			this.contrevaleurMontantRender = app.formatNumberWithDecimals(contrevaleurMontant);
		else
			this.contrevaleurMontantRender = null;

		const contrevaleurDate = this.contrevaleurDate();
  if (!app.isEmpty(contrevaleurDate))
			this.contrevaleurDateRender = app.formatDate(contrevaleurDate);
	}
}
