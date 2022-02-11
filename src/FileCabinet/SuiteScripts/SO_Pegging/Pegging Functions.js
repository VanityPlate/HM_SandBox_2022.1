/**
 *
 * @copyright Alex S. Ducken 2022 alexducken@gmail.com
 * HydraMaster LLC
 *
 * @NApiVersion 2.1
 */
define(["N/file"],
    
    (file) => {


        /**
         *@description takes a file path and initializes the HMPeggedOrders object using the JSON stored in the file
         *
         * @param{string}filePath
         */
        let HMPeggedOrders = (filePath) => {

            //Loading and parsing file into JS Object
            let loadedFile = file.load({
                id: filePath
            });
            let contents = JSON.parse(loadedFile.getContents());

            //Initializing Variables
            this.itemP = contents.itemP;
            this.weeklyPI = contents.weeklyPI;
            this.totalS = contents.totalS;

            /**
             * @description Takes a file path and name and saves the current pegging information to the file. Returns
             * true is successful and false otherwise.
             *
             * @param{string}fileName
             * @param{sting}filePath
             * @return{boolean}
             */
            let savePegging = (fileName,filePath) => {
                try{
                    let contents = {itemP: this.itemP, weeklyPI: this.weeklyPI, totalS: this.totalS};
                    contents = JSON.stringify(contents);
                    file.save({
                        name: fileName,
                        fileType: file.Type.JSON,
                        contents: contents
                    });
                }
                catch (e) {
                    log.error({title: 'Critical error in savePegging', details: e});
                    throw "Critical error in savePegging: " + e;
                    return false;
                }
            };

            /**
             *@description Takes an item's internal id returning an object
             * with the total number of planned builds and pegged builds for that item.
             *
             *@param{Int} itemId
             *@returns{Object} object {itemId: int, qtyPlanned: int, qtyPegged: int}
             */
            let pullTotals = (itemId) => {
                try {
                    let objectOut = {itemId: itemId, qytPlanned: null, qtyPegged: null};
                    objectOut.qtyPlanned = this.totalS[itemId].qtyPlanned;
                    objectOut.qtyPegged = this.totalS[itemId].qtyPegged;
                    return objectOut;

                } catch (e) {
                    log.error({title: "Critical error in pullTotals", details: e});
                    throw "Critical error in pullTotals: " + e;
                }
            };

            /**
             * @description Takes in new pegging information (see peggingData for format), itemId and updates the
             * pegging information. Validating it is a legal new peg.
             * Returning true if successful false otherwise.
             *
             * @param{Object} updateData {itemId: int, saleOrders: [{soId: int, qty: int, week: date}......]}
             * @param{Int} itemId
             * @return boolean
             */
            let pegOrders = (updateData, itemId) => {
                try {

                } catch (e) {
                    log.error({title: 'Critical error in pegOrders', details: e});
                    throw "Critical error in pegOrders: " + e;
                }
            };

            /**
             * @description Takes in two HM JSON pegging data objects and returns an object detailing the differences
             * between the two. Assumes peggingData1 to be the earlier data and the peggingData2 to be the current data.
             * See return for output format.
             *
             * @param{Object} peggingData1
             * @param{Object} peggingData2
             * @return {Object} {itemId: {newOrders: [soId], canceledOrders: [soId], lateOrders: [soId], supplyChange: int}......}
             */
            let compileChanges = (peggingData1, peggingData2) => {
                try {

                } catch (e) {
                    log.error({title: 'Critical error in compileChanges', details: e});
                    throw "Critical error in compileChanges: " + e;
                }
            };

            /**
             * @description Updates the HM JSON pegged orders object total supply for a given item,
             * managing the entire object which is to say un-pegging orders when demand can no longer be met.
             * Returns true of successful false otherwise.
             *
             * @param{Object} peggedOrders
             * @param{Int} itemId
             * @param{Int} qty
             * @return{boolean}
             *
             */
            let updateTotals = (peggedOrders, itemId, qty) => {
                try {

                } catch (e) {
                    log.error({title: 'Critical error in updateTotals', details: e});
                    throw "Critical error in updateTotals: " + e;
                }
            };

            /**
             * @description Updates quantities and status on a Sales Order. Managing the larger HM JSON pegged data
             * object at the same time. Returns true if successful and false if failed.
             *
             * @param{Object} updates {workId: int, qty: int, week: date, dropper: boolean, complete: boolean}
             * @param{int} soId
             * @param{int} item
             * @param{Object} peggedOrders
             * @return{boolean}
             */
            let updateOrder = (updates, soId, item, peggedOrders) => {
                try {

                } catch (e) {
                    log.error({title: 'Critical error in updateOrder', details: e});
                    throw "Critical error in updateOrder: " + e;
                }
            };

            /**
             * @description Un-pegs a sales order from HM JSON pegged orders object. Manages data wide updates
             * Returns true if successful and false otherwise.
             *
             * @param{Object} peggedOrders
             * @param{int} saleId
             * @param{int} item
             * @return{boolean}
             */
             let unpegOrder = (peggedOrders, saleId, item) => {
                try {

                } catch (e) {
                    log.error({title: 'Critical error in unpegOrder', details: e});
                    throw "Critical error in unpegOrder: " + e;
                }
            };

        }

        /**
         * @description pulls a complete list of current supply and returns it as totalS format for HM JSON
         * order pegging object
         *
         * @return{object} {weeklyPI: {object}, totalS: {object}}
         */
        let pullSupply = () => {
            try{
                let objectOut = {weeklyPI: null, totalS: null};
                let weeklyPI = {};
                let totalS = {};
                let itemDemandPlan = search.create({
                    type: "itemdemandplan",
                    filters:
                        [
                            ["demanddate","onorafter","today"],
                            "AND",
                            ["quantity","greaterthan","0"]
                        ],
                    columns:
                        [
                            search.createColumn({name: "item", label: "Item"}),
                            search.createColumn({
                                name: "demanddate",
                                sort: search.Sort.ASC,
                                label: "Demand Date"
                            }),
                            search.createColumn({name: "quantity", label: "Quantity"})
                        ]
                });
                let pagedData = itemDemandPlan.runPaged({pageSize: 500});
                for(let x = 0; x < pagedData.pageRanges.length; x++){
                    let currentPage = pagedData.fetch(x);
                    currentPage.forEach(function (result){
                        let qty =  result.getValue({name: "quantity"});
                        let item = result.getValue({name: 'item'});
                        weeklyPI[result.getValue({name: "demanddate"})][item] = qty;
                        totalS[item] =+ qty;
                    });
                }
                objectOut.weeklyPI = weeklyPI;
                objectOut.totalS = totalS;
                return objectOut;
            }
            catch (e) {
                log.error({title: 'Critical error in pullSupply', details: e});
                throw "Critical error in pullSupply: " + e;
            }
        }

        return {HMPeggedOrders, pullSupply}

    });
