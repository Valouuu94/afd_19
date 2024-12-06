import { Component, OnInit, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { StoreService } from '../../services/store.service';

declare const app: any;
declare const lang: any;
declare const refs: any;

@Component({
    selector: 'app-infos-avance',
    templateUrl: './infos-avance.component.html',
    standalone: true,
    imports: [NgIf, NgFor]
})
export class InfosAvanceComponent implements OnInit {
    avanceContractuel: any = null;
    reglement: any;
    showDetail: boolean = false;
    entite: any;
    lang: any = lang;
    app: any = app;
    idReglement: any = null;
    idVersement: any = null;
    isFixed: boolean = false;
    avanceFig: any;
    montantTotalJustificatifsAvance: any;
    resteJustifierDecaisserDossier: any;
    montantVerseTotal: any = 0;
    resteJustifier: any;
    montantPlafondAvance: any;
    deviseAvance: any;
    acRepris: any;

    readonly displayButtonAvance = input<boolean>(false);
    readonly enableCollapse = input<boolean>(false);
    readonly role = input<any>();

    constructor(private router: Router, public store: StoreService) { }

    ngOnInit() { }

    // Add a flag variable to your class
    private hasMethodExecuted = false;
    private processedDossierIds = new Set<string>(); // Maintain a set of processed dossier persistenceIds

    async getMontantVerseTotal() {
        this.montantVerseTotal = (!app.isEmpty(this.avanceContractuel.montant_verse_total)) ? this.avanceContractuel.montant_verse_total : 0;
    }

    async getAvance(idAvance: any, entite: any, idVersement: any, idReglement: any) {
        this.entite = entite;
        this.idVersement = idVersement;
        this.idReglement = idReglement;
        this.isFixed = false;

        if (!app.isEmpty(idAvance)) {
            this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvanceContractuel', idAvance), 'page-avance > getAvance', true);
            this.acRepris = !app.isEmpty(this.avanceContractuel.obj_ext_id);
            this.montantPlafondAvance = this.avanceContractuel.montant_plafond;
            this.deviseAvance = this.avanceContractuel.devise_avance;

            this.montantTotalJustificatifsAvance = app.isEmpty(this.avanceContractuel.montant_justifie_total) ? 0 : this.avanceContractuel.montant_justifie_total;
            if (!this.acRepris)
                this.resteJustifierDecaisserDossier = app.getResteJustifierDecaisserDossier(this.avanceContractuel);

            await this.getMontantVerseTotal();

            this.resteJustifier = app.getResteJustifier(this.montantVerseTotal, this.montantTotalJustificatifsAvance);

            if (this.avanceContractuel.avanceFigee != null) {
                var avanceFigResult = await app.getExternalData(app.getUrl('urlGetAvanceFigeeByIdDrAndIdAvance', this.idReglement, this.avanceContractuel.persistenceId), true);

                if (avanceFigResult.length > 0)
                    this.avanceFig = avanceFigResult[0];

                if (this.idReglement != null)
                    this.reglement = await app.getExternalData(app.getUrl('urlGetReglement', this.idReglement), 'cmp-infos-avance > getAvance - reglement', true);

                //TODO : isFixed dépend de anavcefg et le role de l'acteur (si c'est AGV ou CHGP la photo est créée/màj)
                const role = this.role();
                this.isFixed = (this.avanceFig != null && (!(app.isAgentVersement(role) || app.isChargeAppui(role)) || (this.reglement.code_statut_dossier == 'DDR5' || this.reglement.code_statut_dossier == 'DDR5B' || this.reglement.code_statut_dossier == 'DDR14' || this.reglement.code_statut_dossier == 'DDR7' || this.reglement.code_statut_dossier == 'DDR8')));
            }
        } else
            this.avanceContractuel = null;
    }

    goToAvanceContractuel() {
        app.setStorageItem('idReglement', this.idReglement);
        app.setStorageItem('idVersement', this.idVersement);

        app.redirect(this.router, app.getUrl('urlGoToAvance', this.avanceContractuel.persistenceId));
    }
}