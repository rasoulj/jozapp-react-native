import React, {useState, useEffect, useRef} from "react"
import {JCard, JPage, NoData} from "../../Components";
import {TextInput, Text, IconButton, Colors, HelperText, Title, Caption, Button, Menu, Divider, Headline} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../redux/actions";
import {T} from "../../i18n";
import PhoneInput from "react-native-phone-number-input";
import {accent, primary, secondary} from "../../jozdan-common-temp/theme";
import {Image, View} from "react-native";
import {combinePP} from "../../utils";
import {
    baseApiUrl,
    checkVerificationCode,
    loadUsers,
    saveUser,
    saveUserNoAuth,
    sendVerificationSms
} from "../../utils/db_mongo";
import {TermDef} from "../TransactionsScreen/Transaction";
import {camelCase, getErrorMessage} from "../../jozdan-common-temp/utils";
import HelperError from "../../Components/HelperError";

const D = false;

const CancelButton = ({onCancel, lang}) => <Button compact mode="contained" style={{marginVertical: 20}} color={Colors.grey200} onPress={onCancel} >
    {T("back", lang)}
</Button>;

function sendVerificationDebug(data, verifyExistence, setLoader, onDone, onError = console.log) {
    setLoader(true);
    setTimeout(() => {
        setLoader(false);
        onDone();
    }, 2000);
}

export function checkVerificationDebug(phone, code, setLoader, onDone, onError = console.log) {
    setLoader(true);
    setTimeout(() => {
        setLoader(false);
        if(code === "2537") onDone();
        else onError("Invalid code");
    }, 3000);
}

// const checkVerification = D ? checkVerificationDebug : checkVerificationCode;
const checkVerification = checkVerificationCode;



// const sendVerification = D ? sendVerificationDebug : sendVerificationSms;
// const sendVerification = sendVerificationSms;

const Stage_2 = ({aid, lang, onChange, loader, setLoader, onDone, onCancel}) => {

    const [error, setError] = useState();
    const [phone, setPhone] = useState("");
    const [prefix, setPrefix] = useState("+98"); //"javad@farsan.com"); 964913383400@nnw.click

    const _onChange = (prefix, phone) => {
        setError();
        onChange(combinePP(prefix, phone));
    };

    const checkPhoneAvail = async () => {
        setError();
        const ph = combinePP(prefix, phone);
        if(!ph || ph.length <= 8) {
            setError("auth.err.invalid_phone");
            return ;
        }


        sendVerificationSms({aid, phone: ph},
            true,
            setLoader, onDone,
            setError
        );
    };

    return <JCard>
        <HelperText
            theme={{colors: {text: Colors.black}}}
            type="info" visible>{T("auth.register_customer.-2", lang)}</HelperText>
        <PhoneInput
            style={{direction: "ltr"}}
            // ref={phoneInput}
            defaultCode="IR"
            textContainerStyle={{direction: "ltr"}}
            value={phone}
            onChangeCountry={({callingCode: prefix}) => {
                setPrefix(prefix);
                _onChange(prefix, phone);
            }}
            onChangeText={phone => {
                setPhone(phone);
                _onChange(prefix, phone);
            }}
            // onChangeFormattedText={setPhone}
            layout="first"
            codeTextStyle={{padding: 0}}
            textInputStyle={{padding: 0, direction: "ltr"}}
            containerStyle={{width: "100%", borderWidth: 1.5, borderColor: accent, direction: "ltr"}}/>
        {/*<HelperText type="error" visible={error}>{getErrorMessage(error)}</HelperText>*/}
        <HelperError lang={lang} error={error} />
        <Button
            color={secondary}
            style={{marginTop: 30}}
            icon={"email"} mode="contained" compact loading={loader} onPress={checkPhoneAvail}>
            {T("auth.send_sms", lang)}
        </Button>
        <CancelButton lang={lang} onCancel={onCancel} />
    </JCard>
};


