/**
 *
 * @copyright Alex S. Ducken 2021 alexducken@hydramaster.com
 * HydraMaster LLC
 *
 * Updated 1/5/2022 Price changes and percentiles added for classes. Surcharge no longer related to dates.
 * Update 3/28/2022 Included DATEREF to change the business logic to account for dates of creation on sales orders
 *
 * @NApiVersion 2.1
 */
define([],
    
    () => {


        const chargesByClass = {
            19: {surchargePercent:  .1 ,surchargeFlat: -1}, //Chemicals
            78: {surchargePercent: .08, surchargeFlat: -1}, //Parts
            3: {surchargePercent: .1, surchargeFlat: -1}, //Accessories HM Tools
            4: {surchargePercent: .1, surchargeFlat: -1}, //DRIMASTER
            5: {surchargePercent: .1, surchargeFlat: -1}, //EVOLUTION WAND
            6: {surchargePercent: .1, surchargeFlat: -1}, //OTHER TOOL ACCESSORIES
            8: {surchargePercent: .1, surchargeFlat: 452.00}, //RX-15
            9: {surchargePercent: .1, surchargeFlat: 452.00}, //RX-20
            10: {surchargePercent: .1, surchargeFlat: -1}, //STEEL WANDS
            11: {surchargePercent: .1, surchargeFlat: -1}, //Accessories Truckmount
            12: {surchargePercent: .1, surchargeFlat: -1}, //APO
            13: {surchargePercent: .1, surchargeFlat: -1}, //CRADLE TANK
            14: {surchargePercent: .1, surchargeFlat: -1}, //FRESH WATER TANK
            15: {surchargePercent: .1, surchargeFlat: -1}, //OTHER TM ACCESSORIES
            16: {surchargePercent: .1, surchargeFlat: -1}, //REELS
            17: {surchargePercent: .1, surchargeFlat: -1}, //SHELVES
            18: {surchargePercent: .1, surchargeFlat: -1}, //VACUUM/SOLUTION HOSE
            71: {surchargePercent: .0, surchargeFlat: 1140.00}, //Titan 325
            72: {surchargePercent: 0, surchargeFlat: 1228.80}, //Titan 425
            73: {surchargePercent: 0, surchargeFlat: 1610.10}, //Titan 575
            114: {surchargePercent: 0, surchargeFlat: 1797.45}, //Titan 625
            124: {surchargePercent: 0, surchargeFlat: 1378.42}, //CDS 4.8 SV
            76: {surchargePercent: 0, surchargeFlat: 1560.00}, //TMTG 4000
            75: {surchargePercent: 0, surchargeFlat: 1476.00}, //TITAN H2O
            22: {surchargePercent: 0, surchargeFlat: 1228.42}, //CDS 4.8
            24: {surchargePercent: 0, surchargeFlat: 1050.00}, //CDS XDRIVE
            34: {surchargePercent: 0, surchargeFlat: 882.70}, //PEX 500
            23: {surchargePercent: 0, surchargeFlat: 1378.42}, //CDS FLEX
            115: {surchargePercent: 0, surchargeFlat: 1378.42}, //CDS HIACE
            26: {surchargePercent: 0, surchargeFlat: 1378.42}, //CDS ZER-REZ
            52: {surchargePercent: 0, surchargeFlat: 1140.00}, //Boxxer 318
            63: {surchargePercent: 0, surchargeFlat: 1140.00}, //DIAMOND
            58: {surchargePercent: 0, surchargeFlat: 1228.80}, //Boxxer XL
            55: {surchargePercent: 0, surchargeFlat: 1228.80}, //Boxxer 423
            64: {surchargePercent: 0, surchargeFlat: 1228.80}, //DIAMOND
            112: {surchargePercent: 0, surchargeFlat: 1228.80}, //CTS 403

        };

        //Updated 3/28/2022
        const DATEREF = {newYear: Date.parse(new Date(2022, 1, 1))};

        const chargesById = {
            3003: {surchargePercent: 0, defaultCharge: 330.00}, //000-047-028 18hp
            15957: {surchargePercent: 0, defaultCharge: 330.00}, //000-047-044 18hp modified
            3005: {surchargePercent: 0, defaultCharge: 475.00}, //000-047-037 23hp
            15956: {surchargePercent: 0, defaultCharge: 475.00}, //000-047-043 23hp modified
            3006: {surchargePercent: 0, defaultCharge: 500.00}, //000-047-040 31hp
            //Below Added on 1/5/2022 As Part of New Surcharge
            15546: {surchargePercent: 0, defaultCharge: 1140.00}, //750-012-751-10
            15541: {surchargePercent: 0, defaultCharge: 1140.00}, //750-011-751-10
            15547: {surchargePercent: 0, defaultCharge: 1228.80}, //750-012-752-10
            15542: {surchargePercent: 0, defaultCharge: 1228.80}, //750-011-752-10
            15548: {surchargePercent: 0, defaultCharge: 1160.40}, //750-012-753-10
            15543: {surchargePercent: 0, defaultCharge: 1610.40}, //750-011-753-10
            26871: {surchargePercent: 0, defaultCharge: 1797.45}, //750-012-759-10
            26872: {surchargePercent: 0, defaultCharge: 1797.45}, //750-011-759-10
            15552: {surchargePercent: 0, defaultCharge: 1560.00}, //750-013-756-10
            15522: {surchargePercent: 0, defaultCharge: 1476.00}, //750-010-743-10
            15569: {surchargePercent: 0, defaultCharge: 1228.42}, //751-011-701-10
            26881: {surchargePercent: 0, defaultCharge: 1378.42}, //751-011-744-10
            15610: {surchargePercent: 0, defaultCharge: 1050.00}, //751-024-705-10
            15407: {surchargePercent: 0, defaultCharge: 452.00}, //700-041-030
            15435: {surchargePercent: 0, defaultCharge: 452.00}, //700-041-333
            15436: {surchargePercent: 0, defaultCharge: 452.00}, //700-041-334
            15410: {surchargePercent: 0, defaultCharge: 452.00}, //700-041-035
            15237: {surchargePercent: 0, defaultCharge: 560.63}, //56384887
            15238: {surchargePercent: 0, defaultCharge: 882.70}, //56385431
            //Tread Master Pricing added 1/10/2022
            15223: {surchargePercent: 0.07, defaultCharge: -1, datePrior: DATEREF.newYear}, //100-100-004
            15220: {surchargePercent: 0.07, defaultCharge: -1, datePrior: DATEREF.newYear}, //100-100-001
            15225: {surchargePercent: 0.07, defaultCharge: -1, datePrior: DATEREF.newYear}, //100-100-006
            15221: {surchargePercent: 0.07, defaultCharge: -1, datePrior: DATEREF.newYear}, //100-100-002
            15224: {surchargePercent: 0.07, defaultCharge: -1, datePrior: DATEREF.newYear}, //100-100-005
            15222: {surchargePercent: 0.07, defaultCharge: -1, datePrior: DATEREF.newYear}, //100-100-003
            1960: {surchargePercent: 0.07, defaultCharge: -1}, //000-031-105
            17742: {surchargePercent: 0.07, defaultCharge: -1}, //190-100-010
            17743: {surchargePercent: 0.07, defaultCharge: -1}, //190-100-011
            17748: {surchargePercent: 0.07, defaultCharge: -1}, //190-100-016
            17744: {surchargePercent: 0.07, defaultCharge: -1}, //190-100-012
            17747: {surchargePercent: 0.07, defaultCharge: -1}, //190-100-015
            17745: {surchargePercent: 0.07, defaultCharge: -1}, //190-100-013
            1744: {surchargePercent: 0.07, defaultCharge: -1}, //000-016-060
            3082: {surchargePercent: 0.07, defaultCharge: -1}, //000-049-115
            16558: {surchargePercent: 0.07, defaultCharge: -1}, //000-078-201
            16560: {surchargePercent: 0.07, defaultCharge: -1}, //000-078-203
            16561: {surchargePercent: 0.07, defaultCharge: -1}, //000-078-205
            17513: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-040
            17517: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-044
            17512: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-039
            17518: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-045
            17511: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-038
            17519: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-046
            17508: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-034
            17514: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-041
            17509: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-036
            17515: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-042
            17510: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-037
            17516: {surchargePercent: 0.07, defaultCharge: -1}, //101-100-043
        };
        
        const surchargeItem = 27666;

        return {chargesByClass, surchargeItem, chargesById}

    });
