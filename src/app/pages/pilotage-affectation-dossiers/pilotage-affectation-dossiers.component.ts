import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';
import { StoreService } from '../../services/store.service';


declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-pilotage-affectation-dossiers',
    templateUrl: './pilotage-affectation-dossiers.component.html',
    standalone: true,
    imports: [ContentComponent, NgFor]
})
export class PilotageAffectationDossiersComponent implements OnInit {

    app: any = app;
    lang: any = lang;
    kpiDDRreglees: any;
    kpiDDReligibles: any;
    kpiDDReligibles1CR: any;
    kpiDDRcontrolees: any;
    kpiDDRcontrolees1CR: any;
    kpiTauxControle: any;
    kpiAvanceObjectif: any;
    kpiAvanceTendance: any;
    dataGlobal: any;
    dataDetailAnnee: any;
    dataDetailMois: any;
    currentYear: any;
    isManagerDCV: boolean = false;
    totalDDRaffectees: any;
    totalDDRcontrolees: any;
    totalobjectif: any;
    totaltauxControle: any;

    constructor(public store: StoreService) { }

    async ngOnInit() {
        this.isManagerDCV = app.isManagerDCV(this.store.getUserRole());
        this.currentYear = (new Date()).getFullYear();

        var pilotage = await app.getExternalData(app.getUrl('urlGetPilotageDCV'), 'pilotage-affectation-dossiers > pilotageDCV', true);

        var user = await app.getExternalData(app.getUrl('urlGetUser', this.store.getUserId()), 'pilotage-affectation-dossiers > getUser');
        var userName = (user != null) ? user.firstname + ' ' + user.lastname : '';

        //tableau de bord
        this.kpiDDRreglees = pilotage.pilotageActiviteDcv.nbDdrReglesAnnee;
        this.kpiDDReligibles = pilotage.pilotageActiviteDcv.nbDdrEligibleDate;
        this.kpiDDReligibles1CR = pilotage.pilotageActiviteDcv.nbDdrEligibleAcrDate;
        this.kpiDDRcontrolees = pilotage.pilotageActiviteDcv.nbDdrControleAnnee;
        this.kpiDDRcontrolees1CR = pilotage.pilotageActiviteDcv.nbDdrControleAcrAnnee;
        this.kpiTauxControle = pilotage.pilotageActiviteDcv.tauxControleAnnee?.toFixed(2);
        this.kpiAvanceObjectif = pilotage.pilotageActiviteDcv.objectifControleGlobal?.toFixed(2);
        this.kpiAvanceTendance = pilotage.pilotageActiviteDcv.objectifControleTendance?.toFixed(2);

        //criteres de risque
        this.dataGlobal = [];
        if (pilotage.pilotageGlobalDcvCritereRisque != null && pilotage.pilotageGlobalDcvCritereRisque.length > 0) {
            for (var CR of pilotage.pilotageGlobalDcvCritereRisque) {
                this.dataGlobal.push(
                    {
                        idCritere: CR.ordreCritere,
                        critere: CR.libCritere,
                        DDRreglees: CR.ddrRegleParCritereRisque,
                        DDReligibles: CR.ddrEligibleControleParCritereRisque,
                        DDRnonAffectees: CR.ddrNonEligibleParCritereRisque,
                        DDRaffectees: CR.ddrAffecteParCritereRisque,
                        DDRcontrolees: CR.ddrControleParCritereRisque,
                        tauxControle: CR.tauxControleParCritereRisque?.toFixed(2)
                    }
                );
            }
        }

        //controleurs annuel
        this.dataDetailAnnee = [];
        if (pilotage.pilotageDcvDetailControleurAnnee != null && pilotage.pilotageDcvDetailControleurAnnee.length > 0) {
            for (var CA of pilotage.pilotageDcvDetailControleurAnnee) {
                if (this.isManagerDCV || (!this.isManagerDCV && userName.toLowerCase() == (CA.prenomControleur + ' ' + CA.nomControleur).toLowerCase())) {
                    this.dataDetailAnnee.push(
                        {
                            user: CA.prenomControleur + ' ' + CA.nomControleur,
                            role: app.getRefLabel('refRoles', CA.roleControleur), //((app.isManagerDCV(CA.roleControleur)) ? 'Manager' : 'Contrôleur'),
                            DDRreglees: CA.nbDdrRegleeAgenceAn,
                            DDReligibles: CA.nbDdrEligibleControleDate,
                            DDReligiblesMinima: CA.nbDdrEligibleControleAcr,
                            DDRnonAffectees: CA.nbDdrNonEligible,
                            DDRaffectees: CA.nbTotalDdrAffectee,
                            DDRcontrolees: CA.nbTotalDdrControlee,
                            avancee: CA.globalAvanceObjDate?.toFixed(2),
                            tendance: CA.tendanceAvanceObjDate
                        }
                    );
                }
            }
        }

        //controleurs par mois et totaux
        this.totalDDRaffectees = 0;
        this.totalDDRcontrolees = 0;
        this.totalobjectif = 0;
        this.totaltauxControle = 0;
        this.dataDetailMois = [];
        if (pilotage.pilotageDcvDetailControleurMois != null && pilotage.pilotageDcvDetailControleurMois.length > 0) {
            for (var CM of pilotage.pilotageDcvDetailControleurMois) {
                if (this.isManagerDCV || (!this.isManagerDCV && userName.toLowerCase() == (CM.prenomControleur + ' ' + CM.nomControeleur).toLowerCase())) {
                    this.dataDetailMois.push(
                        {
                            user: CM.prenomControleur + ' ' + CM.nomControeleur,
                            role: app.getRefLabel('refRoles', CM.roleControleur),
                            DDRaffectees: '',
                            DDRcontrolees: CM.nbDdrControle,
                            objectif: CM.objectifControleMensuel,
                            tauxControle: ((CM == null || CM.tauxControle == null) ? '0.00' : CM.tauxControle?.toFixed(2))
                        }
                    );

                    this.totalDDRcontrolees += CM.nbDdrControle;
                    this.totalobjectif += CM.objectifControleMensuel;
                    this.totaltauxControle += CM.tauxControle;
                }
            }

            this.totaltauxControle = (this.totaltauxControle / pilotage.pilotageDcvDetailControleurMois.length).toFixed(2);
        }
    }
}