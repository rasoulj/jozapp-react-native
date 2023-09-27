import React, {useState, useEffect} from "react"
import {JPage} from "../../../Components";
import {
    Button,
    Caption,
    Card,
    HelperText,
    IconButton,
    Text,
    TextInput,
    Title,
    Headline,
    Paragraph,
    Colors
} from "react-native-paper";
import {getParams} from "../../../utils";
import {getCurrencyName, toUpperCase, WalletTypes} from "../../../jozdan-common-temp/currency";
import {OrdersInfo} from "./info";
import AvailCurrency from "./AvailCurrency";
import {useSelector} from "react-redux";
import {Dimensions, View} from "react-native"
import TextInputMask from 'react-native-text-input-mask';
import {stdCustomerNumber, validCustomerNumber} from "../../../jozdan-common-temp/account";
import {toTwoDigit} from "../../../jozdan-common-temp/utils";
import {RNCamera} from "react-native-camera";
import {accent, primary} from "../../../jozdan-common-temp/theme";
import {getScreen} from "../index";
import {loadFees} from "../../../utils/db_mongo";
import {P, T} from "../../../i18n";
import gStyles from "../../../utils/gStyles";
import HelperError from "../../../Components/HelperError";
const {width, height} = Dimensions.get('window');

//iw-1359309148962078-wi

function extractWID(rawCode) {
    if(!rawCode || rawCode.length !== 22) return null;
    if(rawCode.substring(0, 3) !== "iw-" || rawCode.substring(19) !== "-wi") return null;

    return stdCustomerNumber(rawCode.substring(3, 19));
}


function Transfer({navigation, route}) {
    const {setOptions, navigate} = navigation;

    const {lang, wallet, rates, user: {walletType = WalletTypes.bronze, aid}, branch: {defCurrency}} = useSelector(({pax}) => pax);

    // console.log("aid-aid", aid);

    const [loader, setLoader] = useState(false);
    const [fees, setFees] = useState({});

    useEffect(() => {
        loadFees(aid, setLoader, setFees, console.log, 1);
    }, [aid]);

    const {transfer} = fees || {transfer: 0};

    console.log("transfer", transfer);

    const {type, cur, back = "Wallet"} = getParams(route, "type cur back");
    const curName = getCurrencyName(cur);
    const avail = wallet[cur] || 0;


    const {title: tt, icon, color, target} = OrdersInfo[type];
    const title = T(tt, lang);
    //const error = false;

    const [amount, setAmount] = useState(0); //undefined);
    const [qRError, _setQRError] = useState(undefined); //undefined);

    const setQRError = err => {
        _setQRError(err);
        setTimeout(() => _setQRError(undefined), 3000);
    };


    const [cwid, setCwid] = useState("");

    const [errors, setErrors] = useState({});
    const [showScanner, setShowScanner] = useState(false);

    const gotoConfirm = () => {
        // console.log("back", back, Screens[back], screen);
        navigate(`${target}Confirm`, {screen: getScreen(back), amount: 1*amount, cur, cwid, fee: transfer*amount/100.0, back});
    };

    const a = 1*amount;
    const error = Object.values(errors).filter(v => !!v).length > 0 || isNaN(a) || a <= 0 || a > avail ;

    // noinspection JSSuspiciousNameCombination
    return showScanner ? <JPage style={{padding: 20}}>
        <Title style={{zIndex: 20, alignSelf: 'center', color: !qRError ? primary : Colors.red600}}>{!qRError ? T("wallet.qr_info", lang) : qRError}</Title>

        <RNCamera
            // type="front"
            style={{width: "100%", height: width}}
            captureAudio={false}
            onBarCodeRead={({data}) => {
                const cwid = extractWID(data);
                if(!!cwid) {
                    setCwid(cwid);
                    setShowScanner(false);
                }
                else setQRError(T("wallet.qr_error1", lang));
                // console.log(data, extractWID(data));
            }}
        />
        <Button icon="close" onPress={() => setShowScanner(false)}>{T("Cancel", lang)}</Button>
    </JPage> : <JPage loader={loader}>
        <AvailCurrency walletType={walletType} cur={cur} wallet={wallet} rates={rates} defCurrency={defCurrency}/>

        {/*<Text>{error} {amount} {cwid}</Text>*/}

        <HelperText type="info" visible>{T("wallet.transfer_info", lang, [title])}</HelperText>
        <TextInput
            value={amount+""}
            theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
            style={{backgroundColor: '#fff'}}
            error={errors.amount}
            mode="flat"
            label={T("wallet.Amount", lang)}
            keyboardType="numeric"
            onChangeText={amount => {
                const a = 1*amount;
                const fee = amount*transfer/100.0;
                let err = undefined;
                if(isNaN(a)) err = T("wallet.ERROR_AMOUNT", lang);
                else if(a < 0) err = T("wallet.NO_NEG", lang);
                else if(a + fee > avail) err = T("wallet.AMOUNT_EXCEED", lang);
                setErrors({...errors, amount: err});
                setAmount(amount);
            }}
        />
        <HelperError lang={lang} error={errors.amount} />
        {/*<HelperText type="error" visible={!!errors.amount}>{errors.amount}</HelperText>*/}

        {!errors.amount && <Text style={{paddingLeft: 15, fontWeight: 'bold', fontSize: 16, ...gStyles.text}}>{T("wallet.Amount", lang)}: {toTwoDigit(1*amount)} {toUpperCase(cur)}</Text>}
        <Text style={{paddingLeft: 15, paddingBottom: 15, fontWeight: 'bold', fontSize: 16, ...gStyles.text}}>{T("wallet.transfer_fee", lang)}: {toTwoDigit(amount*transfer/100.0)} {toUpperCase(cur)} ({transfer}%)</Text>

        <HelperText type="info" visible>{T("wallet.target_wid", lang)}</HelperText>
        <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex: 0.8}}>
                <TextInput
                    // dense
                    render={props =>
                        <TextInputMask
                            {...props}
                            mask="[0000]-[0000]-[0000]-[0000]"
                        />
                    }
                    value={cwid}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    error={errors.cwid}
                    mode="flat"
                    label={T("wallet.wid", lang)}
                    keyboardType="numeric"
                    onChangeText={cwid => {
                        setCwid(cwid);
                        if(!cwid) return;
                        let err;
                        if(cwid.length < 19) err = T("wallet.wid_info", lang);
                        else if(!validCustomerNumber(cwid)) err = T("wallet.INVALID_WID", lang);

                        setErrors({...errors, cwid: err});

                    }}
                    theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
                    style={{backgroundColor: '#fff'}}
                />
            </View>
            <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                <IconButton color={"#000"} icon="qrcode-scan" size={35} onPress={() => setShowScanner(true)} />

            </View>
        </View>
        <HelperText type={cwid && cwid.length === 19 ? "error" : "info"} visible={!!errors.cwid}>{errors.cwid}</HelperText>


        <Button style={{marginVertical: 20}} disabled={!cwid || cwid.length !== 19 || error} icon={icon} color={color}
                mode="contained" onPress={gotoConfirm}>
            {title} {curName}
        </Button>


    </JPage>;
}

Transfer.title = P("wallet.Transfer");
export default Transfer;
