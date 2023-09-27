import React, {useState, useEffect, useRef} from "react"
import {
    Text,
    Button,
    Title,
    Avatar,
    TextInput,
    HelperText, IconButton, Colors,

} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux"
import {setValues} from "../../redux/actions"
import {View, Image, ImageBackground, AppState, TouchableOpacity, Alert} from "react-native"
import {GridView, JCard, JPage, NoData} from "../../Components";
import {accent, primary, secondary} from "../../jozdan-common-temp/theme";
import {getErrorMessage, validPassword} from "../../jozdan-common-temp/utils";
import {changeLanguage, T} from "../../i18n";
import {combinePP, getFlagSource, trimAll} from "../../utils";
import AboutUs from "../ProfileScreen/AboutUs";

import FingerprintScanner from 'react-native-fingerprint-scanner';
import FingerprintPopup from '../../bio/FingerprintPopup.component';
import styles from '../../bio/Application.container.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LangOptions, SelectLang} from "../ProfileScreen/UserSettings";
import PhoneInput from "react-native-phone-number-input";
import {
    baseApiUrl,
    changePassword,
    checkVerificationCode,
    loadAgencies,
    login,
    sendVerificationSms, setPassword
} from "../../utils/db_mongo";
import RNRestart from "react-native-restart";
import {FormGen, SetPassModel} from "../ProfileScreen/UserSettings/ChangePassword";
import HelperError from "../../Components/HelperError";

function normalPhone(phone) {
    if(!phone || phone.length === 0) return phone;
    else if(phone[0] === "+") return phone;
    else return `+${phone}`;
}

