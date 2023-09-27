import React, {useEffect} from "react"
import {JPage} from "../../Components";
import {Text, List, Avatar, IconButton} from "react-native-paper";
import {getActiveCurrencies, getFlagSource, getParams} from "../../utils";
import {useSelector} from "react-redux";
import {getCurrencyName, getCurrencySymbol, getFlagUri, toUpperCase} from "../../jozdan-common-temp/currency";

import {screen} from "./index"
import {toTwoDigit} from "../../jozdan-common-temp/utils";
import {getChevron, T} from "../../i18n";
import gStyles from "../../utils/gStyles";

function SelectCurrency({navigation, route}) {
    const {key, title: subtitle, type} = getParams(route, "key title type");
    const {setOptions, navigate} = navigation;
    const {currencies, wallet, lang} = useSelector(({pax}) => pax);

    useEffect(() => {
        setOptions({subtitle: T(subtitle, lang), title: T("services.select_currency", lang)});
    }, []);

    const curs = getActiveCurrencies(currencies);

    return <JPage>
        {curs.map(cur => <List.Item
            onPress={() => navigate(key, {screen, type, cur, back: "Services"})}
            left={props => <Avatar.Image {...props} size={48} source={getFlagSource(cur)}/>}
            right={props => <IconButton {...props} icon={getChevron()} color="#aaa" size={25} key={2} />}
            key={cur}
            title={<Text style={gStyles.text}>{getCurrencyName(cur)+" ("+toUpperCase(cur)+")"}</Text>}
            description={<Text style={gStyles.darkText}>{getCurrencySymbol(cur)+toTwoDigit(wallet[cur])}</Text>}
        />)}
    </JPage>
}

SelectCurrency.title = "Select Currency";
export default SelectCurrency;
