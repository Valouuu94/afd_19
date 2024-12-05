import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { TableComponent } from '../../components/table/table.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;
declare const $: any;

@Component({
    selector: 'app-param-controles',
    templateUrl: './param-controles.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, NgClass, TableComponent, ModalComponent, FormsModule, NgFor]
})
export class ParamControlesComponent implements OnInit {

	@ViewChild('tableControles') tableControles!: TableComponent;
	@ViewChild('tableControleEtapes') tableControleEtapes!: TableComponent;
	@ViewChild('modalAddControle') modalAddControle!: ModalComponent;
	@ViewChild('modalAddControleEtape') modalAddControleEtape!: ModalComponent;

	create: boolean = true;
	controles: any;
	controle: any;
	controleEtape: any;
	controleEtapes: any;
	filtres: any;
	currentFiltre: any;
	filtreKey: any;
	filtreValue: any;
	filtreValueSelect: any;
	filtreOperator: any;
	refControleFiltre: any;
	refControleFiltreOperator: any;
	refControleFiltreValue: any;
	refControleAnomalies: any;
	refControleAnomaliesUnused: any;
	anomalies: any = [];
	anomalie: any;
	lang: any = lang;
	entite: string = '';
	perimetre: string = '';
	isDCV: boolean = false;
	controleId: string = '';
	controleCode: string = '';
	isSPC: boolean = false;
	parentPC: string = '';
	currentParentPC: string = '';
	app: any = app;
	hasNoRight: boolean = false;
	itemsByPage: number = 10;
	saveQueue: any[] = []; // Liste des elements à sauvegarder en attente
	isSaving: boolean = false; 


	constructor(public store: StoreService) { }

	ngOnInit() {
		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		this.controleId = 'controle' + ((this.isDCV) ? 'DCV' : '');

		this.enableToEdit();

		app.setCurrentCmp('paramControle', this);
	}

	async ngAfterViewInit() {
		app.removeStorageItem('refControleEtapes');
		app.setRefParam('refControleEtapes', this.entite + '/' + this.perimetre);

		app.removeStorageItem('refControleFiltreCriteres');
		app.setRefParam('refControleFiltreCriteres', this.entite);

		app.removeStorageItem('refControleAnomalies');
		app.removeStorageItem('refControleAnomaliesUnused');
		app.removeStorageItem('refControleTheme');
		app.removeStorageItem('refControleThemeActif');
		app.removeStorageItem('refControleThemeDCV');
		app.removeStorageItem('refControleThemeActifDCV');

		if (!this.isDCV) {
			app.removeStorageItem('refReglesAuto');
			app.setRefParam('refReglesAuto', this.entite);
		}

		await app.loadRefs();

		this.refControleFiltre = app.getRef('refControleFiltreCriteres');
		this.refControleFiltreOperator = app.getRef('refControleFiltreOperator');
		this.refControleFiltreValue = [];

		this.refControleAnomalies = app.getRef('refControleAnomalies');

		this.refControleAnomaliesUnused = [];
		var refAnosUnused = app.getRef('refControleAnomaliesUnused');
		for (var a of refAnosUnused)
			if (a.statutActif)
				this.refControleAnomaliesUnused.push(a);

		app.setCurrentCmp('ref-controle', this);

		await this.loadControles();

		this.filterControlesBy('actif', 'oui');
	}

	get modalTitle() {
		if (this.isDCV) {
			if (this.isSPC)
				return ((this.create) ? lang.controlesDCV.titleAddSPC : lang.controlesDCV.titleUpdateSPC + ' ' + this.controleCode);
			else
				return ((this.create) ? lang.controlesDCV.titleAddPC : lang.controlesDCV.titleUpdatePC + ' ' + this.controleCode);
		} else
			return ((this.create) ? lang.controles.titleAdd : lang.controles.titleUpdate + ' ' + this.controleCode);
	}

