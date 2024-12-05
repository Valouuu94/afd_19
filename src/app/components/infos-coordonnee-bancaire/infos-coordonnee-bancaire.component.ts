import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-infos-coordonnee-bancaire',
    templateUrl: './infos-coordonnee-bancaire.component.html',
    standalone: true,
    imports: [NgIf, FormsModule, NgFor]
})
export class InfosCoordonneBancaireComponent implements OnInit {

	isAFD: boolean = false;
	lang: any = lang;
	coordonneeBancaire: any;
	app: any = app;
	read: boolean = false;
	coordonneeBancaireSelected: any;
	checkSelectCoordonneeBancaire: boolean = false;
	listCoordonneesBancaires: any;

	constructor(public store: StoreService) { }

	ngOnInit() {
		var entite = this.store.getUserEntite();
		this.isAFD = app.isAFD(entite);
	}

	setListCoordonneesBancaires(list: any, read: any, coordonneeSelected?: any) {
		this.read = read;
		this.coordonneeBancaireSelected = null;
		this.coordonneeBancaire = null;

		if (list.length == 1) {
			this.coordonneeBancaireSelected = list[0];
			this.getDetailCoordonneBancaire();
		}
		else if (coordonneeSelected != null) {
			this.coordonneeBancaireSelected = coordonneeSelected;
			this.getDetailCoordonneBancaire();
		}
		if(!app.isEmpty(list[0]))
			this.listCoordonneesBancaires = list;
	}

	// methode pour afficher les details d'une coordonnée bancaire séléctionnée
	getDetailCoordonneBancaire() {
		this.coordonneeBancaire = this.coordonneeBancaireSelected;
	}

	// methode pour verifier qu'on a selectionné une coordonnée bancaire
	checkCoordonneeBancaire() {
		this.checkSelectCoordonneeBancaire = app.isEmpty(this.coordonneeBancaireSelected);
		return this.checkSelectCoordonneeBancaire;
	}
}