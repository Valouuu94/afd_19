import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-row',
    templateUrl: './row.component.html',
    standalone: true
})
export class RowComponent implements OnInit {

	@Input() label: any;

	constructor() { }
	
	ngOnInit() { }
}