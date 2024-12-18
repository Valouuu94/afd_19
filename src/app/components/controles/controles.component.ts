import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren, input, signal } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CommentsComponent } from '../comments/comments.component';
import { BtnComponent } from '../btn/btn.component';
import { BtnMenuComponent } from '../btnMenu/btnMenu.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const app: any;
declare const refs: any;
declare const lang: any;

@Component({
    selector: 'app-controles',
    templateUrl: './controles.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, BtnMenuComponent, BtnComponent, FormsModule, CommentsComponent]
})
export class ControlesComponent implements OnInit {

	app = signal<any>(app);
	lang = signal<any>(lang);
	entite = signal<string>('');
	perimetre = signal<string>('');
	isDCV = signal<boolean>(false);
	isAFD = signal<boolean>(false);
	errorMessage = signal<any>(null);
	caseId = signal<any>(null);
	etape = signal<any>(null);
	read = signal<boolean>(false);
	isReturnModaf = signal<boolean>(false);
	updatedValue = signal<boolean>(false);
	controles = signal<any>(null);
	typeControles = signal<any>([]);
	refCriticite = signal<any>(refs['refCriticite']);

	readonly role = input<any>();

	constructor(private store: StoreService, public cdr: ChangeDetectorRef) {
		this.cdr.detach();
	}

	ngOnInit(): void {
		this.entite.set(this.store.getUserEntite());
		this.perimetre.set(this.store.getUserPerimetre());
		this.isDCV.set(app.isDCV(this.entite(), this.perimetre()));
		this.isAFD.set(app.isAFD(this.entite()));
	  }
	
	  /* FOR TRACKERS */
	  trackByControle(index: any, item: any) {
		return item.id;
	  }
	  trackByTypeControle(index: any, item: any) {
		return item.code;
	  }
	  trackByAnomalie(index: any, item: any) {
		return item.persistenceId;
	  }
	

	

