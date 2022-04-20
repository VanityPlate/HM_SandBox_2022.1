/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@hydramaster.com
 * HydraMaster LLC
 *
 * Update 1/5/2022 Dates no longer considered, consider on per item basis first then classes, allow for percentage increase
 * Update 3/28/2022 Including logic to consider dates held by MS_Library.js
 * Update 4/18/2022 Refactoring to use NetSuite fields instead of library making changes to how items that are dependent
 *                  on dates are checked but not to the business logic
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
                    let itemClass = null;
                    let itemId = '';
                    let itemDollarSur = null;
                    let itemSur = null;
                    let classDollarSur = null;
                    let classSur = null;
                    itemId = recordObj.getSublistValue({sublistId: 'item', fieldId: 'item', line: x});
                    //Refactor Building Out Changes
                    let itemFields = search.lookupFields({
                        type: search.Type.ITEM,
                        id: itemId,
                        columns: ['custitem_item_surcharge', 'custitem_item_surcharge_dollar']
                    });
                    //Refactor Testing
                    log.audit({title: 'itemFields', details: itemFields});
                    itemDollarSur = itemFields.custitem_item_surcharge;
                    itemSur = itemFields.custitem_item_surcharge_dollar;
                    try{
                        itemClass = search.lookupFields({
                            type: search.Type.ITEM,
                            id: itemId,
                            columns: ['class']
                        }).class[0].value;
                    }
                    catch (e) {
                        //do nothing
                    }
                    if(itemClass != null){
                        let classResults = search.lookupFields({
                            type: search.Type.CLASSIFICATION,
                            id: itemClass,
                            columns: ['custrecord_class_surcharge_dol', 'custrecord_class_surcharge']
                        });
                        //Refactor Testing
                        log.audit({title: 'classResults', details: classResults});
                        classDollarSur = classResults.custrecord_class_surcharge_dol;
                        classSur = classResults.custrecord_class_surcharge;
                    }
                    //Below before initial record save returns original date created
                    let dateCreated = Date.parse(recordObj.getValue({fieldId: 'createddate'}).toDateString());
                    let dateDependent = new Set(msLib.itemsDateDependent);
                    dateDependent = dateDependent.has(itemId);
                    //Making sure dates are not prior to set date if
                    if(dateDependent == false || dateCreated >= msLib.DATEREF) {          //Added 3/28/2022 Checking dates
                        //Commented Out Saved for Testing
                        //log.audit({title: 'Item Class', details: itemClass});
                        //Working on per item basis
                        //Working with percent increase on items
                        if (itemSur != null && itemSur > 0) {
                            let total = recordObj.getSublistValue({sublistId: 'item', fieldId: 'amount', line: x});
                            //Commented Out Saved for Testing
                            //log.audit({title: 'test total id', details: total});
                            surcharge += itemSur * total;
                        }
                        //Working with flat rate on items
                        else if(itemDollarSur != null && itemDollarSur > 0){
                            let quantity = recordObj.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                line: x
                            });
                            surcharge += itemDollarSur * quantity;
                        }
                        //Working on per item_class basis
                        //Working with percent increase on items
                        else if (classSur != null && classSur > 0) {
                            let total = recordObj.getSublistValue({sublistId: 'item', fieldId: 'amount', line: x});
                            //Commented Out Saved for Testing
                            //log.audit({title: 'test total class', details: total});
                            surcharge += classSur * total;
                        }
                        //Working with flat rate on items
                        else if (classDollarSur != null && classDollarSur > 0){
                            let quantity = recordObj.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                line: x
                            });
                            surcharge += classDollarSur * quantity;
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
