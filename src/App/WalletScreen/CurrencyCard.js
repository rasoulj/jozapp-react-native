import React from "react"
import {JCard} from "../../Components";
import {
    Card,
    Avatar,
    IconButton,
    Button,
    Title,
    Paragraph,
    Text,
    Headline,
    Caption,
    Subheading, Colors, HelperText, TouchableRipple, Badge
} from "react-native-paper";
import {View} from "react-native";
import {
    CurrencyDef,
    random,
    randomInt,
    toTwoDigit,
    getFlagUri,
    WalletTypes,
    OrderTypes, getCurrencyName, getCurrencySymbol, getBalanceInDomestic, toUpperCase, getRate, dprimary, cardStyle
} from "../../jozdan-common-temp";
import {CurrencyChart} from "./CurrencyChart";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useSelector} from "react-redux";
import {screen} from "./index";
import {OrdersInfo} from "./CurrencyDetail/info";
import {getFlagSource} from "../../utils";
import {borderColor, primary} from "../../jozdan-common-temp/theme";
import {T} from "../../i18n";
import gStyles from "../../utils/gStyles";

const styles = {
    card: {...cardStyle, margin: 10, padding: 0},
    red: {color: "red"},
    green: {color: "green"},
    bold: {fontWeight: 'bold', fontSize: 16}
};


export const CurrencyCard2 = ({cur, navigation}) => {
    const {navigate} = navigation;
    const {wallet, rates, openOrders} = useSelector(({pax}) => pax);

    const uri = getFlagUri(cur, 64);

    const openCount = (openOrders || []).filter(p => p.cur === cur).length;

    const rate = getRate(rates, cur);
    const balance = wallet[cur];
    const {valid: validRates} = rates;
    // const {valid: validWallet} = wallet;
    const helpText = validRates ? `1 USD = ${cur === "usd" ? 1 : rate.toString().substring(0, 4)} ${toUpperCase(cur)}` : "No Current Rate";

    return <TouchableRipple onPress={() => navigate("CurrencyDetail", {screen, cur})}>
        <JCard style={{height: 100, backgroundColor: "#fff", marginVertical: 4, flexDirection: "row"}}>
            <View style={{flex: 1, flexDirection: 'row', borderEndWidth: 1, borderEndColor: '#bbb', zIndex: 2}}>

                <View style={{flex: 0.3, position: "relative"}}>
                    <Badge visible={openCount > 0} style={{top: 10, zIndex: 3}} >{openCount}</Badge>
                    <Avatar.Image size={48} source={{uri}} style = {{ width: 200, height: 200 }}
                                  icon="flag">
                    </Avatar.Image>
                </View>
                <View style={{flex: 0.7, justifyContent: 'center', paddingStart: 7, paddingEnd: 2}}>
                    <Text style={styles.bold}>{`${toTwoDigit(balance)} ${toUpperCase(cur)}`}</Text>
                    <HelperText type={validRates ? "info" : "error"}>{helpText}</HelperText>
                </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 0.8}}>
                    <CurrencyChart color={[randomInt(0, 200), randomInt(0, 200), randomInt(0, 200)]}/>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-end', flex: 0.2}}>

                    <Ionicons name="chevron-forward-outline" size={25} color="#bbb"/>
                    {/*<IconButton color="green" icon="plus-circle" onPress={() => onPress(1)} />*/}
                    {/*<IconButton color="red" icon="minus-circle" onPress={() => onPress(2)} />*/}
                </View>
            </View>
        </JCard>
    </TouchableRipple>
};

// export const calcTotalBalance

// const FILLED_H = new Array(366).fill(-1.0);
// function initH() {
//     let H = {};
//     for(const cur in CurrencyDef) {
//         H[cur] = FILLED_H;
//     }
//     return H;
// }
// const INIT_H = initH();



