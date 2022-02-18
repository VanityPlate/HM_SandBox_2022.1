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
                form.clientScriptModulePath = './Pegging Suitelet.js';
                form.addButton({
                   id: 'custpage_push_updates',
                   label: 'Push Updates',
                   functionName: 'pushUpdates'
                });
                form.addField({
                    id: 'custpage_select_assembly',
                    label: 'Select Assembly',
                    type: serverWidget.FieldType.SELECT,
                    source: 'assemblies'
                });
                form.addSublist({
                    id: 'custpage_orders_to_peg',
                    label: 'Orders',
                    type: serverWidget.SublistType.LIST
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
