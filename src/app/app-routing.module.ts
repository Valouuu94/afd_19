import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUtilisateursComponent } from './pages/admin-utilisateurs/admin-utilisateurs.component';
import { AvanceComponent } from './pages/avance/avance.component';
import { DocumentContractuelComponent } from './pages/documentContractuel/documentContractuel.component';
import { ParamControlesComponent } from './pages/param-controles/param-controles.component';
import { ParamCriteresComponent } from './pages/param-criteres/param-criteres.component';
import { RefsComponent } from './pages/refs/refs.component';
import { ReglementControlesComponent } from './pages/reglement-controles/reglement-controles.component';
import { ReglementComponent } from './pages/reglement/reglement.component';
import { TachesComponent } from './pages/taches/taches.component';
import { VersementControlesComponent } from './pages/versement-controles/versement-controles.component';
import { VersementReglementsComponent } from './pages/versement-reglements/versement-reglements.component';
import { VersementComponent } from './pages/versement/versement.component';
import { VersementsComponent } from './pages/versements/versements.component';
import { ParamAnomaliesComponent } from './pages/param-anomalies/param-anomalies.component';
import { AnomalieComponent } from './pages/anomalie/anomalie.component';
import { ParamThemesComponent } from './pages/param-themes/param-themes.component';
import { PilotagePerimetreComponent } from './pages/pilotage-perimetre/pilotage-perimetre.component';
import { HistoriqueDossiersComponent } from './pages/historique-dossiers/historique-dossiers.component';
import { HistoriqueAnomaliesComponent } from './pages/historique-anomalies/historique-anomalies.component';
import { HistoriqueAnomaliesRajComponent } from './pages/historique-anomalies-raj/historique-anomalies-raj.component';
import { PilotageDDRComponent } from './pages/pilotage-ddr/pilotage-ddr.component';
import { AvanceContractuelControlesComponent } from './pages/avance-contractuel-controles/avance-contractuel-controles.component';
import { ReportingComponent } from './pages/reporting/reporting.component';
import { PilotageAffectationDossiersComponent } from './pages/pilotage-affectation-dossiers/pilotage-affectation-dossiers.component';
import { PilotageReglesComponent } from './pages/pilotage-regles/pilotage-regles.component';
import { AdminHabilitationsComponent } from './pages/admin-habilitations/admin-habilitations.component';
import { AuditComponent } from './pages/audit/audit.component';
import { AdminTachesComponent } from './pages/admin-taches/admin-taches.component';
import { ProjetsComponent } from './pages/projets/projets.component';
import { JustificatifRemboursementComponent } from './pages/justificatif-remboursement/justificatif-remboursement.component';
import { AdminOrganisationComponent } from './pages/admin-organisation/admin-organisation.component';
import { HistoriqueDossiersRajComponent } from './pages/historique-dossiers-raj/historique-dossiers-raj.component';

const routes: Routes = [
	{ path: '', redirectTo: 'taches', pathMatch: 'full' },
	{ path: 'taches', component: TachesComponent },
	{ path: 'projets', component: ProjetsComponent },
	{ path: 'projets/:numProjet', component: ProjetsComponent },
	{ path: 'projets/:numProjet/:numConcours', component: ProjetsComponent },
	{ path: 'projets/:numProjet/type/:type', component: ProjetsComponent },
	{ path: 'versements', component: VersementsComponent },
	{ path: 'versement/:id', component: VersementComponent },
	{ path: 'versement/:id/reglements', component: VersementReglementsComponent },
	{ path: 'versement/:id/controles', component: VersementControlesComponent },
	{ path: 'reglement/:id', component: ReglementComponent },
	{ path: 'reglement/add/:idVersement', component: ReglementComponent },
	{ path: 'reglement/:id/controles', component: ReglementControlesComponent },
	{ path: 'justificatifRemboursement/add/:idReglement', component: JustificatifRemboursementComponent },
	{ path: 'param/controles', component: ParamControlesComponent },
	{ path: 'param/criteres', component: ParamCriteresComponent },
	{ path: 'param/anomalies', component: ParamAnomaliesComponent },
	{ path: 'param/themes', component: ParamThemesComponent },
	{ path: 'refs/:type', component: RefsComponent },
	{ path: 'avanceContractuel/add', component: AvanceComponent },
	{ path: 'documentContractuel/add', component: DocumentContractuelComponent },
	{ path: 'documentContractuel/:id', component: DocumentContractuelComponent },
	{ path: 'avanceContractuel/:id', component: AvanceComponent },
	{ path: 'admin/utilisateurs', component: AdminUtilisateursComponent },
	{ path: 'admin/habilitations', component: AdminHabilitationsComponent },
	{ path: 'admin/taches', component: AdminTachesComponent },
	{ path: 'admin/organisation', component: AdminOrganisationComponent },
	{ path: 'pilotage/regles', component: PilotageReglesComponent },
	{ path: 'pilotage/dossiers', component: PilotageAffectationDossiersComponent },
	{ path: 'pilotage/perimetre', component: PilotagePerimetreComponent },
	{ path: 'pilotage/ddr', component: PilotageDDRComponent },
	{ path: 'historique/dossiers', component: HistoriqueDossiersComponent },
	{ path: 'historique/dossier/:id', component: ReglementControlesComponent },
	{ path: 'historique/anomalies', component: HistoriqueAnomaliesComponent },
	{ path: 'avanceContractuel/:id/controles', component: AvanceContractuelControlesComponent },
	{ path: 'reporting', component: ReportingComponent },
	{ path: 'reporting/audit', component: AuditComponent },
	{ path: 'audit', component: AuditComponent },
	{ path: 'historique/dossiersRaj', component: HistoriqueDossiersRajComponent },
	{ path: 'historique/dossiersRaj/:id', component: AvanceContractuelControlesComponent },
	{ path: 'historique/anomaliesRaj', component: HistoriqueAnomaliesRajComponent },
	{ path: 'anomalie/:id/:type', component: AnomalieComponent },
	{ path: 'historique/anomalie/:id/:type', component: AnomalieComponent },
	//TODO { path: '**', component: NotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }