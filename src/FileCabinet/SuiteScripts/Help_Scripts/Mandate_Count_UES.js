/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 */
define(['N/currentRecord', 'N/ui/serverWidget'],
    /**
 * @param{currentRecord} currentRecord
 * @param{serverWidget} serverWidget
 */
    (currentRecord, serverWidget) => {

        /**
         * Disables all fulfill boxes on line items mandating users enter quantities individually
         * @param{Form} formObj
         * @param{Record} recordObj
         * @return null
         */
        let disableCheckBox = (formObj, recordObj) => {
            try{
                let lines = recordObj.getLineCount({sublistId: 'item'});
                for(let x = 0; x < lines; x++){
                    let field = formObj.getSublist({id: 'item'}).getField({id: 'itemreceive'});
                    field.updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
                }
            }
            catch (e) {
                log.error({title: 'Critical error in mandateCount', details: e});
            }
        }

        return {disableCheckBox}

    });
