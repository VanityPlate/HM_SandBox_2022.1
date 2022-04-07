/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@gmail.com
 * @copyright HydraMaster LLC
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/task', 'N/file', 'SuiteScripts/Help_Scripts/schedulerLib.js', 'N/url', 'N/https'],
    
    (task, file, schedulerLib, url, https) => {

        /**
         * Takes a task name and handles the submission
         * @param {string} taskName - task name for submission user defined and stored in schedulerLib.js
         * @return {ClientResponse} The id of the submitted task as a client response
         * @since 2021.4
         */
        let submitTaskClient = (taskName) => {
            try{
                let output = url.resolveScript({
                    scriptId:  schedulerLib.hmSchDef.scriptID,
                    deploymentId: schedulerLib.hmSchDef.deploymentID,
                    params: {'script': taskName}
                });
                let response = https.get({url: output});
                return response;
            }
            catch (error){
                log.error({title: 'Critical Error in submitTask', details: error});
            }
        }

        /**
         *
         * @param {string} taskName - task name for the submission, user defined and stored in schedulerLib.js
         * @param {object} scriptParameters - parameters to be passed to script submission
         * @return {string} - The task ID
         * @since 2021.4
         */
        let submitTask = (taskName, scriptParameters) => {
            try{
                //Refactor Testing
                log.debug({title: 'taskName', details: taskName});
                log.debug({title: 'scriptParameters', details: scriptParameters.toString()});
                //Scheduling and Executing Script
                let workTask = task.create({taskType: schedulerLib.scripts[taskName].taskType});
                workTask.scriptId = schedulerLib.scripts[taskName].scriptId;
                workTask.deploymentId = schedulerLib.scripts[taskName].deploymentId;
                if(scriptParameters.toString().length > 0){
                    workTask.params = scriptParameters;
                }

                let scriptID = workTask.submit();
                return scriptID;
            }
            catch(error){
                log.error({title: 'Critical error in submitTask', details: error});
            }
        }

        /**
         * Function for retrieving the results of a scheduled script
         * @param {string} scriptName
         * @return {json} contents of related scriptName file in a json object
         */
        let getResults = (scriptName) =>{
            try{
                let resultsFile = file.load({id: schedulerLib.scripts[scriptName].file});
                let iterator = resultsFile.lines.iterator();
                let output = {};
                let currentLine = 0;
                iterator.each(function (line){
                   output[currentLine++] = line.value;
                });
                return output;
            }
            catch (error){
                log.error({title: 'Critical error in getResults', details: error});
                throw 'Critical error in getResults.' + error;
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
                    //Gathering Parameters
                    let scriptName = scriptContext.request.parameters['scriptName'];
                    let results = scriptContext.request.parameters['results'];
                    let status = scriptContext.request.parameters['status'];
                    let scriptParameters = scriptContext.request.parameters['script_parameters']
                    if(results){
                        //Current Non Functional
                    }
                    else if(status){
                        //Checking Script Status
                        let scriptStatus = task.checkStatus({taskId: status});
                        scriptContext.response.write({output: scriptStatus.status});
                    }
                    else if(scriptName){
                        scriptParameters = scriptParameters ? scriptParameters : '';
                        let scriptID = submitTask(scriptName, JSON.parse(scriptParameters))
                        scriptContext.response.write({output: scriptID});
                    }
                }
            }
            catch(error){
                log.error({title: 'Critical error in onRequest', details: error});
            }
        }

        return {onRequest, getResults, submitTask, submitTaskClient}

    });
