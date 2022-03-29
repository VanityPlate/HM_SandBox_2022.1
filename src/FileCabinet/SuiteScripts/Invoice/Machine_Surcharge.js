/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@hydramaster.com
 * HydraMaster LLC
 *
 * Update 1/5/2022 Dates no longer considered, consider on per item basis first then classes, allow for percentage increase
 * Update 3/28/2022 Including logic to consider dates held by MS_Library.js
 *
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/search', 'N/record', './MS_Library', 'N/currentRecord'],
    
    (search, record, msLib, currentRecord) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {

            try{
                let recordObj = scriptContext.newRecord;
                let surcharge = 0.0;
                let lines = recordObj.getLineCount({sublistId: 'item'});
                for(let x = 0; x < lines; x++){
                    let itemClass;
                    let itemId = '';
                    try {
                        itemId = recordObj.getSublistValue({sublistId: 'item', fieldId: 'item', line: x});
                        itemClass = search.lookupFields({
                            type: search.Type.ITEM,
                            id: itemId,
                            columns: ['class']
                        }).class[0].value;
                    }
                    catch (e){
                        //do nothing
                    }
                    //Below before initial record save returns original date created
                    let dateCreated = Date.parse(recordObj.getValue({fieldId: 'createddate'}).toDateString());
                    let datePrior = null;
                    //Refactor Testing
                    log.audit({title: 'Testing dates', details: dateCreated + ' ' + datePrior});
                    try{
                        datePrior = msLib.chargesById[itemId].datePrior;
                    }
                    catch (e) {
                        //do nothing
                    }
                    //Making sure dates are not prior to set date if
                    if(datePrior == null || dateCreated >= datePrior) {          //Added 3/28/2022 Checking dates
                        //Commented Out Saved for Testing
                        //log.audit({title: 'Item Class', details: itemClass});
                        //Working on per item basis
                        if (msLib.chargesById.hasOwnProperty(itemId)) {
                            //Working with percent increase
                            if (msLib.chargesById[itemId].defaultCharge == -1) {
                                let total = recordObj.getSublistValue({sublistId: 'item', fieldId: 'amount', line: x});
                                //Commented Out Saved for Testing
                                //log.audit({title: 'test total id', details: total});
                                surcharge += msLib.chargesById[itemId].surchargePercent * total;
                            }
                            //Working with flat rate
                            else {
                                let quantity = recordObj.getSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'quantity',
                                    line: x
                                });
                                surcharge += msLib.chargesById[itemId].defaultCharge * quantity;
                            }
                        }
                        //Working on per item_class basis
                        else if (msLib.chargesByClass.hasOwnProperty(itemClass)) {
                            //Working with percent increase
                            if (msLib.chargesByClass[itemClass].surchargeFlat == -1) {
                                let total = recordObj.getSublistValue({sublistId: 'item', fieldId: 'amount', line: x});
                                //Commented Out Saved for Testing
                                //log.audit({title: 'test total class', details: total});
                                surcharge += msLib.chargesByClass[itemClass].surchargePercent * total;
                            }
                            //Working with flat rate
                            else {
                                let quantity = recordObj.getSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'quantity',
                                    line: x
                                });
                                surcharge += msLib.chargesByClass[itemClass].surchargeFlat * quantity;
                            }
                        }
                        //Commented Out Saved for Testing
                        //log.audit({title: 'Running Surcharge Total', details: surcharge});
                    }
                }
                if(surcharge > 0){
                    let discount = recordObj.getValue({fieldId: 'discounttotal'});
                    recordObj.selectNewLine({sublistId: 'item'})
                    recordObj.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: 1});
                    recordObj.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: msLib.surchargeItem});
                    recordObj.setCurrentSublistValue({sublistId: 'item', fieldId: 'amount', value: surcharge});
                    recordObj.commitLine({sublistId: 'item'});
                    recordObj.setValue({fieldId: 'discountrate', value: discount});
                }
            }
            catch (e) {
                log.error({title: 'Critical Error in onAction', details: e});
            }
        }

        return {onAction};
    });