const Stage0 = ({aid, lang, onChange, loader, setLoader, onDone, onCancel}) => {

    const [error, setError] = useState();
    const [phone, setPhone] = useState("");
    const [prefix, setPrefix] = useState("+98"); //"javad@farsan.com"); 964913383400@nnw.click

    const _onChange = (prefix, phone) => {
        setError();
        onChange(combinePP(prefix, phone));
    };

    const checkPhoneAvail = async () => {
        setError();
        const ph = combinePP(prefix, phone);
        if(!ph || ph.length <= 8) {
            setError("auth.err.invalid_phone");
            return ;
        }


        sendVerificationSms({aid, phone: ph},
            false,
            setLoader, onDone,
            setError
        );
    };

    return <JCard>
        <HelperText
            theme={{colors: {text: Colors.black}}}
            type="info" visible>{T("auth.mes.send_sms", lang)}</HelperText>
        <PhoneInput
            style={{direction: "ltr"}}
            // ref={phoneInput}
            defaultCode="IR"
            textContainerStyle={{direction: "ltr"}}
            value={phone}
            onChangeCountry={({callingCode: prefix}) => {
                setPrefix(prefix);
                _onChange(prefix, phone);
            }}
            onChangeText={phone => {
                setPhone(phone);
                _onChange(prefix, phone);
            }}
            // onChangeFormattedText={setPhone}
            layout="first"
            codeTextStyle={{padding: 0}}
            textInputStyle={{padding: 0, direction: "ltr"}}
            containerStyle={{width: "100%", borderWidth: 1.5, borderColor: accent, direction: "ltr"}}/>
        {/*<HelperText type="error" visible={error}>{getErrorMessage(error)}</HelperText>*/}
        <HelperError lang={lang} error={error} />
        <Button
            color={secondary}
            style={{marginTop: 30}}
            icon={"email"} mode="contained" compact loading={loader} onPress={checkPhoneAvail}>
            {T("auth.send_sms", lang)}
        </Button>
        <CancelButton lang={lang} onCancel={onCancel} />
    </JCard>
};

const Stage1 = ({lang, loader, setLoader, onDone, onCancel, phone, stage}) => {
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState();

    const checkVerif = async () => {
        // console.log("checkVerificationCode", verificationCode);
        checkVerification(
            phone,
            verificationCode,
            setLoader,
            onDone,
            setError
        );
    };

    return <JCard>
        <HelperText
            theme={{colors: {text: Colors.black}}}
            type="info" visible={true}>{T("auth.mes.enter_code" + (stage < 0 ? ".1" : ""), lang)}</HelperText>
        <TextInput
            keyboardType="numeric"
            style={{backgroundColor: '#fff'}}
            theme={{colors: {placeholder: accent, primary: accent, text: Colors.black}}}
            // autoCompleteType="username"
            selectionColor={secondary}
            // dense
            underlineColor={accent}
            error={error}
            disabled={loader}
            mode="outlined"
            label={T("auth.verification_code", lang)}
            value={verificationCode}
            onChangeText={text => {
                setError();
                setVerificationCode(text);
            }}
        />
        {/*<HelperText type="error" visible={error}>{error}</HelperText>*/}
        <HelperError lang={lang} error={error} />

        <Button
            color={accent}
            style={{marginTop: 30}}
            icon={"check"} mode="contained" compact loading={loader} onPress={checkVerif}>
            {T("auth.verify_code", lang)}
        </Button>
        <CancelButton onCancel={onCancel} lang={lang} />
    </JCard>;
};

