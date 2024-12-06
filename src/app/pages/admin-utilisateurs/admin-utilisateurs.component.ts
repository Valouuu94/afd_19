import { Component, OnInit, viewChild } from '@angular/core';
import { UtilisateurAdhesionComponent } from './utilisateur-adhesion/utilisateur-adhesion.component';
import { NgIf } from '@angular/common';
import { TeleportComponent } from '../../components/teleport/teleport.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ExportExcelComponent } from '../../components/export-excel/export-excel.component';
import { TableComponent } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';
import { StoreService } from '../../services/store.service';


declare const app: any;
declare const lang: any;
declare const crossVars: any;
declare const appFormio: any;

@Component({
    selector: 'app-admin-utilisateurs',
    templateUrl: './admin-utilisateurs.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent, ExportExcelComponent, ModalComponent, UtilisateurAdhesionComponent, TeleportComponent, NgIf]
})
export class AdminUtilisateursComponent implements OnInit {

	readonly tableUtilisateurs = viewChild.required<TableComponent>('tableUtilisateurs');
	readonly modalUser = viewChild.required<ModalComponent>('modalUser');
	readonly modalConfirmationUser = viewChild.required<ModalComponent>('modalConfirmationUser');
	readonly exportUser = viewChild.required<ExportExcelComponent>('exportUser');
	readonly teleportCheckBox = viewChild.required<TeleportComponent>('teleportCheckBox');
	readonly utilisateurAdhesion = viewChild.required<UtilisateurAdhesionComponent>('utilisateurAdhesion');

	app: any = app;
	lang: any = lang;
	create: boolean = true;
	utilisateurs: any;
	utilisateur: any;
	setRoles: any = [];
	afdRoles: any = [];
	enableAddRole: boolean = false;
	utilisateursEntites: any = [];
	isDCV: boolean = false;
	itemRemoved: any;
	hasNoRight: boolean = false;
	rows: any = [];
	isAdminChecked: boolean = false;
	itemIsDCV: boolean = false;
	btnAdminIsDisabled: boolean = false;

	constructor(public store: StoreService) { }

	ngOnInit() {
		this.setRoles = [];
		this.afdRoles = app.getRef('refRoles');

		this.enableToEdit();
	}

	ngAfterViewInit() {
		this.isDCV = app.isDCV(this.store.getUserEntite(), this.store.getUserPerimetre());

		this.getUtilisateurs();
	}

	get modalTitle() {
		return (this.create) ? lang.users.addUser : lang.users.updateUser;
	}

	async getUtilisateurs() {
		//verifier si l'utilisateur à le role RA
		await this.isAdminRA(); //pourquoi cet appel ????

		var utilisateurs = await app.getExternalData(app.getUrl('urlGetUsers'), 'admin-utilisateurs > getUtilisateurs');

		for (var utilisateur of utilisateurs) {
			utilisateur.renderEntiteRole = '';

			for (var entite of utilisateur.utilisateurEntites)
				utilisateur.renderEntiteRole += '<div class="badge-table entite-role">' + entite.entiteOrga.codeEntiteOrga + ' - ' + entite.entiteOrga.libCourt + '<br><span class="highlight">' + app.getRefLabel('refRoles', entite.id.roleUtilisateur) + '</span></div>';
		}

		this.utilisateurs = utilisateurs;

		await app.sleep(250);

		this.tableUtilisateurs().getItems();
	}

	async updateUtilisateur(item: any) {
		item = JSON.parse(JSON.stringify(item));
		this.isAdminChecked = false;

		//mise à jour de la liste des entites
		app.removeStorageItem('refAFDEntites');
		await app.loadRefs();
		this.utilisateurAdhesion().entites = app.getRef('refAFDEntites');

		this.teleportCheckBox().unteleport();
		this.utilisateur = item;
		this.enableAddRole = false;
		this.create = false;

		var DO = app.resetDO(app.getDO('typeUser'));

		if (item != null) {
			DO.updateDateNewV = item.updateDateNewV;
			DO.creationDateNewV = item.creationDateNewV;
			DO.isAdminFoncionnel = item.isAdminFoncionnel;
			this.isAdminChecked = item.isAdminFoncionnel;
			DO.utilisateurAgenceControle = item.utilisateurAgenceControle;

			this.itemIsDCV = false;
			for (var entiteRole of item['utilisateurEntites'])
				if (entiteRole.id.codeEntiteOrga == "DCV")
					this.itemIsDCV = true;
		}
		await app.mapDO(DO, item);

		this.utilisateursEntites = [];
		this.setRoles = [];

		if (item['utilisateurEntites'].length > 0) {
			for (let role of item['utilisateurEntites']) {
				var entiteOrgaCode = role['id']['codeEntiteOrga'];
				var entite = role['entiteOrga'];
				var roleCode = role['id']['roleUtilisateur'];
				var roleFromList = app.findInArray(this.afdRoles, "code", roleCode);

				role.action = null;
				role.isEltBdd = "true";

				this.setRoles.push(role);
				this.utilisateursEntites.push(role);
			}
		}
		app.setBDM(DO);
		appFormio.loadFormIO('typeUser');

		await app.sleep(100);

		this.teleportCheckBox().teleport();
		this.teleportCheckBox().show();

		this.modalUser().setLoadingBtn();

		app.showModal('modalUser');
	}

