import { Component, OnInit, input, output, viewChild } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';
import { NgClass } from '@angular/common';

declare const lang: any;

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    standalone: true,
    imports: [NgClass, BtnComponent]
})
export class ModalComponent implements OnInit {

	readonly btnSave = viewChild.required<BtnComponent>('btnSave');

	lang: any = lang;

	readonly modalId = input<any>();
	readonly modalTitle = input<any>();
	readonly size = input<any>();
	readonly icon = input<any>();
	readonly iconValidate = input<any>();
	readonly hideFooter = input<any>();
	readonly isError = input<any>();
	readonly validateLabel = input<any>();
	readonly labelBtnClose = input<any>('');
	readonly isDelete = input<boolean>(false);
	readonly typeBtn = input<any>('');
	readonly noRightBtn = input<boolean>(false);
	readonly subTitle = input<any>('');
	readonly classSubTitle = input<any>('');
	readonly showSwitchToUpdate = input<any>('');
	readonly disabledBtnSwitchToUpdate = input<boolean>(false);

	readonly validate = output();
	readonly cancel = output();
	readonly delete = output();
	readonly switchToUpdate = output();

	constructor() {
		this.validateLabel = this.lang.validate;
	}

	ngOnInit() { }

	emitValidate() {
		this.validate.emit();
	}

	emitCancel() {
		this.cancel.emit();
	}

	emitDelete() {
		this.delete.emit();
	}

	emitSwitchToUpdate() {
		this.switchToUpdate.emit();
	}

	setLoadingBtn() {
		this.btnSave().setLoading(false);
	}
	
	enabledBtnSwitchToUpdate() {
		this.disabledBtnSwitchToUpdate = false;
	}
}