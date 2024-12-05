var dataObjects = {
    'versementCreate': {
        "dossierVersementInput": {
            "numero_projet": "",
            "numero_concours": "",
            "libelle_projet": "",
            "type_versement": "",
            "modalite_paiement": "",
            "devise": "",
            "entite": "",
            "id_division": "",
            "agence_gestion": "",
            "pays_realisation": ""
        }
    },
    'versementUpdate': {
        "dossierVersementInput": {
            "numero_dossier_versement": 0,
            "reference_demande": "",
            "montant_versement": null,
            "devise": "",
            "lien_ged": "",
            "date_emission": null,
            "date_reception": null,
            "id_emetteur_demande": "",
            "memo": "",
            "entite": "",
            "autresDevises": [],
            "code_statut": "",
            "notificationMailInput": {
                "corpNotification": "",
            },
            "date_leve_condition_suspensive": null,
            "urlDossier": "",
            "decision": ""
        }
    },
    'reglement': {
        "dossierReglementInput": {
            "numero_dossier_reglement": null,
            "id_beneficiaire_reglement": "",
            "montant_reglement": null,
            "devise_reglement": "",
            "devise_reference": "",
            "lieu_execution": "",
            "pays_realisation": "",
            "nature_taux": "",
            "taux": null,
            "numero_dossier_versement": null,
            "entite": "",
            "numero_concours": "",
            "type_devise": "",
            "type_at": "",
            "id_banque_beneficiaire": "",
            "commentaire": "",
            "dc_attache": "",
            "id_document_contractuel": "",
            "id_avance_contractuel": "",
            "id_beneficiaire_primaire": "",
            "imputation_comptable": "",
            "id_operation": "",
            "id_produit": "",
            "numero_decaissement": null,
            "libelle_concours": "",
            "concours_miroir_afd": "",
            "informations_virement": "",
            "aba_banque": "",
            "aba_banque_correspandante": "",
            "numero_compte_ktp": "",
            "achat_devise_pro": "",
            "pret_adosse_subvention_seche": "",
            "nom_facilite": "",
            "pret_auto_finance": "",
            "saisie_sous_objets": "",
            "notificationMailInput": {
                "corpNotification": "",
            },
            "urlDossier": "",
            "decision": "",
            "montant_contrevaleur": null,
            "devise_contrevaleur": "",
            "date_contrevaleur": null,
            "montant_equivalent": null,
            "date_equivalent": null,
            "direction_regionale": "",
            "agence_gestion": "",
            "date_signature_convention": null,
            "id_coordonnee_bancaire": "",
            "generer_pdf": false,
            "montant_definitif_reglement": null,
            "date_paiement": null,
            "justificatif_complementaire_RAJ": "",
            "id_division": ""
        }
    },
    'reglementDefinitif': { //TODO changer le nom
        "dossierReglementInput": {
            "montant_definitif_reglement": null,
            "date_paiement": null,
            "devise_paiement": null
        }
    },
    'confirmationPaiementDR': {
        "dossierVersementInput": {
            "persistenceId": null,
            "dossiersReglement": []
        }
    },
    'reglementDefinitifPROPARCO': { //TODO changer le nom
        "dossierReglementInput": {
            "montant_definitif_reglement": null,
            "date_paiement": null,
            "devise_paiement": null,
            "persistenceId": null
        }
    },
    'reglementPDFInput': { //TODO changer le nom
        "dossierDeReglementInput": {
            "numero_dossier_reglement": null,
            "numero_dossier_versement": null,
        },
        "statut": ""
    },
    'updateTache': { //TODO changer le nom
        "updateTache": {
            "assigned_id": ""
        }
    },
    'justificatif': {
        "justificatifVersementInput": {
            "numero_justificatif": null,
            "type_justificatif": "",
            "beneficiaire_justificatif": "",
            "date_justificatif": null,
            "document_contractuel_justificatif": "",
            "montant_financement_AFD": null,
            "montant_total_verse_justificatif": null,
            "devise_justificatif": "",
            "lien_justificatif": "",
            "commentaire_justificatif": "",
            "numero_dossier_versement": null,
            "reference_justificatif": ""
        }
    },
    'controle': {
        "controleInput": {
            "codeControle": "",
            "descriptionControleFr": "",
            "descriptionControleEn": "",
            "criticiteControle": false,
            "autoControle": false,
            "entite": "",
            "infobulle": "",
            "themeControle": "",
            "regleAuto": "",
            "perimetre": ""
        }
    },
    'controleEtape': {
        'controleEtapeInput': {
            "id": "",
            "idParamEtape": "",
            "ordre": "",
            "controleParentCode": "",
            "bloquantControle": false,
            "bloquantControleValeur": "",
            "nonApplicable": false,
            "valeurPere": "",
            "filtre": "",
            "niveauAffichage": "",
            "actifControle": false,
            "commentaireObligatoire": false,
            "commentaireObligatoireValeur": "",
            "lienObligatoire": false,
            "lienObligatoireValeur": "",
            "valorisable": false,
            "paramTypeAnomalies": []
        }
    },
    "commentaire": {
        "commentaireInput": {
            "texteCommentaire": "",
            "typePartentObject": "",
            "persistanceIdParentObject": null,
            "caseIdParentObject": null,
            "userName": "",
            "roleUser": "",
            "persistenceId": null,
            "commentaireAnnule": false
        }
    },
    "modalitePaiement": {
        "modalitePaiementInput": {
            "nomModalite": "",
            "libelleModalite": "",
            "entite": ""
        }
    },
    "devise": {
        "deviseInput": {
            "codeDevise": "",
            "libelleDevise": ""
        }
    },
    "typeJustificatif": {
        "typeJustificatifInput": {
            "libelle": ""
        }
    },
    "typeOrdre": {
        "typeOrdreInput": {
            "libelle": ""
        }
    },
    "typesVersement": {
        "typesVersementInput": {
            "nomType": "",
            "libelleType": ""
        }
    },
    "controles": {
        "controleInput": [{
            "code_controle": "",
            "libelle_controle_fr": "",
            "libelle_controle_en": "",
            "valeur": "",
            "code_etape": "",
            "parentObjectCaseId": "",
            "persistenceId": ""
        }],
        "caseId": "",
        "codeEtape": ""
    },
    "documentContractuel": {
        "documentContractuelInput": {
            "dc_persistenceid": "0",
            "refrence_externe": "",
            "libelle": "",
            "mode_attribution": "",
            "type_marche": "",
            "nature_marche": "",
            "lien_rom": "",
            "date_signature": null,
            "date_avis_non_objection": null,
            "id_fournisseur": "",
            "montant_total_document": null,
            "devise": "",
            "montant_afd": null,
            "devise_afd": "",
            "commentaire": "",
            "numero_projet": "",
            "rubriques": [],
            "autre_devise": [],
            "devise_contrevaleur": "",
            "montant_contrevaleur_afd": null,
            "date_contrevaleur_afd": null,
            "montant_contrevaleur_ht": null,
            "date_contrevaleur_ht": null,
            "avance_remboursable": "",
            "pourcentage_avance_demarrage": "",
            "montant_avance_demarrage": null,
            "devise_avance_demarrage": "",
            "sous_rubriques": [],
            "montant_initialAFD": null,
            "montant_finalAFD": null,
            "montant_enregistreAFD": null,
            "montant_reste_a_verserAFD": null
        }
    },
    "avanceContractuel": {
        "avanceContractuelInput1": {
            "lien_rom": "",
            "numero_concours": "",
            "libelle": "",
            "devise_avance": "",
            "pourcentage_initial_dernier_versement": null,
            "pourcentage_final_dernier_versement": null,
            "pourcentage_initial_avant_dernier_versement": null,
            "pourcentage_final_avant_dernier_versement": null,
            "date_ljf_initial": null,
            "date_ljf_final": null,
            "date_reception_rapport_final": null,
            "lien_rom_rapport_final": "",
            "memo": "",
            "choix_plafond": "",
            "montant_plafond": null,
            "typesAvance": [],
            "persistence_id": null,
            "date_limite_utilisation_fond": null,
            "date_limite_utilisation_fond_final": null,
            "avenant": {
                "pourcentage_final_dernier_versement": null,
                "date_ljf_final": null,
                "date_luf_final": null
            },
            "choix_type_avance": "",
            "audit": [],
            "entite": "",
            "numero_projet": "",
            "libelle_projet": "",
            "agence_gestion": "",
            "produit_financier": ""
        }
    },
    "avanceFigee": {
        "avanceFigeeInput1": {
            "reste_justifier_decaisser_dossier_copy": null,
            "reste_justifier_copy": null,
            "montant_total_justificatifs_avance_copy": null,
            "montant_verse_total_copy": null,
            "id_dossier_reglement": null,
            "id_avance_contractuel": null,
            "justificatifs_avance_figee": []
        }
    },
    "notification": {
        "notificationMailInput": {
            "destinataire": "",
            "corpNotification": "",
            "persistanceIdParentObject": "",
            "caseIdParentObject": ""
        },
        "decision": "",
        "urlDossier": "",
        "montant_versement": null,
        "devise": "",
        "lien_ged": "",
        "date_emission": null,
        "date_reception": null,
        "memo": "",
        "date_leve_condition_suspensive": null

    },
    "notificationDCV": {
        "taskDcvInput": {
        }
    },
    "rubrique": {
        "rubriqueInput": {
            "libelle_rubrique": "",
            "montant_rubrique": null,
            "devise_rubrique": "",
            "id_rubrique": "",
            "id_document_contractuel": "",
            "autre_devise": [],
            "pourcentage_avance": "",
            "montant_avance": "",
            "devise_avance": ""
        }
    },
    "justificatifRemboursement": {
        "justificatifRemboursementInput": {
            "reference": "",
            "typeRemboursement": "",
            "lien_rome": "",
            "date_valeur": null,
            "montant_remboursement": null,
            "devise_remboursement": "",
            "memo": "",
            "id_document_contractuel": "",
            "id_dossier_reglement": "",
            "id_avance_contractuel": "",
            "montantJustifRemboursement": []
        }
    },
    "remboursement": {
        "dossierReglementInput": {
            "persistenceId": ""
        }
    },
    "justificatifReglement": {
        "jutificatifInput": {
            "persistence_id": "",
            "reference": "",
            "type": "",
            "lien_rom": "",
            "date_emission": null,
            "montant_finance_afd": null,
            "devise": "",
            "emetteur": "",
            "memo": "",
            "id_document_contractuel": "",
            "id_dossier_reglement": "",
            "montantsJustificatifRubrique": [],
            "montant_ventile": null,
            "montant_a_rembourser": null
        },
        "documentContractuel": {
            "rubriques": [],
            "montant_enregistre": null,
            "montant_reste_a_verser": null,
            "persistence_id_autre_devise": ""
        },
        "deleted": false
    },
    "justificatifAvance": {
        "jutificatifInput": {
            "persistence_id": "",
            "reference": "",
            "type": "",
            "lien_rom": "",
            "date_emission": null,
            "montant_finance_afd": null,
            "devise": "",
            "emetteur": "",
            "memo": "",
            "id_avance_contractuel": "",
            "montant_justifie": null,
            "dernier_justificatif": false,
            "numero_projet": "",
            "libelle_projet": ""
        },
        "deleted": false
    },
    "typeAvance": {
        "typeAvanceInput": {
            "persistenceId": null,
            "libelle": "",
            "type": "",
            "devise": "",
            "montant": null,
            "numero_type_avance": 0
        }
    },
    "typeAnomalie": {
        "typeAnomalieInput": {
            "idTypeAnomalie": "",
            "codeAnomalie": "",
            "libelleAnomalie": "",
            "graviteAnomalie": "",
            "ordre": "",
            "regularisable": false,
            "statutActif": false
        }
    },
    "theme": {
        "themeInput": {
            "idTheme": "",
            "codeTheme": "",
            "libelleTheme": "",
            "statutActif": 'Y',
            "niveau": "",
            "entite": ""
        }
    },
    "anomalie": {
        "anomalieInput": {
            "decision": "",
            "numero_isiman": "",
            "numero_isiman_valide": false,
            "case_id_traitement_anomalie": ""
        }
    },
    "controleur": {
        "dossierReglementInput": {
            "persistenceId": ""
        }
    },
    "typeUser": {
        "typeUserInput": {
            "idUtilisateur": null,
            "mail": null,
            "civilite": null,
            "nom": null,
            "prenom": null,
            "capaciteTraitementAnnuelle": null,
            "capaciteTraitementMensuelle": null,
            "nbControleEffectueAn": null,
            "nbrDossierTraite": null,
            "nbrDossierAffecte": null,
            "login": null,
            "idMatricule": null,
            "actif": null,
            "creationDate": null,
            "updateDate": null,
            "utilisateurEntites": [],
            "utilisateurAgenceControle": [],
            "userMaj": "",
            "idUserMaj": "",
            "isAdminFoncionnel": false
        }
    },
    "notificationDCV": {
        "controle2ndNiveauInput": {
            "decision": "",
            "corpNotification": ""
        }
    },
    "avanceContractuelRAJDefault": {
        "avanceContractuelRAJDefaultInput": {
            "persistenceId": ""
        }
    },
    'updateDescriptionTache': {
        "updateDescriptionTache": {
            "displayDescription": ""
        }
    },
};