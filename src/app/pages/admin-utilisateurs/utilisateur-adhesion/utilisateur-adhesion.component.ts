import { Component, OnInit, input, output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-utilisateur-adhesion',
    templateUrl: './utilisateur-adhesion.component.html',
    standalone: true,
    imports: [FormsModule, NgFor, NgIf]
})
export class UtilisateurAdhesionComponent implements OnInit {

	readonly userRoles = input<any>();
	readonly DO = input<any>();

	readonly addUtilisateurEntites = output();
	readonly removeUtilisaterEntite = output();

	entites: any = [];
	roles: any;
	filtreEntite: any;
	filtreValue: any;
	filtreValueSelect: any;
	filtreRole: any;
	currentrole: any;
	app: any = app;
	lang: any = lang;
	refRoleFiltreValue: any;
	refEntiteFiltreValue: any;
	userEntites: any = [];
	userCurrentEntite: any;
	userCurrentTypeEntite: any;
	roleExist: boolean = false;
	obj: any;
	utilisateurAdhesionExist: any;

	constructor() { }

	ngOnInit() {
		this.roles = app.getRef('refRoles');
	}

	deleteRole(item: any) {
		const indexEntite: number = this.userEntites.indexOf(item);
		var indexItem = this.userRoles().indexOf(item);

		if (indexEntite !== -1)
			this.userEntites.splice(indexEntite, 1);
		
		this.userRoles().splice(indexItem, 1);

		var obj = item;

		this.removeUtilisaterEntite.emit(obj);
	}

	changeEntite() {
		if (this.filtreEntite.codeEntiteOrga != null && this.filtreEntite.codeEntiteOrga != '')
			this.refEntiteFiltreValue = app.getRef(this.filtreEntite.codeEntiteOrga);
		else
			this.refEntiteFiltreValue = [];
	}

	changeRole() {
		if (this.filtreRole.code != null && this.filtreRole.code != '')
			this.refRoleFiltreValue = app.getRef(this.filtreRole.code);
		else
			this.refRoleFiltreValue = [];
	}

	addAdhesion() {
		for (let r of this.userRoles())
			this.userEntites.push(r['codeEntiteOrga']);

		this.currentrole = [];

		this.addEntiteToRole();

		this.userCurrentEntite = this.currentrole[0]['codeEntiteOrga'];
		this.userCurrentTypeEntite = this.currentrole[0]['typeEntiteOrga'];
		this.utilisateurAdhesionExist = this.currentrole[0]['entiteLibCourt'] + ' - ' + this.currentrole[0]['libelleRole'];
	
		var adhesionExist = false;
		for(var userRole of this.userRoles()) {
			if(userRole.id.codeEntiteOrga == this.userCurrentEntite && userRole.id.typeEntiteOrga == this.userCurrentTypeEntite && userRole.id.roleUtilisateur == this.currentrole[0]['codeRole']){
				adhesionExist = true;
				break;
			}
		}

		if(adhesionExist)
			app.showToast('toastUtilisateurAdhesionExist');
		else {
			var curEntite = app.findInArrayOrga(this.entites, "codeEntiteOrga", this.userCurrentEntite, "typeEntiteOrga", this.userCurrentTypeEntite);
			console.log("curEntite >>", app.findInArrayOrga(this.entites, "codeEntiteOrga", this.userCurrentEntite, "typeEntiteOrga", this.userCurrentTypeEntite));

			this.obj = {
				"id": {
					"idUtilisateur": this.DO().idUtilisateur,
					"codeEntiteOrga": this.userCurrentEntite,
					"roleUtilisateur": this.filtreRole.code,
					"typeEntiteOrga": curEntite.typeEntiteOrga
				},
				"entiteOrga": {
					"id": {
						"codeEntiteOrga": curEntite.codeEntiteOrga,
						"typeEntiteOrga": curEntite.typeEntiteOrga
					},
					"codeEntiteOrga": curEntite.codeEntiteOrga,
					"nomEntiteOrga": curEntite.nomEntiteOrga,
					"typeEntiteOrga": curEntite.typeEntiteOrga,
					"codeEntitePere": curEntite.codeEntitePere,
					"libCourt": curEntite.libCourt,
					"libLong": curEntite.libLong,
					"codeRespEntite": curEntite.codeRespEntite,
					"roleRespEntite": curEntite.roleRespEntite,
					"codeSociete": curEntite.codeSociete,
					"natureSocieteOrga": curEntite.natureSocieteOrga,
					"natureEntiteOrga": curEntite.natureEntiteOrga,
					"codeEntiteRoot": curEntite.codeEntiteRoot,
					"creationDate": curEntite.creationDate,
					"updateDate": curEntite.updateDate
				}
			};

			this.userRoles().push(this.obj);
			
			this.addUtilisateurEntites.emit(this.obj);
		}

		this.filtreEntite = '';
		this.filtreRole = '';
	}

	addEntiteToRole() {
		var adhesion = {
			"typeEntiteOrga": this.filtreEntite.typeEntiteOrga,
			"codeEntiteOrga": this.filtreEntite.codeEntiteOrga,
			"entiteLibCourt": this.filtreEntite.libCourt,
			"codeRole": this.filtreRole.code,
			"libelleRole": this.filtreRole.libelle
		};
		
		this.currentrole.push(adhesion);
	}

	isDisabledAddAdhesionButtons() {
		return (app.isEmpty(this.filtreEntite) || app.isEmpty(this.filtreRole));
	}
}