import {P, T} from "../../i18n";

export const CurrencyDef = {
    "iqd": {name: "Iraqi Dinar", cc: "iq", symbol: 'IQD'},
    "usd": {name: "US Dollar", cc: "us", symbol: '$'},
    "aed": {name: "UAE Dirham", cc: "ae", symbol: 'AED'},
    "try": {name: "Turkish Lira", cc: "tr", symbol: '$'},
    "eur": {name: "Euro", cc: "eu", symbol: '€'},
    "cny": {name: "China Yuan", cc: "cn", symbol: '$'},
    "irr": {name: "Iranian Rial", cc: "ir", symbol: 'R'},
    "gbp": {name: "British Pond", cc: "gb", symbol: '£'},
    "aud": {name: "Australian Dollar", cc: "au", symbol: '$'},
    "cad": {name: "Canadian Dollar", cc: "ca", symbol: '$'}
};

export function getCurrencyName(cur) {
    return P(`cur.${cur}.l`);
    const {name} = CurrencyDef[cur || "usd"] || {name: "N/A"};
    return name;
}

export function getCurrencySymbol(cur) {
    return P(`cur.${cur}.sym`);
    const {symbol} = CurrencyDef[cur || "usd"] || {symbol: "$"};
    return symbol;
}


export const getInitWallet = () => {
      let wallet = {valid: false};
      for(const key of Object.keys(CurrencyDef)) {
          wallet[key] = 0;
      }
      return wallet;
};

export const getInitRates = () => {
    let rates = {valid: false};
    for(const key of Object.keys(CurrencyDef)) {
        rates[key] = 1;
    }
    return rates;
};

export const getFlagUri = (cur, size = 48) => {
    const {cc} = CurrencyDef[cur || "usd"];
    return "./src/assests/srv/exchange.png";
    return `https://www.countryflags.io/${cc}/flat/${size}.png`;
};

export const encodeWID = (wid) => `iw-${wid}-wi`;

export const WalletTypes = {
    bronze: "bronze",
    // silver: "silver",
    // gold: "gold",
    // platinum: "platinum"
};


export const WalletColors = {
    [WalletTypes.bronze]: "deep-orange",
    // [WalletTypes.silver]: "deep-dark",
    // [WalletTypes.gold]: "amber",
    // [WalletTypes.platinum]: "teal",
};

export function toUpperCase(cur, defValue = "") {
    return P(`cur.${cur}.s`);
    return (cur || defValue).toUpperCase();
}

export function getRate(rates, cur) {
    return cur === "usd" || !rates[cur] ? 1 : 1/rates[cur];
}


export function getBalanceInDomestic(cur, wallet, walletType = WalletTypes.bronze, rates) {
    const {b, s} = rates[walletType] || {b: 1, s: 1} ;
    const balance = wallet[cur];
    const rate = getRate(rates, cur);
    // console.log(walletType, "b", b, rate, cur, balance, balance*rate*b);
    return balance*rate*b;
}

export function getTotalBalanceInDomestic(defCurrency, wallet, walletType = WalletTypes.bronze, rates) {
    let sum = 0.0;
    for(const cur in CurrencyDef) {
        const val = cur === defCurrency ? wallet[defCurrency] : getBalanceInDomestic(cur, wallet, walletType, rates);
        // console.log(cur, defCurrency, val, getBalanceInDomestic(cur, wallet, walletType, rates));
        sum += isNaN(val) ? 0 : val;
    }
    return sum;
}

