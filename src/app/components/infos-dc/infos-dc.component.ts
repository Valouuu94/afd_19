import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { NgIf, NgFor } from '@angular/common';

declare const app: any;
declare const lang: any;
declare const refs: any;

@Component({
    selector: 'app-infos-dc',
    templateUrl: './infos-dc.component.html',
    standalone: true,
    imports: [NgIf, NgFor]
})
export class InfosDcComponent implements OnInit {
    documentContractuel: any;
    isAR: boolean = false;
    resteARembourser: any;
    arInitiale: any;
    rembEffectuee: any;
    app: any = app;
    lang: any = lang;
    reglementEnCours: any;

    @Input() showLinkDc: boolean = false;
    @Input() versement: any;

    constructor(private router: Router, public store: StoreService) { }

    ngOnInit() { }

    async getDetailDocumentContractuel(idDocumentContractuel: any, reglementEnCours: any, deviseDDREnCours: any, montantDDREnCours: any) {
        this.reglementEnCours = reglementEnCours;
        
		if (!app.isEmpty(idDocumentContractuel)) {
			this.documentContractuel = await app.getExternalData(app.getUrl('urlGetDocumentContractuelById', idDocumentContractuel), 'infos-dc > getDocumentContractuel - DC', true);

			this.isAR = (this.documentContractuel.avance_remboursable == "1") ? true : false;

			var idDDREnCours = null;
			var statutDDREnCours = '';

			deviseDDREnCours = deviseDDREnCours;
			montantDDREnCours = montantDDREnCours;

			if (this.reglementEnCours != null && this.showLinkDc) {
				idDDREnCours = this.reglementEnCours.persistenceId;
				statutDDREnCours = this.reglementEnCours.code_statut_dossier;
			}
			this.documentContractuel = await app.getRavProvisionnelRavActuelDC(this.documentContractuel, idDDREnCours, this.isAR);

			// this.arInitiale = app.getMontantARInitiale(this.documentContractuel);
			this.arInitiale = (!app.isEmpty(this.documentContractuel.montant_ar_initiale)) ? this.documentContractuel.montant_ar_initiale :0;
			
			this.rembEffectuee = (!app.isEmpty(this.documentContractuel.montant_remb_effectue)) ? this.documentContractuel.montant_remb_effectue : 0;

			this.resteARembourser = this.arInitiale - this.rembEffectuee;
		}
		else
			this.documentContractuel = null;
	}
    gotoDC() {
        if(this.reglementEnCours != null)
            app.setStorageItem('idReglement', this.reglementEnCours.persistenceId);
        else
			app.setStorageItem('idVersement', this.versement.persistenceId);

        app.redirect(this.router, app.getUrl('urlGoToDocumentContractuel', this.documentContractuel.persistenceId));
    }

}