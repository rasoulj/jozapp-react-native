import {toUpperCase} from "../currency";
import {P, T} from "../../i18n";



export function commafy(num) {
    if (!num) return '0';
    var str = num.toString().split('.');

    if (str[0].length >= 4  ) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }

    return str.join('.');
}

export function toTwoDigit(num) {
    // console.log("num", num);
    // if(num === undefined || num === null || isNaN(num)) return "0.00";
    // const price = (Math.round(num * 100) / 100).toFixed(2);
    return `${commafy(toTwoDigitNoComma(num)+'')}`;
}

export function toTwoDigitNoComma(num) {
    // console.log("num", num);
    if(num === undefined || num === null || isNaN(num)) return "0.00";
    return (Math.round(num * 100) / 100).toFixed(2);
    // return price;
}


export function random(lb = 0, up = 100, pre = 100) {
    return lb + Math.floor(up * Math.random()) / pre;
}

export function randomInt(lb = 0, up = 100) {
    return lb + Math.floor((up-lb) * Math.random());
}


const UnknownError = "Unknown error!";

export function getErrorMessage(err, len = 40) {
    if(len < 0) return getErrorMessageInner(err);
    return trimLen(getErrorMessageInner(err), len);
}

function getErrorMessageInner(err) {
    // console.log("err-err", err, err.message, typeof err);
    // console.log("eeeeeerror", err);
    if (!err) {
        return UnknownError;
    } else {
        if(typeof err === "string") return err;
        if (typeof err === 'object') {
            const { message, request } = err;
            if(message) return message;
            if (request) {
                return request._response || UnknownError;
            }
            else return message || UnknownError;
        } else {
            return (typeof err === 'string') ? err : UnknownError;
        }
    }
}

export function trimLen(str, len = 20) {
    return !str ? str : str.substring(0, len);
}


export function validPassword(pass) {
    return !!pass && pass.length >= 6;
}


const ONE_DAY = 1000 * 60 * 60 * 24;
export function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now-start) / ONE_DAY) - 1;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(d) {
    // const d = new Date();
    return MONTHS[d.getMonth()]+" "+(d.getDate());
}

export function pastDays(days = 1) {
    let date = new Date();
    return formatDate(new Date(date-days*ONE_DAY));//.toLocaleDateString();
    // return date;
}

export function range(from = 0, to = 100) {
    let arr = [];
    for(let i=from; i<to; i++) arr.push(i);
    return arr;
}

export function getPastDays(interval, len) {
    let dd = new Date();
    // dd.add(-3, 'days');
    // console.log(dd, addDays(dd, -5));
    const offset = range(0, 366);
    const f = offset.filter((p, index) => index%interval === 0).slice(0, len).map(pastDays);
    return f.reverse();
}

export function chunck(arr = [], len = 3) {
    let ret = [];
    for(let i=0; i<arr.length; i+=len) ret.push(arr.slice(i, i+len));
    return ret;
}

export function union(arr1, arr2) {
    let l = arr1 || [];
    for(let a of arr2) {
        if(!l.includes(a)) l.push(a);
    }
    return l;

}

export function camelCase(s) {
    return P(`OrderTypes.${s}`);
    if(!s || s.length < 1) return s;
    return s[0].toUpperCase()+s.substring(1);
}