	get modalSubtitle() {
		if (this.isDCV)
			return ((this.controleEtape == null) ? lang.controle.etape.titleAdd : lang.controle.etape.titleUpdateDCV) + ' ' + this.controleCode;
		else
			return ((this.controleEtape == null) ? lang.controle.etape.titleAdd : lang.controle.etape.titleUpdate) + ' ' + this.controleCode;
	}

	//# CONTROLE
	async loadControles(skipDefaultSort?: any) {
		var url = app.getUrl('urlGetParamControles', this.entite + '/' + this.perimetre);

		var ctrls = await app.getExternalData(url, 'param-controles > loadControles');

		if (ctrls != null) {
			for (let ctrl of ctrls) {
				ctrl.ordre = ctrl.ordre ||'0';
				ctrl.actif = false;
				ctrl.anomalies = '';
				ctrl.parent = '';
				ctrl.etape = '';
				ctrl.niveau = ((this.isDCV) ? '0' : '1');

				if (ctrl.paramControleEtapes != null && ctrl.paramControleEtapes.length > 0) {
					ctrl.paramControleEtapes.sort((a: any, b: any) => a.ordre - b.ordre);


					ctrl.ordre = ctrl.paramControleEtapes[0].ordre;
					ctrl.actif = ctrl.paramControleEtapes[0].actifControle;
					ctrl.parent = ctrl.paramControleEtapes[0].controleParentCode;
					ctrl.etape = ctrl.paramControleEtapes[0].idParamEtape;

					if (!this.isDCV)
						ctrl.niveau = (app.isEmpty(ctrl.parent) ? '1' : '2');
					else
						ctrl.niveau = ctrl.paramControleEtapes[0].niveauAffichage;

					if (ctrl.paramControleEtapes[0].paramTypeAnomalies != null && ctrl.paramControleEtapes[0].paramTypeAnomalies.length > 0) {
						for (var etapeAnomalie of ctrl.paramControleEtapes[0].paramTypeAnomalies) {
							if (ctrl.anomalies != '')
								ctrl.anomalies += '<br>';
							ctrl.anomalies += etapeAnomalie.codeAnomalie + ' - ' + etapeAnomalie.libelleAnomalie;
						}
					}
				}
			}
		}

		this.controles = ctrls;

		this.itemsByPage = this.controles.length;

		await app.sleep(150);

		this.tableControles.getItems((skipDefaultSort != null));
	}

	async changeOrder(item: any, diff: any) {
		
		app.log('changeOrder item diff', item, diff);

		if (!item) return;

		var controles: any[] = [];

		// Sélection des contrôles concernés
		for (let controle of this.controles) {
			controle.moved = false;
			if (item.niveau === 2) {
				if (controle.parent === item.parent && controle.actif) controles.push(controle);
			} else {
				if (controle.niveau === 1 && controle.actif) controles.push(controle);
			}
		}

		controles.sort((a: any, b: any) => a.ordre - b.ordre);

		// Localiser l'élément à déplacer
		const indexItem = controles.findIndex((ctrl: any) => ctrl.id === item.id);
		if (indexItem === -1) return;

		const newIndex = indexItem + diff;
		if (newIndex < 0 || newIndex >= controles.length) return;

		// Échanger les ordres
		const srcItemOrdre = controles[indexItem].ordre;
		const destItemOrdre = controles[newIndex].ordre;

		controles[indexItem].ordre = destItemOrdre;
		controles[newIndex].ordre = srcItemOrdre;
		controles[indexItem].moved = true;
		controles[newIndex].moved = true;

		// Mettre à jour les SPC (si niveau 1)
		if (item.niveau === 1) {
			const controlesPCsrc = this.controles.filter(
				(ctrl: any) => ctrl.niveau === 2 && ctrl.actif && ctrl.parent === controles[indexItem].codeControle
			);
			const controlesPCdest = this.controles.filter(
				(ctrl: any) => ctrl.niveau === 2 && ctrl.actif && ctrl.parent === controles[newIndex].codeControle
			);

			controlesPCsrc.sort((a: any, b: any) => a.ordre - b.ordre);
			controlesPCdest.sort((a: any, b: any) => a.ordre - b.ordre);
			let parentOrderSrc = controles[newIndex].ordre;
			for (let ctrl of controlesPCdest) {
				ctrl.ordre = ++parentOrderSrc;
				ctrl.moved = true;
			}

			let parentOrderDest = controles[indexItem].ordre;
			for (let ctrl of controlesPCsrc) {
				ctrl.ordre = ++parentOrderDest;
				ctrl.moved = true;
			}

		}

		// Tri du tableau après modification
		this.tableControles.sortByDefault();
		for (var controle of this.controles) {
			if (controle.moved == true) {
				await this.saveControle(app.copyJson(controle), true);
			}
		}

	}

