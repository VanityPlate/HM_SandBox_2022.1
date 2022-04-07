/**
 * @copyright Alex S. Ducken 2021 alexducken@gmail.com
 */
define(['N/search'],
/**
 * @param{search} search
 */
function(search) {

    /**
     * Searches for internal id of item returns null if none found
     * @param external
     * @return {null|number}
     */
    function item(external){
        var find = search.create({
            type: search.Type.ITEM,
            filters: ['name', 'is', external]
        });

        var result = find.run().getRange({start: 0, end: 10});

        if(result.length == 0)
            return null;
        else
            return result[0].id;
    }

    return {
        item: item
    };
    
});
