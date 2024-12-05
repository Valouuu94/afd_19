import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgIf, NgFor } from '@angular/common';

declare const app: any;
declare const lang: any;
declare const appFormio: any;
declare const crossVars: any;

@Component({
    selector: 'app-infos-context',
    templateUrl: './infos-context.component.html',
    standalone: true,
    imports: [NgIf, SpinnerComponent, NgFor]
})
export class InfosContextComponent implements OnInit {

	app: any = app;
	lang: any = lang;
	loading: boolean = false;
	projet: any;
	concours: any;
	finalConcours: any = [];
	reglementsAvance: any = [];
	impaye: any;
	montantDdr: any;
	ravPrevisionnel: any;
	montantTotalProjet: any;
	resteAJustifier: any;
	ravProjet: any;
	DLVF: any;
	acteursAV: any = [];
	acteursCP: any = [];
	acteursDIR: any = [];
	chargeGestionInstruction: any;
	chargeAffairesInstruction: any;
	chargeAffairesInstructionSuppleant: any;
	chargeAffairesDaf: any;

	@Input() reglements: any;
	@Input() reglement: any;
	@Input() versement: any;
	@Input() avance: any;
	@Input() entite: any;
	@Input() isDCV: any;
	@Input() isDcRAJ: any;
	@Input() showConcoursPROPARCO: boolean = true;

	constructor(private router: Router, public store: StoreService) {
		this.isDCV = false;
		this.isDcRAJ = false;
	}

	ngOnInit() { }

	ngAfterViewInit() {
		this.getContext();
	}

	async getContext() {
		this.loading = true;

		if (this.isDcRAJ) {
			this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.avance.numero_projet), 'cmp-info-context > getProjet-AV', true);
			var concoursGCF = await app.getExternalData(app.getUrl('urlGetConcoursGCFByProjet', this.avance.numero_projet), 'cmp-info-context > getConcoursGCF-AV');
			this.reglementsAvance = this.avance.dossiersReglement;

			app.sortBy(this.reglementsAvance, [
				{ key: 'date_paiement', order: 'asc' }
			]);

			this.resteAJustifier = this.avance.montant_verse_total - this.avance.montant_justifie_total

