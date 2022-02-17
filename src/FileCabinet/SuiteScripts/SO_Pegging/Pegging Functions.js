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
            this.soPegging = contents.soPegging;
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
                    let contents = {soPegging: this.soPegging, weeklyPI: this.weeklyPI, totalS: this.totalS};
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
             * @description Attaches a work order id to a relevant sales order returns true if successful false otherwise
             * @param{int}woId
             * @param{int}soId
             * @param{int}itemId
             * @param{date}week
             * @return{boolean}
             */
            let pegWorkOrder = (woId, soId, itemId, week) => {
                try{
                    let outPut = false;
                    let index = 0;
                    this.soPegging[soId].forEach((result) =>{
                        index++;
                        if(result.itemId == itemId && result.week == week){
                            if(result.woId == null) {
                                this.soPegging[soId][index].woId = woId;
                                outPut = true
                                return false;
                            }
                            else{
                                return false;
                            }
                        }
                        else{
                            return true;
                        }
                    });
                    return outPut;
                }
                catch (e) {
                    log.error({title: 'Critical error in pegWorkOrder', details: e});
                    throw "Critical error in pegWorkOrder: " + e;
                }
            }

            /**
             * @description Marks a work order as complete.
             * @param{int}woId
             * @param{int}soId
             * @param{int}itemId
             */
            let completeWorkOrder = (woId, soId, itemId) => {
                try{
                    let index = 0;
                    this.soPegging[soId].forEach((result) => {
                        index++
                        if(result.itemId == itemId && result.woId == woId){
                            this.soPegging[soId][index].complete = true;
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                }
                catch (e) {
                    log.error({title: 'Critical error in completeWorkOrder', details: e});
                    throw "Critical error in completeWorkOrder: " + e;
                }
            }

            /**
             * @description Takes in new pegging information, itemId and updates the
             * pegging information. Validating it is a legal new peg.
             * Returning true if successful false otherwise.
             *
             * @param{Object} updateData {itemId: int, week: date, soId: int, qty: int}
             * @param{int}itemId
             * @param{date}week
             * @param{int}soId
             * @param{int}qty
             * @return boolean
             */
            let pegOrders = (itemId, week, soId, qty) => {
                try {
                    if(this.weeklyPI[week][itemId].qtyPlanned-this.weeklyPI[week][itemId].qtyPegged >= qty){
                        //Checking if SO is already included
                        if(this.soPegging[soId] == null){
                            this.soPegging[soId] = [];
                        }
                        this.soPegging.push({"itemid": itemId, "qty": qty, "week": week, "woId": null, "complete": false});
                        this.totalS[itemId].qtyPegged += qty;
                        this.weeklyPI[week].qtyPegged += qty;
                        if(this.weeklyPI[week][itemId].soIds.indexOf(soId) === -1){
                            this.weeklyPI[week][itemId].soIds.push(soId);
                        }
                        return true;
                    }
                    else{
                        return false; //New pegging canceled
                    }
                } catch (e) {
                    log.error({title: 'Critical error in pegOrders', details: e});
                    throw "Critical error in pegOrders: " + e;
                }
            };

            /**
             * @description Takes in HM JSON pegging data objects and returns an object detailing the differences
             * between the two. Assumes peggingData2 to be the earlier data and the native data to be the current data.
             * See return for output format.
             *
             * @param{Object} peggingData2
             * @return {Object} {itemId: {newOrders: [soId], canceledOrders: [soId], supplyChange: int}......}
             */
            let compileChanges = (peggingData2) => {
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
                        return true;
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
