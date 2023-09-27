import React, {useState, useEffect} from "react"
import {OrderStatus, OrderTypes} from "../jozdan-common-temp/db";
import {MiniTab} from "./MiniTab";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../redux/actions";
import {Avatar, Caption, Card, Colors, IconButton, List, Text, Title} from "react-native-paper";
import {toTwoDigit} from "../jozdan-common-temp/utils";
import {toUpperCase} from "../jozdan-common-temp/currency";
import {OrdersInfo} from "../App/WalletScreen/CurrencyDetail/info";
import {toLongDate} from "../utils";
import {LoaderMini} from "./NoData";
import JLoader from "./JLoader";
import {getTransDesc} from "../utils/db_mongo";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {cardStyle} from "../jozdan-common-temp/theme";
import {getFlagSource} from "../utils";
import {getChevron, T} from "../i18n";
import gStyles from "../utils/gStyles";
import {stdCustomerNumber} from "../jozdan-common-temp/account";
import {loadHist} from "../utils/db_mongo";

const styles = {
    card: cardStyle,
};


const options = [
    {v: OrderStatus.issued, l: "OrderStatus.issued.s", label: 'OrderStatus.issued'},
    {v: OrderStatus.accepted, l: "OrderStatus.accepted.s", label: 'OrderStatus.accepted'},
    {v: OrderStatus.rejected, l: "OrderStatus.rejected.s", label: 'OrderStatus.rejected'},
    {v: OrderStatus.canceled, l: "OrderStatus.canceled.s", label: 'OrderStatus.canceled'},
    {v: OrderStatus.suspended, l: "OrderStatus.suspended.s", label: 'OrderStatus.suspended'},
];

export function getOrderStatusName(orderStatus, lang) {
    const label = (options.find(p => p.v === orderStatus) || {label: "NA"}).label;
    return T(label, lang);
    // return (options.find(p => p.v === orderStatus) || {label: "NA"}).label;
}

export function OrderStatusComp({changeOrderStatus, orderStatus}) {
    const {lang} = useSelector(({pax}) => pax);
    const dispatch = useDispatch();
    // const changeOrderStatus = orderStatus => dispatch(setValues({orderStatus, loader: true}));


    return <MiniTab
        // style={{paddingVertical: 20}}
        // style={{backgroundColor: 'yellow'}}
        title={[<Title style={gStyles.text} key={1}>{T("order.recent", lang)}</Title>,
            <Caption style={gStyles.text} key={2}>{T("order.message1", lang, [getOrderStatusName(orderStatus, lang)])}</Caption>]}
        options={options}
        value={orderStatus}
        onChange={changeOrderStatus}
    />
}

export function OrdersComp({onCancel, orders, orderStatus, setOrderStatus}) {
    // const {openOrders, orderStatus, lang} = useSelector(({pax}) => pax);
    const {lang} = useSelector(({pax}) => pax);
    // const orders = (openOrders || []).filter(p => p.cur === cur);


    const noItem = !orders || orders.length === 0;
    // if(!orders || orders.length === 0) return null;

    return <Card style={styles.card}>
        <Card.Content>
            {/*<MiniTab options={options} value={OrderStatus.accepted} title={<Title>Orders <Caption>({getOrderStatusName(orderStatus)})</Caption></Title>}  />*/}
            <OrderStatusComp orderStatus={orderStatus} changeOrderStatus={setOrderStatus}/>
        </Card.Content>
        {/*<Card.Title*/}
        {/*    title={`${getOrderStatusName(orderStatus)} Orders`}*/}
        {/*    right={props => openOrders && openOrders.length >= ORDERS_COUNT && <IconButton {...props} icon="dots-horizontal"*/}
        {/*                       onPress={() => console.log("Sallam")}/>}*/}
        {/*/>*/}
        <LoaderMini visible={noItem} title={T("order.no", lang)}/>
        {(orders || []).map((order, index) => {
            const {amount, status, cur, type, updatedAt} = order;

            // const ri = <IconButton icon="chevron-right" color="#aaa" size={25} key={2} />;
            const di = <IconButton key={1} icon="close" color={Colors.red600} onPress={() => onCancel(order)}/>;

            const ricons = status === OrderStatus.issued ? di : null;

            return <List.Item
                key={index}
                title={<Text style={gStyles.text}>{toTwoDigit(amount) + ' ' + toUpperCase(cur)}</Text>}
                description={<Text style={gStyles.darkText}>{toLongDate(updatedAt)}</Text>}
                left={props => <List.Icon {...props} {...OrdersInfo[type]} />}
                right={props =>  ricons}

            />
        })}
    </Card>
}