	filterControlesBy(type: any, value: any) {
		if (this.tableControles.filters[type] == value)
			this.tableControles.filters[type] = '';
		else
			this.tableControles.filters[type] = value;

		this.tableControles.resetPage();
		this.tableControles.filterItems();
		this.tableControles.sortByDefault();
	}

	filterControlesSelected(type: any, value: any) {
		return (this.tableControles.filters[type] == value);
	}

	filterControlesAllSelected() {
		return (this.tableControles.filters['niveau'] == '' && this.tableControles.filters['actif'] == '' && this.tableControles.filters['etape'] == '');
	}

	filterControlesReset() {
		this.tableControles.filters['niveau'] = '';
		this.tableControles.filters['actif'] = '';
		this.tableControles.filters['etape'] = '';
		this.tableControles.resetPage();
		this.tableControles.filterItems();
		this.tableControles.sortByDefault();
	}

	async addSPC(item: any) {
		this.addControle(true, item.codeControle);
	}

	async addControle(isSPC: any, parentCode?: any) {
		this.parentPC = '';
		if (parentCode != null)
			this.parentPC = parentCode;

		this.isSPC = isSPC;

		this.create = true;
		this.controleEtapes = null;

		app.resetDO('controle');

		var DO = app.getDO('controle');
		DO.perimetre = this.perimetre;
		DO.autoControle = '';
		DO.criticiteControle = '';
		DO.regleAuto = '';

		app.setBDM(DO);

		await this.loadThemesActifs();

		await app.sleep(250);

		appFormio.loadFormIO(this.controleId);

		await app.sleep(100);

		app.showModal('modalAddControle');
	}

	async updateControle(item: any) {
		this.create = false;
		this.controleCode = item.codeControle;

		this.controle = await app.getExternalData(app.getUrl('urlGetParamControle', item.id), 'page-controles > updateControle');

		if (this.controle.perimetre == null)
			this.controle.perimetre = this.perimetre;

		this.controleEtapes = this.controle.paramControleEtapes;

		if (this.isDCV && this.controle.paramControleEtapes.length == 0) {
			var DO = app.resetDO('controleEtape');

			var defaultEtapeDCV = this.getDefaultEtapeDCV();

			DO.id = '';
			DO.commentaireObligatoire = false;
			DO.lienObligatoire = false;
			DO.bloquantControle = false;
			DO.valorisable = true;
			DO.etape = { idParamEtape: defaultEtapeDCV };
			DO.idParamEtape = defaultEtapeDCV;
			DO.actifControle = false;
			DO.niveauAffichage = ((this.isSPC) ? '2' : '1');
			DO.paramTypeAnomalies = [];

			this.controleEtapes.push(app.copyJson(app.getDO('controleEtape')));

			/* TODO : actif par defaut 
			DO.actifControle = true;
			DO.ordre = this.generateOrder(null, this.controleCode);

			this.controleEtapes.push(app.copyJson(app.getDO('controleEtape')));

			this.anomalies = [];
			this.filtres = [];
			//this.currentParentPC = this.controleEtape.controleParentCode;
			this.controleEtape = this.controleEtapes[0];
			this.isSPC = (this.controleEtape.niveauAffichage == '2');
			await app.sleep(100);
			await this.addControleEtape(this.controleEtape, true);
			await this.saveControleEtape(true);*/
		}

		app.resetDO('controle');

		// if (!this.isDCV)
		// this.controle.regleAuto = (this.controle.paramControleEtapes.length != 0 ? this.controle.paramControleEtapes[0].regleAuto : '');

		app.setBDM(app.mapDO(app.getDO('controle'), this.controle));

		await this.loadThemesActifs();

		await app.sleep(250);

		appFormio.loadFormIO(this.controleId);

		await app.sleep(150);

		// appFormio.setDataValue(crossVars.forms['formio_' + this.controleId], 'regleAuto', this.controle.regleAuto);

		app.showModal('modalAddControle');

		await app.sleep(100);

		if (this.controleEtapes != null && this.isDCV) {
			for (let ctrl of this.controleEtapes) {
				ctrl.anomalies = '';

				if (ctrl.paramTypeAnomalies != null && ctrl.paramTypeAnomalies.length > 0) {
					for (var etapeAnomalie of ctrl.paramTypeAnomalies) {
						if (ctrl.anomalies != '')
							ctrl.anomalies += '<br>';
						ctrl.anomalies += etapeAnomalie.codeAnomalie + ' - ' + etapeAnomalie.libelleAnomalie;
					}
				}
			}
		}

		this.tableControleEtapes.getItems();
	}

