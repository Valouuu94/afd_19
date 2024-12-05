import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { StoreService } from './services/store.service';

declare const app: any;
declare const lang: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	loaded: boolean = false;
	lang: any = lang;

	constructor(private router: Router, private route: ActivatedRoute, public store: StoreService) {
		// this.router.events.subscribe((event: any) => {
		// 	if (event instanceof NavigationStart)
		// 		app.destroyTooltips();
		// });
	}

	async ngOnInit() {
		app.setStorageItem('userInfo', await app.getExternalData(app.getUrl('urlGetUserInfos'), 'page accueil', true, true));
		
		var user = await app.getUser();
		
		if (user != null) {
			this.store.setUserId(user.id);
			this.store.setUserName(user.name);
			this.store.setUserContext(await app.getUserContext(this.store.getUserName()));
			this.store.setUserEntite(await app.getUserGroup(this.store.getUserId()));
			this.store.setUserRole(await app.getUserRole(this.store.getUserContext()));
			this.store.setUserPerimetre(await app.getUserPerimetre(this.store.getUserId()));
			this.store.setRights(await app.loadRights(this.store.getUserName()));

		}

		await app.loadRefs();

		this.loaded = true;
	}
}