	/* GET */
	async loadControles(caseId: any, tache: any) {
		this.caseId.set(caseId);
		this.updatedValue.set(false);

		//chargement des controles en fonction du caseid
		const ctrls = await app.getExternalData(app.getUrl('urlGetControles', this.caseId()), 'cmp-controles > loadControles');

		//chargement de l'étape et du mode lecture ou modif
		let etape = app.getEtapeTache(tache);
		this.read.set(false);
		if (app.isEmpty(etape)) {
		if (this.isDCV()) {
			etape = (ctrls.length > 0 ? ctrls[0].code_etape : 'controlesDCV');
		} else {
			etape = (this.isAFD() ? 'controleCP' : 'controlesCG'); //etape par defaut en lecture 
			this.read.set(true);
		}
		}
		this.etape.set(etape);

		app.log('page-versement-controles > loadControles - etape', this.etape());

		//creation des controles
		const controles = [];
		for (const ctrl of ctrls) {
		controles.push({
			id: ctrl.persistenceId,
			code: ctrl.code_controle,
			caseId: this.caseId(),
			value: ctrl.valeur,
			isAuto: ctrl.auto_controle,
			type: ctrl.code_etape,
			isNA: ctrl.nonApplicable,
			anomalies: ctrl.anomalies,
			theme: app.getRefLabel('refControleTheme' + (this.isDCV() ? 'DCV' : this.entite()), ctrl.theme),
			codeTheme: ctrl.theme,
			infobulle: app.formatTextMultiLines(ctrl.infobulle),
			valorisable: (this.isDCV() ? (ctrl.niveauAffichage != null && ctrl.niveauAffichage === '2') : true),
			isCriticite: ctrl.criticite_controle,
			isBloquant: (ctrl.bloquant_controle != null && ctrl.bloquant_controle === 'true'),
			bloquantValue: (ctrl.bloquant_controle_valeur != null ? ctrl.bloquant_controle_valeur : ''),
			criticiteValue: (ctrl.criticite_controle && ctrl.criticite_controle_valeur !== '' ? ctrl.criticite_controle_valeur : ''),
			parentCode: ctrl.parentControleCode,
			parentLevel: (ctrl.niveauAffichage != null && ctrl.niveauAffichage !== '' ? ctrl.niveauAffichage : '1'),
			parentValue: (ctrl.valeurPere != null ? ctrl.valeurPere : ''),
			link: (ctrl.lien != null ? ctrl.lien : ''),
			ordre: ctrl.ordre,
			showLink: false,
			error: false,
			errorComment: false,
			errorLabel: null,
			linkRequired: (ctrl.lien_obligatoire != null ? ctrl.lien_obligatoire : false),
			linkRequiredValue: (ctrl.lien_obligatoire_valeur != null ? ctrl.lien_obligatoire_valeur : ''),
			commentRequired: (ctrl.commentaire_obligatoire != null ? ctrl.commentaire_obligatoire : false),
			commentRequiredValue: (ctrl.commentaire_obligatoire_valeur != null ? ctrl.commentaire_obligatoire_valeur : ''),
			commentCount: 0,
			libelle: app.formatTextMultiLines((app.getCurrentLang() === 'en' ? ctrl.libelle_controle_en : ctrl.libelle_controle_fr)),
			persistenceId: ctrl.persistenceId,
			firstStepPersistenceId: null,
			alterned: true
		});
		}

		if (this.isDCV()) {
		for (const ctrl of controles) {
			if (ctrl.anomalies != null && ctrl.anomalies.length > 0) {
			//tri des anomalies par ordre
			ctrl.anomalies.sort((a: any, b: any) => a.ordre - b.ordre);

			for (const ctrlAnomalie of ctrl.anomalies) {
				ctrlAnomalie.libelle_anomalie = app.formatTextMultiLines(ctrlAnomalie.libelle_anomalie);
			}
			}

			//si une seule anomalie pour DCV on coche par defaut
			if (ctrl.anomalies != null && ctrl.anomalies.length === 1) {
			ctrl.anomalies[0].valeur = true;
			}
		}
		}

		//gestion des colonnes/etapes
		const refType = 'refControleType' + (this.isDCV() ? 'DCV' : this.entite());
		const types = refs[refType];

		//on recherche si l'etape existe pour les etapes de controle, pour AFD 1er niveau seulement
		let existEtape = false;
		if (this.isAFD() && !this.isDCV()) {
		for (const type of types) {
			if (type.code === this.etape()) {
			existEtape = true;
			}
		}
		}

		for (const type of types) {
		type.disabled = false; //force onglet en enable
		type.current = (type.code === this.etape());

		//si AFD niveau 1, on force la 2e etape si on trouve pas l'etape pour les controles et on passe en lecture
		if (this.isAFD() && !this.isDCV() && !existEtape && type.code === 'controleCP') {
			type.current = true;
			this.etape.set('controleCP');
			this.read.set(true);
		}
		}

		//affichage ou pas de certains controles / tri
		this.loadControlesShow(controles);

		this.sortControles(controles);

		this.typeControles.set(types);

		await app.sleep(500);

		this.controles.set(controles);

		//gestion des thematiques et de l'alternance de style
		const themes = [];
		let alterned = false;
		for (const ctrl of this.controles()) {
		if (ctrl.theme != null && ctrl.theme !== '' && !app.existStringInArray(themes, ctrl.theme) && ctrl.show && ((this.isAFD() && ctrl.type === this.etape()) || !this.isAFD())) {
			themes.push(ctrl.theme);
		} else {
			ctrl.theme = null;
		}

		//initialisation du persistenceId de la 1ere etape du controle pour la gestion des commentaires
		if (types != null && types.length > 0) {
			if (ctrl.type !== types[0].code && this.isAFD()) {
			let firstStepControl = this.getControleEtapeValue(ctrl, types[0]);

			if (firstStepControl.persistenceId == null) { //si pas etape agent, on recup etage cp
				firstStepControl = this.getControleEtapeValue(ctrl, types[1]);
			}

			if (firstStepControl.persistenceId != null) {
				ctrl.firstStepPersistenceId = firstStepControl.persistenceId;
			}
			} else {
			ctrl.firstStepPersistenceId = ctrl.persistenceId;
			}
		}

		ctrl.alterned = alterned;

		if (ctrl.show && ctrl.type === this.etape()) {
			alterned = !alterned;
		}
		}

		//test si retour arriere MODAF
		this.isReturnModaf.set(false);

		//envoi des infos thematiques et compteur à la page parente
		app.getCurrentCmp('controles').themesControles = themes;
		this.getCountControlesChecked();

		app.log('controles.loadControles() > controles, typeControle, themes', this.controles(), this.typeControles(), themes);

		this.cdr.detectChanges();
	}

	getCountControlesChecked() {
		let count = 0;
		for (const ctrl of this.controles()) { //calcul du nombre de contrôles renseignés par étape
		if (ctrl.value != null && ctrl.value !== '' && ctrl.show && ctrl.valorisable && ((ctrl.type === this.etape() && !this.read()) || this.read())) {
			if (!this.isDCV()) {
			if (ctrl.type != null && ctrl.type.startsWith('controle')) {
				count++;
			}
			} else {
			count++;
			}
		}
		}
		app.getCurrentCmp('controles').countControlesChecked = count;
	}

	getTypeControles(type: any) {
		if (this.isAFD()) {
		if (!this.isDCV()) {
			return this.typeControles();
		} else {
			for (const typeCtrl of this.typeControles()) {
			if (typeCtrl.current) {
				return [typeCtrl];
			}
			}
		}
		} else {
		for (const typeCtrl of this.typeControles()) {
			if (typeCtrl.code === type.code) {
			return [typeCtrl];
			}
		}
		}
	}

