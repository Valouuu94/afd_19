import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { TableComponent } from '../../components/table/table.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const tachesRedirect: any;
declare const lang: any;

@Component({
    selector: 'app-taches',
    templateUrl: './taches.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, NgClass, NgFor, TableComponent]
})
export class TachesComponent implements OnInit {

	@ViewChild('tableTaches') tableTaches!: TableComponent;

	lang: any = lang;
	taches: any = [];
	filtersButtons: any;
	isDCV: boolean = false;
	filtersDCV: any;

	constructor(private router: Router, private store: StoreService) { }

	ngOnInit() {
		this.isDCV = app.isDCV(this.store.getUserEntite(), this.store.getUserPerimetre());

		this.filtersButtons = [
			{ key: 'userTask', value: 'true', label: lang.taches.filterMesTaches },
			{ key: 'userTask', value: 'false', label: lang.taches.filterTachesGroupes }
		];

		this.filtersDCV = [
			{ key: 'descStatut', value: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterUnitaire, label: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterUnitaire },
			{ key: 'descStatut', value: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterRAJdefault, label: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterRAJdefault },
			{ key: 'descStatut', value: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterRAJzero, label: lang.controlesDCV.filterControle + ' ' + lang.controlesDCV.filterRAJzeroAccent },
			{ key: 'descStatut', value: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterUnitaire, label: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterUnitaire },
			{ key: 'descStatut', value: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterRAJdefault, label: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterRAJdefault },
			{ key: 'descStatut', value: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterRAJzero, label: lang.controlesDCV.filterAnomalie + ' ' + lang.controlesDCV.filterRAJzeroAccent }
		];
	}

	ngAfterViewInit() {
		this.getTaches();

		this.tableTaches.filterItemsBy('userTask', 'true');
	}

	async getTaches() {
		this.tableTaches.setLoading(true);

		var tachesBdd = await app.getExternalData(app.getUrl('urlGetTaches', this.store.getUserId()), 'page-taches > getTaches');

		if (tachesBdd != null) {
			this.taches = [];
			for (var tache of tachesBdd) {
				//si le code utilisateur stocké dans displayName est le meme que utilisateur connecté alors tache utilisateur sinon groupe
				tache.userTask = (tache.displayName == this.store.getUserName());

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
										tache.descActeur = splitElement[1];
									else if (splitElement[0] == '@DESC')
										tache.descLibelle = splitElement[1];
								}
							}
						}
					}
				}
				
				var taskDCV = (tache.description.includes('CTRL2ND') || tache.description.includes('MANAGER2ND'));
				if((taskDCV && !app.isEmpty(tache.assigned_id)) || !taskDCV)
					this.taches.push(tache);
			}
		}

		await app.sleep(150);

		this.tableTaches.getItems();
	}

	async gotoTache(tache: any) {
		var context = await app.getExternalData(app.getUrl('urlGetContext', tache.id), 'page-taches > gotoTache - context');

		var typeTache = app.getTypeTache(tache);
		var etapeTache = app.getEtapeTache(tache);

		var typeTacheContext = typeTache;

		app.log('page-taches > gotoTache - typeTache/etapeTache/typeTacheContext', typeTache + ' / ' + etapeTache + ' / ' + typeTacheContext);

		for (var key of Object.keys(context)) {
			if (key.toLowerCase().includes(typeTacheContext.toLowerCase())) {
				app.log('page-taches > gotoTache - key - context[key].storageId', key + ' - ' + context[key].storageId);

				app.redirect(this.router, app.getUrl(tachesRedirect[typeTache][etapeTache], context[key].storageId));
			}
		}
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
}