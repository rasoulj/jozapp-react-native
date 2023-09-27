import React, {useState, useEffect} from "react"
import {JPage} from "../../../Components";
import {Avatar, Colors, IconButton, List, Text, Title} from "react-native-paper";
import {accent} from "../../../jozdan-common-temp/theme";
import {CurrencyDef, getCurrencyName, toUpperCase} from "../../../jozdan-common-temp/currency";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../redux/actions";
import {getFlagSource} from "../../../utils";
import {getItem} from "../../../utils/local_db";
import {changeLanguage, T} from "../../../i18n";
import RNRestart from 'react-native-restart';
import gStyles from "../../../utils/gStyles";

const getGenConfig = (lang) => {
    return {
        // header: T("settings.gen", lang),
        header: T("General", lang),
        options: [
            // {label: T("settings.gen.charts"), icon: "chart-areaspline-variant", value: "showCharts"}
            {label: T("Charts"), icon: "chart-areaspline-variant", value: "showCharts"}
        ],
        getIcon: opt => <List.Icon color="#000" icon={opt.icon}/>,
    }
};

// const {hideSelectCurrencies} = WhiteCopyConfig[ActiveWhiteCopy];

export const LangOptions = [
    {label: "English", icon: "translate", value: "en", cur: "usd"},
    {label: "عربى", icon: "translate", value: "ar", cur: "iqd"},
    {label: "فارسی", icon: "translate", value: "fa", cur: "irr"},
    {label: "中文", icon: "translate", value: "zh", cur: "cny"},
    {label: "Türk", icon: "translate", value: "tr", cur: "try"},
    {label: "Kurdî", icon: "translate", value: "ckb", cur: "ckb"},
];

const getLangConfig = (lang) => {
    return {
        header: T( !lang ? "" : "settings.lang", lang),
        options: LangOptions,
        getIcon: opt => <Avatar.Image style={{alignSelf: 'center'}} size={48} source={getFlagSource(opt.cur)}/>,
    }
};

const getChartsConfig = (lang) => {
    return {
        header: T("settings.charts", lang),
        options: [
            {label: T("settings.charts.D", lang), icon: "chart-line-variant", value: 1},
            {label: T("settings.charts.W", lang), icon: "finance", value: 7},
            {label: T("settings.charts.2W", lang), icon: "chart-line", value: 14},
            {label: T("settings.charts.M", lang), icon: "chart-line-stacked", value: 30},
            {label: T("settings.charts.Q", lang), icon: "chart-areaspline-variant", value: 90},
        ],
        getIcon: opt => <List.Icon color="#000" icon={opt.icon}/>,
    }
};

function getOption(cur, defCurrency) {
    return {
        label: `${toUpperCase(cur)} (${getCurrencyName(cur)})`,
        cur,
        disabled: cur === defCurrency,
        value: cur
    };
}

function getCurrencyConfig(defCurrency, lang) {
    let options = Object.keys(CurrencyDef).filter(cur => cur !== defCurrency).map(cur => getOption(cur, defCurrency));
    options = [getOption(defCurrency, defCurrency), ...options];

    console.log("options", options);

    return {
        header: T("settings.cur", lang),
        options,
        getIcon: opt => <Avatar.Image style={{alignSelf: 'center'}} size={48} source={getFlagSource(opt.cur)}/>,
    }
}

// const CurrencyConfig = getCurrencyConfig("eur");


function SectionView({value, config, onChange}) {
    const {header, options, getIcon} = config;
    return <List.Section>
        <List.Subheader style={gStyles.text}>{header}</List.Subheader>
        {options.map((p, key) => {
            const {label, value: val} = p;
            return <List.Item
                onPress={() => onChange(val)}
                key={key}
                title={<Text style={gStyles.text}>{label}</Text>}
                right={() => <List.Icon color={accent}
                                        icon={value === val ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}/>}
                left={() => getIcon(p)}
            />
        })}
    </List.Section>
}

function SectionViewMultiSelect({value, config, onToggle, visible = true}) {
    if(!visible) return null;
    const {header, options, getIcon} = config;
    return <List.Section>
        <List.Subheader style={gStyles.text}>{header}</List.Subheader>
        {options.map((p, key) => {
            const {label, value: val, disabled} = p;
            return <List.Item
                onPress={!disabled && (() => onToggle(val, !value[val]))}
                key={key}
                title={<Text style={gStyles.text}>{label}</Text>}
                right={() => <List.Icon color={disabled ? "gray" : accent}
                                        icon={!!value[val] ? "checkbox-blank-outline" : "checkbox-marked-outline"}/>}
                left={() => getIcon(p)}
            />
        })}
    </List.Section>
}