	getControleValue(code: any, controles: any) {
		for (const controle of controles) {
		if (controle.code === code) {
			return controle.value;
		}
		}
		return;
	}

	getControleEtapeValue(controle: any, etape: any) {
		for (const ctrl of this.controles()) {
		if (ctrl.code === controle.code && ctrl.type === etape.code) {
			return ctrl;
		}
		}
		return { value: null };
	}

	loadControlesShow(controles: any) {
		for (const controle of controles) {
		controle.show = true;

		if (!this.isDCV()) {
			if (controle.parentCode != null && controle.parentCode !== '' && (controle.parentValue === '' || this.getControleValue(controle.parentCode, controles) !== controle.parentValue)) {
			controle.show = false;
			controle.value = null;
			}
		} else if (!controle.valorisable || ((controle.anomalies == null || controle.anomalies.length === 0) && (controle.value == null || controle.value === ''))) {
			controle.show = false;
		}
		}

		if (this.isDCV()) { //2e passe pour gérer l'affichage des PC (avec SPC qui sont visibles)
		for (const controle of controles) {
			if (!controle.valorisable) {
			for (const ctrl of controles) {
				if (controle.code === ctrl.parentCode && ctrl.show) {
				controle.show = true;
				break;
				}
			}
			}
		}
		}

		//calcul du nombre total de controles par étape
		let count = 0;
		for (const controle of controles) {
		if (controle.show && controle.valorisable && ((controle.type === this.etape() && !this.read()) || this.read())) {
			if (!this.isDCV()) {
			if (controle.type != null && controle.type.startsWith('controle')) {
				count++;
			}
			} else {
			count++;
			}
		}
		}

		app.getCurrentCmp('controles').countControlesTotal = count;
	}

	sortControles(controles: any) {
		app.sortByBis(controles, [
		{ key: 'codeTheme', order: 'ASC' },
		{ key: 'ordre', order: 'ASC' },
		{ key: 'libelle', order: 'ASC' }
		]);
	}


	/* SET */
	setControleValue(controle: any, value: any, skipDetect: boolean) {
		this.updatedValue.set(true);

		controle.value = value;

		this.loadControlesShow(this.controles());

		this.getCountControlesChecked();

		if (!skipDetect) {
		this.cdr.detectChanges();
		}
	}

	toggleControleAnomalie(anomalie: any, controle: any) {
		if (controle != null && controle.anomalies != null && controle.anomalies.length > 1) {
		anomalie.valeur = !anomalie.valeur;

		this.cdr.detectChanges();
		}
	}

	async verifControles() {
		this.errorMessage.set('');

		for (const controle of this.controles()) {
		controle.error = false;
		controle.errorComment = false;
		controle.errorLabel = '';

		//si le controle est affiché qu'il est dans l'etape courante de saisie
		if (controle.show && controle.type === this.etape()) {
			//si controle bloquant alors la valeur ne doit pas etre vide et si valeur bloquante est parametréee alors la valeur du controle ne doit pas etre egale à celle ci 
			if (controle.isBloquant && ((controle.value == null || controle.value === '') ? true : (controle.bloquantValue != null && controle.bloquantValue !== '' && String(controle.value) === controle.bloquantValue))) {
			this.errorMessage.set(' ');
			controle.error = true;
			if (controle.errorLabel !== '') {
				controle.errorLabel += ' / ';
			}
			controle.errorLabel += lang.controles.isBloquant;
			app.log('cmp-controles > verifControles - bloquant', controle);
			}

			//si un commentaire est obligatoire, en fonction d'une certaine valeur ou pas 
			if (controle.commentRequired && controle.commentTextCount === 0
			&& ((controle.value == null) ? '' : ((controle.commentRequiredValue === '') ? '' : String(controle.value))) === controle.commentRequiredValue) {
			this.errorMessage.set(' ');
			controle.error = true;
			controle.errorComment = true;
			if (controle.errorLabel !== '') {
				controle.errorLabel += ' / ';
			}
			controle.errorLabel += lang.controles.commentRequired;
			app.log('cmp-controles > verifControles - commentaire', controle);
			}

			//lien obligatoire si paramétré et que le controle n'est pas renseigné ou la valeur requise paramétrée est selectionnée
			if (controle.linkRequired && controle.linksCount === 0
			&& ((controle.value == null) ? '' : ((controle.linkRequiredValue === '') ? '' : String(controle.value))) === controle.linkRequiredValue) {
			this.errorMessage.set(' ');
			controle.error = true;
			if (controle.errorLabel !== '') {
				controle.errorLabel += ' / ';
			}
			controle.errorLabel += lang.controles.linkRequired;
			app.log('cmp-controles > verifControles - lien', controle);
			}

			if (this.isDCV()) {
			//bloquant second niveau (si le controle est valorisable et qu'il n'est pas renseigné)
			if (controle.value == null && controle.valorisable) {
				this.errorMessage.set(' ');
				controle.error = true;
				if (controle.errorLabel !== '') {
				controle.errorLabel += ' / ';
				}
				controle.errorLabel += lang.controles.isBloquant;
				app.log('cmp-controles > verifControles - bloquant 2nd', controle);
			}

			//anomalies second niveau (si controle KO et qu'il y a des anomalies)
			if (controle.value === '0' && controle.anomalies != null && controle.anomalies.length > 0) {
				let anomaliechecked = false;

				for (const anomalie of controle.anomalies) {
				if (anomalie.valeur) {
					anomaliechecked = true; //on doit avoir au moins une ano qui est cochée
				}
				}

				if (!anomaliechecked) {
				this.errorMessage.set(' ');
				controle.error = true;
				if (controle.errorLabel !== '') {
					controle.errorLabel += ' / ';
				}
				controle.errorLabel += lang.controles.anomalieRequired;
				app.log('cmp-controles > verifControles - anomalie', controle);
				}
			}
			}
		}
		}

		if (this.errorMessage() !== '') {
		this.errorMessage.set(this.isDCV() ? lang.errorValidateForm : lang.toastValideControlesKo);
		app.showToast('toastVerifControles');
		return false;
		}

		return true;
	}

