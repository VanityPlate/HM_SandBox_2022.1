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
