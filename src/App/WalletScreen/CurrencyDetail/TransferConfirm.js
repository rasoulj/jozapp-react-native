import React, {useState} from "react"
import {JPage} from "../../../Components";
import {Button, Caption, Card, Colors, HelperText, Text, Title} from "react-native-paper";
import {getErrorMessage, toTwoDigit} from "../../../jozdan-common-temp/utils";
import {getNetError, getParams} from "../../../utils";
import {useDispatch, useSelector} from "react-redux";
import {blockAmount, doWallets, loadBranch, loadUsersByWid, saveOrder} from "../../../utils/db_mongo";
import {formalCustomerNumber, stdCustomerNumber} from "../../../jozdan-common-temp/account";
import {OrderTypes} from "../../../jozdan-common-temp/db";
import {toUpperCase} from "../../../jozdan-common-temp/currency";
import {getScreen} from "../index";
import {cardStyle, dprimary} from "../../../jozdan-common-temp/theme";
import {P, T} from "../../../i18n";
import gStyles from "../../../utils/gStyles";
import {useNetInfo} from "@react-native-community/netinfo";
import {setValues} from "../../../redux/actions";

const styles = {
    text1: {paddingTop: 10, ...gStyles.text},
    title1: {alignSelf: 'flex-end', ...gStyles.text},
};

function Summary({amount, cur, cwid, error = false, fee = 0}) {
    const {lang} = useSelector(({pax}) => pax);

    return !error && <Card style={{marginTop: 10, ...cardStyle}}>
        <Card.Content>
            <Text style={styles.text1}>{T("wallet.transfer_mes", lang)}:</Text>
            <Title style={styles.title1}>{toTwoDigit(amount)} {toUpperCase(cur)} </Title>
            <Text style={styles.text1}>{T("wallet.transfer_fee", lang)}: </Text>
            <Title style={styles.title1}>{fee} {toUpperCase(cur)}</Title>
            <Text style={styles.text1}>{T("wallet.to_wid", lang)}: </Text>
            <Title style={styles.title1}>{cwid}</Title>
        </Card.Content>
    </Card>

}


function TransferConfirm({navigation, route}) {
    const {lang} = useSelector(({pax}) => pax);

    const {setOptions, navigate} = navigation;

    const [count, setCounter] = useState(0);
    const [loader, _setLoader] = useState(false);

    const setLoader = loader => {
        setCounter(count+1);
        _setLoader(loader);
    };

    const [info, setInfo] = useState({});


    const params = getParams(route, "amount cur cwid fee back");
    const {cwid, fee, amount, cur} = params;

    const {branch, user} = useSelector(({pax}) => pax);
    const {wid: bwid} = branch;
    const {wid, bid} = user;

    const transactions = [//amount, wid, cur, cwid, fee, bid, bwid
        {amount: -amount, wid: formalCustomerNumber(wid), cur, desc: "Transferred to "+stdCustomerNumber(cwid), type: OrderTypes.transfer, owid: cwid, fee, bid, hasDone: true},
        {amount: -fee, wid: formalCustomerNumber(wid), cur, desc: "For Transaction fee", type: OrderTypes.fee, owid: cwid, fee, bid, hasDone: true},
        {amount: fee, wid: formalCustomerNumber(bwid), cur, desc: "Transaction fee from "+stdCustomerNumber(cwid), type: OrderTypes.fee, owid: cwid, bid},
        {amount, wid: formalCustomerNumber(cwid), cur, desc: "Transferred from "+stdCustomerNumber(wid), type: OrderTypes.transfer, owid: wid, fee, bid},
    ];


    // console.log("trans", transactions);

    const {type} = info || {type: "error"};
    const done = type === "info";

    const doTransfer = () => doWallets(transactions, setLoader,
        () => setInfo({mes: T("wallet.transfer_done", lang), type: "info"}),
        err => setInfo({mes: getErrorMessage(err), type: "error"}),
        lang
    );

    const setErr = err => setInfo({mes: getErrorMessage(err), type: "error"});

    // console.log("params.back, getScreen(params.back)", params.back, getScreen(params.back));

    const {isConnected} = useNetInfo();
    const dispatch = useDispatch();
    const showError = () => dispatch(setValues(getNetError(lang)));

    const confirmAction = () => {

        if(!isConnected) {
            showError();
            return;
        }

        if(done) {
            navigate(params.back, {screen: getScreen(params.back)});
            return;
        }
        setInfo({});

        if(count) return;

        loadUsersByWid([formalCustomerNumber(cwid)], setLoader, b => {
            if(!b || b.length === 0) {
                doTransfer();
            } else {
                const newParams = {...params, wid};
                const {bid: obid} = b[0] || {};
                if(!obid || bid === obid) doTransfer(); //TODO:
                else {
                    loadBranch(b[0], setLoader, obranch => {
                        // transactions.splice(0, 1);
                        saveOrder(user, {
                            type: OrderTypes.transfer,
                            ...newParams,
                            obid,
                            obranch,
                            branch,
                            transactions
                        }, setLoader, () => {
                            blockAmount(newParams, setLoader,
                                () => setInfo({mes: T("wallet.transfer_wait_for_approval", lang), type: "info"}),
                                setErr);
                        }, setErr);
                    }, setErr);
                }
            }
        }, setErr);
    };

    const color = done ? Colors.lightGreen300 : Colors.lightBlue600;

    return <JPage>
        <Summary {...params} />
        <Button disabled={loader} loading={loader} style={{marginTop: 20}} icon={"check"} color={color} mode="contained" onPress={confirmAction}>
            {T(!done ? "wallet.Confirm" : "wallet.Done", lang)}
        </Button>
        <HelperText type={type} visible={!!info.mes}>{info.mes}</HelperText>
    </JPage>;
}

TransferConfirm.title = P("wallet.transfer_confirm");
export default TransferConfirm;
