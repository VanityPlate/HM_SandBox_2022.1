define(['N/record', 'N/search'],
    /**
     * @param{record} record
     */
    function(record, search) {

        /**
         * Global enum object holding the possible records that can be compared
         * and Global integer holding the amount of current comparable records
         */
        const ITEM = {
            0: search.Type.SERIALIZED_ASSEMBLY_ITEM,
            1: search.Type.ASSEMBLY_ITEM,
            2: search.Type.SERIALIZED_INVENTORY_ITEM,
            3: search.Type.INVENTORY_ITEM,
            4: search.Type.SERVICE_ITEM,
            5: search.Type.NON_INVENTORY_ITEM,
            6: search.Type.SALES_ORDER,
            7: search.Type.TRANSFER_ORDER
        };
        const ITEM_NUMBER = 8;

        function recursiveLoad(id, attempt){
            try{
                var output = record.load({
                    type: ITEM[attempt],
                    id: id,
                    isDynamic: true
                });
                return output;
            }
            catch(error){
                if(attempt == ITEM_NUMBER)
                    return null;
                else return recursiveLoad(id, attempt + 1)
            }
        }

        return {
            recursiveLoad: recursiveLoad,
        };

    });
