import React, {useState, useEffect} from "react"
import {
    Text,
    Button,
    List,
    Caption,
    Avatar,
    Title,
    Card,
    IconButton,
    TextInput,
    ToggleButton, Colors
} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {View, Picker, Platform, Dimensions} from "react-native"
import Gradient from "../gradient.js"
import DateTimePicker from '@react-native-community/datetimepicker';

const {width: W, height: H} = Dimensions.get('window');
import root from "../root"
import {JPage, LoaderMini, MiniTab, NoData, TranView} from "../../Components";
import {accent, getFlagUri, OrderTypes, secondary, toTwoDigit, toUpperCase} from "../../jozdan-common-temp";
import Transaction from "./Transaction";
import {getCurrencyOptions} from "../WalletScreen/CurrencyDetail/Exchange";
import {P, T} from "../../i18n";
import {loadHist} from "../../utils/db_mongo";
// import {Picker} from '@react-native-picker/picker';

// const getCurrencyOptions = currencies => {
//     (currencies || []);
// };

const OrderTypesDef = {
    [OrderTypes.all]: "(All Order types)",
    [OrderTypes.topUp]: "Top-up",
    [OrderTypes.withdraw]: "Withdraw",
    [OrderTypes.exchange]: "Exchange",
    [OrderTypes.transfer]: "Transfer",
    [OrderTypes.fee]: "Fee",
};

// console.log(OrderTypesDef);

const getOrderTypesOptions = (lang) => Object.keys(OrderTypesDef).map(value => {
    return {
        value: OrderTypes.all === value ? null : value,
        label: T(`OrderTypes.${value}`, lang), // OrderTypesDef[value] || value,
        key: value
    };
});

const INIT_LIMIT = 10;

// const normalOptions =

