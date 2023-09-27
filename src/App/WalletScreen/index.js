import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";

import root from "../root"
import {JPage, MiniTab} from "../../Components";
import {CurrencyCard} from "./CurrencyCard";
import {
    getCurrencyName,
    getTotalBalanceInDomestic,
    toTwoDigit,
    toUpperCase,
    updatedAt, WalletTypes
} from "../../jozdan-common-temp";
import CurrencyDetail from "./CurrencyDetail";
import TopupWithdraw from "./CurrencyDetail/TopupWithdraw";
import Exchange from "./CurrencyDetail/Exchange";
import Transfer from "./CurrencyDetail/Transfer";
import ExchangeConfirm from "./CurrencyDetail/ExchangeConfirm";
import TransferConfirm from "./CurrencyDetail/TransferConfirm";
import TopupWithdrawConfirm from "./CurrencyDetail/TopupWithdrawConfirm";

import {setValues} from "../../redux/actions";
import {Headline, Text} from "react-native-paper";
import {getCurrencySymbol} from "../../jozdan-common-temp/currency";
import Transaction from "../TransactionsScreen/Transaction";
import {removeItem} from "../../utils/local_db";
import {getActiveCurrencies} from "../../utils";

import {screen as screenServices} from "../ServicesScreen";
import {P, T} from "../../i18n";
import gStyles from "../../utils/gStyles";
import {loadOrders, loadRatesBranch, loadWallet, saveUser, updateEffect} from "../../utils/db_mongo";

const Screens = {
    "Wallet": screen,
    "Services": screenServices
};

export const getScreen = back => Screens[back];


const OPTIONS = [
    {v: 1, l: "wallet.graph_mode.D"},
    {v: 7, l: "wallet.graph_mode.W"},
    {v: 14, l: "wallet.graph_mode.2W"},
    {v: 30, l: "wallet.graph_mode.M"},
    {v: 90, l: "wallet.graph_mode.Q"},
];

function findOptionByValue(v) {
    return (OPTIONS.find(p => p.v === v) || OPTIONS[0]).v;
}

export const ORDERS_COUNT = 20;

