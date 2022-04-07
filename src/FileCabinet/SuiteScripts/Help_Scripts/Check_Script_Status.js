/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/record'],
    /**
 * @param{search} search
 */
    (search, record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                let scriptId = scriptContext.request.parameters['scriptID'];
                let deploymentId = scriptContext.request.parameters['scriptDeployID'];
                let ss = search.create({
                    type:		record.Type.SCHEDULED_SCRIPT_INSTANCE,
                    filters:    [
                        ["status","anyof","PENDING","PROCESSING","RESTART","RETRY"]
                        ,"AND",
                        ["script.scriptid",search.Operator.IS,scriptId]
                        ,"AND",
                        ["scriptDeployment.scriptid",search.Operator.IS,deploymentId]
                    ],
                    columns:	["status", "script.internalid"]
                }).run().getRange(0,1);
                let output = ss.length > 0 ? 'true' : 'false';
                scriptContext.response.write({output: output});
            }
            catch (e) {
                log.error({title: 'Critical error in onRequest', details: e});
            }
        }

        return {onRequest}

    });
