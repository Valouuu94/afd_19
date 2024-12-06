import { Component, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { TableComponent } from '../../components/table/table.component';
import { CommentsComponent } from '../../components/comments/comments.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';
import { NgClass } from '@angular/common';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-projets',
    templateUrl: './projets.component.html',
    standalone: true,
    imports: [NavActionsComponent, BtnComponent, ContentComponent, CardComponent, NgClass, SpinnerComponent, CommentsComponent, TableComponent, ModalComponent]
})
export class ProjetsComponent implements OnInit {

	readonly tableProjets = viewChild.required<TableComponent>('tableProjets');
	readonly tableConcours = viewChild.required<TableComponent>('tableConcours');
	readonly tableDC = viewChild.required<TableComponent>('tableDC');
	readonly tableAvance = viewChild.required<TableComponent>('tableAvance');
	readonly tableDdv = viewChild.required<TableComponent>('tableDdv');
	readonly tableDdr = viewChild.required<TableComponent>('tableDdr');
	readonly tableAnomalies = viewChild.required<TableComponent>('tableAnomalies');
	readonly tableDDC = viewChild.required<TableComponent>('tableDDC');
	readonly tableDDCRaj = viewChild.required<TableComponent>('tableDDCRaj');

	entite: any;
	perimetre: any;
	isDCV: boolean = false;
	isAFD: boolean = true;
	lang: any = lang;
	app: any = app;
	loading: boolean = false;
	sidebarSelected: any;
	subType: any;
	read: boolean = false;

	// PROJET
	loadingProjets: boolean = false;
	projets: any;
	projet: any;
	numProjet: any;
	DLVFProjet: any;
	impayeProjet: any;
	montantInitial: any;
	montantFinal: any;
	montantVerseDC: any;
	montantVerseHorsDC: any;
	montantVerseAvance: any;
	montantVerseTotalVerso: any;
	montantVerseTotalGCF: any;
	montantRAVVerso: any;
	montantRAVReel: any;
	montantRAV: any;
	montantRAJ: any;
	montantsProjet: any;
	remboursementProjet: any;

	// CONCOURS
	montantsConcours: any;
	concours: any;
	numConcours: any;
	libelleConcours: any;
	detailConcours: any;
	montantInitialConcours: any;
	montantFinalConcours: any;
	montantVerseDCConcours: any;
	montantVerseHorsDCConcours: any;
	montantVerseAvanceConcours: any;
	montantVerseConcours: any;
	montantRAVConcours: any;
	montantRAJConcours: any;
	montantVerseTotalVersoConcours: any;
	montantVerseTotalGCFConcours: any;
	montantRAVVersoConcours: any;
	montantRAVReelConcours: any;
	remboursementConcours: any;
	itemsByPage: number = 10;

	//DC + AVANCE
	DC: any = [];
	avances: any = [];
	anomalies: any = [];
	dossiersVersement: any = [];
	dossiersReglement: any = [];
	DDC: any = [];
	DDCRaj: any = [];
	DDCLength: any = 0;
	DDCRajLength: any = 0;

	constructor(private router: Router, private route: ActivatedRoute, private store: StoreService) { }

