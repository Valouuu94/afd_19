import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { NavComponent } from './components/nav/nav.component';
import { TachesComponent } from './pages/taches/taches.component';
import { ContentComponent } from './components/content/content.component';
import { VersementsComponent } from './pages/versements/versements.component';
import { TableComponent } from './components/table/table.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { BtnComponent } from './components/btn/btn.component';
import { RowComponent } from './components/row/row.component';
import { CommentsComponent } from './components/comments/comments.component';
import { VersementComponent } from './pages/versement/versement.component';
import { AutreDeviseComponent } from './components/autre-devise/autre-devise.component';
import { InfosBeneficiaireComponent } from './components/infos-beneficiaire/infos-beneficiaire.component';
import { InfosCoordonneBancaireComponent } from './components/infos-coordonnee-bancaire/infos-coordonnee-bancaire.component';
import { SelectBeneficiaireComponent } from './components/select-beneficiaire/select-beneficiaire.component';
import { InfosConcoursComponent } from './components/infos-concours/infos-concours.component';
import { TeleportComponent } from './components/teleport/teleport.component';
import { ControlesComponent } from './components/controles/controles.component';
import { InfosReglementComponent } from './components/infos-reglement/infos-reglement.component';
import { InfosVersementComponent } from './components/infos-versement/infos-versement.component';
import { InfosDossierComponent } from './components/infos-dossier/infos-dossier.component';
import { InfosAvanceComponent } from './components/infos-avance/infos-avance.component';
import { InfosDcComponent } from './components/infos-dc/infos-dc.component';
import { TypeAvanceComponent } from './components/type-avance/type-avance.component';
import { VersementControlesComponent } from './pages/versement-controles/versement-controles.component';
import { VersementReglementsComponent } from './pages/versement-reglements/versement-reglements.component';
import { ReglementComponent } from './pages/reglement/reglement.component';
import { ReglementControlesComponent } from './pages/reglement-controles/reglement-controles.component';
import { RefsComponent } from './pages/refs/refs.component';
import { AvanceComponent } from './pages/avance/avance.component';
import { ParamControlesComponent } from './pages/param-controles/param-controles.component';
import { ParamCriteresComponent } from './pages/param-criteres/param-criteres.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DocumentContractuelComponent } from './pages/documentContractuel/documentContractuel.component';
import { AdminUtilisateursComponent } from './pages/admin-utilisateurs/admin-utilisateurs.component';
import { NavActionsComponent } from './components/nav-actions/nav-actions.component';
import { ParamAnomaliesComponent } from './pages/param-anomalies/param-anomalies.component';
import { AnomalieComponent } from './pages/anomalie/anomalie.component';
import { ParamThemesComponent } from './pages/param-themes/param-themes.component';
import { UtilisateurAdhesionComponent } from './pages/admin-utilisateurs/utilisateur-adhesion/utilisateur-adhesion.component';
import { FormatNumberInput } from './directives/format-number/formatNumberInput';
import { PilotagePerimetreComponent } from './pages/pilotage-perimetre/pilotage-perimetre.component';
import { HistoriqueDossiersComponent } from './pages/historique-dossiers/historique-dossiers.component';
import { HistoriqueAnomaliesComponent } from './pages/historique-anomalies/historique-anomalies.component';
import { PilotageDDRComponent } from './pages/pilotage-ddr/pilotage-ddr.component';
import { BtnMenuComponent } from './components/btnMenu/btnMenu.component';
import { ContreValeurComponent } from './components/contre-valeur/contre-valeur.component';
import { InfosContextComponent } from './components/infos-context/infos-context.component';
import { AvanceContractuelControlesComponent } from './pages/avance-contractuel-controles/avance-contractuel-controles.component';
import { ReportingComponent } from './pages/reporting/reporting.component';
import { PilotageAffectationDossiersComponent } from './pages/pilotage-affectation-dossiers/pilotage-affectation-dossiers.component';
import { PilotageReglesComponent } from './pages/pilotage-regles/pilotage-regles.component';
import { HistoriqueDossiersRajComponent } from './pages/historique-dossiers-raj/historique-dossiers-raj.component';
import { AdminHabilitationsComponent } from './pages/admin-habilitations/admin-habilitations.component';
import { ExportPdfComponent } from './components/export-pdf/export-pdf.component';
import { ExportPdfBanComponent } from './components/export-pdf-ban/export-pdf-ban.component';
import { ExportPdfControleComponent } from './components/export-pdf-controle/export-pdf-controle.component';
import { AuditComponent } from './pages/audit/audit.component';
import { AdminTachesComponent } from './pages/admin-taches/admin-taches.component';
import { ExportExcelComponent } from './components/export-excel/export-excel.component';
import { ProjetsComponent } from './pages/projets/projets.component';
import { HistoriqueAnomaliesRajComponent } from './pages/historique-anomalies-raj/historique-anomalies-raj.component';
import { RubriquesComponent } from './components/rubriques/rubriques.component';
import { JustificatifRemboursementComponent } from './pages/justificatif-remboursement/justificatif-remboursement.component';
import { AdminOrganisationComponent } from './pages/admin-organisation/admin-organisation.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        CardComponent,
        NavComponent,
        TachesComponent,
        ContentComponent,
        VersementsComponent,
        TableComponent,
        SpinnerComponent,
        ModalComponent,
        BtnComponent,
        RowComponent,
        CommentsComponent,
        VersementComponent,
        AutreDeviseComponent,
        InfosBeneficiaireComponent,
        InfosCoordonneBancaireComponent,
        SelectBeneficiaireComponent,
        InfosConcoursComponent,
        TeleportComponent,
        ControlesComponent,
        InfosReglementComponent,
        InfosVersementComponent,
        InfosDossierComponent,
        InfosAvanceComponent,
        TypeAvanceComponent,
        VersementControlesComponent,
        VersementReglementsComponent,
        ReglementComponent,
        ReglementControlesComponent,
        RefsComponent,
        AvanceComponent,
        ParamControlesComponent,
        ParamCriteresComponent,
        NotificationComponent,
        ParamAnomaliesComponent,
        DocumentContractuelComponent,
        AdminUtilisateursComponent,
        NavActionsComponent,
        AnomalieComponent,
        ParamThemesComponent,
        UtilisateurAdhesionComponent,
        FormatNumberInput,
        PilotageReglesComponent,
        PilotagePerimetreComponent,
        HistoriqueDossiersComponent,
        HistoriqueAnomaliesComponent,
        PilotageDDRComponent,
        BtnMenuComponent,
        ContreValeurComponent,
        InfosContextComponent,
        AvanceContractuelControlesComponent,
        ReportingComponent,
        PilotageAffectationDossiersComponent,
        HistoriqueDossiersRajComponent,
        AdminHabilitationsComponent,
        ExportPdfComponent,
        ExportPdfBanComponent,
        ExportPdfControleComponent,
        AdminTachesComponent,
        AuditComponent,
        ExportExcelComponent,
        ProjetsComponent,
        HistoriqueAnomaliesRajComponent,
        RubriquesComponent,
        JustificatifRemboursementComponent,
        AdminOrganisationComponent,
        InfosDcComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
