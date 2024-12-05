import { Directive, ElementRef, HostListener } from '@angular/core';

declare const app: any;

@Directive({
    selector: 'input[separator]',
    standalone: true
})
export class FormatNumberInput {
  constructor(private _inputEl: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (this._inputEl.nativeElement.value === '-') return;
    let commasRemoved = this._inputEl.nativeElement.value.replace(
      /[^0-9,]/g,
      ''
    );
    let toInt: number;
    let toLocale: string;
    if (commasRemoved.split(',').length > 1) {
      let decimal = isNaN(
        parseInt(
          commasRemoved.split(',')[1].length > 2
            ? commasRemoved.split(',')[1].slice(0, 2)
            : commasRemoved.split(',')[1]
        )
      )
        ? ''
        : parseInt(
            commasRemoved.split(',')[1].length > 2
              ? commasRemoved.split(',')[1].slice(0, 2)
              : commasRemoved.split(',')[1]
          );

      if(commasRemoved.split(',')[1].length == 2 && commasRemoved.split(',')[1].toString().includes('0')) {
          var inputSplit = commasRemoved.split(',');
          toInt = parseInt(inputSplit[0]);
          toLocale = toInt.toLocaleString() + ',' + inputSplit[1];
      }else {
        toInt = parseInt(commasRemoved);
        toLocale = toInt.toLocaleString() + ',' + decimal;
      }
    } else {
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString();
    }
    if (toLocale.includes('NaN')) {
      this._inputEl.nativeElement.value = '';
    } else {
      this._inputEl.nativeElement.value = toLocale;
    }
  }
}
