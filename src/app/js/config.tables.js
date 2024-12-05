var columns = {
    'versementsAFD': [
        { label: lang.versements.idDV, tooltip: lang.versements.idDVTooltip, key: 'code_fonctionnel', type: 'text', filter: true, width: '165px' },
        { label: lang.versements.projet, key: 'numero_projet', filter: true, subKeys: [{ key: 'libelle_projet' }] },
        { label: lang.versements.tiers, tooltip: lang.versements.tiersTooltipAFD, key: 'tiers', filter: true, width: '210px' },
        { label: lang.versements.montant, key: 'renderMontantDv', filter: true, amount: true, width: '175px' },
        { label: lang.versements.divAgence, key: 'agenceGestion', filter: true, width: '175px' },
        { label: lang.versements.traiteur, tooltip: lang.versements.traiteurTooltip, key: 'traitant', filter: true, width: '175px' },
        { label: lang.versements.statut, tooltip: lang.versements.statutTooltip, key: 'lib_statut_dossier', filter: true, width: '200px', applyHighlight: true },
        { label: '', key: 'hasTask', type: 'boolean', filter: true, hidden: true }
    ],
    'versementsPROPARCO': [
        { label: lang.versements.idDV, tooltip: lang.versements.idDVTooltip, key: 'code_fonctionnel', filter: true, sortDesc: true, type: 'text', width: '165px' },
        { label: lang.versements.projet, key: 'numero_projet', filter: true, subKeys: [{ key: 'libelle_projet' }] },
        { label: lang.versements.tiersPROPARCO, tooltip: lang.versements.tiersTooltipPROPARCO, key: 'tiers', filter: true, width: '175px' },
        { label: lang.versements.montant, key: 'renderMontantDv', filter: true, amount: true, width: '175px' },
        { label: lang.versements.divAgence, key: 'agenceGestion', filter: true },
        { label: lang.versements.traiteur, tooltip: lang.versements.traiteurTooltip, key: 'traitant', filter: true, width: '175px' },
        { label: lang.versements.echeance, key: 'dateReception', type: 'date', filter: true, width: '175px', applyCostumClass: true },
        { label: lang.versements.statut, tooltip: lang.versements.statutTooltip, key: 'lib_statut_dossier', filter: true, filter: true, width: '200px', applyHighlight: true },
        { label: '', key: 'hasTask', type: 'boolean', filter: true, hidden: true }
    ],
    'versement': [
        { label: lang.versement.numero_dossier_versement, tooltip: lang.versement.numero_dossier_versementTooltip, key: 'renderNumVersement', subKeys: [{ key: 'lien_ged', type: 'lien_rome' }] },
        { label: lang.versement.date_demande_versement, key: 'renderEcheances', type: 'text' },
        { label: lang.versement.montant_versement, tooltip: lang.versement.montant_versementTooltip, key: 'renderMontantDv', type: 'text', amount: true },
        { label: lang.versement.montant_DDR, tooltip: lang.versement.montant_DDRTooltip, key: 'renderMontantDDR', type: 'text', amount: true },
        { label: lang.versement.renderEcart, tooltip: lang.versement.renderEcartTooltip, key: 'renderEcart', type: 'text', amount: true }
    ],
    'taches': [
        { label: lang.taches.objetId, tooltip: lang.taches.objetIdTooltip, key: 'descId', width: '175px', filter: true },
        { label: lang.taches.projetConcours, key: 'descNumero', width: '170px', filter: true },
        { label: lang.taches.taskStatus, key: 'descStatut', filter: true },
        { label: lang.taches.referentTask, key: 'descActeur', filter: true, width: '200px' },
        { label: lang.taches.dateTask, key: 'last_update_date', type: 'date', width: '120px', filter: true, sortDesc: true },
        { label: lang.taches.displayDescription, tooltip: lang.taches.displayDescriptionTooltip, key: 'descLibelle', filter: true },
        { label: '', key: 'userTask', type: 'boolean', filter: true, hidden: true }
    ],
    'justificatifs': [
        { label: lang.justificatifs.numero_justificatif, key: 'numero_justificatif' },
        { label: lang.justificatifs.reference_justificatif, key: 'reference_justificatif' },
        { label: lang.justificatifs.montant_financement_AFD, key: 'montant_financement_AFD', type: 'number', amount: true },
        { label: lang.justificatifs.document_contractuel_justificatif, key: 'document_contractuel_justificatif' },
    ],
    'concours': [
        { label: lang.concours.numeroConcours, key: 'numeroConcours' },
        { key: 'entite' },
        { action: true, type: 'goto' }
    ],
    'projetConcours': [
        { label: lang.concoursVuePC, key: 'numeroConcours', subKeys: [{ key: 'libelleConvention' }] },
        { label: lang.concoursConvention, key: 'numeroConvention', width: '150px' },
        { label: lang.datesignature, key: 'dateSignature', type: 'date', width: '170px' },
        { label: lang.dlvf, tooltip: lang.dlvfConcoursTooltip, key: 'dlvfFinale', type: 'date', width: '115px' },
        { label: lang.rav, tooltip: lang.ravReelTooltipAFD, key: 'resteAVerser', amount: true, width: '175px' },
    ],
    'reglementsPROPARCO': [
        {
            label: lang.reglements.idDDR, tooltip: lang.reglements.idDDRTooltip, key: 'code_fonctionnel', sortDesc: true, subKeys: [
                { key: 'renderDecaissement' }
            ], width: '175px'
        },
        {
            label: lang.reglements.concours, key: 'numero_concours', width: '120px', subKeys: [
                { key: 'libelle_concours' }
            ], width: '175px'
        },
        { label: lang.reglements.tiers, key: 'id_beneficiaire_reglement', ref: 'refBeneficiaires' },
        { label: lang.reglements.dlvfRav, tooltip: lang.reglements.dlvfRavTooltip, key: 'renderDlvfRav', amount: true, width: '125px' },
        { label: lang.reglements.montant, key: 'renderMontant', amount: true, width: '175px' },
        { label: lang.reglements.documents, tooltip: lang.reglements.documentsTooltip, type: 'file', width: '100px' },
        { label: lang.reglements.statut, tooltip: lang.reglements.statutTooltip, key: 'lib_statut_dossier', applyHighlight: true },
    ],
    'reglementsAFD': [
        {
            label: lang.reglements.idDDR, tooltip: lang.reglements.idDDRTooltip, key: 'code_fonctionnel', sortDesc: true, width: '175px', subKeys: [
                { key: 'numero_decaissement', template: '{0}e décaissement' }
            ]
        },
        { label: lang.reglements.concours, key: 'numero_concours', width: '120px' },
        { label: lang.reglements.tiers, key: 'id_beneficiaire_reglement', ref: 'refBeneficiaires' },
        { label: lang.reglements.dlvfRav, tooltip: lang.reglements.dlvfRavTooltip, key: 'renderDlvfRav', amount: true, width: '125px' },
        { label: lang.reglements.montant, key: 'renderMontant', amount: true, width: '175px' },
        { label: lang.reglements.documents, tooltip: lang.reglements.documentsTooltip, type: 'file', width: '100px' },
        { label: lang.reglements.statut, tooltip: lang.reglements.statutTooltip, key: 'lib_statut_dossier', applyHighlight: true }],
    'reglementsVuePC': [
        {
            label: lang.reglements.idDDR, tooltip: lang.reglements.idDDRTooltip, key: 'code_fonctionnel', sortDesc: true, filter: true, width: '175px', subKeys: [
                { key: 'numero_decaissement', template: '{0}e décaissement' }
            ]
        },
        { label: lang.reglements.concours, key: 'numero_concours', filter: true, width: '120px' },
        { label: lang.reglements.tiers, key: 'id_beneficiaire_reglement', ref: 'refBeneficiaires', filter: true, width: '225px' },
        { label: lang.reglements.dlvfRav, tooltip: lang.reglements.dlvfRavTooltip, key: 'renderDlvfRav', filter: true, amount: true },
        {
            label: lang.reglements.montantPRO, tooltip: lang.reglements.montantTooltip, key: 'renderMontant', amount: true, filter: true, width: '163px', subKeys: [
                { key: 'renderMontantPaiement' }
            ]
        },
        { label: lang.reglements.datePaiement, key: 'renderDatePaiement', amount: true, filter: true, width: '175px' },
        { label: lang.reglements.modalitePaiement, key: 'modalite_paiement', ref: 'refModalitesPaiement', filter: true, width: '195px' },
        { label: lang.reglements.documents, tooltip: lang.reglements.documentsTooltip, type: 'file', filter: true },
        { label: lang.reglements.statut, key: 'lib_statut_dossier', applyHighlight: true, filter: true }],
    'reglement': [
        {
            label: lang.reglement.numero_dossier_reglement, key: 'numero_dossier_reglement', secKey: { key: 'numero_dossier_versement', type: 'parentId' }, subKeys: [
                { key: 'numero_concours' }
            ]
        },
        { label: lang.reglement.montant_reglement, key: 'montant_reglement', type: 'number', amount: true, width: '175px', secKey: { key: 'devise_reglement' } },
        { label: lang.reglement.id_beneficiaire_reglement, key: 'id_beneficiaire_reglement', ref: 'refBeneficiaires' },
        {
            label: lang.reglement.date_modification, key: 'date_modification', type: 'date', subKeys: [
            ]
        },
        { action: true, type: 'goto', width: '0' },
        { action: true, type: 'validate', role: 'DIRVALID', width: '125px', enable: 'enableTableAction' }
    ],
    'versementsVuePC': [
        { label: lang.versements.idDV, tooltip: lang.versements.idDVTooltip, key: 'code_fonctionnel', type: 'text', filter: true, width: '165px' },
        { label: lang.versements.projet, key: 'numero_projet', filter: true, subKeys: [{ key: 'libelle_projet' }], width: '165px' },
        { label: lang.versements.tiers, tooltip: lang.versements.tiersTooltipAFD, key: 'tiers', filter: true, width: '210px' },
        { label: lang.versements.montant, key: 'renderMontantDv', filter: true, amount: true, width: '175px' },
        { label: lang.versements.divAgence, key: 'renderAgenceGestion', filter: true, ref: 'refAgencesGestions', width: '175px' },
        { label: lang.versements.traiteur, key: 'renderTraitant', filter: true, ref: 'refUsers', width: '175px' },
        { label: lang.versements.statut, key: 'lib_statut_dossier', filter: true, width: '100px', applyHighlight: true },
        { label: '', key: 'hasTask', type: 'boolean', filter: true, hidden: true }
    ],
    'projetsVuePC': [
        { key: 'numeroProjet', width: '200px' },
        { key: 'libelleProjet' },
        { key: 'dateMaj', width: '125px', type: 'date' }
    ],
    'projets': [
        { key: 'numeroProjet', width: '200px' },
        { key: 'libelleProjet' },
        { key: 'dateMaj', width: '125px', type: 'date' },
        { action: true, type: 'goto' }
    ],
    'agences': [
        { label: lang.agences.codeFonctionnelAgenceGestion, key: 'codeFonctionnelAgenceGestion' },
        { label: lang.agences.libelleLongAgenceGestion, key: 'libelleLongAgenceGestion' },
        { action: true, type: 'goto' }
    ],
    'directionsRegionale': [
        { label: lang.directionsRegionale.codeEntiteOrga, key: 'codeEntiteOrga' },
        { label: lang.directionsRegionale.libLong, key: 'libLong' },
        { label: lang.directionsRegionale.codeEntitePere, key: 'codeEntitePere' },
        { action: true, type: 'goto' }
    ],
    'modalitesPaiement': [
        { label: lang.modalitesPaiement.nomModalite, key: 'nomModalite' },
        { label: lang.modalitesPaiement.libelleModalite, key: 'libelleModalite' },
        { label: lang.modalitesPaiement.entite, key: 'entite' },
        { action: true, type: 'goto' }
    ],
    'operations': [
        {
            label: lang.operations.codeFonctionnelOperation, key: 'codeFonctionnelOperation'
        },
        { label: lang.operations.libelleCourtOperation, key: 'libelleCourtOperation' },
        { label: lang.operations.libelleLongOperation, key: 'libelleLongOperation' },
        { action: true, type: 'goto' }
    ],
    'conventions': [
        { label: lang.conventions.numeroConvention, key: 'numeroConvention' },
        { label: lang.conventions.dateSignature, key: 'dateSignature', type: 'date' },
        { label: lang.conventions.nomBeneficiaire, key: 'nomBeneficiaire' },
        { label: lang.conventions.montantInitial, key: 'montantInitial', type: 'number', amount: true, width: '175px' },
        { label: lang.conventions.montantFinal, key: 'montantFinal', type: 'number', amount: true, width: '175px' },
        { action: true, tooltip: lang.conventions.edit, type: 'edit' }
    ],
    'beneficiaires': [
        { label: lang.beneficiaires.idTiers, key: 'idTiers' },
        { label: lang.beneficiaires.libelleLong, key: 'libLong' },
        { label: lang.beneficiaires.nomBanque, key: 'nomBanque' },
        { label: lang.beneficiaires.numeroCompte, key: 'numeroCompte' }
    ],
    'beneficiaire': [
        {
            label: lang.beneficiaire.nomBanque, key: 'nomBanque', width: '300px'
        },
        { label: lang.beneficiaire.paysResidence, key: '', width: '500px' },
        { label: lang.beneficiaire.numeroCompte, key: 'numeroCompte' }
    ],
    'beneficiaireProparco': [
        {
            label: lang.beneficiaire.lib, key: 'libCourt', subKeys: [
                { key: 'adresse', label: 'Adresse:' },
                { key: 'villeResidence', template: 'Ville: {0}' }, { key: '', template: 'Pays: {0}' }]
        },
        { label: lang.beneficiaire.nomBanque, key: 'nomBanque', width: '300px' },
        { label: lang.beneficiaire.paysResidence, key: '', width: '500px' },
        { label: lang.beneficiaire.numeroCompte, key: 'numeroCompte' }
    ],
    'beneficiairePrimaire': [
        {
            label: lang.beneficiairePrimaire.idTiers, key: 'idTiers', width: '300px'
        },
        {
            label: lang.beneficiairePrimaire.libelleLong, key: 'libLong', width: '500px'
        },
        { label: lang.beneficiairePrimaire.villeResidence, key: 'villeResidence' }
    ],
    'beneficiaireVersement': [
        { label: lang.beneficiaire.idBeneficiaireireVersement, key: 'idTiers', width: '300px' },
        { label: lang.beneficiaire.libelle, key: 'libelleLong', width: '500px' },
        { label: lang.beneficiaire.siret, key: 'siretBeneficiaire' }
    ],
    'confirmationPaiment': [
        { label: lang.confirmationPaiment.montantDéfinitifReglement, key: 'montant_definitif_reglement', width: '400px' },
        { label: lang.confirmationPaiment.devise, key: 'idDeviseConfirmation', width: '400px' },
        { label: lang.confirmationPaiment.date, key: 'date_paiement', type: 'date', width: '400px', editable: true }
    ],
    'controles': [
        { key: 'id', width: '150px' },
        { key: 'codeControle', width: '200px' },
        { key: 'descriptionControleFr' },
        { key: 'autoControle', width: '150px', ref: 'refBoolean' },
        { key: 'criticiteControle', width: '125px', ref: 'refBoolean' },
        { key: 'actif', width: '90px', type: 'boolean', ref: 'refBoolean', filter: true, hidden: true },
        { key: 'niveau', width: '200px', filter: true, hidden: true },
        { action: true, type: 'edit' }
    ],
    'controlesDCV': [
        { key: 'codeControle', width: '285px' },
        {
            key: 'descriptionControleFr', subKeys: [
                { key: 'anomalies' }
            ]
        },
        { key: 'themeControle', width: '290px', ref: 'refControleThemeDCV' },
        { key: 'ordre', width: '90px', type: 'number', sort: true },
        { label: '', type: 'order', width: '100px' },
        { key: 'actif', width: '90px', type: 'boolean', ref: 'refBoolean', filter: true },
        { key: 'niveau', width: '200px', type: 'number', ref: 'refControleNiveauDCV', filter: true, hidden: true },
        { key: 'etape', width: '200px', filter: true, hidden: true },
        { label: '', type: 'addSPC' },
        { action: true, type: 'update' }
    ],
    'controleEtapes': [
        { key: 'idParamEtape', ref: 'refControleEtapes' },
        { key: 'actifControle', width: '125px', ref: 'refBoolean' },
        { key: 'bloquantControle', width: '125px', ref: 'refBoolean' },
        { key: 'nonApplicable', width: '125px', ref: 'refBoolean' },
        { key: 'controleParentCode', width: '175px' },
        { key: 'ordre', width: '175px' },
        { action: true, type: 'edit' }
    ],
    'controleEtapesDCV': [
        { key: 'niveauAffichage', width: '200px', ref: 'refControleNiveauDCV' },
        {
            key: 'controleParentCode', subKeys: [
                { key: 'anomalies' }
            ]
        },
        { key: 'actifControle', width: '100px', ref: 'refBoolean' },
        { key: 'ordre', width: '175px' },
        { action: true, type: 'edit' }
    ],
    'controleEtapeFiltres': [
        { key: 'type' },
        { key: 'value' },
        { action: true, type: 'delete' }
    ],
    'documentsContractuels': [
        { label: lang.documentsContractuels.numero, tooltip: lang.documentsContractuels.numeroTooltip, key: 'code_fonctionnel', filter: true, sortDesc: true, width: '170px' },
        { label: lang.documentsContractuels.libDC, key: 'libelle', filter: true, width: '150px' },
        { label: lang.documentsContractuels.type, key: 'type_marche', ref: 'refTypesMarches', filter: true, width: '200px' },
        { label: lang.documentsContractuels.dateSignature, key: 'date_signature', filter: true, type: 'date', width: '200px' },
        { label: lang.documentsContractuels.mntPartAFD, key: 'rendermontantAFD', filter: true, amount: true, width: '200px' },
        { label: lang.documentsContractuels.resteAVerser, key: 'renderRavReel', filter: true, amount: true, width: '200px' }
    ],
    'avancesContractuels': [
        { label: lang.avancesContractuels.numero, key: 'code_fonctionnel', filter: true, sortDesc: true, width: '175px' },
        { label: lang.avancesContractuels.libAC, key: 'libelle', filter: true, width: '240px' },
        { label: lang.avancesContractuels.concours, key: 'numero_concours', filter: true, width: '160px' },
        { label: lang.avancesContractuels.type, key: 'typologie', filter: true, width: '110px' },
        { label: lang.avancesContractuels.dljf, tooltip: lang.avancesContractuels.dljfTooltip, key: 'date_ljf_final', filter: true, type: 'date', width: '120px' },
        { label: lang.avancesContractuels.mntVerse, key: 'renderMntVerseTotal', filter: true, amount: true, width: '150px' },
        { label: lang.avancesContractuels.raj, tooltip: lang.avancesContractuels.rajTooltip, key: 'renderRaj', filter: true, amount: true, width: '150px' }
    ],
    'devises': [
        { key: 'idDevise' },
        { key: 'libelleCourtDevise' }
    ],
    'typesVersement': [
        { key: 'codeTypeVersement' },
        { key: 'libLongTypeVersement' }
    ],
    'typesOrdre': [
        { key: 'id' },
        { key: 'libelle' }
    ],
    'typesJustificatif': [
        { key: 'id' },
        { key: 'libelle' }
    ],
    'autresDevises': [
        { label: lang.autresDevises.montant, key: 'montant', type: 'number', amount: true, width: '300px' },
        { label: lang.autresDevises.devise, key: 'devise', ref: 'refDevises', width: '300px' },
        { action: true, type: 'edit' },
        { action: true, type: 'delete' },
    ],
    'dateConcoursAFD': [
        { label: lang.dateConcoursAFD.dateSignatureConvention, key: 'dateSignatureConvention', type: 'date', width: '195px' },
        { label: lang.dateConcoursAFD.dlvfInitiale, key: 'dlvf', type: 'date', width: '220px' },
        { label: lang.dateConcoursAFD.dateAchOp, key: 'dateAchevementOperationnel', type: 'date', width: '400px' },
    ],
    'dateConcoursPROPARCO': [
        { label: lang.dateConcoursPROPARCO.dateSignatureConvention, key: 'dateSignatureConvention', type: 'date', width: '250px' },
        { label: lang.dateConcoursPROPARCO.dlvfFinale, key: 'dlvf', type: 'date', width: '300px' },
        { label: lang.dateConcoursPROPARCO.dateAchOp, key: 'dateAchevementOperationnel', type: 'date', width: '870px' }
    ],
    'dateConcoursReversement': [
        { label: lang.dateConcoursReversement.dateSignatureConvention, key: 'dateSignatureConvention', type: 'date', width: '250px' },
        { label: lang.dateConcoursReversement.dlvfFinale, key: 'dlvf', type: 'date', width: '250px' }
    ],
    'montantConcoursAFD': [
        {
            label: lang.montantConcoursAFD.montantInitial, key: 'montantInitial', type: 'number', amount: true, width: '175px', secKey: { key: 'idDevise' }
        },
        { label: lang.montantConcoursAFD.rav, key: 'resteAVerser', type: 'number', amount: true, width: '175px', secKey: { key: 'idDevise' } },
        { label: lang.montantConcoursAFD.rav_newV, key: 'rav_newV', type: 'number', amount: true, width: '175px', secKey: { key: 'idDevise' } },
    ],
    'montantConcoursPROPARCO': [
        {
            label: lang.montantConcoursPROPARCO.engagementsNetsConcours, key: 'montantEngagementsNets', type: 'number', amount: true, width: '250px', secKey: { key: 'idDevise' }
        },
        {
            label: lang.montantConcoursPROPARCO.montantFinal, key: 'montantSousParticipationAfd', type: 'number', amount: true, width: '300px', secKey: { key: 'idDevise' }
        },
        {
            label: lang.montantConcoursPROPARCO.montantInitial, key: 'montantVersementsEffectues', type: 'number', amount: true, width: '290px', secKey: { key: 'idDevise' }
        },
        {
            label: lang.montantConcoursPROPARCO.rav, key: 'resteAVerser', type: 'number', amount: true, width: '290px', secKey: { key: 'idDevise' }
        },
        {
            label: lang.montantConcoursPROPARCO.impayeSIRP, key: 'impayesSIRP', type: 'number', amount: true, width: '290px', secKey: { key: 'idDevise' }
        }
    ],
    'montantConcoursVersement': [
        {
            label: lang.montantConcoursVersement.engagementsNetsConcours, key: 'montantEngagementsNets', type: 'number', amount: true, width: '195px', secKey: { key: 'idDevise' }
        },
        { label: lang.montantConcoursVersement.versements, key: 'montantVersementsEffectues', type: 'number', amount: true, width: '220px', secKey: { key: 'idDevise' } },
        { label: lang.montantConcoursVersement.impayeSIRP, key: 'impayeSIRP', width: '400px' }
    ],
    'produitFinancierAFD': [
        { label: lang.produitFinancier.libProduitFinancier, key: 'libelleCourtProduit', width: '195px' },
        { label: lang.produitFinancier.libOperation, key: 'libelleCourtOperation', width: '620px' },
    ],
    'produitFinancierPROPARCO': [
        { label: lang.produitFinancier.libProduitFinancier, key: 'libelleCourtFamilleProduit', width: '250px' },
        { label: lang.produitFinancier.libOperation, key: 'libelleCourtOperation', width: '1170px' },
    ],
    'produitFinancierReversement': [
        { label: lang.produitFinancier.libProduitFinancier, key: 'libelleCourtProduit', type: 'date', width: '250px' },
        { label: lang.produitFinancier.libOperation, key: 'libelleCourtOperation', width: '250px' },
        { label: lang.produitFinancierReversement.rev, key: 'libelleCourtVehiculeCofinancement', width: '250px' }
    ],
    'partAFD': [
        { label: lang.detailDocumentContractuel.montantPartAfd, key: '', width: '250px' },
        { label: lang.detailDocumentContractuel.rav_actuel, key: '', width: '250px' },
        { label: lang.detailDocumentContractuel.rav_previsionnel, key: '', width: '250px' }
    ],
    'typesAvanceTranche': [ //TODO a fusionner
        {
            label: lang.typesAvanceTranche.numero_type_avance, key: 'numero_type_avance', width: '250px', secKey:
                { key: 'libelle', type: 'parentId' }
        },
        {
            label: lang.typesAvanceTranche.montant, key: 'montant', type: 'number', amount: true, width: '250px', secKey: { key: 'devise' }
        },
        {
            label: lang.typesAvanceTranche.date_modification, type: 'date', key: 'date_modification', subKeys: [
                { key: 'date_creation', type: 'date', template: 'Crée le {0}' }]
        },
        { action: true, type: 'goto' }
    ],
    'typesAvanceRenouvellement': [
        {
            label: lang.typesAvanceRenouvellement.numero_type_avance, key: 'numero_type_avance', width: '250px', secKey:
                { key: 'libelle', type: 'parentId' }
        },
        {
            label: lang.typesAvanceRenouvellement.montant, key: 'montant', type: 'number', amount: true, width: '250px', secKey: { key: 'devise' }
        },
        {
            label: lang.typesAvanceRenouvellement.date_modification, type: 'date', key: 'date_modification', subKeys: [
                { key: 'date_creation', type: 'date', template: 'Crée le {0}' }]
        },
        { action: true, type: 'goto' }
    ],
    'typesAvanceCaisse': [
        {
            label: lang.typesAvanceCaisse.numero_type_avance, key: 'numero_type_avance', width: '250px', secKey:
                { key: 'libelle', type: 'parentId' }

        },
        {
            label: lang.typesAvanceCaisse.montant, key: 'montant', type: 'number', amount: true, width: '250px', secKey: { key: 'devise' }
        },
        {
            label: lang.typesAvanceCaisse.date_modification, type: 'date', key: 'date_modification', subKeys: [
                { key: 'date_creation', type: 'date', template: 'Crée le {0}' }]
        },
        { action: true, type: 'goto' }
    ],
    'paramCriteres': [
        { label: lang.paramCriteres.codeObject, key: 'codeObject', width: '150px' },
        { label: lang.paramCriteres.description, key: 'description' },
        { label: lang.paramCriteres.object, key: 'object', width: '250px', ref: 'refParamTypeCritere' },
        { label: lang.paramCriteres.dateCritere, key: 'dateCritere', type: 'date', width: '150px', editable: true },
        { label: lang.paramCriteres.valCritere, key: 'valCritere', width: '150px', editable: true, type: 'boolean' },
        { tooltip: lang.paramCriteres.delete, action: true, type: 'delete' }
    ],
    'confirmationPaiementPROPARCO': [
        { label: lang.ddrDefinitif.numDDR, key: 'code_fonctionnel', sortDesc: true, type: 'text', width: '165px' },
        { label: lang.ddrDefinitif.montant, key: 'montantPaiement', type: 'number', amount: true, editable: true, separator: true, width: '165px' },
        { label: lang.ddrDefinitif.devise, key: 'devisePaiement', width: '140px', editable: true, ref: 'refDevises' },
        { label: lang.ddrDefinitif.dateValeur, key: 'datePaiement', type: 'date', width: '150px', editable: true },
        { label: lang.ddrDefinitif.remboursement, type: 'payback', width: '100px' }
    ],
    'confirmationPaiementPROPARCONotEditable': [
        { label: lang.ddrDefinitif.numDDR, key: 'code_fonctionnel', sortDesc: true, type: 'text', width: '165px' },
        { label: lang.ddrDefinitif.montant, key: 'montantPaiement', type: 'number', amount: true, separator: true, width: '165px', editable: true },
        { label: lang.ddrDefinitif.devise, key: 'devisePaiement', width: '140px', editable: true, ref: 'refDevises' },
        { label: lang.ddrDefinitif.dateValeur, key: 'datePaiement', type: 'date', width: '150px', editable: true },
        { label: lang.ddrDefinitif.remboursement, type: 'payback', width: '100px' }
    ],
    'paramAnomalies': [
        { label: lang.paramAnomalies.codeAnomalie, key: 'codeAnomalie', width: '150px' },
        { label: lang.paramAnomalies.libelleAnomalie, key: 'libelleAnomalie' },
        { label: lang.paramAnomalies.graviteAnomalie, key: 'graviteAnomalie', ref: 'refGraviteAnomalie', width: '150px' },
        { label: lang.paramAnomalies.ordre, key: 'ordre', width: '150px' },
        { label: lang.paramAnomalies.regularisable, key: 'regularisable', ref: 'refBoolean', width: '150px' },
        { label: lang.paramAnomalies.statutActif, key: 'statutActif', ref: 'refBoolean', width: '150px', filter: true },
        { tooltip: lang.paramAnomalies.edit, action: true, type: 'edit' }
    ],
    'paramThemes': [
        { key: 'idTheme', width: '150px' },
        { key: 'codeTheme', width: '175px' },
        { key: 'libelleTheme' },
        { key: 'entite', ref: 'refControleEntite', width: '125px' },
        { key: 'niveau', ref: 'refControlePerimetre', width: '125px' },
        { key: 'statutActif', ref: 'refBoolean', width: '100px' },
        { action: true, type: 'edit' }
    ],
    'detailDocumentContractuel': [
        { label: lang.detailDocumentContractuel.montantDC, key: 'montant_afd', width: '250px', type: 'number', amount: true, secKey: { key: 'devise' } },
        { label: lang.detailDocumentContractuel.rav_actuel, key: 'rav_actuel', type: 'number', amount: true, width: '250px', secKey: { key: 'devise' } },
        { label: lang.detailDocumentContractuel.rav_previsionnel, key: 'rav_previsionnel', type: 'number', amount: true, width: '250px', secKey: { key: 'devise' } },
        { action: true, type: 'goto' }
    ],
    'rubrique': [
        { label: lang.rubrique.rub, key: 'numero_rubrique', secKey: { key: 'libelle_rubrique', type: 'parentId' } },
        { label: lang.rubrique.montant_rubrique, key: 'renderMontants', amount: true },
        { label: lang.rav, key: 'renderRAV', amount: true },
        { action: true, type: 'goto' }
    ],
    'rubriqueAR': [
        { label: lang.rubrique.rub, key: 'numero_rubrique', secKey: { key: 'libelle_rubrique', type: 'parentId' } },
        { label: lang.rubrique.montant_rubrique, key: 'renderMontants', amount: true },
        { label: lang.rav, key: 'renderRAV', amount: true },
        { label: lang.rubrique.pourcentageRemboursement, key: 'renderPourcentageAvance', amount: true, width: '190px' },
        { label: lang.rubrique.mntRemboursement, key: 'renderMontantAvance', amount: true, width: '195px' },
        { action: true, type: 'goto' }
    ],
    'justificatifsReglement': [
        { label: lang.justificatifsReglement.numero_justificatif, key: 'code_fonctionnel', secKey: { key: 'reference', type: 'parentId' }, width: '250px' },
        { label: lang.justificatifsReglement.type, key: 'type', ref: 'refTypesJustificatif', width: '250px' },
        { label: lang.justificatifsReglement.montant_finance_afd, key: 'montant_finance_afd', type: 'number', amount: true, secKey: { key: 'devise' }, width: '250px' },
        { label: lang.justificatifsReglement.date_emission, key: 'date_emission', type: 'date', width: '250px' },
        { label: lang.justificatifsReglement.emetteur, key: 'emetteur', ref: 'refBeneficiaires', width: '250px' },
        { action: true, type: 'goto' }
    ],
    'justificatifsRemboursement': [
        { label: lang.justificatifsReglement.numero_justificatif, key: 'reference', secKey: { key: 'reference', type: 'parentId' }, width: '250px' },
        { label: "Type du remboursement", key: 'typeRemboursement', width: '250px' },
        { label: lang.justificatifsReglement.montant_finance_afd, key: 'montant_remboursement', type: 'number', amount: true, secKey: { key: 'devise_remboursement' }, width: '250px' },
        { label: "Date valeur", key: 'date_valeur', type: 'date', width: '250px' },
        { action: true, type: 'goto' }
    ],
    'justificatifsAvanceAFD': [
        { label: lang.justificatifsAvance.numero_justificatif, key: 'code_fonctionnel', secKey: { key: 'reference', type: 'parentId' }, width: '250px' },
        { label: lang.justificatifsAvance.type, key: 'type', ref: 'refTypesJustificatif', width: '250px' },
        { label: lang.justificatifsAvance.montant_finance_afd, key: 'montant_finance_afd', type: 'number', amount: true, secKey: { key: 'devise' }, width: '250px' },
        { label: lang.justificatifsAvance.date_emission, key: 'date_emission', type: 'date', width: '250px' },
        { label: lang.justificatifsAvance.emetteur, key: 'renderEmetteur', width: '250px' },
        { label: lang.justificatifsAvance.lastJustif, key: 'dernier_justificatif', ref: 'refBoolean', width: '250px' },
        { action: true, type: 'goto' }
    ],
    'justificatifsAvancePROPARCO': [
        { label: lang.justificatifsAvance.numero_justificatif, key: 'code_fonctionnel', secKey: { key: 'reference', type: 'parentId' }, width: '250px' },
        { label: lang.justificatifsAvance.type, key: 'type', ref: 'refTypesJustificatif', width: '250px' },
        { label: lang.justificatifsAvance.montant_finance_afd, key: 'montant_justifie', type: 'number', amount: true, secKey: { key: 'devise' }, width: '250px' },
        { label: lang.justificatifsAvance.date_emission, key: 'date_emission', type: 'date', width: '250px' },
        { label: lang.justificatifsAvance.emetteur, key: 'renderEmetteur', width: '250px' },
        { label: lang.justificatifsAvance.lastJustif, key: 'dernier_justificatif', ref: 'refBoolean', width: '250px' },
        { action: true, type: 'goto' }
    ],
    'rubriquesDC': [
        { label: lang.rubriquesDC.numero_rubrique, key: 'numero_rubrique', secKey: { key: 'libelle_rubrique', type: 'parentId' }, width: '250px' },
        { label: lang.rubriquesDC.montant_rubrique, key: 'montant_rubrique', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '200px' },
        { label: lang.rav, key: 'renderRAVRubriquesJustificatifs', width: '200px', amount: true },
        { label: lang.rubriquesDC.montant_a_payer, tooltip: lang.rubriquesDC.mntAPayerEdit, key: 'montant_a_payer', editable: true, width: '185px', compareWith: { key: 'montant_rubrique' }, separator: true },
    ],
    'rubriquesDCAR': [
        { label: lang.rubriquesDC.numero_rubrique, key: 'numero_rubrique', secKey: { key: 'libelle_rubrique', type: 'parentId' }, width: '250px' },
        { label: lang.rubriquesDC.montant_rubrique, key: 'montant_rubrique', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '200px' },
        { label: lang.rav, key: 'renderRAVRubriquesJustificatifs', width: '200px', amount: true },
        { label: lang.rubriquesDC.pourcentageRemb, tooltip: lang.rubriquesDC.pourcentageRemboursement, key: 'renderPourcentageAvance', amount: true, width: '150px' },
        { label: lang.rubriquesDC.mntRemb, tooltip: lang.rubriquesDC.mntRemboursement, key: 'renderMontantAvance', amount: true, width: '195px' },
        { label: lang.rubriquesDC.mntARemb, tooltip: lang.rubriquesDC.mntARembourser, key: 'montant_a_rembourser', editable: true, amount: true, width: '200px', separator: true, hideIfValue: { key: 'libelle_rubrique', value: 'Avance remboursable' } },
        { label: lang.rubriquesDC.montant_a_payer, tooltip: lang.rubriquesDC.mntAPayerEdit, key: 'montant_a_payer', editable: true, width: '185px', compareWith: { key: 'montant_rubrique' }, separator: true },
    ],
    'rubriquesDCNotEditable': [
        { label: lang.rubriquesDC.numero_rubrique, key: 'numero_rubrique', secKey: { key: 'libelle_rubrique', type: 'parentId' }, width: '250px' },
        { label: lang.rubriquesDC.montant_rubrique, key: 'montant_rubrique', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '250px' },
        { label: lang.rubriquesDC.rav_actuel, key: 'rav_actuel', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '250px' },
        { label: lang.rubriquesDC.rav_previsionnel, key: 'rav_previsionnel', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '250px' },
        { label: lang.rubriquesDC.montant_a_payer, key: 'montant_a_payer', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '250px' },
    ],
    'rubriquesJustifRemboursement': [
        { label: lang.rubriquesDC.numero_rubrique, key: 'numero_rubrique', secKey: { key: 'libelle_rubrique', type: 'parentId' }, width: '250px' },
        { label: lang.rubriquesDC.mntRegle, key: 'montant_rubrique', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '250px' },
        { label: lang.rav, key: 'renderRAVRubriquesJustificatifs', type: 'number', amount: true, secKey: { key: 'devise_rubrique' }, width: '250px' },
        { label: lang.rubriquesDC.mntARembourser, tooltip: lang.rubriquesDC.mntARembourser, key: 'montant_a_rembourser', editable: true, amount: true, width: '200px', separator: true, compareWith: { key: 'montant_rubrique' } }
    ],
    'pays': [
        { label: lang.pays.codePays, key: 'idPays', ref: 'refPays', width: '80px' },
        { label: lang.pays.libLongPays, key: 'libelleLongPays', ref: 'refPays', width: '80px' },
        { label: lang.pays.idDevise, key: 'idDevise', ref: 'refDevises', width: '80px' },
        { action: true, type: 'goto' }
    ],
    'adminUtilisateurs': [
        { label: lang.adminUtilisateurs.controleur, key: '', width: '150px' },
        { label: lang.adminUtilisateurs.dossiersCtrl, key: '', width: '150px', type: 'number' },
        { label: lang.adminUtilisateurs.capaciteAnnuel, key: '', width: '150px', editable: true, type: 'number' },
        {
            label: lang.adminUtilisateurs.capaciteMensuel, key: '', width: '150px', type: 'number', subKeys: [
                { key: '', type: 'number', template: 'Actualiséé : {0}' }
            ]
        }
    ],
    'entitesOrga': [
        { key: 'codeEntiteOrga', width: '200px', filter: true },
        { key: 'libCourt', filter: true },
        { key: 'typeEntiteOrga', width: '300px', filter: true },
        { key: 'statut', width: '100px', filter: true },
        { action: true, type: 'edit' }
    ],
    'utilisateurs': [
        { label: lang.utilisateurs.login, key: 'login', width: '100px' },
        { label: lang.utilisateurs.civilite, key: 'civilite', ref: 'refCivilite', width: '100px' },
        { label: lang.utilisateurs.nom, key: 'nom', width: '200px', filter: true },
        { label: lang.utilisateurs.prenom, key: 'prenom', width: '200px', filter: true },
        { label: lang.utilisateurs.mail, key: 'mail', filter: true },
        { label: lang.utilisateurs.entiteRole, key: 'renderEntiteRole', filter: true },
        { label: lang.utilisateurs.administrateur, key: 'isAdminFoncionnel', ref: 'refBoolean', filter: true },
        { label: lang.utilisateurs.acif, key: 'actif', ref: 'refBoolean', width: '80px' },
        { label: lang.utilisateurs.dateModif, key: 'updateDateNewV', type: 'date', width: '160px' },
        { tooltip: lang.utilisateurs.edit, action: true, type: 'edit' }
    ],
    'pilotagePerimetres': [
        { label: lang.pilotagePerimetres.controleur, key: 'user', sort: true },
        { label: lang.pilotagePerimetres.dossiersCtrl, key: 'nbDossiersControles', width: '160px', type: 'number' },
        { label: lang.pilotagePerimetres.capaciteCtrl, key: 'renderCapacite', width: '180px' },
        { label: lang.pilotagePerimetres.agenceGestion, key: 'renderAgence', width: '300px' },
        { label: lang.pilotagePerimetres.divisionTech, key: 'renderDivision', width: '300px' },
        { label: lang.pilotagePerimetres.operation, key: 'renderOperations', width: '200px' },
        { label: lang.pilotagePerimetres.modaliteDecaissement, key: 'renderModalites', width: '200px' },
        { action: true, type: 'update' }
    ],
    'pilotageDDR': [
        { label: lang.pilotageDDR.infosDdr, key: 'renderInfos', width: '275px', filter: true },
        { label: lang.pilotageDDR.datePaiement, key: 'datePaiementDossierReglement', width: '150px', type: 'date' },
        { label: lang.pilotageDDR.status, key: 'libelleStatut2Nd', width: '275px', filter: true },
        { label: lang.pilotageDDR.agenceGestion, key: 'agenceGestionDossierReglement', width: '300px', filter: true },
        { label: lang.pilotageDDR.nbCriters, key: 'nbCriteres', width: '125px' },
        { label: lang.pilotageDDR.criteres, key: 'renderCriteres', width: '200px', filter: true },
        { label: lang.pilotageDDR.controleur, key: 'renderControleur', width: '150px', filter: true },
        { action: true, type: 'affect' }
    ],
    'dossiersControles': [
        { label: lang.dossiersControles.id, key: 'code_fonctionnel', type: 'text', filter: true, width: '175px' },
        { label: lang.dossiersControles.agenceGestion, key: 'agence_gestion', filter: true, width: '170px' },
        { label: lang.dossiersControles.concours, key: 'numero_concours', filter: true, width: '120px' },
        { label: lang.dossiersControles.montant, key: 'montant_reglement', type: 'number', amount: true, width: '170px', secKey: { key: 'devise_reglement' } },
        {
            label: lang.dossiersControles.modalite, key: 'modalite_paiement', filter: true, width: '130px', subKeys: [
                { key: 'type_versement' },
            ]
        },
        { label: lang.dossiersControles.produit, key: 'produit', filter: true },
        {
            label: lang.dossiersControles.updatedOn, key: 'date_modification_2nd_niv', type: 'date', width: '150px', subKeys: [
                { key: 'date_creation_dossier_2nd_niv', type: 'date', template: 'Crée le {0}' }
            ]
        },
        { label: lang.dossiersControles.controleur, key: 'acteur_2nd_niveau', filter: true, width: '150px' },
        { label: lang.dossiersControles.status, key: 'lib_statut_dossier_2nd', filter: true }
    ],
    'anomalies': [
        { label: lang.anomalies.idAnomalie, key: 'codeFonctionnelAnomalie', filter: true, sortDesc: true, width: '175px' },
        { label: lang.anomalies.agenceGestion, key: 'agenceGestion', filter: true, width: '170px' },
        { label: lang.anomalies.concours, key: 'numeroConcours', filter: true, width: '120px' },
        {
            label: lang.anomalies.anomalie, key: 'libelleAnomalie', filter: true, subKeys: [
                { key: 'codeAnomalie' }
            ]
        },
        { label: lang.anomalies.criticite, key: 'criticite', filter: true, width: '100px' },
        { label: lang.anomalies.declaredOn, key: 'dateCreation', type: 'date', width: '115px' },
        { label: lang.anomalies.updatedOn, key: 'dateModification', type: 'date', sortDesc: true, width: '115px' },
        { label: lang.anomalies.controleur, key: 'userNameControleur', filter: true, width: '150px' },
        { label: lang.anomalies.statut, key: 'libelleStatut', filter: true }
    ],
    'anomaliesHistoriquesDC': [
        { label: lang.anomalies.anomalie, key: 'code_anomalie', type: 'text', secKey: { key: 'libelle_anomalie', type: 'parentId' }, width: '500px' },
        { label: lang.anomalies.criticite, key: 'gravite_anomalie', width: '170px' },
        { label: lang.anomalies.declaredOn, key: 'date_creation', type: 'date', width: '115px' },
        { label: lang.anomalies.updatedOn, key: 'date_modification', type: 'date', width: '115px' },
        { label: lang.anomalies.controleur, key: 'acteur2ndNiveau', filter: true, width: '150px' },
        { label: lang.anomalies.statut, key: 'libelle_statut_anomalie', filter: true }
    ],
    'tiersReglement': [
        { label: lang.reglement.tiers.tiers, key: 'renderInfoTiers', subKeys: [{ key: 'renderAdresseTiers' }] }
    ],
    'tiersReporting': [
        { label: lang.reporting.dcByTiers.tiersId, key: 'code', width: '200px' },
        { label: lang.reporting.dcByTiers.tiers, key: 'label' }
    ],
    'avancesContractuelsRAJ': [
        { label: lang.avancesContractuels.idDossierRaj, key: 'codeFonctionnel', filter: true, sortDesc: true, width: '175px' },
        { label: lang.avancesContractuels.agence, key: 'agenceGestion', ref: 'refAgencesGestions', width: '170px' },
        { label: lang.avancesContractuels.concours, key: 'numeroConcours', filter: true, width: '120px' },
        { label: lang.avancesContractuels.montantRaj, key: 'montantAvance', type: 'number', amount: true, secKey: { key: 'deviseAvance' } },
        { label: lang.avancesContractuels.type, key: 'typeAvance', filter: true, ref: 'refTypeAvanceDcRaj' },
        { label: lang.avancesContractuels.produit, key: 'produitFinancier', ref: 'refProduitsFinancier' },
        {
            label: lang.avancesContractuels.updatedOn, key: 'dateModification', type: 'date', width: '150px', subKeys: [
                { key: 'dateCreation', type: 'date', template: 'Crée le {0}' }
            ]
        },
        { label: lang.avancesContractuels.controleurRaj, key: 'controleur', filter: true, width: '150px' },
        { label: lang.avancesContractuels.statutRaj, key: 'libStatut', filter: true }
    ],
    'habilitations': [
        {
            label: lang.habilitations.rubrique, key: 'libelleRubrique', width: '100px', filter: true, subKeys: [
                { key: 'codeRubrique' }
            ]
        },
        {
            label: lang.habilitations.fonctionnalite, key: 'libelleFonctionnalite', width: '100px', filter: true, subKeys: [
                { key: 'codeFonctionnalite' }
            ]
        },
        { label: lang.habilitations.habilitations, key: 'infosHabilitations', width: '100px', filter: true }
    ],
    'reportingDDR': [
        { label: lang.reporting.reportingDDR.numDDR, key: 'code_fonctionnel', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.numDV, key: 'code_fonctionnel_dv', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.dateCreationDDR, key: 'date_creation', width: '300px', filter: true },
        { label: lang.reporting.reportingDDR.dateValeurEffective, key: 'date_paiement', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.tiers, key: 'tiers', width: '500px', filter: true },
        { label: lang.reporting.reportingDDR.societe, key: 'entite', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.pays, key: 'lib_pays_realisation', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.montant, key: 'montant_reglement', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.devise, key: 'devise_reglement', width: '250px', filter: true },
        { label: lang.reporting.reportingDDR.equivalent, key: 'montant_equivalent', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.deviseEquivalente, key: 'devise_reference', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.montantConfirmation, key: '', width: '350px', filter: true },
        { label: lang.reporting.reportingDDR.deviseConfirmation, key: '', width: '350px', filter: true },
        { label: lang.reporting.reportingDDR.execution, key: 'lib_lieu_execution', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.modalitePaiement, key: 'modalite_paiement', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.agenceGestion, key: 'lib_agence_gestion', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.numProjet, key: 'numero_projet', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.libProjet, key: 'lib_projet', width: '900px', filter: true },
        { label: lang.reporting.reportingDDR.numConcours, key: 'numero_concours', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.libConcours, key: '', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.familleProduit, key: 'famille_produit', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.raj, key: '', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.dljf, key: 'dljf', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.dlvf, key: '', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.statut, key: 'lib_statut_dossier', width: '250px', filter: true },
        { label: lang.reporting.reportingDDR.statut2NdNiveau, key: 'lib_statut_dossier_2nd', width: '250px', filter: true },
        { label: lang.reporting.reportingDDR.dateConvention, key: 'date_signature_convention', width: '250px', filter: true },
        { label: lang.reporting.reportingDDR.agent, key: 'lib_initiateur', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.roleAgent, key: 'role_initiateur', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.imputation, key: 'imputation_comptable', width: '250px', filter: true },
        { label: lang.reporting.reportingDDR.ktp, key: 'numero_compte_ktp', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.achatDevisePro, key: 'achat_devise_pro', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.typeAt, key: 'type_at', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.pretAdosseSubvention, key: 'pret_adosse_subvention_seche', width: '400px', filter: true },
        { label: lang.reporting.reportingDDR.nomFacilite, key: 'nom_facilite', width: '200px', filter: true },
        { label: lang.reporting.reportingDDR.concoursMiroir, key: 'concours_miroir_afd', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.division, key: 'lib_division', width: '170px', filter: true },
        { label: lang.reporting.reportingDDR.departement, key: 'lib_departement', width: '170px', filter: true }
    ],
    'ddrEligibles': [
        { label: lang.reporting.ddrEligibles.infos, key: 'infosDDR', width: '800px' },
        { label: lang.reporting.ddrEligibles.datePaiement, key: 'datePaiementDossierReglement', width: '150px', type: 'date' },
        { label: lang.reporting.ddrEligibles.statut, key: 'libelleStatut2Nd', width: '275px', filter: true },
        { label: lang.reporting.ddrEligibles.agenceGestion, key: 'agenceGestionDossierReglement', width: '200px', filter: true },
        { label: lang.reporting.ddrEligibles.nbCriteres, key: 'nbCriteres', width: '125px' },
        { label: lang.reporting.ddrEligibles.criteres, key: 'infosCriteres', width: '500px', filter: true },
        { label: lang.reporting.ddrEligibles.controleur, key: 'infosControleur', width: '170px', filter: true }
    ],
    'tachesAdmin': [
        { label: '', key: 'tacheSelected', editable: true, type: 'boolean', isCheckAll: true },
        { label: lang.taches.objetId, key: 'descId', width: '175px', filter: true },
        { label: lang.taches.projetConcours, key: 'descNumero', width: '170px', filter: true },
        { label: lang.taches.taskStatus, key: 'descStatut', filter: true },
        { label: lang.taches.referentTask, key: 'acteur', filter: true, width: '200px' },
        { label: lang.taches.dateTask, key: 'lastUpdateDate', type: 'date', width: '120px', filter: true, sortDesc: true },
        { label: lang.taches.displayDescription, key: 'descLibelle', filter: true },
        { label: lang.taches.roleActeur, key: 'roleActeur' },
        { label: '', key: 'userTask', type: 'boolean', filter: true, hidden: true }
    ],
    'volumetriesDC': [
        { label: lang.reporting.volumetriesDC.codeFonctionnel, key: 'codeFonctionnel', width: '200px' },
        { label: lang.reporting.volumetriesDC.statut, key: 'libStatutDossier', width: '200px' },
        { label: lang.reporting.volumetriesDC.agence, key: 'agence', width: '200px' },
        { label: lang.reporting.volumetriesDC.controleur, key: 'controleur', width: '200px' },
        { label: lang.reporting.volumetriesDC.dateCreation, key: 'dateCreation', width: '200px' },
        { label: lang.reporting.volumetriesDC.dateModif, key: 'dateModification', width: '200px' },
        { label: lang.reporting.volumetriesDC.concours, key: 'concours', width: '200px' },
        { label: lang.reporting.volumetriesDC.modalitePaiement, key: 'modalitePaiement', width: '200px' },
        { label: lang.reporting.volumetriesDC.criteresRisques, key: 'critereRisque', width: '900px' }
    ],
    'volumetriesAnos': [
        { label: lang.reporting.volumetriesAnos.codeFonctionnel, key: 'codeFonctionnel', width: '200px' },
        { label: lang.reporting.volumetriesAnos.codeAnomalie, key: 'codeAnomalie', width: '200px' },
        { label: lang.reporting.volumetriesAnos.nbAnos, key: 'nbMemeAnoSurAnnee', width: '200px' },
        { label: lang.reporting.volumetriesAnos.libAno, key: 'libAnomalie', width: '600px' },
        { label: lang.reporting.volumetriesAnos.statutAno, key: 'libStatutAnomalie', width: '200px' },
        { label: lang.reporting.volumetriesAnos.anoRegu, key: 'regAnomalie', width: '300px' },
        { label: lang.reporting.volumetriesAnos.graviteAno, key: 'gravite', width: '200px' },
        { label: lang.reporting.volumetriesAnos.concours, key: 'concours', width: '200px' },
        { label: lang.reporting.volumetriesAnos.agence, key: 'agence', width: '200px' },
        { label: lang.reporting.volumetriesAnos.controleur, key: 'controleur', width: '200px' },
        { label: lang.reporting.volumetriesAnos.dateCreation, key: 'dateCreation', width: '200px' },
        { label: lang.reporting.volumetriesAnos.dateCloture, key: 'dateModification', width: '200px' },
        { label: lang.reporting.volumetriesAnos.modalitePaiement, key: 'modalitePaiement', width: '200px' },
        { label: lang.reporting.volumetriesAnos.commentairesAno, key: 'commentaire', width: '900px' },
        { label: lang.reporting.volumetriesAnos.idIncidentOpANo, key: 'idIncident', width: '200px' },
    ],
    'histoDC': [
        { label: lang.reporting.histoDC.idDC, key: 'code_fonctionnel', width: '170px' },
        { label: lang.reporting.histoDC.agence, key: 'lib_agence', width: '170px' },
        { label: lang.reporting.histoDC.concours, key: 'numero_concours', width: '170px', filter: true },
        { label: lang.reporting.histoDC.montant, key: 'montant', width: '170px', filter: true },
        { label: lang.reporting.histoDC.modalitePaiement, key: 'infosModalites', width: '250px' },
        { label: lang.reporting.histoDC.produit, key: 'produit', width: '350px', filter: true },
        { label: lang.reporting.histoDC.updateDate, key: 'infosDatesMaj', width: '250px', filter: true },
        { label: lang.reporting.histoDC.controleur, key: 'acteur_2nd_niveau', width: '200px', filter: true },
        { label: lang.reporting.histoDC.statut, key: 'lib_statut_dossier_2nd', width: '200px', filter: true }
    ],
    'histoAnos': [
        { label: lang.reporting.histoAnos.idAno, key: 'codeFonctionnelAnomalie', width: '170px' },
        { label: lang.reporting.histoAnos.agence, key: 'agenceGestion', width: '170px' },
        { label: lang.reporting.histoAnos.concours, key: 'numeroConcours', width: '170px' },
        { label: lang.reporting.histoAnos.anomalie, key: 'lib_anomalie', width: '800px' },
        { label: lang.reporting.histoAnos.criticite, key: 'criticite', width: '170px' },
        { label: lang.reporting.histoAnos.dateDeclare, key: 'dateCreationInfo', type: 'date', width: '170px' },
        { label: lang.reporting.histoAnos.dateUpdate, key: 'dateModificationInfo', type: 'date', width: '170px' },
        { label: lang.reporting.histoAnos.controleur, key: 'userNameControleur', width: '170px' },
        { label: lang.reporting.histoAnos.statut, key: 'libelleStatut', width: '170px' },
    ],
    'histoRAJ': [
        { label: lang.reporting.histoRAJ.idDossier, key: 'codeFonctionnel', width: '170px' },
        { label: lang.reporting.histoRAJ.agence, key: 'agenceGestion', width: '170px' },
        { label: lang.reporting.histoRAJ.concours, key: 'numeroConcours', width: '170px' },
        { label: lang.reporting.histoRAJ.montant, key: 'montant', width: '170px' },
        { label: lang.reporting.histoRAJ.type, key: 'typeAvance', width: '170px' },
        { label: lang.reporting.histoRAJ.produit, key: 'produitFinancier', width: '320px' },
        { label: lang.reporting.histoRAJ.infosDatesMaj, key: 'infosDatesMaj', width: '170px' },
        { label: lang.reporting.histoRAJ.controleur, key: 'controleur', width: '170px' },
        { label: lang.reporting.histoRAJ.statut, key: 'libStatut', width: '170px' },
    ],
    'ctlRAJAnomalie': [
        { label: lang.anomalies.idAnomalie, key: 'codeFonctionnelAnomalie', filter: true, sortDesc: true, width: '175px' },
        { label: lang.anomalies.agenceGestion, key: 'agenceGestion', ref: 'refAgencesGestions', filter: true, width: '170px' },
        { label: lang.anomalies.concours, key: 'numeroConcours', filter: true, width: '120px' },
        {
            label: lang.anomalies.anomalie, key: 'libelleAnomalie', filter: true, subKeys: [
                { key: 'codeAnomalie' }
            ]
        },
        { label: lang.anomalies.anomalie, key: 'criticite', filter: true, width: '100px' },
        { label: lang.anomalies.declaredOn, key: 'dateCreation', type: 'date', width: '115px' },
        { label: lang.anomalies.updatedOn, key: 'dateModification', type: 'date', sortDesc: true, width: '115px' },
        { label: lang.anomalies.controleur, key: 'userNameControleur', ref: 'refUsers', filter: true, width: '150px' },
        { label: lang.anomalies.statut, key: 'libelleStatut', filter: true }
    ],
    'ctlRAJAnomalie': [
        { label: lang.reporting.ctlRAJAnomalie.concours, key: 'numConcours', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.numeroAvance, key: 'numeroAvance', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.libelleAvance, key: 'libelleAvance', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.agenceGestion, key: 'agenceGestion', width: '300px' },
        { label: lang.reporting.ctlRAJAnomalie.controleurEnCharge, key: 'controleurEnCharge', width: '300px' },
        { label: lang.reporting.ctlRAJAnomalie.idAnomalie, key: 'idAnomalie', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.libelleAnomalie, key: 'libelleAnomalie', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.statutAnomalie, key: 'statutAnomalie', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.commentaire, key: 'commentaire', width: '300px' },
        { label: lang.reporting.ctlRAJAnomalie.dateDebutCreationAnomalie, key: 'dateCreation', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.dateFinCreationAnomalie, key: 'dateDernierStatutAnomalie', width: '300px' },
        { label: lang.reporting.ctlRAJAnomalie.typeAvance, key: 'typeAvance', width: '200px' },
        { label: lang.reporting.ctlRAJAnomalie.dljf, key: 'dljf', width: '300px' },
        { label: lang.reporting.ctlRAJAnomalie.dljfCalculeParDcv, key: 'dljfCalculeParDcv', width: '200px' },
    ],
    'ctlRAJDossierControle': [
        { label: lang.reporting.ctlRAJDossierControle.idDossierControleRaj, key: 'idDossierControleRaj', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.concours, key: 'numConcours', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.typeAvance, key: 'typeAvance', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.numeroAvance, key: 'numeroAvance', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.statut, key: 'statutDossierControle', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.controleurEnCharge, key: 'controleurEnCharge', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.dateDebutCreationControle, key: 'dateCreationControle', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.agenceGestion, key: 'agenceGestion', width: '200px' },
        { label: lang.reporting.ctlRAJDossierControle.typeControleRaj, key: 'typeControle', width: '200px' }
    ],
    'rubriquesTemplate': [
        { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", uniqueChoice: true, isFixed: true },
        { label: 'Libellé', key: 'libelle', width: "300px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
    ],
    'rubriquesTemplateAR': [
        { label: '', key: 'rubriqueSelected', editable: true, type: 'boolean', width: "100px", uniqueChoice: true, isFixed: true },
        { label: 'Libellé', key: 'libelle', width: "200px", editable: true, changeCss: true, applyBorderDanger: true, isFixed: true }
    ],
    'concoursRaj': [
        { label: lang.reporting.concoursRaj.numProjet, key: 'numProjet', width: '150px' },
        { label: lang.reporting.concoursRaj.libProjet, key: 'libProjet', width: '200px' },
        { label: lang.reporting.concoursRaj.numConcours, key: 'numConcours', width: '150px' },
        { label: lang.reporting.concoursRaj.codeAvance, key: 'codeFonctionnelAv', width: '150px' },
        { label: lang.reporting.concoursRaj.mntAvance, key: 'mntAvance', width: '200px' },
        { label: lang.reporting.concoursRaj.typeAv, key: 'typeAvance', width: '150px' },
        { label: lang.reporting.concoursRaj.tiers, key: 'tiers', width: '150px' },
        { label: lang.reporting.concoursRaj.nomTiers, key: 'nomTiers', width: '400px' },
        { label: lang.reporting.concoursRaj.pdtFinancier, key: 'pdtFinancier', width: '200px' },
        { label: lang.reporting.concoursRaj.dlvf, key: 'dlvf', width: '150px' },
        { label: lang.reporting.concoursRaj.premiereEch, key: 'premiereEcheance', width: '250px' },
        { label: lang.reporting.concoursRaj.derniereEch, key: 'derniereEcheance', width: '250px' },
        { label: lang.reporting.concoursRaj.mntConcours, key: 'mntConcours', width: '170px' },
        { label: lang.reporting.concoursRaj.devise, key: 'deviseConcours', width: '150px' },
        { label: lang.reporting.concoursRaj.raj, key: 'raj', width: '150px' },
        { label: lang.reporting.concoursRaj.dljf, key: 'dljf', width: '150px' },
        { label: lang.reporting.concoursRaj.pays, key: 'pays', width: '150px' },
        { label: lang.reporting.concoursRaj.agence, key: 'agence', width: '150px' },
        { label: lang.reporting.concoursRaj.division, key: 'division', width: '250px' },
    ],
    'reportingListeAvance': [
        { label: lang.reportingListeAvance.idprojet, key: 'idprojet', width: '100px' },
        { label: lang.reportingListeAvance.beneficiaireprimaireconcours, key: 'beneficiaireprimaireconcours', width: '600px' },
        { label: lang.reportingListeAvance.numeroavance, key: 'numeroavance', width: '100px' },
        { label: lang.reportingListeAvance.libelleavance, key: 'libelleavance', width: '300px' },
        { label: lang.reportingListeAvance.numconcours, key: 'numconcours', width: '300px' },
        { label: lang.reportingListeAvance.typeavance, key: 'typeavance', width: '200px' },
        { label: lang.reportingListeAvance.datesignatureconvention, key: 'datesignatureconvention', width: '200px' },
        { label: lang.reportingListeAvance.dlvf, key: 'dlvf', width: '200px' },
        { label: lang.reportingListeAvance.dljf, key: 'dljf', width: '200px' },
        { label: lang.reportingListeAvance.montantdeviseprincipale, key: 'montantdeviseprincipale', width: '200px' },
        { label: lang.reportingListeAvance.montantcontrevaleur, key: 'montantcontrevaleur', width: '200px' },
        { label: lang.reportingListeAvance.montantversesuravance, key: 'montantversesuravance', width: '200px' },
        { label: lang.reportingListeAvance.montantresteajustifiersuravance, key: 'montantresteajustifiersuravance', width: '200px' },
        { label: lang.reportingListeAvance.paysrealisation, key: 'paysrealisation', width: '300px' },
        { label: lang.reportingListeAvance.agencegestion, key: 'agencegestion', width: '300px' }
    ],
    'reportingPaiementTiers': [
        { label: lang.reportingPaiementTiers.idtier, key: 'idtier', width: '200px' },
        { label: lang.reportingPaiementTiers.liblongtiers, key: 'liblongtiers', width: '300px' },
        { label: lang.reportingPaiementTiers.montantrecu, key: 'montantrecu', width: '200px' },
        { label: lang.reportingPaiementTiers.montantcontrevaleur, key: 'montantcontrevaleur', width: '200px' },
        { label: lang.reportingPaiementTiers.iddossierreglement, key: 'iddossierreglement', width: '200px' },
        { label: lang.reportingPaiementTiers.numprojet, key: 'numprojet', width: '200px' },
        { label: lang.reportingPaiementTiers.numconcours, key: 'numconcours', width: '200px' },
        { label: lang.reportingPaiementTiers.dateemission, key: 'dateemission', width: '200px' },
        { label: lang.reportingPaiementTiers.datereglement, key: 'datereglement', width: '200px' },
        { label: lang.reportingPaiementTiers.totalmontant, key: 'totalmontant', width: '600px' }
    ],
    'dossierVersementexport': [
        { label: lang.reporting.dossierVersementexport.numdv, key: 'code_fonctionnel', width: '200px' },
        { label: lang.reporting.dossierVersementexport.idprojet, key: 'numero_projet', width: '200px' },
        { label: lang.reporting.dossierVersementexport.libelleprojet, key: 'libelle_projet', width: '250px', type: 'date' },
        { label: lang.reporting.dossierVersementexport.tiers, key: 'tiers', width: '475px', filter: true },
        { label: lang.reporting.dossierVersementexport.montant, key: 'montant_versement', width: '200px', filter: true },
        { label: lang.reporting.dossierVersementexport.devise, key: 'devise', width: '125px' },
        { label: lang.reporting.dossierVersementexport.divagence, key: 'agenceGestion', width: '500px', filter: true },
        { label: lang.reporting.dossierVersementexport.traite, key: 'traitant', width: '170px', filter: true },
        { label: lang.reporting.dossierVersementexport.statut, key: 'lib_statut_dossier', width: '170px', filter: true }
    ],
    'dossierVersementexportpro': [
        { label: lang.reporting.dossierVersementexport.numdv, key: 'code_fonctionnel', width: '200px' },
        { label: lang.reporting.dossierVersementexport.idprojet, key: 'numero_projet', width: '200px' },
        { label: lang.reporting.dossierVersementexport.libelleprojet, key: 'libelle_projet', width: '250px', type: 'date' },
        { label: lang.reporting.dossierVersementexport.tiers, key: 'tiers', width: '475px', filter: true },
        { label: lang.reporting.dossierVersementexport.montant, key: 'montant_versement', width: '200px', filter: true },
        { label: lang.reporting.dossierVersementexport.devise, key: 'devise', width: '125px' },
        { label: lang.reporting.dossierVersementexport.divagence, key: 'agenceGestion', width: '500px', filter: true },
        { label: lang.reporting.dossierVersementexport.traite, key: 'traitant', width: '170px', filter: true },
        { label: lang.reporting.dossierVersementexport.echeance, key: 'date_reception', width: '170px', filter: true },
        { label: lang.reporting.dossierVersementexport.statut, key: 'lib_statut_dossier', width: '170px', filter: true }
    ],
    'exportUtilisateur': [
        { label: lang.reporting.exportUtilisateur.login, key: 'login', width: '200px' },
        { label: lang.reporting.exportUtilisateur.civilite, key: 'civilite', width: '200px' },
        { label: lang.reporting.exportUtilisateur.nom, key: 'nom', width: '300px', type: 'date' },
        { label: lang.reporting.exportUtilisateur.prenom, key: 'prenom', width: '300px', filter: true },
        { label: lang.reporting.exportUtilisateur.email, key: 'mail', width: '200px', filter: true },
        { label: lang.reporting.exportUtilisateur.entiterole, key: 'entiterole', width: '600px' },
        { label: lang.reporting.exportUtilisateur.actif, key: 'actif', width: '300px', filter: true },
        { label: lang.reporting.exportUtilisateur.datemodification, key: 'updateDateNewV', width: '200px', filter: true }
    ],
    'dcByTiers': [
        { label: lang.reporting.dcByTiers.nbDC, key: 'nbDC', width: '270px' },
        { label: lang.reporting.dcByTiers.projet, key: 'numProjet', width: '200px' },
        { label: lang.reporting.dcByTiers.numDC, key: 'codeFonctionnelDC', width: '250px' },
        { label: lang.reporting.dcByTiers.libDC, key: 'libelleDC', width: '250px' },
        { label: lang.reporting.dcByTiers.dateSignature, key: 'dateSignature', width: '170px' },
        { label: lang.reporting.dcByTiers.montant, key: 'mntDC', width: '100px' },
        { label: lang.reporting.dcByTiers.devise, key: 'deviseDC', width: '100px' },
        { label: lang.reporting.dcByTiers.mntContrevaleur, key: 'mntContrevaleur', width: '200px' },
        { label: lang.reporting.dcByTiers.tiers, key: 'tiers', width: '450px' },
    ],
    'exportCriteresRisque': [
        { label: lang.exportCritereRisque.codeobject, key: 'codeObject', width: '200px' },
        { label: lang.exportCritereRisque.description, key: 'description', width: '500px' },
        { label: lang.exportCritereRisque.objet, key: 'objectcritere', width: '200px' },
        { label: lang.exportCritereRisque.datecritere, key: 'dateCritere', width: '200px' },
        { label: lang.exportCritereRisque.valeurcritere, key: 'valcritere', width: '200px' }
    ],
    'rubriquesRemboursement': [
        { label: lang.libelle, key: 'libelle_rubrique', sortDesc: true, type: 'text', width: '90px' },
        { label: lang.rubriquesDC.mntRegle, key: 'montantRegle', type: 'number', amount: true, separator: true, width: '165px' },
        { label: lang.rubriques.rav, key: 'resteAVerser', type: 'number', amount: true, separator: true, width: '165px' },
        { label: lang.rubriquesDC.mntARembourser, key: 'mntARembourser', type: 'number', amount: true, separator: true, width: '165px', editable: true }
    ],
    'rubriquesRemboursementNotEditable': [
        { label: lang.libelle, key: 'libelle_rubrique', sortDesc: true, type: 'text', width: '90px' },
        { label: lang.rubriquesDC.mntRegle, key: 'montantRegle', type: 'number', amount: true, separator: true, width: '165px' },
        { label: lang.rubriques.rav, key: 'resteAVerser', type: 'number', amount: true, separator: true, width: '165px' },
        { label: lang.rubriquesDC.mntARembourser, key: 'mntARembourser', type: 'number', amount: true, separator: true, width: '165px', editable: true }
    ]
};