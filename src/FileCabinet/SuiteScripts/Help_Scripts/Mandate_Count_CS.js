/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@hydramaster.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 */
define(['N/currentRecord'],
    /**
 * @param{currentRecord} currentRecord
 * @param{serverWidget} serverWidget
 */
    function(currentRecord) {

        /**
         * Mandates shipper enter quantities see mandateCount in Item Fulfillment General UES.js
         * @param{Record} recordObj
         * @return {null}
         */
        let uncheckBox = (recordObj) => {
            try{
                let lines = recordObj.getLineCount({sublistId: 'item'});
                for(let x = 0; x < lines; x++){
                    recordObj.selectLine({sublistId: 'item', line: x});
                    recordObj.setCurrentSublistValue({sublistId: 'item', fieldId: 'itemreceive', value: false});
                    recordObj.commitLine({sublistId: 'item'});
                }
            }
            catch (e) {
                log.error({title: 'Critical error in uncheckBox', details: e});
            }
        };

        /**
         * Mandates counts on item receipts see Item Receipt UES General.js
         * @param{Record} recordObj
         * @return{null}
         */
        let setQuantity = (recordObj) => {
            try{
                let lines = recordObj.getLineCount({sublistId: 'item'});
                for(let x = 0; x < lines; x++){
                    recordObj.selectLine({sublistId: 'item', line: x});
                    recordObj.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: ''});
                    recordObj.commitLine({sublistId: 'item'});
                }
            }
            catch (e) {
                log.error({title: 'Critical error in setQuantity', details: e});
            }
        };

        return {uncheckBox, setQuantity}

    });