			this.montantTotalProjet = app.renderEmpty(app.montantTotal(concoursGCF, this.projet));
			this.ravProjet = app.renderEmpty(app.sommeRav(concoursGCF, this.entite, this.projet));
			this.impaye = app.renderEmpty(await app.getImpayeSIRP(concoursGCF, this.entite, this.projet));
		}
		else {
			this.projet = (this.reglement != null) ? await app.getExternalData(app.getUrl('urlGetProjetByNum', this.reglement.numero_projet), 'cmp-info-context > getProjet', true) : await app.getExternalData(app.getUrl('urlGetProjetByNum', this.versement.numero_projet), 'cmp-info-context > getProjet', true);
			var concoursGCF = await app.getExternalData(app.getUrl('urlGetConcoursGCFByProjet', this.projet.numeroProjet), 'cmp-info-context > getProjet > getConcoursGCF');

			this.montantTotalProjet = app.renderEmpty(app.montantTotal(concoursGCF, this.projet));
			this.ravProjet = app.renderEmpty(app.sommeRav(concoursGCF, this.entite, this.projet));
			this.impaye = app.renderEmpty(await app.getImpayeSIRP(concoursGCF, this.entite, this.projet));
			this.DLVF = (!app.isAFD(this.entite)) ? app.renderEmpty(await app.getDLVFMax(concoursGCF)) : app.renderEmpty(null);

			//recuperer les acteurs à afficher dans les infos projet - PRO
			var projetAFD = app.isProjetAFDUsedByPro(this.projet);
			if (!app.isAFD(this.entite)) {
				for (var intervenantElt of this.projet.projetIntervenants) {
					if (intervenantElt.typeRole.idTypeRole == 51)
						this.chargeGestionInstruction = (app.isEmpty(intervenantElt.intervenant.nom) ? '' : intervenantElt.intervenant.nom) + " " + (app.isEmpty(intervenantElt.intervenant.prenom) ? '' : intervenantElt.intervenant.prenom);
					else if (intervenantElt.typeRole.idTypeRole == 42)
						this.chargeAffairesInstruction = (app.isEmpty(intervenantElt.intervenant.nom) ? '' : intervenantElt.intervenant.nom) + " " + (app.isEmpty(intervenantElt.intervenant.prenom) ? '' : intervenantElt.intervenant.prenom);
					else if ((intervenantElt.typeRole.idTypeRole == 46 && !projetAFD) || (intervenantElt.typeRole.idTypeRole == 42 && projetAFD && intervenantElt.intervenant.flgSuppleant == '0'))
						this.chargeAffairesInstructionSuppleant = (app.isEmpty(intervenantElt.intervenant.nom) ? '' : intervenantElt.intervenant.nom) + " " + (app.isEmpty(intervenantElt.intervenant.prenom) ? '' : intervenantElt.intervenant.prenom);
					else if (intervenantElt.typeRole.idTypeRole == 107 && projetAFD)
						this.chargeAffairesDaf = (app.isEmpty(intervenantElt.intervenant.nom) ? '' : intervenantElt.intervenant.nom) + " " + (app.isEmpty(intervenantElt.intervenant.prenom) ? '' : intervenantElt.intervenant.prenom);
				}
			}
		}

		var listNumerosCoucours = [];
		var listUniqueNumerosCoucours = [];

		if (this.reglements != null && this.reglements.length > 0) {
			app.log("****************WHEN we are in a MULTIPLE Ddrs****************");

			for (var reg of this.reglements) {
				if (!app.isDossierAnnule(reg.code_statut_dossier))
					listNumerosCoucours.push(reg.numero_concours);
			}
			listUniqueNumerosCoucours = listNumerosCoucours.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
			for (var cr of listUniqueNumerosCoucours) {
				this.concours = await app.getAllDataConcoursById(cr);
				if (app.isAFD(this.entite)) {
					var montantsDDR = await app.montantsDDRStatutEnCours(this.concours);
					this.concours.ravPrevisionnel = (this.concours.resteAVerser != null ? this.concours.resteAVerser : 0) - montantsDDR;
				}
				this.finalConcours.push(this.concours);
			}
		}
		else {
			app.log("****************WHEN we are in a SINGLE Ddr****************");
			if (this.isDcRAJ)
				this.concours = await app.getAllDataConcoursById(this.avance.numero_concours);
			else
				this.concours = (this.reglement == null) ? await app.getAllDataConcoursById(this.versement.numero_concours) : await app.getAllDataConcoursById(this.reglement.numero_concours);

			if (this.reglement == null)
				app.log("getContext() > reglement is NUll(create) > versement >>", this.versement);
			else
				app.log("getContext() > reglement isn't NUll(update) > reglement >> ", this.reglement);

			if (app.isAFD(this.entite)) {
				var montantsDDR = await app.montantsDDRStatutEnCours(this.concours);
				this.concours.ravPrevisionnel = (this.concours.resteAVerser != null ? this.concours.resteAVerser : 0) - montantsDDR;
			}
			this.finalConcours.push(this.concours);

			//récupérer les acteurs qui ont intervenus dans le traitement du dossier - AFD
			if (!this.isDcRAJ && app.isAFD(this.entite) && this.reglement != null) {
				if (this.reglement.acteurs.length > 0) {
					for (var acteur of this.reglement.acteurs) {
						if (app.isAgentVersement(acteur.role_acteur) && !app.existInArray(this.acteursAV, 'username', acteur.username))
							this.acteursAV.push(acteur);
						else if (app.isChargeProjet(acteur.role_acteur) && !app.existInArray(this.acteursCP, 'username', acteur.username))
							this.acteursCP.push(acteur);
						else if (app.isDirecteur(acteur.role_acteur) && !app.existInArray(this.acteursDIR, 'username', acteur.username))
							this.acteursDIR.push(acteur);
					}
				}
			}
		}

		if (this.reglements != null && (this.finalConcours == null || this.finalConcours.length == 0)) {
			app.log("****************WHEN we are in a DV with DDRs tous annulés****************");
			this.concours = await app.getAllDataConcoursById(this.versement.numero_concours);
			this.finalConcours.push(this.concours);
		}
		app.log("### getContext() > final list Concours ###", this.finalConcours);

		app.sortBy(this.finalConcours, [
			{ key: 'numeroConcours', order: 'asc' }
		]);

		if (this.isDCV && !this.isDcRAJ && this.reglement != null)
			this.getRendermontantDDR();

		this.loading = false;
	}

	async setInfosConcours(numConcours: any) {
		this.loading = true;

		app.log("### setInfosConcours > concours Updated ###", numConcours);

		this.finalConcours = [];

		this.concours = await app.getAllDataConcoursById(numConcours);

		if (app.isAFD(this.entite)) {
			app.log("### setInfosConcours > RAV Previsionnel concours Updated ###");

			var montantsDDR = await app.montantsDDRStatutEnCours(this.concours);
			this.concours.ravPrevisionnel = (this.concours.resteAVerser != null ? this.concours.resteAVerser : 0) - montantsDDR;
		}

		this.finalConcours.push(this.concours);

		this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.concours.numeroProjet), 'cmp-info-context > setProjet', true);

		this.loading = false;
	}

	gotoProjet() {
		app.gotoLink(document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoProjets') + '/' + this.projet.numeroProjet);
	}

	gotoConcours(idConcours: any) {
		app.gotoLink(document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoProjets') + '/' + this.projet.numeroProjet + '/' + idConcours);
	}

	gotoReglement(id: any) {
		var url = window.document.location.href;
		url = url.split('#')[0] + '#' + app.getUrl('urlGotoReglementControlesForceLvl1', id) + '&newTab=1';

		app.gotoLink(url);
	}

	gotoAvance() {
		app.setStorageItem('originGoto', 'context');
		app.setStorageItem('numeroConcours', this.avance.numero_concours);

		app.gotoLink(document.location.origin + document.location.pathname + '#' + app.getUrl('urlGoToAvance', this.avance.persistenceId));
	}

	getRendermontantDDR() {
		this.montantDdr = "";
		
		if (app.isAFD(this.reglement.entite)) {
			if (this.reglement.type_devise == '1')
				this.montantDdr = app.formatMontantTrigramme(app.formatNumberWithDecimals((this.reglement.montant_reglement == null ? 0 : this.reglement.montant_reglement)), this.reglement.devise_reglement);
			else
				this.montantDdr = app.formatMontantTrigramme(app.formatNumberWithDecimals((this.reglement.montant_reglement == null ? 0 : this.reglement.montant_reglement)), this.reglement.devise_reference)
					+ '<br> en ' + this.reglement.devise_reglement;
		}
	}
}