	async confirmSaveUtilisateur() {
		if (!this.hasNoRight) {
			if (!app.isValidForm('formio_typeUser')) {
				app.showToast('toastTypeUserSaveError');
				this.modalUser().setLoadingBtn();
				return;
			}

			if (this.create) {
				this.modalUser().setLoadingBtn();
				this.modalConfirmationUser().setLoadingBtn();
				app.showModal('modalConfirmationUser');
			} else
				this.saveUtilisateur();
		}
	}

	async saveUtilisateur() {
		await app.saveFormData(app.getRootDO('typeUser'), crossVars.forms['formio_typeUser']);

		var utilisateursEntitesOut = [];
		//construire les entites/role
		for (var userEntite of this.utilisateursEntites)
			if (userEntite.action != "DELETE")
				utilisateursEntitesOut.push(userEntite);

		var DO = app.getDO('typeUser');

		DO.utilisateurEntites = utilisateursEntitesOut;
		DO.idUserMaj = this.store.getUserName();
		DO.userMaj = this.store.getUserName();
		DO.updateDateNewV = null;
		DO.creationDateNewV = null;
		DO.utilisateurAgenceControle = this.utilisateur.utilisateurAgenceControle;
		await app.sleep(100);
		DO.isAdminFoncionnel = this.isAdminChecked;

		if (!app.isEmpty(DO.login))
			await app.setExternalData(app.getUrl('urlUpdateUser'), DO, 'PUT')

		if (!this.create) {
			if (this.updateDCV()) {
				await app.setExternalData(app.getUrl('urlUnassignTasks2ndNiv', this.utilisateur.login), {}, 'POST');
			}
			else {
				var userEntities = [];
				// var newUserEntities = [];

				for (var entiteUser of this.utilisateursEntites) {
					userEntities.push({ "role": entiteUser.id.roleUtilisateur, "codeEntiteOrga": entiteUser.entiteOrga.codeEntiteOrga, "action": entiteUser.action });
				}
				// for (var oldUE of this.utilisateur.utilisateurEntites) {
				// 	var elementChange = null;
				// 	var eltNotDeleted = false;

				// 	for (var newUE of this.utilisateursEntites) {
				// 		if (oldUE.id.roleUtilisateur == newUE.id.roleUtilisateur && oldUE.entiteOrga.codeEntiteOrga == newUE.entiteOrga.codeEntiteOrga) {
				// 			eltNotDeleted = true;
				// 			break;
				// 		}
				// 		else if ((oldUE.id.roleUtilisateur != newUE.id.roleUtilisateur && newUE.changeRole) || (oldUE.entiteOrga.codeEntiteOrga != newUE.entiteOrga.codeEntiteOrga && newUE.changeEntite)) {
				// 			elementChange = newUE;
				// 			break;
				// 		}
				// 	}

				// 	if (elementChange != null) {
				// 		if (elementChange.changeRole) {
				// 			oldUserEntities.push({ "role": oldUE.id.roleUtilisateur, "codeEntiteOrga": oldUE.entiteOrga.codeEntiteOrga });

				// 			newUserEntities.push({ "role": elementChange.id.roleUtilisateur, "codeEntiteOrga": elementChange.entiteOrga.codeEntiteOrga });
				// 		}
				// 		else if (elementChange.changeEntite) {
				// 			oldUserEntities.push({ "role": oldUE.id.roleUtilisateur, "codeEntiteOrga": oldUE.entiteOrga.codeEntiteOrga });

				// 			newUserEntities.push({ "role": elementChange.id.roleUtilisateur, "codeEntiteOrga": elementChange.entiteOrga.codeEntiteOrga });
				// 		}

				// 	}
				// 	else if (!eltNotDeleted) {
				// 		oldUserEntities.push({ "role": oldUE.id.roleUtilisateur, "codeEntiteOrga": oldUE.entiteOrga.codeEntiteOrga });
				// 	}
				// }

				// for (var newUE of this.utilisateursEntites)
				// 	if (newUE.newItem)
				// 		if (!app.findObjectEltInArray(newUserEntities, { "role": newUE.id.roleUtilisateur, "codeEntiteOrga": newUE.entiteOrga.codeEntiteOrga }))
				// 			newUserEntities.push({ "role": newUE.id.roleUtilisateur, "codeEntiteOrga": newUE.entiteOrga.codeEntiteOrga });
				//appel bonita pour recreer les taches
				await app.setExternalData(app.getUrl('urlAssignUnassignTasksAfdPro', this.utilisateur.login), { 'userEntities': userEntities }, 'POST');
			}
		}

		this.getUtilisateurs();

		if (this.create)
			app.hideModal('modalConfirmationUser');

		app.showToast('toastSaveSuccessAdminUser');

		app.hideModal('modalUser');
	}