function normalDateFrom(d) {
    if (!d) return d;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function normalDateTo(d) {
    if (!d) return d;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}


function Transactions({navigation}) {
    const {navigate, setOptions} = navigation;
    const dispatch = useDispatch();
    const {user, currencies = [], lang} = useSelector(({pax}) => pax);


    useEffect(() => {
       setOptions({title: T("tran.my", lang)});
    }, [lang]);
    //const {wallet, rates, branch, user, currencies = []} = useSelector(({pax}) => pax);


    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [orderTypesOptions, setOrderTypesOptions] = useState([]);
    useEffect(() => {
        setCurrencyOptions([{l: T("tran.all_currencies", lang)}, ...getCurrencyOptions(currencies)]);
        setOrderTypesOptions(getOrderTypesOptions(lang));
    }, [currencies]);

    const [cur, setCur] = useState();


    const {wid} = user || {wid: "NA"};

    const [limit, setLimit] = useState(INIT_LIMIT);
    const [loader, setLoader] = useState(false);
    const [dateFrom, setDateFrom] = useState();
    const [type, setType] = useState();
    const [dateTo, setDateTo] = useState();
    const [amountFrom, setAmountFrom] = useState();
    const [amountTo, setAmountTo] = useState();
    const [len, setLen] = useState(-1);
    const [showFilters, setShowFilters] = useState(false);

    const [opt, setOpt] = useState({});


    const [hist, setHist] = useState(undefined);

    // useEffect(() => {
    //     transHistQuery(limit, {...opt, wid}).onSnapshot(e => {
    //         const hist = isEmpty(e) ? [] : getData(e);
    //         setHist(hist);
    //         setLoader(false);
    //     }, console.log);
    // }, [wid, limit, opt]);

    useEffect(() => {
        loadHist({...opt, wid, limit}, setHist, setLoader);
    }, [wid, limit, opt]);


    const [show, setShow] = useState(0);

    const onChangeDate = (event, selectedDate) => {
        const ss = show;
        // console.log("sel", selectedDate, typeof selectedDate);
        const currentDate = selectedDate;
        setShow(Platform.OS === 'ios' ? show : 0);
        if (ss === 1) setDateFrom(normalDateFrom(currentDate));
        else setDateTo(normalDateTo(currentDate));
    };

    // console.log("OrderTypesOptions", OrderTypesOptions);

    const renderItem = (item, index) => <TranView user={user} key={index} screen={screen} navigation={navigation} tran={item}/>;

    return <JPage pin={{
        comp: <View style={{paddingHorizontal: 10, paddingVertical: 0}}>
            <View style={{flexDirection: 'row'}}>
                <Picker style={{width: W / 2 - 10}} selectedValue={cur} onValueChange={setCur}>
                    {currencyOptions.map(({l, v}) => <Picker.Item key={l} label={l} value={v}/>)}
                </Picker>
                <Picker style={{width: W / 2 - 10}} selectedValue={type} onValueChange={setType}>
                    {orderTypesOptions.map(props => <Picker.Item {...props}/>)}
                </Picker>
            </View>
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
                    style={{width: W / 2 - 10, backgroundColor: '#fff'}}
                    disabled={dateTo || dateFrom}
                    dense
                    value={(amountFrom || "") + ""}
                    // placeholder="Amount from"
                    onChangeText={amount => setAmountFrom(1 * amount)}
                    label={T("tran.amount_from", lang)}
                    keyboardType="numeric"
                    mode="outlined"/>
                <TextInput
                    disabled={dateTo || dateFrom}
                    dense
                    theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
                    style={{width: W / 2 - 10, backgroundColor: '#fff'}}
                    value={(amountTo || "") + ""}
                    onChangeText={amount => setAmountTo(1 * amount)}
                    label={T("tran.amount_to", lang)}
                    keyboardType="numeric"
                    mode="outlined"/>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Button disabled={amountTo || amountFrom} color={secondary} mode="outlined" style={{width: W / 2 - 10}} icon="clock-time-four" compact uppercase={false}
                        onPress={() => setShow(1)}>
                    {!dateFrom ? T("tran.date_from", lang)+"..." : dateFrom.toLocaleDateString()}
                </Button>
                <Button disabled={amountTo || amountFrom} color={secondary} mode="outlined" style={{width: W / 2 - 10}} icon="clock-time-seven" compact uppercase={false}
                        onPress={() => setShow(2)}>
                    {!dateTo ? T("tran.date_to", lang)+"..." : dateTo.toLocaleDateString()}
                </Button>
            </View>

            <View style={{flexDirection: 'row'}}>
                <Button style={{width: W / 2 - 10,}} mode="contained" icon="filter" onPress={() => {
                    setHist();
                    setOpt({cur, amountFrom, amountTo, dateFrom, dateTo, type});
                    setLen(-1);
                    setLimit(INIT_LIMIT);
                }}>
                    {T("tran.apply_filter", lang)}
                </Button>
                <Button style={{width: W / 2 - 10}} uppercase={false} mode="outlined" icon="autorenew" onPress={() => {
                    setDateTo();
                    setDateFrom();
                    setAmountFrom();
                    setAmountTo();
                    setCur();
                    setOpt({});
                }}>
                    {T("tran.clear_filters", lang)}
                </Button>
            </View>
        </View>,
        textOpen: T('tran.show_filters', lang),
        textClose: T('tran.hide_filters', lang),
        commandType: "text",
        initState: "open"
    }}>

        {show !== 0 && (
            <DateTimePicker
                value={(show === 1 ? dateFrom : dateTo) || new Date()}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
            />
        )}

        {/*<Text>{typeof (dateFrom)}</Text>*/}
        <LoaderMini visible={!hist || hist.length === 0} title={T(!hist ? "tran.loading" : "tran.no_trans", lang)}
                    loader={!hist}/>
        {/*<NoData visible={!hist || hist.length === 0}/>*/}

        {(hist || []).map(renderItem)}
        <LoaderMini visible={limit === (hist || []).length && len !== (hist || []).length} loader={loader}
                    title={T("tran.load_more", lang)} onPress={() => {
            setLen((hist ?? []).length);
            setLoader(true);
            setLimit(limit + INIT_LIMIT);
        }}/>
    </JPage>;
}

Transactions.title = P("tran.my");


const pages = {
    Transactions,
    Transaction
};

const Screen = () => root({pages});

Screen.title = ("tran");
Screen.icon1 = 'cash';
Screen.icon2 = 'cash-outline';

export default Screen;

export const screen = Object.keys({ServicesScreen: Screen})[0];



