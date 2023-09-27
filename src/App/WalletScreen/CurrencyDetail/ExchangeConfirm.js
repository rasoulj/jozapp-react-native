import React, {useState, useEffect} from "react"
import {JPage} from "../../../Components";
import {Card, Colors, Paragraph, Title} from "react-native-paper";
import {getNetError, getParams} from "../../../utils";
import {OrdersInfo} from "./info";
import {toTwoDigit} from "../../../jozdan-common-temp/utils";
import {getCurrencySymbol, toUpperCase} from "../../../jozdan-common-temp/currency";
import {useDispatch, useSelector} from "react-redux";
import {blockAmount, saveOrder} from "../../../utils/db_mongo";
import {ConfirmButton} from "./ConfirmButton";
import {dprimary, OrderTypes} from "../../../jozdan-common-temp";
import {formalCustomerNumber} from "../../../jozdan-common-temp";
import {getScreen} from "../index";
import {P, T} from "../../../i18n";
import gStyles from "../../../utils/gStyles";
import {useNetInfo} from "@react-native-community/netinfo";
import {setValues} from "../../../redux/actions";

const styles = {
    card: {marginVertical: 15},
    command: {flex: 1, margin: 1}
};

function getExchangeTransactions(params) {
    const {amount, oAmount, cur, ocur, bwid, wid, bid} = params || {};
    return [
        {amount: -amount, wid: formalCustomerNumber(wid), cur, desc: `Exchanged to ${toUpperCase(ocur)}`, type: OrderTypes.exchange, ocur, oAmount, bid, hasDone: true},
        {amount: oAmount, wid: formalCustomerNumber(wid), cur: ocur, desc: `Exchanged from ${toUpperCase(cur)}`, type: OrderTypes.exchange, ocur: cur, oAmount, bid},

        {amount: amount, wid: formalCustomerNumber(bwid), cur, desc: `Exchanged from ${toUpperCase(ocur)} by User=${wid}`, type: OrderTypes.exchange, ocur, oAmount, owid: wid, bid},
        {amount: -oAmount, wid: formalCustomerNumber(bwid), cur: ocur, desc: `Exchanged to ${toUpperCase(cur)} by User=${wid}`, type: OrderTypes.exchange, ocur, oAmount, owid: wid, bid},
    ];
}

function ConfirmBox({amount, oAmount, ocur, cur, stage}) {
    const {lang} = useSelector(({pax}) => pax);

    const {title: tt, icon, color, target} = OrdersInfo[OrderTypes.exchange];
    const title = T(tt, lang);
    const backgroundColor = stage === 0 ? dprimary : Colors.green200;

    return <Card style={[styles.card, {backgroundColor}]}  >
        {/*<Card.Title title="Current" subtitle="Card Subtitle"/>*/}
        {/*<Card.Title title="Current" subtitle="Card Subtitle"/>*/}
        {stage === 0 && <Card.Content>
            <Paragraph style={gStyles.text}>{T("wallet.ex_info2", lang)}</Paragraph>
            <Title style={gStyles.text}>{title} {getCurrencySymbol(cur)}{toTwoDigit(amount)} {T("wallet.to", lang)} {getCurrencySymbol(ocur)}{toTwoDigit(oAmount)}</Title>
        </Card.Content>}

        {stage === 1 && <Card.Content>
            <Paragraph style={gStyles.text}>{T("wallet.Completed", lang)}</Paragraph>
            <Title style={gStyles.text}>{T("wallet.ex_done", lang)}</Title>
        </Card.Content>}


    </Card>;

}


function ExchangeConfirm({navigation, route}) {
    const {setOptions, navigate} = navigation;
    const {user, lang} = useSelector(({pax}) => pax);
    const {bid} = user;

    useEffect(() => {
        setOptions({title: T("wallet.ConfirmExchange", lang)});
    }, [lang]);

    const params = getParams(route, "amount oAmount cur ocur bwid wid back bid");
    params.type = OrderTypes.exchange;


    const [loader, setLoader] = useState(false);
    const [stage, setStage] = useState(0);

    // const transactions = getExchangeTransactions(params);

    // console.log("transactions", transactions);
    // console.log("params", params);

    const {isConnected} = useNetInfo();
    const dispatch = useDispatch();
    const showError = () => dispatch(setValues(getNetError(lang)));

    const error = false;
    const confirmAction = () => {

        if(!isConnected) {
            showError();
            return;
        }


        if(stage === 1) {
            navigate(params.back, {screen: getScreen(params.back)});
            return;
        }

        const transactions = getExchangeTransactions(params);



        saveOrder(user, {...params, transactions}, setLoader, () => {
            console.log("saveOrder", params);
            blockAmount(params, setLoader, res => {
                setStage(1);
                console.log("blockAmount", res);
            }, err => console.log("errrr", err))
        }, console.log);


        //TODO: const transactions = getExchangeTransactions({...params, bid});
        //TODO: doWallets(transactions, setLoader, () => setStage(1), console.log, lang);

        //exchange(user, params, setLoader, () => setStage(1), console.log);
    };
    return <JPage>
        <ConfirmBox {...params} stage={stage} />
        <ConfirmButton stage={stage} loader={loader} onPress={confirmAction} />
    </JPage>;
}

ExchangeConfirm.title = P("wallet.ConfirmExchange");
export default ExchangeConfirm;