	async saveControles(validate?: any) {
		if (validate) {
		const verif = await this.verifControles();

		this.cdr.detectChanges();

		if (!verif) {
			return;
		}
		}

		const controles = [];

		for (const controle of this.controles()) {
		if (controle != null) {
			const anomalies = [];

			if (controle.anomalies != null && controle.anomalies.length !== 0 && String(controle.value) === '0') {
			for (const anomalie of controle.anomalies) {
				anomalies.push({
				'persistenceId': anomalie.persistenceId,
				'valeur': anomalie.valeur,
				'commentaire': anomalie.commentaire
				});
			}
			}

			controles.push({
			"persistenceId": controle.id.toString(),
			"criticite_controle_valeur": controle.criticiteValue.toString(),
			"lien": (controle.link != null ? controle.link.toString() : ''),
			"valeur": (controle.value != null ? controle.value.toString() : null),
			"anomalies": anomalies
			});
		}
		}

		const DO = app.getRootDO('controles');
		DO.caseId = this.caseId();
		DO.controleInput = controles;
		DO.codeEtape = this.etape();

		return DO;
	}

	selectAllNA(codeTheme: any) {
		app.log('controles > selectAllNA', codeTheme, this.controles());

		for (const controle of this.controles()) {
		if (controle.codeTheme === codeTheme && controle.show && controle.valorisable && controle.isNA && !controle.isAuto && this.etape() === controle.type) {
			this.setControleValue(controle, -1, true);
		}
		}

		this.cdr.detectChanges();
	}

	showToastSaveComment(value: any) {
		if (value) {
		app.showToast('toastSaveCommentSuccessControles');
		} else {
		app.showToast('toastSaveErrorControles');
		}
	}


	/* RULES */
	showControle(controle: any, type: any) {
		return controle.type === type.code && controle.show;
	}
	
	showAlterned(indexControle: any, controle: any) {
		return controle.alterned;
	}
	
	showTheme(controle: any, type: any) {
		return controle.type === type.code && controle.show && controle.theme != null && controle.theme !== '';
	}
	
	showError(controle: any, type: any) {
		return controle.errorLabel != null && controle.errorLabel !== '' && type.current;
	}
	
	showAnomalies(controle: any, type: any) {
		return this.isDCV() && controle.value === 0 && controle.type === type.code && controle.show;
	}
	
	showLink(controle: any, type: any) {
		return !this.isDCV() && controle.type === type.code && controle.show && (controle.showLink || (!type.current && controle.link !== ''));
	}
	
	showHelp(controle: any, type: any) {
		return controle.infobulle != null && controle.infobulle !== '';
	}
	
	showSubControleZone(controle: any, type: any) {
		return !this.isDCV() && controle.parentCode != null && controle.parentCode !== '' && controle.parentLevel === '2';
	}
	
	showComment(controle: any, type: any) {
		if (this.read()) {
		return controle.commentCount > 0;
		} else {
		if (this.isDCV()) {
			if (controle.parentLevel !== "1") {
			return this.isAFD() ? true : (type.current || (!type.current && controle.commentCount > 0));
			} else {
			return false;
			}
		} else {
			return this.isAFD() ? true : (type.current || (!type.current && controle.commentCount > 0));
		}
		}
	}
	}