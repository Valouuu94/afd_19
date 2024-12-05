var lang = langs[app.getCurrentLang()];

var templates = {
    'reglementPROPARCO': [
        {
            columns: 4, title: lang.templates.avance,
            'displayIfValue': {
                'display': false,
                'field': 'add_avance_contractuel',
                'value': ''
            },
        },
        { columns: 1 }, //3 : lien rome
        { columns: 1 },
        { columns: [4, 4, 4], title: lang.templates.concours },
        { columns: 1 },
        { columns: [1, 3, 3, 3, 2], small: [2, 3, 3, 2, 2] },
        { columns: 1, title: lang.templates.montants },
        { columns: 1 },
        { columns: ['auto', 3, 3], small: ['auto', 4, 4] },
        {
            columns: [3], small: [4], title: lang.templates.tauxMax,
            'displayIfValue': {
                'display': true,
                'field': 'type_reversement',
                'value': ''
            },
        },
        { columns: 1, title: lang.templates.benefPrim },
        { columns: 2, title: lang.templates.tiers },
        { columns: 1 },
        { columns: 1 },
        { columns: 4 },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo },
        { columns: 1, title: lang.templates.imputation },
        { columns: 1 },
        { columns: [3, 9] },
        { columns: [3, 9], small: [4, 8] },
        { columns: 1 },
    ],
    'reglementAFD': [
        { columns: [4], title: lang.templates.concours }, //2 : concours
        { columns: 1 },
        {
            columns: 4, title: lang.templates.avance, //3 : avance titre
            'displayIfValue': {
                'display': false,
                'field': 'add_avance_contractuel',
                'value': ''
            },
        },
        { columns: 3 }, //4 : avance liste
        { columns: 1 }, //5 : avance detail
        {
            columns: 4, title: lang.templates.document, //6 : DC
            'displayIfValue': {
                'display': false,
                'field': 'doc_show',
                'value': ''
            },
        },
        { columns: 1 }, //7  : teleport nb DC ???
        {
            columns: 1, //8 : toggle DC
            'displayIfValue': {
                'display': false,
                'field': 'doc_show',
                'value': ''
            },
        },
        { columns: 3 }, //9 : DC
        { columns: 1 }, //10 : teleport DC
        { columns: 1 }, //11 : teleport DC
        { columns: [3], small: [4], title: lang.templates.taux }, //12 : taux
        { columns: ['auto', 4, 4], title: lang.templates.decaissement }, //1 : decaissement, lieu_execution
        { columns: 1, title: lang.templates.montant }, //13  : toggle devise
        { columns: ['auto', 3, 3], small: ['auto', 4, 4] }, //14 : montant, teleport devise, devise
        { columns: 1 }, //15 : teleport montant equivalent
        { columns: 1 }, //16 : teleport contrevaleur
        { columns: [4] }, //17 : lieu d'execution
        { columns: 1 }, //18 : teleport AR
        { columns: 1 }, //19 : pas utilisé
        { columns: 1, title: lang.templates.benefPrim }, //20 : teleport beneficiaire primaire
        { columns: 1, title: lang.templates.tiers }, //21 : teleport select beneficiaire reglement
        { columns: 1 }, //22 : teleport beneficiaire reglement
        { columns: 1 }, //23 : teleport CB
        {
            columns: 1, title: lang.templates.justifs, //23 : teleport justificatif
            'displayIfValue': {
                'display': false,
                'field': 'show_justificatif',
                'value': ''
            },
        },
        {
            columns: 1, title: lang.templates.justifsRemboursement, //24 : teleport justificatif-remboursement
            'displayIfValue': {
                'display': false,
                'field': 'show_justificatif_remboursement',
                'value': ''
            },
        },
        { columns: 1, title: lang.templates.memo } //25 : memo
    ],
    'versementAFD': [
        { columns: 1, title: lang.templates.demande },
        { columns: 1 },
        { columns: [6], small: [8] },
        { columns: ['auto', 'auto', 'full'], title: lang.templates.dates },
        { columns: ['auto', 4, 4], small: ['auto', 4, 4], title: lang.templates.montants },
        { columns: 1 },
        { columns: [6], small: [8], title: lang.templates.tier },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'versementPROPARCO': [
        { columns: 1, title: lang.templates.liens },
        { columns: ['auto', 'auto', 'full'], title: lang.templates.dates },
        { columns: ['auto', 4], small: ['auto', 6], title: lang.templates.montant },
        { columns: 1, title: lang.templates.memo }
    ],
    'montant': [
        { columns: 2 }
    ],
    'convention': [
        { columns: 2 }
    ],
    'projets': [
        { columns: 2 },
        { columns: 1 },
        { columns: 3 },
        { columns: 4 }
    ],
    'modalitesPaiement': [
        { columns: 3 },
        { columns: 1 }
    ],
    'concours': [
        { columns: 3 },
        { columns: 3 },
        { columns: 3 },
        { columns: 2 },
        { columns: 2 },
        { columns: 4 }
    ],
    'justificatif': [
        { columns: 4 },
        { columns: ['auto', 3, 3, 3], title: lang.templates.montants },
        { columns: 2, title: lang.templates.document },
        { columns: 1 }
    ],
    'controles': [
        { columns: 1 }
    ],
    'lienRomeRAJSupZero': [
        { columns: 1 }
    ],
    'reglementDefinitifAFD': [
        { columns: ['auto', 2, 4] }
    ],
    'versementInitAFD': [
        { columns: 1 },
        { columns: 1 },
        { columns: 1 }
    ],
    'versementInitPROPARCO': [
        { columns: 1 },
        { columns: 1 }
    ],
    'controle': [
        { columns: [6, 2, 2, 2] },
        { columns: 2 },
        { columns: 2 }
    ],
    'typeAnomalie': [
        { columns: [4, 2, 2, 2, 2] },
        { columns: [12] }
    ],
    'theme': [
        { columns: [4, 2, 3, 3] },
        { columns: 1 }
    ],
    'controleEtape': [
        { columns: [4, 2, 2, 2, 2] },
        { columns: 6 },
        { columns: [2, 2, 8] }
    ],
    'controleDCV': [
        { columns: [3, 3, 6] },
        { columns: 2 }
    ],
    'controleDCVEtape': [
        { columns: [3, 2, 2, 2, 3] },
        { columns: 1 },
        { columns: [2, 2, 2, 6] }
    ],
    'fixationTaux': [
        { columns: 3, title: lang.templates.dateFixationDem },
        { columns: 2, title: lang.templates.caracConcours },
        { columns: [4, 8] },
        { columns: [3, 9] },
        { columns: [3, 4, 6] },
        { columns: [3, 3, 6] },
        { columns: [2, 10] },
        { columns: [3, 3, 6], title: lang.templates.condFinance },
        { columns: 4 },
        { columns: 4 },
        { columns: 4 },
        { columns: 4 },
        { columns: 1 },
        { columns: [3, 9] },
        { columns: [2, 2, 8], subtitle: lang.templates.condDecaisse },
        { columns: [6, 3, 3], subtitle: lang.templates.steps },
        { columns: [3, 3, 3], subtitle: lang.templates.tauxPrefix },
        { columns: 4, subtitle: lang.templates.swap },
        { columns: 1, title: lang.templates.demCotation },
        { columns: [2, 3, 7] },
        { columns: 1, title: lang.templates.commentaire }
    ],
    'modalitePaiement': [
        { columns: 3 }
    ],
    'documentContractuel': [
        { columns: [3, 6, 3, 3, 3], title: lang.templates.document }, //1
        { columns: [3, 6, 3, 3, 3] },
        { columns: 1 },//2
        { columns: ['auto', 'auto'], title: lang.templates.dates },//3
        { columns: 1, title: lang.templates.tier },//4
        { columns: 1 },//5
        { columns: 1, title: lang.templates.montants },
        { columns: ['auto', 4], subtitle: lang.templates.montantDc },//7
        { columns: 1 },//8
        { columns: ['auto', 4], subtitle: lang.templates.partAfd },//9
        { columns: 1 },
        { columns: 1 },
        {
            columns: 1, title: lang.templates.ar, //12
            'displayIfValue': {
                'display': true,
                'field': 'show_avance_remboursable',
                'value': '1'
            }
        },
        { columns: ['auto', 'auto', 4] }, //13
        { columns: 1, title: lang.templates.rubriques },
        { columns: 1, title: lang.templates.memo },
    ],
    'avanceContractuelAFD': [
        { columns: 1, title: lang.templates.lien },
        { columns: [3, 'full'], small: [4, 'full'], title: lang.templates.concours },
        { columns: [2, 3, 7], small: ['auto', 3, 6], title: lang.templates.info },
        { columns: [4], small: [6], title: lang.templates.devise },
        { columns: 1, title: lang.templates.modaliteMontant },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 },
        { columns: 3, title: lang.templates.justification },
        { columns: 3, subtitle: lang.templates.dernierVers },
        { columns: 3, subtitle: lang.templates.dluf },
        { columns: 3, subtitle: lang.templates.dljf },
        { columns: [4, 7], title: lang.templates.audit },
        { columns: 1 },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'avanceContractuelAFDFinal': [
        { columns: 1, title: lang.templates.lien },
        { columns: [3, 'full'], small: [4, 'full'], title: lang.templates.concours },
        { columns: [2, 3, 7], small: ['auto', 3, 6], title: lang.templates.info },
        { columns: [4], small: [6], title: lang.templates.devise },
        { columns: 1, title: lang.templates.modaliteMontant },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 },
        { columns: 3, title: lang.templates.justification },
        { columns: 3, subtitle: lang.templates.dernierVers },
        { columns: 3, subtitle: lang.templates.dluf },
        { columns: 3, subtitle: lang.templates.dljf },
        { columns: [4, 7], title: lang.templates.audit },
        { columns: 1 },
        { columns: 1 },
        { columns: 4, title: lang.templates.totaux },
        { columns: 1, title: lang.templates.memo }
    ],
    'avanceContractuelPROPARCO': [
        { columns: 1, title: lang.templates.lien },
        { columns: [3, 'full'], small: [4, 'full'], title: lang.templates.concours },
        { columns: [2, 3, 7], small: ['auto', 3, 6], title: lang.templates.info },
        { columns: [4], small: [6], title: lang.templates.devise },
        { columns: 1, title: lang.templates.modaliteMontant },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 },
        { columns: 3, title: lang.templates.justification },
        { columns: 3, subtitle: lang.templates.dernierVers },
        { columns: 3, subtitle: lang.templates.dluf },
        { columns: 3, subtitle: lang.templates.dljf },
        { columns: 1, title: lang.templates.audit },
        { columns: ['auto', 'full'] },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'avanceContractuelPROPARCOFinal': [
        { columns: 1, title: lang.templates.lien },
        { columns: [3, 'full'], small: [4, 'full'], title: lang.templates.concours },
        { columns: [2, 3, 7], small: ['auto', 3, 6], title: lang.templates.info },
        { columns: [4], small: [6], title: lang.templates.devise },
        { columns: 1, title: lang.templates.modaliteMontant },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 },
        { columns: 3, title: lang.templates.justification },
        { columns: 3, subtitle: lang.templates.dernierVers },
        { columns: 3, subtitle: lang.templates.dluf },
        { columns: 3, subtitle: lang.templates.dljf },
        { columns: 1, title: lang.templates.audit },
        { columns: ['auto', 'full'] },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'avenant': [
        { columns: [4, 4, 4], title: lang.templates.justification },
        { columns: 2, subtitle: lang.avenant.dernierVers },
        { columns: 2, subtitle: lang.templates.dluf },
        { columns: 2, subtitle: lang.templates.dljf },
    ],
    'notification': [
        { columns: 2 },
        { columns: 1 }
    ],
    'rubrique': [
        { columns: ['auto', 6], title: lang.templates.info },
        { columns: ['auto', 6], title: lang.templates.montant },
        { columns: 1 },
        { columns: ['auto', 'auto', 4] },
    ],
    'rubriqueVentilated': [
        { columns: ['auto', 6], title: lang.templates.info },
        { columns: ['auto', 6], title: lang.templates.montant },
        { columns: 1 }
    ],
    'justificatifReglement': [
        { columns: 3, title: lang.templates.infos },
        { columns: 1, title: lang.templates.lien },
        { columns: 1, title: lang.templates.dates },
        { columns: ['auto', 4, 4], title: lang.templates.montants },
        { columns: 1, title: lang.templates.tier },
        { columns: 1 },
        {
            columns: 2, title: lang.templates.dc,
            'displayIfValue': {
                'display': true,
                'field': 'show_dc',
                'value': 'show_doc'
            },
        },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'typeUser': [
        { columns: [2, 2, 4, 4] },
        { columns: [3, 2, 2, 2, 3] },
    ],
    'typeAvance': [
        { columns: [3, 9], title: lang.templates.info },
        { columns: 4, title: lang.templates.montant }
    ],
    'pays': [
        { columns: 2 },
        { columns: 1 },
        { columns: 2 }
    ],
    'justificatifAvanceAFD': [
        { columns: 3, title: lang.templates.infos },
        { columns: 1, title: lang.templates.lien },
        { columns: 1, title: lang.templates.dates },
        { columns: ['auto', 4, 4], title: lang.templates.montants },
        { columns: 1, title: lang.templates.tier },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'justificatifAvancePROPARCO': [
        { columns: 3, title: lang.templates.infos },
        { columns: 1, title: lang.templates.lien },
        { columns: 1, title: lang.templates.dates },
        { columns: ['auto', 4, 4], title: lang.templates.montants },
        { columns: 1, title: lang.templates.tier },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'avanceAudit': [
        { columns: ['auto', 'full'] }
    ],
    'managersDCV': [
        { columns: 1 }
    ],
    'filtresDDR': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
        { columns: 2, title: lang.filtresReporting.periodeCreationDv },
        { columns: 1 },
        { columns: 2 },
        { columns: 1 }
    ],
    'affectTasks': [
        { columns: 1 }
    ],
    'reportingAudit': [
        { columns: 4 },
        { columns: [6, 3, 3] }
    ],
    'filtresVolumetries': [
        { columns: 2 },
        { columns: 2 },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 },
        { columns: 2 }
    ],
    'filtresAnomalies': [
        { columns: 2 },
        { columns: 2 },
        { columns: 3 },
    ],
    'filtresDC': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
    ],
    'filtresVolumetrieDossierControle': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
    ],
    'filtresVolumetrieAnomalie': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
        { columns: 1 },
    ],
    'filtresConcoursRaj': [
        { columns: 2 },
        { columns: 2 }
    ],
    'filtresListeAvance': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
    ],
    'filtresPaiementTiers': [
        { columns: 1 },
        { columns: 1 },
    ],
    'filtresPaiementDocContractuel': [
        { columns: 1 },
        { columns: 2 },
        { columns: 2 },
    ],
    'filtresConcoursRAV': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
        { columns: 2 }
    ],
    'filtresRemboursements': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 }
    ],
    'justificatifRemboursement': [
        { columns: 1, title: lang.templates.typeRemb },
        { columns: 3, title: lang.templates.infos },
        { columns: 1, title: lang.templates.lien },
        { columns: 1, title: lang.templates.dates },
        { columns: ['auto', 4, 4], title: lang.templates.montants },
        {
            columns: 2, title: lang.templates.dc,
            'displayIfValue': {
                'display': true,
                'field': 'show_dc',
                'value': '1'
            },
        },
        { columns: 1 },
        { columns: 1, title: lang.templates.memo }
    ],
    'filtresDCTiers': [
        { columns: 1 }
    ],
    'filtresConcoursRAV': [
        { columns: 2 },
        { columns: 2 },
        { columns: 2 },
        { columns: 2 }
    ],
    'entiteOrga': [
        { columns: 2 },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 },
        { columns: 1 }
    ]
};