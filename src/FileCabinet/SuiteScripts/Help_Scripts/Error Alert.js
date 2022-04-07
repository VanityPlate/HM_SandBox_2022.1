/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 */
define(['SuiteScripts/Help_Scripts/hm_sweet_alert_2.js'],
    
    (sAlert) => {

            /**
             * @define displays an error message to client when called
             * @param error {string} text of error message
             */
        let errorMessage = (error) => {
                sAlert.fire({
                        icon: 'error',
                        title: 'That\'s a whoopsie.',
                        text: error
                });
        }

        return {errorMessage}

    });