function Wallet({navigation, route}) {
    const dispatch = useDispatch();
    const {setOptions, navigate} = navigation;
    const [title, setTitle] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const {orderStatus, branch, user, wallet, rates, currencies, chart: reportType, token, lang, genConfig} = useSelector(({pax}) => pax);
    const {showCharts} = genConfig || {};

    useEffect(() => {
       setOptions({title: T("wallet", lang)})
    }, [lang]);

    // const [currencies, setCurrencies] = useState(getItem("currencies", {}));

    const setReportType = chart => dispatch(setValues({chart}, true));

    const {defCurrency} = branch || {defCurrency: "iqd"};
    // console.log("token", token);
    // const [reportType, setReportType] = useState(getItem("chart", OPTIONS[0].v));

    useEffect(() => {
        if (!token || !user) return;
        const {token: utoken} = user;



        if (!!utoken && utoken === token) {
            // console.log("TOKEN is already update");
            return;
        } //No need to be updated

        saveUser({...user, token}, setLoader, () => console.log("TOKEN Updated"), console.log);

    }, [token]);

    // useEffect(() => {
    //    setOptions({title: "Salaam"})
    // });

    // console.log("findOptionByLabel(chart)", chart, findOptionByValue(chart), reportType);

    useEffect(() => {
        // dispatch(setValues({langChanged: null}, true));
        removeItem("langChanged");
        setOptions({title: T("wallet.my", lang)});
        // setOptions({title: `Portfolio ${toUpperCase(defCurrency)} (${getCurrencyName(defCurrency)})`, subtitle: reportType.label})
        setTitle(`${T("wallet.Portfolio", lang)} ${toUpperCase(defCurrency)} (${getCurrencyName(defCurrency)})`);
    }, []);


    // console.log("rates", rates);
    // const {rnd} = getParams(route, "rnd");

    const [loader, setLoader] = useState(false);
    const {aid, wid, bid, walletType = WalletTypes.bronze} = user;

    // useEffect(() => {
    //     queryRatesBranch(bid).onSnapshot(pp => {
    //         const rates = isEmpty(pp) ? getInitRates() : {valid: true, ...pp.docs[0].data()};
    //         console.log("rates", rates);
    //         dispatch(setValues({rates}));
    //     }, err => console.log(err));
    // }, [bid]);

    // useEffect(() => {
    //     loadRatesBranch(bid, setLoader, rates => {
    //         dispatch(setValues({rates}));
    //     }, err => {
    //         console.log(err);
    //         //toast(getErrorMessage(err));
    //     });
    // }, [bid]);

    // useEffect(() => {
    //     ratesQuery(bid).onSnapshot(pp => {
    //         console.log("rates updated");
    //         const rates = isEmpty(pp) ? {} : pp.docs[0].data();
    //         dispatch(setValues({rates}));
    //     });
    // }, []);


    const lr = () => loadRatesBranch(bid, () => {}, rates => {
        // console.log("rates", rates);
        dispatch(setValues({rates: rates || {}}));
    });
    // lr();
    useEffect(updateEffect(lr, 20000));


    // useEffect(() => {
    //     walletQuery(wid).onSnapshot(e => {
    //         const wallet = !isEmpty(e) ? e.data() : {};
    //         // console.log("wallet: ", wallet);
    //         dispatch(setValues({wallet}));
    //     })
    // }, []);

    const lw = () => loadWallet(wid, () => {}, wallet => dispatch(setValues({wallet: wallet || {}})));
    // lw();
    useEffect((updateEffect(lw, 11000)));

    const lo = () => loadOrders(
        {wid, status: orderStatus, limit: ORDERS_COUNT},
        openOrders => dispatch(setValues({openOrders, loader: false})),
        () => {},
        err => dispatch(setValues({loader: false}))
    );
    // lo();
    useEffect(updateEffect(lo, 17000), [orderStatus]);

    useEffect(() => {
        lo();
        lw();
        lr();
    }, []);

    // useEffect(() => {
    //     ordersQuery(wid, {status: orderStatus})
    //         .orderBy(updatedAt, "desc")
    //         .limitToLast(ORDERS_COUNT)
    //         .onSnapshot(pp => {
    //             const openOrders = isEmpty(pp) ? [] : pp.docs.map(p => {
    //                 return {id: p.id, ...p.data()};
    //             });
    //             // console.log("openOrders: " + openOrders);
    //             dispatch(setValues({openOrders, loader: false}));
    //         }, err => {
    //             dispatch(setValues({loader: false}));
    //             console.log(err);
    //         });
    // }, [orderStatus]);


    return <JPage loader={loader}>
        <Text style={{alignSelf: 'center', marginTop: 10, marginBottom: 0, ...gStyles.darkText}}>{`${T("wallet.Portfolio", lang)} ${toUpperCase(defCurrency)} (${getCurrencyName(defCurrency)})`}</Text>
        <Headline
            style={{
                alignSelf: 'center',
                marginTop: 0,
                marginBottom: 10,
                ...gStyles.text
            }}>{getCurrencySymbol(defCurrency)}{toTwoDigit(getTotalBalanceInDomestic(defCurrency, wallet, walletType, rates))}</Headline>

        <CurrencyCard
            defCurrency={defCurrency}
            navigation={navigation}
            cur={defCurrency} key={defCurrency}
        />
        {showCharts && <MiniTab title={<Text style={gStyles.text}> {"  "+T("wallet.graph_mode", lang)}</Text>} value={reportType} style={{margin: 10, marginLeft: 20}}
                 options={OPTIONS} onChange={setReportType}/>}
        {getActiveCurrencies(currencies, defCurrency).map(cur => <CurrencyCard
            interval={reportType}
            defCurrency={defCurrency}
            navigation={navigation}
            cur={cur} key={cur}
        />)}


    </JPage>;
}


Wallet.title = P("wallet.my");// "My Wallet";
// Wallet.subtitle = "Test it!";


const pages = {
    Wallet,
    CurrencyDetail,
    TopupWithdraw,
    TopupWithdrawConfirm,
    Exchange,
    ExchangeConfirm,
    Transfer,
    TransferConfirm,

    Transaction
};

const Screen = () => root({pages});

Screen.title = ("wallet");
Screen.icon1 = 'wallet';
Screen.icon2 = 'wallet-outline';

export default Screen;

export const screen = Object.keys({WalletScreen: Screen})[0];



