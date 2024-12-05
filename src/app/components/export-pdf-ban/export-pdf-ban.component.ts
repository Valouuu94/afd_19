import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportPdfComponent } from '../export-pdf/export-pdf.component';

declare const app: any;

@Component({
    selector: 'app-export-pdf-ban',
    templateUrl: './export-pdf-ban.component.html',
    standalone: true,
    imports: [ExportPdfComponent]
})
export class ExportPdfBanComponent implements OnInit {

	@ViewChild('exportPDF') exportPDF!: ExportPdfComponent;

	titre: any;
	sousTitre: any;
	controles: any;
	tableContext: any;
	tableBody: any;
	piedDepage: any;
	fileName: any;
	exportPdfBan: any;
	liens: any;
	reglement: any;
	versement: any;
	controleParTheme: any;
	app: any = app;
	tableBodyTheme: any;
	isAFD: any;


	constructor() { }

	ngOnInit() { }

	generate(table: any[], reglement: any, versement: any, controleParThematique: any, isAFD: any) {
		this.reglement = reglement;
		this.versement = versement;
		this.controleParTheme = controleParThematique; // Les controle par thématique {"Thème1":[],"Thème2":[],"Thème3":[],}
		this.controles = table; // Liste des controles avec aggrégation 
		this.isAFD = isAFD;

		if (this.isAFD) {
			this.sousTitre = 'FICHE DE CONTROLE D’UN VERSEMENT DU DOSSIER N° : ' + this.reglement.code_fonctionnel;
			this.titre = this.reglement.type_versement === "cas_general" ? 'AFD-M0261 MAÎTRISE D’OUVRAGE NATIONALE' : 'AFD-M0262 CAS DES MOAD';
			this.tableContext = [
				[{ text: 'N° Concours : ' + this.versement.numero_concours, bold: true }, { text: 'Emetteur : ' + this.versement.id_emetteur_demande + "-" + this.versement.emetteurDV, bold: true }, { text: 'Date de réception de la DV à l\'AFD : ' + app.formatDate(this.versement.date_reception), bold: true }],
				['', '', ''],
				[{ text: 'Modalité de versement : ' + this.versement.modalitePaiement, bold: true }, { text: 'Bénéficiaire du versement : ' + this.reglement.id_beneficiaire_reglement + "-" + this.reglement.beneficiaireVersement, bold: true }, { text: 'Produit : ' + this.reglement.id_produit, bold: true }],
				['', '', '']
			];

			const themes = Object.keys(this.controleParTheme).filter((key) => key !== 'null');

			//refRoles
			this.tableBodyTheme = [];
			this.tableBodyTheme = [
				[{ text: 'Point de contrôle', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: 'Indications ', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: 'Agent Versement ', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: 'Chargé de projet ', alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: 'Directeur (Adjoint) ', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true, alignment: 'center' }] }]
			];

			for (let i = 0; i < themes.length; i++) {
				const theme = themes[i];
				var controleParTheme = this.controleParTheme[theme];

				// controleParTheme.sort(
				// 	(firstObject: any, secondObject: any) =>
				// 		(firstObject.ordre > secondObject.ordre) ? 1 : -1
				// );

				controleParTheme = controleParTheme.filter(function (contrl: any) {
					return contrl.show == true;
				});

				// Ajouter une ligne contenant le nom du thème
				let themePCs = app.getRefLabel('refControleThemeAFD', theme, true);

				const themeRow = [{ text: themePCs, colSpan: 5, fillColor: '#877db3', color: "white" }];
				this.tableBodyTheme.push(themeRow);

				const rows = controleParTheme.flatMap((p: any) => {

					if (p.infobulle.includes("<br>"))
						p.infobulle = p.infobulle.replace(/<br>/g, "\r\n");

					if (p.commentaire != null && p.commentaire.length > 0) {
						return [[{ stack: [{ text: p.libelle }] }, { text: p.infobulle }, { text: p.controleAgent === "1" ? "Oui" : p.controleAgent === "0" ? "Non" : p.controleAgent === "-1" ? "N/A" : "--", alignment: 'center' }, { text: p.controleCP === "1" ? "Oui" : p.controleCP === "0" ? "Non" : p.controleCP === "-1" ? "N/A" : "--", alignment: 'center' }, { stack: [{ text: p.controleDirecteur === "1" ? "Oui" : p.controleDirecteur === "0" ? "Non" : p.controleDirecteur === "-1" ? "N/A" : "--", alignment: 'center' }] }], [{ text: "Commentaires / Liens", fillColor: '#F2F2F2' }, { stack: [p.commentaire.map(function (p: any) { let liensText = Array.isArray(p.liens) ? p.liens.join('\n') : p.liens; return { text: liensText + '\n' + app.getRefLabel('refRoles', p.roleCommentaire) + '\t' + p.acteur + '\t' + app.formatDate(p.date_modification) + '\t' + app.formatHours(p.date_modification) + '\t' + p.texteCommentaire }; })], colSpan: 4, fillColor: '#F2F2F2' }, '', '', '']];
					} else {
						return [[{ stack: [{ text: p.libelle }] }, { text: p.infobulle }, { text: p.controleAgent === "1" ? "Oui" : p.controleAgent === "0" ? "Non" : p.controleAgent === "-1" ? "N/A" : "--", alignment: 'center' }, { text: p.controleCP === "1" ? "Oui" : p.controleCP === "0" ? "Non" : p.controleCP === "-1" ? "N/A" : "--", alignment: 'center' }, { stack: [{ text: p.controleDirecteur === "1" ? "Oui" : p.controleDirecteur === "0" ? "Non" : p.controleDirecteur === "-1" ? "N/A" : "--", alignment: 'center' }] }]];
					}
				});

				this.tableBodyTheme.push(...rows);
			};