export function TranView({tran, screen, navigation, hasLink = true, user}) {
    const {navigate} = navigation;
    const {amount, cur, isPositive, updatedAt, type = "transfer", orderNo} = tran || {};


    const {lang} = useSelector(({pax}) => pax);
    const on = !orderNo ? "" : `, ${stdCustomerNumber(orderNo)}`;

    const desc = getTransDesc(tran, user, lang);

    const am = (isPositive ? `${toTwoDigit(amount)} ` : `(${toTwoDigit(amount)}) `) + toUpperCase(cur);

    const [chevron, setChevron] = useState("chevron-left");

    useEffect(() => {
        setChevron(getChevron());
    });

    const r1 = <Caption style={gStyles.text} key={1}>{toLongDate(updatedAt)}</Caption>;
    // const r3 = <Caption style={gStyles.text} key={1}>{orderNo}</Caption>;
    const r2 = <Icon name={chevron} color="#aaa" size={25} key={2} />;
    const ri = hasLink ? [r1, r2] : r1;

    return <List.Item
        onPress={() => hasLink && navigate("Transaction", {screen, tran})}
        title={<Title style={gStyles.text}>{am}</Title>}
        description={<Text style={gStyles.darkText}>{desc+on}</Text>}
        left={props => <Avatar.Image size={48} source={getFlagSource(cur)}/>}
        right={props => ri}
    />;
}

const TRAN_OPTIONS = [
    {v: OrderTypes.all, l: "OrderTypes.all2.s", label: "OrderTypes.all2"},
    {v: OrderTypes.topUp, l: "OrderTypes.topUp.s", label: "OrderTypes.topUp"},
    {v: OrderTypes.withdraw, l: "OrderTypes.withdraw.s", label: "OrderTypes.withdraw"},
    {v: OrderTypes.exchange, l: "OrderTypes.exchange.s", label: "OrderTypes.exchange"},
    {v: OrderTypes.fee, l: "OrderTypes.fee.s", label: "OrderTypes.fee"},
    {v: OrderTypes.transfer, l: "OrderTypes.transfer.s", label: "OrderTypes.transfer"},
];

export function getTranName(tranType) {
    return T((TRAN_OPTIONS.find(p => p.v === tranType) || {label: "NA"}).label);
}

const INIT_LIMIT = 5;

export function TransactionsComp({cur, navigation, screen, setLoader}) {
    // console.log(!navigation ? "!nav" : "nav");

    const [tranType, setTranType] = useState(OrderTypes.all);
    // const [loader, setLoader] = useState(false);
    const [trans, setTrans] = useState([]);
    const [limit, setLimit] = useState(INIT_LIMIT);
    const noItem = !trans || trans.length === 0;

    const dispatch = useDispatch();
    const {user, lang} = useSelector(({pax}) => pax);
    const {wid} = user || {wid: "NA"};
    // const setLoader = loader => dispatch(setValues({loader}));

    // useEffect(() => {
    //     setLoader(true);
    //     transHistQuery(limit, {cur, wid, type: tranType === OrderTypes.all ? null : tranType}).get().then(pp => {
    //         setTrans(isEmpty(pp) ? [] : pp.docs.map(p => p.data()));
    //     }).catch(console.log).finally(() => setLoader(false));
    // }, [tranType, limit]);

    useEffect(() => {
        let query = {limit, cur, wid};
        if(tranType !== OrderTypes.all) query.type = tranType;
        loadHist(query, setTrans, setLoader);
    }, [tranType, limit]);

    // console.log("trans", trans);

    return <Card key={2} style={styles.card}>

        <Card.Content>
            <MiniTab
                onChange={tranType => {
                    setLimit(INIT_LIMIT);
                    setTranType(tranType);
                }}
                options={TRAN_OPTIONS} value={tranType}
                title={[<Title style={gStyles.text} key={1}>{T("tran", lang)}</Title>,
                    <Caption style={gStyles.text} key={2}>{T("tran.message1", lang, [getTranName(tranType)])}</Caption>]}
            />
        </Card.Content>

        <LoaderMini visible={noItem} title={T("tran.not_any", lang)}/>

        {(trans || []).map((tran, key) => <TranView user={user} screen={screen} navigation={navigation} tran={tran} key={key} />)}

        <LoaderMini title={T("tran.load_more", lang)} visible={trans && trans.length === limit} onPress={() => setLimit(limit+INIT_LIMIT)} />

    </Card>;
}