	addUtilisateurEntites(item: any) {
		//var newItem = false;
		// item.changeRole = false;
		// item.changeEntite = false;
		item.action = "ADD";
		// if (this.itemRemoved != null) {
		// 	if (this.itemRemoved.id.roleUtilisateur == item.id.roleUtilisateur && this.itemRemoved.entiteOrga.codeEntiteOrga != item.entiteOrga.codeEntiteOrga)
		// 		item.changeEntite = true;
		// 	else if (this.itemRemoved.id.roleUtilisateur != item.id.roleUtilisateur && this.itemRemoved.entiteOrga.codeEntiteOrga == item.entiteOrga.codeEntiteOrga)
		// 		item.changeRole = true;

		// 	this.itemRemoved = null;
		// }

		// for (var ue of this.utilisateur.utilisateurEntites)
		// 	if (ue.id.roleUtilisateur != item.id.roleUtilisateur && ue.entiteOrga.codeEntiteOrga != item.entiteOrga.codeEntiteOrga)
		// 		newItem = true;

		// item.newItem = newItem;
		var indexElt = -1;
		for (let index = 0; index < this.utilisateursEntites.length; index++) {
			var elt = this.utilisateursEntites[index];

			if (elt["id"].idUtilisateur == item["id"].idUtilisateur && (elt["id"].codeEntiteOrga == item["id"].codeEntiteOrga && elt["id"].typeEntiteOrga == item["id"].typeEntiteOrga) && elt["id"].roleUtilisateur == item["id"].roleUtilisateur) {
				indexElt = index;
				break;
			}
		}
		if (indexElt == -1)
			this.utilisateursEntites.push(item);
		else {
			if (this.utilisateursEntites[indexElt].isEltBdd) {
				item.isEltBdd = "true";
				item.action = null;
			}

			this.utilisateursEntites[indexElt] = item;
		}
	}

	removeUtilisateurEntites(item: any) {
		this.itemRemoved = item;
		var indeEltRemoved = -1;
		item.action = "DELETE";

		for (let index = 0; index < this.utilisateursEntites.length; index++) {
			var elt = this.utilisateursEntites[index];

			if (elt["id"].idUtilisateur == item["id"].idUtilisateur && (elt["id"].codeEntiteOrga == item["id"].codeEntiteOrga && elt["id"].typeEntiteOrga == item["id"].typeEntiteOrga) && elt["id"].roleUtilisateur == item["id"].roleUtilisateur) {
				indeEltRemoved = index;
				break;
			}
		}
		if (indeEltRemoved != -1) {
			if (this.utilisateursEntites[indeEltRemoved].isEltBdd) {
				item.isEltBdd = "true";
				this.utilisateursEntites[indeEltRemoved] = item;
			} else
				this.utilisateursEntites.splice(indeEltRemoved, 1);
		}
	}

	async exportExcelUser() {
		const tableUtilisateurs = this.tableUtilisateurs();
  tableUtilisateurs.loadingExport = true;

		var items = tableUtilisateurs.itemsFiltered;

		for (var item of items) {
			item.actif = app.getRefLabel('refBoolean', item.actif);
			item.entiterole = "";

			for (var elm of item.utilisateurEntites)
				item.entiterole += elm.entiteOrga.libCourt + " - " + app.getRefLabel('refRoles', elm.id.roleUtilisateur) + " / ";
		}

		this.rows = items;

		await app.sleep(2000);

		this.exportUser().exportExcel('exportUtilisateur', this.rows, null, null);

		tableUtilisateurs.loadingExport = false;
	}

	enableToEdit() {
		this.hasNoRight = !app.hasRightButton(this.store, 'admin.gestUser');
	}

	checkAdmin() {
		this.isAdminChecked = !this.isAdminChecked;
	}
	updateDCV() {
		return (((this.existRoleInlist(this.utilisateur.utilisateurEntites, 'CTRL2ND')
			&& !this.existRoleInlist(this.utilisateursEntites, 'CTRL2ND'))
			|| (
				!this.existRoleInlist(this.utilisateur.utilisateurEntites, 'CTRL2ND')
				&& this.existRoleInlist(this.utilisateursEntites, 'CTRL2ND')
			)
		)
			|| ((this.existRoleInlist(this.utilisateur.utilisateurEntites, 'MANAGER2ND')
				&& !this.existRoleInlist(this.utilisateursEntites, 'MANAGER2ND'))
				||
				(!this.existRoleInlist(this.utilisateur.utilisateurEntites, 'MANAGER2ND')
					&& this.existRoleInlist(this.utilisateursEntites, 'MANAGER2ND'))
			)
		)
	}
	existRoleInlist(list: any, role: any) {
		if (list != null) {
			for (var item of list)
				if (item.id.roleUtilisateur == role)
					return true;
		}
		return false;
	}
	async isAdminRA() {
		var user = await app.getUser();
		var userContext = await app.getUserContext(user.name);
		var rolesUser = await app.getUserRole(userContext);

		this.btnAdminIsDisabled = !rolesUser.includes('RA') || rolesUser.length == 0;
	}
}