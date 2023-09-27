import React, {useRef, useEffect, useState} from "react"
import {JCard, JPage, TranView} from "../../Components";
import {FAB, Text, Avatar, Headline, Caption, Title, Card} from "react-native-paper";
import {getFlagSource, getParams} from "../../utils";
import {StyleSheet, View} from "react-native"
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import {formalCustomerNumber, stdCustomerNumber} from "../../jozdan-common-temp/account";
import {camelCase, toTwoDigit} from "../../jozdan-common-temp/utils";
import {getCurrencyName, getCurrencySymbol, toUpperCase} from "../../jozdan-common-temp/currency";
import {toLongDate} from "../../utils";
import {P, T} from "../../i18n";
import {useSelector} from "react-redux";
import gStyles from "../../utils/gStyles";
import {getTransDesc, loadUsersByWid} from "../../utils/db_mongo";

export function TermDef({tid, def, visible = true, lang = "en", last = false}) {
    if(!visible) return null;
    return <View style={last ? styles.view2 : styles.view3}>
        <Caption style={styles.text1}>{T(tid, lang)}:</Caption>
        <Text style={styles.title1}>{def} </Text>
        {/*<Text style={gStyles.text}>{T(tid, lang)}:</Text>*/}
        {/*<Text style={styles.defStyle}>{def}</Text>*/}
    </View>;
}

function Transaction({navigation, route}) {
    const {navigate, setOptions} = navigation;
    const {lang, user, branch: {displayName: bname}} = useSelector(({pax}) => pax);
    const [loader, setLoader] = useState(false);
    const [obranch, setOBranch] = useState();

    const {displayName: oname} = obranch || {};

    useEffect(() => {
        setOptions({title: T("tran.detail", lang)});
    }, [lang]);

    const shot = useRef(null);
    const {tran} = getParams(route, "tran");
    //{"amount": 1000, "cur": "iqd", "desc": "Transferred from 1359-8098-4896-2077", "id": "8f3fbd83-0a2d-409a-8d0c-70e9c9876629", "isPositive": true, "type": "transfer", "updatedAt": {"_nanoseconds": 595000000, "_seconds": 1604845417}}
    // console.log(tran);

    const {
        amount,
        cur,
        isPositive,
        updatedAt,
        desc,
        type = "transfer",
        orderNo,
        wid,
        cwid,
        issueDate,
        createdAt,
        owid
    } = tran || {};
    const am = (isPositive ? `${toTwoDigit(amount)} ` : `(${toTwoDigit(amount)}) `) + toUpperCase(cur);

    // console.log("createdAt", createdAt, updatedAt);

    const defs = [
        {lang, visible: true, tid: "tran.type", def: camelCase(type)},
        {lang, visible: true, tid: "tran.updatedAt", def: toLongDate(updatedAt)},
        {lang, visible: true, tid: "tran.issueDate", def: toLongDate(createdAt)},
        {lang, visible: !!orderNo, tid: "tran.orderNo", def: orderNo},
        {lang, visible: !!wid, tid: "tran.wid", def: stdCustomerNumber(wid)},
        {lang, visible: !!owid, tid: "tran.cwid", def: stdCustomerNumber(owid)},
        {lang, visible: true, tid: "tran.bname", def: bname},
        {lang, visible: !!oname, tid: "tran.oname", def: oname},
    ];

    useEffect(() => {
        if(!owid || wid === owid) return;
        loadUsersByWid([formalCustomerNumber(owid)], setLoader, b => {
            setOBranch(!!b && b.length > 0 ? b[0] : null);
        }, console.log);
    }, []);

    return <JPage
        loader={loader}
        fab={<FAB
        style={styles.fab}
        icon="share-variant"
        onPress={() => {
            shot.current.capture().then(url => {
                let shareImageBase64 = {
                    title: T("tran.share_title", lang),
                    url,
                    subject: 'Share Link', //  for email
                    message: T("tran.share_detail", lang)
                };
                Share.open(shareImageBase64).catch(error => console.log(error));

            });
        }}
    />}>
        <ViewShot ref={shot} options={{format: "jpg", quality: 0.9}}>
            <JCard style={{backgroundColor: '#fff', margin: 20, marginEnd: 20, paddingBottom: 30}}>
                <Avatar.Image style={styles.center} source={getFlagSource(cur)}/>
                <Headline style={styles.center}>{am}</Headline>
                <Caption style={{...styles.center, ...styles.defStyle}}>{getTransDesc(tran, user, lang)}</Caption>

                {defs.map((p, i) => <TermDef last={i === defs.length-1} {...p} key={i}/>)}


            </JCard>
        </ViewShot>

    </JPage>
}

const view0 = {flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10};
const view2 = {marginHorizontal: 20};
const border = {borderBottomWidth: 0.5, borderColor: '#aaa'};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    center: {
        alignSelf: 'center',
        marginVertical: 10,
        ...gStyles.text
    },
    defStyle: {fontWeight: 'bold', ...gStyles.text},
    view0,
    view1: {...view0, ...border},
    view2,
    view3: {...view2, ...border},
    text1: {paddingVertical: 1, ...gStyles.text},
    title1: {alignSelf: 'flex-end', ...gStyles.text, fontWeight: 'bold'},

});

Transaction.title = P("tran.detail");

export default Transaction;

