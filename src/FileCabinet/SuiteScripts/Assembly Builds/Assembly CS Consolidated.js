/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/search', 'N/ui/dialog', 'SuiteScripts/Help_Scripts/hm_sweet_alert_2.js'],

function(currentRecord, log, record, search, dialog, sAlert) {
    
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

    }

    /**
     * Defines function for testing firing of multiple concurrent messages and updating object with user input.
     * @param{Record} recordObj
     * @return null
     */
    async function fireMessages(recordObj){
        try{
            const fakeSubs =  ['biscuit', 'egg', 'sausage'];
            for(let x = 0; x < fakeSubs.length; x++){
                await sAlert.fire(fakeSubs[x]);
            }
        }
        catch (e) {
            log.error({title: 'Critical error in fireMessages', details: e});
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
        try{
            if(scriptContext.fieldId == 'item'){
                fireMessages(scriptContext.currentRecord);
            }

        }
        catch (e) {
            log.error({title: 'Critical error in fieldChanged', details: e});
        }
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
     * Defines function for testing if an assemblies serial number is verified returns false if you cannot save. True otherwise.
     * @param{Record} recordObj
     * @return{boolean}
     */
    let verSerial = (recordObj) => {
        try{
            if(recordObj.getValue({fieldId: 'custbody_serial_verified'})){
                return true;
            }

            //Retrieving the sub-record to check its serial numbers
            let invDetails = recordObj.getValue({fieldId: 'inventorydetailreq'});

            //No serial numbers to test against allowing save.
            if (invDetails === 'F'){
                recordObj.setValue({fieldId: 'custbody_serial_verified', value: true});
                return true;
            }

            //Array for holding duplicate serial numbers
            let duplicates = [": "];

            //Iterating though the sublist on the sub-record checking that the serial number has not been used
            //previously
            invDetails = recordObj.getSubrecord({fieldId: 'inventorydetail'});
            let lines = invDetails.getLineCount({sublistId: 'inventoryassignment'});
            for(let x = 0; x < lines; ++x){
                //retrieving the current serial number
                invDetails.selectLine({sublistId: 'inventoryassignment', line: x});
                var serialNumber = invDetails.getCurrentSublistValue(
                    {sublistId: 'inventoryassignment', fieldId: 'receiptinventorynumber'});

                //creating and running a search to see if the current serial number is already in use
                var filters =   [
                    ["inventorynumber.inventorynumber","is",serialNumber]
                ];
                var inUse = search.create({
                    type: search.Type.INVENTORY_DETAIL,
                    filters: filters
                }).run().getRange({start: 0, end: 5});

                //If there are any results add the duplicate serial number to alert user
                if(inUse.length>1){
                    duplicates.push(serialNumber);
                }
            }
            //if duplicates has more than the initial variable alert the user and return false to stop the save
            //otherwise return true to allow the saving of the Assembly Build
            if(duplicates.length > 1){
                dialog.alert({title: "SAVE FAILED!", message: "The following Serial#s are duplicates" + duplicates}).then(success).catch(failure);
                return false;
            }
            else{
                recordObj.setValue({fieldId: 'custbody_serial_verified', value: true});
                return true;
            }
        }
        catch (e) {
            log.error({title: 'Critical error in verSerial', details: e});
        }
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
        try{
            if(!verSerial((scriptContext.currentRecord))){
                return false;
            }
            return true;
        }
        catch(error){
            log.audit({title: "Critical Error in saveRecord", details: error});
            return false;
        }
    }

    return {
        //pageInit: pageInit,
        fieldChanged: fieldChanged,
        //postSourcing: postSourcing,
        //sublistChanged: sublistChanged,
        //lineInit: lineInit,
        //validateField: validateField,
        //validateLine: validateLine,
        //validateInsert: validateInsert,
        //validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
