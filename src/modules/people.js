// This module handles the owner register
(function (P) {
    var _fillDB;

    P.init = function () {
        P.Owners = P.Owners || new P.Collections.Owners();
        P.Owners.fetch();

        if (P.Owners.length !== P.register.length) {
            localStorage.clear();
            _fillDB(P.Owners, P.register);
        }
    };

    P.Models.Owner = Backbone.Model.extend({ });

    P.Collections.Owners = Backbone.Collection.extend({
        model: P.Models.Owner,
        localStorage: new Store('ReindeerOwners'),
    });

    P.Areas = {
        2: {
            name: 'Sør-Trøndelag/Hedmark',
            districts: {
                7: {'name': 'ØG TROLLHEIMEN'},
                8: {'name': 'UW 3 - ELGÅ'},
                9: {'name': 'UX 2 - RIAST/HYLLING'},
                10: {'name': 'UY 4 - FEMUND (VINTERDISTRIKT)'},
                11: {'name': 'UZ 1 - ESSAND'},
            }
        },
        3: {
            name: 'Nord-Trøndelag',
            districts: {
                72: {'name': 'VA 7 - GASKEN-LAANTE'},
                73: {'name': 'VF 8 - SKÆHKERE'},
                74: {'name': 'VG 9 - LÅARTE'},
                75: {'name': 'VJ 10 - TJÅEHKERE SIJTE'},
                76: {'name': 'VM 11 - ÅARJEL-NJAARKE'},
                77: {'name': 'VR 6 - FOVSEN-NJAARKE'},
            }
        },
        4: {
            name: 'Nordland',
            districts: {
                60: {'name': 'WA 18 - VOENGELH-NJAARKE'},
                61: {'name': 'WB 20 - JILLEN-NJAARKE'},
                62: {'name': 'WD 19 - BYRKIJE'},
                63: {'name': 'WF 21 - RØSSÅGA/TOVEN'},
                64: {'name': 'WK 23 - HESTMANNEN/STRANDTINDENE'},
                65: {'name': 'WL 22 - ILDGRUBEN'},
                66: {'name': 'WN 24 - SALTFJELLET'},
                67: {'name': 'WP 25 - BALVATN'},
                68: {'name': 'WR 26 - DUOKTA'},
                69: {'name': 'WS 27 - STAJGGO/HÁBMER'},
                70: {'name': 'WX 28 - FROSTISEN'},
                71: {'name': 'WZ 29 - SKJOMEN'},
            }
        },
        5: {
            name: 'Troms',
            districts: {
                46: {'name': 'XA 34 - KANSTADFJORD/VESTRE HINNØY'},
                47: {'name': 'XD 36 - TJELDØY'},
                48: {'name': 'XE 23 - KONGSVIKDALEN'},
                49: {'name': 'XG 22 - GROVFJORD'},
                50: {'name': 'XH 16 - SØR-SENJA'},
                51: {'name': 'XJ 15 - NORD-SENJA'},
                52: {'name': 'XK 14 - KVALØY'},
                53: {'name': 'XL 12 - RINGVASSØY'},
                54: {'name': 'XN 13 - REBBENESØY'},
                55: {'name': 'XØ 21 - GIELAS'},
                56: {'name': 'XP 10 - VANNØY'},
                57: {'name': 'XU 17/18 - TROMSDALEN'},
                58: {'name': 'XW 24 - BASSEVUOVDI'},
                59: {'name': 'XZ 20 - HJERTTIND'},
            }
        },
        6: {
            name: 'Vest-Finnmark',
            districts: {
                21: {'name': 'YA 19 - SÁLLAN'},
                22: {'name': 'YB 20 - FÁLÁ/KVALØY'},
                23: {'name': 'YC 21 - GEARRETNJÁRGA'},
                24: {'name': 'YD 22 - FIETTAR'},
                25: {'name': 'YE 23 - SEAINNUS/NÁVGGASTAT'},
                26: {'name': 'YF 24A - OARJE-SIEVJU'},
                27: {'name': 'YG 24B - NUORTA-SIEVJU'},
                28: {'name': 'XM 11T - RÁIDNÁ '},
                29: {'name': 'XR 33T - ITTUNJÁRGA'},
                30: {'name': 'XT 19/32T - IVGOLÁHKU'},
                31: {'name': 'YH 25 - STIERDNÁ'},
                32: {'name': 'YI 41 - BEASKÁDAS'},
                33: {'name': 'YJ 26 - LAKKONJÁRGA'},
                34: {'name': 'YK 27 - JOAHKONJÁRGA'},
                35: {'name': 'YL 28 - CUOKCAVUOTNA'},
                36: {'name': 'YM 29 - SEAKKESNJÁRGA JA SILDÁ'},
                37: {'name': 'YN 32 - SILVVETNJÁRGA'},
                38: {'name': 'YP 33 - SPALCA'},
                39: {'name': 'YX 40 - ORDA'},
                40: {'name': 'YR 34 - ÁBBORAŠŠA'},
                41: {'name': 'YS 35 - FÁVRROSORDA'},
                42: {'name': 'YT 36 - COHKOLAT'},
                43: {'name': 'YU 37 - SKÁRFVÁGGI'},
                44: {'name': 'YW 39 - ÁRDNI/GÁVVIR'},
                45: {'name': 'YY 42 - BEAHCEGEALLI'},
                78: {'name': 'YY 30 A OARBEALLI'},
                79: {'name': 'YY 30 B GUOVDAJOHTOLAT'},
                80: {'name': 'YY 30 C NUORTABEALLI'},
            }
        },
        7: {
            name: 'Øst-Finnmark',
            districts: {
                1: {'name': 'ZA 1/2/3 - ØSTRE SØR-VARANGER'},
                2: {'name': 'ZB 5A - PASVIK'},
                3: {'name': 'ZC 4/5B -  VESTRE SØR-VARANGER'},
                4: {'name': 'ZD 6 - VÁRJJATNJÁRGA'},
                5: {'name': 'ZE 7 - RÁKKONJÁRGA'},
                6: {'name': 'ZF 9 - OLGGUT CORGAŠ/OARJE-DEATNU'},
                17: {'name': 'ZG 13 - LÁGESDUOTTAR'},
                18: {'name': 'ZH 14 - SPIERTTANJÁRGA'},
                19: {'name': 'ZJ 14A - SPIERTTAGÁISÁ'},
                20: {'name': 'ZS 16 - KÁRÁŠJOGA OARJJABEALLI'},
                81: {'name': '17 KARASJOK ØSTRE VÅR/HØST/VINTERBEITE'}
            }
        }
    };

    // Utility function s
    _fillDB = function (collection, rawData) {
        _.each(rawData, function (p) {
            collection.create(p);
        });
    };

}(REINMERKE.module('people')));
