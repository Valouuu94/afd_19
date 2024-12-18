import { Component, OnInit, input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ModalComponent } from '../modal/modal.component';


declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-infos-dossier',
    templateUrl: './infos-dossier.component.html',
    standalone: true,
    imports: [ModalComponent]
})
export class InfosDossierComponent implements OnInit {

	modalitePaiement: string = ''
	typeVersement: string = '';
	typeDossier: string = '';
	showNotification: boolean = false;
	notifications: any = [];
	app: any = app;
	lang: any = lang;
	isDCV: boolean = false;

	readonly dossier = input<any>();
	readonly type = input<any>();
	readonly versement = input<any>();

	constructor(private store: StoreService) { }

	async ngOnInit() {
		this.getLibelleModalite();

		this.isDCV = app.isDCV(this.dossier().entite, this.store.getUserPerimetre());

		await this.getNotifications();
	}

	get dossierAnnule() {
		return app.isDossierAnnule((this.isDCV) ? this.dossier().code_statut_dossier_2nd : this.dossier().code_statut_dossier);
	}
	get dossierRembourse() {
		return app.isDossierRembourse(this.dossier().code_statut_dossier);
	}
	get statutDossier() {
		if (this.type() == 'DDR')
			return (this.isDCV ? this.dossier().lib_statut_dossier_2nd : this.dossier().lib_statut_dossier);
		else
			return this.dossier().lib_statut_dossier;
	}

	getLibelleModalite() {
		this.modalitePaiement = app.getRefLabel('refModalitesPaiement' + this.dossier().entite, this.dossier().modalite_paiement);
		this.typeVersement = app.getRefLabel('refTypesVersement', this.dossier().type_versement);

		if (this.type() == 'DDR')
			this.typeDossier = 'reglement';
		else
			this.typeDossier = 'versement';
	}

	updateDossier(dossier: any) {
		this.dossier = dossier;
	}

	async getNotifications() {
		this.notifications = await app.getExternalData(app.getUrl('urlGetNotifications', this.dossier().persistenceId));

		var notifs = [];
		for (var ntf of this.notifications) {
			ntf.typeDossier = this.typeDossier;

			if (ntf.typeNotification != '-1')
				ntf.renderDestinataire = ntf.destinataireNameFirstName;
			const dossier = this.dossier();
   if (ntf.typeNotification == '-1' && app.isAFD(dossier.entite) && ntf.typeDossier == 'reglement' && !this.isDCV)
				ntf.corpNotification = lang.reglement.libelleAnnulerDossier + ' : ' + ntf.corpNotification;
			else if (ntf.typeNotification == '-1' && ntf.typeDossier == 'versement')
				ntf.corpNotification = (!app.isAFD(dossier.entite) ? lang.versementPROPARCO.libelleAnnulerDossier : lang.versementAFD.libelleAnnulerDossier) + ' : ' + ntf.corpNotification;

			notifs.push(ntf);
		}

		//recuperer les mails d'annulation des reglements PROPARCO
		const versement = this.versement();
  if (!app.isEmpty(versement) && !app.isAFD(versement.entite)) {
			for (var reglement of versement.dossier_reglement) {
				var notifisReglementBdd = await app.getExternalData(app.getUrl('urlGetNotificationsByTypeAndPersistanceIdParentObject', reglement.persistenceId, '-1'));

				for (var ntfReglement of notifisReglementBdd) {
					if (!app.isEmpty(ntfReglement.corpNotification) && !app.isEmpty(ntfReglement.corpNotification)) {
						ntfReglement.numero_dossier_reglement = reglement.numero_dossier_reglement;
						ntfReglement.typeDossier = 'reglement';

						if (ntfReglement.typeNotification == '-1')
							ntfReglement.corpNotification = lang.reglement.libelleAnnulerDossier + ' ' + ntfReglement.numero_dossier_reglement + ' : ' + ntfReglement.corpNotification;

						notifs.push(ntfReglement);
					}
				}
			}
		}

		this.notifications = notifs;

		app.sortBy(this.notifications, [
			{ key: 'dateEnvoi', order: 'desc' }
		]);
	}

	async showNotifications() {
		app.showModal('modalAddItem' + this.dossier().id);
	}
}