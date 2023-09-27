import React, {useState, useEffect} from "react"
import {JPage} from "../../../Components";
import {Button, HelperText, Text, TextInput} from "react-native-paper";
import {accent} from "../../../jozdan-common-temp/theme";
import {getErrorMessage, validPassword} from "../../../jozdan-common-temp/utils";
import {changePassword} from "../../../utils/db_mongo";
import {P, T} from "../../../i18n";
import {useSelector} from "react-redux";

export const SetPassModel = {
    password: {
        label: ("profile.UserInfo.new_pass"),
        placeholder: ("profile.UserInfo.new_pass"),
        keyboardType: "default",
        secureTextEntry: true,
    },
    confirm: {
        label: ("profile.UserInfo.confirm_pass"),
        placeholder: ("profile.UserInfo.confirm_pass"),
        keyboardType: "default",
        secureTextEntry: true,
    },
};

const Model = {
    curPassword: {
        label: ("profile.UserInfo.current_pass"),
        placeholder: ("profile.UserInfo.current_pass"),
        keyboardType: "default",
        secureTextEntry: true,
    },
    ...SetPassModel,
};


export function FormGen({model, valuesArr, errorsArr}) {
    const [errors, setErrors] = errorsArr;
    const [values, setValues] = valuesArr;
    const {lang} = useSelector(({pax}) => pax);

    const setValue = (key, value) => {
        if(Object.keys(errors).length > 0) setErrors({});
        setValues({...values, [key]: value});
    };
    let form = [];
    for (const key in model) {
        form.push(<TextInput
            mode="outlined"
            theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
            style={{backgroundColor: '#fff'}}
            value={values[key]} key={key} {...model[key]} placeholder={T(model[key].placeholder, lang)} label={T(model[key].label, lang)}  onChangeText={value => setValue(key, value)}/>);
        form.push(<HelperText key={key + "_helper"} type="error" visible={errors[key]}>{errors[key]}</HelperText>);
    }
    return form;
}

function ChangePassword({navigation, route}) {
    const {lang} = useSelector(({pax}) => pax);
    const {setOptions, navigate} = navigation;
    useEffect(() => {
        setOptions({title: T("profile.ChangePassword", lang)});
    }, [lang]);


    const valuesArr = useState({});
    const errorsArr = useState({});
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = errorsArr;

    const validate = () => {
        const {password, curPassword, confirm} = valuesArr[0];
        let errs = {};
        if(!validPassword(curPassword)) errs.curPassword = T("profile.UserInfo.enter_valid", lang);
        if(!validPassword(password)) errs.password = T("profile.UserInfo.enter_valid", lang);
        if(password !== confirm) errs.confirm = T("profile.UserInfo.not_matched", lang);
        return errs;
    };
    const changePass = () => {
        console.log("changePass 1");
        const errs = validate();
        if(Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        console.log("changePass", errs);

        const {password, curPassword} = valuesArr[0];

        changePassword(curPassword, password, setLoader,
            err => setErrors({button: getErrorMessage(err), mesType: "error"}),
            () => {
                valuesArr[1]({password: "", curPassword: "", confirm: ""});
                setErrors({button: T("profile.UserInfo.changed", lang), mesType: "info"});
            });
    };

    const {button, mesType} = errors || {};

    return <JPage>
        <Text/>
        <FormGen model={Model} valuesArr={valuesArr} errorsArr={errorsArr}/>
        <Button loading={loader} style={{marginVertical: 20}} disabled={false} icon="lock" color={accent} mode="contained"
                onPress={changePass}>
            {T("profile.UserInfo.change", lang)}
        </Button>
        <HelperText style={mesType !== "error" ? {color: "green"} : {}}  type={mesType} visible={button}>{button}</HelperText>

    </JPage>;
}

ChangePassword.title = P("profile.ChangePassword");

export default ChangePassword;