	async loadThemesActifs() {
		var themesControleResult = await app.getExternalData(app.getUrl('urlGetThemes', this.entite + '/' + this.store.getUserPerimetre()), 'page-param-controles > loadThemesActifs');
		var themesControle = [];
		for (var tc of themesControleResult)
			if (tc.statutActif)
				themesControle.push(tc);

		if (this.isDCV)
			app.setRef(themesControle, 'refControleThemeActifDCV', 'codeTheme', 'libelleTheme');
		else
			app.setRef(themesControle, 'refControleThemeActif', 'codeTheme', 'libelleTheme');
	}

	async saveControle(item: any, skipReload?: boolean) {
		this.saveQueue.push({ item, skipReload });
	
		if (this.isSaving) return;
	
		this.isSaving = true;
		try {
			while (this.saveQueue.length > 0) {
				// Extraire la sauvegarde à traiter , le premier element
				const { item: currentItem, skipReload: currentSkipReload } = this.saveQueue.shift();

				if (!this.hasNoRight) {
					var resultCreate = null;
	
					if (currentItem == null && !app.isValidForm('formio_' + this.controleId)) {
						this.modalAddControle.setLoadingBtn();
						continue;
					}
	
					// Vérification du code contrôle existant
					var codeControle = appFormio.getDataValue(crossVars.forms['formio_' + this.controleId], 'codeControle');
					if ((currentItem == null && this.create) || (!this.create && this.controleCode != codeControle)) {
						var alreadyExist = this.controles.some((ctrl : any) => ctrl.codeControle === codeControle);
	
						if (alreadyExist) {
							app.showToast('toastParamControlesAlreadyExist');
							this.modalAddControle.setLoadingBtn();
							continue;
						}
					}
	
					if (currentItem != null && this.isDCV) {
						app.resetDO('controle');
						var DO = app.mapDO(app.getDO('controle'), currentItem);
	
						DO.id = currentItem.id;
						DO.paramControleEtapes = currentItem.paramControleEtapes;
						DO.autoControle = false;
						DO.criticiteControle = false;
	
						if (!currentItem.actif) currentItem.ordre = 0;
	
						if (DO.paramControleEtapes != null && DO.paramControleEtapes.length > 0) {
							DO.paramControleEtapes[0].ordre = currentItem.ordre;
							DO.paramControleEtapes[0].actifControle = currentItem.actif;
						}
	
						await app.setExternalData(app.getUrl('urlSetParamControle', currentItem.id), DO, 'PUT');
					} else {
						await app.saveFormData(app.getRootDO('controle'), crossVars.forms['formio_' + this.controleId]);
	
						var DO = app.getDO('controle');
						DO.entite = this.entite;
	
						if (this.isDCV) {
							DO.autoControle = false;
							DO.criticiteControle = false;
						}
	
						if (this.create)
							resultCreate = await app.setExternalDataWithResult(app.getUrl('urlAddParamControle'), DO);
						else {
							DO.id = this.controle.id;

							//mettre le code de la regle auto dans paramControleEtape
							// for (var index = 0; index < this.controleEtapes.length; index++)
							// this.controleEtapes[index].regleAuto = appFormio.getDataValue(crossVars.forms['formio_' + this.controleId], 'regleAuto');

							DO.paramControleEtapes = this.controleEtapes;
	
							await app.setExternalData(app.getUrl('urlSetParamControle', this.controle.id), DO, 'PUT');
						}
	
						this.modalAddControle.setLoadingBtn();
						app.showToast('toastSaveSuccessParamControles');
						app.hideModal('modalAddControle');
					}
	
					if (currentSkipReload == null || currentSkipReload === false)
						await this.loadControles(true);
	
					if (resultCreate != null) {
						for (var ctrl of this.controles) {
							if (ctrl.id == resultCreate.id) {
								this.updateControle(ctrl);
							}
						}
					}
				}
			}
		} catch (error) {
			app.log('Erreur dans saveControle', error);
		} finally {
			this.isSaving = false;
		}
	}

