import React, {useState, useEffect} from "react"
import {JCard, JPage, JPicker} from "../../../Components";
import {Button, Card, Colors, HelperText, Text, TextInput} from "react-native-paper";
import {getActiveCurrencies, getParams} from "../../../utils";
import {
    accent,
    CurrencyDef, dprimary,
    formalCustomerNumber,
    getCurrencyName,
    getRate,
    OrderTypes, toTwoDigitNoComma,
    WalletTypes
} from "../../../jozdan-common-temp";
import {OrdersInfo} from "./info";
import {useSelector} from "react-redux";
import AvailCurrency from "./AvailCurrency";
import {toTwoDigit} from "../../../jozdan-common-temp/utils";
import {toUpperCase} from "../../../jozdan-common-temp/currency";
import {getScreen} from "../index";
import {P, T} from "../../../i18n";

export function getCurrencyOptions(currencies = {}, exceptions = []) {
    return getActiveCurrencies(currencies).filter(p => !exceptions.includes(p)).map(v => {
        return {l: getCurrencyName(v), v};
    });
}

export function calcOAmount(amount, rates, walletType = WalletTypes.bronze, cur, ocur, defCurrency = "iqd") {
    // const {b, s} = rates[walletType];
    // console.log("cur, ocur", cur, ocur, getRate(rates, cur), getRate(rates, ocur));
    return amount*calcRate(cur, ocur, rates, walletType, defCurrency);
}

export function calcAmount(amount, rates, walletType = WalletTypes.bronze, cur, ocur, defCurrency = "iqd") {
    // const {b, s} = rates[walletType];
    // console.log("cur, ocur", cur, ocur, getRate(rates, cur), getRate(rates, ocur));
    return amount/calcRate(cur, ocur, rates, walletType, defCurrency);
}


export function calcInDomestic(cur, ocur, rates, walletType = WalletTypes.bronze, sellType = "b") {
    const sb = (rates[walletType] || {b: 1, s: 1})[sellType];

    // console.log("sb", sb, rates);

    // if(cur === defCurrency) return sb;
    return sb*getRate(rates, cur)/getRate(rates, ocur);


}

export function calcRate(cur, ocur, rates, walletType = WalletTypes.bronze, defCurrency) {
    if(ocur === defCurrency) return calcInDomestic(cur, "usd", rates, walletType, "b");
    else if(cur === defCurrency) return 1/calcInDomestic(ocur, "usd", rates, walletType, "s");
    return calcInDomestic(cur, defCurrency, rates, walletType, "b")/calcInDomestic(ocur, defCurrency, rates, walletType, "s");
}



function Exchange({navigation, route}) {
    const {setOptions, navigate} = navigation;
    const {wallet, rates, branch, user, currencies = [], lang} = useSelector(({pax}) => pax);

    // console.log("rates", rates);

    useEffect(() => {
        setOptions({title: T("wallet.Exchange", lang)});
    }, [lang]);

    const {wid: bwid, defCurrency} = branch || {wid: "unknown-exchange"};

    const {walletType = WalletTypes.bronze, wid, bid} = user;

    const {type, cur, back = "Wallet"} = getParams(route, "type cur back");

    const {title: tt, icon, color, target} = OrdersInfo[type];
    const title = T(tt, lang);

    const [ocur, setOcur] = useState(undefined);
    const [am, setAmount] = useState(undefined);
    const [am2, setAmount2] = useState(undefined);

    const amount = (am || 0)+"";
    const amount2 = (am2 || 0)+"";

    const avail = wallet[cur] || 0;
    const error = 1*amount <= 0 || (amount > avail);

    const totalErr = error ||  !ocur || !amount;

    let options = [{l: `(${T("wallet.ERROR_CUR", lang)})`}, ...getCurrencyOptions(currencies, [cur])];
    // const oAmount = amount*rates[ocur]/(!rates[cur] ? 1:rates[cur]);
    const oAmount = calcOAmount(amount, rates, walletType, cur, ocur, defCurrency);
    const helperText = `${toTwoDigit(amount)} ${toUpperCase(cur)} = ${toTwoDigit(oAmount)} ${toUpperCase(ocur)}`;

    const gotoConfirm = () => navigate(`${target}Confirm`, {screen: getScreen(back), amount: 1*amount, oAmount, cur, ocur, bwid, wid, back, bid});

    // console.log("rates, walletType, cur, ocur, defCurrency, amount", rates, walletType, cur, ocur, amount);
    // console.log("getExchangeTransactions", getExchangeTransactions(rates, walletType, cur, ocur, amount));

    return <JPage>
        <AvailCurrency defCurrency={defCurrency} walletType={walletType} cur={cur} wallet={wallet} rates={rates} ocur={ocur} />

        <HelperText type="info" visible>{T("wallet.ex_info", lang, [title])}</HelperText>
        <TextInput
            value={(am || "")}
            theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
            style={{backgroundColor: '#fff'}}
            error={error}
            mode="flat"
            label={T("wallet.Amount", lang)+" "+getCurrencyName(cur)}
            keyboardType="numeric"
            onChangeText={amount => {
                setAmount(amount);
                setAmount2(toTwoDigitNoComma(calcOAmount(1 * amount, rates, walletType, cur, ocur, defCurrency)));
            }}
        />
        <Text> </Text>
        {!!ocur && <TextInput
            value={(am2 || "")}
            theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
            style={{backgroundColor: '#fff'}}
            error={error}
            mode="flat"
            label={T("wallet.Amount", lang)+" "+getCurrencyName(ocur)}
            keyboardType="numeric"
            onChangeText={amount2 => {
                setAmount2(amount2);
                setAmount(toTwoDigitNoComma(calcAmount(1 * amount2, rates, walletType, cur, ocur, defCurrency)));
            }}
        />}
        <HelperText type="error" visible={error}>{T("wallet.ERROR_AMOUNT", lang)}</HelperText>
        <HelperText type="info" visible={true}>{T("wallet.Select_target_Currency", lang)}</HelperText>
        <JPicker value={ocur} options={options} onChange={setOcur} />

        <Card style={{marginTop: 10, backgroundColor: totalErr ? Colors.red600 : dprimary}}>
            <Card.Content>
                {(error || !amount) && <Text style={{color: Colors.white}}>{T("wallet.ERROR_AMOUNT", lang)}</Text>}
                {!ocur && <Text style={{color: Colors.white}}>{T("wallet.ERROR_CUR", lang)}</Text>}
                {!totalErr && <Text style={{color: Colors.black}}>{helperText}</Text>}
            </Card.Content>
        </Card>

        <Button style={{marginVertical: 20}} disabled={totalErr} icon={icon} color={color} mode="contained" onPress={gotoConfirm}>
            {title}
        </Button>
        {/*<HelperText type="error" visible={ocur === cur}>{ERROR_CUR}</HelperText>*/}
    </JPage>;
}

Exchange.title = P("wallet.Exchange");
export default Exchange;
