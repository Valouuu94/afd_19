import { Component, OnInit, input } from '@angular/core';

@Component({
    selector: 'app-row',
    templateUrl: './row.component.html',
    standalone: true
})
export class RowComponent implements OnInit {

	readonly label = input<any>();

	constructor() { }
	
	ngOnInit() { }
}