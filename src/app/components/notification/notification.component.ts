import { Component, OnInit, input, output, viewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const actions: any;
declare const lang: any;
declare const tachesRedirect: any;

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    standalone: true,
    imports: [ModalComponent, NgIf, FormsModule]
})
export class NotificationComponent implements OnInit {

	readonly sendNotification = viewChild.required<ModalComponent>('sendNotification');
	readonly modalDCV = viewChild.required<ModalComponent>('modalDCV');

	step: string = '';
	typeAction: string = '';
	typeDestinataire: string = '';
	hrefDossier: string = '';
	role: string = '';
	entite: string = '';
	perimetre: string = '';
	app: any = app;
	lang: any = lang;
	roleDestination: string = 'NA';
	toastMemberNotExist: string = '';
	destinataires: any;
	isDCV: boolean = false;
	dataObjectName: any = '';
	isAFD: any;
	isDirecteur: any;
	isControlesOk: any;

	readonly typeDossier = input<any>();
	readonly tache = input<any>();
	readonly dossier = input<any>();
	readonly persistenceIdParent = input<any>();
	readonly checkReglementsAnnule = input<boolean>(false);
	readonly isAvance = input<boolean>(false);

	readonly annulerDossier = output();
	readonly annulerAction = output();

	constructor(private store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.role = app.getRoleTache(this.tache());
		this.perimetre = this.store.getUserPerimetre();

		app.setCurrentCmp('notification', this);

		this.isDCV = app.isDCV(this.entite, this.perimetre);
		this.isAFD = app.isAFD(this.entite);
		this.isDirecteur = app.isDirecteur(this.role);
	}

	get validateLabelBtn() {
		if (this.isDCV && this.typeAction == '-1')
			return lang.reglement.controleDCV.ConfirmAnnulerDossierLabel;
		else if (this.typeAction == '0')
			return lang.envoyerLabel;
		else if (this.typeAction == '1')
			return lang.renvoyerLabel;
		return lang.ConfirmAnnulerLabel;
	}
	get iconValidateBtn() {
		if (this.typeAction == '0')
			return 'arrow-right';
		else if (this.typeAction == '1')
			return 'reply';
		return '';
	}
	get typeBtn() {
		if (this.typeAction == '-1')
			return 'danger';
		return '';
	}
	get messageHeaderModal() {
		if (this.dossier != null && this.dossier != null) {
			if (this.typeDossier() == 'DR') {
				if (this.typeAction == '0')
					return lang.reglement.envoiDossierMessage;
				else if (this.typeAction == '1')
					return lang.reglement.renvoiDossierMessage;
				return lang.reglement.annulerDossierMessage + this.dossier().code_fonctionnel;
			}
			else {
				if (this.typeAction == '0')
					return lang.versement.envoiDossierMessage;
				else if (this.typeAction == '1')
					return lang.versement.renvoiDossierMessage;
				return lang.versement.annulerDossierMessage + this.dossier().code_fonctionnel;
			}
		}
	}
	get titleModal() {
		if (this.isDCV) {
			if (this.typeAction == '-1')
				return lang.reglement.controleDCV.titleModalAnnulerDossier;
			else
				return lang.reglement.controleDCV.validerDossier;
		}
		else if (this.isDirecteur && this.isAFD)
			return lang.reglement.titreValideReglementDir;
		else if (this.isDirecteur && !this.isAFD && !this.isDCV)
			return "Valider le dossier de versement";
		else if (this.typeAction == '0')
			return lang.titreEnvoiDossierModal;
		else if (this.typeAction == '1')
			return lang.titreRenvoiDossierModal;
		return lang.titreAnnulerDossierModal;
	}
	get labelBtnClose() {
		if (this.typeAction == '-1')
			return lang.return;
		else
			return '';
	}

	async showModalNotification(typeAction: any) {
		if (!this.isDCV && this.checkReglementsAnnule() && typeAction == '-1') {
			var reglementsIsAnnule = await app.checkDDRsIsAnnule(this.dossier().numero_dossier_versement);
			if (!reglementsIsAnnule) {
				this.annulerDossier.emit(null);
				return;
			}
		}

		app.cleanDiv('formio_notification');

		var valideControle = true;

		if (typeAction == '0')
			valideControle = await app.getCurrentCmp('controles').validerControles();

		if (valideControle) {
			this.typeAction = typeAction;
			this.step = app.getEtapeTache(this.tache());
			this.dataObjectName = (this.isDCV ? 'notificationDCV' : 'notification');

			var DO = app.getDO(this.dataObjectName);
			app.resetDO(this.dataObjectName);

			if (!this.isDCV && !app.isAFD(this.entite))
				this.hrefDossier = await this.getUrlDossier();

			//remplir la liste des destinataires dans le cas d'envoi/renvoi du dossier AFD/PRO
			if (typeAction != '-1') {
				this.destinataires = await this.getDestinataires(null);
				app.setRef(this.destinataires, 'destinataires', 'code', 'label');
			}

			app.setBDM(DO);
			appFormio.loadFormIO('notification');

			await app.sleep(500);

			if (typeAction != '-1')
				appFormio.setDataValue(crossVars.forms['formio_notification'], 'show_destinataires', 'true');

			await app.sleep(500);

			app.showModal('modalNotification');
		}
	}

