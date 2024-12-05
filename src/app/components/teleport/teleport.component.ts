import { Component, Input, OnInit } from '@angular/core';

declare const app: any;

@Component({
    selector: 'app-teleport',
    templateUrl: './teleport.component.html',
    standalone: true
})
export class TeleportComponent implements OnInit {

	@Input() to: any;

	constructor() { }

	ngOnInit() { }

	teleport(reverse?: boolean) {
		var teleportSource = document.querySelector('[to="' + this.to + '"]');
		var teleportDestination = document.querySelector(this.to);

		if (reverse != null && reverse) {
			teleportSource = document.querySelector(this.to);
			teleportDestination = document.querySelector('[to="' + this.to + '"]');
		}

		if (teleportSource != null && teleportDestination != null) {
			teleportDestination.innerHTML = ''; //on vide la destination avant de transferer l'element
			while (teleportSource.childNodes.length > 0)
				teleportDestination.appendChild(teleportSource.childNodes[0]);

			teleportSource.innerHTML = '';

			app.log('cmp-teleport - to (ok)' + ((reverse != null && reverse) ? ' REVERSE' : ''), this.to);
		} else
			console.warn('cmp-teleport - to NULL' + ((reverse != null && reverse) ? ' REVERSE' : ''), this.to);
	}

	unteleport() {
		this.teleport(true);
	}
	
	show() {
		var teleport = document.getElementsByClassName('element-' + this.to.substring(1));

		if (teleport != null && teleport.length > 0) {
			teleport[0].setAttribute('style', 'display: inline-block; width: 100%;');

			app.log('cmp-teleport - show (ok)', this.to);
		} else
			console.warn('cmp-teleport - show NULL', this.to);
	}
}