const Stage2 = ({aid, onCancel, lang, loader, setLoader, onDone}) => {
    const [branches, setBranches] = useState();
    const [selected, setSelected] = useState();
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errors, setErrors] = useState({});
    const [loader2, setLoader2] = useState(false);

    // const enabled = !!selected && displayName && displayName.length > 6;

    const register = () => {
        // console.log("sel", errors);
        // console.log("sel2", errors);

        let e = {};

        if(!displayName || displayName.length < 6) {
            e.displayName = "auth.err.invalid_displayName";
        }

        if(!selected) {
            e.selected = "auth.err.no_branch";
        }
        if(!password || password.length < 6) {
            e.password = "auth.err.invalid_password";
        }
        if(confirm !== password) {
            e.confirm = "profile.UserInfo.not_matched";
        }


        setErrors(e);

        if(Object.keys(e).length > 0) return;

        onDone(selected, displayName, password);
    };

    const [visible, setVisible] = useState(false);
    const selectBranch = branch => {
        setSelected(branch);
        setVisible(false);
        setErrors({});
    };

    useEffect(() => {
        loadUsers({role: "BRANCH", aid}, setLoader2, setBranches);
    }, [aid]);

    // console.log("bra", errors);

    return <JCard>
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={<Button
                loader={loader2}
                icon={"chevron-down"}
                onPress={() => setVisible(true)}>{!selected ? T("auth.select_branch") : selected.displayName}</Button>}>
            {(branches || []).map(p => <Menu.Item key={p.uid} onPress={() => selectBranch(p)} title={p.displayName} />)}
        </Menu>
        {/*<HelperText type="error" visible={errors.selected}>{errors.selected}</HelperText>*/}
        <HelperError lang={lang} error={errors.selected} />

        <TextInput
            style={{backgroundColor: '#fff'}}
            theme={{colors: {placeholder: accent, primary: accent, text: Colors.black}}}
            // autoCompleteType="username"
            selectionColor={secondary}
            // dense
            underlineColor={accent}
            error={errors.displayName}
            disabled={loader}
            mode="outlined"
            label={T("auth.displayName", lang)}
            value={displayName}
            onChangeText={text => {
                setErrors({});
                setDisplayName(text);
            }}
        />
        {/*<HelperText type="error" visible={errors.displayName}>{errors.displayName}</HelperText>*/}
        <HelperError lang={lang} error={errors.displayName} />

        <TextInput
            style={{backgroundColor: '#fff'}}
            secureTextEntry
            theme={{colors: {placeholder: accent, primary: accent, text: Colors.black}}}
            autoCompleteType="password"
            selectionColor={secondary}
            // dense
            underlineColor={accent}
            error={errors.password}
            disabled={loader}
            mode="outlined"
            label={T("auth.password", lang)}
            value={password}
            onChangeText={text => {
                setErrors({});
                setPassword(text);
            }}
        />
        {/*<HelperText type="error" visible={errors.password}>{errors.password}</HelperText>*/}
        <HelperError lang={lang} error={errors.password} />

        <TextInput
            style={{backgroundColor: '#fff'}}
            secureTextEntry
            theme={{colors: {placeholder: accent, primary: accent, text: Colors.black}}}
            autoCompleteType="password"
            selectionColor={secondary}
            // dense
            underlineColor={accent}
            error={errors.confirm}
            disabled={loader}
            mode="outlined"
            label={T("auth.confirm", lang)}
            value={confirm}
            onChangeText={text => {
                setErrors({});
                setConfirm(text);
            }}
        />
        {/*<HelperText type="error" visible={errors.confirm}>{errors.confirm}</HelperText>*/}
        <HelperError lang={lang} error={errors.confirm} />

        <Button
            color={Colors.green600}
            style={{marginTop: 30}}
            icon={"check"} mode="contained" compact loading={loader} onPress={register}>
            {T("register", lang)}
        </Button>
        <CancelButton onCancel={onCancel} lang={lang} />
    </JCard>;
};

const Stage3 = ({password, branch, displayName, phone, onDone, agency, lang, loader, setLoader, onCancel, phone0}) => {
    // console.log("braaaa", branch);
    const {displayName: branchName, uid: bid} = branch || {};
    const {displayName: agencyName, uid: aid} = agency || {};

    const [error, setError] = useState();

    const defs = [
        {lang, tid: "auth.displayName", def: displayName},
        {lang, tid: "auth.agency_name", def: agencyName},
        {lang, tid: "auth.branch_name", def: branchName},
        {lang, tid: "auth.phone", def: phone},
        {lang, tid: "auth.register_customer.-2", def: phone0},
    ];

    const createUser = () => {
        setError();
        const user = {
            password,
            bid,
            displayName,
            aid,
            role: "4-branchCustomer",
            address: "-",
            phone,
            referPhone: phone0,
        };

        // onDone();
        // console.log("user", user);
        saveUserNoAuth(user, setLoader, onDone, err => setError(getErrorMessage(err)));

    };

    return <JCard>
        <Title style={{color: Colors.black, textAlign: 'center', marginVertical: 20}}>{T("auth.mes.user_will_created", lang)}</Title>
        {defs.map((p, i) => <TermDef last={i === defs.length-1} {...p} key={i}/>)}

        <Button
            color={secondary}
            style={{marginTop: 50}}
            icon={"email"} mode="contained" compact loading={loader} onPress={createUser}>
            {T("auth.create_customer", lang)}
        </Button>
        <HelperError lang={lang} error={error} />
        {/*<HelperText type="error" visible={error}>{getErrorMessage(error)}</HelperText>*/}

        <CancelButton onCancel={onCancel} />
    </JCard>;
};

