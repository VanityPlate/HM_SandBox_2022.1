define(['N/https', 'N/url'],

function(https, url) {

    /**
     * Constants
     */
    const FILELIB = {workOrderFix: 'Process_Files/Script Files/workOrderFix.txt', countKPI: 'Process_Files/Script Files/countKPI.txt'};
    //Include ScriptId, DeploymentId, Results_File_Path
    const SCRIPTS = {
        updateAssemblySubs : {scriptId: 'customscript_update_assembly_subs', deploymentID: 'customdeploy_update_assembly_subs', taskType: 'MAP_REDUCE'},
        updateItemSupplyCat : {scriptId: 'customscript_set_item_cat_mr', deploymentID: 'customdeploy_set_item_cat_mr', taskType: 'MAP_REDUCE'},
        manualCommitUpdate : {scriptId: 'customscript_manual_commit_update_so', deploymentId: 'customdeploy_manual_commit_update_so', taskType: 'MAP_REDUCE'},
        manualItemArrival: {scriptId: 'customscript_manual_item_arrival', deploymentID: 'customdeploy_manual_item_arrival', taskType: 'SCHEDULED_SCRIPT'}
    };
    const HM_SCHEDULER_DEFINITIONS = {scriptID: 'customscript_hm_scheduler', deploymentID: 'customdeploy_hm_scheduler'};

    return {
        hmSchDef: HM_SCHEDULER_DEFINITIONS,
        scripts: SCRIPTS,
        fileLib: FILELIB
    };
    
});