const Stage3 = ({
                    aid,
                    lang,
                    phone,
                    loader, setLoader,
                    setStage
                }) => {
    const valuesArr = useState({});
    const errorsArr = useState({});
    const [errors, setErrors] = errorsArr;

    const validate = () => {
        const {password, confirm} = valuesArr[0];
        let errs = {};
        if(!validPassword(password)) errs.password = T("profile.UserInfo.enter_valid", lang);
        if(password !== confirm) errs.confirm = T("profile.UserInfo.not_matched", lang);
        return errs;
    };
    const setPass = () => {
        // console.log("changePass 1");
        const errs = validate();
        if(Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        // console.log("changePass", errs);

        const {password} = valuesArr[0];

        setPassword({phone, password, aid}, setLoader,
            err => setErrors({button: getErrorMessage(err), mesType: "error"}),
            () => {
                valuesArr[1]({password: "", confirm: ""});
                setErrors({button: T("profile.UserInfo.changed", lang), mesType: "info"});
                setStage(0);
            });
    };

    const {button, mesType} = errors || {};

    return <View>
        <Text/>
        <FormGen model={SetPassModel} valuesArr={valuesArr} errorsArr={errorsArr}/>
        <Button loading={loader} style={{marginTop: 20}} disabled={false} icon="lock" color={accent} mode="contained"
                onPress={setPass}>
            {T("profile.UserInfo.setPassword", lang)}
        </Button>
        <HelperText style={mesType !== "error" ? {color: "green"} : {}}  type={mesType} visible={button}>{button}</HelperText>

        <Button color={accent} onPress={() => {
            setErrors({});
            setStage(0);
        }}>
            {T("Cancel", lang)}
        </Button>
    </View>;
};

const Stage01 = (
    {
        aid,
        lang,
        errors, setErrors,
        loader, setLoader,
        stage, setStage,
        onChange = console.log
    }) => {

    const dispatch = useDispatch();

    const [prefix, setPrefix] = useState("+98"); //"javad@farsan.com"); 964913383400@nnw.click
    const [password, setPassword] = useState(""); //"123456");
    const [phone, setPhone] = useState(""); //"123456");
    const [errorMessage, setErrorMessage] = useState();

    const {phone: savedPhone, password: savedPassword} = useSelector(({pax}) => pax);

    const savedCred = savedPhone && savedPassword;

    console.log("savedCred", savedCred, savedPhone, savedPassword);

    const handleFingerprintShowed = () => {
        if(!savedPassword || !savedPhone) Alert.alert(T("auth.err.bio_title", lang), T("auth.err.bio", lang));
        else setPopupShowed(true);
    };
    const handleFingerprintDismissed = () => setPopupShowed(false);

    const detectFingerprintAvailable = () => {
        FingerprintScanner
            .isSensorAvailable()
            .catch(({message, biometric}) => {
                setErrorMessage(message);
                setBiometric(biometric);
                //this.setState({ errorMessage: error.message, biometric: error.biometric })
            });
    };

    const handleAppStateChange = (nextAppState) => {
        if (appState && appState.match(/inactive|background/) && nextAppState === 'active') {
            FingerprintScanner.release();
            detectFingerprintAvailable();
        }
        setAppState(nextAppState);
    };

    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        }
    }, []);

    const setLoginError = (err) => {
        console.log(err);
        setErrors({login: err});
    };

    const doLogin = (phone0, password) => {
        const phone = normalPhone(phone0);
        onChange(phone);
        login({aid, phone, password}, setLoader,
            values => dispatch(setValues({...values, phone, password}, true)),
            setLoginError);
    };


    const [biometric, setBiometric] = useState();
    const [popupShowed, setPopupShowed] = useState();
    const [appState, setAppState] = useState();



    // console.log("loader", loader);

    const _onChange = (prefix, phone) => onChange(combinePP(prefix, phone));

    return <View>
        <HelperText type="info" visible={stage === 1}>{T("auth.mes.send_sms", lang)}</HelperText>
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
        <HelperError lang={lang} error={errors.username} />
            {/*<HelperText type="error" visible={errors.username}>{errors.username}</HelperText>*/}

        {stage === 0 && <TextInput
            secureTextEntry
            theme={{colors: {placeholder: accent, primary: accent}}}
            autoCompleteType="username"
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
        />}
        {/*<HelperText type="error" visible={errors.password}>{errors.password}</HelperText>*/}
        <HelperError lang={lang} error={errors.password} />
        <Button
            color={stage === 0 ? accent : secondary}
            style={{marginVertical: 10}}
            icon={stage === 0 ? "login" : "email"} mode="contained" compact loading={loader} onPress={async () => {
                setErrors({});
            const errors = {};
            if (stage === 1) {
                if (phone.length < 6) setErrors({username: "auth.err.username"});
                if (Object.keys(errors).length > 0) return;

                const data = {aid, phone: combinePP(prefix, trimAll(phone))};
                // console.log("data", data);

                sendVerificationSms(
                    data,
                    true,
                    setLoader,
                    () => setStage(2),
                    setLoginError
                );

                // setLoader(true);
                // auth
                //     .sendPasswordResetEmail(phone).then(() => setStage(2))
                //     .catch(err => setErrors({login: getErrorMessage(err)}))
                //     .finally(() => setLoader(false));

                return;
            }

            if (phone.length < 6) errors.username = "auth.err.username";
            if (password.length < 5) errors.password = "auth.err.pass";

            // console.log(phone, password);

            if (Object.keys(errors).length > 0) {
                setErrors(errors);
            } else doLogin(combinePP(prefix, trimAll(phone)), trimAll(password));

        }}>
            {stage === 0 ? T("login", lang) : T("auth.mes.send_sms", lang)}
        </Button>
        <HelperError lang={lang} error={errors.login} />
        {/*<HelperText type="error" visible={errors.login}>{errors.login}</HelperText>*/}


        {stage === 0 && <TouchableOpacity
            style={styles.fingerprint}
            onPress={handleFingerprintShowed}
            disabled={!!errorMessage}
        >
            <View style={{flexDirection: 'row',}}>
                <Icon name={"fingerprint" + (!savedCred ? "-off" : "")} size={32} color={'rgb(0,172,245)'}/>
                {/*<Icon name="face" size={60} color={accent} />*/}
                {/*<Image style={{width: 60, height: 60}} source={require('../../assests/finger_print.png')} />*/}
                <Image style={{width: 32, height: 32}} source={require('../../assests/faceid.png')}/>
            </View>
        </TouchableOpacity>}

        {errorMessage && (
            <Text style={styles.errorMessage}>
                {errorMessage} {biometric}
            </Text>
        )}

        {popupShowed && (
            <FingerprintPopup
                style={styles.popup}
                handlePopupDismissed={handleFingerprintDismissed}
                onAuthenticate={() => doLogin(savedPhone, savedPassword)}
            />
        )}

        <Button color={accent} onPress={() => {
            setErrors({});
            setStage(1 - stage);
        }}>
            {stage === 0 ? T("auth.forget_password", lang) : T("Cancel", lang)}
        </Button>

        {stage === 0 && <Button color={secondary} style={{marginTop: 10}} onPress={() => dispatch(setValues({openRegister: true}))}>
            {T("register", lang)}
        </Button>}

    </View>;
};