function UserSettings({navigation}) {
    const {setOptions} = navigation;

    const {branch: {defCurrency}, agency} = useSelector(({pax}) => pax);

    const {hideSelectCurrencies} = agency || {};
    // console.log("defCurrency", defCurrency);
    // const {navigate} = navigation;
    const [CurrencyConfig, setCurrencyConfig] = useState(getCurrencyConfig(defCurrency || "iqd"));
    const [GenConfig, setGenConfig] = useState(getGenConfig());
    const [LangConfig, setLangConfig] = useState(getLangConfig());
    const [ChartsConfig, setChartsConfig] = useState(getChartsConfig());
    const {currencies, chart, genConfig} = useSelector(({pax}) => pax);

    const [lang, _setLang] = useState(getItem("lang", "fa"));

    useEffect(() => {
        // setCurrencyConfig(getCurrencyConfig("eur"));
        setOptions({title: T("profile.UserSettings", lang)});
        setCurrencyConfig(getCurrencyConfig(defCurrency, lang));
        setChartsConfig(getChartsConfig(lang));
        setGenConfig(getGenConfig(lang));
        setLangConfig(getLangConfig(lang));
    }, [lang, defCurrency]);

    const dispatch = useDispatch();

    // const [chart, _setChart] = useState(getItem("chart", 1));
    // const [currencies, _setCurrencies] = useState(getItem("currencies", {}));
    //
    // const setCurrencies = currencies => {
    //     saveItem("currencies", currencies);
    //     _setCurrencies(currencies);
    // };
    //
    //
    // const setLang = lang => {
    //     saveItem("lang", lang);
    //     _setLang(lang);
    // };
    //
    // const setChart = chart => {
    //     saveItem("chart", chart);
    //     _setChart(chart);
    // };


    const setLang = lang => dispatch(setValues({lang, langChanged: "true"}, true));
    const setChart = chart => dispatch(setValues({chart}, true));
    const setCurrencies = currencies => dispatch(setValues({currencies}, true));
    const setConfig = genConfig => dispatch(setValues({genConfig}, true));


    // console.log("lang, chart, currencies", lang, chart, currencies);

    const [loader, setLoader] = useState(false);

    // console.log("GenConfig", GenConfig);
    // console.log("genConfig", genConfig);

    return <JPage loader={loader}>
        <SectionViewMultiSelect config={GenConfig} value={genConfig || {}} onToggle={(key, value) => {
            setConfig({...genConfig, [key]: value}, true);
        }}/>
        <SectionView config={LangConfig} value={lang} onChange={lang => {
            // console.log("setLang", lang);
            changeLanguage(lang);
            // I18nManager.forceRTL(lang === "fa");
            setLang(lang);
            _setLang(lang);
            setLoader(true);
            setTimeout(() => {
                setLoader(false);
                RNRestart.Restart();
            }, 1500);

        }}/>
        <SectionView config={ChartsConfig} value={chart} onChange={setChart}/>
        <SectionViewMultiSelect visible={!hideSelectCurrencies} config={CurrencyConfig} value={currencies} onToggle={(key, value) => {
            setCurrencies({...currencies, [key]: value})
        }}/>
    </JPage>;
}

UserSettings.title = "Settings";

export default UserSettings;


export const SelectLang = ({onClose}) => {
    const LangConfig = getLangConfig();
    // const [LangConfig, setLangConfig] = useState(getLangConfig());
    // const [lang, _setLang] = useState(getItem("lang", "en"));

    const dispatch = useDispatch();

    const setLang = lang => dispatch(setValues({lang, langChanged: "false"}, true));
    const [loader, setLoader] = useState(false);

    const {lang} = useSelector(({pax}) => pax);

    return <JPage loader={loader}>
        <IconButton size={32} style={{alignSelf: 'flex-end'}} color={Colors.red600} icon="close" onPress={onClose}/>
        <Title style={{color: Colors.black, paddingTop: 30, textAlign: 'center'}}>Select your language</Title>
        <SectionView config={LangConfig} value={lang} onChange={lang => {
            changeLanguage(lang);
            setLang(lang);
            setLoader(true);
            setTimeout(() => {
                setLoader(false);
                RNRestart.Restart();
            }, 50);
            onClose();

        }}/>
    </JPage>
};