const Stage4 = ({lang, onClose}) => {
    useEffect(() => {
        setTimeout(onClose, 2500);
    }, []);
    return <JCard>
        <Title style={{color: Colors.black, textAlign: 'center', marginVertical: 20}}>{T("auth.mes.user_created", lang)}</Title>

        <NoData message={T("auth.mes.wait", lang)} />
    </JCard>;
};

const Register = () => {
    const dispatch = useDispatch();

    const {lang, agency} = useSelector(({pax}) => pax);

    const [stage, setStage] = useState(-2);
    const [loader, setLoader] = useState(false);
    const [phone, setPhone] = useState("");
    const [phone0, setPhone0] = useState("");
    const [branch, setBranch] = useState({});
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const {uid: aid, displayName: agencyName, logo2} = agency || {};

    const onClose = () => dispatch(setValues({openRegister: false}));

    const registerUser = (branch, displayName, password) => {
        const {bid} = branch;
        setDisplayName(displayName);
        setBranch(branch);
        setPassword(password);
        // console.log("bid, displayName", aid, bid, displayName, phone);
        setStage(3);
    };

    const props_2 = {
        aid,
        lang,
        onChange: setPhone0,
        loader, setLoader,
        onDone: () => setStage(-1),
        onCancel: onClose
    };
    const props_1 = {
        stage,
        aid,
        lang,
        phone: phone0,
        // onChange: setPhone,
        loader, setLoader,
        onDone: () => setStage(0),
        onCancel: () => setStage(-2)
    };
    const props0 = {
        aid,
        lang,
        onChange: setPhone,
        loader, setLoader,
        onDone: () => setStage(1),
        onCancel: () => setStage(-1)
    };
    const props1 = {
        stage,
        aid,
        lang,
        phone,
        // onChange: setPhone,
        loader, setLoader,
        onDone: () => setStage(2),
        onCancel: () => setStage(0)
    };
    const props2 = {
        aid,
        lang,
        // onChange: setPhone,
        loader, setLoader,
        onDone: registerUser,
        onCancel: () => setStage(1)
    };

    const props3 = {
        branch, displayName, phone, password, phone0,
        onDone: () => setStage(4),
        onCancel: () => setStage(2),
        agency, lang, loader, setLoader
    };

    const props4 = {
        lang, onClose
    };



    // const {agency} = props;

    console.log("stage", stage);

    return <JPage>
        <IconButton size={32} style={{alignSelf: 'flex-end'}} color={Colors.red600} icon="close" onPress={onClose}/>

        <JCard>
            <Headline style={{color: Colors.black, paddingTop: 10, textAlign: 'center'}}>{T("auth.register_customer", lang)}</Headline>
            <Title style={{color: Colors.black, paddingTop: 10, textAlign: 'center'}}>{T(`auth.register_customer.${stage}`, lang)}</Title>

            <Image size={148} style={{margin: 10, width: 140, height: 140, alignSelf: 'center'}}
                   source={{uri: `${baseApiUrl}/${logo2}`}}/>
        </JCard>

        {stage ===  -2
            ? <Stage_2 {...props_2} />
            : stage === -1 ? <Stage1 {...props_1} />
            : stage === 0 ? <Stage0 {...props0} />
            : stage === 1 ? <Stage1 {...props1} />
            : stage === 2 ? <Stage2 {...props2} />
            : stage === 3 ? <Stage3 {...props3} />
            : <Stage4 {...props4} />
        }
    </JPage>
};

export default Register;
