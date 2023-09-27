import {ON_SET_FIELDS} from "../constants";
import {getItem, init_db, saveItem} from "../../utils/local_db";
import {CurrencyDef, getInitRates, getInitWallet} from "../../jozdan-common-temp/currency";
import {OrderStatus} from "../../jozdan-common-temp/db";

// init_db().then(() => console.log("DB has been initialized")).catch(console.log);

function getDefCurrencies() {
    var def = {};
    for(const cur in CurrencyDef) {
        def[cur] = cur !== "irr" && cur !== "usd";
    }
    return def;
}

// const {defaultLang} = WhiteCopyConfig[ActiveWhiteCopy];


const DEF_AGENCY =  {
    "verified": true,
    "referred": true,
    "_id": "6206962642323c13b81c255c",
    "role": "AGENCY",
    "phone": "+9643333333334",
    "address": "address4",
    "uid": "tav",
    "webUrl": "https://www.bahbahan.com/",
    "supportEmail": "support@bahbahan.com",
    "supportTel": "+44 77 0030 5564",
    "logo2": "static/logo2-tav.png",
    "logo3": "static/logo3-tav.png",
    "displayName": "TAV Energy",
    "copyrightTitle": "Copyright BAHBAHAN Project (c) 2022",
    "defaultLang": "fa",
    "hideSelectCurrencies": false,
    "aid": "tav",
    "bid": "tav",
    "supportTel2": "+1 (814) 618-3594",
    "wid": "0002537753116512",
    "createdAt": "2022-02-11T17:00:22.681Z",
    "updatedAt": "2022-02-11T17:00:22.681Z",
    "__v": 0
};

// const DEF_AGENCY = {"_id": "61e5b5c02db6b039b8ade325","verified":true,"referred":false,"role":"AGENCY","password":"$2b$10$q657hAn5nMaleQX17Jvouu4TWJICNrPVcFyDGCYyxHin9B6Uf0Szm","phone":"+9643333333333","address":"address3","uid":"bahbahan","webUrl":"https://www.bahbahan.com/","supportEmail":"support@bahbahan.com","supportTel":"+44 77 0030 5564","logo2":"static/logo2-bahbahan.png","logo3":"static/logo3-bahbahan.png","displayName":"BAHBAHAN","copyrightTitle":"Copyright BAHBAHAN Project (c) 2022","defaultLang":"ar","hideSelectCurrencies":false,"aid":"bahbahan","bid":"bahbahan","supportTel2":"+1 (814) 618-3594","wid":"0002537753115983","createdAt":{"$date":"2022-01-17T18:30:24.187Z"},"updatedAt":{"$date":"2022-01-17T18:30:24.187Z"},"__v":0};

/*
const DEF_AGENCY = {
    "verified": false,
    "referred": false,
    "_id": "60687852b2389c0940498653",
    "role": "AGENCY",
    "password": "$2b$10$.FcLwfllAUZ6KLqzOdWKEuEM.ORvVqzE4uBF7kUW5fMAurpBZhXNG",
    "phone": "+983333333333",
    "address": "address3",
    "uid": "nnw2",
    "webUrl": "http://www.nonamewallet.com",
    "supportEmail": "support@nonamewallet.com",
    "supportTel": "+44 77 0030 5564",
    "logo2": "static/logo2-nnw.png",
    "logo3": "static/logo3-nnw.png",
    "displayName": "No Name Wallet",
    "copyrightTitle": "Copyright NO Name Wallet Project (c) 2020",
    "defaultLang": "en",
    "hideSelectCurrencies": false,
    "wid": "0002537753114119",
    "aid": "nnw2",
    "createdAt": "2021-04-03T14:14:42.828Z",
    "updatedAt": "2021-07-09T11:35:41.362Z",
    "bid": "nnw2",
    "supportTel2": "+1 (814) 618-3594"
};
*/

export function getInitState() {
    return {

        // branch: undefined,
        // user: undefined, // getItem("user", undefined),
        // wallet: getInitWallet(),
        // rates: getInitRates(),
        // mainTabIndex: 0,
        // orderStatus: OrderStatus.issued,
        // loader: false,
        //
        // token: undefined,

        //config
        agency: getItem("agency", DEF_AGENCY),
        lang: getItem("lang", "fa"),
        langChanged: getItem("langChanged", ""),
        // chart: getItem("chart", 1),
        currencies: getItem("currencies", getDefCurrencies() ),
        genConfig: getItem("genConfig", {}),
        phone: getItem("phone", null),
        password: getItem("password", null),


        testLoader: 0,
        notif: undefined,
        openRegister: false,

        ticket_token: null,
    }
}

export const INIT_STATE = {

    branch: undefined,
    user: undefined, //getItem("user", undefined),
    wallet: getInitWallet(),
    rates: getInitRates(),
    mainTabIndex: 0,
    orderStatus: OrderStatus.issued,
    loader: false,

    token: undefined,

    ticket_token: undefined,

    //config
    lang: "fa",
    chart: 1,
    currencies: {},
    genConfig: {},
};

export default function (state = INIT_STATE, action) {
    const {type, payload} = action;

    // if(type === "INIT_DB") return getInitState();

    if (type !== ON_SET_FIELDS) return state;

    const {dictValues, save} = payload;
    if (save) {
        for (const key of Object.keys(dictValues)) {
            const value = dictValues[key];
            saveItem(key, value);
        }
    }
    return {...state, ...dictValues};
}
