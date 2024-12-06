import { Component, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { FormsModule } from '@angular/forms';
import { TeleportComponent  } from '../../components/teleport/teleport.component';
import { ExportExcelComponent  } from '../../components/export-excel/export-excel.component';
import { TableComponent  } from '../../components/table/table.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CardComponent } from '../../components/card/card.component';
import { NgFor, NgIf } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;

@Component({
    selector: 'app-reporting',
    templateUrl: './reporting.component.html',
    standalone: true,
    imports: [ContentComponent, NgFor, CardComponent, ModalComponent, NgIf, SpinnerComponent, TableComponent, ExportExcelComponent, TeleportComponent, FormsModule]
})
export class ReportingComponent implements OnInit {

	readonly modalFiltres = viewChild.required<ModalComponent>('modalFiltres');
	readonly reporting = viewChild.required<ExportExcelComponent>('reporting');
	readonly teleportReportingTiers = viewChild.required<TeleportComponent>('teleportReportingTiers');
	readonly tableTiers = viewChild.required<TableComponent>('tableTiers');

	reports: any = [];
	rows: any = [];
	lang: any = lang;
	loading: boolean = false;
	selectedType: any;
	titleModal: any;
	controleurs: any;
	isDcv: boolean = false;
	listTiers: any;
	tiersSelected: any;
	tiersSelectedLabel: string = '';

	constructor(private router: Router, private store: StoreService) { }

	ngOnInit() {
		this.reports = [
			{ label: lang.reporting.reportingDDR.title, type: 'reportingDDR' },
			{ label: lang.reporting.volumetriesDvEtDdr.title, type: 'volumetriesDvEtDdr' },
			{ label: lang.reporting.concoursRaj.title, type: 'concoursRaj' },
			{ label: lang.reportingListeAvance.title, type: 'reportingListeAvance' },
			{ label: lang.reportingPaiementTiers.title, type: 'reportingPaiementTiers' },
			{ label: lang.reportingPaiementDocContractuel.title, type: 'reportingPaiementDocContractuel' },
			{ label: lang.reporting.dcByTiers.title, type: 'dcByTiers' },
			{ label: lang.reporting.ravByConcours.title, type: 'ravByConcours' },
			{ label: lang.reportingRemboursement.title, type: 'reportingRemboursements' }
		];

		this.isDcv = (app.isDCV(this.store.getUserEntite(), this.store.getUserPerimetre()));
		var isRA = (app.isRA(this.store.getUserRole()));

		if (this.isDcv || isRA) {
			this.reports.push({ label: lang.reporting.volumetriesAnos.title, type: 'volumetriesAnos' });
			this.reports.push({ label: lang.reporting.volumetriesDC.title, type: 'volumetriesDC' });
			this.reports.push({ label: lang.reporting.ctlRAJDossierControle.title, type: 'ctlRAJDossierControle' });
			this.reports.push({ label: lang.reporting.ctlRAJAnomalie.title, type: 'ctlRAJAnomalie' });
		}
	}

	async showModalFiltres(type: any) {
		this.tiersSelected = '';
		this.tiersSelectedLabel = '';
		this.teleportReportingTiers().unteleport();

		app.cleanDiv('formio_filtresVolumetries');
		app.cleanDiv('formio_filtresDDR');
		app.cleanDiv('formio_filtresAnomalies');
		app.cleanDiv('formio_filtresDC');
		app.cleanDiv('formio_filtresVolumetrieAnomalie');
		app.cleanDiv('formio_filtresVolumetrieDossierControle');
		app.cleanDiv('formio_filtresConcoursRaj');
		app.cleanDiv('formio_filtresListeAvance');
		app.cleanDiv('formio_filtresPaiementTiers');
		app.cleanDiv('formio_filtresPaiementDocContractuel');
		app.cleanDiv('formio_filtresDCTiers');
		app.cleanDiv('formio_filtresConcoursRAV');
		app.cleanDiv('formio_filtresRemboursements');

		this.selectedType = type;
		this.loading = true;

		app.showModal('modalFiltres');

		await app.sleep(100);

		await app.getExternalData(app.getUrl('urlGetAuthorization'), 'giveMeAuthorization > getAuthorization');

		if (type == 'reportingDDR') {
			var divisions;
			if (app.isAFD(this.store.getUserEntite()))
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'C'), 'divisions > getDivisions');
			else
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'P'), 'divisions > getDivisions');

			divisions = app.getArrayWithoutDuplicate(divisions, null, 'idDivisionService');
			app.setRef(divisions, 'divisions_ddr', 'idDivisionService', ['idDivisionService', 'libelleCourtDivisionService']);

			var modalitesPaiement = app.getRef('refModalitesPaiement');
			modalitesPaiement = app.getArrayWithoutDuplicate(modalitesPaiement, null, 'nomModalite');
			app.setRef(modalitesPaiement, 'modalitesPaiements', 'nomModalite', 'libelleModalite');

			appFormio.loadFormIO('filtresDDR');
			this.titleModal = lang.reporting.titleModal.filtresDDR;

			this.teleportReportingTiers().teleport();
			this.teleportReportingTiers().show();
		} else if (type == 'volumetriesDvEtDdr') {
			var divisions;
			if (app.isAFD(this.store.getUserEntite()))
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'C'), 'divisions > getDivisions');
			else
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'P'), 'divisions > getDivisions');

			divisions = app.getArrayWithoutDuplicate(divisions, null, 'idDivisionService');
			app.setRef(divisions, 'divisions_vol', 'idDivisionService', ['idDivisionService', 'libelleCourtDivisionService']);

			var dirReg = await app.getExternalData(app.getUrl('urlGetDirectionsRegionales'), 'reporting > volumetriesDvEtDdr > getDirRegs');
			app.setRef(dirReg, 'dirReg_vol', 'codeFonctionnelAgenceGestion', 'libelleCourtAgenceGestion');

			var modalitesPaiement = app.getRef('refModalitesPaiement');
			modalitesPaiement = app.getArrayWithoutDuplicate(modalitesPaiement, null, 'nomModalite');
			app.setRef(modalitesPaiement, 'modalites_paiements_vol', 'nomModalite', 'libelleModalite');

			appFormio.loadFormIO('filtresVolumetries');
			this.titleModal = lang.reporting.titleModal.filtresVolumetries;
		} else if (type == 'volumetriesAnos') {
			var modalitesPaiement = app.getArrayWithoutDuplicate(app.getRef('refModalitesPaiement'), null, 'nomModalite');
			app.setRef(modalitesPaiement, 'modalites_paiements_ano', 'nomModalite', 'libelleModalite');

			this.controleurs = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'controleurs 2nd niveau > getControleursDCV');
			app.setRef(this.controleurs, 'controleurs', 'idUtilisateur', ['prenom', 'nom']);

			var controleur = app.getRef("controleurs");

			for (var controleur of controleur)
				controleur.label = controleur.label.replace("- ", "");

			appFormio.loadFormIO('filtresAnomalies');
			this.titleModal = lang.reporting.titleModal.filtresAnomalies;
		} else if (type == 'volumetriesDC') {
			var modalitesPaiement = app.getRef('refModalitesPaiement');
			modalitesPaiement = app.getArrayWithoutDuplicate(modalitesPaiement, null, 'nomModalite');
			app.setRef(modalitesPaiement, 'modalites_paiements_dc', 'nomModalite', 'libelleModalite');

			this.controleurs = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'controleurs 2nd niveau > getControleursDCV');
			app.setRef(this.controleurs, 'controleurs', 'idUtilisateur', ['prenom', 'nom']);

			var controleur = app.getRef("controleurs");

			for (var controleur of controleur)
				controleur.label = controleur.label.replace("- ", "");

			appFormio.loadFormIO('filtresDC');
			this.titleModal = lang.reporting.titleModal.filtresDC;
		} else if (type == 'ctlRAJDossierControle') {
			this.controleurs = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'controleurs 2nd niveau > getControleursDCV');
			app.setRef(this.controleurs, 'controleurs', 'idUtilisateur', ['prenom', 'nom']);

			var controleur = app.getRef("controleurs");

			for (var controleur of controleur)
				controleur.label = controleur.label.replace("- ", "");

			appFormio.loadFormIO('filtresVolumetrieDossierControle');
			this.titleModal = lang.reporting.titleModal.filtresVolumetrieDossierControle
		} else if (type == 'ctlRAJAnomalie') {
			this.controleurs = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'controleurs 2nd niveau > getControleursDCV');
			app.setRef(this.controleurs, 'controleurs', 'idUtilisateur', ['prenom', 'nom']);

			var controleur = app.getRef("controleurs");

			for (var controleur of controleur)
				controleur.label = controleur.label.replace("- ", "");

			appFormio.loadFormIO('filtresVolumetrieAnomalie');
			this.titleModal = lang.reporting.titleModal.filtresVolumetrieAnomalie;
		} else if (type == 'concoursRaj') {
			var divisions;
			if (app.isAFD(this.store.getUserEntite()))
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'C'), 'divisions > getDivisions');
			else
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'P'), 'divisions > getDivisions');

			divisions = app.getArrayWithoutDuplicate(divisions, null, 'idDivisionService');
			app.setRef(divisions, 'divisions_cr', 'idDivisionService', ['idDivisionService', 'libelleCourtDivisionService']);

			appFormio.loadFormIO('filtresConcoursRaj');
			this.titleModal = lang.reporting.titleModal.filtresConcoursRaj;
		} else if (type == 'reportingListeAvance') {
			var divisions;
			if (app.isAFD(this.store.getUserEntite()))
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'C'), 'divisions > getDivisions');
			else
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'P'), 'divisions > getDivisions');

			divisions = app.getArrayWithoutDuplicate(divisions, null, 'idDivisionService');
			app.setRef(divisions, 'divisions_av', 'idDivisionService', ['idDivisionService', 'libelleCourtDivisionService']);

			appFormio.loadFormIO('filtresListeAvance');
			this.titleModal = lang.reporting.titleModal.filtresListeAvance;
		}
		else if (type == 'reportingPaiementTiers') {
			appFormio.loadFormIO('filtresPaiementTiers');
			this.titleModal = lang.reporting.titleModal.filtresPaiementTiers;

			this.teleportReportingTiers().teleport();
			this.teleportReportingTiers().show();
		}
		else if (type == 'reportingPaiementDocContractuel') {
			appFormio.loadFormIO('filtresPaiementDocContractuel');
			this.titleModal = lang.reporting.titleModal.filtresPaiementDocContractuel;
		} else if (type == 'dcByTiers') {
			appFormio.loadFormIO('filtresDCTiers');
			this.titleModal = lang.reporting.titleModal.filtresDCTiers;

			this.teleportReportingTiers().teleport();
			this.teleportReportingTiers().show();
		} else if (type == 'ravByConcours') {
			var divisions;
			if (app.isAFD(this.store.getUserEntite()))
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'C'), 'divisions > getDivisions');
			else
				divisions = await app.getExternalData(app.getUrl('urlGetDivisionsBySociete', 'P'), 'divisions > getDivisions');

			divisions = app.getArrayWithoutDuplicate(divisions, null, 'idDivisionService');
			app.setRef(divisions, 'divisions_rav', 'idDivisionService', ['idDivisionService', 'libelleCourtDivisionService']);

			appFormio.loadFormIO('filtresConcoursRAV');
			this.titleModal = lang.reporting.titleModal.filtresConcoursRAV;
		}
		else if (type == 'reportingRemboursements') {
			appFormio.loadFormIO('filtresRemboursements');
			this.titleModal = lang.reporting.titleModal.filtresRemboursements;

			this.teleportReportingTiers().teleport();
			this.teleportReportingTiers().show();
		}

		this.loading = false;
	}

	async exportExcel(type: any) {
		//Liste des reglements
		var entite = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'entite_ddr');
		var pays = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'pays_ddr');
		var modalitePaiement = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'modalite_paiement_ddr');
		var beneficiaire = (!app.isEmpty(this.tiersSelected)) ? this.tiersSelected.code : '';
		var projetFiltre = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'projet_ddr');
		var concoursFiltre = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'concours_ddr');
		var dateDebCreation = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'date_debut_creation_ddr');
		var dateFinCreation = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'date_fin_creation_ddr');
		var statuts = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'statuts_ddr');
		var agence = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'agence_gestion_ddr');
		var familleProduit = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'famille_produit_ddr');
		var division = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'division_ddr');
		var dep = appFormio.getDataValue(crossVars.forms['formio_filtresDDR'], 'departement_ddr');

		//Volumetries => versements/reglements
		var societe = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'societe_vol');
		var agenceV = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'agence_gestion_vol');
		var familleProduitV = app.getRefLabel('refFamillesProduits', appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'famille_produit_vol'));
		var divisionV = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'division_vol');
		var modalitePaiementV = app.getRefLabel('refModalitesPaiement', appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'modalite_paiement_vol'));
		var paysV = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'pays_vol');
		var dateDebVol = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'date_debut_vol'));
		var dateFinVol = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'date_fin_vol'));
		var famPdtCode = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'famille_produit_vol');
		var modPmtCode = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'modalite_paiement_vol');
		var directionRegionaleV = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetries'], 'direction_regionale_vol');

		//Volumetries => anomalies
		var statutsAno = appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'statuts');
		var agenceAno = appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'agences');
		var controleurAno = appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'controleur');
		var regularisabelAno = appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'regularisable');
		var modalitePaiementAno = appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'modalite_paiement');
		var dateDebAno = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'date_debut'));
		var dateFinAno = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresAnomalies'], 'date_fin'));

		//Volumetries => dossiers de contrôles
		var statutsDC = appFormio.getDataValue(crossVars.forms['formio_filtresDC'], 'statuts');
		var dateDebDC = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresDC'], 'date_debut'));
		var dateFinDC = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresDC'], 'date_fin'));
		var agenceDC = appFormio.getDataValue(crossVars.forms['formio_filtresDC'], 'agences');
		var controleurDC = appFormio.getDataValue(crossVars.forms['formio_filtresDC'], 'controleur');
		var modalitePaiementDC = appFormio.getDataValue(crossVars.forms['formio_filtresDC'], 'modalite_paiement');

		//Volumétrie des contrôles RAJ - Dossier de contrôle RAJ
		var agenceGestionControleRajDC = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'agence_gestion');
		var controleurEnChargeControleRajDC = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'controleur_en_charge');
		var concoursControleRajDC = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'concours');
		var statutControleRajDC = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'statut');
		var typeAvanceControleRajDC = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'type_avance');
		var typeControleRajDC = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'typeControleRaj');
		var dateDebControleRajDC = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'date_debut_creation_controle'));
		var dateFinControleRajDC = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieDossierControle'], 'date_fin_creation_controle'));

		//Volumétrie des contrôles RAJ - Anomalies  RAJ
		var agenceGestionControleRajAno = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'agence_gestion');
		var statutControleRajAno = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'statut');
		var controleurEnChargeControleRajAno = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'controleur_en_charge');
		var concoursControleRajAno = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'concours');
		var dateDebControleRajAno = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'date_debut_creation_controle'));
		var dateFinControleRajAno = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'date_fin_creation_controle'));
		var typeControleRajAno = appFormio.getDataValue(crossVars.forms['formio_filtresVolumetrieAnomalie'], 'typeControleRaj');

		//Liste concours raj > 0
		var societeCr = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRaj'], 'societe_cr');
		var paysCr = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRaj'], 'pays_cr');
		var agenceCr = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRaj'], 'agence_cr');
		var divisionCr = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRaj'], 'division_cr');

		//Reporting liste des avances 
		var typeAvanceRla = appFormio.getDataValue(crossVars.forms['formio_filtresListeAvance'], 'type_avance');
		var societeRla = appFormio.getDataValue(crossVars.forms['formio_filtresListeAvance'], 'societe');
		var paysRla = appFormio.getDataValue(crossVars.forms['formio_filtresListeAvance'], 'pays');
		var agenceGestionRla = appFormio.getDataValue(crossVars.forms['formio_filtresListeAvance'], 'agence_gestion');
		var directionRegionalRla = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresListeAvance'], 'direction_regionnale'));
		var divisionTechniqueRla = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresListeAvance'], 'division_av'));

		//Reporting liste des paiements réalisés sur un tiers 
		var tiers = (!app.isEmpty(this.tiersSelected)) ? this.tiersSelected.code : '';
		var projet = appFormio.getDataValue(crossVars.forms['formio_filtresPaiementTiers'], 'projet');
		var marche = appFormio.getDataValue(crossVars.forms['formio_filtresPaiementTiers'], 'marche');

		//Reporting liste des paiements réalisés sur un document contractuel 
		var projetdc = appFormio.getDataValue(crossVars.forms['formio_filtresPaiementDocContractuel'], 'projet');
		var paysdc = appFormio.getDataValue(crossVars.forms['formio_filtresPaiementDocContractuel'], 'pays');
		var agencegestiondc = appFormio.getDataValue(crossVars.forms['formio_filtresPaiementDocContractuel'], 'agencegestion');
		var dateCreationdc = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresPaiementDocContractuel'], 'date_creation_dc'));
		var dateModificationdc = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresPaiementDocContractuel'], 'date_modification_dc'));

		//Liste des contrats d'un tiers
		var tiersDC = this.tiersSelectedLabel;

		//Liste des RAV par concours
		var societeRav = app.getRefLabel('refEntites', appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'societe_rav'));
		var paysRav = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'pays_rav');
		var projetRav = app.getRefLabel('projets_ddr', appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'projet_rav'));
		var concoursRav = app.getRefLabel('concours_ddr', appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'concours_rav'));
		var agenceRav = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'agence_rav');
		var divisionRav = appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'division_rav');
		var dateDebRav = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'date_debut_rav'));
		var dateFinRav = app.formatDate(appFormio.getDataValue(crossVars.forms['formio_filtresConcoursRAV'], 'date_fin_rav'));

		// Reporting liste des remboursements 
		var typeRemboursement = appFormio.getDataValue(crossVars.forms['formio_filtresRemboursements'], 'typeremboursements');
		var beneficiaireRemboursement = (!app.isEmpty(this.tiersSelected)) ? this.tiersSelected.code : '';
		var projetRemboursement = appFormio.getDataValue(crossVars.forms['formio_filtresRemboursements'], 'projet');
		var concoursRemboursement = appFormio.getDataValue(crossVars.forms['formio_filtresRemboursements'], 'concours');
		var agenceGestionRemboursement = appFormio.getDataValue(crossVars.forms['formio_filtresRemboursements'], 'agencegestion');
		var paysRemboursement = appFormio.getDataValue(crossVars.forms['formio_filtresRemboursements'], 'pays');

		var filtresSocietes = "";
		var filtresFamPdts = "";
		var filtresModPmt = "";
		var filtresDiv = "";
		var filtresAg = "";
		var filtreDateDeb = "";
		var filtreDateFin = "";
		var filtresPays = "";
		var filtreDateDebAno = "";
		var filtreDateFinAno = "";
		var filtreDateDebDC = "";
		var filtreDateFinDC = "";
		var filtredateDebControleRajDC = "";
		var filtredateFinControleRajDC = "";
		var filtredateDebCreationAnomalieRaj = "";
		var filtredateFinCreationAnomalieRaj = "";
		var filtredatecreationDc = "";
		var filtredatemodifDc = "";
		var filtredateDebRav = "";
		var filtredateFinRav = "";
		var filtreDirectionRegionale = "";
		var filtreStatuts = "";
		var filtreStatutsDC = "";

		if (type == 'volumetriesDvEtDdr') {
			var lastSoc = societe.slice(-1);
			var lastFP = famPdtCode.slice(-1);
			var lastMP = modPmtCode.slice(-1);
			var lastDV = divisionV.slice(-1);
			var lastAg = agenceV.slice(-1);
			var lastPa = paysV.slice(-1);
			var lastDr = directionRegionaleV.slice(-1);

			for (var soc of societe)
				if (lastSoc != soc)
					filtresSocietes += soc + ",";
				else filtresSocietes += soc;

			for (var fam of famPdtCode)
				if (lastFP != fam)
					filtresFamPdts += fam + ",";
				else filtresFamPdts += fam;

			for (var modPmt of modPmtCode)
				if (lastMP != modPmt)
					filtresModPmt += modPmt + ",";
				else filtresModPmt += modPmt;

			for (var div of divisionV)
				if (lastDV != div)
					filtresDiv += div + ",";
				else filtresDiv += div;

			for (var ag of agenceV)
				if (lastAg != ag)
					filtresAg += ag + ",";
				else filtresAg += ag;

			for (var pa of paysV)
				if (lastPa != pa)
					filtresPays += pa + ",";
				else filtresPays += pa;

			for (var dr of directionRegionaleV)
				if (lastDr != dr)
					filtreDirectionRegionale += dr + ",";
				else filtreDirectionRegionale += dr;

			var datesDeb = app.isNotEmpty(dateDebVol) ? dateDebVol.split("/") : '';
			var datesFin = app.isNotEmpty(dateFinVol) ? dateFinVol.split("/") : '';

			if (datesDeb != '')
				filtreDateDeb += datesDeb[2] + "-" + datesDeb[1] + "-" + datesDeb[0];
			else filtreDateDeb += '';

			if (datesFin != '')
				filtreDateFin += datesFin[2] + "-" + datesFin[1] + "-" + datesFin[0];
			else filtreDateFin += '';
		} else if (type == 'volumetriesAnos') {
			var datesDebAno = app.isNotEmpty(dateDebAno) ? dateDebAno.split("/") : '';
			var datesFinAno = app.isNotEmpty(dateFinAno) ? dateFinAno.split("/") : '';

			if (datesDebAno != '')
				filtreDateDebAno += datesDebAno[2] + "-" + datesDebAno[1] + "-" + datesDebAno[0];
			else filtreDateDebAno += '';

			if (datesFinAno != '')
				filtreDateFinAno += datesFinAno[2] + "-" + datesFinAno[1] + "-" + datesFinAno[0];
			else filtreDateFinAno += '';
		} else if (type == 'volumetriesDC') {
			var datesDebDC = app.isNotEmpty(dateDebDC) ? dateDebDC.split("/") : '';
			var datesFinDC = app.isNotEmpty(dateFinDC) ? dateFinDC.split("/") : '';

			if (datesDebDC != '')
				filtreDateDebDC += datesDebDC[2] + "-" + datesDebDC[1] + "-" + datesDebDC[0];
			else filtreDateDebDC += '';

			if (datesFinDC != '')
				filtreDateFinDC += datesFinDC[2] + "-" + datesFinDC[1] + "-" + datesFinDC[0];
			else filtreDateFinDC += '';

			//modifs ANO2926
			if (statutsDC == 'ABANDDOSSMAX' || statutsDC == 'ATTRAVECRMAX')
				filtreStatutsDC = statutsDC + ',' + 'ATTRAVECRMAX' + ',' + 'ATTRAVECR';
			else
				filtreStatutsDC = statutsDC;
		} else if (type == 'ctlRAJDossierControle') {
			var datesDebDC = app.isNotEmpty(dateDebControleRajDC) ? dateDebControleRajDC.split("/") : '';
			var datesFinDC = app.isNotEmpty(dateFinControleRajDC) ? dateFinControleRajDC.split("/") : '';

			if (datesDebDC != '')
				filtredateDebControleRajDC += datesDebDC[2] + "-" + datesDebDC[1] + "-" + datesDebDC[0];
			else filtredateDebControleRajDC += '';

			if (datesFinDC != '')
				filtredateFinControleRajDC += datesFinDC[2] + "-" + datesFinDC[1] + "-" + datesFinDC[0];
			else filtredateFinControleRajDC += '';
		} else if (type == 'ctlRAJAnomalie') {
			var datesDebDC = app.isNotEmpty(dateDebControleRajAno) ? dateDebControleRajAno.split("/") : '';
			var datesFinDC = app.isNotEmpty(dateFinControleRajAno) ? dateFinControleRajAno.split("/") : '';

			if (datesDebDC != '')
				filtredateDebCreationAnomalieRaj += datesDebDC[2] + "-" + datesDebDC[1] + "-" + datesDebDC[0];
			else filtredateDebCreationAnomalieRaj += '';

			if (datesFinDC != '')
				filtredateFinCreationAnomalieRaj += datesFinDC[2] + "-" + datesFinDC[1] + "-" + datesFinDC[0];
			else filtredateFinCreationAnomalieRaj += '';
		}
		else if (type == 'reportingPaiementDocContractuel') {
			var datesDebDC = app.isNotEmpty(dateCreationdc) ? dateCreationdc.split("/") : '';
			var datesFinDC = app.isNotEmpty(dateModificationdc) ? dateModificationdc.split("/") : '';

			if (datesDebDC != '')
				filtredatecreationDc += datesDebDC[2] + "-" + datesDebDC[1] + "-" + datesDebDC[0];
			else filtredatecreationDc += '';

			if (datesFinDC != '')
				filtredatemodifDc += datesFinDC[2] + "-" + datesFinDC[1] + "-" + datesFinDC[0];
			else filtredatemodifDc += '';
		} else if (type == 'ravByConcours') {
			var datesDebRav = app.isNotEmpty(dateDebRav) ? dateDebRav.split("/") : '';
			var datesFinRav = app.isNotEmpty(dateFinRav) ? dateFinRav.split("/") : '';

			if (datesDebRav != '')
				filtredateDebRav += datesDebRav[2] + "-" + datesDebRav[1] + "-" + datesDebRav[0];
			else filtredateDebRav += '';

			if (datesFinRav != '')
				filtredateFinRav += datesFinRav[2] + "-" + datesFinRav[1] + "-" + datesFinRav[0];
			else filtredateFinRav += '';
		} else if (type == 'reportingDDR') {
			for (var i = 0; i < statuts.length; i++) {
				if (i != 0)
					filtreStatuts += ',';
				filtreStatuts += statuts[i];
			}
		}

		var items;

		var dataToSendDDR = {
			"pSociete": entite,
			"pPays": pays,
			"pModalite": modalitePaiement,
			"pTiers": beneficiaire,
			"pProjet": projetFiltre,
			"pConcours": concoursFiltre,
			"pStatutDossier": filtreStatuts,
			"pAgence": agence,
			"pFamilleProduit": familleProduit,
			"pDivision": division,
			"pDepartement": dep,
			"pDateDebut": app.formatDate(dateDebCreation, true),
			"pDateFin": app.formatDate(dateFinCreation, true)
		};

		var dataToSendDVsDRs = {
			"pidutilisateur": this.store.getUserName(),
			"pfiltresociete": filtresSocietes,
			"pfiltrefamilleproduit": filtresFamPdts,
			"pfiltremodalitepaiement": filtresModPmt,
			"pfiltredivision": filtresDiv,
			"pfiltreagence": filtresAg,
			"pfiltrepays": filtresPays,
			"pfiltredatedebut": filtreDateDeb,
			"pfiltredatefin": filtreDateFin,
			"pfiltreDr": filtreDirectionRegionale
		};

		var dataToSendAnos = {
			'pStatut': statutsAno,
			'pAgence': agenceAno,
			'pActeur': controleurAno,
			'pModalitePaiement': modalitePaiementAno,
			'pRegularisable': regularisabelAno,
			'pDateDebut': filtreDateDebAno,
			'pDateFin': filtreDateFinAno
		};

		var dataToSendDossiers = {
			"pStatut": filtreStatutsDC,
			"pAgence": agenceDC,
			"pActeur": controleurDC,
			"pModalitePaiement": modalitePaiementDC,
			"pDateDebut": filtreDateDebDC,
			"pDateFin": filtreDateFinDC
		};

		var dataToSendControleRAJDossier = {
			"pagencegestion": agenceGestionControleRajDC,
			"pstatut": statutControleRajDC,
			"pcontroleurencharge": controleurEnChargeControleRajDC,
			"pconcours": concoursControleRajDC,
			"ptypecontroleraj": typeControleRajDC,
			"ptypeavance": typeAvanceControleRajDC,
			"pfiltredatecreation": filtredateDebControleRajDC,
			"pfiltredatemodification": filtredateFinControleRajDC,
		};

		var dataToSendControleRAJAnomalie = {
			"pagencegestion": agenceGestionControleRajAno,
			"pstatut": statutControleRajAno,
			"pcontroleurencharge": controleurEnChargeControleRajAno,
			"pconcours": concoursControleRajAno,
			"ptypecontroleraj": typeControleRajAno,
			"pfiltredatecreation": filtredateDebCreationAnomalieRaj,
			"pfiltredatemodification": filtredateFinCreationAnomalieRaj,
		};

		var dataToSendConcoursRaj = {
			"pSociete": app.getRefLabel('refEntites', societeCr),
			"pPays": paysCr,
			"pAgence": agenceCr,
			"pDivision": divisionCr
		}
		var dataToSendListeAvance = {
			"pfiltretypeavance": typeAvanceRla,
			"pfiltreentite": societeRla,
			"pfiltrepays": paysRla,
			"pfiltreagencegestion": agenceGestionRla,
			"pfiltredirectionregional": directionRegionalRla,
			"pfiltredivisiontechnique": divisionTechniqueRla
		};

		var dataToSendListePaiementTiers = {
			"pfiltretiers": tiers,
			"pfiltreprojet": projet,
			"pfiltremarche": marche
		};

		var dataToSendListePaiementDocContractuel = {
			"pfiltreprojet": projetdc,
			"pfiltrepays": paysdc,
			"pfiltreagencegestion": agencegestiondc,
			"pfiltredatecreation": filtredatecreationDc,
			"pfiltredatemodification": filtredatemodifDc
		};

		var dataTtoSendDCTiers = {
			"pTiers": tiersDC
		};

		var dataToSendRav = {
			'pSociete': societeRav,
			'pPays': paysRav,
			'pProjet': projetRav,
			'pConcours': concoursRav,
			'pAgence': agenceRav,
			'pDivision': divisionRav,
			'pDateDebut': filtredateDebRav,
			'pDateFin': filtredateFinRav
		};

		var dataToSendReportingRemboursement = {
			'ptypeRemboursement': typeRemboursement,
			'pbeneficiaire': beneficiaireRemboursement,
			'pprojet': projetRemboursement,
			'pconcours': concoursRemboursement,
			'pagenceGestion': agenceGestionRemboursement,
			'ppays': paysRemboursement
		};

		switch (type) {
			case 'reportingDDR':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetAllReglements'), dataToSendDDR);
				break;
			case 'volumetriesDvEtDdr':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetVolumetriesDVEtDDR'), dataToSendDVsDRs);
				break;
			case 'volumetriesAnos':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetVolumetriesCtlUnitAnos'), dataToSendAnos);
				break;
			case 'volumetriesDC':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetVolumetriesCtlUnitDossiers'), dataToSendDossiers);
				break;
			case 'ctlRAJDossierControle':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetVolumetriesControleRAJDossier'), dataToSendControleRAJDossier);
				break;
			case 'ctlRAJAnomalie':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetVolumetriesControleRAJAnomalie'), dataToSendControleRAJAnomalie);
				break;
			case 'concoursRaj':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetConcoursRaj'), dataToSendConcoursRaj);
				break;
			case 'reportingListeAvance':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetReportingListeAvance'), dataToSendListeAvance);
				break;
			case 'reportingPaiementTiers':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetListePaiementTiers'), dataToSendListePaiementTiers);
				break;
			case 'reportingPaiementDocContractuel':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetListePaiementDocContractuel'), dataToSendListePaiementDocContractuel);
				break;
			case 'dcByTiers':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetDCByTiers'), dataTtoSendDCTiers);
				break;
			case 'ravByConcours':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetConcoursRav'), dataToSendRav);
				break;
			case 'reportingRemboursements':
				items = await app.setExternalDataWithResult(app.getUrl('urlGetRemboursementsReporting'), dataToSendReportingRemboursement);
				break;
		}

		var filteredItems = [];

		switch (type) {
			case 'concoursRaj':
				for (var item of items) {
					item.raj = item.mntAvance - item.mntJustifieAv;

					if (item.division != null && item.division != "")
						item.division = item.division + " - " + app.getRefLabel('refDivisions', item.division);

					filteredItems.push(item);
				}
				break;
			case 'reportingPaiementTiers':
				for (var item of items) {
					item.montantrecu = item.montantrecu + '  ' + item.deviseregelement;
					item.montantcontrevaleur = item.montantcontrevaleur + '  ' + item.devisecontrevaleur;
					filteredItems.push(item);
				}
				break;
			default:
				for (var item of items)
					filteredItems.push(item);
				break;
		}

		this.rows = filteredItems;

		var statutsLib = "";
		var libSocietes = "";
		var libFamPdts = "";
		var libModPmt = "";
		var libDiv = "";
		var libAg = "";
		var libPa = "";

		if (type == 'reportingDDR') {
			var last = app.getRefLabel('refStatuts', statuts.slice(-1));

			for (var stat of statuts)
				if (last != app.getRefLabel('refStatuts', stat))
					statutsLib += app.getRefLabel('refStatuts', stat) + " / ";
				else statutsLib += app.getRefLabel('refStatuts', stat);
		} else if (type == 'volumetriesDvEtDdr') {
			var lastSoc = app.getRefLabel('refSocietes', societe.slice(-1));
			var lastFP = app.getRefLabel('refFamillesProduits', familleProduitV.slice(-1));
			var lastMP = app.getRefLabel('refModalitesPaiement', modalitePaiementV.slice(-1));
			var lastDV = app.getRefLabel('refDivisions', divisionV.slice(-1));
			var lastAg = app.getRefLabel('refAgencesGestions', agenceV.slice(-1));
			var lastPa = app.getRefLabel('refPays', paysV.slice(-1));

			for (var soc of societe)
				if (lastSoc != app.getRefLabel('refSocietes', soc))
					libSocietes += app.getRefLabel('refSocietes', soc) + " / ";
				else libSocietes += app.getRefLabel('refSocietes', soc);

			for (var fam of familleProduitV)
				if (lastFP != app.getRefLabel('refFamillesProduits', fam))
					libFamPdts += app.getRefLabel('refFamillesProduits', fam) + " / ";
				else libFamPdts += app.getRefLabel('refFamillesProduits', fam);

			for (var modPmt of modalitePaiementV)
				if (lastMP != app.getRefLabel('refModalitesPaiement', modPmt))
					libModPmt += app.getRefLabel('refModalitesPaiement', modPmt) + " / ";
				else libModPmt += app.getRefLabel('refModalitesPaiement', modPmt);

			for (var div of divisionV)
				if (lastDV != app.getRefLabel('refDivisions', div))
					libDiv += app.getRefLabel('refDivisions', div) + " / ";
				else libDiv += app.getRefLabel('refDivisions', div);

			for (var ag of agenceV)
				if (lastAg != app.getRefLabel('refAgencesGestions', ag))
					libAg += app.getRefLabel('refAgencesGestions', ag) + " / ";
				else libAg += app.getRefLabel('refAgencesGestions', ag);

			for (var pa of paysV)
				if (lastPa != app.getRefLabel('refPays', pa))
					libPa += app.getRefLabel('refPays', pa) + " / ";
				else libPa += app.getRefLabel('refPays', pa);
		}

		await app.sleep(500);

		var filtresSheetDDR = [
			[lang.filtresReporting.societe, app.getRefLabel('refSocietesLight', entite)],
			[lang.filtresReporting.pays, app.getRefLabel('refPays', pays)],
			[lang.filtresReporting.modalitePaiement, app.getRefLabel('refModalitesPaiement', modalitePaiement)],
			[lang.filtresReporting.beneficiaire, this.tiersSelectedLabel],
			[lang.filtresReporting.projet, app.getRefLabel('projets_ddr', projetFiltre)],
			[lang.filtresReporting.concours, app.getRefLabel('concours_ddr', concoursFiltre)],
			[lang.filtresReporting.dateDeb, app.formatDate(dateDebCreation)],
			[lang.filtresReporting.dateFin, app.formatDate(dateFinCreation)],
			[lang.filtresReporting.statuts, statutsLib],
			[lang.filtresReporting.agenceGestion, app.getRefLabel('refAgencesGestions', agence)],
			[lang.filtresReporting.familleProduit, app.getRefLabel('refFamillesProduits', familleProduit)],
			[lang.filtresReporting.division, (app.isNotEmpty(division)) ? division + " - " + app.getRefLabel('refDivisions', division) : ''],
			[lang.filtresReporting.departement, (app.isNotEmpty(dep)) ? dep + " - " + app.getRefLabel('refDivisions', dep) : '']
		];

		var filtresSheetVolDvEtDdr = [
			[lang.filtresReporting.societe, libSocietes],
			[lang.filtresReporting.familleProduit, libFamPdts],
			[lang.filtresReporting.modalitePaiement, libModPmt],
			[lang.filtresReporting.agenceAfd, libAg],
			[lang.filtresReporting.pays, libPa],
			[lang.filtresReporting.division, libDiv],
			[lang.filtresReporting.dateDeb, dateDebVol],
			[lang.filtresReporting.dateFin, dateFinVol]
		];

		var filtresSheetAnos = [
			[lang.filtresReporting.statutsAno, app.getRefLabel('refStatutsAno', statutsAno)],
			[lang.filtresReporting.agenceGestion, app.getRefLabel('refAgencesGestions', agenceAno)],
			[lang.filtresReporting.controleur, app.getRefLabel('refUsers', controleurAno)],
			[lang.filtresReporting.modalitePaiement, app.getRefLabel('refModalitesPaiement', modalitePaiementAno)],
			[lang.filtresReporting.regularisable, app.getRefLabel('refBoolean', regularisabelAno)],
			[lang.filtresReporting.dateDeb, dateDebAno],
			[lang.filtresReporting.dateFin, dateFinAno]
		];

		var filtresSheetDC = [
			[lang.filtresReporting.statutsDC, app.getRefLabel('refStatuts2ndNiv', statutsDC)],
			[lang.filtresReporting.dateDeb, dateDebDC],
			[lang.filtresReporting.dateFin, dateFinDC],
			[lang.filtresReporting.agencesDC, app.getRefLabel('refAgencesGestions', agenceDC)],
			[lang.filtresReporting.controleur, app.getRefLabel('refUsers', controleurDC)],
			[lang.filtresReporting.modalitePaiement, app.getRefLabel('refModalitesPaiement', modalitePaiementDC)],
		];

		var filtresSheetRAjDC = [
			[lang.reporting.ctlRAJDossierControle.agenceGestion, app.getRefLabel('refAgencesGestionsLibLong', agenceGestionControleRajDC)],
			[lang.reporting.ctlRAJDossierControle.statut, app.getRefLabel('refStatutsDCRaj', statutControleRajDC)],
			[lang.reporting.ctlRAJDossierControle.controleurEnCharge, app.getRefLabel('refUsers', controleurEnChargeControleRajDC)],
			[lang.reporting.ctlRAJDossierControle.concours, concoursControleRajDC],
			[lang.reporting.ctlRAJDossierControle.typeControleRaj, typeControleRajDC],
			[lang.reporting.ctlRAJDossierControle.typeAvance, app.getRefLabel('refTypeAvance', typeAvanceControleRajDC)],
			[lang.reporting.ctlRAJDossierControle.dateDebutCreationControle, filtredateDebControleRajDC],
			[lang.reporting.ctlRAJDossierControle.dateFinCreationControle, filtredateFinControleRajDC],
		];

		var filtresSheetRAjAnomalie = [
			[lang.reporting.ctlRAJAnomalie.agenceGestion, app.getRefLabel('refAgencesGestionsLibLong', agenceGestionControleRajAno)],
			[lang.reporting.ctlRAJAnomalie.statut, app.getRefLabel('refStatutsAno', statutControleRajAno)],
			[lang.reporting.ctlRAJAnomalie.controleurEnCharge, app.getRefLabel('refUsers', controleurEnChargeControleRajAno)],
			[lang.reporting.ctlRAJAnomalie.concours, concoursControleRajAno],
			[lang.reporting.ctlRAJAnomalie.typeControleRaj, typeControleRajAno],
			[lang.reporting.ctlRAJAnomalie.dateDebutCreationAnomalie, filtredateDebCreationAnomalieRaj],
			[lang.reporting.ctlRAJAnomalie.dateFinCreationAnomalie, filtredateFinCreationAnomalieRaj],
		];

		var filtresSheetConcoursRaj = [
			[lang.filtresReporting.societe, societeCr],
			[lang.filtresReporting.pays, app.getRefLabel('refPays', paysCr)],
			[lang.filtresReporting.agenceGestion, app.getRefLabel('refAgencesGestions', agenceCr)],
			[lang.filtresReporting.division, (app.isNotEmpty(divisionCr)) ? divisionCr + " - " + app.getRefLabel('refDivisions', divisionCr) : '']
		];

		var filtresSheetListeAvance = [
			[lang.reportingListeAvance.typeavance, app.getRefLabel('refTypeAvance', typeAvanceRla)],
			[lang.reportingListeAvance.societe, societeRla],
			[lang.reportingListeAvance.pays, app.getRefLabel('refPays', paysRla)],
			[lang.reportingListeAvance.agencegestion, app.getRefLabel('refAgencesGestionsLibLong', agenceGestionRla)],
			[lang.reportingListeAvance.directionregionale, directionRegionalRla],
			[lang.reportingListeAvance.divisiontechnique, app.getRefLabel('refDivisions', divisionTechniqueRla)],
		];

		var filtresSheetListePaiementTiers = [
			[lang.reportingPaiementTiers.tiers, this.tiersSelectedLabel],
			[lang.reportingPaiementTiers.projet, projet]
		];

		var filtresSheetDocContractuel = [
			[lang.reportingPaiementDocContractuel.projet, projetdc],
			[lang.reportingPaiementDocContractuel.pays, app.getRefLabel('refPays', paysdc)],
			[lang.reportingPaiementDocContractuel.agenceGestion, app.getRefLabel('refAgencesGestionsLibLong', agencegestiondc)],
			[lang.reportingPaiementDocContractuel.dateCreation, app.formatDate(filtredatecreationDc, true)],
			[lang.reportingPaiementDocContractuel.dateModification, app.formatDate(filtredatemodifDc, true)]
		];

		var filtresSheetListeDCTiers = [
			[lang.reporting.dcByTiers.tiers, tiersDC],
		];

		var filtresSheetrAV = [
			[lang.filtresReporting.societe, societeRav],
			[lang.filtresReporting.pays, app.getRefLabel('refPays', paysRav)],
			[lang.filtresReporting.projet, projetRav],
			[lang.filtresReporting.concours, concoursRav],
			[lang.filtresReporting.agenceGestion, app.getRefLabel('refAgencesGestions', agenceRav)],
			[lang.filtresReporting.division, (app.isNotEmpty(divisionRav)) ? divisionRav + " - " + app.getRefLabel('refDivisions', divisionRav) : ''],
			[lang.filtresReporting.dateDeb, dateDebRav],
			[lang.filtresReporting.dateFin, dateFinRav]
		];

		var filtresSheetRemboursement = [
			[lang.reportingRemboursement.typeremboursement, app.getRefLabel('refTypesRemboursement', typeRemboursement)],
			[lang.reportingRemboursement.beneficiaire, this.tiersSelectedLabel],
			[lang.reportingRemboursement.projet, projetRemboursement],
			[lang.reportingRemboursement.concours, concoursRemboursement],
			[lang.reportingRemboursement.agencegestion, app.getRefLabel('refAgencesGestions', agenceGestionRemboursement)],
			[lang.reportingRemboursement.pays, app.getRefLabel('refPays', paysRemboursement)],
		];

		if (this.rows != null && this.rows.length > 0) {
			//colonnes dynamiques
			var cols = [];
			for (var key of Object.keys(this.rows[0])) {
				cols.push({
					'label': (lang[type] != null && lang[type][key] != null) ? lang[type][key] : key,
					'key': key
				});
			}

			if (type == 'reportingDDR') {
				this.reporting().exportExcel('reportingDDR', this.rows, filtresSheetDDR, cols);//OK
			} else if (type == 'volumetriesDvEtDdr') {
				this.reporting().exportExcel('volumetriesDvEtDdr', this.rows, filtresSheetVolDvEtDdr, cols);
			} else if (type == 'volumetriesAnos') {
				this.reporting().exportExcel('volumetriesAnos', this.rows, filtresSheetAnos, cols);//OK
			} else if (type == 'volumetriesDC') {
				this.reporting().exportExcel('volumetriesDC', this.rows, filtresSheetDC, cols);//OK
			} else if (type == 'ctlRAJDossierControle') {
				this.reporting().exportExcel('ctlRAJDossierControle', this.rows, filtresSheetRAjDC, cols);//OK
			} else if (type == 'ctlRAJAnomalie') {
				this.reporting().exportExcel('ctlRAJAnomalie', this.rows, filtresSheetRAjAnomalie, cols);//OK
			} else if (type == 'concoursRaj') {
				this.reporting().exportExcel('concoursRaj', this.rows, filtresSheetConcoursRaj, null);
			} else if (type == 'reportingListeAvance') {
				this.reporting().exportExcel('reportingListeAvance', this.rows, filtresSheetListeAvance, cols);
			} else if (type == 'reportingPaiementTiers') {
				this.reporting().exportExcel('reportingPaiementTiers', this.rows, filtresSheetListePaiementTiers, null);
			} else if (type == 'reportingPaiementDocContractuel') {
				this.reporting().exportExcel('reportingPaiementDocContractuel', this.rows, filtresSheetDocContractuel, cols);//OK
			} else if (type == 'dcByTiers') {
				this.reporting().exportExcel('dcByTiers', this.rows, filtresSheetListeDCTiers, null);
			} else if (type == 'ravByConcours') {
				this.reporting().exportExcel('ravByConcours', this.rows, filtresSheetrAV, cols);//OK
			} else if (type == 'reportingRemboursements') {
				this.reporting().exportExcel('reportingRemboursements', this.rows, filtresSheetRemboursement, cols); //OK
			}
		} else
			app.showToast('toastReportingNoResult');

		await app.sleep(2000);
		const reporting = this.reporting();
  console.log("this.loadingReport >> ", reporting.loading);
		if (!reporting.loading) {
			app.hideModal('modalFiltres');
			this.modalFiltres().setLoadingBtn();
		}

	}

	// TIERS 

	async getTiers() {
		this.tableTiers().setLoading(true);

		this.listTiers = app.getRef('refBeneficiaires');

		await app.sleep(1000);

		this.tableTiers().getItems();
	}

	async selectTiers(item: any) {
		this.tiersSelected = item;
		this.tiersSelectedLabel = item.label;

		app.hideModal('modalReportingTiers');

		app.refreshModal('modalFiltres', true);
	}

	searchTiers() {
		app.showModal('modalReportingTiers');

		this.getTiers();
	}
}