const Stage2 = ({phone, lang, errors, loader, setLoader, setErrors, setStage}) => {
    const [verificationCode, setVerificationCode] = useState("");

    return <View style={{padding: 20}}>
        <Title>{T("auth.mes.enter_code", lang)}: {phone}</Title>

        <TextInput
            theme={{colors: {placeholder: accent, primary: accent}}}
            // autoCompleteType="username"
            selectionColor={secondary}
            // dense
            underlineColor={accent}
            error={errors.verificationCode}
            disabled={loader}
            mode="outlined"
            label={T("auth.mes.verification_code", lang)}
            value={verificationCode}
            onChangeText={text => {
                setErrors({});
                setVerificationCode(text);
            }}
        />
        {/*<HelperText type="error" visible={errors.verificationCode}>{errors.verificationCode}</HelperText>*/}
        <HelperError lang={lang} error={errors.verificationCode} />

        <Button loading={loader} mode="contained" compact style={{marginTop: 40, marginBottom: 20}} color={secondary} onPress={() => {
            checkVerificationCode(
                phone,
                verificationCode,
                setLoader,
                () => setStage(3),
                err => setErrors({verificationCode: err})
            );
        }}>
            {T("auth.mes.verify_code", lang)}
        </Button>

        <Button color={accent} onPress={() => {
            setErrors({});
            setStage(0);
        }}>
            {T("Cancel", lang)}
        </Button>


    </View>;
};

function getLangFlag(lang = "fa") {
    const opt = LangOptions.find(p => p.value === lang) || {cur: "usd"};
    return getFlagSource(opt.cur);
}

function _tranAgencies(agencies) {
    if(!agencies) return [];
    // console.log(agencies);
    return agencies.map(agency => {
        const {uid: title, logo2: url} = agency;
        return {url, agency};
    });
}

function SelectAgency({onClose}) {

    const [agencies, setAgencies] = useState(null);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState();
    const [updater, setUpdater] = useState(0);

    useEffect(() => {
        loadAgencies(setLoader, setAgencies, setError);
    }, [updater]);

    const {lang} = useSelector(({pax}) => pax);

    console.log("lang: "+lang);

    const dispatch = useDispatch();
    // console.log("Salaam2", agencies);

    return <JPage>
        <IconButton size={32} style={{alignSelf: 'flex-end'}} color={Colors.red600} icon="close" onPress={onClose}/>
        <Title style={{color: Colors.black, paddingTop: 30, textAlign: 'center'}}>{T("auth.mes.select_agency", lang)}</Title>

        <HelperError lang={lang} error={error} />

        <GridView
            renderNoContent={() => <NoData message={T("auth.err.loading_agencies", lang)} loader={loader} />}
            onPress={({agency}) => {
                // console.log(agency);
                const {defaultLang: lang} = agency;
                dispatch(setValues({agency, lang}, true));
                changeLanguage(lang);

                onClose();
                setTimeout(() => {
                    // setLoader(false);
                    RNRestart.Restart();
                }, 50);
            }}
            cols={2}
            data={_tranAgencies(agencies)} />
    </JPage>;
}

