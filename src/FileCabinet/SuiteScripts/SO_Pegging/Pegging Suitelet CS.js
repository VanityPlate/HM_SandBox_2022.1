/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/search', 'SuiteScripts/Help_Scripts/hm_sweet_alert_2.js'],

function(currentRecord, search, sAlert) {

    /**
     * Constants
     */
    let itemCurrent = null;

    /**
     * Function that compiles changes the user is requesting and submits the updates to the pegging data
     * Returns true if task is schedule and false if que is found to be full.
     *@return boolean
     */
    let pushUpdates = () => {
        try{
            return true;
        }
        catch (e) {
            log.error({title: 'Critical error in pushUpdates', details: e});
        }
    }

    /**
     * Function to set lines
     */
    let setLines = () => {
        try {
            let recordObject = currentRecord.get();
            var results = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["item","anyof","26881"],
                        "AND",
                        ["formulanumeric: {quantity}-{quantitypacked}","greaterthan","0"]
                    ],
                columns:
                    [
                        search.createColumn({name: "tranid", label: "Document Number"}),
                        search.createColumn({
                            name: "altname",
                            join: "customerMain",
                            label: "Name"
                        }),
                        search.createColumn({name: "datecreated", label: "Date Created"}),
                        search.createColumn({
                            name: "formulanumeric",
                            formula: "{quantity}-{quantitypacked}",
                            label: "Pending Fulfilment"
                        })
                    ]
            }).run().getRange({start: 0, end: 250});
            for(let x = 0; x < results.length; x++){
                let lineInfo = results[x];
                recordObject.selectNewLine({sublistId: 'custpage_orders_to_peg'});
                recordObject.setCurrentSublistValue({sublistId: 'custpage_orders_to_peg', fieldId: 'custpage_soNumber', value: lineInfo.getValue({name: 'tranid'})});
                recordObject.setCurrentSublistValue({sublistId: 'custpage_orders_to_peg', fieldId: 'custpage_customer', value: lineInfo.getValue({name: 'altname', join: 'customerMain'})});
                recordObject.setCurrentSublistValue({sublistId: 'custpage_orders_to_peg', fieldId: 'custpage_date', value: lineInfo.getValue({name: 'datecreated'})});
                recordObject.setCurrentSublistValue({sublistId: 'custpage_orders_to_peg', fieldId: 'custpage_quantity', value: lineInfo.getValue({name: 'formulanumeric'})});
            }
        } catch (e) {
            log.error({title: 'Critical error in setLines', details: e});
        }
    }

    /**
     * Function to clear lines
     */
    let clearLines = () => {
        try {
            let recordObject = currentRecord.get();
            let lines = recordObject.getLineCount({sublistId: 'custpage_orders_to_peg'});
            for(let x = lines -1; x >= 0; x--){
                recordObject.removeLine({sublistId: 'custpage_orders_to_peg', line: x, ignoreRecalc: true});
            }
        }
        catch (e) {
            log.error({title: 'Critical error in clearLines', details: e});
        }
    }

    /**
     * Confirms the users intentions when selecting a new item handles appropriate calls based on user response.
     */
    let checkUserRequest = () => {
        try{
            let recordObject = currentRecord.get();
            sAlert.fire({
                title: 'Are you sure?',
                text: 'Do you want to commit these changes?',
                icon: 'warning',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Save',
                denyButtonText: 'Don\'t Save',
            }).then((result) => {
                if(result.isConfirmed){
                    if(pushUpdates()) {
                        itemCurrent = recordObject.getValue({fieldId: 'custpage_select_assembly'});
                        clearLines();
                        setLines();
                    }
                    else{
                        sAlert.fire({
                            icon: 'error',
                            title: 'Update Blocked',
                            text: 'The process que is full please wait minute and try again.'
                        });
                    }
                }
                else if(result.isDenied){
                    itemCurrent = recordObject.getValue({fieldId: 'custpage_select_assembly'});
                    clearLines();
                    setLines();
                }
            });
        }
        catch (e) {
            log.error({title: 'Critical error in clearLines', details: e});
        }
    }

    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        try{

        }
        catch (e) {
            log.error({title: 'Critical error in pageInit', details: e});
        }
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {
        try{
            if(scriptContext.fieldId == 'custpage_select_assembly' && itemCurrent == null){
                checkUserRequest();
            }
            else if(scriptContext.fieldId = 'custpage_select_assembly'){
                itemCurrent = scriptContext.currentRecord.getValue({fieldId: 'custpage_select_assembly'});
                clearLines();
                setLines();
            }
        }
        catch (e) {
            log.error({title: 'Critical error in postSourcing', details: e});
        }
    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        pageInit: pageInit,
        //fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        //sublistChanged: sublistChanged,
        //lineInit: lineInit,
        //validateField: validateField,
        //validateLine: validateLine,
        //validateInsert: validateInsert,
        //validateDelete: validateDelete,
        //saveRecord: saveRecord,
        pushUpdates: pushUpdates,
    };
    
});
