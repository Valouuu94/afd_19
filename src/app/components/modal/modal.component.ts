import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';
import { NgClass, NgIf } from '@angular/common';

declare const lang: any;

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    standalone: true,
    imports: [NgClass, NgIf, BtnComponent]
})
export class ModalComponent implements OnInit {

	@ViewChild('btnSave') btnSave!: BtnComponent;

	lang: any = lang;

	@Input() modalId: any;
	@Input() modalTitle: any;
	@Input() size: any;
	@Input() icon: any;
	@Input() iconValidate: any;
	@Input() hideFooter: any;
	@Input() isError: any;
	@Input() validateLabel: any;
	@Input() labelBtnClose: any = '';
	@Input() isDelete: boolean = false;
	@Input() typeBtn: any = '';
	@Input() noRightBtn: boolean = false;
	@Input() subTitle: any = '';
	@Input() classSubTitle: any = '';
	@Input() showSwitchToUpdate: any = '';
	@Input() disabledBtnSwitchToUpdate: boolean = false;

	@Output() validate = new EventEmitter();
	@Output() cancel = new EventEmitter();
	@Output() delete = new EventEmitter();
	@Output() switchToUpdate = new EventEmitter();

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
		this.btnSave.setLoading(false);
	}
	
	enabledBtnSwitchToUpdate() {
		this.disabledBtnSwitchToUpdate = false;
	}
}