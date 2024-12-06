import { Component, OnInit, input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

declare const lang: any;

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    standalone: true,
    imports: [NgIf, NgClass]
})
export class SpinnerComponent implements OnInit {

	lang: any = lang;

	readonly error = input<any>();
	readonly small = input<any>();

	constructor() { }

	ngOnInit() { }
}