	async validerNotification() {
		if (!app.isValidForm('formio_notification')) {
			this.sendNotification().setLoadingBtn();
			app.showToast('toastSendNotificationError');
			return;
		}

		var DO = await app.saveFormData(app.getRootDO(this.dataObjectName), crossVars.forms['formio_notification']);

		var firstJson = DO[app.getFirstJsonKey(DO)];

		if (!this.isDCV) {
			firstJson.persistanceIdParentObject = this.dossier().persistenceId;
			firstJson.caseIdParentObject = this.dossier().case_id;
			DO.urlDossier = this.hrefDossier;
		}
		firstJson.corpNotification = "<pre>" + firstJson.corpNotification + "</pre>";

		if (this.typeAction == '-1') {
			if (!this.isDCV)
				DO.decision = actions['annulerDossier'][this.typeDossier()].action;
			else
				firstJson.decision = actions['annulerDossier'][this.typeDossier()].action;

			this.annulerDossier.emit(DO);
		}
		else {
			if (this.typeAction == '1') {
				if (this.typeDestinataire != '')
					DO.decision = this.actions(this.typeDossier())[0].action[this.roleDestination];
				else
					DO.decision = this.actions(this.typeDossier())[0].action;
			}
			else
				DO.decision = '';

			await app.getCurrentCmp('controles').validerTache(true, DO, true, this.typeAction == '1' ? false : true);
		}
	}

	setLoadingBtn() {
		this.sendNotification().setLoadingBtn();
	}

	hideModal() {
		if ((this.isDCV && this.typeAction != '-1') || (this.isAFD && this.isDirecteur && this.typeAction != "1") || (this.isControlesOk && this.isDirecteur && !this.isAFD && !this.isDCV && this.typeAction != "1"))
			app.hideModal('modalValidControlesDCV');
		else
			app.hideModal('modalNotification');
	}

	actions(typeDossier: any) {
		var results = [];

		for (var action of actions[typeDossier])
			if (app.existStringInArray(action.steps, this.step))
				results.push(action);

		return results;
	}

	async getDestinataires(destination: any) {
		var users = [];

		app.log("getDestinataires > this.typeAction > ", this.typeAction);
		app.log("getDestinataires > this.role > ", this.role);

		var userContext = this.store.getUserContext();

		if (userContext != null && userContext.utilisateurEntites != null && userContext.utilisateurEntites.length > 0) {
			var userEntite = userContext.utilisateurEntites[0];

			const dossier = this.dossier();
   if (destination != null)
				this.roleDestination = destination;
			else if (this.typeAction == '1') {
				if (this.role == 'MANAGER')
					this.roleDestination = '';
				else if (this.isAFD)
					this.roleDestination = 'AGENTVERSEMENT';
				else {
					if (this.role == 'CHGAFF')
						this.roleDestination = 'CHGAPPUI';
					else if (this.role == 'DIRVALID')
						this.roleDestination = 'MODAF';
				}
			} else {
				if (this.isAFD) {
					if (this.role == 'AGENTVERSEMENT')
						this.roleDestination = 'CHGPROJET';
					else if (this.role == 'CHGPROJET')
						this.roleDestination = 'MANAGER';
				}
				else {
					if (this.role == 'CHGAFF')
						this.roleDestination = 'MODAF';
					else if (this.role == 'CHGAPPUI' && dossier.decision == 'RETOUR_MODAF_CG')
						this.roleDestination = 'MODAF';
					else if (this.role == 'CHGAPPUI' && dossier.decision != 'RETOUR_MODAF_CG')
						this.roleDestination = 'CHGAFF';
					else if (this.role == 'MODAF')
						this.roleDestination = 'DIRVALID';
				}
			}

			app.log('notification > getDestinataires - usercontext', userContext);
			app.log('notification > getDestinataires - userEntite', userEntite);
			app.log('notification > getDestinataires - roleDestination', this.roleDestination);

			var url = (this.isAFD ? app.getUrl('urlGetDestinataires' + this.entite, userContext.idUtilisateur, this.roleDestination, dossier.numero_projet) : app.getUrl('urlGetDestinataires' + this.entite, userContext.idUtilisateur, this.roleDestination, dossier.numero_projet));

			var destinataires = await app.getExternalData(url, 'notification > getDestinataires');

			var currentUserId = this.store.getUserId();

			if (destinataires != null) {
				for (var destinataire of destinataires) {
					if (destinataire.loginUtilisateur != currentUserId)
						users.push({
							code: destinataire.loginUtilisateur,
							label: destinataire.nomUtilisateur + ' ' + destinataire.prenomUtilisateur,
							isIntervenant: (this.isAFD ? true : destinataire.isIntervenant)
						});
				}
			}

			var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', dossier.numero_projet), 'notification > getProjet - projet', true);
			if (!this.isAFD && ((app.isChargeAffaire(this.role) && this.typeAction == '0' && projet.flgProjetConfidentiel == '0') || (this.isDirecteur && this.typeAction == '0')))
				users.push({ code: 'Groupe_MODAF', label: 'Groupe MODAF' });
		}

		app.log('notification > getDestinataires', users);

		return users;
	}

