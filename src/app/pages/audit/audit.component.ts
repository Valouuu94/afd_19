import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportExcelComponent } from '../../components/export-excel/export-excel.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { NgIf } from '@angular/common';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    standalone: true,
    imports: [ContentComponent, NgIf, SpinnerComponent, BtnComponent, ExportExcelComponent]
})
export class AuditComponent implements OnInit {

	@ViewChild('exportExcelAudit') exportExcelAudit!: ExportExcelComponent;
	@ViewChild('btnExportExcel') btnExportExcel!: BtnComponent;

	lang: any = lang;
	loading: boolean = false;
	app: any = app;
	items: any;

	constructor() { }

	ngOnInit() {
		this.loadAuditFilters();
	}

	async loadAuditFilters() {
		app.cleanDiv('formio_reportingAudit');

		await app.getExternalData(app.getUrl('urlGetAuthorization'), 'giveMeAuthorization > getAuthorization');

		appFormio.loadFormIO('reportingAudit');

		await app.sleep(250);

		appFormio.setDataValue(crossVars.forms['formio_reportingAudit'], 'entitePerimetre', 'AFD');
	}

	async exportExcel() {
		await app.getExternalData(app.getUrl('urlGetAuthorization'), 'audit exportExcel > getAuthorization');

		var dossier = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'dossier');
		var anomalie = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'anomalie');
		var projet = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'projet');
		var concours = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'concours');
		var user = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'user');
		var role = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'role');
		var entitePerimetre = appFormio.getDataValue(crossVars.forms['formio_reportingAudit'], 'entitePerimetre');

		if (app.isEmpty(dossier) && app.isEmpty(anomalie) && app.isEmpty(projet) && app.isEmpty(concours) &&
			app.isEmpty(user) && app.isEmpty(role)) {
			app.showToast('toastAuditOneFilterRequired');
			this.btnExportExcel.setLoading(false);
			return;
		}

		var filters = {
			'numDossier': dossier,
			'numAnomalie': anomalie,
			'numProjet': projet,
			'numConcours': concours,
			'idUtilisateur': user,
			'roleUtilisateur': role,
			'perimetre': entitePerimetre
		};

		this.items = await app.setExternalDataWithResult(app.getUrl('urlGetAudit'), filters);

		if (this.items == null || this.items.length == 0) {
			app.showToast('toastAuditNoResult');
			this.btnExportExcel.setLoading(false);
			return;
		}

		var cols = [];

		for (var key of Object.keys(this.items[0]))
			cols.push({
				'label': (lang.reporting.audit.keys[key] != null) ? lang.reporting.audit.keys[key] : key,
				'key': key
			});

		var filtersForSheet = [
			[lang.reporting.audit.filterDossier, dossier],
			[lang.reporting.audit.filterAnomalie, anomalie],
			[lang.reporting.audit.filterProjet, projet],
			[lang.reporting.audit.filterConcours, concours],
			[lang.reporting.audit.filterUser, user],
			[lang.reporting.audit.filterRole, role],
			[lang.reporting.audit.filterEntitePerimetre, entitePerimetre],
		];

		this.exportExcelAudit.exportExcel('audit', this.items, filtersForSheet, cols);

		app.showToast('toastAuditNbResults');

		this.btnExportExcel.setLoading(false);
	}
}