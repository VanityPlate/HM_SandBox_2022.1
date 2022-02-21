/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@hydramaster.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/email', 'N/record'],
    
    (email, record) => {

        /**
         * Deletes a record
         * @param{int}recordId
         */
        let deleteRecord = () =>{
            try{

            }
            catch (e) {
                log.error({title: 'Critical error in deleteRecord', details: e});
            }
        }

        /**
         * Converts a passed purchase order from a dropship into a normal po returning the new internal id
         * @param{int}poId
         * @return{int} the new poId
         */
        let convertPO = (poId) => {
            try{

            }
            catch (e) {
                log.error({title: 'Critical error in convertPO', details: e});
            }
        }

        /**
         * Emails record to the entities
         */

        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            try{

            }
            catch (e) {
                log.error({title: 'Critical error in each', details: e});
            }
        }

        return {each}

    });
