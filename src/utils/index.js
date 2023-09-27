import {CurrencyDef} from "../jozdan-common-temp/currency";

export function getParams(route, strParams = '') {
    let ob = {};
    const {params} = route;
    // console.log(params);
    if(!params) return ob;
    for(const f of strParams.split(' ')) ob[f] = params[f];
    return ob;
}

export function trimAll(str) {
    return (str || "").trim();
}

export function getActiveCurrencies(currencies = {}, defCurrency = undefined) {
    return Object.keys(CurrencyDef).filter(cur => cur !== defCurrency && !currencies[cur]);
}

function isNumeric(username) {
    if(!username) return false;
}

function formatDate(date) {
    return date.toLocaleDateString() + ", " + date.toLocaleTimeString();
}

export function toLongDate(updatedAt) {
    return !updatedAt ? "N/A" : formatDate(new Date(updatedAt));
}

export function getUserName(username) {
    if(!username || username.length < 1) return username;
    let u = trimAll(username);
    if(u.startsWith("+")) u = u.substring(1);
    let num = /^\d+$/.test(u);

    return num ? `${u}@nnw.click` : u;
}

const FLAGS = {
    usd: require("../assests/flags/usd.png"),
    iqd: require("../assests/flags/iqd.png"),
    aud: require("../assests/flags/aud.png"),
    aed: require("../assests/flags/aed.png"),
    eur: require("../assests/flags/eur.png"),
    gbp: require("../assests/flags/gbp.png"),
    irr: require("../assests/flags/itc.png"),
    cad: require("../assests/flags/cad.png"),

    ckb: require("../assests/flags/ckb.png"),
    try: require("../assests/flags/tr.png"),
    cny: require("../assests/flags/zh.png"),


};

export function getFlagSource(cur) {
    return FLAGS[cur || CurrencyDef.iqd];
}

export function removeCommas(amount) {
    if(!amount) return 0;
    return 1*((amount || "").split(",").join(""));
}

export function getNetError(lang) {
    return {notif: {title: "**Error: No Connection", body: "Please check your internet connectivity,"}};
}

/*
export function getLogo() {
    switch (ActiveWhiteCopy) {
        case WhiteCopies.nnw: return require("../assests/logo-nnw.png");
        case WhiteCopies.fanoos: return require("../assests/logo-fanoos.png");
        case WhiteCopies.maabar: return require("../assests/logo-maabar.png");
        default: require("../assests/logo-nnw.png");
    }
}
*/

// const webUrl = "www.nonamewallet.com";
// const supportEmail = "support@nonamewallet.com";
// const supportTel = "+964 783 170 8035";

/*
export const WhiteCopyConfig = {
    [WhiteCopies.nnw]: {
        defaultLang: "en",
        webUrl: "www.nonamewallet.com",
        supportEmail: "support@nonamewallet.com",
        supportTel: "+964 783 170 8035",
    },
    [WhiteCopies.fanoos]: {
        defaultLang: "fa",
        webUrl: "www.nonamewallet.com",
        supportEmail: "support@nonamewallet.com",
        supportTel: "+964 783 170 8035",
    },
    [WhiteCopies.maabar]: {
        defaultLang: "ar",
        webUrl: "www.nonamewallet.com",
        supportEmail: null,
        supportTel: null,

        hideSelectCurrencies: true,
    },
};
*/


export const combinePP = (prefix, phone) => {
    console.log("prefix, phone", prefix, phone);

    if(!prefix || prefix.length === 0) return phone;

    const prefix1 = prefix[0] === "+" ? prefix : `+${prefix}`;

    if(!phone || phone.length === 0) return prefix1;

    if(phone[0] === '0') return prefix1+phone.substring(1);
    else return prefix1+phone;
};
