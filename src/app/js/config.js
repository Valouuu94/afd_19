var lang = langs[app.getCurrentLang()];
var enableLog = true;
var ent = { afd: 'AFD', pro: 'PROPARCO' };

/* Config menu navigation haut */
var navItems = [
    { id: 'taches', page: '/taches', right: 'taches.taches' },
    { id: 'versements', page: '/versements', right: 'DossierVersement.DossierVersement' },
    { id: 'projets', page: '/projets', right: 'projet.projet' },
    {
        id: 'params', right: 'param.param', subItems: [
            { id: 'paramControles', page: '/param/controles', right: 'param.controle' },
            { id: 'paramCriteres', page: '/param/criteres', right: 'param.critRisque' },
            { id: 'paramAnomalies', page: '/param/anomalies', right: 'param.ano' },
            { id: 'paramThemes', page: '/param/themes', right: 'param.them' }
        ]
    },
    {
        id: 'pilotage', right: 'pilotage.pilotage', subItems: [
            { id: 'pilotageReglesAffectation', page: '/pilotage/regles', right: 'pilotage.regAffect' },
            { id: 'pilotagePerimetreControleur', page: '/pilotage/perimetre', right: 'pilotage.perimCtl' },
            { id: 'pilotageDDREligibles', page: '/pilotage/ddr', right: 'pilotage.ddrEligible' },
            { id: 'pilotageAffectationDossiers', page: '/pilotage/dossiers', right: 'pilotage.affectDos' }
        ]
    },
    {
        id: 'admin', right: 'admin.admin', subItems: [
            { id: 'adminUtilisateurs', page: '/admin/utilisateurs', right: 'admin.gestUser' },
            { id: 'adminHabilitations', page: '/admin/habilitations', right: 'admin.gestHabilitation' },
            { id: 'adminTaches', page: '/admin/taches', right: 'admin.gestTache' },
            { id: 'adminOrganisation', page: '/admin/organisation', right: 'admin.gestEntitesOrga' }
        ]
    },
    {
        id: 'historique', right: 'histo.histo', subItems: [
            { id: 'historiqueDossiers', page: '/historique/dossiers', right: 'histo.dosCtl' },
            { id: 'historiqueDossiersControlesRAJ', page: '/historique/dossiersRaj', right: 'histo.dosCtlRaj' },
            { id: 'historiqueAnomalies', page: '/historique/anomalies', right: 'histo.histoAno' },
            { id: 'historiqueAnomaliesRaj', page: '/historique/anomaliesRaj', right: 'histo.histoAnoRaj' }
        ]
    },
    {
        id: 'reporting', right: 'reporting.reporting', subItems: [
            { id: 'reportingMetier', page: '/reporting', right: 'reporting.reportingMetier' },
            { id: 'reportingAudit', page: '/reporting/audit', right: 'reporting.audit' }
        ]
    }
];

/* Config de la redirection des taches vers les urls */
var tachesRedirect = {
    'reglement': {
        'enCours': 'urlGotoReglement',
        'controleAgent': 'urlGotoReglementControles',
        'controleCP': 'urlGotoReglementControles',
        'controleDirecteur': 'urlGotoReglementControles',
        'controlesDCV': 'urlGotoReglementControles',
        'miseEnPaiement': 'urlGotoReglementControles',
        'justificatifRemboursement': 'urlAddJustficatifRemboursement'
    },
    'versement': {
        'enCours': 'urlGotoVersement',
        'reglements': 'urlGotoVersementReglements',
        'controlesCG': 'urlGotoVersementControles',
        'controlesCA': 'urlGotoVersementControles',
        'controlesMODAF': 'urlGotoVersementControles',
        'controlesDir': 'urlGotoVersementControles',
        'miseEnPaiement': 'urlGotoVersementControles'
    },
    'anomalie': {
        'DCV': 'urlGotoAnomalie'
    },
    'avanceContractuelRAJZero': {
        'controlesRAJZero': 'urlGotoAvanceContractuelControles'
    },
    'avanceContractuelRAJDefault': {
        'controlesRAJDefault': 'urlGotoAvanceContractuelControles'
    },
    'anomalieRajZero': {
        'DCV': 'urlGotoAnomalieRajZero'
    },
    'anomalieRajDefaut': {
        'DCV': 'urlGotoAnomalieRajDefaut'
    },
};

