import { Location, NgIf, NgFor, NgClass } from '@angular/common';
import { Component, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { InfosContextComponent } from '../../components/infos-context/infos-context.component';
import { CardComponent } from '../../components/card/card.component';
import { ContentComponent } from '../../components/content/content.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { NavActionsComponent } from '../../components/nav-actions/nav-actions.component';
import { StoreService } from '../../services/store.service';


declare const app: any;
declare const lang: any;
declare const $: any;
declare const actionsAnomalie: any;

@Component({
    selector: 'app-anomalie',
    templateUrl: './anomalie.component.html',
    standalone: true,
    imports: [NavActionsComponent, NgIf, BtnComponent, ContentComponent, CardComponent, InfosContextComponent, SpinnerComponent, FormsModule, NgFor, NgClass, ModalComponent]
})
export class AnomalieComponent implements OnInit {

	readonly modalConfirmationValiderAnomalie = viewChild.required<ModalComponent>('modalConfirmationValiderAnomalie');
	readonly btnSaveAnomalie = viewChild.required<BtnComponent>('btnSaveAnomalie');

	app: any = app;
	lang: any = lang;
	actionsAnomalie: any = actionsAnomalie;
	anomalie: any;
	idAnomalie: any;
	currentUserId: any;
	currentUserName: any;
	currentUserRole: any;
	currentDate: any;
	commentaire: any;
	action: any;
	numeroISIMAN: any;
	numeroISIMANValide: any;
	liens: any;
	isAgent: boolean = false;
	isManagerDCV: boolean = false;
	tache: any;
	read: boolean = true;
	existMyComment: boolean = false;
	existMyCommentLast: boolean = false;
	reglement: any;
	avanceContractuel: any;
	avanceContractuelRajZero: any;
	avanceContractuelRajDefaut: any;
	showSidebar: boolean = true;
	dossiercontrole: any;
	loading: boolean = true;
	avanceContractuelRajControle: any;
	entite: any;
	isAnoRaj: boolean = false;
	isAnoRajDefaut: boolean = false;
	isAnoSaved: boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService, private location: Location) { }

	ngOnInit() {
	}

	async ngAfterViewInit() {
		this.currentDate = app.getDate();
		this.currentUserName = this.store.getUserContext().prenom + ' ' + this.store.getUserContext().nom;
		this.currentUserId = this.store.getUserContext().idUtilisateur;

		this.isAgent = app.isAgentVersement(this.store.getUserRole());
		this.isManagerDCV = app.isManagerDCV(this.store.getUserRole());

		this.entite = this.store.getUserEntite();

		this.liens = [];
		this.ajouterLien();

		await this.getAnomalie();
	}

	get titleSidebarToggle() {
		return (this.showSidebar) ? lang.context.sidebarCompress : lang.context.sidebarExpand;
	}

	async getAnomalie() {
		this.loading = true;

		this.idAnomalie = this.route.snapshot.paramMap.get('id');
		this.isAnoRaj = (this.route.snapshot.paramMap.get('type') == 'raj');
		this.isAnoRajDefaut = (this.route.snapshot.paramMap.get('type') == 'raj-defaut');

		app.log('getAnomalie > idAnomalie, isAnoRaj, isAnoRajDefaut', this.idAnomalie, this.isAnoRaj, this.isAnoRajDefaut);

		if (this.idAnomalie == null) {
			console.error('page-anomalie > getAnomalie : id anomalie is null');
			return;
		}

		var anomalie = await app.getExternalData(app.getUrl('urlGetAnomalie', this.idAnomalie), 'page-anomalie > getAnomalie', true);

		this.read = await app.isReadTask(this, anomalie.case_id_traitement_anomalie, this.store.getUserId());

		if (this.isAnoRaj) {
			this.avanceContractuelRajZero = await app.getExternalData(app.getUrl('urlGetAvanceRAJZero', anomalie.case_id_dossier), 'page-anomalie > getAnomalie > getAvanceRajZero', true);;
			this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvance', this.avanceContractuelRajZero.persistenceId_avance_contractuel), 'page-anomalie-raj > getAvanceContractuel', true);
		} else if (this.isAnoRajDefaut) {
			this.avanceContractuelRajDefaut = await app.getExternalData(app.getUrl('urlGetAvanceRAJDefaut', anomalie.case_id_dossier), 'page-anomalie > getAnomalie > getAvanceRajZero', true);;
			this.avanceContractuel = await app.getExternalData(app.getUrl('urlGetAvance', this.avanceContractuelRajDefaut.persistenceId_avance_contractuel), 'page-anomalie-raj > getAvanceContractuel', true);
		} else
			this.reglement = await app.getExternalData(app.getUrl('urlGetReglementByCaseId2NdNiv', anomalie.case_id_dossier), 'page-anomalie > getAnomalie > getReglement', true);;

		this.anomalie = {
			id: anomalie.idAnomalie,
			code: anomalie.code_anomalie,
			codeFonctionnel: anomalie.code_fonctionnel,
			persistenceId: anomalie.persistenceId,
			caseId: anomalie.case_id_traitement_anomalie,
			libelle: anomalie.libelle_anomalie,
			commentaire: anomalie.commentaire,
			statut: anomalie.libelle_statut_anomalie,
			codeStatut: anomalie.code_statut_anomalie,
			regularisable: anomalie.regularisable,
			criticite: anomalie.gravite_anomalie,
			persistenceIdControle: anomalie.persistenceId_controle,
			theme: '',
			libellePC: '',
			numeroDC: '',
			libelleSPC: '',
			comments: [],
			numeroISIMAN: anomalie.numero_isiman,
			numeroISIMANValide: anomalie.numero_isiman_valide,
			action: anomalie.action_anomalie
		};

		this.numeroISIMAN = this.anomalie.numeroISIMAN;
		this.numeroISIMANValide = app.isTrue(this.anomalie.numeroISIMANValide);

		//modif lidia => anomalie 2292 => si la tache existe afficher le role qui est dans la description et pas tous les roles qui sont dasn la base
		if (!this.read)
			this.currentUserRole = app.getRefLabel('refRoles', app.getRoleTache(this.tache));

		await this.getAnomalieControle(anomalie.case_id_dossier);

		await this.getAnomalieComments();

		// si manager, analyse de la tache pour savoir si c'est specifique pour le manager ou pas, si c'est pas pour lui on lui donne un autre role 
		var userRole = this.store.getUserRole();
		if (this.isManagerDCV && this.tache != null && this.tache.description != null && this.tache.description.indexOf('MANAGER2ND') == -1) {
			this.isManagerDCV = false;

			if (this.tache.description.indexOf('CTRL2ND') != -1) { // si tache pour un controleur, on le passe CONTROLEUR (ANO 2043) 
				this.isAgent = false;
				userRole = 'CTRL2ND';

				console.warn('TASK NOT FOR MANAGER ACCESS --> CHANGE MANAGER TO CONTROLEUR');
			} else { //sinon on le passe AGENT
				this.isAgent = true;
				userRole = 'AGENTVERSEMENT';

				console.warn('TASK NOT FOR MANAGER ACCESS --> CHANGE MANAGER TO AGENT');
			}
		}

		if (this.anomalie.action != null) {
			if (app.existStringInArray(actionsAnomalie[userRole], this.anomalie.action) || this.read)
				this.action = this.anomalie.action;
			else
				this.action = "";
		}

		this.loading = false;
	}

	async getAnomalieControle(caseId: any) {
		var controle = await app.getExternalData(app.getUrl('urlGetControleById', this.anomalie.persistenceIdControle), 'page-anomalie > getAnomalieControle - controle', true);

		if (controle != null) {
			this.anomalie.libelleSPC = controle.libelle_controle_fr;
			this.anomalie.theme = app.getRefLabel('refControleThemeDCV', controle.theme);

			if (controle.parentObjectCaseId != null) {
				if (this.isAnoRaj || this.isAnoRajDefaut) {
					this.avanceContractuelRajControle = await app.getExternalData(app.getUrl(((this.isAnoRaj) ? 'urlGetAvanceRAJZero' : 'urlGetAvanceRAJDefaut'), caseId));

					if (this.avanceContractuelRajControle != null && this.avanceContractuelRajControle.length > 0)
						this.anomalie.numeroDC = this.avanceContractuelRajControle[0].code_fonctionnel;
				} else {
					this.dossiercontrole = await app.getExternalData(app.getUrl('urlGetReglementByCaseId2ndNiveau', caseId));

					if (this.dossiercontrole != null && this.dossiercontrole.length > 0)
						this.anomalie.numeroDC = this.dossiercontrole[0].code_fonctionnel;
				}
			}

			var controleParent = await app.getExternalData(app.getUrl('urlGetControleByParentCodeAndId', controle.parentControleCode, controle.parentObjectPersistenceId), 'page-anomalie > getAnomalieControle - controle parent', true);

			if (controleParent != null)
				this.anomalie.libellePC = ((app.getCurrentLang() == 'en') ? controleParent.libelle_controle_en : controleParent.libelle_controle_fr);
		}
	}

	async gotoDossier() {
		if (this.isAnoRaj || this.isAnoRajDefaut)
			app.redirect(this.router, app.getUrl('urlGotoHistoriqueDossierRaj', this.avanceContractuelRajControle[0].persistenceId));
		else
			app.redirect(this.router, app.getUrl('urlGotoHistoriqueDossier', this.dossiercontrole[0].persistenceId));
	}

	async getAnomalieComments() {
		var commentaires = await app.getExternalData(app.getUrl('urlGetCommentaires', this.anomalie.persistenceId));

		app.log('page-anomalie > getAnomalieComments', commentaires);

		var comments: any = [];
		var linksCount = 0;
		var commentsCount = 0;
		var commentsTextCount = 0;

		for (var commentaire of commentaires) {
			var liens: any = [];
			for (var lien of commentaire.liens) {
				liens.push({ value: lien });

				if (!app.isEmpty(lien))
					linksCount++;
			}

			//if (this.isAgent && app.isManagerDCV(commentaire.roleCommentaire)) //agent ne peut pas voir les commentaires d'un manager
			//	continue;

			comments.push({
				userName: commentaire.auteurCommentaire,
				userId: commentaire.acteurIdentifiant,
				userRole: app.getRefLabel('refRoles', commentaire.roleCommentaire),
				userInitials: app.getUserInitiales(commentaire.auteurCommentaire),
				date: commentaire.dateCommentaire,
				comment: commentaire.texteCommentaire,
				annule: ((commentaire.commentaireAnnule != null && commentaire.commentaireAnnule === true) ? true : false),
				persistenceId: commentaire.persistenceId,
				liens: liens
			});

			if (commentaire.commentaireAnnule == null || commentaire.commentaireAnnule === false)
				commentsCount++;

			if ((commentaire.commentaireAnnule == null || commentaire.commentaireAnnule === false) && !app.isEmpty(commentaire.texteCommentaire))
				commentsTextCount++;
		}

		//commentaire exist
		var i = 0;
		this.existMyComment = false;
		this.existMyCommentLast = false;
		for (var comment of comments) {
			if (comment.userId == this.currentUserId && !comment.annule) {
				this.existMyComment = true;
				if (comments.length - 1 == i)
					this.existMyCommentLast = true;
			} else
				this.existMyComment = false;
			i++;
		}

		this.anomalie.comments = comments;
		this.anomalie.commentCount = commentsCount;
		this.anomalie.commentTextCount = commentsTextCount;
		this.anomalie.linksCount = linksCount;
	}

	async editCommentaire(item: any) {
		this.existMyComment = false;
		this.existMyCommentLast = false;

		this.commentaire = item.comment;
		this.liens = item.liens;

		item.annule = true;

		this.annuleCommentaire(item);
	}

	async annuleCommentaire(item: any) {
		var DO = app.getDO('commentaire');
		DO.typePartentObject = 'anomalie';
		DO.persistanceIdParentObject = this.anomalie.persistenceId;
		DO.caseIdParentObject = this.anomalie.caseId;
		DO.texteCommentaire = item.comment;
		DO.persistenceId = item.persistenceId;
		DO.commentaireAnnule = true;

		var liens: any = [];
		for (var lien of item.liens)
			liens.push(lien.value);
		DO.liens = liens;

		await app.saveFormData(app.getRootDO('commentaire'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessAddCommentaire'));
	}

	getConfirmMessage() {
		if (this.anomalie != null) {
			if (this.isAgent) {
				if (this.anomalie.regularisable)
					return lang.anomalie.confirmRegularisable;
				else if (!this.anomalie.regularisable)
					return lang.anomalie.confirmNonRegularisable;
			} else {
				if (this.isCritiqueManager()) {
					if (this.action == 'AVEC_INCIDENT')
						return lang.anomalie.confirmCritiqueActionAvecIncident;
					else if (this.action == 'SANS_INCIDENT')
						return lang.anomalie.confirmCritiqueActionSansIncident;
					else
						return lang.anomalie.confirmCritiqueActionAbandon;
				} else {
					if (!this.isAnoRajDefaut && this.isCritique() && this.action == 'DECLAR' && this.numeroISIMANValide)
						return lang.anomalie.confirmCritiqueActionDecl;
					else if (!this.isAnoRajDefaut && this.isCritique() && this.action == 'DECLAR_DOC_OK' && !this.numeroISIMANValide)
						return lang.anomalie.confirmCritiqueActionDeclDoc;
					else if (this.anomalie.regularisable) {
						if (this.action == 'REGULARISEE')
							return lang.anomalie.confirmRegularisableActionRegul;
						else if (this.action == 'REFUSE')
							return lang.anomalie.confirmRegularisableActionRefus;
						else
							return lang.anomalie.confirmRegularisableActionCancel;
					} else {
						if (this.action == 'DECLAR') {
							if (this.isAnoRajDefaut)
								return lang.anomalie.confirmNonRegularisableActionDeclRajDefault;
							else
								return lang.anomalie.confirmNonRegularisableActionDecl;
						} else if (this.action == 'DECLAR_DOC_OK')
							return lang.anomalie.confirmNonRegularisableActionDeclDoc;
						else
							return lang.anomalie.confirmNonRegularisableActionCancel;
					}
				}
			}
		}

		return '';
	}

	existCommentForUser() { //test si le dernier commentaire est fait par le current user
		app.log('existCommentForUser', this.anomalie, this.currentUserId);

		if (this.anomalie.comments != null && this.anomalie.comments.length > 0)
			if (String(this.anomalie.comments[this.anomalie.comments.length - 1].userId) == String(this.currentUserId))
				return true;
		return false;
	}

	confirmValiderAnomalie() {
		//si commentaire obligatoire		
		if (this.isCommentRequired() && app.isEmpty(this.commentaire)) {
			app.showToast('toastAnomalieCommentRequired');
			return;
		}

		//choix obligatoire si pas agent
		if (!this.isAgent && app.isEmpty(this.action)) {
			app.showToast('toastAnomalieActionRequired');
			return;
		}

		//case numero isiman valide obligatoire si l'anomalie est regularisable critique
		// US 2216 : desactive cette règle sur le champ isiman mais pas la case à cocher
		if (this.isCritiqueControleur() && this.anomalie.regularisable && this.action == 'REGULARISEE' && !this.numeroISIMANValide) {
			app.showToast('toastAnomalieNumeroIsimanValideRequired');
			return;
		}

		app.showModal('modalConfirmationValiderAnomalie');
	}

	isCommentRequired() {
		//si pas manager et (si regularisable OU (non regularisable et role controleur) et pas de commentaire deja saisi alors commentaire obligatoire (form ou fil))
		return (!this.isManagerDCV && (this.anomalie.regularisable || (!this.anomalie.regularisable && !this.isAgent)) && !this.existCommentForUser());
	}

	async saveComment(isTaskValidated: any) {
		//sauvegarde du commentaire
		if (!(app.isEmpty(this.commentaire) && this.liens != null && this.liens.length > 0 && app.isEmpty(this.liens[0].value))) {
			var DO = app.getDO('commentaire');
			DO.typePartentObject = 'anomalie';
			DO.persistanceIdParentObject = this.anomalie.persistenceId;
			DO.caseIdParentObject = this.anomalie.caseId;
			DO.texteCommentaire = ((this.commentaire == null) ? '' : this.commentaire);
			DO.persistenceId = null;
			DO.commentaireAnnule = false;
			DO.roleUser = app.getRoleTache(this.tache);
			DO.userName = this.store.getUserName();

			var liens: any = [];
			for (var lien of this.liens)
				liens.push(lien.value);
			DO.liens = liens;

			try {
				const response = await app.saveFormData(app.getRootDO('commentaire'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessAddCommentaire'));

				if (!isTaskValidated && !this.isAnoSaved) {
					if (response)
						app.showToast('toastSaveCommentSuccessAno');
					else
						app.showToast('toastSaveErrorAno');
				}

				this.commentaire = '';
				this.liens = [];
				this.ajouterLien();

				await this.getAnomalieComments();
			} catch (error) {
				app.showToast('toastSaveErrorAno');
			}
		}
	}

	async saveAnomalie(validate: any) {
		//sauvegarde du commentaire

		//sauvegarde des données de l'anomalie
		// if (this.isAgent) {   //ano2352 (regression)
		var DO = app.getDO('anomalie');
		DO.decision = (app.isEmpty(this.action)) ? "" : this.action;
		DO.numero_isiman = this.numeroISIMAN;
		DO.numero_isiman_valide = this.numeroISIMANValide;
		DO.case_id_traitement_anomalie = this.anomalie.caseId;

		try {
			const response = await app.saveFormData(app.getRootDO('anomalie'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessUpdateAnomalie'));

			if (!validate) {
				if (response) {
					this.isAnoSaved = true;
					app.showToast('toastSaveSuccessAno');
				}
				else
					app.showToast('toastSaveErrorAno');
			}
		} catch (error) {
			app.showToast('toastSaveErrorAno');
		}
		// }

		await this.saveComment(validate);
		if (!validate)
			this.btnSaveAnomalie().setLoading(false);
	}

	async validerAnomalie() {
		await this.saveAnomalie(true);

		var paramDO = {};
		if (!this.isAgent) {
			var DO = app.getDO('anomalie');
			DO.decision = this.action;
			DO.numero_isiman = '';
			DO.numero_isiman_valide = false;
			DO.case_id_traitement_anomalie = '';

			paramDO = app.getRootDO('anomalie');

			app.log('page-anomalie > validerAnomalie - decision', DO.decision);
		}

		await app.assignTache(this.tache.id, this.store.getUserId());

		await app.sleep(1000);

		await app.setExternalData(app.getUrl('urlTaskExecute', this.tache.id), paramDO);

		app.hideModal('modalConfirmationValiderAnomalie');

		app.showToast('toastControlesValid');

		await app.sleep(4000);

		app.redirect(this.router, app.getUrl('urlGotoTaches'));
	}

	async annulerAnomalie() {
		if (this.tache != null)
			app.redirect(this.router, app.getUrl('urlGotoTaches'));
		else
			this.location.back();
	}

	async supprimerLien(item: any) {
		var index = -1;
		for (var i = 0; i < this.liens.length; i++)
			if (item == this.liens[i])
				index = i;

		if (index != -1)
			this.liens.splice(index, 1);
	}

	async ajouterLien() {
		this.liens.push({
			value: ''
		});
	}

	isCritique() {
		return (this.anomalie != null && !app.isEmpty(this.anomalie.criticite) && String(this.anomalie.criticite).toLowerCase() == 'critique');
	}
	isCritiqueManager() {
		return (this.isManagerDCV && this.isCritique() && !this.read);
	}
	isCritiqueAgent() {
		return (this.isAgent && this.isCritique());
	}
	isCritiqueControleur() {
		return (!this.isAgent && !this.isManagerDCV && this.isCritique());
	}
}