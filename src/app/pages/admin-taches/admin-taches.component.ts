import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { TableComponent } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const lang: any;
declare const appFormio: any;
declare const crossVars: any;

@Component({
    selector: 'app-admin-taches',
    templateUrl: './admin-taches.component.html',
    standalone: true,
    imports: [ContentComponent, TableComponent, ModalComponent]
})
export class AdminTachesComponent implements OnInit {

	@ViewChild('tableTaches') tableTaches!: TableComponent;
	@ViewChild('modalAffectTasks') modalAffectTasks!: ModalComponent;

	appFormio: any = appFormio;
	lang: any = lang;
	taches: any = [];
	filtersButtons: any;
	isDCV: boolean = false;
	filtersDCV: any;
	listIdTasksSelected: any = [];
	listUsers: any = [];
	listRolesTasksSelected: any = [];
	itemsByPage: number = 10;

	constructor(private router: Router, private store: StoreService) { }

	ngOnInit() {
		this.isDCV = app.isDCV(this.store.getUserEntite(), this.store.getUserPerimetre());

		this.filtersButtons = [
			{ key: 'userTask', value: 'true', label: lang.taches.tasksAssigned },
			{ key: 'userTask', value: 'false', label: lang.taches.taskUnassigned }
		];

		this.filtersDCV = [
			{ key: 'descStatut', value: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterUnitaire },
			{ key: 'descStatut', value: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterRAJdefault },
			{ key: 'descStatut', value: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterRAJzero },
			{ key: 'descStatut', value: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterUnitaire },
			{ key: 'descStatut', value: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterRAJdefault },
			{ key: 'descStatut', value: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterRAJzero }
		];
	}

	ngAfterViewInit() {
		this.getTaches();
	}

	async getTaches() {
		this.tableTaches.setLoading(true);

		if (this.isDCV)
			this.taches = await app.getExternalData(app.getUrl('urlGetTachesDCV'), 'page-admin-taches > getTaches');

		if (this.taches != null) {
			this.itemsByPage = this.taches.length;

			for (var tache of this.taches) {
				//si le code utilisateur stocké dans displayName est le meme que utilisateur connecté alors tache utilisateur sinon groupe
				tache.userTask = !app.isEmpty(tache.assigneeId);
				tache.tacheSelected = false;

				var roleActeur = tache.description.split("-")[2]
				tache.roleActeur = app.getRefLabel('refRoles', roleActeur)
				tache.codeRole = roleActeur;

				//on split la description pour recuperer toutes les infos du context
				// exemple : @ID=177-5##@NUM=CTN125901##@ST=Initialisé##@ACT=30018##@DESC=TUN - FEXTE I
				if (tache.displayDescription != null && tache.displayDescription.length > 0) {
					var splits = tache.displayDescription.split('##');

					if (splits != null && splits.length > 0) {
						for (var split of splits) {
							if (split != null && split.length > 0) {
								var splitElement = split.split("=");

								if (splitElement != null && splitElement.length >= 2) {
									if (splitElement[0] == '@ID')
										tache.descId = splitElement[1];
									else if (splitElement[0] == '@NUM')
										tache.descNumero = splitElement[1];
									else if (splitElement[0] == '@ST')
										tache.descStatut = splitElement[1];
									else if (splitElement[0] == '@ACT')
										tache.acteur = splitElement[1];
									else if (splitElement[0] == '@DESC')
										tache.descLibelle = splitElement[1];
								}
							}
						}
					}
				}
			}
		}

		await app.sleep(150);

		this.tableTaches.getItems();
	}

	filterItemsBy(type: any, value: any) {
		if (this.tableTaches.filters[type] == value)
			this.tableTaches.filters[type] = '';
		else
			this.tableTaches.filters[type] = value;

		this.tableTaches.resetPage();
		this.tableTaches.filterItems();
		this.tableTaches.sortByDefault();
	}

	filterItemsSelected(type: any, value: any) {
		return (this.tableTaches && this.tableTaches.filters[type] == value);
	}

	filterItemsAllSelected() {
		return (this.tableTaches && this.tableTaches.filters['descStatut'] == '');
	}

	filterItemsReset() {
		this.tableTaches.filters['descStatut'] = '';
		this.tableTaches.resetPage();
		this.tableTaches.filterItems();
		this.tableTaches.sortByDefault();
	}

	async affectTaks() {
		app.cleanDiv('formio_affectTasks');

		this.listUsers = [];

		if (this.taches.length > 0) {
			if (this.listIdTasksSelected.length == 0) {
				app.showToast('toastFailedAffectTasksError');
				return;
			}

			var listResult = await app.getExternalData(app.getUrl('urlGetPilotagePerimetres'), 'managers-dcv > getManagersDCV');

			if (app.existInArray(this.listIdTasksSelected, 'role', 'MANAGER2ND')) {
				for (var itemUser of listResult)
					if (app.isManagerDCV(itemUser.roleUtilisateur))
						this.listUsers.push(itemUser);
			}
			else
				this.listUsers = listResult;

			for (var user of this.listUsers)
				user.nom = user.nom.toUpperCase();

			app.setRef(this.listUsers, 'listUsers', 'idUtilisateur', ['nom', 'prenom']);

			appFormio.loadFormIO('affectTasks');

			await app.sleep(100);

			app.showModal("modalAffectTasks");
		}
	}

	async validateAffectTasks() {
		if (!app.isValidForm('formio_affectTasks')) {
			this.modalAffectTasks.setLoadingBtn();
			return;
		}

		var loginUser = appFormio.getDataValue(crossVars.forms['formio_affectTasks'], 'id_user');
		
		var idsTasks = [];

		for (var task of this.listIdTasksSelected)
			idsTasks.push(task.idTask);

		var DO = { 'listIdsTasks': idsTasks };

		await app.setExternalData(app.getUrl('urlAffecteTaks', loginUser), DO, 'POST');

		this.listIdTasksSelected = [];
		
		await app.sleep(500);
		
		await this.getTaches();

		this.modalAffectTasks.setLoadingBtn();

		app.hideModal("modalAffectTasks");
	}

	updateNombreTacheSelected(item: any) {
		if (Array.isArray(item)) {
			this.listIdTasksSelected = [];

			if (app.isTrueAll(item, 'tacheSelected'))
				for (var it of item)
					this.listIdTasksSelected.push({ 'idTask': it.id, 'role': it.codeRole });
		}
		else {
			if (this.listIdTasksSelected.length > 0) {
				if (!app.existInArray(this.listIdTasksSelected, 'idTask', item.id)) {
					if (item.tacheSelected)
						this.listIdTasksSelected.push({ 'idTask': item.id, 'role': item.codeRole });
				}
				else {
					if (!item.tacheSelected) {
						var index = -1;
						for (var i = 0; i < this.listIdTasksSelected.length; i++)
							if (item.id == this.listIdTasksSelected[i].idTask)
								index = i;

						if (index != -1)
							this.listIdTasksSelected.splice(index, 1);
					}
				}
			}
			else 
				this.listIdTasksSelected.push({ 'idTask': item.id, 'role': item.codeRole });
		}
	}
}