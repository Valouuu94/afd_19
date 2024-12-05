import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportPdfComponent } from '../export-pdf/export-pdf.component';

declare const app: any;

@Component({
    selector: 'app-export-pdf-controle',
    templateUrl: './export-pdf-controle.component.html',
    standalone: true,
    imports: [ExportPdfComponent]
})
export class ExportPdfControleComponent implements OnInit {
	@ViewChild('exportPDF') exportPDF!: ExportPdfComponent;

	titre: any;
	sousTitre: any;
	controle: any;
	tableContext: any;
	tableBody: any;
	piedDepage: any;
	fileName: any;
	exportPdfBan: any;
	app: any = app;
	reglement: any;
	tableBodyTheme: any;
	controleGroupe: any;
	anomalie: any;
	dC: any = null;

	constructor() { }

	ngOnInit() { }

	async generate(reglement: any, ControlePC: any, listeDesControl: any) {
		this.reglement = reglement;
		this.titre = ' Verso - Fiche de contrôles de second niveau ';
		this.sousTitre = 'N°Dossier de contrôle  : ' + this.reglement.code_fonctionnel + '\n' + '\n' + 'Statut : ' + this.reglement.lib_statut_dossier_2nd;

		if (!app.isEmpty(this.reglement.id_document_contractuel))
			this.dC = await app.getExternalData(app.getUrl('urlGetDocumentContractuelById', this.reglement.id_document_contractuel), 'page-reglement > getDocumentContractuel - DC', true);

		var codeFcDc = (!app.isEmpty(this.dC)) ? app.renderEmpty(this.dC.code_fonctionnel) : '-';

		this.tableContext = [
			[{ text: 'Date du contrôle : ' + app.formatDate(this.reglement.date_modification), bold: true }, { text: 'CONCOURS (N°) : ' + this.reglement.numero_concours, bold: true }, { text: 'N° de la DDR : ' + this.reglement.code_fonctionnel, bold: true }, { text: 'MONTANT : ' + this.reglement.montant_reglement + '\t' + this.reglement.devise_reglement, bold: true }],
			['', '', '', ''],
			[{ text: 'N° DC : ' + codeFcDc, bold: true }, { text: 'Bénéficiaire de règlement : ' + app.getRefLabel('refBeneficiaires', this.reglement.id_beneficiaire_reglement), bold: true }, { text: 'Type de demande de règlement : ' + app.getRefLabel('refTypesVersement', this.reglement.type_versement), bold: true }, { text: 'Modalité de règlement : ' + app.getRefLabel('refModalitesPaiement', this.reglement.modalite_paiement), bold: true }],
			['', '', '', ''],
			[{ text: 'Agence de gestion : ' + app.getRefLabel('refAgencesGestions', this.reglement.agence_gestion), bold: true }, { text: 'Pays de réalisation : ' + app.getRefLabel('refPays', this.reglement.pays_realisation), bold: true }, { text: 'Date du règlement: ' + app.formatDate(this.reglement.date_paiement), bold: true }, { text: 'Nom du contrôleur : ' + this.reglement.nom_controleur_2nd, bold: true }],
			['', '', '', '']
		];
		// [{ text: 'Agence de gestion : ' + app.getRefLabel('refAgencesGestions', this.reglement.agence_gestion), bold: true }, { text: 'Pays de réalisation : ' + app.getRefLabel('refPays', this.reglement.pays_realisation), bold: true }, { text: 'Date du règlement: ' + app.formatDate(this.reglement.date_paiement), bold: true }, { text: 'Nom du contrôleur : ' + app.getRefLabel('refUsers', this.reglement.acteur_2nd_niveau), bold: true }],

		this.controle = listeDesControl;
		this.controleGroupe = ControlePC;

		this.tableBodyTheme = [];
		this.tableBodyTheme = [[
			{ text: 'Point de contrôle', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] },
			{ text: 'Sous-point de contrôle', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] },
			{ text: 'Commentaire sous-point de contrôle ', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] },
			{ text: 'Résultat', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] },
			{ text: '', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] },
			{ text: 'Anomalie ', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] },
			{ text: 'Commentaire anomalie', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }
		]];

		const listeCodePC = Object.keys(this.controleGroupe).filter(key => key !== "" && key !== "null");

		let nomDuPC: any;
		let libTheme: any;

		for (let i = 0; i < listeCodePC.length; i++) {
			const codePC = listeCodePC[i];

			for (let element of this.controle) {
				if (element.code === codePC) {
					nomDuPC = element.libelle;
					libTheme = element.theme;
				}
			}
			const ThemeRow = [{ text: libTheme, colSpan: 7, fillColor: '#877db3', color: "white" }];
			const NomRow = [{ text: nomDuPC, colSpan: 7, fillColor: '#877db3', color: "white" }];

			this.tableBodyTheme.push(ThemeRow);
			this.tableBodyTheme.push(NomRow);

			const rows: any[] = [];

			for (let p of this.controleGroupe[codePC]) {
				var commentPc = (!app.isEmpty(p.commentaire)) ? app.renderEmpty(p.commentaire.texteCommentaire) : '';

				if (p.anomalies.length > 0) {
					let commentaireCell: any = { text: commentPc };

					let sousPointCell: any = { text: p.libelle.replaceAll('<br>', '\n') };
					let resultatCell: any = { text: p.value == "1" ? "OK" : p.value == "0" ? "KO" : p.value == "-1" ? "N/A" : "", alignment: 'center', style: p.value === "1" ? { fillColor: '#00FF00' } : p.value === "0" ? { fillColor: '#FF0000' } : {} };
					let codePcCell: any = { text: codePC, color: "white", fillColor: '#877db3' };

					sousPointCell["rowSpan"] = p.anomalies.length;
					resultatCell["rowSpan"] = p.anomalies.length;
					commentaireCell["rowSpan"] = p.anomalies.length;
					codePcCell["rowSpan"] = p.anomalies.length;

					let sousAnoRows = p.anomalies.map(function (ano: any) {
						return [{ text: "", fillColor: '#E8E2E1' }, { text: "", fillColor: '#E8E2E1' }, { text: "", fillColor: '#E8E2E1' }, { text: "", fillColor: '#E8E2E1' }, { text: ano.valeur == true && p.value != "1" && p.value != "-1" ? "X" : "", fillColor: '#E8E2E1' }, { text: ano.code_anomalie + ' - ' + ano.libelle_anomalie.replaceAll('<br>', '\n') }, { text: ano.commentaire != null ? ano.commentaire : "" }];
					});

					var resulAnoCell = ((sousAnoRows[0] != null) ? sousAnoRows[0][4] : '');
					var libAno = ((sousAnoRows[0] != null) ? sousAnoRows[0][5] : ''); //0 4
					var commentAno = ((sousAnoRows[0] != null) ? sousAnoRows[0][6] : ''); // 0 5
					let row = [codePcCell, sousPointCell, commentaireCell, resultatCell, resulAnoCell, libAno, commentAno];
					rows.push(row);

					for (let j = 1; j < sousAnoRows.length; j++)
						rows.push(sousAnoRows[j]);
				}
			}

			this.tableBodyTheme.push(...rows);
		};

		this.piedDepage = '\n' + 'Dossier de contrôle' + " version du " + new Date().toLocaleDateString();
		this.fileName = "pdfDossierControle" + new Date().toLocaleDateString();

		this.exportPDF.generator(this.titre, this.sousTitre, this.tableContext, this.tableBodyTheme, this.piedDepage, this.fileName);
	}
}