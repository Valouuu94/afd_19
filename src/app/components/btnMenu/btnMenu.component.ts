import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';

@Component({
    selector: 'app-btnMenu',
    templateUrl: './btnMenu.component.html',
    standalone: true
})
export class BtnMenuComponent implements OnInit {

	readonly icon = input<any>();
	readonly side = input<any>();
	
	constructor() { }
	
	ngOnInit() { }
}
