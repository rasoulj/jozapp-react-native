import React, {useEffect, useRef, useState} from "react"
import {JCard, JPage, ToastTypes} from "../../../Components";
import {getFlagSource, getParams} from "../../../utils";
import {getCurrencyName, WalletTypes} from "../../../jozdan-common-temp/currency";
import {
    Headline,
    HelperText,
    TextInput,
    Title,
    Button,
    Avatar,
    Caption,
    Colors,
    IconButton,
    Text,
} from "react-native-paper";
import {View} from "react-native"
import {commafy} from "../../../jozdan-common-temp/utils";
import {OrdersInfo} from "./info";
import {useSelector} from "react-redux";
import {OrderTypes} from "../../../jozdan-common-temp/db";
import AvailCurrency from "./AvailCurrency";
import {getScreen} from "../index";
import {T} from "../../../i18n";
import {accent} from "../../../jozdan-common-temp/theme";
import QRCode from "react-native-qrcode-svg";
import {createOrderNo, getTransDesc} from "../../../utils/db_mongo";
import ViewShot from "react-native-view-shot";
import {TermDef} from "../../TransactionsScreen/Transaction";
import Share from "react-native-share";

function TopupWithdraw({navigation, route}) {
    const {setOptions, navigate} = navigation;
    // const {navigate} = navigation;

    const {type, cur, back = "Wallet"} = getParams(route, "type cur back");
    const curName = getCurrencyName(cur);
    const {wallet, rates, user: {walletType = WalletTypes.bronze, wid}, branch: {defCurrency}, lang} = useSelector(({pax}) => pax);




    const {title: tt, icon, color, target} = OrdersInfo[type];

    const title = T(tt, lang);

    useEffect(() => {
        setOptions({title: `${title} ${curName}`});
    }, [lang]);

    const [amount, setAmount] = useState(undefined);
    const [orderNo, setOrderNo] = useState("");

    useEffect(() => {
        setOrderNo(createOrderNo());
    }, []);

    const qrCodeValue = [amount, cur, orderNo, type === OrderTypes.withdraw ? "W" : "T"].join("|");


    const avail = wallet[cur] || 0;
    const error = 1*amount <= 0 || (type === OrderTypes.withdraw && amount > avail);
    let page;

    // const gotoConfirm = () => navigate("TopupWithdrawConfirm", {screen});
    const gotoConfirm = () => {
        console.log(amount);
        if(error || isNaN(1*amount)) {
            setAmount(0);
            page.setToast(T("wallet.ERROR_AMOUNT", lang), ToastTypes.danger, 5000);
            return;
        }
        navigate(`${target}Confirm`, {screen: getScreen(back), amount, cur, type, back, wid});
    };

    const shot = useRef(null);

    const doShare = () => {
        shot.current.capture().then(url => {
            let shareImageBase64 = {
                title: T("tran.share_title", lang),
                url,
                subject: 'Share Link', //  for email
                message: T("tran.share_detail", lang)
            };
            Share.open(shareImageBase64).catch(error => console.log(error));

        });
    };


    return <JPage ref={ref => page = ref}>

        <AvailCurrency walletType={walletType} cur={cur} wallet={wallet} rates={rates} defCurrency={defCurrency} />

        <HelperText type="info" visible>{T("wallet.ex_info", lang, [title])}</HelperText>
        <TextInput
            theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
            style={{backgroundColor: '#fff'}}
            error={error}
            mode="flat"
            label={T("wallet.Amount", lang)}
            keyboardType="numeric"
            onChangeText={amount => setAmount(1*amount)}
        />
        <HelperText type="error" visible={error}>{T("wallet.ERROR_AMOUNT", lang)}</HelperText>

        <Button style={{marginTop: 20}} disabled={error} icon={icon} color={color} mode="contained" onPress={gotoConfirm}>
            {title}
        </Button>

        {amount > 0 && type === OrderTypes.topUp ?
        <View style={{marginTop: 0, alignItems: 'center'}}>
            <IconButton size={32} style={{alignSelf: 'flex-end'}} color={Colors.red600} icon="share" onPress={doShare}/>
            <ViewShot ref={shot} options={{format: "jpg", quality: 0.9}}>
                <QRCode value={qrCodeValue} backgroundColor="#fff" color={'#000'} size={200} />
            </ViewShot>
        </View> : null}

        {/*<Text style={{color: "#000"}}>{qrCodeValue}</Text>*/}


    </JPage>
}

TopupWithdraw.title = "Topup - Withdraw";
export default TopupWithdraw;
