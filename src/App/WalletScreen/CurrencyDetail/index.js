import React, {useState, useEffect} from "react"
import {getParams} from "../../../utils";
import {
    Button,
    Card,
    Headline,
    Paragraph,
    Title,
    Text,
    BottomNavigation,
    Caption
} from "react-native-paper";
import {JPage, TransactionsComp} from "../../../Components";
import {
    CurrencyDef,
    getBalanceInDomestic, getCurrencyName,
    getCurrencySymbol, getRate,
    WalletTypes
} from "../../../jozdan-common-temp/currency";
import {View, Alert} from "react-native"

import {screen} from "../index";
import {OrderStatus, OrderTypes} from "../../../jozdan-common-temp/db";
import {OrdersInfo} from "./info";
import {useDispatch, useSelector} from "react-redux";
import {camelCase, toTwoDigit} from "../../../jozdan-common-temp/utils";
import {blockAmount, loadOrders, setOrderStatus} from "../../../utils/db_mongo";
import {OrdersComp} from "../../../Components";
import {setValues} from "../../../redux/actions";

import Commands3 from "./Commands"
import CardContent from "react-native-paper/src/components/Card/CardContent";
import {CurrencyChart} from "../CurrencyChart";
import {borderColor, cardStyle, dprimary} from "../../../jozdan-common-temp/theme";
import {T} from "../../../i18n";
import gStyles from "../../../utils/gStyles";

const styles = {
    card: cardStyle,
    command: {flex: 1, margin: 0}
};

function CommandButton({title, icon, onPress, color, hasTitle = true}) {
    return <View style={styles.command}>
        <Button icon={icon} compact mode="text" uppercase={false} color={color} onPress={onPress}>
            {hasTitle ? title : null}
        </Button>
    </View>
}

function Commands({navigation, cur}) {
    const {navigate} = navigation;
    const types = Object.keys(OrdersInfo);
    // let pp = [];
    // for (let i = 0; i < types.length; i += 2) pp[i / 2] = types.slice(i, i + 2);

    return <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
        {types.map(type => <CommandButton
            // hasTitle={false}
            {...OrdersInfo[type]}
            title={camelCase(type)}
            key={type}
            onPress={() => navigate(OrdersInfo[type].target, {screen, type, cur, back: "Wallet"})}
        />)}
    </View>;

    // return <View style={{flex: 1, marginVertical: 10}}>
    //     {pp.map((slice, key) => <View style={{flex: 1, flexDirection: 'row'}} key={key}>
    //         {slice.map(type => <CommandButton
    //             {...OrdersInfo[type]}
    //             key={type}
    //             onPress={() => navigate(OrdersInfo[type].target, {screen, type, cur})}
    //         />)}
    //     </View>)}
    // </View>;
}



function WalletSummary({wallet, cur, rates, interval, walletType = WalletTypes.bronze, defCurrency = "usd", visible = true}) {
    if(!visible) return null;
    const rate = getRate(rates, cur);
    const {b, s} = rates[walletType] || {b: 1, s: 1} ;
    const {lang, genConfig} = useSelector(({pax}) => pax);
    const {showCharts} = genConfig || {};


    return <Card style={styles.card}>
        <Card.Content>
            <Title style={gStyles.text}>{T("wallet.current", lang)}:</Title>
            <Text style={gStyles.text}>
                {getCurrencySymbol(defCurrency)}{toTwoDigit(getBalanceInDomestic(cur, wallet, walletType, rates))}
                <Caption style={gStyles.text}>  ({getCurrencySymbol(cur)} 1 = {getCurrencySymbol(defCurrency)} {toTwoDigit(b/rate)})</Caption>
            </Text>
        </Card.Content>
        <Card.Content>
            {!!showCharts && <CurrencyChart visible={true} rates={rates} cur={cur} interval={interval} len={8}/>}
        </Card.Content>
    </Card>

}

function CurrencyDetail({navigation, route}) {
    let page;
    const toast = (mes, type) => setTimeout(() => page.setToast(mes, type), 1);

    const {setOptions} = navigation;
    const {cur, interval} = getParams(route, "cur interval");
    const {wallet, user, loader: gloader, rates, branch, lang} = useSelector(({pax}) => pax);

    const {defCurrency} = branch || {defCurrency: "iqd"};

    // console.log("defCurrency", branch);

    const [loader, setLoader] = useState(false);
    const {uid, walletType = WalletTypes.bronze, wid} = user;

    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatusLocal] = useState(OrderStatus.issued);

    const lo = () => loadOrders(
        {cur, wid, status: orderStatus, limit: 50},
        setOrders,
        setLoader
    );
    useEffect(lo, [orderStatus]);



    useEffect(() => {
        setOptions({title: getCurrencyName(cur || "usd")});
    }, [lang]);

    const dispatch = useDispatch();


    const cancelOrder = order => {

        // console.log(order);
        // return;
        // dispatch(setValues({orderStatus: OrderStatus.canceled}));
        setOrderStatus(
            order, OrderStatus.canceled, "Order canceled by customer", setLoader,
            () => {
                const {type, amount} = order || {amount: 0};
                if(type === OrderTypes.withdraw || type === OrderTypes.exchange || type === OrderTypes.transfer) {
                    blockAmount({...order, amount: -amount}, setLoader, () => {}, console.log)
                }
                lo();

            }, // toast("Order has been cancelled successfully", ToastTypes.success),
            e => {
            }, //toast(getErrorMessage(e), ToastTypes.danger),
        );
    };

    const onCancel = order => Alert.alert("Question?", "Are you sure to CANCEL this order?", [
        {text: "Yes", cancel: true, onPress: () => cancelOrder(order)},
        {text: "No", style: "cancel"},
    ]);

    return <JPage loader={loader} ref={ref => page = ref}>
        <Headline
            style={{alignSelf: 'center', marginVertical: 10, ...gStyles.text}}>{getCurrencySymbol(cur)}{toTwoDigit(wallet[cur])}</Headline>
        {/*<CurrentStatus/>*/}
        {/*<RecentTransactions/>*/}
        <Commands navigation={navigation} cur={cur} />

        <WalletSummary visible={cur !== defCurrency} cur={cur} rates={rates} wallet={wallet} interval={interval} walletType={walletType} defCurrency={defCurrency} />

        <OrdersComp orderStatus={orderStatus} orders={orders} setOrderStatus={setOrderStatusLocal} onCancel={onCancel}/>

        <TransactionsComp setLoader={setLoader} navigation={navigation} cur={cur} screen={screen} />


    </JPage>
}

CurrencyDetail.title = "Currency Detail";


export default CurrencyDetail;
