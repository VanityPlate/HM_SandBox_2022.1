/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([],
    
    () => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{

            }
            catch (e) {
                log.error({title: 'Critical error in onRequest', details: e});
            }
        }

        return {onRequest}

    });
