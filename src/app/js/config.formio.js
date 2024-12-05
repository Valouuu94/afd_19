var formFields = {
    'versementAFD': [
        {
            "name": "lien_ged",
            "type": "text",
            "required": true,
            "template": "2.1",
            "label": lang.versement.lien_ged,
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "placeholder": lang.versement.placeholderLien
        },
        {
            "name": "reference_demande",
            "type": "text",
            "template": "3.1",
            "value": "",
            "label": lang.versement.reference
        },
        {
            "name": "date_emission",
            "type": "date",
            "required": true,
            "template": "4.1",
            "label": lang.versement.date_emission,
            "limitNow": ">"
        },
        {
            "name": "date_reception",
            "type": "date",
            "template": "4.2",
            "required": true,
            "label": lang.versement.date_reception,
            "limitNow": ">"
        },
        {
            "name": "date_leve_condition_suspensive",
            "type": "date",
            "template": "4.3",
            "label": lang.versement.date_leve_condition_suspensive,
            "limitNow": ">"
        },
        {
            "type": "teleport",
            "ref": "teleport-errorDatePaiement",
            "template": "4.3"
        },
        {
            "name": "montant_versement",
            "type": "number",
            "isMontant": true,
            "required": true,
            "template": "5.1",
            "label": lang.versement.montant_versement,
            "customValidate": "valid = (app.verifMontantDV(input, true)) ? true : app.getMessagesErrorMontantDV(input)"
        },
        {
            "name": "devise",
            "template": "5.2",
            "type": "combo",
            "required": true,
            "label": lang.versement.devise,
            "data": "refDevises",
            "customValidate": "valid = (app.verifDeviseDV(input, false)) ? true : lang.errors.currency.currencyAlreadyUsed"
        },
        {
            "type": "teleport",
            "ref": "teleport-autreDevise",
            "template": "6.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-select-beneficiaire-versement",
            "template": "7.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-beneficiaire-versement",
            "template": "8.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "label": lang.templates.commentaires,
            "helper": lang.versement.helperMemoAFD,
            "tooltip": lang.versement.tooltipMemoAFD,
            "template": "9.1",
            "max": 500
        }
    ],
    'versementPROPARCO': [
        {
            "name": "lien_ged",
            "type": "text",
            "required": false,
            "template": "1.1",
            "value": "",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "required": true,
            "label": lang.versement.lien_ged,
            "placeholder": lang.versement.placeholderLien
        },
        {
            "name": "date_emission",
            "type": "date",
            "required": true,
            "label": lang.versement.date_emission,
            "template": "2.1",
            "limitNow": ">"
        },
        {
            "name": "date_reception",
            "type": "date",
            "required": true,
            "label": lang.versement.date_reception_contrepartie,
            "template": "2.2",
            "change": "verifDatePaiement"
        },
        {
            "type": "teleport",
            "ref": "teleport-errorDatePaiement",
            "template": "2.2"
        },
        {
            "name": "date_leve_condition_suspensive",
            "type": "date",
            "template": "2.3",
            "label": lang.versement.date_leve_condition_suspensive,
            "limitNow": ">"
        },
        {
            "name": "montant_versement",
            "type": "number",
            "isMontant": true,
            "label": lang.versement.montant_versement,
            "template": "3.1",
            "required": true,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            }
        },
        {
            "name": "devise",
            "type": "combo",
            "label": lang.versement.devise,
            "template": "3.2",
            "required": true,
            "data": "refDevises"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "4.1",
            "label": lang.templates.commentaires,
            "helper": lang.versement.helperMemoPRO,
            "max": 500
        }
    ],
    'reglementAFD': [
        {
            "name": "numero_concours",
            "type": "combo",
            "template": "1.1",
            "label": lang.reglementAFD.choix_numero_concours,
            "data": "concours",
            "change": "changeConcoursReglement",
            "required": true
        },
        {
            "type": "teleport",
            "ref": "teleport-concours",
            "template": "2.1"
        },
        {
            "name": "add_avance",
            "type": "hidden",
            "template": "5.1",
            "value": ""
        },
        {
            "name": "add_avance_contractuel",
            "type": "hidden",
            "template": "4.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-select-avance",
            "template": "4.1"
        },
        {
            "name": "button_add_new_avance",
            "type": "button",
            "label": lang.reglementAFD.creer_objet,
            "theme": "secondary",
            "template": "4.2",
            "css": "btn-formio",
            "click": "app.getCurrentCmp('reglement').addAvanceContractuel()",
            "displayIfValue": {
                "display": true,
                "field": "add_avance_by_role",
                "value": "add_actif"
            }
        },
        {
            "name": "add_avance_by_role",
            "type": "hidden",
            "template": "6.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-avance",
            "template": "5.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-nombre-document-contractuel",
            "template": "7.1"
        },
        {
            "name": "doc_show",
            "type": "hidden",
            "template": "8.1",
            "value": ""
        },
        {
            "name": "dc_attache",
            "type": "toggle",
            "label": lang.reglementAFD.dc_attache,
            "tooltip": lang.reglementAFD.dc_attacheTooltip,
            "label1": lang.reglementAFD.dc_attache_oui,
            "label0": lang.reglementAFD.dc_attache_non,
            "template": "8.1",
            "action": "reglement,showEditeButton",
            "displayIfValue": {
                "display": true,
                "field": "doc_show",
                "value": "show"
            }
        },
        {
            "name": "id_document_contractuel",
            "type": "combo",
            "template": "9.1",
            "label": lang.reglementAFD.lier_document_contractuel,
            "tooltip": lang.reglementAFD.lier_document_contractuelTooltip,
            "data": "documentsContractuel",
            "displayIfValue": {
                "display": true,
                "field": "dc_attache",
                "value": "1"
            },
            "change": "changeDetailDocumentContractuel",
        },
        {
            "name": "button_add",
            "type": "button",
            "label": lang.reglementAFD.creer_objet,
            "css": "button-form",
            "theme": "secondary",
            "template": "9.2",
            "click": "app.getCurrentCmp('reglement').addDocumentContractuel()",
            "displayIfValue": {
                "display": true,
                "field": "add_dc_by_role",
                "value": "true"
            }
        },
        {
            "type": "teleport",
            "ref": "teleport-detail-document-contractuel",
            "template": "10.1"
        },
        {
            "name": "raj_sup_zero",
            "type": "hidden",
            "template": "11.1",
            "value": ""
        },
        {
            "name": "lien_rom_raj",
            "type": "text",
            "template": "11.1",
            "label": lang.lienRomeRAJ,
            "tooltip": lang.lienRomeRAJTooltip,
            "required": true,
            "placeholder": lang.saisirROME,
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "displayIfValue": {
                "display": true,
                "field": "raj_sup_zero",
                "value": "show"
            }
        },
        {
            "name": "nature_taux",
            "template": "12.1",
            "label": lang.reglementAFD.nature_taux,
            "required": true,
            "type": "combo",
            "data": "refNatureTaux"
        },
        {
            "name": "numero_decaissement",
            "type": "number",
            "template": "13.1",
            "label": lang.reglementAFD.numero_decaissement,
            "read": true,
        },
        {
            "name": "lieu_execution",
            "type": "combo",
            "required": "true",
            "template": "13.2",
            "label": lang.reglementAFD.lieu_execution,
            "tooltip": lang.reglementAFD.lieu_executionTooltip,
            "url": urls['urlGetPays'],
            "propertyCode": "idPays",
            "propertyLabel": "libelleCourtPays"
        },
        {
            "name": "type_devise",
            "type": "toggle",
            "label": lang.reglementAFD.choix_devise,
            "tooltip": lang.reglementAFD.choix_deviseTooltip,
            "required": true,
            "label1": lang.reglementAFD.type_devise_reglement,
            "label0": lang.reglementAFD.type_devise_equivalent,
            "template": "14.1",
            "action": "reglement,selectToggleTypeDeviseAfterSet,selectToggleTypeDeviseBeforeSet"
        },
        {
            "name": "montant_reglement",
            "type": "number",
            "template": "15.1",
            "required": true,
            "label": lang.reglementAFD.montant_reglement,
            "change": "getCurrentCmp#reglement#changeMontantReglement",
            "isMontant": true,
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "1"
            },
            "customValidate": "valid = (app.getCurrentCmp('reglement').verifMontantDDR(input)) ? true : app.getCurrentCmp('reglement').getMessagesErrorMontantDDR(input)"
        },
        {
            "name": "montant_reglement",
            "type": "number",
            "template": "15.1",
            "required": true,
            "isMontant": true,
            "change": "getCurrentCmp#reglement#updateContrevaleurEtEquivalent",
            "label": lang.reglementAFD.montant_reference,
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "0"
            },
            "customValidate": "valid = (app.getCurrentCmp('reglement').verifMontantDDR(input)) ? true : app.getCurrentCmp('reglement').getMessagesErrorMontantDDR(input)"
        },
        {
            "type": "teleport",
            "ref": "teleport-devise-reglement",
            "template": "15.2"
        },
        {
            "name": "devise_reglement",
            "type": "combo",
            "required": true,
            "template": "15.3",
            "label": lang.reglementAFD.devise_reglement,
            "data": "refDevises",
            "change": "getCurrentCmp#reglement#updateContrevaleurEtEquivalent",
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "0"
            }
        },
        {
            "name": "add_dc_by_role",
            "type": "hidden",
            "template": "16.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-equivalent",
            "template": "16.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-contrevaleur",
            "template": "17.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-detail-avance-remboursable",
            "template": "19.1"
        },
        {
            "name": "type_produit",
            "type": "hidden",
            "template": "21.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-beneficiaire-primaire",
            "template": "21.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-select-beneficiaire-reglement",
            "template": "22.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-beneficiaire-reglement",
            "template": "23.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-details-coordonnee-bancaire",
            "template": "24.1"
        },
        {
            "name": "show_justificatif",
            "type": "hidden",
            "template": "25.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-justificatifs-reglement",
            "template": "25.1"
        },
        {
            "name": "show_justificatif_remboursement",
            "type": "hidden",
            "template": "26.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-justificatifs-remboursement",
            "template": "26.1"
        },
        {
            "name": "commentaire",
            "type": "textarea",
            "label": lang.memo,
            "template": "27.1",
            "helper": lang.reglement.helperCommentaire,
            "max": 500
        }
    ],
    'reglementDefinitifAFD': [
        {
            "name": "montant_definitif",
            "type": "number",
            "isMontant": true,
            "template": "1.1",
            "label": lang.ddrDefinitif.montant,
            "required": true,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            },
        },
        {
            "name": "devise_concours",
            "type": "combo",
            "required": true,
            "tooltip": lang.ddrDefinitif.devise,
            "label": lang.devise,
            "data": "refDevises",
            "template": "1.2"
        },
        {
            "name": "date_valeur",
            "type": "date",
            "template": "1.3",
            "label": lang.ddrDefinitif.dateValeur,
            "required": true,
            "limitNow": ">"
        }
    ],
    'reglementPROPARCO': [
        {
            "name": "add_avance",
            "type": "hidden",
            "template": "1.1",
            "value": ""
        },
        {
            "name": "add_avance_contractuel",
            "type": "hidden",
            "template": "1.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-select-avance",
            "template": "1.1"
        },
        {
            "name": "button_add_new_avance",
            "type": "button",
            "label": lang.reglementPROPARCO.creer_objet,
            "theme": "secondary",
            "template": "1.2",
            "css": "btn-formio",
            "click": "app.getCurrentCmp('reglement').addAvanceContractuel()",
            "displayIfValue": {
                "display": true,
                "field": "add_avance_by_role",
                "value": "add_actif"
            }
        },
        {
            "type": "teleport",
            "ref": "teleport-avance",
            "template": "2.1"
        },
        {
            "name": "add_avance_by_role",
            "type": "hidden",
            "template": "2.1",
            "value": ""
        },
        {
            "name": "raj_sup_zero",
            "type": "hidden",
            "template": "3.1",
            "value": ""
        },
        {
            "name": "lien_rom_raj",
            "type": "text",
            "template": "3.1",
            "label": lang.lienRomeRAJ,
            "required": true,
            "placeholder": lang.saisirROME,
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "displayIfValue": {
                "display": true,
                "field": "raj_sup_zero",
                "value": "show"
            }
        },
        {
            "name": "numero_concours",
            "type": "combo",
            "template": "4.1",
            "label": lang.reglementPROPARCO.choix_concours,
            "data": "concours",
            "required": true,
            "change": "changeConcoursReglement"
        },
        {
            "name": "type_reversement",
            "type": "hidden",
            "template": "4.1",
            "value": ""
        },
        {
            "name": "libelle_concours",
            "type": "text",
            "template": "4.2",
            "label": lang.concours.libelleConcours,
            "value": ""
        },
        {
            "name": "numero_decaissement",
            "type": "number",
            "template": "4.3",
            "required": true,
            "label": lang.concours.numeroDecaissements,
        },
        {
            "type": "teleport",
            "ref": "teleport-concours",
            "template": "5.1"
        },
        {
            "name": "type_at",
            "type": "combo",
            "template": "6.1",
            "label": lang.reglementPROPARCO.type_at,
            "data": "refTypeAT",
            "value": "",
            "change": "getCurrentCmp#reglement#calculImputationComptable"
        },
        {
            "name": "pret_auto_finance",
            "type": "combo",
            "template": "6.2",
            "required": true,
            "label": lang.reglement.pretAdosse,
            "data": "refPretAdosse",
            "value": "-1",
            "change": "getCurrentCmp#reglement#changePretAdosse",
            "displayIfValue": {
                "display": false,
                "field": "type_reversement",
                "value": "reversement"
            }
        },
        {
            "name": "pret_adosse_subvention_seche",
            "type": "combo",
            "template": "6.3",
            "required": true,
            "label": lang.reglement.pretAdosseSubvention,
            "data": "refPretAdosse",
            "change": "changePretAdosse",
            "value": "-1",
            "displayIfValue": {
                "display": false,
                "field": "type_reversement",
                "value": "reversement"
            }
        },
        {
            "name": "nom_facilite",
            "type": "text",
            "template": "6.4",
            "read": true,
            "label": lang.reglement.nomFacilite,
            "displayIfValue": {
                "display": true,
                "field": "pret_adosse_subvention_seche",
                "value": "-1"
            }
        },
        {
            "name": "concours_miroir_afd",
            "type": "text",
            "template": "6.5",
            "read": true,
            "label": lang.reglement.concoursMiroir,
            "displayIfValue": {
                "display": true,
                "field": "pret_adosse_subvention_seche",
                "value": "-1"
            }
        },
        {
            "name": "nom_facilite",
            "type": "text",
            "template": "6.4",
            "helper": lang.reglement.aRenseigner,
            "label": lang.reglement.nomFacilite,
            "displayIfValue": {
                "display": true,
                "field": "pret_adosse_subvention_seche",
                "value": "0"
            }
        },
        {
            "name": "concours_miroir_afd",
            "type": "text",
            "template": "6.5",
            "helper": lang.reglement.aRenseigner,
            "label": lang.reglement.concoursMiroir,
            "displayIfValue": {
                "display": true,
                "field": "pret_adosse_subvention_seche",
                "value": "0"
            }
        },
        {
            "name": "type_devise",
            "type": "toggle",
            "label": lang.reglementPROPARCO.type_devise,
            "hideLabel": true,
            "required": true,
            "label1": "En devise du versement",
            "label0": "En devise équivalente",
            "template": "7.1",
            "action": "reglement,selectToggleTypeDeviseAfterSet,selectToggleTypeDeviseBeforeSet"
        },
        {
            "type": "label",
            "label": lang.reglementPROPARCO.devise_reference_explication,
            "template": "8.1",
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "0"
            },
        },
        {
            "name": "montant_reglement",
            "type": "number",
            "isMontant": true,
            "template": "9.1",
            "required": true,
            "label": lang.reglementPROPARCO.montant_reglement,
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "1"
            },
            "customValidate": "valid = (app.getCurrentCmp('reglement').verifMontantDDR(input)) ? true : app.getCurrentCmp('reglement').getMessagesErrorMontantDDR(input)"
        },
        {
            "name": "devise_reglement",
            "type": "combo",
            "required": true,
            "template": "9.2",
            "label": lang.reglementPROPARCO.devise_reglement,
            "data": "refDevises",
            "change": "getCurrentCmp#reglement#updateContrevaleur",
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "1"
            },
        },
        {
            "name": "montant_reglement",
            "type": "number",
            "template": "9.1",
            "isMontant": true,
            "required": true,
            "label": lang.reglementPROPARCO.montant_reference,
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "0"
            },
            "customValidate": "valid = (app.getCurrentCmp('reglement').verifMontantDDR(input)) ? true : app.getCurrentCmp('reglement').getMessagesErrorMontantDDR(input)"
        },
        {
            "name": "devise_reference",
            "type": "combo",
            "template": "9.2",
            "label": lang.reglementPROPARCO.devise_reference,
            "required": true,
            "data": "refDevises",
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "0"
            }
        },
        {
            "name": "devise_reglement",
            "type": "combo",
            "template": "9.3",
            "required": true,
            "label": lang.reglementPROPARCO.devise_versement,
            "data": "refDevises",
            "change": "getCurrentCmp#reglement#updateContrevaleur",
            "displayIfValue": {
                "display": true,
                "field": "type_devise",
                "value": "0"
            }
        },
        {
            "name": "taux",
            "type": "number",
            "template": "10.1",
            "suffix": "%",
            "label": lang.reglementPROPARCO.taux,
            "displayIfValue": {
                "display": true,
                "field": "type_reversement",
                "value": ""
            }
        },
        {
            "type": "teleport",
            "ref": "teleport-beneficiaire-primaire",
            "template": "11.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-select-beneficiaire-reglement",
            "template": "12.1"
        },

        {
            "type": "teleport",
            "ref": "teleport-beneficiaire-reglement",
            "template": "13.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-details-coordonnee-bancaire",
            "template": "14.1"
        },
        {
            "name": "aba_banque",
            "type": "text",
            "label": lang.reglement.abaBanque,
            "template": "15.1"
        },
        {
            "name": "aba_banque_correspandante",
            "type": "text",
            "label": lang.reglement.abaBanqueCorr,
            "template": "15.2"
        },
        {
            "name": "informations_virement",
            "type": "textarea",
            "label": lang.reglementPROPARCO.informations_virement,
            "template": "16.1"
        },
        {
            "name": "commentaire",
            "type": "textarea",
            "label": lang.memo,
            "helper": lang.reglement.helperCommentaire,
            "max": 500,
            "template": "17.1"
        },
        {
            "name": "edit_imputation_comptable",
            "type": "hidden",
            "template": "18.1",
            "value": ""
        },
        {
            "name": "imputation_comptable",
            "type": "text",
            "label": lang.reglementPROPARCO.imputation_comptable,
            "placeholder": lang.reglement.aRenseigner,
            "read": false,
            "template": "18.1"
        },
        {
            "name": "num_compte_ktp",
            "type": "hidden",
            "template": "18.1",
            "value": ""
        },
        {
            "name": "numero_compte_ktp",
            "type": "combo",
            "label": lang.reglement.numeroCompteKTP,
            "template": "18.1",
            "data": "refNumeroCompteKTP",
            "placeholder": lang.reglement.placeholderSaisie,
            "helper": lang.reglement.numeroCompteKTPHelper,
            "displayIfValue": {
                "display": true,
                "field": "num_compte_ktp",
                "value": "show"
            }
        },
        {
            "name": "achat_devise_pro",
            "type": "combo",
            "label": lang.reglement.achatDevisePro,
            "template": "20.1",
            "data": "refBooleanNAIPS"
        }
    ],
    'versementInitAFD': [
        {
            "name": "numero_concours",
            "type": "combo",
            "template": "1.1",
            "label": lang.versementInitAFD.concours,
            "placeholder": lang.versementInitAFD.choix_concours_placeholder,
            "required": true,
            "data": "concours"
        },
        {
            "name": "type_versement",
            "type": "combo",
            "search": false,
            "template": "2.1",
            "label": lang.versementInitAFD.typologie_controle,
            "placeholder": lang.versementInitAFD.typologie_controle_placeholder,
            "helper": lang.versementInitAFD.typologie_controle_helper,
            "required": true,
            "url": urls['urlGetTypesVersement'],
            "search": false,
            "propertyCode": "codeTypeVersement",
            "propertyLabel": "libLongTypeVersement",
            "change": "onChangeSelectTypeVersement",
        },
        {
            "name": "modalite_paiement",
            "type": "combo",
            "template": "3.1",
            "label": lang.versementInitAFD.modalite_paiement,
            "placeholder": lang.versementInitAFD.modaliet_paiement_placeholder,
            "required": true,
            "url": urls['urlGetModalitesPaiementAFD'],
            "propertyCode": "nomModalite",
            "propertyLabel": "libelleModalite",
            "displayIfValue": {
                "display": true,
                "field": "type_versement",
                "value": "cas_general",
            },
        },
        {
            "name": "modalite_paiement",
            "type": "combo",
            "template": "3.1",
            "label": lang.versementInitAFD.modalite_paiement,
            "placeholder": lang.versementInitAFD.modaliet_paiement_placeholder,
            "required": true,
            "data": "refModalitePaimentMoad",
            "displayIfValue": {
                "display": true,
                "field": "type_versement",
                "value": "cas_moad",
            },
        }
    ],
    'versementInitPROPARCO': [
        {
            "name": "numero_projet",
            "type": "combo",
            "template": "1.1",
            "required": true,
            'label': lang.versementInitPROPARCO.projet,
            "helper": lang.versementInitPROPARCO.choix_projet_helper,
            "data": "projets"
        },
        {
            "name": "modalite_paiement",
            "type": "combo",
            "required": true,
            "search": false,
            "template": "2.1",
            "label": lang.versementInitPROPARCO.modalite_paiement,
            "url": urls['urlGetModalitesPaiementPROPARCO'],
            "propertyCode": "nomModalite",
            "propertyLabel": "libelleModalite",
        }
    ],
    'projetMontant': [
        {
            "name": "montant_init",
            "type": "number",
            "label": lang.projetMontant.montant_initial,
            "value": "0",
            "read": true,
            "template": "1.1"
        },
        {
            "name": "montant_final",
            "type": "number",
            "label": lang.projetMontant.montant_final,
            "value": "0",
            "read": true,
            "template": "1.1"
        },
        {
            "name": "verse_dc",
            "type": "number",
            "label": lang.projetMontant.montant_verse_dc,
            "value": "0",
            "read": true,
            "template": "1.2"
        },
        {
            "name": "verse_hors_dc",
            "type": "number",
            "label": lang.projetMontant.montant_verse_hors_dc,
            "value": "0",
            "read": true,
            "template": "1.2"
        }
    ],
    'convention': [
        {
            "name": "id",
            "type": "text",
            "label": lang.convention.numero_convention,
            "read": true,
            "value": "",
            "template": "1.1"
        },
        {
            "name": "datesignature",
            "type": "date",
            "template": "1.1",
            "value": "1",
            "label": lang.convention.date_signature
        },
        {
            "name": "beneficiaire",
            "type": "text",
            "label": lang.convention.nom_beneficiaire,
            "multi": false,
            "template": "1.1",
            "value": "",
            "data": "refAdresses"
        },
        {
            "name": "montant",
            "type": "number",
            "template": "1.2",
            "value": "",
            "label": lang.convention.montant_initial
        },
        {
            "name": "montantfinal",
            "type": "number",
            "template": "1.2",
            "value": "",
            "label": lang.convention.montant_final
        }
    ],
    'controle': [
        {
            "name": "codeControle",
            "label": lang.controle.code,
            "type": "text",
            "required": true,
            "template": "1.1"
        },
        {
            "name": "autoControle",
            "label": lang.controle.auto,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "N",
            "template": "1.2"
        },
        {
            "name": "criticiteControle",
            "label": lang.controle.criticite,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "N",
            "template": "1.3"
        },
        {
            "name": "perimetre",
            "label": lang.controle.perimetre,
            "type": "combo",
            "read": true,
            "data": "refControlePerimetre",
            "search": false,
            "template": "1.4"
        },
        {
            "name": "descriptionControleFr",
            "label": lang.controle.labelFR,
            "type": "textarea",
            "template": "2.1"
        },
        {
            "name": "descriptionControleEn",
            "label": lang.controle.labelEN,
            "type": "textarea",
            "template": "2.2"
        },
        {
            "name": "themeControle",
            "label": lang.controle.theme,
            "type": "combo",
            "data": "refControleThemeActif",
            "search": false,
            "template": "3.1"
        },
        {
            "name": "regleAuto",
            "label": lang.controle.etape.regleAuto,
            "type": "combo",
            "data": "refReglesAuto",
            "template": "3.1",
            "displayIfValue": {
                "display": true,
                "field": "autoControle",
                "value": "Y"
            }
        },
        {
            "name": "infobulle",
            "label": lang.controle.infobulle,
            "type": "textarea",
            "max": 512,
            "template": "3.2"
        }
    ],
    'controleDCV': [
        {
            "name": "codeControle",
            "label": lang.controle.codeDCV,
            "type": "text",
            "required": true,
            "template": "1.1"
        },
        {
            "name": "perimetre",
            "label": lang.controle.perimetre,
            "type": "combo",
            "read": true,
            "data": "refControlePerimetre",
            "search": false,
            "template": "1.2"
        },
        {
            "name": "themeControle",
            "label": lang.controle.theme,
            "type": "combo",
            "required": true,
            "data": "refControleThemeActifDCV",
            "search": false,
            "template": "1.3"
        },
        {
            "name": "descriptionControleFr",
            "label": lang.controle.labelDCV,
            "type": "textarea",
            "required": true,
            "template": "2.1"
        },
        {
            "name": "infobulle",
            "label": lang.controle.infobulle,
            "type": "textarea",
            "template": "2.2"
        }
    ],
    'controleEtape': [
        {
            "name": "idParamEtape",
            "label": lang.controle.etape.etape,
            "type": "combo",
            "search": false,
            "data": "refControleEtapes",
            "template": "1.1"
        },
        {
            "name": "actifControle",
            "label": lang.controle.actif,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "template": "1.2"
        },
        {
            "name": "ordre",
            "label": lang.controle.etape.ordre,
            "type": "number",
            "template": "1.3"
        },
        {
            "name": "nonApplicable",
            "label": lang.controle.nonApplicable,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "template": "2.3"
        },
        {
            "name": "commentaireObligatoire",
            "label": lang.controle.etape.commentObligatoire,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "N",
            "template": "1.4"
        },
        {
            "name": "commentaireObligatoireValeur",
            "label": lang.controle.etape.commentObligatoireValeur,
            "type": "combo",
            "data": "refBooleanNA",
            "search": false,
            "template": "1.5",
            "displayIfValue": {
                "display": true,
                "field": "commentaireObligatoire",
                "value": "Y"
            }
        },
        {
            "name": "bloquantControle",
            "label": lang.controle.etape.bloquant,
            "type": "combo",
            "data": "refBooleanYN",
            "value": "N",
            "search": false,
            "template": "2.1"
        },
        {
            "name": "bloquantControleValeur",
            "label": lang.controle.etape.bloquantValue,
            "type": "combo",
            "data": "refBooleanNA",
            "search": false,
            "template": "2.2",
            "displayIfValue": {
                "display": true,
                "field": "bloquantControle",
                "value": "Y"
            }
        },
        {
            "name": "valorisable",
            "label": lang.controle.etape.valorisable,
            "type": "hidden",
            "data": "refBooleanYN",
            "value": "Y",
            "search": false,
            "template": "2.3"
        },
        {
            "name": "controleParentCode",
            "label": lang.controle.etape.parentId,
            "type": "text",
            "template": "2.4"
        },
        {
            "name": "valeurPere",
            "label": lang.controle.etape.parentValue,
            "type": "combo",
            "search": false,
            "data": "refBooleanNA",
            "template": "2.5",
            "customConditional": "show = (data.controleParentCode != '') ? true: false"
        },
        {
            "name": "niveauAffichage",
            "label": lang.controle.etape.niveau,
            "type": "combo",
            "search": false,
            "data": "refControleNiveau",
            "template": "2.6",
            "customConditional": "show = (data.controleParentCode != '') ? true: false"
        },
        {
            "name": "lienObligatoire",
            "label": lang.controle.etape.lienObligatoire,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "N",
            "template": "3.1"
        },
        {
            "name": "lienObligatoireValeur",
            "label": lang.controle.etape.lienObligatoireValeur,
            "type": "combo",
            "data": "refBooleanNA",
            "search": false,
            "template": "3.2",
            "displayIfValue": {
                "display": true,
                "field": "lienObligatoire",
                "value": "Y"
            }
        }
    ],
    'controleDCVEtape': [
        {
            "name": "idParamEtape",
            "label": lang.controle.etape.etape,
            "type": "combo",
            "search": false,
            "required": true,
            "data": "refControleEtapes",
            "template": "1.5"
        },
        {
            "name": "niveauAffichage",
            "label": lang.controle.etape.niveauDCV,
            "type": "combo",
            "search": false,
            "required": true,
            "data": "refControleNiveauDCV",
            "template": "1.1",
            "change": "getCurrentCmp#paramControle#changeTypologie"
        },
        {
            "name": "actifControle",
            "label": lang.controle.actif,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "template": "1.2",
            "change": "getCurrentCmp#paramControle#changeActif"
        },
        {
            "name": "ordre",
            "label": lang.controle.etape.ordre,
            "type": "number",
            "required": true,
            "template": "1.3",
        },
        {
            "name": "nonApplicable",
            "label": lang.controle.nonApplicable,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "template": "1.4",
            "customConditional": "show = (data.niveauAffichage == '2') ? true : false"
        },
        {
            "name": "controleParentCode",
            "label": lang.controle.etape.parentIdDCV,
            "type": "combo",
            "template": "2.1",
            "data": "controlesPC",
            "change": "getCurrentCmp#paramControle#changeParent",
            "customConditional": "show = (data.niveauAffichage == '2') ? true : false"
        }
    ],
    'modalitePaiement': [
        {
            "name": "nomModalite",
            "label": lang.modalitePaiement.nom_modalite,
            "type": "text",
            "template": "1.1"
        },
        {
            "name": "libelleModalite",
            "label": lang.modalitePaiement.libelle_modalite,
            "type": "text",
            "template": "1.2"
        },
        {
            "name": "entite",
            "label": lang.modalitePaiement.entite,
            "type": "text",
            "template": "1.3"
        }
    ],
    'documentContractuel': [
        {
            "name": "refrence_externe",
            "type": "text",
            "required": false,
            "template": "1.1",
            "label": lang.documentContractuel.reference_externe,
            "tooltip": lang.documentContractuel.reference_externeTooltip
        },
        {
            "name": "libelle",
            "type": "text",
            "required": true,
            "template": "1.2",
            "label": lang.documentContractuel.libelle,
            "change": "getCurrentCmp#documentContractuel#libelleDocumentContractuel"
        },
        {
            "name": "mode_attribution",
            "type": "combo",
            "data": "refModesAttribution",
            "required": true,
            "template": "1.3",
            "label": lang.documentContractuel.mode_attribution
        },
        {
            "name": "type_marche",
            "type": "combo",
            "url": urls['urlGettypeMarches'],
            "propertyCode": "codeFonctionnelTypeMarche",
            "propertyLabel": "libelleLongTypeMarche",
            "required": true,
            "template": "2.1",
            "label": lang.documentContractuel.type_marche
        },
        {
            "name": "nature_marche",
            "type": "combo",
            "url": urls['urlGetNatureMarche'],
            "propertyCode": "codeNatureMarche",
            "propertyLabel": "libelleNatureMarche",
            "required": true,
            "template": "2.2",
            "label": lang.documentContractuel.nature_marche
        },
        {
            "name": "lien_rom",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "type": "text",
            "required": true,
            "template": "3.1",
            "label": lang.templates.lienRome,
            "placeholder": lang.documentContractuel.lien_rom
        },
        {
            "name": "date_signature",
            "type": "date",
            "required": true,
            "template": "4.1",
            "label": lang.documentContractuel.date_signature,
            "limitNow": ">"
        },
        {
            "name": "date_avis_non_objection",
            "type": "date",
            "template": "4.2",
            "label": lang.documentContractuel.date_avis_non_objection,
            "limitNow": ">"
        },
        {
            "type": "teleport",
            "ref": "teleport-select-fournisseur",
            "template": "5.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-fournisseur",
            "template": "6.1"
        },
        {
            "name": "montant_total_document",
            "type": "number",
            "isMontant": true,
            "required": true,
            "template": "8.1",
            "css": "formio-number-short",
            "label": lang.documentContractuel.montant_total_HT,
            "tooltip": lang.documentContractuel.montant_total_HTTooltip,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            },
            "change": "changeMontantDeviseHT"
        },
        {
            "name": "devise",
            "type": "combo",
            "required": true,
            "label": lang.documentContractuel.devise,
            "template": "8.2",
            "value": "EUR",
            "data": "refDevises",
            "change": "changeMontantDeviseHT"
        },
        {
            "type": "teleport",
            "ref": "teleport-contrevaleurHT",
            "template": "9.1"
        },
        {
            "name": "montant_afd",
            "type": "number",
            "required": true,
            "template": "10.1",
            "isMontant": true,
            "label": lang.documentContractuel.montant_part_afd,
            "tooltip": lang.documentContractuel.montant_part_afdTooltip,
            "css": "formio-number-short",
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            },
            "change": "changeMontantDeviseAFD"
        },
        {
            "name": "devise_afd",
            "required": true,
            "type": "combo",
            "label": lang.documentContractuel.devise,
            "template": "10.2",
            "value": "EUR",
            "data": "refDevises",
            "change": "changeMontantDeviseAFD"
        },
        {
            "type": "teleport",
            "ref": "teleport-contrevaleurAFD",
            "template": "11.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-autresDevisesDC",
            "template": "12.1"
        },
        {
            "name": "avance_remboursable",
            "type": "toggle",
            "label": lang.documentContractuel.dc_sur_avance_remboursable,
            "label1": "Oui",
            "label0": "Non",
            "template": "13.1",
            "action": "documentContractuel,checkAvanceRemboursable",
            "displayIfValue": {
                "display": false,
                "field": "show_avance_remboursable",
                "value": ""
            }
        },
        {
            "name": "pourcentage_avance_demarrage",
            "type": "number",
            "template": "14.1",
            "suffix": "%",
            "css": "formio-number-short",
            "label": lang.documentContractuel.pourcentage_avance_demarrage,
            "change": "getCurrentCmp#documentContractuel#updateMontantAvanceDemarrage",
            "displayIfValue": {
                "display": true,
                "field": "avance_remboursable",
                "value": "1"
            }
        },
        {
            "name": "montant_avance_demarrage",
            "type": "number",
            "template": "14.2",
            "read": true,
            "isMontant": true,
            "label": lang.documentContractuel.montant_avancer,
            "css": "formio-number-short",
            "displayIfValue": {
                "display": true,
                "field": "avance_remboursable",
                "value": "1"
            }
        },
        {
            "name": "devise_avance_demarrage",
            "type": "text",
            "template": "14.3",
            "read": true,
            "label": "&nbsp;",
            "css": "formio-number-short",
            "displayIfValue": {
                "display": true,
                "field": "avance_remboursable",
                "value": "1"
            }
        },
        {
            "type": "teleport",
            "ref": "teleport-rubriques-dc",
            "template": "15.1"
        },
        {
            "name": "commentaire",
            "type": "textarea",
            "label": lang.documentContractuel.remarque,
            "template": "16.1",
            "placeholder": lang.documentContractuel.memo_placeholder
        },
        {
            "name": "show_avance_remboursable",
            "type": "hidden",
            "template": "1.1",
            "value": ""
        }
    ],
    'avanceContractuelAFD': [
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "required": true,
            "template": "1.1",
            "label": lang.avanceContractuel.lien_rom,
            "placeholder": lang.saisirROME
        },
        {
            "label": lang.avanceContractuel.numero_concours,
            "name": "numero_concours",
            "type": "combo",
            "required": true,
            "data": "concoursByProjet",
            "change": "getCurrentCmp#avance#changeConcours",
            "template": "2.1"
        },
        {
            "name": "dlvf",
            "type": "date",
            "read": true,
            "template": "2.2",
            "label": lang.avanceContractuel.dlvf
        },
        {
            "name": "numero_avance_contractuel",
            "type": "text",
            "template": "3.1",
            "read": true,
            "label": lang.avanceContractuel.id
        },
        {
            "name": "libelle",
            "type": "text",
            "template": "3.2",
            "required": true,
            "label": lang.avanceContractuel.libelle
        },
        {
            "name": "devise_avance",
            "type": "combo",
            "required": true,
            "template": "4.1",
            "label": lang.avanceContractuel.devise_avance,
            "data": "refDevises"
        },
        {
            "name": "choix_type_avance",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avance_renouvelable,
            "label1": lang.avanceContractuel.tranche,
            "label2": lang.avanceContractuel.caisse_avance,
            "template": "5.1",
            "label": lang.avanceContractuel.choix_type_avance,
            "action": "avance,getTypesAvance"
        },
        {
            "type": "teleport",
            "ref": "teleport-type-avance",
            "template": "6.1"
        },
        {
            "name": "choix_plafond_hidden",
            "type": "hidden",
            "template": "7.1",
            "value": ""
        },
        {
            "name": "choix_plafond",
            "type": "toggle",
            "required": true,
            "label0": "Avec plafond",
            "label1": "Sans plafond",
            "template": "7.1",
            "label": lang.avanceContractuel.choix_plafond,
            "displayIfValue": {
                "display": false,
                "field": "choix_plafond_hidden",
                "value": ""
            },
        },
        {
            "name": "montant_plafond",
            "type": "number",
            "isMontant": true,
            "required": true,
            "template": "8.1",
            "label": lang.avanceContractuel.montant_plafond,
            "displayIfValue": {
                "display": true,
                "field": "choix_plafond",
                "value": "0"
            },
        },
        {
            "name": "pourcentage_initial_dernier_versement",
            "required": true,
            "type": "number",
            "template": "10.1",
            "suffix": "%",
            // "value": 80,
            "label": lang.avanceContractuel.pourcentage_initial_dernier_versement,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            },
        },
        {
            "name": "avenant_hidden",
            "type": "hidden",
            "template": "10.1",
            "value": ""
        },
        {
            "name": "pourcentage_final_dernier_versement",
            "type": "number",
            "template": "10.2",
            "suffix": "%",
            "label": lang.avanceContractuel.pourcentage_final_dernier_versement,
            "read": true,
            "displayIfValue": {
                "display": true,
                "field": "avenant_hidden",
                "value": "1"
            },
        },
        {
            "name": "date_ljf_initial",
            "required": true,
            "type": "date",
            "template": "12.1",
            "label": lang.avanceContractuel.dljf,
            "limitNow": "<"
        },
        {
            "name": "date_ljf_final",
            "type": "date",
            "template": "12.2",
            "read": true,
            "label": lang.avanceContractuel.dljf_prorogee,
            "displayIfValue": {
                "display": true,
                "field": "avenant_hidden",
                "value": "1"
            },
        },
        {
            "name": "date_limite_utilisation_fond",
            "required": true,
            "type": "date",
            "template": "11.1",
            "label": lang.avanceContractuel.dluf,
            "limitNow": "<"
        },
        {
            "name": "date_reception_rapport_final",
            "type": "date",
            "template": "13.1",
            "label": lang.avanceContractuel.date_reception_rapport_final,
            "limitNow": ">"
        },
        {
            "name": "lien_rom_rapport_final",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "template": "14.1",
            "placeholder": lang.saisirROME,
            "label": lang.avanceContractuel.lien_rom_rapport_final,
            "helper": lang.avanceContractuel.lien_rom_rapport_finalTooltip,
            "customValidate": "valid = ((!app.getCurrentCmp('avance').verifDateReceptionFinal() && !app.isEmpty(input)) || (app.getCurrentCmp('avance').verifDateReceptionFinal())) ? true : lang.avanceContractuel.lienAuditMandatory",
        },
        {
            "type": "teleport",
            "ref": "teleport-justificatifs-avance",
            "template": "15.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "16.1",
            "label": lang.avanceContractuel.remarque,
            "max": 6000
        }
    ],
    'avanceContractuelAFDFinal': [
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "required": true,
            "template": "1.1",
            "label": lang.avanceContractuel.lien_rom,
            "placeholder": lang.saisirROME
        },
        {
            "label": lang.avanceContractuel.numero_concours,
            "name": "numero_concours",
            "type": "combo",
            "required": true,
            "data": "concoursByProjet",
            "change": "getCurrentCmp#avance#changeConcours",
            "template": "2.1"
        },
        {
            "name": "dlvf",
            "type": "date",
            "read": true,
            "template": "2.2",
            "label": lang.avanceContractuel.dlvf
        },
        {
            "name": "numero_avance_contractuel",
            "type": "text",
            "template": "3.1",
            "read": true,
            "label": lang.avanceContractuel.id
        },
        {
            "name": "libelle",
            "type": "text",
            "template": "3.2",
            "required": true,
            "label": lang.avanceContractuel.libelle
        },
        {
            "name": "devise_avance",
            "type": "combo",
            "required": true,
            "template": "4.1",
            "label": lang.avanceContractuel.devise_avance,
            "data": "refDevises"
        },
        {
            "name": "choix_type_avance",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avance_renouvelable,
            "label1": lang.avanceContractuel.tranche,
            "label2": lang.avanceContractuel.caisse_avance,
            "template": "5.1",
            "label": lang.avanceContractuel.choix_type_avance,
            "action": "avance,getTypesAvance"
        },
        {
            "name": "montant_total",
            "template": "5.2",
            "label": lang.avanceContractuel.total,
            "type": "text",
            "read": true
        },
        {
            "type": "teleport",
            "ref": "teleport-type-avance",
            "template": "6.1"
        },

        {
            "name": "choix_plafond_hidden",
            "type": "hidden",
            "template": "7.1",
            "value": ""
        },
        {
            "name": "choix_plafond",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avec_plafond,
            "label1": lang.avanceContractuel.sans_plafond,
            "template": "7.1",
            "label": lang.avanceContractuel.choix_plafond,
            "displayIfValue": {
                "display": false,
                "field": "choix_plafond_hidden",
                "value": ""
            },
        },
        {
            "name": "montant_plafond",
            "type": "number",
            "isMontant": true,
            "required": true,
            "template": "8.1",
            "label": lang.avanceContractuel.montant_plafond,
            "displayIfValue": {
                "display": true,
                "field": "choix_plafond",
                "value": "0"
            },
        },
        {
            "name": "pourcentage_initial_dernier_versement",
            "required": true,
            "read": true,
            "type": "number",
            "template": "10.1",
            "suffix": "%",
            // "value": 80,
            "label": lang.avanceContractuel.pourcentage_initial_dernier_versement
        },
        {
            "name": "avenant_hidden",
            "type": "hidden",
            "template": "10.1",
            "value": ""
        },
        {
            "name": "pourcentage_final_dernier_versement",
            "type": "number",
            "template": "10.2",
            "suffix": "%",
            "label": lang.avanceContractuel.pourcentage_final_dernier_versement,
            "read": true,
            "displayIfValue": {
                "display": false,
                "field": "pourcentage_final_dernier_versement",
                "value": ""
            },
        },
        {
            "name": "date_ljf_initial",
            "required": true,
            "read": true,
            "type": "date",
            "template": "12.1",
            "label": lang.avanceContractuel.date_ljf_initial
        },
        {
            "name": "date_ljf_final",
            "type": "date",
            "template": "12.2",
            "read": true,
            "label": lang.avanceContractuel.date_ljf_final,
            "displayIfValue": {
                "display": false,
                "field": "date_ljf_final",
                "value": ""
            },
        },
        {
            "name": "date_limite_utilisation_fond",
            "required": true,
            "read": true,
            "type": "date",
            "template": "11.1",
            "label": lang.avanceContractuel.dluf
        },
        {
            "name": "date_limite_utilisation_fond_final",
            "type": "date",
            "template": "11.2",
            "read": true,
            "label": lang.avanceContractuel.dluf_finale,
            "displayIfValue": {
                "display": false,
                "field": "date_limite_utilisation_fond_final",
                "value": ""
            },
        },
        {
            "name": "date_reception_rapport_final",
            "type": "date",
            "template": "13.1",
            "label": lang.avanceContractuel.date_reception_rapport_final,
        },
        {
            "name": "lien_rom_rapport_final",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "template": "14.1",
            "placeholder": lang.saisirROME,
            "label": lang.avanceContractuel.lien_rom_rapport_final,
            "helper": lang.avanceContractuel.lien_rom_rapport_finalTooltip,
            "customValidate": "valid = ((!app.getCurrentCmp('avance').verifDateReceptionFinal() && !app.isEmpty(input)) || (app.getCurrentCmp('avance').verifDateReceptionFinal())) ? true : lang.avanceContractuel.lienAuditMandatory",
        },
        {
            "type": "teleport",
            "ref": "teleport-justificatifs-avance",
            "template": "15.1"
        },
        {
            "name": "montant_verse_total",
            "template": "16.1",
            "label": lang.avanceContractuel.montant_verse_total,
            "type": "text",
            "read": true
        },
        {
            "name": "montant_justifie_total",
            "template": "16.2",
            "label": lang.avanceContractuel.montant_justifie_total,
            "type": "text",
            "read": true
        },
        {
            "name": "raj_reste_justifier_total",
            "template": "16.3",
            "label": lang.avanceContractuel.reste_a_justifier,
            "type": "text",
            "read": true
        },
        {
            "name": "raj_decaisser_dossier",
            "template": "16.4",
            "label": lang.avanceContractuel.reste_pour_decaisser,
            "type": "text",
            "read": true
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "17.1",
            "label": lang.avanceContractuel.remarque,
            "max": 6000
        }
    ],
    'avanceContractuelPROPARCO': [
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "required": true,
            "template": "1.1",
            "label": lang.avanceContractuel.lien_rom,
            "placeholder": lang.saisirROME
        },
        {
            "label": lang.avanceContractuel.numero_concours,
            "name": "numero_concours",
            "read": false,
            "type": "combo",
            "required": true,
            "change": "getCurrentCmp#avance#changeConcours",
            "data": "concoursByProjet",
            "template": "2.1"
        },
        {
            "name": "dlvf",
            "type": "date",
            "read": true,
            "template": "2.2",
            "label": lang.avanceContractuel.dlvf
        },
        {
            "name": "numero_avance_contractuel",
            "type": "text",
            "template": "3.1",
            "read": true,
            "label": lang.avanceContractuel.id
        },
        {
            "name": "libelle",
            "type": "text",
            "template": "3.2",
            "required": true,
            "label": lang.avanceContractuel.libelle
        },
        {
            "name": "devise_avance",
            "type": "combo",
            "required": true,
            "template": "4.1",
            "label": lang.avanceContractuel.devise_avance,
            "data": "refDevises"
        },
        {
            "name": "choix_type_avance",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avance_renouvelable,
            "label1": lang.avanceContractuel.tranche,
            "label2": lang.avanceContractuel.caisse_avance,
            "template": "5.1",
            "label": lang.avanceContractuel.choix_type_avance,
            "action": "avance,getTypesAvance"
        },
        {
            "type": "teleport",
            "ref": "teleport-type-avance",
            "template": "6.1"
        },
        {
            "name": "choix_plafond_hidden",
            "type": "hidden",
            "template": "7.1",
            "value": ""
        },
        {
            "name": "choix_plafond",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avec_plafond,
            "label1": lang.avanceContractuel.sans_plafond,
            "template": "7.1",
            "label": lang.avanceContractuel.choix_plafond,
            "displayIfValue": {
                "display": false,
                "field": "choix_plafond_hidden",
                "value": ""
            },
        },
        {
            "name": "montant_plafond",
            "type": "number",
            "required": true,
            "isMontant": true,
            "template": "8.1",
            "label": lang.avanceContractuel.montant_plafond,
            "displayIfValue": {
                "display": true,
                "field": "choix_plafond",
                "value": "0"
            },
        },
        {
            "name": "pourcentage_initial_dernier_versement",
            "required": true,
            "type": "number",
            "template": "10.1",
            "suffix": "%",
            // "value": 80,
            "label": lang.avanceContractuel.pourcentage_initial_dernier_versement,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            },
        },
        {
            "name": "avenant_hidden",
            "type": "hidden",
            "template": "10.1",
            "value": ""
        },
        {
            "name": "date_ljf_initial",
            "required": true,
            "type": "date",
            "template": "12.1",
            "label": lang.avanceContractuel.date_ljf_initial,
            "limitNow": "<"
        },
        {
            "name": "date_limite_utilisation_fond",
            "required": true,
            "type": "date",
            "template": "11.1",
            "label": lang.avanceContractuel.dluf_initiale,
            "limitNow": "<"
        },
        {
            "type": "teleport",
            "ref": "teleport-audit",
            "template": "13.1"
        },
        {
            "name": "date_reception_rapport_final",
            "type": "date",
            "template": "14.1",
            "label": lang.avanceContractuel.date_reception_rapport_final,
            "tooltip": lang.avanceContractuel.date_reception_rapport_finalTooltip,
            "limitNow": ">"
        },
        {
            "name": "lien_rom_rapport_final",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "template": "14.2",
            "label": lang.avanceContractuel.lien_rom_rapport_final,
            "tooltip": lang.avanceContractuel.lien_rom_rapport_finalTooltip,
            "placeholder": lang.saisirROME,
            "customValidate": "valid = ((!app.getCurrentCmp('avance').verifDateReceptionFinal() && !app.isEmpty(input)) || (app.getCurrentCmp('avance').verifDateReceptionFinal())) ? true : lang.avanceContractuel.lienAuditMandatory",
        },
        {
            "type": "teleport",
            "ref": "teleport-justificatifs-avance",
            "template": "15.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "16.1",
            "label": lang.avanceContractuel.remarque
        }
    ],
    'avanceContractuelPROPARCOFinal': [
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "required": true,
            "template": "1.1",
            "label": lang.avanceContractuel.lien_rom,
            "placeholder": lang.saisirROME
        },
        {
            "label": lang.avanceContractuel.numero_concours,
            "name": "numero_concours",
            "read": false,
            "type": "combo",
            "required": true,
            "change": "getCurrentCmp#avance#changeConcours",
            "data": "concoursByProjet",
            "template": "2.1"
        },
        {
            "name": "dlvf",
            "type": "date",
            "read": true,
            "template": "2.2",
            "label": lang.avanceContractuel.dlvf
        },
        {
            "name": "numero_avance_contractuel",
            "type": "text",
            "template": "3.1",
            "read": true,
            "label": lang.avanceContractuel.id
        },
        {
            "name": "libelle",
            "type": "text",
            "template": "3.2",
            "required": true,
            "label": lang.avanceContractuel.libelle
        },
        {
            "name": "devise_avance",
            "type": "combo",
            "required": true,
            "template": "4.1",
            "label": lang.avanceContractuel.devise_avance,
            "data": "refDevises"
        },
        {
            "name": "choix_type_avance",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avance_renouvelable,
            "label1": lang.avanceContractuel.tranche,
            "label2": lang.avanceContractuel.caisse_avance,
            "template": "5.1",
            "label": lang.avanceContractuel.choix_type_avance,
            "action": "avance,getTypesAvance"
        },
        {
            "type": "teleport",
            "ref": "teleport-type-avance",
            "template": "6.1"
        },
        {
            "name": "choix_plafond_hidden",
            "type": "hidden",
            "template": "7.1",
            "value": ""
        },
        {
            "name": "choix_plafond",
            "type": "toggle",
            "required": true,
            "label0": lang.avanceContractuel.avec_plafond,
            "label1": lang.avanceContractuel.sans_plafond,
            "template": "7.1",
            "label": lang.avanceContractuel.choix_plafond,
            "displayIfValue": {
                "display": false,
                "field": "choix_plafond_hidden",
                "value": ""
            },
        },
        {
            "name": "montant_plafond",
            "type": "number",
            "required": true,
            "isMontant": true,
            "template": "8.1",
            "label": lang.avanceContractuel.montant_plafond,
            "displayIfValue": {
                "display": true,
                "field": "choix_plafond",
                "value": "0"
            },
        },
        {
            "name": "pourcentage_initial_dernier_versement",
            "required": true,
            "type": "number",
            "template": "10.1",
            "suffix": "%",
            // "value": 80,
            "label": lang.avanceContractuel.pourcentage_initial_dernier_versement,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            },
        },
        {
            "name": "avenant_hidden",
            "type": "hidden",
            "template": "10.1",
            "value": ""
        },
        {
            "name": "date_ljf_initial",
            "required": true,
            "type": "date",
            "template": "12.1",
            "label": lang.avanceContractuel.date_ljf_initial,
            "limitNow": "<"
        },
        {
            "name": "date_limite_utilisation_fond",
            "required": true,
            "read": true,
            "type": "date",
            "template": "11.1",
            "label": lang.avanceContractuel.dluf_initiale,
            "limitNow": "<"
        },
        {
            "name": "date_limite_utilisation_fond_final",
            "type": "date",
            "template": "11.2",
            "label": lang.avanceContractuel.dluf_prorogee
            // "displayIfValue": {
            //     "display": false,
            //     "field": "date_limite_utilisation_fond_final",
            //     "value": ""
            // },
        },
        {
            "type": "teleport",
            "ref": "teleport-audit",
            "template": "13.1"
        },
        {
            "name": "date_reception_rapport_final",
            "type": "date",
            "template": "14.1",
            "label": lang.avanceContractuel.date_reception_rapport_final,
            "tooltip": lang.avanceContractuel.date_reception_rapport_finalTooltip,
            "limitNow": ">"
        },
        {
            "name": "lien_rom_rapport_final",
            "type": "text",
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "template": "14.2",
            "label": lang.avanceContractuel.lien_rom_rapport_final,
            "tooltip": lang.avanceContractuel.lien_rom_rapport_finalTooltip,
            "placeholder": lang.saisirROME,
            "customValidate": "valid = ((!app.getCurrentCmp('avance').verifDateReceptionFinal() && !app.isEmpty(input)) || (app.getCurrentCmp('avance').verifDateReceptionFinal())) ? true : lang.avanceContractuel.lienAuditMandatory",
        },
        {
            "type": "teleport",
            "ref": "teleport-justificatifs-avance",
            "template": "15.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "16.1",
            "label": lang.avanceContractuel.remarque
        }
    ],
    'avenant': [
        {
            "name": "pourcentage_initial_dernier_versement",
            "type": "number",
            "template": "2.1",
            "suffix": "%",
            "required": true,
            "read": true,
            "label": lang.avenant.pourcentage_initial_dernier_versement
        },
        {
            "name": "pourcentage_final_dernier_versement",
            "type": "number",
            "suffix": "%",
            "template": "2.2",
            "label": lang.avenant.pourcentage_final_dernier_versement,
        },
        {
            "name": "date_limite_utilisation_fond",
            "type": "date",
            "read": true,
            "required": true,
            "template": "3.1",
            "label": lang.avenant.dluf_initiale
        },
        {
            "name": "date_luf_final",
            "type": "date",
            "template": "3.2",
            "label": lang.avenant.dluf_prorogee,
            "limitNow": "<"
        },
        {
            "name": "date_ljf_initial",
            "type": "date",
            "read": true,
            "required": true,
            "template": "4.1",
            "label": lang.avenant.dljf_initiale
        },
        {
            "name": "date_ljf_final",
            "type": "date",
            "template": "4.2",
            "label": lang.avenant.dljf_finale,
            "limitNow": "<"
        }
    ],
    'notification': [
        {
            "name": "show_destinataires",
            "type": "hidden",
            "template": "1.1",
            "value": ""
        },
        {
            "name": "destinataire",
            "type": "combo",
            "required": true,
            "data": "destinataires",
            "template": "1.1",
            "label": lang.notification.destinataire,
            "change": "isMemberProjetProparco",
            "displayIfValue": {
                "display": false,
                "field": "show_destinataires",
                "value": ""
            }
        },
        {
            "name": "corpNotification",
            "type": "textarea",
            "template": "2.1",
            "max": 500,
            "label": lang.notification.commentaire,
            "displayIfValue": {
                "display": false,
                "field": "show_destinataires",
                "value": ""
            }
        },
        {
            "name": "corpNotification",
            "type": "textarea",
            "template": "2.1",
            "max": 500,
            "required": true,
            "label": lang.notification.commentaire,
            "displayIfValue": {
                "display": true,
                "field": "show_destinataires",
                "value": ""
            }
        }
    ],
    'rubrique': [
        {
            "name": "numero_rubrique",
            "type": "number",
            "template": "1.1",
            "read": true,
            "label": lang.rubrique.id
        },
        {
            "name": "libelle_rubrique",
            "type": "text",
            "template": "1.2",
            "required": true,
            "label": lang.rubrique.libelle
        },
        {
            "name": "montant_rubrique",
            "type": "number",
            "isMontant": true,
            "template": "2.1",
            "required": true,
            "css": "formio-number",
            "label": lang.rubrique.montantRubrique,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            }
        },
        {
            "name": "devise_rubrique",
            "type": "combo",
            "template": "2.2",
            "required": true,
            "label": lang.rubrique.devise,
            "data": "devisesRubriques"
        },
        {
            "type": "teleport",
            "ref": "teleport-autresDevisesRubrique",
            "template": "3.1"
        },
        {
            "name": "show_avance",
            "type": "hidden",
            "template": "4.1",
            "value": ""
        },
        {
            "name": "pourcentage_avance",
            "type": "number",
            "template": "4.1",
            "suffix": "%",
            "css": "formio-number-short",
            "label": lang.rubrique.pourcentageAvanceRembourse,
            "change": "getCurrentCmp#documentContractuel#updateMontantAvanceRubrique",
            "displayIfValue": {
                "display": true,
                "field": "show_avance",
                "value": "1"
            }
        },
        {
            "name": "montant_avance",
            "type": "number",
            "template": "4.2",
            "read": true,
            "isMontant": true,
            "label": lang.rubrique.mntRemboursement,
            "css": "formio-number-short",
            "displayIfValue": {
                "display": true,
                "field": "show_avance",
                "value": "1"
            }
        },
        {
            "name": "devise_avance",
            "type": "text",
            "template": "4.3",
            "read": true,
            "label": "&nbsp;",
            "displayIfValue": {
                "display": true,
                "field": "show_avance",
                "value": "1"
            }
        }
    ],
    'rubriqueVentilated': [
        {
            "name": "numero_rubrique",
            "type": "number",
            "template": "1.1",
            "read": true,
            "label": lang.rubrique.id
        },
        {
            "name": "libelle_rubrique",
            "type": "text",
            "template": "1.2",
            "read": false,
            "required": true,
            "label": lang.rubrique.libelle
        },
        {
            "name": "montant_rubrique",
            "type": "number",
            "isMontant": true,
            "template": "2.1",
            "read": true,
            "required": true,
            "css": "formio-number",
            "label": lang.rubrique.montantRubrique,
            "validIfValue": {
                "operator": ">",
                "value": "0",
                "error": lang.errorValueEqualsZero,
            }
        },
        {
            "name": "devise_rubrique",
            "type": "combo",
            "template": "2.2",
            "read": true,
            "label": lang.rubrique.devise,
            "data": "devisesRubriques"
        },
        {
            "type": "teleport",
            "ref": "teleport-autresDevisesRubrique",
            "template": "3.1"
        }
    ],
    "justificatifReglement": [
        {
            "name": "reference",
            "type": "text",
            "template": "1.1",
            "required": true,
            "label": lang.justificatifReglement.reference
        },
        {
            "name": "type",
            "type": "combo",
            "required": true,
            "template": "1.2",
            "label": lang.justificatifReglement.type,
            "data": "refTypesJustificatif"
        },
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "required": true,
            "suffix": "<i class='fas fa-link'></i>",
            "template": "2.1",
            "label": lang.justificatifReglement.lien_rom
        },
        {
            "name": "date_emission",
            "type": "date",
            "required": true,
            "template": "3.1",
            "label": lang.justificatifReglement.date_emission,
            "limitNow": ">"
        },
        {
            "name": "montant_finance_afd",
            "type": "number",
            "required": true,
            "isMontant": true,
            "validIfValue": {
                "operator": ">",
                "value": 0,
                "error": lang.errorMontantSupZero,
            },
            "template": "4.1",
            "label": lang.justificatifReglement.montant_finance_afd
        },
        {
            "name": "devise_equivalente",
            "type": "hidden",
            "template": "6.1",
            "value": ""
        },
        {
            "name": "devise",
            "type": "text",
            "template": "4.2",
            "label": lang.justificatifReglement.devise,
            "required": true,
            "read": true,
            "displayIfValue": {
                "display": true,
                "field": "devise_equivalente",
                "value": "1"
            }
        },// lidia
        {
            "name": "devise",
            "type": "combo",
            "label": lang.justificatifReglement.devise,
            "data": "refDevises",
            "template": "4.2",
            "required": true,
            "displayIfValue": {
                "display": true,
                "field": "devise_equivalente",
                "value": "0"
            }
        },
        {
            "name": "emetteurDC_show",
            "type": "hidden",
            "template":  "4.2",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-select-emetteur-justificatif",
            "template": "5.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-emetteur-justificatif",
            "template": "6.1"
        },
        {
            "name": "show_dc",
            "type": "hidden",
            "template": "7.1",
            "value": ""
        },
        {
            "type": "teleport",
            "ref": "teleport-document_contractuel",
            "template": "7.1"
        },
        {
            "name": "id_document_contractuel",
            "type": "hidden",
            "template": "10.1",
        },
        {
            "type": "teleport",
            "ref": "teleport-rubriquesJust",
            "template": "8.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "9.1",
            "label": lang.justificatifReglement.remarque
        }
    ],
    'typeAnomalie': [
        {
            "name": "codeAnomalie",
            "label": lang.paramAnomalies.codeAnomalie,
            "type": "text",
            "required": true,
            "customValidate": "valid = (app.getCurrentCmp('paramAnomalie').anomalieNotExistInBdd(input)) ? ((app.isValidLengthCodeAnomalie(input)) ? true : lang.errors.anomalie.errorLengthCodeAnomalie ) : lang.errors.anomalie.errorAnomalieExist",
            "template": "1.1"
        },
        {
            "name": "libelleAnomalie",
            "label": lang.paramAnomalies.libelleAnomalie,
            "type": "textarea",
            "required": true,
            "template": "2.1"
        },
        {
            "name": "graviteAnomalie",
            "label": lang.paramAnomalies.graviteAnomalie,
            "type": "combo",
            "required": true,
            "data": "refGraviteAnomalie",
            "value": "faible",
            "search": false,
            "template": "1.3"
        },
        {
            "name": "ordre",
            "label": lang.paramAnomalies.ordre,
            "type": "number",
            "value": "0",
            "template": "1.4"
        },
        {
            "name": "regularisable",
            "label": lang.paramAnomalies.regularisable,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "required": true,
            "template": "1.2"
        },
        {
            "name": "statutActif",
            "label": lang.paramAnomalies.statutActif,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "template": "1.5"
        }
    ],
    'theme': [
        {
            "name": "codeTheme",
            "label": lang.paramThemes.codeTheme,
            "type": "text",
            "required": true,
            "template": "1.1"
        },
        {
            "name": "statutActif",
            "label": lang.paramThemes.statutActif,
            "type": "combo",
            "data": "refBooleanYN",
            "search": false,
            "value": "Y",
            "template": "1.2"
        },
        {
            "name": "entite",
            "label": lang.paramThemes.entite,
            "type": "combo",
            "data": "refControleEntite",
            "search": false,
            "template": "1.3"
        },
        {
            "name": "niveau",
            "label": lang.paramThemes.niveau,
            "type": "combo",
            "data": "refControlePerimetre",
            "search": false,
            "template": "1.4"
        },
        {
            "name": "libelleTheme",
            "label": lang.paramThemes.libelleTheme,
            "type": "text",
            "required": true,
            "template": "2.1"
        }
    ],
    'typeUser': [
        {
            "name": "login",
            "label": lang.users.login,
            "type": "text",
            "read": true,
            "template": "1.1"
        },
        {
            "name": "civilite",
            "label": lang.users.civilite,
            "type": "combo",
            "data": "refCivilite",
            "required": true,
            "search": false,
            "template": "1.2"
        },
        {
            "name": "nom",
            "label": lang.users.nom,
            "type": "text",
            "required": true,
            "template": "1.3"
        },
        {
            "name": "prenom",
            "label": lang.users.prenom,
            "type": "text",
            "required": true,
            "template": "1.4"
        },
        {
            "name": "mail",
            "label": lang.users.mail,
            // "type": "email",
            "type": "text",
            "suffix": "<i class='fas fa-at'></i>",
            "required": true,
            "template": "2.1",
            "customValidate": "valid = (app.controlMailFormat(input) && !app.isEmpty(input)) ? true : lang.invalidEmailForm"
        },
        {
            "name": "actif",
            "label": lang.users.actif,
            "type": "combo",
            "data": "refBooleanYN",
            "read": true,
            "template": "2.2"
        },
        {
            "type": "teleport",
            "ref": "teleportCheckBox",
            "css": "mt-5",
            "template": "2.5"
        },
        {
            "name": "creationDateNewV",
            "type": "date",
            "template": "2.3",
            "read": true,
            "label": lang.users.creationDate,
        },
        {
            "name": "updateDateNewV",
            "type": "date",
            "template": "2.4",
            "read": true,
            "label": lang.users.updateDate,
        }
    ],
    'typeAvance': [
        {
            "name": "numero_type_avance",
            "label": lang.avance.id,
            "type": "number",
            "read": true,
            "template": "1.1"
        },
        {
            "name": "libelle",
            "label": lang.avance.label,
            "type": "text",
            "template": "1.2",
            "required": true
        },
        {
            "name": "montant",
            "label": lang.avance.amount,
            "type": "number",
            "isMontant": true,
            "required": true,
            "template": "2.1",
            "validIfValue": {
                "operator": ">",
                "value": 0,
                "error": lang.errorMontantSupZero,
            }
        },
        {
            "name": "devise",
            "label": lang.avance.currency,
            "type": "text",
            "read": true,
            "template": "2.2"
        }
    ],
    'pays': [
        {
            "name": "codePays",
            "label": lang.pays.code,
            "read": true,
            "template": "1.1"
        },
        {
            "name": "codeIsoPays",
            "label": lang.pays.codeIsoPays,
            "read": true,
            "template": "1.2"
        },
        {
            "name": "libLongPays",
            "label": lang.pays.libelle,
            "read": true,
            "template": "2.1"
        },
        {
            "name": "idDevise",
            "type": "combo",
            "read": true,
            "label": lang.pays.idDevise,
            "data": "refDevises",
            "template": "3.1"
        }
    ],
    'projets': [
        {
            "name": "numeroProjet",
            "type": "text",
            "label": lang.projets.numeroProjetFormio,
            "read": true,
            "template": "1.1"
        },
        {
            "name": "paysGestion",
            "type": "combo",
            "label": lang.projets.renderPaysRealisation,
            "value": "",
            "read": true,
            "template": "1.2"
        },
        {
            "name": "libelleLong",
            "type": "text",
            "label": lang.projets.libelle,
            "value": "",
            "read": true,
            "template": "2.1"
        },
        {
            "name": "montantInitial",
            "type": "number",
            "label": lang.projets.montantInitial,
            "read": true,
            "template": "3.1"
        },
        {
            "name": "montantFinal",
            "type": "number",
            "label": lang.projets.montantFinal,
            "read": true,
            "template": "3.2"
        },
        {
            "name": "idDivisionProparco",
            "type": "text",
            "label": lang.projets.idDivisionProparco,
            "value": "",
            "read": true,
            "template": "3.3"
        },
        {
            "name": "syndication",
            "label": lang.projets.syndication,
            "type": "combo",
            "data": "refBooleanYN",
            "read": true,
            "template": "4.1"
        },
        {
            "name": "leadFollow",
            "type": "text",
            "label": lang.projets.leadFollow,
            "value": "",
            "read": true,
            "template": "4.2"
        },
        {
            "name": "cofinancement",
            "label": lang.projets.cofinancement,
            "type": "combo",
            "data": "refBooleanYN",
            "read": true,
            "template": "4.3"
        },
        {
            "name": "codeAgence",
            "type": "text",
            "label": lang.projets.codeAgence,
            "read": true,
            "template": "4.4"
        },
    ],
    'modalitesPaiement': [
        {
            "name": "nomModalite",
            "label": lang.modalitesPaiement.nomModalite,
            "read": true,
            "template": "1.1"
        },
        {
            "name": "libelleModalite",
            "label": lang.modalitesPaiement.libelleModalite,
            "read": true,
            "template": "2.1"
        },
        {
            "name": "entite",
            "label": lang.modalitesPaiement.entite,
            "type": "text",
            "read": true,
            "value": "",
            "template": "1.2"
        }
    ],
    'concours': [
        {
            "name": "numeroConcours",
            "type": "text",
            "label": lang.concoursFormio.numero_concours,
            "read": true,
            "template": "1.1"
        },
        {
            "name": "numeroProjet",
            "type": "text",
            "label": lang.concoursFormio.numero_projet,
            "read": true,
            "template": "1.2"
        },
        {
            "name": "numeroConvention",
            "type": "text",
            "label": lang.concoursFormio.numero_convention,
            "read": true,
            "template": "1.3"
        },
        {
            "name": "dateEcheance",
            "type": "date",
            "label": lang.concoursFormio.date_echeance,
            "value": "",
            "read": true,
            "template": "2.1"
        },
        {
            "name": "datePremiereEcheanceCapital",
            "type": "date",
            "label": lang.concoursFormio.date_premiere_echeance,
            "value": "",
            "read": true,
            "template": "2.2"
        },
        {
            "name": "dateDerniereEcheanceCapital",
            "type": "date",
            "label": lang.concoursFormio.date_derniere_echeance,
            "value": "",
            "read": true,
            "template": "2.3"
        },
        {
            "name": "typeTauxPrevisionnel",
            "type": "text",
            "label": lang.concoursFormio.type_taux_previsionnel,
            "read": true,
            "template": "3.1"
        },
        {
            "name": "referencePeriodiciteTaux",
            "type": "text",
            "label": lang.concoursFormio.reference_periodicite_taux,
            "read": true,
            "template": "3.2"
        },
        {
            "name": "margeTauxReference",
            "type": "number",
            "label": lang.concoursFormio.marge_taux_reference,
            "read": true,
            "template": "3.3"
        },
        {
            "name": "dlvfInitiale",
            "type": "date",
            "label": lang.concoursFormio.dlvf_initiale,
            "value": "",
            "read": true,
            "template": "4.1"
        },
        {
            "name": "dlvfFinale",
            "type": "date",
            "label": lang.concoursFormio.dlvf_finale,
            "value": "",
            "read": true,
            "template": "4.2"
        },
        {
            "name": "montantFinal",
            "type": "number",
            "label": lang.concoursFormio.montant_initial,
            "read": true,
            "template": "5.1"
        },
        {
            "name": "montantSousParticipant",
            "type": "number",
            "label": lang.concoursFormio.montant_sous_participant,
            "read": true,
            "template": "5.2"
        },
        {
            "name": "idOperation",
            "type": "text",
            "label": lang.concoursFormio.code_operation,
            "read": true,
            "template": "6.1"
        },
        {
            "name": "libOperation",
            "type": "text",
            "label": lang.concoursFormio.libelle_operation,
            "read": true,
            "template": "6.2"
        },
        {
            "name": "rav",
            "type": "number",
            "label": lang.concoursFormio.rav_concours,
            "read": true,
            "template": "6.3"
        },
        {
            "name": "natureRisque",
            "type": "text",
            "label": lang.concoursFormio.nature_risque,
            "read": true,
            "template": "6.4"
        }
    ],
    "justificatifAvanceAFD": [
        {
            "name": "reference",
            "type": "text",
            "template": "1.1",
            "required": true,
            "label": lang.justificatifAvance.reference
        },
        {
            "name": "type",
            "type": "combo",
            "required": true,
            "template": "1.2",
            "label": lang.justificatifAvance.type,
            "data": "refTypesJustificatif"
        },
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "required": true,
            "suffix": "<i class='fas fa-link'></i>",
            "template": "2.1",
            "label": lang.justificatifAvance.lien_rome
        },
        {
            "name": "date_emission",
            "type": "date",
            "required": true,
            "template": "3.1",
            "label": lang.justificatifAvance.date_emission,
            "limitNow": ">"
        },
        {
            "name": "montant_finance_afd",
            "type": "number",
            "required": true,
            "isMontant": true,
            "validIfValue": {
                "operator": ">",
                "value": 0,
                "error": lang.errorMontantSupZero,
            },
            "template": "4.1",
            "label": lang.justificatifAvance.montant_finance_afd
        },
        {
            "name": "devise",
            "type": "text",
            "template": "4.2",
            "label": lang.justificatifAvance.devise,
            "read": true
        },
        {
            "type": "teleport",
            "ref": "teleport-select-emetteur-justificatif-avance",
            "template": "5.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-emetteur-justificatif-avance",
            "template": "6.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "7.1",
            "label": lang.justificatifAvance.remarque
        }
    ],
    "justificatifAvancePROPARCO": [
        {
            "name": "numero_justificatif",
            "type": "text",
            "read": true,
            "template": "1.1",
            "label": lang.justificatifAvance.numero
        },
        {
            "name": "reference",
            "type": "text",
            "template": "1.2",
            "required": true,
            "label": lang.justificatifAvance.reference
        },
        {
            "name": "type",
            "type": "combo",
            "template": "1.3",
            "required": true,
            "label": lang.justificatifAvance.type,
            "data": "refTypesJustificatif"
        },
        {
            "name": "lien_rom",
            "type": "text",
            "action": "link",
            "required": true,
            "suffix": "<i class='fas fa-link'></i>",
            "template": "2.1",
            "label": lang.justificatifAvance.lien_rome
        },
        {
            "name": "date_emission",
            "type": "date",
            "required": true,
            "template": "3.1",
            "label": lang.justificatifAvance.date_emission,
            "limitNow": ">"
        },
        {
            "name": "montant_justifie",
            "type": "number",
            "required": true,
            "isMontant": true,
            "validIfValue": {
                "operator": ">",
                "value": 0,
                "error": lang.errorMontantSupZero,
            },
            "template": "4.1",
            "label": lang.justificatifAvance.montant_justifie
        },
        {
            "name": "devise",
            "type": "text",
            "template": "4.2",
            "label": lang.justificatifAvance.devise,
            "read": true
        },
        {
            "type": "teleport",
            "ref": "teleport-select-emetteur-justificatif-avance",
            "template": "5.1"
        },
        {
            "type": "teleport",
            "ref": "teleport-emetteur-justificatif-avance",
            "template": "6.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "7.1",
            "label": lang.justificatifAvance.remarque
        }
    ],
    'avanceAudit': [
        {
            "name": "date_reception_rapport_annuel",
            "type": "date",
            "template": "1.1",
            "label": lang.avanceContractuel.date_reception_rapport_annuel
        },
        {
            "name": "lien_rom_audit",
            "type": "text",
            "template": "1.2",
            "label": lang.lienRome,
            "placeholder": lang.saisirROME,
            "action": "link",
            "suffix": "<i class='fas fa-link'></i>",
            "customValidate": "valid = ((app.verifAuditAvance(data.date_reception_rapport_annuel, input)) ? true : lang.avanceContractuel.lienAuditMandatory)"
        }
    ],
    'managersDCV': [
        {
            "name": "identite_managers",
            "type": "combo",
            "template": "1.1",
            "label": lang.controleursDCV.controleurs,
            "data": "managers",
            "required": true
        }
    ],
    'filtresDDR': [
        {
            "name": "entite_ddr",
            "type": "combo",
            "template": "1.1",
            "label": lang.filtresReporting.societe,
            "data": "refSocietesLight"
        },
        {
            "name": "pays_ddr",
            "type": "combo",
            "template": "1.2",
            "label": lang.filtresReporting.paysRealisation,
            "data": "refPays"
        },
        {
            "name": "modalite_paiement_ddr",
            "type": "combo",
            "template": "2.1",
            "label": lang.filtresReporting.modalitePaiement,
            "data": "modalitesPaiements"
        },
        {
            "type": "teleport",
            "ref": "teleport-reporting-tiers",
            "template": "2.2"
        },
        {
            "name": "projet_ddr",
            "type": "combo",
            "template": "3.1",
            "label": lang.filtresReporting.projet,
            "url": urls['urlGetIdProjets'],
        },
        {
            "name": "concours_ddr",
            "type": "combo",
            "template": "3.2",
            "label": lang.filtresReporting.concours,
            "url": urls['urlGetIdConcours'],
        },
        {
            "name": "date_debut_creation_ddr",
            "type": "date",
            "template": "4.1",
            "limitNow": ">"
        },
        {
            "name": "date_fin_creation_ddr",
            "type": "date",
            "template": "4.2",
            "limitNow": ">"
        },
        {
            "name": "statuts_ddr",
            "type": "combo",
            "template": "5.1",
            "label": lang.filtresReporting.statuts,
            "data": "refStatuts",
            "multi": true
        },
        {
            "name": "agence_gestion_ddr",
            "type": "combo",
            "template": "6.1",
            "label": lang.filtresReporting.agenceGestion,
            "data": "refAgencesGestions"
        },
        {
            "name": "famille_produit_ddr",
            "type": "combo",
            "template": "6.2",
            "label": lang.filtresReporting.familleProduit,
            "data": "refFamillesProduits"
        },
        {
            "name": "division_ddr",
            "type": "combo",
            "template": "7.1",
            "label": lang.filtresReporting.divisionTechnique,
            "data": "divisions_ddr"
        }
    ],
    'affectTasks': [
        {
            "name": "id_user",
            "type": "combo",
            "template": "1.1",
            "label": lang.affectTasks.controleur,
            "data": "listUsers",
            "required": true
        }
    ],
    'reportingAudit': [
        {
            "name": "dossier",
            "type": "text",
            "template": "1.1",
            "label": lang.reporting.audit.filterDossier
        },
        {
            "name": "anomalie",
            "type": "text",
            "template": "1.2",
            "label": lang.reporting.audit.filterAnomalie
        },
        {
            "name": "projet",
            "type": "combo",
            "template": "1.3",
            "label": lang.reporting.audit.filterProjet,
            "url": urls['urlGetIdProjets'],
        },
        {
            "name": "concours",
            "type": "combo",
            "template": "1.4",
            "label": lang.reporting.audit.filterConcours,
            "url": urls['urlGetIdConcours'],
        },
        {
            "name": "user",
            "type": "combo",
            "template": "2.1",
            "label": lang.reporting.audit.filterUser,
            "data": "refUsers"
        },
        {
            "name": "role",
            "type": "combo",
            "template": "2.2",
            "label": lang.reporting.audit.filterRole,
            "data": "refRoles"
        },
        {
            "name": "entitePerimetre",
            "type": "combo",
            "template": "2.3",
            "search": false,
            "label": lang.reporting.audit.filterEntitePerimetre,
            "data": "refEntitePerimetre"
        }
    ],
    'filtresVolumetries': [
        {
            "name": "societe_vol",
            "type": "combo",
            "template": "1.1",
            "label": lang.filtresReporting.societe,
            "data": "refSocietes",
            "multi": true
        },
        {
            "name": "famille_produit_vol",
            "type": "combo",
            "template": "1.2",
            "label": lang.filtresReporting.familleProduit,
            "data": "refFamillesProduits",
            "multi": true
        },
        {
            "name": "modalite_paiement_vol",
            "type": "combo",
            "template": "2.1",
            "label": lang.filtresReporting.modalitePaiement,
            "data": "modalites_paiements_vol",
            "multi": true
        },
        {
            "name": "agence_gestion_vol",
            "type": "combo",
            "template": "2.2",
            "label": lang.filtresReporting.agenceAfd,
            "data": "refAgencesGestions",
            "multi": true
        },
        {
            "name": "division_vol",
            "type": "combo",
            "template": "3.1",
            "label": lang.filtresReporting.divisionTechnique,
            "data": "divisions_vol",
            "multi": true
        },
        {
            "name": "direction_regionale_vol",
            "type": "combo",
            "template": "3.1",
            "label": lang.filtresReporting.directionRegionale,
            "data": "dirReg_vol",
            "multi": true
        },
        {
            "name": "pays_vol",
            "type": "combo",
            "template": "5.1",
            "label": lang.filtresReporting.paysRealisation,
            "data": "refPays",
            "multi": true
        },
        {
            "name": "date_debut_vol",
            "type": "date",
            "template": "6.1",
            "label": lang.filtresReporting.dateDeb,
            "limitNow": ">"
        },
        {
            "name": "date_fin_vol",
            "type": "date",
            "template": "6.2",
            "label": lang.filtresReporting.dateFin,
            "limitNow": ">"
        },
    ],
    'filtresAnomalies': [
        {
            "name": "statuts",
            "type": "combo",
            "template": "1.1",
            "label": lang.filtresReporting.statutsAno,
            "data": "refStatutsAno"
        },
        {
            "name": "agences",
            "type": "combo",
            "template": "1.2",
            "label": lang.filtresReporting.agenceGestion,
            "data": "refAgencesGestions"
        },
        {
            "name": "controleur",
            "type": "combo",
            "template": "2.1",
            "label": lang.filtresReporting.controleur,
            "data": "controleurs"
        },
        {
            "name": "modalite_paiement",
            "type": "combo",
            "template": "2.2",
            "label": lang.filtresReporting.modalitePaiement,
            "data": "modalites_paiements_ano"
        },
        {
            "name": "regularisable",
            "type": "combo",
            "template": "3.1",
            "label": lang.filtresReporting.regularisable,
            "data": "refBoolean"
        },
        {
            "name": "date_debut",
            "type": "date",
            "template": "3.2",
            "label": lang.filtresReporting.dateDeb,
            "limitNow": ">"
        },
        {
            "name": "date_fin",
            "type": "date",
            "template": "3.3",
            "label": lang.filtresReporting.dateCloture,
            "limitNow": ">"
        },
    ],
    'filtresDC': [
        {
            "name": "statuts",
            "type": "combo",
            "template": "1.1",
            "label": lang.filtresReporting.statutsDC,
            "data": "refStatuts2ndNiv",
        },
        {
            "name": "agences",
            "type": "combo",
            "template": "1.2",
            "label": lang.filtresReporting.agencesDC,
            "data": "refAgencesGestions",
        },
        {
            "name": "controleur",
            "type": "combo",
            "template": "2.1",
            "label": lang.filtresReporting.controleur,
            "data": "controleurs"
        },
        {
            "name": "modalite_paiement",
            "type": "combo",
            "template": "2.2",
            "label": lang.filtresReporting.modalitePaiement,
            "data": "modalites_paiements_dc",
        },
        {
            "name": "date_debut",
            "type": "date",
            "template": "3.1",
            "label": lang.filtresReporting.dateDeb,
            "limitNow": ">"
        },
        {
            "name": "date_fin",
            "type": "date",
            "template": "3.2",
            "label": lang.filtresReporting.dateFin,
            "limitNow": ">"
        },
    ],
    'filtresVolumetrieDossierControle': [
        {
            "name": "agence_gestion",
            "type": "combo",
            "template": "1.1",
            "label": lang.reporting.ctlRAJDossierControle.agenceGestion,
            "data": "refAgencesGestions",
        },
        {
            "name": "statut",
            "type": "combo",
            "template": "1.2",
            "label": lang.reporting.ctlRAJDossierControle.statut,
            "data": "refStatutsDCRaj",
        },
        {
            "name": "controleur_en_charge",
            "type": "combo",
            "template": "2.1",
            "label": lang.reporting.ctlRAJDossierControle.controleurEnCharge,
            "data": "controleurs",
        },
        {
            "name": "concours",
            "type": "combo",
            "template": "2.2",
            "label": lang.reporting.ctlRAJDossierControle.concours,
            "url": urls['urlGetIdConcours']
        },
        {
            "name": "typeControleRaj",
            "type": "combo",
            "template": "3.1",
            "label": lang.reporting.ctlRAJDossierControle.typeControleRaj,
            "data": "refTypeControleRaj",
        },
        {
            "name": "type_avance",
            "type": "combo",
            "template": "3.2",
            "label": lang.reporting.ctlRAJDossierControle.typeAvance,
            "data": "refTypeAvance",
        },
        {
            "name": "date_debut_creation_controle",
            "type": "date",
            "template": "4.1",
            "label": lang.reporting.ctlRAJDossierControle.dateDebutCreationControle,
            "limitNow": ">"
        },
        {
            "name": "date_fin_creation_controle",
            "type": "date",
            "template": "4.2",
            "label": lang.reporting.ctlRAJDossierControle.dateFinCreationControle,
            "limitNow": ">"
        },

    ],
    'filtresVolumetrieAnomalie': [
        {
            "name": "agence_gestion",
            "type": "combo",
            "template": "1.1",
            "label": lang.reporting.ctlRAJAnomalie.agenceGestion,
            "data": "refAgencesGestions",
        },
        {
            "name": "statut",
            "type": "combo",
            "template": "1.2",
            "label": lang.reporting.ctlRAJAnomalie.statut,
            "data": "refStatutsAno",
        },
        {
            "name": "controleur_en_charge",
            "type": "combo",
            "template": "2.1",
            "label": lang.reporting.ctlRAJAnomalie.controleurEnCharge,
            "data": "controleurs",
        },
        {
            "name": "concours",
            "type": "combo",
            "template": "2.2",
            "label": lang.reporting.ctlRAJAnomalie.concours,
            "url": urls['urlGetIdConcours']
        },
        {
            "name": "date_debut_creation_controle",
            "type": "date",
            "template": "3.1",
            "label": lang.reporting.ctlRAJAnomalie.dateDebutCreationAnomalie,
            "limitNow": ">"
        },
        {
            "name": "date_fin_creation_controle",
            "type": "date",
            "template": "3.2",
            "label": lang.reporting.ctlRAJAnomalie.dateFinCreationAnomalie,
            "limitNow": ">"
        },
        {
            "name": "typeControleRaj",
            "type": "combo",
            "template": "4.1",
            "label": lang.reporting.ctlRAJAnomalie.typeControleRaj,
            "data": "refTypeControleRaj",
        }
    ],
    'filtresConcoursRaj': [
        {
            "name": "societe_cr",
            "type": "combo",
            "template": "1.1",
            "label": lang.filtresReporting.societe,
            "data": "refEntites"
        },
        {
            "name": "pays_cr",
            "type": "combo",
            "template": "1.2",
            "label": lang.filtresReporting.pays,
            "data": "refPays"
        },
        {
            "name": "agence_cr",
            "type": "combo",
            "template": "2.1",
            "label": lang.filtresReporting.agenceGestion,
            "data": "refAgencesGestions"
        },
        {
            "name": "division_cr",
            "type": "combo",
            "template": "2.2",
            "label": lang.filtresReporting.division,
            "data": "divisions_cr"
        }
    ],
    'filtresListeAvance': [
        {
            "name": "type_avance",
            "type": "combo",
            "template": "1.1",
            "label": lang.reportingListeAvance.typeavance,
            "data": "refTypeAvance",
        },
        {
            "name": "societe",
            "type": "combo",
            "template": "1.2",
            "label": lang.reportingListeAvance.societe,
            "data": "refControleEntite",
        },
        {
            "name": "pays",
            "type": "combo",
            "template": "2.1",
            "label": lang.reportingListeAvance.pays,
            "data": "refPays",
        },
        {
            "name": "agence_gestion",
            "type": "combo",
            "template": "2.2",
            "label": lang.reportingListeAvance.agencegestion,
            "data": "refAgencesGestions",
        },
        {
            "name": "direction_regionnale",
            "type": "combo",
            "template": "3.1",
            "label": lang.reportingListeAvance.directionregionale,
            "data": "",
        },
        {
            "name": "division_av",
            "type": "combo",
            "template": "3.2",
            "label": lang.reportingListeAvance.divisiontechnique,
            "data": "divisions_av",
        }
    ],
    'filtresPaiementTiers': [
        {
            "type": "teleport",
            "ref": "teleport-reporting-tiers",
            "template": "1.1"
        },
        {
            "name": "projet",
            "type": "combo",
            "template": "2.1",
            "label": lang.reportingPaiementTiers.projet,
            "url": urls['urlGetIdProjets'],
        }
    ],
    'filtresPaiementDocContractuel': [
        {
            "name": "projet",
            "type": "combo",
            "template": "2.1",
            "label": lang.reportingPaiementDocContractuel.projet,
            "url": urls['urlGetIdProjets'],
        },
        {
            "name": "pays",
            "type": "combo",
            "template": "2.2",
            "label": lang.reportingPaiementDocContractuel.pays,
            "data": "refPays",
        },
        {
            "name": "agencegestion",
            "type": "combo",
            "template": "1.1",
            "label": lang.reportingPaiementDocContractuel.agenceGestion,
            "data": "refAgencesGestions",
        },
        {
            "name": "date_creation_dc",
            "type": "date",
            "template": "3.1",
            "label": lang.reportingPaiementDocContractuel.dateCreation,
            "limitNow": ">"
        },
        {
            "name": "date_modification_dc",
            "type": "date",
            "template": "3.2",
            "label": lang.reportingPaiementDocContractuel.dateModification,
            "limitNow": ">"
        },
    ],
    "justificatifRemboursement": [
        {
            "name": "type",
            "type": "toggle",
            "label": lang.typeRemboursement.type_remboursement_saisie,
            "label1": lang.typeRemboursement.type_remboursement_integral,
            "label0": lang.typeRemboursement.type_remboursement_partiel,
            "template": "1.1",
            "required": true,
            "action": "justificatif-remboursement,selectTypeRemboursement,selectTypeRemboursement"
        },
        {
            "name": "reference",
            "type": "text",
            "template": "2.1",
            "required": true,
            "label": lang.justificatifRemboursement.reference
        },
        {
            "name": "lien_rome",
            "type": "text",
            "action": "link",
            "required": true,
            "suffix": "<i class='fas fa-link'></i>",
            "template": "3.1",
            "placeholder": lang.justificatifRemboursement.lienRomePlaceholder,
            "label": lang.justificatifRemboursement.lienRome
        },
        {
            "name": "date_valeur",
            "type": "date",
            "required": true,
            "template": "4.1",
            "label": lang.justificatifRemboursement.dateValeur,
            "limitNow": ">"
        },
        {
            "name": "montant_remboursement",
            "type": "number",
            "required": true,
            "isMontant": true,
            "template": "5.1",
            "label": lang.justificatifRemboursement.montantRemboursement,
            "customValidate": "valid = (app.getCurrentCmp('justificatif-remboursement').verifMontantRemboursement(input)) ? true : app.getCurrentCmp('justificatif-remboursement').getMessageErrorMontantRemboursement(input)"
        },
        {
            "name": "devise",
            "type": "text",
            "template": "5.2",
            "label": lang.devise,
            "read": true
        },
        {
            "name": "show_dc",
            "type": "hidden",
            "template": "6.1",
            "value": ""
        },
        {
            "name": "id_document_contractuel",
            "type": "hidden",
            "template": "6.1",
        },
        {
            "type": "teleport",
            "ref": "teleport-dc-justif-remb",
            "template": "6.1"
        },

        {
            "type": "teleport",
            "ref": "teleport-rubriques-justif-remb",
            "template": "7.1"
        },
        {
            "name": "memo",
            "type": "textarea",
            "template": "8.1",
            "label": lang.justificatifRemboursement.memo
        }
    ],
    'filtresDCTiers': [
        {
            "type": "teleport",
            "ref": "teleport-reporting-tiers",
            "template": "1.1"
        }
    ],
    'filtresConcoursRAV': [
        {
            "name": "societe_rav",
            "type": "combo",
            "template": "1.1",
            "label": lang.filtresReporting.societe,
            "data": "refEntites"
        },
        {
            "name": "pays_rav",
            "type": "combo",
            "template": "1.2",
            "label": lang.filtresReporting.paysRealisation,
            "data": "refPays"
        },
        {
            "name": "projet_rav",
            "type": "combo",
            "template": "2.1",
            "label": lang.filtresReporting.projet,
            "url": urls['urlGetIdProjets'],
        },
        {
            "name": "concours_rav",
            "type": "combo",
            "template": "2.2",
            "label": lang.filtresReporting.concours,
            "url": urls['urlGetIdConcours'],
        },
        {
            "name": "agence_rav",
            "type": "combo",
            "template": "3.1",
            "label": lang.filtresReporting.agenceGestion,
            "data": "refAgencesGestions"
        },
        {
            "name": "division_rav",
            "type": "combo",
            "template": "3.2",
            "label": lang.filtresReporting.divisionTechnique,
            "data": "divisions_rav"
        },
        {
            "name": "date_debut_rav",
            "type": "date",
            "template": "4.1",
            "label": lang.filtresReporting.dateDeb,
            "limitNow": ">"
        },
        {
            "name": "date_fin_rav",
            "type": "date",
            "template": "4.2",
            "label": lang.filtresReporting.dateFin,
            "limitNow": ">"
        },
    ],
    'filtresRemboursements': [
        {
            "name": "typeremboursements",
            "type": "combo",
            "template": "1.1",
            "label": lang.reportingRemboursement.typeremboursement,
            "data": "refTypesRemboursement",
        },
        {
            "type": "teleport",
            "ref": "teleport-reporting-tiers",
            "template": "1.2"
        },
        {
            "name": "projet",
            "type": "combo",
            "template": "2.1",
            "label": lang.reportingRemboursement.projet,
            "url": urls['urlGetIdProjets'],
        },
        {
            "name": "concours",
            "type": "combo",
            "template": "2.2",
            "label": lang.reportingRemboursement.concours,
            "url": urls['urlGetIdConcours']
        },
        {
            "name": "agencegestion",
            "type": "combo",
            "template": "3.1",
            "label": lang.reportingRemboursement.agencegestion,
            "data": "refAgencesGestions",
        },
        {
            "name": "pays",
            "type": "combo",
            "template": "3.2",
            "label": lang.reportingRemboursement.paysRealisation,
            "data": "refPays",
        },
    ],
    'entiteOrga': [
        {
            "name": "codeEntiteOrga",
            "template": "1.1",
            "required": true,
            "label": lang.entitesOrga.codeEntiteOrga
        },
        {
            "name": "statut",
            "template": "1.2",
            "read": true,
            "label": lang.entitesOrga.statut
        },
        {
            "name": "libCourt",
            "template": "2.1",
            "required": true,
            "label": lang.entitesOrga.libCourt
        },
        {
            "name": "typeEntiteOrga",
            "type": "combo",
            "template": "3.1",
            "required": true,
            "data": "refEntiteOrgaTypes",
            "label": lang.entitesOrga.typeEntiteOrga
        },
        {
            "name": "codeEntitePere",
            "template": "4.1",
            "required": true,
            "read": true,
            "label": lang.entitesOrga.codeEntitePere
        },
        {
            "name": "codeEntiteRoot",
            "template": "5.1",
            "required": true,
            "read": true,
            "label": lang.entitesOrga.codeEntiteRoot
        }
    ]
};