var actionsAnomalie = {
    'MANAGER2ND': ['AVEC_INCIDENT', 'SANS_INCIDENT', 'ABAND'],
    'CTRL2ND': ['REGULARISEE', 'REFUSE', 'ABAND', 'DECLAR', 'DECLAR_DOC_OK']
};

/* Config des actions de validation d'une tache */
var actions = {
    'DR': [
        { action: 'RETOUR_AV', steps: ['controleCP'] },
        { action: { AGENTVERSEMENT: 'RETOUR_AV', CHGPROJET: 'RETOUR_CP' }, steps: ['controleDirecteur'] }
    ],
    'DV': [
        { action: 'RETOUR_CG', steps: ['controlesCA'] },
        { action: { CHGAPPUI: 'RETOUR_MODAF_CG', CHGAFF: 'RETOUR_CA' }, steps: ['controlesMODAF'] },
        { action: 'RETOUR_MODAF', steps: ['controlesDir'] }
    ],
    'annulerDossier': {
        'DV': { action: 'ANNULER_DV' },
        'DR': { action: 'ANNULER_DR' }
    }
};

/* Config des tables de référence (tableau ou url) */
var refs = {
    'refPays': { url: 'urlGetPays', code: 'idPays', label: 'libelleCourtPays' },
    'refBeneficiaires': { url: 'urlGetBeneficiairesMin', code: 'idTiers', label: 'libLong', keepOnlyCodeLabel: true },
    'refDevises': { url: 'urlGetDevises', code: 'idDevise', label: 'libelleCourtDevise', mergeCodelabel: true },
    'refTypesVersement': { url: 'urlGetTypesVersement', code: 'codeTypeVersement', label: 'libLongTypeVersement' },
    'refTypesVersementAFD': { url: 'urlGetTypesVersement', code: 'codeTypeVersement', label: 'libLongTypeVersement' },
    'refTypesVersementPROPARCO': { url: 'urlGetTypesVersement', code: 'codeTypeVersement', label: 'libLongTypeVersement' },
    'refTypesJustificatif': { url: 'urlGetTypesJustificatif', code: 'idTypeJustificatif', label: 'libelleLongTypeJustificatif' },
    'refProduitsFinancier': { url: 'urlGetProduitsFinancier', code: 'idProduit', label: 'libelleLongProduit' },
    'refModalitesPaiement': { url: 'urlGetModalitesPaiement', code: 'nomModalite', label: 'libelleModalite' },
    'refModalitesPaiementAFD': { url: 'urlGetModalitesPaiementAFD', code: 'nomModalite', label: 'libelleModalite' },
    'refModalitesPaiementPROPARCO': { url: 'urlGetModalitesPaiementPROPARCO', code: 'nomModalite', label: 'libelleModalite' },
    'refControleEtapes': { url: 'urlGetEtapes', code: 'idParamEtape', label: 'libelleEtapeFr' },
    'refControleFiltreCriteres': { url: 'urlGetControleFiltreCriteres', code: 'idCritere', label: 'codeCritere' },
    'refControleAnomalies': { url: 'urlGetParamAnomalies', code: 'idTypeAnomalie', label: 'libelleAnomalie' },
    'refControleAnomaliesCode': { url: 'urlGetParamAnomalies', code: 'idTypeAnomalie', label: 'codeAnomalie' },
    'refControleAnomaliesUnused': { url: 'urlGetParamAnomaliesUnused', code: 'idTypeAnomalie', label: 'libelleAnomalie' },
    'refAFDEntites': { url: 'urlGetEntites', code: 'codeEntiteOrga', label: 'libCourt' },
    'refRoles': { url: 'urlGetRoles', code: 'code', label: 'libelle' },
    'refControleThemePROPARCO': { url: 'urlGetThemes', code: 'codeTheme', label: 'libelleTheme', param: 'PROPARCO/niveau_1' },
    'refControleThemeAFD': { url: 'urlGetThemes', code: 'codeTheme', label: 'libelleTheme', param: 'AFD/niveau_1' },
    'refControleThemeDCV': { url: 'urlGetThemes', code: 'codeTheme', label: 'libelleTheme', param: 'AFD/niveau_2' },
    'refTypeAmortissement': { url: 'urlGetTypeAmortissement', code: 'id', label: 'libLongTypeAmortissement' },
    'refReglesAuto': { url: 'urlGetReglesAuto', code: 'codeRegle', label: 'libelleRegle' },
    'refTypeRessource': { url: 'urlGetTypeRessources', code: 'id', label: 'libLongTypeRessource' },
    'refTypeAT': { url: 'urlGetTypeAts', code: 'id', label: 'libLongTypeAt' },
    'refAgencesGestionsLibLong': { url: 'urlGetAgences', code: 'idAgenceGestion', label: 'libelleLongAgenceGestion' },
    'refAgencesGestions': { url: 'urlGetAgences', code: 'idAgenceGestion', label: 'libelleCourtAgenceGestion' },
    'refFamillesProduits': { url: 'urlGetFamillesProduits', code: 'idFamilleProduit', label: 'libelleCourtFamilleProduit' },
    'refDivisionsLibLong': { url: 'urlGetDivisionsBySocieteAFD', code: 'idDivisionService', label: 'libelleLongDivisionService' },
    'refDivisions': { url: 'urlGetDivisionsBySocieteAFD', code: 'idDivisionService', label: 'libelleCourtDivisionService' },
    'refDivision': { url: 'urlGetDivisions', code: 'idDivisionService', label: 'libelleLongDivisionService' },
    'refOperationsLibLong': { url: 'urlGetOperations', code: 'idOperation', label: 'libelleLongOperation' },
    'refUsers': { url: 'urlGetUsers', code: 'idUtilisateur', label: ['prenom', 'nom'] },
    'refEntiteOrgaTypes': { url: 'urlGetEntiteOrgaTypes', code: 'codeTypeOrga', label: 'codeTypeOrga' },
    'refTypesMarches': { url: 'urlGettypeMarches', code: 'codeFonctionnelTypeMarche', label: 'libelleLongTypeMarche' },
    'refNumeroCompteKTP': { url: 'urlGetComptesKtp', code: 'numeroCompteKTP', label: 'libelleCompte', mergeCodelabel: true },
    'refBoolean': [
        { label: 'Oui', code: 'true' },
        { label: 'Non', code: 'false' }
    ],
    'refOperationsImputation': ['COMP', 'FAPS', 'OC', 'MCF'],
    'refModalitePaimentMoad': [
        { label: 'Paiement direct', code: 'paiement_direct' }
    ],
    'refBooleanYN': [
        { label: 'Oui', code: 'Y' },
        { label: 'Non', code: 'N' }
    ],
    'refBooleanNAIPS': [
        { label: 'Oui', code: '1' },
        { label: 'Non', code: '0' },
        { label: 'A définir par IPS', code: '-1' }
    ],
    'refBooleanNA': [
        { label: 'Oui', code: '1' },
        { label: 'Non', code: '0' },
        { label: 'N/A', code: '-1' }
    ],
    'refChoixDevise': [
        { label: 'En devise de versement', code: '0' },
        { label: 'En devise équivalente', code: '1' }
    ],
    'refNatureTaux': [
        { label: 'Fixe', code: '1' },
        { label: 'Sans objet', code: '2' },
        { label: 'Révisable', code: '3' }
    ],
    'refControleTypeAFD': [
        { label: 'Agent v.', code: 'controleAgent', longLabel: 'Agent de versement' },
        { label: 'Chg. projet', code: 'controleCP', longLabel: 'Chargé de projet' },
        { label: 'Manager', code: 'controleDirecteur', longLabel: 'Directeur d\'agence' }
    ],
    'refControleTypeDCV': [
        { label: 'Second niveau', code: 'controlesDCV' },
        { label: 'Second niveau', code: 'controlesRAJDefault' },
        { label: 'Second niveau', code: 'controlesRAJZero' }
    ],
    'refControleTypePROPARCO': [
        { label: 'Chg. appui', code: 'controlesCG', longLabel: 'Chargé d\'appui' },
        { label: 'Chg. affaire', code: 'controlesCA', longLabel: 'Chargé d\'affaire' },
        { label: 'MO DAF', code: 'controlesMODAF', longLabel: 'Middle Office DAF' },
        { label: 'Directeur', code: 'controlesDir', longLabel: 'Directeur' }
    ],
    'refCriticite': [
        { label: 'Mineur', code: '0' },
        { label: 'Majeur', code: '1' },
        { label: 'Critique', code: '2' }
    ],
    'refControleNiveau': [
        { label: 'Premier niveau', code: '1' },
        { label: 'Second niveau', code: '2' }
    ],
    'refControleNiveauDCV': [
        { label: 'Point de contrôle', code: '1' },
        { label: 'Sous-point de contrôle', code: '2' }
    ],
    'refControlePerimetre': [
        { label: 'Niveau 1', code: 'niveau_1' },
        { label: 'Niveau 2', code: 'niveau_2' }
    ],
    'refControleEntite': [
        { label: 'AFD', code: 'AFD' },
        { label: 'PROPARCO', code: 'PROPARCO' }
    ],
    'refControleFiltreOperator': [
        { label: '==', code: '==' },
        { label: '!=', code: '!=' },
        { label: '>', code: '>' },
        { label: '>=', code: '>=' },
        { label: '<', code: '<' },
        { label: '<=', code: '<=' }
    ],
    'refSignatureDV': [
        { label: 'Signée', code: 'true' },
        { label: 'Non signée', code: 'false' }
    ],
    'refTypeAvance': [
        { label: 'Tranche', code: '1', key: 'typesAvanceTranche' },
        { label: 'Avance renouvelable', code: '0', key: 'typesAvanceRenouvellement' },
        { label: 'Caisse d\'avance', code: '2', key: 'typesAvanceCaisse' }
    ],
    'refTypeAvanceDcRaj': [
        { label: 'Tranche', code: '1', key: 'typesAvanceTranche' },
        { label: 'Avance renouvelable', code: '0', key: 'typesAvanceRenouvellement' },
        { label: 'Caisse d\'avance', code: '2', key: 'typesAvanceCaisse' }
    ],
    'refTypeDossier': [
        { label: 'versement', code: 'DV' },
        { label: 'règlement', code: 'DR' },
    ],
    'refTypeNotification': [
        { label: 'Envoyer', code: '0' },
        { label: 'Renvoyer', code: '1' },
    ],
    'refSensNotification': [
        { label: 'd\'envoi', code: '0' },
        { label: 'de renvoi', code: '1' },
    ],
    'refLabelTypeAvance': [
        { label: 'la tranche', code: '1' },
        { label: 'l\'avance renouvelable', code: '0' },
        { label: 'la caisse d\'avance', code: '2' }
    ],
    'refParamTypeCritere': [
        { label: 'Agence', code: 'agence', ref: 'agences', key: 'idAgenceGestion' },
        { label: 'Concours', code: 'concours', ref: 'concours', key: 'numeroConcours' },
        { label: 'Direction régionale', code: 'directionRegionale', ref: 'directionsRegionale', key: 'codeEntiteOrga' },
        { label: 'Modalités de paiement', code: 'modalitesPaiement', ref: 'modalitesPaiement', key: 'nomModalite' },
        { label: 'Opération', code: 'operation', ref: 'operations', key: 'idOperation' },
        { label: 'Pays', code: 'pays', ref: 'pays', key: 'idPays' },
        { label: 'Projet', code: 'projet', ref: 'projets', key: 'numeroProjet' },
        { label: 'Dossier règlement', code: 'DossierReglement', ref: 'concours', key: 'numeroConcours' }
    ],
    'refParamCritere': [
        { label: 'Avis définitifs SOP', code: 'avis_SOP', type: 'concours' },
        { label: 'Red flags', code: 'redflag', type: 'projet' },
        { label: 'Main courante', code: 'suspicion_fraude', type: 'projet' },
        { label: 'Tiers avec nouvelle coordonnée bancaire', code: 'new_tiers', type: 'DossierReglement' },
        { label: 'Agences à surveiller', code: 'surveillance_agence', type: 'agence' },
        { label: 'Direction régionale à surveiller', code: 'surveillance_directionRegionale', type: 'directionRegionale' },
        { label: 'Classification pays LCB / FT', code: 'risque', type: 'pays' },
        { label: 'IPC', code: 'corruption_pays', type: 'pays' },
        { label: 'Modalités de décaissement', code: 'controle_modalitesPaiement', type: 'modalitesPaiement' },
        { label: 'Opérations', code: 'controle_operation', type: 'operation' },
    ],
    'refGraviteAnomalie': [
        { label: 'Faible', code: 'faible' },
        { label: 'Moyenne', code: 'moyenne' },
        { label: 'Forte', code: 'forte' },
        { label: 'Critique', code: 'critique' },
    ],
    'refDeviseVersement': [
        { label: 'EUR', code: '0' },
        { label: 'USD', code: '1' }
    ],
    'refTypeProduit': [
        { label: 'F_PR', code: '0' },
        { label: 'F_SU', code: '1' },
        { label: 'F_FP', code: '2' },
        { label: 'F_BY', code: '3' }
    ],
    'refProduit': [
        'OBCONV', 'PPAR'
    ],
    'refProduitFinancierIC': ['PPAR', 'OBCONV'],
    'refIdOperationFvc': ['TFSC', 'FVCLI', 'FVC'],
    'refImputationComptable': [
        { label: 'Compte pivot du CC Autre monnaie', code: '0' },
        { label: 'Compte pivot des prêts', code: '1' },
        { label: 'Compte courant UE', code: '2' },
        { label: 'Compte pivot du CC Euro', code: '3' },
        { label: 'Compte pivot du CC en Dollar', code: '4' },
        { label: 'Compte courant FISEA', code: '5' },
        { label: 'Compte pivot des prêts - UE', code: '6' },
        { label: 'Compte pivot des prêts - FVC', code: '7' }
    ],
    'refModesAttribution': [
        { label: 'Appel d\'offres international', code: '1' },
        { label: 'Appel d\'offres national', code: '2' },
        { label: 'Consultation directe', code: '3' },
        { label: 'Gré à Gré', code: '4' },
        { label: 'Autres', code: '5' }
    ],
    'refCivilite': [
        { label: 'MADAME', code: 'MME' },
        { label: 'MONSIEUR', code: 'MR' }
    ],
    'refPretAdosse': [
        { label: "OUI", code: '1' }, //il etait 0, pk ?
        { label: "N/A", code: '-1' }
    ],
    'refTypeAdresseTiers': ['ADRRES', 'ADREXP'],
    'refEntites': [
        { label: 'AFD', code: '1' },
        { label: 'PROPARCO', code: '2' }
    ],
    'refEntitePerimetre': [
        { label: 'AFD Niveau 1', code: 'AFD' },
        { label: 'AFD Niveau 2', code: 'DCV' },
        { label: 'PROPARCO', code: 'PROPARCO' }
    ],
    'refStatuts': [
        { label: 'AFD - Initialisé', code: 'DDR1' },
        { label: 'AFD - Contrôlé - Agent de Versement', code: 'DDR2' },
        { label: 'AFD - Contrôlé - Chargé de projet', code: 'DDR3' },
        { label: 'AFD - Signé - Directeur / envoyé Back Office', code: 'DDR5B' },
        { label: 'AFD - Signé - Directeur', code: 'DDR5' },
        { label: 'AFD - Paiement confirmé', code: 'DDR8' },
        { label: 'AFD - Dossier règlement annulé', code: 'DDR10' },
        { label: 'AFD - DR remboursement en cours', code: 'DDR11' },
        { label: 'AFD - DR remboursé intégralement', code: 'DDR12' },
        { label: 'AFD - DR remboursé partiellement', code: 'DDR13' },
        { label: 'AFD - Envoyé KTP - en attente de paiement ', code: 'DDR14' },
        { label: 'PRO - Initialisé', code: 'DDV1' },
        { label: 'PRO - Contrôlé - Chargé d\'appui', code: 'DDV2' },
        { label: 'PRO - Contrôlé - Chargé d\'affaires', code: 'DDV3' },
        { label: 'PRO - Contrôlé - MO DAF', code: 'DDV5' },
        { label: 'PRO - Contrôlé - Directeur / Transmis DEF', code: 'DDV8' },
        { label: 'PRO - Paiement confirmé', code: 'DDV10' },
        { label: 'PRO - Dossier versement annulé', code: 'DDV11' },
        { label: 'PRO - DV remboursé intégralement', code: 'DDV12' },
        { label: 'PRO - DV remboursé partiellement', code: 'DDV13' },
        { label: 'PRO - DV Envoyé KTP - en attente de paiement', code: 'DDV14' }
    ],
    'refSocietes': [
        { label: 'AFD', code: 'C' },
        { label: 'FFEM', code: 'F' },
        { label: 'PROPARCO', code: 'P' },
        { label: 'FISEA', code: 'I' },
        { label: 'Secteur privé', code: 'SP' },
    ],
    'refSocietesLight': [
        { label: 'AFD', code: 'AFD' },
        // { label: 'FFEM', code: 'F' },
        { label: 'PROPARCO', code: 'PROPARCO' },
        // { label: 'FISEA', code: 'I' },
        // { label: 'Secteur privé', code: 'SP' },
    ],
    'refStatutsAno': [
        { label: 'Pour validation', code: 'pour_valider' },
        { label: 'Déclarée', code: 'DECLAR' },
        { label: 'Abandonnée', code: 'ABAND' },
        { label: 'Ouverte', code: 'OUVERT' },
        { label: 'Déclarée document OK', code: 'DECLAR_DOC_OK' },
        { label: 'A vérifier', code: 'A_VERIFIER' },
        { label: 'Régularisée', code: 'REGULARISEE' },
    ],
    'refStatuts2ndNiv': [
        { label: 'Attribuable avec critère de risque', code: 'ABANDDOSSMAX' }, //ATTRAVECRMAX, ATTRAVECR 
        { label: 'Clôturé avec anomalie', code: 'CLOTANO' },
        { label: 'Clôturé sans anomalie', code: 'CLOTSSANO' },
        { label: 'En cours de contrôle', code: 'ECT' },
        { label: 'Attribuable sans critère de risque', code: 'ATTRIBSSR' },
        { label: 'A contrôler', code: 'ACT' },
        { label: 'Contrôlé avec anomalie', code: 'CONANO' },
        { label: 'Attribuable avec critère de risque', code: 'ATTRAVECRMAX' },//ATTRAVECRMAX, ATTRAVECR 
        { label: 'Abandonné', code: 'ABOND' },
    ],
    'refTypeControleRaj': [
        { label: lang.controlesDCV.filterRAJdefault, code: 'DEFAULT' },
        { label: lang.controlesDCV.filterRAJzero, code: 'ZERO' },
    ],
    'refStatutsDCRaj': [
        { label: 'Clôturé avec anomalie', code: 'CLOTANO' },
        { label: 'Clôturé sans anomalie', code: 'CLOTSSANO' },
        { label: 'En cours de contrôle', code: 'ECT' },
        { label: 'A contrôler', code: 'ACT' },
        { label: 'Contrôlé avec anomalie', code: 'CONANO' },
        { label: 'Abandonné', code: 'ABOND' },
    ],
    'refTypesRemboursement': [
        { label: 'Remboursement partiel', code: '0' },
        { label: 'Remboursement intégral', code: '1' }
    ],
    'refCodesDdrValide': ['DDR8', 'DDR11', 'DDR12', 'DDR13', 'DDR5', 'DDR5B', 'DDR14'],
    'refCodesDdvValide': ['DDV8', 'DDV10', 'DDV12', 'DDV13', 'DDV14'],
    'refCodesDossierValide2ndNiv': ['CLOTANO', 'CLOTSSANO', 'CONANO']
};