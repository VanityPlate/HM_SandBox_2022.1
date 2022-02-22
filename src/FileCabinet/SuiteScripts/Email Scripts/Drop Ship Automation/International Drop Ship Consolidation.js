/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@hydramaster.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/search', 'N/render', 'N/email', 'N/record', '/SuiteScripts/Help_Scripts/Email_Library.js'],
    
    (search, render, email, record, emailLib) => {

        /**
         * Constants
         */
        const EMAIL_TEMPLATE = 5;
        const PURCHASER = emailLib.emailInternalId.purchasing;

        /**
         * Deletes a record
         * @param{Object}params
         */
        let deleteRecord = (params) =>{
            try{
                record.delete({
                   id: params.id,
                    type: params.type
                });
            }
            catch (e) {
                log.error({title: 'Critical error in deleteRecord', details: e});
            }
        }

        /**
         * Converts a passed purchase order from a dropship into a normal po returning the new internal id
         * @param{Record}po
         * @return{int} the new poId
         */
        let convertPO = (po) => {
            try{
                let convertedPO = record.create({
                    type: record.type.PURCHASE_ORDER,
                    isDynamic: true
                });
                convertedPO.setValue({fieldId: 'entity', value: po.getValue({fieldId: 'entity'})});
                convertedPO.setValue({fieldId: 'shipdate', value: po.getValue({fieldId: 'shipdate'})});
                convertedPO.setValue({fieldId: 'shipmethod', value: po.getValue({fieldId: 'shipmethod'})});
                convertedPO.setValue({fieldId: 'custbody_shipping_payment_method', value: po.getValue({fieldId: 'custbody_shipping_payment_method'})});
                let lines = po.getLineCount({sublistId: 'item'});
                for(let x = 0; x < lines; x++){
                    convertedPO.selectNewLine({sublistId: 'item'});
                    convertedPO.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: po.getSublistValue({sublistId: 'item', fieldId: 'item', line: x})});
                    convertedPO.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: po.getSublistValue({sublistId: 'item', fieldId: 'quantity', line: x})});
                    convertedPO.setCurrentSublistValue({sublistId: 'item', fieldId: 'rate', value: po.getSublistValue({sublistId: 'item', fieldId: 'rate', line: x})});
                    convertedPO.setCurrentSublistValue({sublistId: 'item', fieldId: 'expectedreceiptdate', value: po.getSublistValue({sublistId: 'item', fieldId: 'expectedreceiptdate', line: x})});
                    convertedPO.commitLine({sublistId: 'item'});
                }
                return convertedPO.save();
            }
            catch (e) {
                log.error({title: 'Critical error in convertPO', details: e});
            }
        }

        /**
         * Emails record to the vendor email listed under "custbody_hm_vendor_email"
         * @param{int}poId
         * @param{int}vendor
         */
        let emailPO = (poId, vendor) =>{
            try{
                let emailMerge = render.mergeEmail({
                    templateId: EMAIL_TEMPLATE,
                    transactionId: poId,
                    entity: {type: 'employee', id: PURCHASER},
                    recipient: {type: 'vendor', id: vendor},
                    customRecord: null,
                    supportCaseId: null
                });
                let recordPDF = render.transaction({
                    entityId: poId,
                    printMode: render.PrintMode.PDF
                });
                email.send({
                    author: PURCHASER,
                    body: emailMerge.body,
                    recipient: vendor,
                    subject: emailMerge.subject,
                    attachments: [recordPDF]
                });
            }
            catch (e) {
                log.error({title: 'Critical error in emailPO', details: e});
            }
        }


        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            try{
                //Loading Record and sourcing fields
                let poToEmail = params.id;
                let dropShip = record.load({
                    id: params.id,
                    type: params.type,
                    isDynamic: false
                });
                let customer = dropShip.getValue({fieldId: 'shipto'});
                let vendor = dropShip.getValue({fieldId: 'entity'});
                let isInternational = search.lookupFields({id: customer, type: search.Type.CUSTOMER, columns: "custentity_international_customer"});
                isInternational = isInternational.custentity_international_customer;
                //Refactor Testing
                log.audit({title: 'Is international', details: isInternational});
                //Testing if po needs refactoring if so creates new po and deletes the old
                if(isInternational){
                    poToEmail = convertPO(dropShip);
                    deleteRecord(params);
                }
                //Emails po to vendor requesting reply to receipt
                emailPO(poToEmail, vendor);
            }
            catch (e) {
                log.error({title: 'Critical error in each', details: e});
            }
        }

        return {each}

    });