const imageStyle2 = {
    // position: 'relative',
    // top: 50,
    width: 120,
    marginTop: 30,
    marginHorizontal: 20,
    // right: 50,
    // zIndex: 1001,
    // flex: 1,
    // width: null,
    height: 120,
    // resizeMode: 'contain'
};

const Login = () => {
    const [errors, setErrors] = useState({});
    const [phone, setPhone] = useState(""); //"javad@farsan.com"); 964913383400@nnw.click
    const [loader, setLoader] = useState(false);
    const [stage, setStage] = useState(0);
    const dispatch = useDispatch();


    const {langChanged, lang, agency} = useSelector(({pax}) => pax);
    const {uid: aid} = agency || {};


    const props2 = {
        phone,
        lang,
        loader, setLoader,
        errors, setErrors,
        stage, setStage
    };

    const props01 = {
        aid,
        lang,
        errors, setErrors,
        loader, setLoader,
        stage, setStage,
    };

    //TODO: required for reset
    // useEffect(() => {
    //     if (!!uid) {
    //         // const langChanged = getItem("langChanged");
    //         // console.log("langChanged", langChanged);
    //         if(langChanged === "true") onAuth(uid);
    //     }
    // }, [uid, langChanged]);



    // console.log(useTheme().colors);

    const props3 = {
        aid,
        lang,
        phone,
        loader, setLoader,
        setStage
    };

    // console.log("props3", props3);


    return stage === 3 ? <Stage3 {...props3} /> : stage === 2 ? <Stage2 {...props2} /> :
        <Stage01 onChange={setPhone} {...props01} />;
};


const Auth = () => {

    const [ss, sss] = useState(0);
    const [openAboutUs, setOpenAboutUs] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAid, setOpenAid] = useState(false);
    const [loader, setLoader] = useState(false);
    const {lang, agency} = useSelector(({pax}) => pax);


    // console.log("agency", agency);

    useEffect(() => {
        sss(1);
        changeLanguage(lang);
    }, [lang]);

    const {logo2} = agency || {};
    // console.log("lang", lang);

    const rtl = lang === "fa" || lang === "ar";

    // if(openAboutUs) return <AboutUs navigation={{setOptions: () => {}}} />;

    return openAboutUs ? <AboutUs
            onClose={() => setOpenAboutUs(false)}
            navigation={{setOptions: () => {}}} /> :
        false && (openAid || !agency) ? <SelectAgency
        onClose={() => setOpenAid(false)}
    /> : open ? <SelectLang onClose={() => setOpen(false)}/> :
        <ImageBackground source={rtl ? require("../../assests/bg2.jpg") : require("../../assests/bg.jpg")}
                         style={{flex: 10}}>
            <View style={{flex: 2, alignItems: 'flex-end', paddingEnd: 20}}>
                <Image style={imageStyle2} source={{uri: `${baseApiUrl}/${logo2}`}}/>
                {false && <TouchableOpacity onPress={() => setOpenAid(true)}>
                    <Image style={imageStyle2} source={{uri: `${baseApiUrl}/${logo2}`}}/>
                </TouchableOpacity>}
            </View>
            <JCard style={{
                flex: 6,
                justifyContent: 'center',
                marginStart: 20,
                marginEnd: 20,
                backgroundColor: "#ffffff9f"
            }}>
                <Login/>
            </JCard>
            <View style={{flex: 2, justifyContent: 'flex-end'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30}}>
                    <Button
                        onPress={() => setOpenAboutUs(true)}
                        color={secondary}>{T("auth.contact_us", lang)}</Button>
                    <IconButton
                        onPress={() => setOpen(true)}
                        icon={props => <Avatar.Image size={48} source={getLangFlag(lang)}/>}/>
                </View>
            </View>
        </ImageBackground>;
};

export default Auth;