	//# CONTROLE ETAPE
	async addControleEtape(item: any, hidden: any) {
		if (item == null) {
			this.controleEtape = null;
			this.filtres = [];
			this.anomalies = [];

			app.setBDM(null);
		}

		app.cleanDiv('formio_' + this.controleId + 'Etape');

		this.currentFiltre = null;
		this.filtreKey = null;
		this.filtreValue = null;
		this.filtreValueSelect = null;
		this.filtreOperator = null;

		app.removeStorageItem('refControleAnomalies');
		app.removeStorageItem('refControleAnomaliesUnused');

		await app.loadRefs();

		this.refControleAnomalies = app.getRef('refControleAnomalies');

		this.refControleAnomaliesUnused = [];
		var refAnosUnused = app.getRef('refControleAnomaliesUnused');
		for (var a of refAnosUnused)
			if (a.statutActif)
				this.refControleAnomaliesUnused.push(a);

		var controlesPC = [];
		for (var ctrl of this.controles) {
			if (ctrl.niveau == '1' && ctrl.actif) {
				controlesPC.push({
					code: ctrl.codeControle,
					libelle: ctrl.codeControle + ' - ' + ctrl.descriptionControleFr
				});
			}
		}

		app.setRef(controlesPC, 'controlesPC', 'code', 'libelle');

		await app.sleep(100);

		appFormio.loadFormIO(this.controleId + 'Etape');

		if (!hidden) {
			app.showModal('modalAddControleEtape');

			$('#modalAddControleEtape').on('hidden.bs.modal', function (e: any) {
				app.refreshModal('modalAddControle', true);
			});
		}

		await app.sleep(250);

		if (this.isDCV) {
			appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'niveauAffichage', ((this.isSPC) ? '2' : '1'));

			if (this.create)
				appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'actifControle', 'Y');

