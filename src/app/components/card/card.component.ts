import { Component, OnInit, input } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    standalone: true
})
export class CardComponent implements OnInit {

	readonly className = input<any>();
	readonly autoHeight = input<boolean>();

	constructor() {
		this.autoHeight = true;
	}

	ngOnInit() { }
}