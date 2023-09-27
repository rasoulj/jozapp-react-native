import {AppRegistry, I18nManager} from 'react-native';


// import I18n from "./i18n"
// export function T(id) {
//     try {
//         return I18n.t(id) || id + "-" + I18n.locale;
//     } catch (e) {
//         return id;
//     }
// }
//
// // I18n.locale = "fa";
//
// export function changeLanguage(lang) {
//     I18n.locale = lang;
//     // I18n.changeLanguage(lang);
// }
//
// export default T;


import en from "./locales/en";
import fa from "./locales/fa";
import ar from "./locales/ar";
import ckb from "./locales/ckb";
import tr from "./locales/tr";
import zh from "./locales/zh";
// import {WhiteCopyConfig} from "../utils";
// import {ActiveWhiteCopy} from "../consts";

const lang = {
    fa, en, ar, ckb, tr, zh
};

// let currentLang = "en";
// const {defaultLang} = WhiteCopyConfig[ActiveWhiteCopy];

let currentLang = "fa";

console.log("currentLang", currentLang);

const RTLs = ["fa", "ar"];

export function isRTL() {
    return RTLs.includes(currentLang);
}

export function changeLanguage(language) {
    console.log("changeLanguage-lang", language);
    // console.log(Object.keys(lang));
    currentLang = language;
    I18nManager.forceRTL(language === "fa" || language === "ar");
}

export function T(id, lan, options) {
    // console.log("currentLang", currentLang, id, lang[currentLang][id]);
    let ret = lang[lan || "en"][id] || id;
    if(!options) return ret;

    const len = options.length;
    for(let i=0; i<len; i++) {
        ret = ret.split(`{${i}}`).join(options[i])
    }
    return ret;
}

export function P(id, options) {
    // console.log("currentLang", currentLang, id, lang[currentLang][id]);
    let ret = lang[currentLang || "en"][id] || id;
    if(!options) return ret;

    const len = options.length;
    for(let i=0; i<len; i++) {
        ret = ret.split(`{${i}}`).join(options[i])
    }
    return ret;
}


export function getChevron() {
    return isRTL() ? "chevron-left" : "chevron-right";
}