			if (this.parentPC != '')
				appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'controleParentCode', this.parentPC);

			appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'nonApplicable', app.mapBoolean(item.nonApplicable));
		} else
			appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'niveauAffichage', item.niveauAffichage);

		await app.sleep(500);

		appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'commentaireObligatoireValeur', item.commentaireObligatoireValeur);
		appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'bloquantControleValeur', item.bloquantControleValeur);
		appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'valeurPere', item.valeurPere);
		appFormio.setDataValue(crossVars.forms['formio_' + this.controleId + 'Etape'], 'lienObligatoireValeur', item.lienObligatoireValeur);
	}

	async updateControleEtape(item: any) {
		this.controleEtape = item;

		if (item.filtre != null && item.filtre.length > 0)
			this.filtres = JSON.parse(item.filtre);
		else
			this.filtres = [];

		if (item.paramTypeAnomalies == null)
			this.anomalies = [];
		else
			this.anomalies = item.paramTypeAnomalies;

		this.isSPC = (this.controleEtape.niveauAffichage == '2');

		this.currentParentPC = this.controleEtape.controleParentCode;

		app.setBDM(app.mapDO(app.getDO('controleEtape'), this.controleEtape));

		this.addControleEtape(item, false);
	}

	async saveControleEtape(skipValid: any) {
		if (!this.hasNoRight) {
			if (!skipValid && !app.isValidForm('formio_' + this.controleId + 'Etape')) {
				this.modalAddControleEtape.setLoadingBtn();
				return;
			}

			var defaultEtapeDCV = this.getDefaultEtapeDCV();

			await app.saveFormData(app.getRootDO('controleEtape'), crossVars.forms['formio_' + this.controleId + 'Etape']);

			if (this.controleEtape == null) {
				var DO = app.getDO('controleEtape');
				DO.id = '';
				DO.filtre = JSON.stringify(this.filtres);
				DO.paramTypeAnomalies = this.anomalies;

				if (DO.etape == null)
					DO.etape = { idParamEtape: DO.idParamEtape };
				else
					DO.etape.idParamEtape = DO.idParamEtape;

				if (this.isDCV) {
					DO.commentaireObligatoire = false;
					DO.lienObligatoire = false;
					DO.bloquantControle = false;
					DO.valorisable = true;
					DO.etape.idParamEtape = DO.idParamEtape;

					if (!this.isSPC)
						DO.nonApplicable = false;
				}

				this.controleEtapes.push(app.copyJson(app.getDO('controleEtape')));
			} else {
				for (var ctrlEtape of this.controleEtapes) {
					if (ctrlEtape == this.controleEtape) {
						app.mapDO(ctrlEtape, app.copyJson(app.getDO('controleEtape')), true);

						if (ctrlEtape.etape == null)
							ctrlEtape.etape = { idParamEtape: ctrlEtape.idParamEtape };
						else
							ctrlEtape.etape.idParamEtape = ctrlEtape.idParamEtape;

						ctrlEtape.filtre = JSON.stringify(this.filtres);
						ctrlEtape.paramTypeAnomalies = this.anomalies;

						if (this.isDCV) {
							ctrlEtape.commentaireObligatoire = false;
							ctrlEtape.lienObligatoire = false;
							ctrlEtape.bloquantControle = false;
							ctrlEtape.valorisable = true;
							ctrlEtape.etape.idParamEtape = ctrlEtape.idParamEtape;

							if (!this.isSPC)
								ctrlEtape.nonApplicable = false;
						}
					}
				}
			}

			//TODO : reload refanomalies

			app.log('page-ref-controles > saveControleEtape - controleEtapes', this.controleEtapes);
			app.log('page-ref-controles > saveControleEtape - filtres', JSON.stringify(this.filtres));

			this.modalAddControleEtape.setLoadingBtn();

			app.hideModal('modalAddControleEtape');

			this.tableControleEtapes.getItems();
		}
	}

	getDefaultEtapeDCV() {
		var defaultEtapeDCV = null;

		var etapes = app.getRef('refControleEtapes');

		if (etapes != null && etapes.length > 0)
			defaultEtapeDCV = etapes[0].idParamEtape;

		return defaultEtapeDCV;
	}

	//# FILTRES 
	isDisabledFilterButtons() {
		var filtreValue = '';
		if (this.filtreKey != null && (this.filtreKey.refCritere == null || this.filtreKey.refCritere == ''))
			filtreValue = this.filtreValue;
		else if (this.filtreKey != null && this.filtreKey.refCritere != null && this.filtreKey.refCritere != '')
			filtreValue = this.filtreValueSelect;

		return (app.isEmpty(this.filtreKey) || app.isEmpty(this.filtreOperator) || app.isEmpty(filtreValue))
	}

	addCritereToNewFiltre() {
		this.currentFiltre = [];
		this.filtres.push(this.currentFiltre);

		this.addCritereToFiltre();
	}

	addCritereToFiltre() {
		this.currentFiltre.push({
			key: this.filtreKey.codeCritere,
			operator: this.filtreOperator,
			value: ((this.filtreValue != '') ? this.filtreValue : this.filtreValueSelect),
			type: this.filtreKey.typeObjet
		});
	}

	deleteFiltre(index: any) {
		this.filtres.splice(index, 1);
	}

	deleteCritere(index: any) {
		this.currentFiltre.splice(index, 1);
	}

	changeCritere() {
		this.filtreValue = '';
		this.filtreValueSelect = '';

		if (this.filtreKey.refCritere != null && this.filtreKey.refCritere != '') {
			if (app.isEmpty(this.filtreKey.entite))
				this.refControleFiltreValue = app.getRef(this.filtreKey.refCritere);
			else
				this.refControleFiltreValue = app.getRef(this.filtreKey.refCritere + this.filtreKey.entite);
		} else
			this.refControleFiltreValue = [];
	}

	//# ANOMALIES
	addAnomalie() {
		if (app.existInArray(this.anomalies, 'idTypeAnomalie', this.anomalie.code))
			app.showToast('toastParamControlesAlreadyExist');
		else
			this.anomalies.push({ 'idTypeAnomalie': this.anomalie.code });

		this.anomalie = null;
	}

	deleteAnomalie(index: any) {
		this.anomalies.splice(index, 1);
	}

	changeTypologie(form: any) {
		this.isSPC = (appFormio.getDataValue(form, 'niveauAffichage') == '2');

		if (!this.isSPC) { //si PC alors pas de controle parent ni d'anomalies
			appFormio.setDataValue(form, 'controleParentCode', '');

			this.anomalies = [];
		}

		this.generateOrder(form, null);
	}

	changeActif(form: any) {
		if (appFormio.getDataValue(form, 'actifControle') == 'Y') //si actif on genere ordre sinon on met à 0
			this.generateOrder(form, null);
		else
			appFormio.setDataValue(form, 'ordre', 0);
	}

	changeParent(form: any) {
		var parentCode = appFormio.getDataValue(form, 'controleParentCode');

		if (this.currentParentPC != ((parentCode == null) ? '' : parentCode)) {
			this.generateOrder(form, null);

			this.currentParentPC = parentCode;
		}
	}

	generateOrder(form: any, paramParent: any) {
		var parent, niveau;

		if (form != null) {
			parent = appFormio.getDataValue(form, 'controleParentCode');
			niveau = appFormio.getDataValue(form, 'niveauAffichage');

			if (app.isEmpty(parent) && niveau == '2') { //si SPC et pas de controle parent alors on rend inactif et ordre à 0
				appFormio.setDataValue(form, 'ordre', 0);
				appFormio.setDataValue(form, 'actifControle', 'N');
				return;
			} else
				appFormio.setDataValue(form, 'actifControle', 'Y'); //sinon actif
		} else
			parent = paramParent;

		//calcul du nouvel ordre 
		var maxOrder = 0;
		var newOrder = 0;
		var parentOrder = 0;

		if (this.isSPC) { //si SPC
			if (!app.isEmpty(parent)) {
				for (var ctrl of this.controles)
					if (ctrl.niveau == '2' && ctrl.parent == parent && ctrl.ordre > maxOrder)
						maxOrder = ctrl.ordre;

				for (var ctrl of this.controles)
					if (ctrl.niveau == '1' && ctrl.codeControle == parent)
						parentOrder = ctrl.ordre;

				if (maxOrder == 0)
					newOrder = parentOrder + 1;
				else
					newOrder = maxOrder + 1;
			}
		} else { //si PC
			for (var ctrl of this.controles)
				if (ctrl.niveau == '1' && ctrl.ordre > maxOrder)
					maxOrder = ctrl.ordre;

			if (maxOrder == 0)
				newOrder = 100;
			else
				newOrder = ((maxOrder / 100) + 1) * 100;
		}

		if (form != null) {
			appFormio.setDataValue(form, 'ordre', newOrder);

			return;
		} else
			return newOrder;
	}

	enableToEdit() {
		this.hasNoRight = (!app.hasRightButton(this.store, 'param.controle'));
	}
}