import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';


declare const app: any;
declare const columns: any;
declare const lang: any;

@Component({
    selector: 'app-export-excel',
    templateUrl: './export-excel.component.html',
    standalone: true,
    imports: []
})
export class ExportExcelComponent implements OnInit {

	rows: any;
	cols: any;
	lang: any = lang;
	loading: boolean = false;

	constructor() { }

	ngOnInit() { }

	async exportExcel(type: any, items: any, filters: any, cols: any) {
		this.loading = true;

		//pour render html des colonnes et des lignes
		this.cols = (cols != null) ? cols : columns[type];
		this.rows = items;

		await app.sleep(2000);

		//init excel depuis le div html
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('excel-table'));
		const wb: XLSX.WorkBook = XLSX.utils.book_new();

		//onglet des données
		var sheetName = type;
		if (this.lang.reporting != null && this.lang.reporting[type] != null)
			sheetName = this.lang.reporting[type].sheetName;

		XLSX.utils.book_append_sheet(wb, ws, sheetName);

		//onglet des filtres 
		if (filters != null && filters.length > 0) {
			const fs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filters);
			XLSX.utils.book_append_sheet(wb, fs, this.lang.reporting.filtersSheetName);
			fs['!cols'] = [{ width: 25 }, { width: 25 }];
		}

		//largeur des colonnes
		var colsWidth = [];
		for (var col of this.cols) {
			if (!col.action) {
				var colWidth = 25;
				if (col.width != null)
					colWidth = Math.ceil(parseInt(col.width.replace('px', '')) / 8);
				colsWidth.push({ width: colWidth }); //width, wch, wpx
			}
		}
		ws['!cols'] = colsWidth;

		//nom du fichier
		var fileName = type;
		if (this.lang.reporting != null && this.lang.reporting[type] != null)
			fileName = this.lang.reporting[type].fileName;

		//recuperation de la date pour le nom de fichier
		var date = new Date();
		var month = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
		var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
		var hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
		var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
		var seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
		var dateToShow = date.getFullYear().toString() + month + day + "_" + hours + minutes + seconds;

		this.loading = false;
		//export en excel
		XLSX.writeFile(wb, fileName + '_' + dateToShow + '.xlsx');
	}
}