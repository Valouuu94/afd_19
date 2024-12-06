import { Component, OnInit, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-btn',
    templateUrl: './btn.component.html',
    standalone: true,
    imports: [NgClass]
})
export class BtnComponent implements OnInit {

	loading: boolean = false;

	readonly label = input<any>();
	readonly ico = input<any>();
	readonly type = input<any>();
	readonly colorLabel = input<any>();
	readonly noLoading = input<boolean>();
	readonly disabled = input<boolean>(false);
	readonly inMenu = input<boolean>(false);

	readonly action = output();

	constructor() {
		this.noLoading = false;
	}

	ngOnInit() { }

	emitAction() {
		if (this.disabled())
			return; // If disabled, do not emit the action

		if (!this.noLoading())
			this.setLoading(true);

		this.action.emit();
	}

	setLoading(value: any) {
		this.loading = value;
		this.disabled = value;
	}
}
