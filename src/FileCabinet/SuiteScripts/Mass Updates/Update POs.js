/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            try{
                const BILL_TO = 'HydraMaster LLC\n' +
                                '1500 Industry Street\n' +
                                'Suite 300\n' +
                                'Everett, WA\n' +
                                '98203';

                let recordObj = record.load({
                    type: params.type,
                    id: params.id,
                    isDynamic: true
                });
                let currentLocation = recordObj.getValue({fieldId: 'location'});
                if(currentLocation != 101){
                    recordObj.setValue({fieldId: 'location', value: '109'});
                    recordObj.setValue({fieldId: 'location', value: '8'});
                }
                let billTo = recordObj.getValue({fieldId: 'custbody_hm_bill_to'});
                if(billTo.length > 0){
                    recordObj.setValue({fieldId: 'custbody_hm_bill_to', value: BILL_TO});
                }
                recordObj.save();
            }
            catch (e) {
                log.error({title: 'Error on record', details: params.id + '\n' + e});
            }
        }

        return {each}

    });
