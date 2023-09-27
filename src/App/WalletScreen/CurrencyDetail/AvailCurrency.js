import React from "react"
import {Card, Headline, Subheading, Text, Title} from "react-native-paper";
import {commafy, toTwoDigit} from "../../../jozdan-common-temp/utils";
import {View, Picker} from "react-native"
import {getCurrencyName, getRate, toUpperCase, WalletTypes} from "../../../jozdan-common-temp/currency";
import {calcOAmount, calcInDomestic, calcRate} from "./Exchange";
import {borderColor, cardStyle, dprimary} from "../../../jozdan-common-temp/theme";
import {T} from "../../../i18n";
import {useSelector} from "react-redux";
import gStyles from "../../../utils/gStyles";



const AvailCurrency = ({cur, wallet, rates, ocur, walletType = WalletTypes.bronze, defCurrency = "iqd"}) => {
    const curName = getCurrencyName(cur);
    // const {b, s} = rates[walletType] || {b: 1, s: 1} ;

    const avail = wallet[cur] || 0;
    // const rate = getRate(rates, cur);// rates[cur];
    const {lang} = useSelector(({pax}) => pax);

    return <Card style={{marginVertical: 10, zIndex: 10, ...cardStyle}}>
        <Card.Content>
            <Text style={gStyles.text}>{T("wallet.Available", lang)} {curName}</Text>
            <Title style={gStyles.text}>{toTwoDigit(avail)} {toUpperCase(cur)}</Title>
            {/*<Text style={{alignSelf: 'flex-end'}}>1 USD/{toUpperCase(cur)} = {toTwoDigit(rate)}</Text>*/}
            {ocur && <Text style={{alignSelf: 'flex-end', ...gStyles.text}}>1 {toUpperCase(cur)} = {(calcRate(cur, ocur, rates, walletType, defCurrency))} {toUpperCase(ocur)}</Text>}
        </Card.Content>
    </Card>
};

export default AvailCurrency;
