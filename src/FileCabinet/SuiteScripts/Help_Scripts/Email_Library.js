/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 */
define([],
    
    () => {

            /**
             * Constants
             * byGroup - key / value pairs of employ's names and emails
             * byGroup - key / value pairs of logical groupings of emails by employ name
             * emailInternalId = key / pairs description and internal id of emails inside HM NetSuite
             */
            const byName = {
                    'bridget_jensen': 'bridget@hydramaster.com',
                    'alex_ducken' : 'alex.ducken@hydramaster.com',
                    'harold_alexander' : 'harold.alexander@hydramaster.com',
                    //'louie_patayon' : 'louie.patayon@hydramaster.com',
                    'dennis_russell' : 'dennis.russell@hydramaster.com',
                    'joe_kraus' : 'joe@hydramaster.com',
                    'loren_long' : 'loren.long@hydramaster.com',
                    'robert_dobbs' : 'robert.dobbs@hydramaster.com',
                    'hm_sales' : '_us-wa-muk_saleshm@Hydramaster.com', //LOCKED
                    'hm_test' : 'testroom@hydramaster.com' //LOCKED
            };
            const byGroup = {
                    'manualCommitAlert' : [byName.alex_ducken, byName.harold_alexander, byName.dennis_russell, byName.joe_kraus], //PARTIAL LOCK
                    'boAlertList' : [byName.alex_ducken, byName.loren_long, byName.robert_dobbs], //PARTIAL LOCK
            };
            const emailInternalId = {
                    'hmSalesTeam' : 20582, //LOCKED
                    'hmPurchaseTeam' : 35289, //LOCKED
                    'hmTest' : 11241, //LOCKED
                    'purchasing': 9130,
                    'hydramaster_automated': 15446 //LOCKED
            };

        return {byName, byGroup, emailInternalId}

    });