	async ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);
		this.isAFD = app.isAFD(this.entite);
		this.subType = null;
		this.loading = true;

		if (app.isAuditeur(this.store.getUserRole()))
			this.read = true;

		if (!app.isEmpty(this.route.snapshot.paramMap.get('numProjet'))) //ouverture d'un projet via l'url
			app.setLocalStorageItem('projet', this.route.snapshot.paramMap.get('numProjet'));

		if (!app.isEmpty(this.route.snapshot.paramMap.get('numConcours'))) //ouverture d'un concours via l'url
			this.numConcours = this.route.snapshot.paramMap.get('numConcours');

		if (!app.isEmpty(this.route.snapshot.paramMap.get('type'))) //ouverture d'un sous element via l'url
			this.subType = this.route.snapshot.paramMap.get('type');

		await app.sleep(100);

		this.numProjet = app.getLocalStorageItem('projet'); //chargement des id stockés dans le storage du navigateur

		await this.getProjets();

		if (!app.isEmpty(this.numProjet)) {
			await this.showProjet();

			//ouverture des sous elements par l'url  
			if (this.numConcours != null) {
				await this.showConcours();

				for (var c of this.concours)
					if (c.numeroConcours == this.numConcours)
						this.gotoDetailConcours(c);
			}
			else if (this.subType == 'DC')
				this.showDC();
			else if (this.subType == 'AVANCE')
				this.showAvance();
			else if (this.subType == 'DDV')
				this.showDdv();
			else if (this.subType == 'DDR')
				this.showDdr();
			else if (this.subType == 'DDC')
				this.showDDC();
			else if (this.subType == 'DDCRaj')
				this.showDDCRaj();
		}

		this.loading = false;
	}

	// ### PROJETS ###
	searchProjets() {
		app.showModal('modalSearchProjet');
	}

	async getProjets() { //chargement de le liste des projets
		this.loadingProjets = true;

		this.projets = await app.getExternalData(app.getUrl('urlGetProjetsByEntiteAndUserId', this.entite, this.store.getUserName()), 'getProjets');

		if (app.isEmpty(this.numProjet) && this.projets != null && this.projets.length > 0) {
			this.numProjet = this.projets[0].numeroProjet;

			app.setLocalStorageItem('projet', this.projets[0].numeroProjet);
		}

		this.loadingProjets = false;

		await app.sleep(250);

		this.tableProjets().getItems();
	}

	async selectProjet(item: any) {
		this.numProjet = item.numeroProjet;

		app.setLocalStorageItem('projet', item.numeroProjet);

		// this.tableProjets.setClickInProgress(false);

		app.hideModal('modalSearchProjet');

		this.showProjet();
	}

	async showProjet() {
		this.loading = true;

		this.sidebarSelected = 'PROJET';

		this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.numProjet), 'projets > showProjet', true);

		this.concours = await app.getExternalData(app.getUrl('urlGetConcoursGCFByProjet', this.numProjet), 'projets > showProjet > getConcoursGCF');

		this.itemsByPage = this.concours.length;

		//recuperation des montants
		this.montantsProjet = await app.getExternalData(app.getUrl('urlGetMontantVueProjetConcours', this.numProjet, this.projet.entite), 'projets > getMontantsVueProjet by projet-entite');

		//calculs des infos projet
		this.impayeProjet = app.renderEmpty(await app.getImpayeSIRP(this.concours, this.entite, this.projet));
		this.DLVFProjet = (!app.isAFD(this.entite)) ? app.renderEmpty(await app.getDLVFMax(this.concours)) : app.renderEmpty(null);

		//montants projet
		this.montantInitial = app.renderEmpty(app.montantInitialProjet(this.concours, this.projet));
		this.montantFinal = app.renderEmpty(app.montantTotal(this.concours, this.projet));
		this.montantRAV = app.sommeRav(this.concours, this.entite, this.projet);
		this.montantRAVReel = app.renderEmpty(this.montantRAV);
		this.montantVerseTotalGCF = app.renderEmpty(app.sommeTotalVerse(this.concours, this.entite, this.projet));
		this.montantVerseTotalVerso = '';
		this.montantRAVVerso = '';
		this.montantVerseDC = '';
		this.montantVerseHorsDC = '';
		this.montantVerseAvance = '';
		this.montantRAJ = '';
		this.remboursementProjet = app.getRefLabel('refBoolean', this.montantsProjet.remboursement);
		for (var mntDv of this.montantsProjet.montantDdrAvecDC)
			if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise))
				this.montantVerseDC += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		for (var mntDv of this.montantsProjet.montantDdrHorsDC)
			if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise))
				this.montantVerseHorsDC += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		for (var mntDv of this.montantsProjet.montantDdrAvance)
			this.montantVerseAvance += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		for (var mntDv of this.montantsProjet.montantVerseTotal)
			if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise))
				this.montantVerseTotalVerso += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		if (app.isEmpty(this.montantsProjet.montantDdrEnCours))
			this.montantRAVVerso = this.montantRAVReel;

		if (!app.isEmpty(this.montantsProjet.montantDdrEnCours)) {
			const calculatedValuesByDevise: { [key: string]: string } = {}; // Provide type annotation

			for (const mntDv of this.montantsProjet.montantDdrEnCours) {
				if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise)) {
					const montant = parseFloat(mntDv.montant);
					const montantRAV = parseFloat(this.montantRAV.montant);

					if (!isNaN(montant) && !isNaN(montantRAV)) {
						if (mntDv.devise == this.montantRAV.devise) {
							// Calculate and update values for matching devise
							this.montantRAV.montant = (montantRAV - montant).toFixed(2);
							calculatedValuesByDevise[mntDv.devise] = app.renderEmpty(app.formatNumberWithDecimals(this.montantRAV.montant) + ' <span class="trigramme-devise">' + this.montantRAV.devise + '</span>' + '<br>');
						} else {
							// Calculate and update values for non-matching devises
							calculatedValuesByDevise[mntDv.devise] = app.renderEmpty(app.formatNumberWithDecimals(montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');
						}
					}
				}
			}

			// Combine calculated values for all devises
			this.montantRAVVerso = Object.values(calculatedValuesByDevise).join('');
		}

		for (var mntDv of this.montantsProjet.montantRajAvance)
			this.montantRAJ += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		if (this.montantVerseDC == '')
			this.montantVerseDC = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), app.renderEmpty(this.projet.idDevise));
		if (this.montantVerseHorsDC == '')
			this.montantVerseHorsDC = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), app.renderEmpty(this.projet.idDevise));
		if (this.montantVerseAvance == '')
			this.montantVerseAvance = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), app.renderEmpty(this.projet.idDevise));
		if (this.montantVerseTotalVerso == '')
			this.montantVerseTotalVerso = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), app.renderEmpty(this.projet.idDevise));
		if (this.montantRAVVerso == '')
			this.montantRAVVerso = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), app.renderEmpty(this.projet.idDevise));
		if (this.montantRAJ == '')
			this.montantRAJ = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), app.renderEmpty(this.projet.idDevise));

		//concours
		for (var c of this.concours) {
			if (this.projet != null && this.projet.listConcours != null) {
				for (var cp of this.projet.listConcours) {
					if (cp.numeroConcours == c.numeroConcours) { //recopie des données entre les tableaux des concours
						c.numeroConvention = cp.convention?.numeroConvention;
						c.dateSignature = cp.convention?.dateSignature;
						c.libelleConvention = cp.convention?.objet;
						c.resteAVerser = app.formatMontantTrigramme(app.formatNumberWithDecimals(c.resteAVerser), cp.idDevise);
						c.idDevise = cp.idDevise;
						c.produitFinancier = ((cp.produit != null) ? cp.produit.libelleCourtProduit : '');
						c.idFamilleProduit = ((cp.produit != null && cp.produit.familleProduit != null) ? cp.produit.familleProduit.libelleCourtFamilleProduit : '');
						c.operation = ((cp.operation != null) ? cp.operation.libelleCourtOperation : '');
						c.dateAchevement = this.projet.dateAchevementOperationnel;
						c.dateOctroi = this.projet.dateOctroi;
						// c.impaye = app.renderEmpty(await app.getImpayeSIRP([c], this.entite, this.projet));
						c.impaye = ((c.impayesSIRP > 0) ? '1' : '0'); // ?
						c.moad = 0; //TODO

						c.beneficiairePrimaire = '';
						if (cp.concoursTiers != null && cp.concoursTiers.length > 0)
							for (var b of cp.concoursTiers)
								if (b.typeRole != null && b.typeRole.idTypeRole == 24)
									c.beneficiairePrimaire = app.getRefLabel('refBeneficiaires', b.idTiers);
						break;
					}
				}
			}
		}

		//TODO : verifier les codes mapping
		//intervenants
		this.projet.intervenantCA = '';
		this.projet.intervenantCAF = '';
		this.projet.intervenantCAFS = '';
		this.projet.intervenantCAFD = '';
		if (this.projet.projetIntervenants != null && this.projet.projetIntervenants.length > 0) {
			for (var i of this.projet.projetIntervenants) {
				if (i.typeRole != null && i.intervenant != null) {
					if (i.typeRole.idTypeRole == 10) //charge appui
						this.projet.intervenantCA = i.intervenant.nom;
					else if (i.typeRole.idTypeRole == 124) //charge affaire
						this.projet.intervenantCAF = i.intervenant.nom;
					else if (i.typeRole.idTypeRole == 120) //charge affaire suppleant
						this.projet.intervenantCAFS = i.intervenant.nom;
					else if (i.typeRole.idTypeRole == 9) //charge affaire DAF
						this.projet.intervenantCAFD = i.intervenant.nom;
				}
			}
		}

		this.loading = false;
	}

	// ### CONCOURS ###
	async showConcours() {
		this.sidebarSelected = 'CONCOURS';

		await app.sleep(250);

		this.tableConcours().getItems();
	}

	async gotoDetailConcours(item: any) {
		app.log('gotoDetailConcours', item);

		this.detailConcours = item;

		//montants concours
		this.montantInitialConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(item.montantInitial), item.idDevise);
		this.montantFinalConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(item.montantEngagementsNets), item.idDevise);
		this.montantVerseConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(item.montantVersementsEffectues), item.idDevise);
		this.montantRAVConcours = item.resteAVerser;
		this.detailConcours.impayesSIRP = app.formatMontantTrigramme(app.formatNumberWithDecimals(item.impayesSIRP), item.idDevise);

		this.montantsConcours = await app.getExternalData(app.getUrl('urlGetMontantVueConcours', item.numeroConcours, this.projet.entite, item.idDevise), 'projets > getMontantsConcours');
		this.montantVerseTotalVersoConcours = '';
		this.montantRAVVersoConcours = '';
		this.montantVerseDCConcours = '';
		this.montantVerseHorsDCConcours = '';
		this.montantVerseAvanceConcours = '';
		this.montantRAJConcours = '';
		this.remboursementConcours = app.getRefLabel('refBoolean', this.montantsConcours.remboursement);

		for (var mntDv of this.montantsConcours.montantDdrAvecDC)
			if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise))
				this.montantVerseDCConcours += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		for (var mntDv of this.montantsConcours.montantDdrHorsDC)
			if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise))
				this.montantVerseHorsDCConcours += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		for (var mntDv of this.montantsConcours.montantDdrAvance)
			this.montantVerseAvanceConcours += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		for (var mntDv of this.montantsConcours.montantVerseTotal)
			if (!app.isEmpty(mntDv.montant) && !app.isEmpty(mntDv.devise))
				this.montantVerseTotalVersoConcours += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		var montantsDDR = 0;
		var ravPrevisionnelCr;

		for (var mntDdr of this.montantsConcours.montantDdrEnCours) {
			if (!app.isEmpty(mntDdr.montant) && !app.isEmpty(mntDdr.devise))
				montantsDDR += mntDdr.montant;
		}

		var montantRav = item.resteAVerser.substring(0, item.resteAVerser.indexOf("<"));

		ravPrevisionnelCr = parseFloat((!app.isEmpty(montantRav) ? montantRav : "").toString().replace(',', '.').replace(/\s/g, '')) - montantsDDR;

		this.montantRAVVersoConcours = app.renderEmpty(app.formatNumberWithDecimals(ravPrevisionnelCr != 0 ? ravPrevisionnelCr : 0) + ' <span class="trigramme-devise">' + item.idDevise + '</span>' + '<br>');

		for (var mntDv of this.montantsConcours.montantRajAvance)
			this.montantRAJConcours += app.renderEmpty(app.formatNumberWithDecimals(mntDv.montant) + ' <span class="trigramme-devise">' + mntDv.devise + '</span>' + '<br>');

		if (this.montantVerseDCConcours == '')
			this.montantVerseDCConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), item.idDevise);
		if (this.montantVerseHorsDCConcours == '')
			this.montantVerseHorsDCConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), item.idDevise);
		if (this.montantVerseAvanceConcours == '')
			this.montantVerseAvanceConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), item.idDevise);
		if (this.montantRAJConcours == '')
			this.montantRAJConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), item.idDevise);
		if (this.montantVerseTotalVersoConcours == '')
			this.montantVerseTotalVersoConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), item.idDevise);
		if (this.montantRAVVersoConcours == '')
			this.montantRAVVersoConcours = app.formatMontantTrigramme(app.formatNumberWithDecimals(0), item.idDevise);

		this.showConcoursDetail();

		app.scrollToTop();
	}

	saveConcours() {
		this.showConcours();
	}

	showConcoursDetail() {
		this.sidebarSelected = 'CONCOURS_DETAIL';
	}

	// ### AVANCE ###
	async showAvance() {
		this.sidebarSelected = 'AVANCE';

		await app.sleep(250);

		await this.getAvance();
	}

	async getAvance() {
		this.tableAvance().setLoading(true);

		this.avances = await app.getExternalData(app.getUrl('urlGetAvanceContractuels', this.numProjet), 'page > projets > getAvance');

		for (var avance of this.avances) {
			avance.typologie = app.getRefLabel('refTypeAvance', avance.choix_type_avance);
			avance.dljf = avance.date_ljf_final != null ? avance.date_ljf_final : avance.date_ljf_initial;
			var raj = 0;
			var mntVerseTotal = app.isEmpty(avance.montant_verse_total) ? 0 : avance.montant_verse_total;
			var mntJustifieTotal = app.isEmpty(avance.montant_justifie_total) ? 0 : avance.montant_justifie_total;

			raj = mntVerseTotal - mntJustifieTotal;

			avance.renderRaj = ((raj < 0) ? '<span class="text-danger">' : '') + app.formatMontantTrigramme(app.formatNumberWithDecimals(raj), avance.devise_avance) + ((raj < 0) ? '</span>' : '');
			avance.renderMntVerseTotal = app.formatMontantTrigramme(app.formatNumberWithDecimals(mntVerseTotal), avance.devise_avance);
		}

		await app.sleep(250);

		this.tableAvance().getItems();
	}

	async gotoAvance(item?: any) {
		app.setStorageItem('originGoto', 'projet');
		app.setStorageItem('numeroConcours', null);

		app.setStorageItem('numeroProjet', this.projet.numeroProjet);

		if (item != null) {
			app.setStorageItem('numeroConcours', item.numero_concours);

			app.redirect(this.router, app.getUrl('urlGoToAvance', item.persistenceId));
		} else
			app.redirect(this.router, app.getUrl('urlAddAvance'));
	}

	// ### DC ###
	async showDC() {
		this.sidebarSelected = 'DC';

		await app.sleep(250);

		await this.getDC();
	}
	renderMontantsDC(dcVar: any) {
		var rendermontantAFD = app.formatMontantTrigramme(app.formatNumberWithDecimals((dcVar.montant_afd == null ? 0 : dcVar.montant_afd)), app.renderEmpty(dcVar.devise_afd));
		var renderRavReel = app.formatMontantTrigramme(app.formatNumberWithDecimals((dcVar.reste_a_verser_reel_dc == null ? dcVar.montant_afd : dcVar.reste_a_verser_reel_dc)), app.renderEmpty(dcVar.devise_afd));
		if (dcVar.autre_devise != null && dcVar.autre_devise.length > 0) {
			for (var autreDevise of dcVar.autre_devise) {
				rendermontantAFD += '<br>' + app.formatMontantTrigramme(app.formatNumberWithDecimals(autreDevise.montant), autreDevise.devise);
				renderRavReel += '<br>' + app.formatMontantTrigramme(app.formatNumberWithDecimals(autreDevise.reste_a_verser_reel_dc == null ? autreDevise.montant : autreDevise.reste_a_verser_reel_dc), autreDevise.devise);
			}
		}
		dcVar.rendermontantAFD = rendermontantAFD;
		dcVar.renderRavReel = renderRavReel;

		return dcVar;
	}
	async getDC() {
		this.tableDC().setLoading(true);

		this.DC = await app.getExternalData(app.getUrl('urlGetDocumentsContractuel', this.numProjet), 'page > projets > getDC');
		for (var dcVar of this.DC)
			dcVar = this.renderMontantsDC(dcVar);

		await app.sleep(250);

		this.tableDC().getItems();
	}

	gotoDC(item?: any) {
		app.setStorageItem('originGoto', 'projet');

		if (item != null)
			app.redirect(this.router, app.getUrl('urlGoToDocumentContractuel', item.persistenceId));
		else {
			app.setStorageItem('numeroProjetDC', this.numProjet);
			app.redirect(this.router, app.getUrl('urlAddDocumentContractuel'));
		}
	}

	// ### DDV ###
	async showDdv() {
		this.sidebarSelected = 'DDV';

		await app.sleep(250);

		await this.getDdv();
	}

	async getDdv() {
		this.tableDdv().setLoading(true);

		this.dossiersVersement = await app.getExternalData(app.getUrl('urlGetVersementsByNumProjet', this.numProjet), 'page > projets > getDvs');
		this.projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.numProjet), 'projets > showProjet', true);

		if (this.dossiersVersement != null) {
			for (var versement of this.dossiersVersement) {
				versement.canceled = (app.isDossierAnnule(versement.code_statut_dossier) ? true : false);
				versement.renderMontantDv = app.renderMontantDv(versement);
				versement.tiers = app.isAFD(this.entite) ? app.getRefLabel('refBeneficiaires', versement.id_emetteur_demande) : app.getRefLabel('refBeneficiaires', versement?.dossier_reglement[0]?.id_beneficiaire_reglement);
				versement.renderAgenceGestion = app.isAFD(this.entite) ? this.projet.idAgenceGestion : app.getRefLabel('refDivision', this.projet.idDivisionProparco);
				versement.renderTraitant = app.getRefLabel('refUsers', versement.initiateur);

				if (!this.isAFD && !app.verifEcheancesPROARCO(versement))
					versement.customClass = 'text-danger';
			}
		}

		await app.sleep(250);

		this.tableDdv().getItems();
	}

	gotoDdv(item?: any) {
		app.setStorageItem('originGoto', 'projet');
		var url = '';

		if (item != null) {
			if (item.montant_versement == null) {
				url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoVersement', item.persistenceId);
				const newTab = window.open(url, '_blank');
			} else {
				if (app.isAFD(this.entite))
					url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoVersementReglements', item.persistenceId);
				else {
					url = (item.code_statut_dossier == "DDV1") ? (document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoVersementReglements', item.persistenceId)) : (document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoVersementControles', item.persistenceId));
				}
				const newTab = window.open(url, '_blank');
			}
		}
		// this.tableDdv.setClickInProgress(false);
	}

	// ### DDR ###
	async showDdr() {
		this.sidebarSelected = 'DDR';

		await app.sleep(250);

		await this.getDdr();
	}

	async downloadFile(reglement: any) {
		await app.downloadDocument(reglement, true);
	}

	async getDdr() {
		this.tableDdr().setLoading(true);

		var ddrs = await app.getExternalData(app.getUrl('urlGetReglementsByNumProjet', this.numProjet), 'page > projets > getDrs');

		this.dossiersReglement = await app.mergeDataConcoursWithDDRs(ddrs, this.numProjet);

		await app.sleep(250);

		this.tableDdr().getItems();
	}

	async gotoDdr(item?: any) {
		app.setStorageItem('originGoto', 'projet');

		if (!(app.isAFD(this.entite)))
			var versement = await app.getExternalData(app.getUrl('urlGetVersementByNumero', item.numero_dossier_versement), 'page-projets > getVersement', true);

		if (item != null) {
			const url = (app.isAFD(this.entite) || this.isDCV) ? document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoReglementControlesForceLvl1', item.persistenceId) : document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoVersementReglements', versement.persistenceId);
			const newTab = window.open(url, '_blank');
		}
		// this.tableDdr.setClickInProgress(false);
	}

	// ### Anomalies ###
	async showAnomalies() {
		this.sidebarSelected = 'ANO';

		await app.sleep(250);

		await this.getAnomalies();
	}

	async getAnomalies() {
		this.tableAnomalies().setLoading(true);

		this.anomalies = await app.getExternalData(app.getUrl('urlGetAnomaliesAllByproject', this.numProjet), 'page > historique-anomalies > getAnomalies');

		await app.sleep(250);

		this.tableAnomalies().getItems();
	}

	gotoAnomalies(item?: any) {
		app.setStorageItem('originGoto', 'projet');
		var url = '';

		if (item.typeAno == "zero")
			url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoHistoriqueAnomalieRajZero', item.persistenceIdAnomalie);
		else if (item.typeAno == "default")
			url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoHistoriqueAnomalieRajDefaut', item.persistenceIdAnomalie);
		else
			url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoHistoriqueAnomalie', item.persistenceIdAnomalie);

		const newTab = window.open(url, '_blank');

		// this.tableAnomalies.setClickInProgress(false);
	}

	// ### DOSSIERS DE CONTROLES ###
	async showDDC() {
		this.sidebarSelected = 'DDC';

		await app.sleep(250);

		await this.getDDC();
	}

	async getDDC() {
		this.tableDDC().setLoading(true);

		this.DDC = await app.getExternalData(app.getUrl('urlGetDossiersControlesByProjet', this.numProjet), 'page > historique-dossiers-controles > getDossiersControles');

		if (this.DDC.length > 0)
			this.DDCLength = this.DDC.length;

		await app.sleep(250);

		this.tableDDC().getItems();
	}

	gotoDDC(item?: any) {
		app.setStorageItem('originGoto', 'projet');

		const url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoHistoriqueDossier', item.persistenceId);
		const newTab = window.open(url, '_blank');

		// this.tableDDC.setClickInProgress(false);
	}

	// ### DOSSIERS DE CONTROLES RAJ ###
	async showDDCRaj() {
		this.sidebarSelected = 'DDCRaj';

		await app.sleep(250);

		await this.getDDCRaj();
	}

	async getDDCRaj() {
		this.tableDDCRaj().setLoading(true);

		this.DDCRaj = await app.getExternalData(app.getUrl('urlGetDossiersControlesRAJByProjet', this.numProjet), 'page > historique-dossiers-controles-raj > getDossiersControlesRaj');

		if (this.DDCRaj.length > 0)
			this.DDCRajLength = this.DDCRaj.length;

		await app.sleep(250);

		this.tableDDCRaj().getItems();
	}

	gotoDDCRaj(item?: any) {
		app.setStorageItem('originGoto', 'projet');

		const url = document.location.origin + document.location.pathname + '#' + app.getUrl('urlGotoHistoriqueDossierRaj', item.persistenceId)
		const newTab = window.open(url, '_blank');

		// this.tableDDCRaj.setClickInProgress(false);
	}

	showToastSaveComment(value: any) {
		if (value) {
			app.showToast('toastSaveCommentSuccessProjets');
		} else {
			app.showToast('toastSaveErrorProjets');
		}

	}
}