export const CurrencyCard = ({cur, navigation, defCurrency, interval = 1}) => {

    //const {name, cc} = CurrencyDef[cur || "usd"];
    const name = getCurrencyName(cur || "iqd");

    const isDef = cur === defCurrency;

    const {navigate} = navigation;

    const {lang, wallet, rates = {}, openOrders, user: {walletType = WalletTypes.bronze}, genConfig} = useSelector(({pax}) => pax);
    const {b, s} = rates[walletType] || {b: 1, s: 1} ;
    // const {H = {}} = rates;

    const {showCharts} = genConfig || {};

    // const histData = (H || INIT_H)[cur];

    // console.log("histData", histData);

    const openCount = (openOrders || []).filter(p => p.cur === cur).length;

    const rr = JSON.parse(JSON.stringify(rates));
    delete rr.H;
    // console.log("rates", rr);

    const rate = getRate(rates, cur);// cur === "usd" ? 1 : rates[cur];
    // console.log("rate", cur, rate);
    const balance = wallet[cur];
    // const {valid: validRates} = rates;
    // const {valid: validWallet} = wallet;
    // const helpText = validRates ? `1 USD = ${cur === "usd" ? 1 : rate.toString().substring(0, 4)} ${toUpperCase(cur)}` : "No Current Rate";

    const onPress = type => navigate(OrdersInfo[type].target, {screen, type, cur});

    //{"animation": {"scale": 1}, "colors": {"accent": "#6298f8", "backdrop": "rgba(0, 0, 0, 0.5)", "background": "#f6f6f6", "disabled": "rgba(0, 0, 0, 0.26)", "error": "#B00020", "notification": "#f50057", "onBackground": "#000000", "onSurface": "#000000", "placeholder": "rgba(0, 0, 0, 0.54)", "primary": "#fafafa", "surface": "#ffffff", "text": "#000000"}, "dark": true, "fonts": {"light": {"fontFamily": "sans-serif-light", "fontWeight": "normal"}, "medium": {"fontFamily": "sans-serif-medium", "fontWeight": "normal"}, "regular": {"fontFamily": "sans-serif", "fontWeight": "normal"}, "thin": {"fontFamily": "sans-serif-thin", "fontWeight": "normal"}}, "roundness": 2}
    return <Card
        style={styles.card}
        onPress={() => navigate("CurrencyDetail", {screen, cur, interval})} >
        <Card.Title

            title={<Text style={gStyles.text}> {`${toUpperCase(cur)} (${name})`}</Text>}
            // subtitle={`1 USD = ${cur === "usd" ? 1 : toTwoDigit(rate)} ${toUpperCase(cur)}`}
            left={(props) => [
                <Badge key={1} visible={openCount > 0} style={{top: 10, zIndex: 3}} >{openCount}</Badge>,
                <Avatar.Image key={2} source={getFlagSource(cur)} {...props} icon="flag"/>
            ]}
            right={(props) => <View style={{flexDirection: 'row'}}>
                <IconButton color="green" {...props} icon="transfer-up" onPress={() => onPress(OrderTypes.topUp)}/>
                <IconButton color="red" {...props} icon="transfer-down" onPress={() => onPress(OrderTypes.withdraw)}/>
            </View>}
        />
        <Card.Content>
            <Paragraph style={gStyles.text}>{getCurrencySymbol(cur)}{toTwoDigit(balance)}</Paragraph>
            {!isDef && <Caption style={gStyles.darkText}>
                {getCurrencySymbol(defCurrency)}{toTwoDigit(getBalanceInDomestic(cur, wallet, walletType, rates))}
                <Caption style={gStyles.darkText}>  ({getCurrencySymbol(cur)}1 = {getCurrencySymbol(defCurrency)}{toTwoDigit(rate*b)})</Caption>
            </Caption>}
            {isDef && <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: 20, fontSize: 16, ...gStyles.text}}>
                {T("wallet.base_cur", lang)}
            </Text>}
        </Card.Content>
        {!isDef && showCharts && <Card.Content>
            <CurrencyChart rates={rates} cur={cur} interval={interval}/>
        </Card.Content>}
        {/*<Card.Cover source={{uri: 'https://picsum.photos/700'}}/>*/}
        {/*<Card.Actions>*/}
        {/*    <Button>Cancel</Button>*/}
        {/*    <Button>Ok</Button>*/}
        {/*</Card.Actions>*/}

    </Card>;
};
