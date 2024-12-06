import { Component, OnInit, input, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { InfosBeneficiaireComponent } from '../infos-beneficiaire/infos-beneficiaire.component';
import { TeleportComponent } from '../teleport/teleport.component';
import { InfosDcComponent } from '../infos-dc/infos-dc.component';
import { RubriquesComponent  } from '../rubriques/rubriques.component';
import { InfosCoordonneBancaireComponent  } from '../infos-coordonnee-bancaire/infos-coordonnee-bancaire.component';
import { InfosConcoursComponent } from '../infos-concours/infos-concours.component';
import { TableComponent } from '../table/table.component';
import { InfosAvanceComponent } from '../infos-avance/infos-avance.component';
import { FormsModule } from '@angular/forms';
import { AvanceComponent } from '../../pages/avance/avance.component';
import { DocumentContractuelComponent } from '../../pages/documentContractuel/documentContractuel.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ModalComponent } from '../modal/modal.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { SelectBeneficiaireComponent } from '../select-beneficiaire/select-beneficiaire.component';
import { Router, ActivatedRoute } from '@angular/router';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const urls: any;
declare const lang: any;

@Component({
    selector: 'app-infos-reglement',
    templateUrl: './infos-reglement.component.html',
    standalone: true,
    imports: [NgIf, ModalComponent, NgClass, NgFor, SpinnerComponent, DocumentContractuelComponent, AvanceComponent, TeleportComponent, FormsModule, InfosBeneficiaireComponent,
		 InfosAvanceComponent, TableComponent, InfosConcoursComponent, InfosCoordonneBancaireComponent, RubriquesComponent, InfosDcComponent]
})
export class InfosReglementComponent implements OnInit {

	readonly infosBeneficiaireReglement = viewChild.required<InfosBeneficiaireComponent>('infosBeneficiaireReglement');
	readonly beneficiairePrimaire = viewChild.required<InfosBeneficiaireComponent>('beneficiairePrimaire');
	readonly teleportBeneficiaireReglement = viewChild.required<TeleportComponent>('teleportBeneficiaireReglement');
	readonly teleportDetailAvanceContractuel = viewChild.required<TeleportComponent>('teleportDetailAvanceContractuel');
	readonly infosAvance = viewChild.required<InfosAvanceComponent>('infosAvance');
	readonly teleportBeneficiairePrimaire = viewChild.required<TeleportComponent>('teleportBeneficiairePrimaire');
	readonly tableJustificatifsReglement = viewChild.required<TableComponent>('tableJustificatifsReglement');
	readonly teleportJustificatifReglement = viewChild.required<TeleportComponent>('teleportJustificatifReglement');
	readonly tableJustificatifsRemboursement = viewChild.required<TableComponent>('tableJustificatifsRemboursement');
	readonly teleportJustificatifRemboursement = viewChild.required<TeleportComponent>('teleportJustificatifRemboursement');
	readonly teleportEmetteurJustificatif = viewChild.required<TeleportComponent>('teleportEmetteurJustificatif');
	readonly teleportRubriquesJust = viewChild.required<TeleportComponent>('teleportRubriquesJust');
	readonly teleportDcJustificatif = viewChild.required<TeleportComponent>('teleportDcJustificatif');
	readonly teleportRubriquesRemboursement = viewChild.required<TeleportComponent>('teleportRubriquesRemboursement');
	readonly teleportDcJustifRemboursement = viewChild.required<TeleportComponent>('teleportDcJustifRemboursement');
	readonly teleportContrevaleur = viewChild.required<TeleportComponent>('teleportContrevaleur');
	readonly teleportEquivalent = viewChild.required<TeleportComponent>('teleportEquivalent');
	readonly teleportDevisesReglement = viewChild.required<TeleportComponent>('teleportDevisesReglement');
	readonly teleportDetailsCoordonneeBancaire = viewChild.required<TeleportComponent>('teleportDetailsCoordonneeBancaire');
	readonly infosCoordonneeBancaire = viewChild.required<InfosCoordonneBancaireComponent>('infosCoordonneeBancaire');
	readonly teleportConcours = viewChild.required<TeleportComponent>('teleportConcours');
	readonly infosConcours = viewChild.required<InfosConcoursComponent>('infosConcours');
	readonly selectEmetteur = viewChild.required<SelectBeneficiaireComponent>('selectEmetteur');
	readonly infosEmetteurJustificatif = viewChild.required<InfosBeneficiaireComponent>('infosEmetteurJustificatif');
	readonly teleportSelectAvance = viewChild.required<TeleportComponent>('teleportSelectAvance');
	readonly rubriquesComponentJust = viewChild.required<RubriquesComponent>('rubriquesComponentJust');
	readonly rubriquesComponent = viewChild.required<RubriquesComponent>('rubriquesComponent');
	readonly infosReglementDC = viewChild.required<DocumentContractuelComponent>('infosReglementDC');
	readonly infosReglementAvance = viewChild.required<AvanceComponent>('infosReglementAvance');
	readonly teleportDC = viewChild.required<TeleportComponent>('teleportDC');
	readonly infosDc = viewChild.required<InfosDcComponent>('infosDc');
	readonly tableRubriques = viewChild.required<TableComponent>('tableRubriques');
	readonly detailsDemandeReglement = viewChild.required<ModalComponent>('detailsDemandeReglement');

	showConcours: boolean = false;
	entite: any;
	reglement: any = null;
	versement: any = null;
	showJustificatifsReglement: any = false;
	showJustificatifsRemboursement: any = false;
	documentsContractuel: any = [];
	documentContractuel: any;
	avancesContractuel: any = null;
	avanceContractuel: any = null;
	idAvanceContractuel: any;
	showAvance: boolean = false;
	showButtonGetAvance: boolean = false;
	justificatifsReglement: any = [];
	justificatifsRemboursement: any = [];
	showRubriquesDC: any = false;
	app: any = app;
	lang: any = lang;
	showSidebarDC: any = false;
	showSidebarAC: any = false;
	showSidebarDR: any = false;
	read: any = false;
	sidebarSelected: any;
	emetteurJustificatif: any;
	rubriquesDC: any;
	infosDcJustificatif: any;
	loading: boolean = false;
	contentTitle: any;
	concoursSIOP: any;
	contrevaleurMontantRender: any;
	contrevaleurDeviseRender: any;
	contrevaleurDateRender: any;
	contrevaleurVisible: boolean = false;
	devise: any = null;
	labelDeviseSelected: any = null;
	dateSaisieDdrDef: any = null;
	showDetailsCoordonneeBancaire: boolean = false;
	showSwitchToUpdate: boolean = false;
	isNotDdrDef: boolean = true;
	tache: any;
	resteJustifierDecaisserDossier: any;
	listEmetteursJustifByCr: any;
	listEmetteursJustifByCrAV: any;
	showRepriseVersement: boolean = false;
	dernierJustifValue: boolean = false;
	showJAC: boolean = false;
	showJR: boolean = false;
	rubriques: any;
	ventilationRubriques: any;
	montantARemb: any;
	/* equivalent */
	equivalentVisible: boolean = false;
	equivalentMontantRender: any;
	equivalentDeviseRender: any;
	equivalentDateRender: any;
	ddrReprise: boolean = false;

	readonly role = input<any>();

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();

		app.setCurrentCmp('reglement', this);
	}

	async gotoReglement(reglement: any, versement: any, update: any) {
		console.time('info-reglement');

		app.log('infos-reglement > gotoReglement / reglement - update', reglement, update);

		this.loading = true;
		this.showSwitchToUpdate = update;
		this.showDetailsCoordonneeBancaire = true;
		this.showConcours = true;
		this.showJAC = false;
		this.reglement = reglement;
		this.versement = versement;
		this.ddrReprise = !app.isEmpty(this.reglement.obj_ext_id);

		//initialisation du DO avec les données du reglement
		var DO = app.copyJson(app.getDO('reglement'));
		app.setBDM(app.mapDO(DO, this.reglement));

		await app.sleep(100);

		//affichage de la modale avec le spinner
		app.showModal('detailsDemandeReglement');
		//this.detailsDemandeReglement.btnSave.disabled = true;
		//si AFD, on charge les DC et AVANCES
		if (app.isAFD(this.entite)) {
			this.documentsContractuel = await app.getExternalData(app.getUrl('urlGetDocumentsContractuel', this.versement.numero_projet), 'infos-reglement > gotoReglement - DC by projet');
			app.setRef(this.documentsContractuel, 'documentsContractuel', 'persistenceId', ['numero_document_contractuel', 'libelle']);

			this.avancesContractuel = await app.getExternalData(app.getUrl('urlGetAvancesByConcours', this.reglement.numero_concours), 'infos-reglement > gotoReglement - Avance by concours');

			//gestion devise
			this.devise = (this.reglement.type_devise == "1" ? this.reglement.devise_reglement : this.reglement.devise_reference);
			this.getLabelDeviseByTypeDeviseRegSelected(this.reglement.type_devise);
		}

		//generation de la sidebar menu à gauche
		await this.generateSidebar();

		//on vide les teleports formio
		this.teleportBeneficiaireReglement().unteleport();
		this.teleportDetailAvanceContractuel().unteleport();
		this.teleportBeneficiairePrimaire().unteleport();
		this.teleportDetailsCoordonneeBancaire().unteleport();
		this.teleportConcours().unteleport();
		this.teleportJustificatifRemboursement().unteleport();
		if (app.isAFD(this.entite)) {
			this.teleportDevisesReglement().unteleport();
			this.teleportJustificatifReglement().unteleport();
			this.teleportContrevaleur().unteleport();
			this.teleportEquivalent().unteleport();
			this.teleportDC().unteleport();
		}

		//on vide le formulaire formio du reglement
		app.cleanDiv('formio_reglement' + this.entite);

		//chargement du formulaire formio du reglement
		appFormio.loadFormIO('reglement' + this.entite, true);

		await app.sleep(150);

		if (!app.isAFD(this.entite) && this.reglement != null) {
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_decaissement', this.reglement.numero_decaissement);

			this.concoursSIOP = await app.getExternalData(app.getUrl('urlGetConcoursSIOPByNumero', this.reglement.numero_concours), 'infos-reglement > getConcours - concours');
			if (app.isUnionEurop(this.concoursSIOP.idOperation))
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'num_compte_ktp', '');
			else {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'num_compte_ktp', 'show');
				appFormio.setDataValue(crossVars.forms['formio_reglementPROPARCO'], 'numero_compte_ktp', app.getRefLabel('refNumeroCompteKTP', this.reglement.numero_compte_ktp));
			}
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'achat_devise_pro', this.reglement.achat_devise_pro);
			if (!app.isReversement(this.versement.modalite_paiement)) {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_adosse_subvention_seche', this.reglement.pret_adosse_subvention_seche);
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'pret_auto_finance', this.reglement.pret_auto_finance);
			}
		}

		//initialisation des toggles et de certaines données du form
		appFormio.selectToggle(crossVars.forms['formio_reglement' + this.entite], 'type_devise', DO.type_devise);
		app.disableToggle(crossVars.forms['formio_reglement' + this.entite], 'type_devise');

		if (app.isPaiementDirectAndMoad(this.versement.modalite_paiement, this.versement.type_versement) && app.isAFD(this.entite)) {
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'doc_show', 'show');

			if (app.isEmpty(DO.dc_attache))
				DO.dc_attache = '0'; //pas de DC

			appFormio.selectToggle(crossVars.forms['formio_reglement' + this.entite], 'dc_attache', DO.dc_attache);
			app.disableToggle(crossVars.forms['formio_reglement' + this.entite], 'dc_attache');

			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_document_contractuel', this.reglement.id_document_contractuel);
		}

		if (app.isAFD(this.entite))
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'nature_taux', this.reglement.nature_taux);

		appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'lien_rom_raj', this.reglement.justificatif_complementaire_RAJ);

		//chargement du tiers et coordonnees bancaires
		await this.getBeneficiaireReglement();

		const infosBeneficiaireReglement = this.infosBeneficiaireReglement();
  if (!app.isEmpty(infosBeneficiaireReglement) && !app.isEmpty(infosBeneficiaireReglement.beneficiaire))
			this.infosCoordonneeBancaire().setListCoordonneesBancaires(infosBeneficiaireReglement.beneficiaire.comptes, true, app.getEltInArray(infosBeneficiaireReglement.beneficiaire.comptes, 'idCbInterne', (this.reglement != null ? this.reglement.id_coordonnee_bancaire : null)));

		//chargement du beneficiaire primaire
		this.getBeneficiairePrimaire();

		//chargement du concours
		await this.infosConcours().getConcours(this.reglement.numero_concours, false);

		//chargement des justificatifs
		if (app.isAFD(this.entite) && app.isRefinancementOrPaiementDirect(this.versement.modalite_paiement)) {
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'show_justificatif', 'show');
			this.showJustificatifsReglement = true;

			await app.sleep(100);

			if (this.reglement != null) {
				for (var justificatif of this.reglement.justificatifs) {
					if (!app.existInArray(this.justificatifsReglement, 'id', justificatif.persistenceId)) {
						var DOj = app.copyJson(app.getDO('justificatifReglement'));

						app.mapDO(DOj, justificatif);

						DOj.id = justificatif.persistenceId;

						this.justificatifsReglement.push(DOj);
					}
				}

				await app.sleep(100);
			}

			this.tableJustificatifsReglement().getItems();
		}

		//chargement des justificatifs-remboursement
		if (this.reglement != null && this.reglement.justificatifsRemboursement.length > 0) {
			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'show_justificatif_remboursement', 'show');
			this.showJustificatifsRemboursement = true;

			await app.sleep(100);

			for (var justificatif of this.reglement.justificatifsRemboursement) {
				if (!app.existInArray(this.justificatifsRemboursement, 'id', justificatif.persistenceId)) {
					var DOjRemb = app.copyJson(app.getDO('justificatifRemboursement'));

					app.mapDO(DOjRemb, justificatif);

					DOjRemb.id = justificatif.persistenceId;
					DOjRemb.typeRemboursement = (justificatif.typeRemboursement == '0') ? lang.justificatifRemboursement.remboursementPartiel : lang.justificatifRemboursement.remboursementIntegral;

					this.justificatifsRemboursement.push(DOjRemb);
				}

				await app.sleep(100);
			}

			this.tableJustificatifsRemboursement().getItems();
		}

		//chargement données avance
		if (app.isAvance(this.versement.modalite_paiement)) {
			if (!app.isEmpty(this.reglement.id_avance_contractuel)) {
				this.idAvanceContractuel = this.reglement.id_avance_contractuel;
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_avance_contractuel', 'liste_avance');

				if (!app.isEmpty(this.idAvanceContractuel))
					await this.getAvanceContractuel(this.idAvanceContractuel);
			} else
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_avance_contractuel', 'add_avance');

			appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'add_avance_contractuel', 'hide');
		}

		if (this.reglement.id_document_contractuel != null)
			await this.infosDc().getDetailDocumentContractuel(this.reglement.id_document_contractuel, this.reglement, null, null);

		//contrevaleur
		if (app.isNotEmpty(this.reglement.devise_contrevaleur)) {
			this.contrevaleurVisible = true;
			this.contrevaleurMontantRender = app.formatNumberWithDecimals(this.reglement.montant_contrevaleur);
			this.contrevaleurDeviseRender = app.getRefLabel('refDevises', this.reglement.devise_contrevaleur);
			this.contrevaleurDateRender = app.formatDate(this.reglement.date_contrevaleur);
		}

		//équivalent
		if (app.isNotEmpty(this.reglement.montant_equivalent)) {
			this.equivalentVisible = true;
			this.equivalentMontantRender = app.formatNumberWithDecimals(this.reglement.montant_equivalent);
			this.equivalentDeviseRender = app.getRefLabel('refDevises', this.reglement.devise_reglement);
			this.equivalentDateRender = app.formatDate(this.reglement.date_equivalent);
		}

		//chargement des teleports
		this.teleportBeneficiaireReglement().teleport();
		this.teleportBeneficiaireReglement().show();
		this.teleportDetailAvanceContractuel().teleport();
		this.teleportDetailAvanceContractuel().show();
		this.teleportBeneficiairePrimaire().teleport();
		this.teleportBeneficiairePrimaire().show();
		this.teleportDetailsCoordonneeBancaire().teleport();
		this.teleportDetailsCoordonneeBancaire().show();
		this.teleportConcours().teleport();
		this.teleportConcours().show();
		this.teleportJustificatifRemboursement().teleport();
		this.teleportJustificatifRemboursement().show();
		if (app.isAFD(this.entite)) {
			this.teleportDevisesReglement().teleport();
			this.teleportDevisesReglement().show();
			this.teleportJustificatifReglement().teleport();
			this.teleportJustificatifReglement().show();
			this.teleportContrevaleur().teleport();
			this.teleportContrevaleur().show();
			this.teleportEquivalent().teleport();
			this.teleportEquivalent().show();
			this.teleportDC().teleport();
			this.teleportDC().show();
		}

		this.loading = false;

		this.detailsDemandeReglement().enabledBtnSwitchToUpdate();

		console.timeEnd('info-reglement');
	}

	async saveReglement() {
		var DO = app.getDO('reglement');
		DO.numero_dossier_reglement = this.reglement.numero_dossier_reglement;
		DO.numero_dossier_versement = this.reglement.numero_dossier_versement;
		DO.entite = this.entite;

		await app.saveFormData(app.getRootDO('reglement'), crossVars.forms['formio_reglement' + this.entite], urls['urlProcessInstanciation'], urls['urlProcessUpdateReglement']);

		app.hideModal('detailsDemandeReglement');
	}

	async getBeneficiaireReglement() {
		await this.infosBeneficiaireReglement().getBeneficiaire(null, null, this.reglement.id_beneficiaire_reglement, this.reglement.numero_concours, 'DR');
	}

	async getBeneficiairePrimaire() {
		if (!app.isEmpty(this.reglement.id_beneficiaire_primaire))
			await this.beneficiairePrimaire().getBeneficiaire(null, null, this.reglement.id_beneficiaire_primaire, this.reglement.numero_concours, 'DR');
	}

	async getAvanceContractuel(id?: any) {
		this.idAvanceContractuel = (id != null ? id : appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'id_avance_contractuel'));

		appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'raj_sup_zero', '');

		await this.infosAvance().getAvance(this.idAvanceContractuel, this.entite, this.versement.persistenceId, (this.reglement != null ? this.reglement.persistenceId : null));

		await app.sleep(100);

		this.showAvance = true;
		this.showButtonGetAvance = true;

		const infosAvance = this.infosAvance();
  if (infosAvance) {
			this.resteJustifierDecaisserDossier = (infosAvance.isFixed) ? infosAvance.avanceFig.reste_justifier_decaisser_dossier_copy : infosAvance.resteJustifierDecaisserDossier;

			if (this.resteJustifierDecaisserDossier > 0 && this.reglement != null && this.reglement.justificatif_complementaire_RAJ) {
				appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'raj_sup_zero', 'show');

				await app.sleep(250);

				app.setLinkEvent(crossVars.forms['formio_reglement' + this.entite], "lien_rom_raj");
			}
		}

		appFormio.setDataValue(crossVars.forms['formio_reglement' + this.entite], 'lien_rom_raj', this.reglement.justificatif_complementaire_RAJ);
	}

	async generateSidebar() {
		this.showSidebarDC = false;
		this.showSidebarAC = false;
		this.showSidebarDR = true;

		app.log('infos-reglement > generateSidebar() reglement', this.reglement);

		if (this.reglement != null) {
			this.showReglement();

			if (this.reglement.id_document_contractuel != null) {
				this.documentContractuel = await app.getExternalData(app.getUrl('urlGetDoContractuelById', this.reglement.id_document_contractuel), 'infos-reglement > generateSidebar - DC', true);

				this.showRepriseVersement = (this.documentContractuel?.obj_ext_id != null);

				this.showSidebarDR = false;
				this.showSidebarDC = true;
			}

			if (this.reglement.id_avance_contractuel != null) {
				this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvanceContractuel', this.reglement.id_avance_contractuel), 'info-reglement > generateSidebar - Avance', true);

				this.showSidebarDR = false;
				this.showSidebarAC = true;
			}
		}
	}

	showReglement() {
		this.sidebarSelected = 'DR';
		this.showSidebarDR = true;
		this.contentTitle = lang.context.reglementMontant;
		this.showJAC = false;

		app.showElement('formio_reglement' + this.entite);
		app.hideElement('formio_justificatifReglement');
		app.hideElement('formio_justificatifRemboursement');
		app.hideElement('formio_documentContractuel');
		app.hideElement('formio_justificatifAvance' + this.entite);

		if (app.isAFD(this.entite))
			app.hideElement('formio_avanceContractuelAFDFinal');
		else
			app.hideElement('formio_avanceContractuelPROPARCOFinal');
	}

	async gotoDC() {
		console.time('info-documentContractuel');

		this.loading = true;
		this.sidebarSelected = 'DC';
		this.showSidebarDR = false;
		this.contentTitle = lang.subDC;
		this.showJAC = false;

		app.hideElement('formio_justificatifReglement');
		app.hideElement('formio_justificatifRemboursement');
		app.hideElement('formio_reglement' + this.entite);
		app.hideElement('formio_justificatifAvance' + this.entite);

		if (app.isAFD(this.entite)) {
			app.hideElement('formio_avanceContractuelAFDFinal');

			if (this.documentContractuel != null)
				this.infosDcJustificatif = this.documentContractuel.code_fonctionnel + ' : ' + this.documentContractuel.libelle; // ?
		} else
			app.hideElement('formio_avanceContractuelPROPARCOFinal');

		this.infosReglementDC().getDC();

		this.loading = false;

		app.showElement('formio_documentContractuel');

		console.timeEnd('info-documentContractuel');
	}

	async gotoAC(item: any) {
		console.time('info-avance');

		this.showRepriseVersement = (item.obj_ext_id != null);

		this.loading = true;
		this.sidebarSelected = 'AC';
		this.showSidebarDR = false;
		this.contentTitle = lang.subAC;
		this.showJAC = false;

		app.hideElement('formio_reglement' + this.entite);
		app.hideElement('formio_documentContractuel');
		app.hideElement('formio_justificatifReglement');
		app.hideElement('formio_justificatifRemboursement');
		app.hideElement('formio_justificatifAvance' + this.entite);

		await this.infosReglementAvance().getAvance();

		this.loading = false;

		app.showElement('formio_' + (app.isAFD(this.entite) ? 'avanceContractuelAFDFinal' : 'avanceContractuelPROPARCOFinal'));

		console.timeEnd('info-avance');
	}

	async gotoJustificatifReglement(item: any) {
		console.time('info-justif-reglement');

		this.showRepriseVersement = (item.obj_ext_id != null);
		this.loading = true;
		this.contentTitle = null;
		this.showSidebarDR = false;
		this.sidebarSelected = 'J' + item.persistenceId;
		this.infosDcJustificatif = null;
		this.showRubriquesDC = false;
		this.showJAC = false;

		app.hideElement('formio_justificatifReglement');
		app.hideElement('formio_justificatifRemboursement');
		app.hideElement('formio_documentContractuel');
		app.hideElement('formio_reglement' + this.entite);
		app.hideElement('formio_justificatifAvance' + this.entite);
		if (app.isAFD(this.entite))
			app.hideElement('formio_avanceContractuelAFDFinal');
		else
			app.hideElement('formio_avanceContractuelPROPARCOFinal');

		this.teleportDcJustificatif().unteleport();
		this.teleportRubriquesJust().unteleport();
		this.teleportEmetteurJustificatif().unteleport();

		app.cleanDiv('formio_justificatifReglement');

		var DO = app.getDO('justificatifReglement');

		if (item != null) {
			app.mapDO(DO, item);

			DO.persistence_id = item.persistenceId;
		}

		app.setBDM(DO);

		//si document contractuel
		if (!app.isEmpty(DO.id_document_contractuel)) {
			this.rubriquesDC = [];

			if (this.documentContractuel != null) {
				this.infosDcJustificatif = this.documentContractuel.code_fonctionnel + ' : ' + this.documentContractuel.libelle;
				var ddrDevise = (this.reglement.type_devise == '1' ? this.reglement.devise_reglement : this.reglement.devise_reference);

				app.cleanDiv("rubriquesComponentJust");

				await this.rubriquesComponentJust().getRubriques(this.documentContractuel.autre_devise != null ? this.documentContractuel.autre_devise : [], this.documentContractuel, false, false, false, false, false, (this.documentContractuel != null ? this.documentContractuel.rubriques : null), true, item, ddrDevise, this.reglement);
			}

			this.showRubriquesDC = true;

			await app.sleep(100);
		}

		appFormio.loadFormIO('justificatifReglement', true);

		await app.sleep(500);
		//ANOMALIE 305 lidia
		appFormio.setDataValue(crossVars.forms['formio_justificatifReglement'], 'devise_equivalente', 1);
		this.getEmetteurJustificatif(item.emetteur);

		//anomalie 2213
		if (app.isPaiementDirectAndMoad(this.versement.modalite_paiement, this.versement.type_versement)) {
			this.teleportDcJustificatif().teleport();
			this.teleportDcJustificatif().show();
			this.teleportRubriquesJust().teleport();
			this.teleportRubriquesJust().show();
		}
		this.teleportEmetteurJustificatif().teleport();
		this.teleportEmetteurJustificatif().show();

		this.loading = false;
		this.contentTitle = lang.subJustifReg;
		
		app.showElement('formio_justificatifReglement');

		console.timeEnd('info-justif-reglement');
	}

	async gotoJustificatifRemboursement(item: any) {
		console.time('info-justif-remboursement');

		this.showJR = true;

		this.showRepriseVersement = (item.obj_ext_id != null);
		this.loading = true;
		this.contentTitle = null;
		this.showSidebarDR = false;
		this.sidebarSelected = 'JR' + item.persistenceId;
		this.infosDcJustificatif = null;
		this.showRubriquesDC = false;
		this.showJAC = false;

		app.hideElement('formio_justificatifReglement');
		app.hideElement('formio_justificatifRemboursement');
		app.hideElement('formio_documentContractuel');
		app.hideElement('formio_reglement' + this.entite);
		app.hideElement('formio_justificatifAvance' + this.entite);
		if (app.isAFD(this.entite))
			app.hideElement('formio_avanceContractuelAFDFinal');
		else
			app.hideElement('formio_avanceContractuelPROPARCOFinal');

		if (app.isAFD(this.entite)) {
			this.teleportDcJustifRemboursement().unteleport();
			this.teleportRubriquesRemboursement().unteleport();
		}

		app.cleanDiv('formio_justificatifRemboursement');

		var DO = app.getDO('justificatifRemboursement');

		if (item != null) {
			app.mapDO(DO, item);

			DO.persistence_id = item.persistenceId;
		}

		app.setBDM(DO);

		//si document contractuel
		if (!app.isEmpty(DO.id_document_contractuel)) {
			this.rubriquesDC = [];

			if (this.documentContractuel != null) {
				this.infosDcJustificatif = this.documentContractuel.code_fonctionnel + ' : ' + this.documentContractuel.libelle;
				var ddrDevise = (this.reglement.type_devise == '1' ? this.reglement.devise_reglement : this.reglement.devise_reference);

				this.rubriques = await app.getExternalData(app.getUrl('urlGetVentilationRubrique', this.reglement.persistenceId), 'justificatif-remboursement > getRubriques - rubriques');

				app.log('rubriquesVentilation', this.rubriques);
				this.showRubriquesDC = true;
				await app.sleep(250);

				this.tableRubriques().getItems();

				const tableRubriques = this.tableRubriques();
    if (tableRubriques) {
					this.ventilationRubriques = [];

					for (var rub of this.rubriques) {
						var montantARembourser = null;
						var montantResteAVerser = null;

						if (item != null) { //mode update
							montantARembourser = this.getMontantARembourserJustificatifByRubrique(rub.idRubrique, item['montantJustifRemboursement']);
							montantARembourser = ((montantARembourser != '' && montantARembourser != 0) ? app.formatNumber(montantARembourser) : null);
						}

						this.ventilationRubriques.push({
							'rubriqueId': rub.idRubrique,
							["libelle_rubrique"]: rub.libelleRubrique,
							["montantRegle"]: (rub.montantFinalA != 0) ? rub.montantFinalA : (rub.montantFinalB != 0) ? rub.montantFinalB : (rub.montantFinalC != 0) ? rub.montantFinalC : rub.montantFinalAvance,
							["resteAVerser"]: (rub.montantResteAVerserA != 0) ? rub.montantResteAVerserA : (rub.montantResteAVerserB != 0) ? rub.montantResteAVerserB : (rub.montantResteAVerserC != 0) ? rub.montantResteAVerserC : rub.montantResteAVerser,
							["mntARembourser"]: montantARembourser,
							"collumnsDisabled": { ["montantRegle"]: true, ["resteAVerser"]: true, ["mntARembourser"]: true },
							'rubriqueLevel': rub.levelRubrique,
						});
					}

					await app.sleep(500);

					tableRubriques.getItems();
				}

				// await this.rubriquesComponent.getRubriques(this.documentContractuel.autre_devise != null ? this.documentContractuel.autre_devise : [], this.documentContractuel, false, false, false, false, false, (this.documentContractuel != null ? this.documentContractuel.rubriques : null), true, null, ddrDevise, this.reglement, item);
			}

			await app.sleep(100);
		}

		appFormio.loadFormIO('justificatifRemboursement', true);

		await app.sleep(250);

		//récup le toggle type remboursement + devise
		appFormio.selectToggle(crossVars.forms['formio_justificatifRemboursement'], 'type', DO.typeRemboursement);
		app.disableToggle(crossVars.forms['formio_justificatifRemboursement'], 'type');

		appFormio.setDataValue(crossVars.forms['formio_justificatifRemboursement'], 'devise', DO.devise_remboursement);

		if (app.isAFD(this.entite)) {
			this.teleportDcJustifRemboursement().teleport();
			this.teleportDcJustifRemboursement().show();
			this.teleportRubriquesRemboursement().teleport();
			this.teleportRubriquesRemboursement().show();
		}

		this.loading = false;

		this.contentTitle = lang.subJustifRemb;

		app.showElement('formio_justificatifRemboursement');

		console.timeEnd('info-justif-remboursement');
	}

	async gotoJustificatifAC(item: any) {
		console.time('info-justif-avance');

		this.showRepriseVersement = (item.obj_ext_id != null);
		this.loading = true;
		this.contentTitle = null;
		this.showSidebarDR = false;
		this.sidebarSelected = 'J' + item.persistenceId;
		this.dernierJustifValue = (item.dernier_justificatif == "Y");

		app.hideElement('formio_justificatifReglement');
		app.hideElement('formio_justificatifRemboursement');
		app.hideElement('formio_documentContractuel');
		app.hideElement('formio_reglement' + this.entite);
		app.hideElement('formio_justificatifAvance' + this.entite);
		if (app.isAFD(this.entite))
			app.hideElement('formio_avanceContractuelAFDFinal');
		else
			app.hideElement('formio_avanceContractuelPROPARCOFinal');

		this.infosReglementAvance().teleportEmetteurJustificatifAvance().unteleport();

		app.cleanDiv('formio_justificatifAvance' + this.entite);

		var DO = app.getDO('justificatifAvance');

		if (item != null) {
			app.mapDO(DO, item);

			DO.persistence_id = item.persistenceId;
		}

		app.setBDM(DO);

		appFormio.loadFormIO('justificatifAvance' + this.entite, true);

		await app.sleep(250);

		if (!app.isAFD(this.entite) && item != null)
			appFormio.setDataValue(crossVars.forms['justificatifAvance' + this.entite], 'numero_justificatif', item.numero_justificatif);

		this.getEmetteurJustificatifAV(item.emetteur);

		this.infosReglementAvance().teleportEmetteurJustificatifAvance().teleport();
		this.infosReglementAvance().teleportEmetteurJustificatifAvance().show();

		this.loading = false;

		this.contentTitle = lang.subJustifAvance;

		this.showJAC = true;

		app.showElement('formio_justificatifAvance' + this.entite);

		console.timeEnd('info-justif-avance');
	}

	async getEmetteurJustificatif(idEmetteur?: any) {
		var numeroConcours = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours');

		if (!app.isEmpty(idEmetteur)) {
			if (!app.isPaiementDirect(this.versement.modalite_paiement))
				await this.infosEmetteurJustificatif().getBeneficiaire(null, null, idEmetteur, numeroConcours, 'JR');
			else
				await this.infosEmetteurJustificatif().getBeneficiaire(null, null, idEmetteur, null, 'JDC');
		}
	}

	async getEmetteurJustificatifAV(emetteur?: any) {
		var numeroConcours = appFormio.getDataValue(crossVars.forms['formio_reglement' + this.entite], 'numero_concours');
		if (!app.isEmpty(emetteur)) {
			const infosEmetteurJustificatifAvance = this.infosReglementAvance().infosEmetteurJustificatifAvance();
			const infosReglementAvance = this.infosReglementAvance();
			infosReglementAvance.objectParentRepris = !app.isEmpty(this.avanceContractuel.obj_ext_id);
			await infosEmetteurJustificatifAvance.getBeneficiaire(null, null, emetteur, numeroConcours, 'JA');
		}
	}

	changeMontantReglement() { }

	verifMontantDDR(input: any) { }

	getMessagesErrorMontantDDR(input: any) { }

	renderPourcentageAvance(value: any) {
		if (value != null)
			return value + ' %';
		return '';
	}

	renderMontantAvance(montant: any, devise: any) {
		if (montant != null && devise != null)
			return app.formatMontantTrigramme(app.formatNumberWithDecimals(montant), devise);
		return '';
	}

	getMontantJustificatifByRubrique(id: any, items: any) {
		for (var item of items)
			if (item.id_rubrique == id)
				return item.montant_a_payer;
		return '';
	}

	getMontantARembourserJustificatifByRubrique(id: any, items: any) {
		for (var item of items)
			if (item.id_rubrique == id)
				return item.montant_a_rembourser;
		return '';
	}

	getLabelDeviseByTypeDeviseRegSelected(typeDevise: any) {
		if (typeDevise == "0")
			this.labelDeviseSelected = lang.reglement.deviseReference;
		else
			this.labelDeviseSelected = lang.reglement.deviseReglement;
	}

	getCoordonneeBancaire(coordonneesBancaire: any, idCoordonneBancaire: any) {
		if (coordonneesBancaire != null && coordonneesBancaire.length > 0 && !app.isEmpty(idCoordonneBancaire))
			for (var item of coordonneesBancaire)
				if (item.swiftCompte.id == idCoordonneBancaire)
					return item.swiftCompte;
		return null;
	}

	switchToUpdate() {
		app.hideModal('detailsDemandeReglement');

		app.redirect(this.router, app.getUrl('urlGotoReglement', this.reglement.persistenceId));
	}
}