	async filterDestinataires(roleDestination: any) {
		app.cleanDiv('formio_notification');

		var DO = app.getDO(this.dataObjectName);

		app.resetDO(this.dataObjectName);

		this.roleDestination = roleDestination;

		this.destinataires = await this.getDestinataires(roleDestination);

		app.setRef(this.destinataires, 'destinataires', 'code', 'label');

		app.setBDM(DO);

		await app.sleep(250);

		appFormio.loadFormIO('notification');

		await app.sleep(250);

		appFormio.setDataValue(crossVars.forms['formio_notification'], 'show_destinataires', 'true');

		await app.sleep(250);
	}

	async validerTache(isControlesOk?: any) {
		this.isControlesOk = (isControlesOk != null ? isControlesOk : true);

		if (this.isDCV || (((this.isAFD && this.isDirecteur) || (isControlesOk && this.isDirecteur && !this.isAFD && !this.isDCV))))
			app.showModal('modalValidControlesDCV');
		else
			this.validerDossier();
	}

	async validerDossier() {
		//authentification inwebo pour le directeur
		if (this.isDirecteur) {
			var user = this.store.getUserContext();
			var windowsUser = null;

			if (user != null && user.mail != null && user.mail.length > 0)
				windowsUser = user.mail.replace('@afd.fr', '').replace('@proparco.fr', '').replace('.ext', '');
			else {
				console.error('notification > validerDossier - inwebo : user not found');
				this.modalDCV().setLoadingBtn();
				app.showToast('toastAuthentificationInweboError', true);
				return;
			}

			var inwebo = await app.getExternalData(app.getUrl('urlCheckInwebo', windowsUser), 'notification > validerDossier - inwebo', true);

			console.warn('notification > validerDossier - inwebo result', inwebo);

			if (inwebo == null || (inwebo != null && inwebo.title != 'OK')) {
				this.modalDCV().setLoadingBtn();
				app.showToast('toastAuthentificationInweboError', true);
				return;
			}
		}

		//validation des controles
		var DO = (this.isDCV ? app.getRootDO('notificationDCV') : app.getRootDO('notification'));

		app.resetDO(DO);

		if (this.isDCV) {
			var valideControle = await app.getCurrentCmp('controles').validerControles();
			if (!valideControle) {
				this.modalDCV().setLoadingBtn();
				this.hideModal();
				return;
			}
		}
		else {
			if (!app.isAFD(this.entite))
				DO.urlDossier = await this.getUrlDossier();
		}

		await app.getCurrentCmp('controles').validerTache(true, DO, true, true);
	}

	isMemberProjet() {
		var isIntervenant = true;
		var loginDestinataire = appFormio.getDataValue(crossVars.forms['formio_notification'], 'destinataire');

		if (app.isChargeAppui(this.roleDestination) || app.isChargeAffaire(this.roleDestination)) {
			for (var destinataire of this.destinataires)
				if (destinataire.code == loginDestinataire && !destinataire.isIntervenant)
					isIntervenant = false;
		}

		if (!isIntervenant) {
			this.toastMemberNotExist = (app.isChargeAppui(this.roleDestination) ? lang.errors.notification.chargeAppuiNotExist : lang.errors.notification.chargeAffaireNotExist);
			app.showToast('toastMemberNotExist');
		}
	}

	cancelAction() {
		this.annulerAction.emit(this.typeAction);
	}

	async getUrlDossier() {
		var urlD = "";
		if (window.parent.frames[0] != null) //à voir avec Arnaud(mail Outlook)
			urlD = window.parent.frames[0].document.location.href;
		else
			urlD = window.location.href;

		//l'url a envoyer dans le cas d'annulation de dossier reglement pour AFD
		var ctrls = await app.getExternalData(app.getUrl('urlGetControles', this.dossier().case_id), 'cmp-controles > loadControles');

		await app.sleep(250);

		const typeDossier = this.typeDossier();
  if (typeDossier == 'DR' && this.typeAction == '-1' && this.isAFD && ctrls.length == 0)
			urlD = this.hrefDossier.substring(0, this.hrefDossier.lastIndexOf('#') + 1).concat('/reglement/', this.dossier().persistenceId);
		else if (typeDossier == 'DR' && this.typeAction == '-1' && !this.isAFD)
			urlD = this.hrefDossier.substring(0, this.hrefDossier.lastIndexOf('#') + 1).concat('', app.getUrl(tachesRedirect[app.getTypeTache(this.tache())][app.getEtapeTache(this.tache())], this.persistenceIdParent()));

		return urlD;
	}
}