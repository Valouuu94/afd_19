import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-btn',
    templateUrl: './btn.component.html',
    standalone: true,
    imports: [NgClass, NgIf]
})
export class BtnComponent implements OnInit {

	loading: boolean = false;

	@Input() label: any;
	@Input() ico: any;
	@Input() type: any;
	@Input() colorLabel: any;
	@Input() noLoading: boolean;
	@Input() disabled: boolean = false;
	@Input() inMenu: boolean = false;

	@Output() action = new EventEmitter();

	constructor() {
		this.noLoading = false;
	}

	ngOnInit() { }

	emitAction() {
		if (this.disabled)
			return; // If disabled, do not emit the action

		if (!this.noLoading)
			this.setLoading(true);

		this.action.emit();
	}

	setLoading(value: any) {
		this.loading = value;
		this.disabled = value;
	}
}
