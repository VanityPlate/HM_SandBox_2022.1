/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 * @update 2/8/2022 Added logic for placing an Update WO button to fit with sales order pegging
 *
 */
define(['N/ui/serverWidget'],
    
    (serverWidget) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
                try {
                        let woForm = scriptContext.form;
                        //Validating work order is in correct state to add the reopen button
                        if ((scriptContext.type == 'view' || scriptContext.type == 'edit')  && scriptContext.newRecord.getValue({fieldId: 'status'}) == 'Closed'){
                                //Attaching Button and client script for reopening the work order
                                woForm.clientScriptModulePath = 'SuiteScripts/Work Order Scripts/HM_WorkOrder_CS.js';
                                woForm.addButton({
                                        id: 'custpage_reopen',
                                        label: 'Reopen WO',
                                        functionName: 'reOpen'
                                });
                        }
                        if(scriptContext.type == 'view' || scriptContext.type == 'edit'){
                                woForm.clientScriptModulePath = 'SuiteScripts/Work Order Scripts/HM_WorkOrder_CS.js';
                                woForm.addButton({
                                        id: 'custpage_print_picklist',
                                        label: 'Print Pick List',
                                        functionName: 'printPicklist'
                                });
                                woForm.removeButton({
                                        id: 'printbom'
                                });
                        }
                        //HM PEGGING
                        if(scriptContext.newRecord.getValue({fieldId: "custbody_hm_pegged_so"})){
                                woForm.clientScriptModulePath = "SuiteScripts/Wprk Order Scripts/HM_WorkOrder_CS.js";
                                woForm.addButton({
                                        id: 'custpage_reschedule_wo',
                                        label: 'Reschedule WO',
                                        functionName: 'rescheduleWO'
                                });
                                scriptContext.newRecord.getField({fieldId: 'startdate'}).isDisabled = true;
                                scriptContext.newRecord.getField({fieldId: 'enddate'}).isDisabled = true;
                                scriptContext.newRecord.getField({fieldId: 'custbody_hm_pegged_so'}).isDisplay = true;
                        }
                }
                catch(error){
                        log.error({title: 'Critical Error in beforeLoad', details: error});
                }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad}

    });
