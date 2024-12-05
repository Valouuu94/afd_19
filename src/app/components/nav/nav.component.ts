import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { NgFor, NgClass, NgIf } from '@angular/common';

declare const app: any;
declare const navItems: any;
declare const lang: any;

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    standalone: true,
    imports: [NgFor, NgClass, NgIf]
})
export class NavComponent implements OnInit {

	urlHttpServer: any;
	items: any;
	lang: any;
	user: any;
	app: any = app;
	select: string = 'taches';
	roleUser: string ="";

	constructor(private router: Router, public store: StoreService) { }

	async ngOnInit() {
		this.router.events.subscribe(
			(event: any) => {
				if (event instanceof NavigationEnd && this.router.url != null)
					this.setSelect();
			}
		);
		this.setSelect();

		this.items = navItems;
		this.lang = lang;
		this.urlHttpServer = app.getUrl('urlHttpServer');

		await this.getUser();
		this.roleUser = await app.getRoleUser();
	}

	async getUser() {
		this.user = await app.getExternalData(app.getUrl('urlGetUser', this.store.getUserId()), 'cmp-nav > getUser');
		app.log('this.user', this.user)
		return this.user ;
	}

	setSelect() {
		if (this.router.url.startsWith('/versement') || this.router.url.startsWith('/reglement'))
			this.select = 'versements';
		else if (this.router.url.startsWith('/ref'))
			this.select = 'refs';
		else if (this.router.url.startsWith('/param'))
			this.select = 'params';
		else if (this.router.url.startsWith('/admin'))
			this.select = 'admin';
		else if (this.router.url.startsWith('/pilotage'))
			this.select = 'pilotage';
		else if (this.router.url.startsWith('/historique'))
			this.select = 'historique';
		else if (this.router.url.startsWith('/reporting'))
			this.select = 'reporting';
		else if (this.router.url.startsWith('/taches'))
			this.select = 'taches';
		else if (this.router.url.startsWith('/projets') || app.getStorageItem('originGoto') == 'projet')
			this.select = 'projets';
		else
			this.select = 'taches';
	}

	gotoPage(item: any, event?: any) {
		if (event != null)
			event.preventDefault();

		if (item.page != null)
			app.redirect(this.router, item.page);
	}

	logout(event: any) {
		event.preventDefault();

		app.redirectUrl(app.getUrl('urlLogout') + document.location.pathname + '#/taches');
	}

	changeLanguage(value: any) {
		app.setLocalStorageItem('currentLang', value);

		location.reload(); //refresh
	}
}