/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    
    (serverWidget) => {

        /**
         * Renders form for display to user
         * @return{Form}
         * @since 2/2022
         */
        let renderForm = () => {
            try{
                let form = serverWidget.createForm({title: 'Peg Orders'});
                form.clientScriptModulePath = './Pegging Suitelet CS.js';
                form.addButton({
                   id: 'custpage_push_updates',
                   label: 'Push Updates',
                   functionName: 'pushUpdates'
                });
                form.addField({
                    id: 'custpage_select_assembly',
                    label: 'Select Assembly',
                    type: serverWidget.FieldType.SELECT,
                    source: 'item'
                });
                let list = form.addSublist({
                    id: 'custpage_orders_to_peg',
                    label: 'Orders',
                    type: serverWidget.SublistType.LIST
                });
                let urlFieldSO = list.addField({
                        id: 'custpage_sourl',
                        type: serverWidget.FieldType.URL,
                        label: 'SO#'
                    });
                urlFieldSO.linkText = 'View';
                list.addField({
                    id: 'custpage_customerurl',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer'
                });
                list.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date'
                });
                list.addField({
                    id: 'custpage_machine',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Machine'
                });
                list.addField({
                    id: 'custpage_quantity',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Quantity'
                });
                list.addField({
                    id: 'custpage_quantity_pegged',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Quantity Pegged'
                });
                list.addField({
                    id: 'custpage_add_to_peg',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Peg Units'
                });
                return form;
            }
            catch (e) {
                log.error({title: 'Critical error in renderForm', details: e});
            }
        }

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === 'GET'){
                    scriptContext.response.writePage({
                       pageObject: renderForm()
                    });
                }
            }
            catch (e) {
                log.error({title: 'Critical error in onRequest', details: e});
            }
        }

        return {onRequest}

    });