			this.piedDepage = '\n' + "AFD-M0261 version du " + new Date().toLocaleDateString();
			this.fileName = "pdfBan" + new Date().toLocaleDateString();
		} else {
			this.titre = 'PROPARCO – Dossier de versement ' + '[' + this.versement.code_fonctionnel + ']';
			this.sousTitre = 'FICHE DE CONTROLE D’UN VERSEMENT';
			this.tableContext = [];

			for (let element of this.versement.dossier_reglement) {
				const Row = [{ text: 'N° Concours : ' + element.numero_concours, bold: true }, { text: 'Emetteur : ' + app.getRefLabel('refBeneficiaires', element.id_beneficiaire_primaire), bold: true }, { text: 'Bénéficiaire du versement : ' + app.getRefLabel('refBeneficiaires', element.id_beneficiaire_reglement), bold: true }];
				const RowEspace = ['', '', ''];
				this.tableContext.push(Row);
				this.tableContext.push(RowEspace);
			};

			const lastRow = [{ text: 'Modalité de versement : ' + this.versement.modalitePaiement, bold: true }, { text: 'Date de réception de la DV : ' + app.formatDate(this.versement.date_reception), bold: true }, { text: '', bold: true }];
			const lastRowEspace = ['', '', ''];
			this.tableContext.push(lastRow);
			this.tableContext.push(lastRowEspace);

			const themes = Object.keys(this.controleParTheme).filter((key) => key !== 'null');
			this.tableBodyTheme = [];
			this.tableBodyTheme = [
				[{ text: 'Point de contrôle', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: 'Indications ', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: "Chargé d'appui ", alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: "Chargé d'affaires ", alignment: 'center', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true }] }, { text: 'Agent MO DAF', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true, alignment: 'center' }] }, { text: 'Directeur / Validateur ', style: ['tableHeader', { fillColor: '#E8E2E1', bold: true, alignment: 'center' }] }]
			];

			for (let i = 0; i < themes.length; i++) {
				const theme = themes[i];
				var controleParTheme = this.controleParTheme[theme];

				controleParTheme = controleParTheme.filter(function (contrl: any) {
					return contrl.show == true;
				});

				// Ajouter une ligne contenant le nom du thème
				let themePCs = app.getRefLabel('refControleThemePROPARCO', theme, true);

				const themeRow = [{ text: themePCs, colSpan: 6, fillColor: '#877db3', color: "white" }];
				this.tableBodyTheme.push(themeRow);

				const rows = controleParTheme.flatMap((p: any) => {
					if (p.libelle.includes("<br>"))
						p.libelle = p.libelle.replace(/<br>/g, "\r\n");

					if ((p.commentaire !== null)) {
						this.liens = p.commentaire.liens;
						return [[{ stack: [{ text: p.libelle }] }, { text: p.infobulle }, { text: p.controlesCG === "1" ? "Oui" : p.controlesCG === "0" ? "Non" : p.controlesCG === "-1" ? "N/A" : "", alignment: 'center' }, { text: p.controlesCA === "1" ? "Oui" : p.controleCA === "0" ? "Non" : p.controlesCA === "-1" ? "N/A" : "", alignment: 'center' }, { text: p.controlesMODAF === "1" ? "Oui" : p.controlesMODAF === "0" ? "Non" : p.controlesMODAF === "-1" ? "N/A" : "", alignment: 'center' }, { stack: [{ text: p.controlesDir === "1" ? "Oui" : p.controlesDir === "0" ? "Non" : p.controlesDir === "-1" ? "N/A" : "", alignment: 'center' }] }], [{ text: "Commentaires / Liens", fillColor: '#F2F2F2' }, { stack: [this.liens.map(function (lien: any) { return { text: lien }; }), { text: '\n' + p.commentaire.roleCommentaire + '\t' + p.commentaire.acteur + '\t' + app.formatDate(p.commentaire.date_modification) + '\t' + app.formatHours(p.commentaire.date_modification) + '\t' + p.commentaire.texteCommentaire }], colSpan: 5, fillColor: '#F2F2F2' }, '', '', '', '']];
					} else {
						return [[{ stack: [{ text: p.libelle }] }, { text: p.infobulle }, { text: p.controlesCG === "1" ? "Oui" : p.controlesCG === "0" ? "Non" : p.controlesCG === "-1" ? "N/A" : "", alignment: 'center' }, { text: p.controlesCA === "1" ? "Oui" : p.controleCA === "0" ? "Non" : p.controlesCA === "-1" ? "N/A" : "", alignment: 'center' }, { text: p.controlesMODAF === "1" ? "Oui" : p.controlesMODAF === "0" ? "Non" : p.controlesMODAF === "-1" ? "N/A" : "", alignment: 'center' }, { stack: [{ text: p.controlesDir === "1" ? "Oui" : p.controlesDir === "0" ? "Non" : p.controlesDir === "-1" ? "N/A" : "", alignment: 'center' }] }]];
					}
				});

				this.tableBodyTheme.push(...rows);
			};
			this.piedDepage = '\n' + '\t' + '\t' + '\t' + this.versement.code_fonctionnel + " " + " Date de validation du directeur :" + '\t' + app.formatDate(this.versement.date_modification) + '\t' + app.formatHours(this.versement.date_modification);
			this.fileName = "pdfBanProparco" + new Date().toLocaleDateString();
		}

		this.exportPDF.generator(this.titre, this.sousTitre, this.tableContext, this.tableBodyTheme, this.piedDepage, this.fileName);
	}
}