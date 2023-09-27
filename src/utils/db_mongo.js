import {C, OrderStatus, OrderTypes} from "../jozdan-common-temp/db";
import {T} from "../i18n";
import {getCurrencyName} from "../jozdan-common-temp/currency";
import {stdCustomerNumber} from "../jozdan-common-temp/account";
import {camelCase, toTwoDigit} from "../jozdan-common-temp/utils";
import {Colors} from "react-native-paper";

const serverToken = "AAAASq7-ohM:APA91bGxLcOfw69XhSl0mJnQ026YqhyBLriCS3E-5gQDjpiOkm34H_GUJJKrFGBHQkuiB35ph90r4LcMH7XtU0FuMAuhImhu5agT-kC7xg37YSNOKaAjtsT8_SMiwoHNBuCUgYyFiWhp";

export function getOnError(page) {
    return !page ? console.log : err => {
        console.log(JSON.stringify(err));
        page.setToast(err + "", Colors.red600);
    };
}


// export const baseApiUrl = "http://192.168.211.138:2537";
// export const baseApiUrl = "http://192.168.1.9:2537";
export const baseApiUrl = "http://157.90.207.53:2537";
const axios = require('axios');//.default;


export function setAuthToken(token) {
    axios.defaults.headers.common['x-access-token'] = token;
}


function sendTranNotification(transaction, user, lang) {
    const {token} = user || {};
    if (!token) return;
    console.log("desc", transaction);
    const {wid, amount, cur, type} = transaction;
    const body = getTransDesc(transaction, user, lang);

    const notification_body = {
        notification: {body, title: `${camelCase(type)} ${toTwoDigit(amount)} ${getCurrencyName(cur)}`, sound: 'default',},
        priority: "high",
        data: {more: "Salaam", id: 1, sound: 'default'},
        apns: { payload: { aps: { sound: 'default', } } },
        registration_ids: [token]
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            // replace authorization key with your key
            'Authorization': `key=${serverToken}`,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(notification_body)
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.error(error);
    });


    // console.log(`NOTIF: ${type} ${desc}`);
}


export function sendNotificationForTransactions(transactions, setLoader, onDone, onError, lang) {
    // const {wid, amount, cur, desc, type} = transaction;
    const wids = transactions.map(t => t.wid);
    // console.log("wids", wids);
    loadUsersByWid(wids, setLoader, users => {
        for (const transaction of transactions) {
            const {wid} = transaction;
            const user = users.find(u => u.wid === wid);
            sendTranNotification(transaction, user, lang);
            // console.log("tran", tran);
        }
        if(onDone) onDone();
        // console.log("users", users.map(p => p.token));
    }, onError);


}

export const createOrderNo = function () {

    const r = Math.floor(1000*Math.random());
    const rand = r < 100 ? "0"+r : r < 10 ? "00"+r : ""+r;

    const now = Date.now();

    const cc = now+rand;
    // console.log(cc);
    return cc.substring(cc.length-16);

};


export function getTransDesc(trans, user, lang) {

    if(!trans || !user) return "";
    const {wid: uwid} = user;
    // console.log(trans);
    const {amount, wid, cur, type, ocur, oAmount, bid, owid, fee, isPositive} = trans || {};
    const neg = amount < 0 || !isPositive;
    const own = wid === uwid;
    switch (type) {
        case OrderTypes.exchange: {
            if(!neg) return own ? T("tran.desc.1", lang, [getCurrencyName(ocur)]) : T("tran.desc.2",  lang,[getCurrencyName(ocur), wid]);
            else return own ? T("tran.desc.3", lang, [getCurrencyName(ocur)]) : T("tran.desc.4", lang, [getCurrencyName(cur), wid]); // `Exchanged to ${toUpperCase(ocur)}` : `Exchanged to ${toUpperCase(cur)} by User=${wid}`;
        }
        case OrderTypes.fee: {
            return neg ? T("tran.desc.5", lang) : T("tran.desc.6", lang,  [stdCustomerNumber(owid)]);
        }
        case OrderTypes.transfer: {
            return neg ? T("tran.desc.7", lang,  [stdCustomerNumber(owid)]) : T("tran.desc.8", lang,  [stdCustomerNumber(owid)]);
        }
        case OrderTypes.topUp:
        case OrderTypes.withdraw: {
            return T("OrderTypes."+type, lang);
        }
        default: return T("OrderTypes.airplane_ticket", lang);

    }
}

const q = function (obj) {
    const str = [];
    for (const p in obj)
        if (obj.hasOwnProperty(p) && obj[p]) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};

const doResults = (setValue, onError) => all => {
    const {data: d} = all;
    // console.log(all);
    const {data, status, message} = d;
    // console.log("doResults", status, message);
    if (!status) {
        // console.log(all);
        // console.log("doResults", status);
        onError(message);
    }
    else setValue(data);
};


function randCode(len = 6) {
    const x10 = Math.pow(10, len-1);
    return (Math.floor(Math.random() * 9 * x10) + x10)+"";
}

let _aRandCode = "000000";

const smsUrl = "http://ippanel.com/api/select";
const smsBody = {
    "op" : "send",
    "uname" : "09128363705",
    "pass":  "faraz0058686061",
    // "message" : "Test33: 123456",
    "from": "5000125475",
    // "to" : ["+989133834091"]
};

export function checkVerificationCode(phone, code, setLoader, onDone, onError = console.log) {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/sms/verify`, {phone, code})
        .then(doResults(values => {
            onDone();
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));


    // if(code === _aRandCode || code === "2537") onDone();
    // else onError("Entered code is not correct");
}

function checkPhone(filter, setLoader, onDone, onError = console.log) {
    // setLoader(true);
    // console.log(`${baseApiUrl}/auth?${q({phone, aid})}`);
    axios
        .get(`${baseApiUrl}/auth?${q(filter)}`)
        .then(doResults(onDone, onError))
        .catch(onError)
        // .finally(() => setLoader(false));

}

export function sendVerificationSms(data, verifyExistence, setLoader, onDone, onError = console.log) {
    // console.log(data, verifyExistence ? "True" : "False");
    const filter = verifyExistence ? {...data, referred: true} : data;
    setLoader(true);
    checkPhone(filter, setLoader, users => {
        // console.log(data, users);
        if(verifyExistence) {
            if(!users || users.length === 0) {
                onError("No user exists with this phone number");
                setLoader(false);
                return;
            }
        } else {
            if(users && users.length > 0) {
                onError("A user with this phone number already exists.");
                setLoader(false);
                return;
            }
        }

        const {phone} = data;

        console.log(phone);

        setLoader(true);
        axios
            .post(`${baseApiUrl}/sms`, {phone})
            .then(doResults(values => {
                onDone();
            }, onError))
            .catch(onError)
            .finally(() => setLoader(false));


        //
        //
        // _aRandCode = randCode();
        // const body = {
        //     ...smsBody,
        //     to: [phone],
        //     message: `Your code is ${_aRandCode}`
        // };
        //
        // // setLoader(true);
        // axios.post(smsUrl, body).then(({data}) => {
        //     console.log("data, code", data, _aRandCode);
        //     if(data && data.length === 2 && data[0] === 0) onDone(_aRandCode);
        //     else onError("An error occured during sending verification SMS");
        //     // onDone(data);
        // }).catch(onError).finally(() => setLoader(false));
    }, onError).finally(() => setLoader(false));

}



export function login(data, setLoader, setValue, onError = console.log) {
    console.log("login-data", `${baseApiUrl}/auth`, data);
    setLoader(true);
    axios
        .post(`${baseApiUrl}/auth`, data)
        .then(doResults(values => {
            const {authToken} = values;
            setAuthToken(authToken);
            console.log(values);
            setValue(values);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadAgencies(setLoader, setValue, onError = console.log) {
    //loadUsers({role: Roles.AGENCY}, setLoader, setValue, onError);

    // console.log("loadAgencies");
    setLoader(true);
    axios
        .get(`${baseApiUrl}/agencies`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function loadAtickets(setLoader, setValue, page) {
    const onError = getOnError(page);
    setLoader(true);
    axios
        .get(`${baseApiUrl}/atickets`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function saveATicket(data, setLoader, onDone, page) {
    const onError = getOnError(page);
    setLoader(true);
    axios
        .post(`${baseApiUrl}/atickets`, data)
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}



function freshDoc(doc) {
    if(doc._id) delete doc._id;
    if(doc.updatedAt) delete doc.updatedAt;
    if(doc.createdAt) delete doc.createdAt;
    return doc;
}


export function saveUser(user, setLoader, onSaved, onError) {
    axios
        .post(`${baseApiUrl}/users`, user)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function saveUserNoAuth(user, setLoader, onSaved, onError) {
    axios
        .put(`${baseApiUrl}/auth`, user)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}


export function loadRatesBranch(bid, setLoader, setValue, onError = console.log, limit = 1) {
    if (!bid) return;
    axios
        .get(`${baseApiUrl}/rates?${q({bid, limit})}`)
        .then(doResults(rates => {
            if (limit === 1) setValue(rates && rates.length > 0 ? rates[0] : {});
            else setValue(rates || []);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function loadOrders(query, setValue, setLoader = () => {}, onError = console.log) {
    // setLoader(true);
    axios
        .get(`${baseApiUrl}/orders?${q(query)}`)
        .then(doResults(setValue, onError))
        .catch(onError);
        // .finally(() => setLoader(false));
}

export function loadHist(query, setValue, setLoader = () => {}, onError = console.log) {
    // setLoader(true);
    axios
        .get(`${baseApiUrl}/hist?${q(query)}`)
        .then(doResults(setValue, onError))
        .catch(onError);
    // .finally(() => setLoader(false));
}


export function loadWallet(wid, setLoader, setValue, onError = console.log) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/wallets/${wid}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}


export function saveOrder(user, order, setLoader, onSaved, onError) {
    if (!user) {
        onError("No user");
        return;
    }

    const doc = {
        ...freshDoc(order),
        ...freshDoc(user),
        orderNo: createOrderNo(),
        status: OrderStatus.issued
    };

    console.log(doc);

    setLoader(true);
    axios
        .post(`${baseApiUrl}/orders`, doc)
        .then(doResults(onSaved, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function setOrderStatus(order, status, desc, setLoader, onDone, onError) {
    const {_id} = order || {};

    console.log("setOrderStatus", _id);

    setLoader(true);
    axios
        .put(`${baseApiUrl}/orders/${_id}`, {status, desc})
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export const updateEffect = (updater, timeout = 10000) => () => {
    // updater();
    const handler = setInterval(() => {
        updater();
    }, timeout);
    return () => {
        clearInterval(handler);
    }
};

export function blockAmount(params, setLoader, onDone, onError) {
    const {wid, amount, cur, fee} = params || {};
    if(!wid) {
        onError("No Wallet defined");
        return;
    }
    const am = amount-(!fee ? 0 : fee);
    const doc = {
        [cur]: -am,
        [`${cur}-blocked`]: am
    };


    setLoader(true);
    axios
        .post(`${baseApiUrl}/wallets/${wid}`, doc)
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadFees(aid, setLoader, setValue, onError, limit = 1) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/fees?${q({aid, limit})}`)
        .then(doResults(rates => {
            if(limit === 1) setValue(rates && rates.length > 0 ? rates[0] : {});
            else setValue(rates || []);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}

export function loadUsersByWid(wids, setLoader, setValue, onError) {
    setLoader(true);
    axios
        .get(`${baseApiUrl}/users?wids=${wids.join(",")}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function loadUsers(query = {}, setLoader, setValue, onError = console.log) {
    console.log("loadUsers", query);
    axios
        .get(`${baseApiUrl}/auth?${q(query)}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}


export function loadBranch(user, setLoader, setValue, onError) {
    const {bid} = user || {};
    if (!bid) return;
    loadUserById(bid, setLoader, setValue, onError);
}

function loadUserById(uid, setLoader, setValue, onError) {
    axios
        .get(`${baseApiUrl}/users/${uid}`)
        .then(doResults(setValue, onError))
        .catch(onError)
        .finally(() => setLoader(false));
}




export function doWallets(transactions, setLoader, onSave, onError, lang) {
    setLoader(true);
    // console.log("transactions", transactions);
    axios
        .post(`${baseApiUrl}/wallets`, transactions)
        .then(doResults(() => {
            sendNotificationForTransactions(transactions, setLoader, onSave, onError, lang);
        }, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}


export function changePassword(curPassword, newPassword, setLoader, onError, onDone) {
    setLoader(true);
    axios
        .post(`${baseApiUrl}/users/changePassword`, {curPassword, newPassword})
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}


export function setPassword(data, setLoader, onError, onDone) {
    console.log("phone, password, aid", data);
    setLoader(true);
    axios
        .post(`${baseApiUrl}/auth/setPassword`, data)
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}

export function createOtp(setLoader, onError, onDone) {
    console.log(`${baseApiUrl}/users/otp`);
    setLoader(true);
    axios
        .post(`${baseApiUrl}/users/otp`)
        .then(doResults(onDone, onError))
        .catch(onError)
        .finally(() => setLoader(false));

}


