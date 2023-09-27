import React, {useEffect, useState} from "react"
import {JCard, JPage, NoData} from "../../Components";
import {Searchbar, Text, List, Caption, Title, useTheme} from "react-native-paper";
import {getParams} from "../../utils";
import {getAirports} from "../../utils/ticket_utils";
import {useDispatch, useSelector} from "react-redux";
import {View} from "react-native"
import gStyles from "../../utils/gStyles";
import {secondary} from "../../jozdan-common-temp/theme";
import { Appearance } from 'react-native'
import {P, T} from "../../i18n";
import {setValues} from "../../redux/actions";

const FAV_CITIES = [
    {cityNameEn: "Tehran", airportCode: "THR", MultiAirportCityInd: true},
    {cityNameEn: "Mashhad", airportCode: "MHD", MultiAirportCityInd: false},
    {cityNameEn: "Tabriz", airportCode: "TBZ", MultiAirportCityInd: false},
    {cityNameEn: "Bandar Abbas", airportCode: "BND", MultiAirportCityInd: false},
    {cityNameEn: "Rasht", airportCode: "RAS", MultiAirportCityInd: false},
    {cityNameEn: "Kish Island", airportCode: "KIH", MultiAirportCityInd: false},
    {cityNameEn: "Ahwaz", airportCode: "AWZ", MultiAirportCityInd: false},
    {cityNameEn: "Gheshm Island", airportCode: "GSM", MultiAirportCityInd: false},
    {cityNameEn: "Shiraz", airportCode: "SYZ", MultiAirportCityInd: false},
    {cityNameEn: "Isfahan", airportCode: "IFN", MultiAirportCityInd: false},
    {cityNameEn: "Istanbul", airportCode: "IST", MultiAirportCityInd: true},
    {cityNameEn: "Ankara", airportCode: "ESB", MultiAirportCityInd: true},
    {cityNameEn: "YYZ", airportCode: "Toronto", MultiAirportCityInd: true},
    {cityNameEn: "Muscat", airportCode: "MCT", MultiAirportCityInd: true},
    {cityNameEn: "Al Najaf", airportCode: "NJF", MultiAirportCityInd: false},
    {cityNameEn: "Dubai", airportCode: "DXB", MultiAirportCityInd: true},
    {cityNameEn: "London", airportCode: "LHR", MultiAirportCityInd: true},
    {cityNameEn: "Yerevan", airportCode: "EVN", MultiAirportCityInd: true},
    {cityNameEn: "Beijing", airportCode: "PEK", MultiAirportCityInd: true},
    {cityNameEn: "Baku", airportCode: "GYD", MultiAirportCityInd: true},
];

function AirportItem({airport, selected, onPress}) {
    // console.log(selected, airport);
    const {cityNameEn: label, airportCode: code, airportNameEn} = airport || {};
    const sel = code === selected;
    const desc = !airportNameEn ? code : `${airportNameEn} (${code})`;
    // console.log(Object.keys(airport));
    return <List.Item
        style={{backgroundColor: '#eee'}}
        onPress={onPress}
        title={<Text style={gStyles.text}>{label}</Text>}
        description={<Caption style={gStyles.text}>{desc}</Caption>}
        right={props => <List.Icon {...props} color={sel ? secondary : "grey"}  icon={sel ? "checkbox-marked-circle" : "chevron-right"} />}
        left={props => <List.Icon {...props} color={"#bbb"}  icon="airport" />}
    />;
}

function AirportTitle({title, show, setShow}) {
    return <List.Item
        onPress={() => setShow(!show)}
        title={<Title style={gStyles.text}>{title}</Title>}
        style={{color: "#000"}}>{title}</List.Item>
}
//
// function AirportCard({item, onSelect, selected}) {
//     const {airportNameEn: cityTitle, airports} = item || {};
//
//     return <List.Accordion
//         title={cityTitle}
//         left={props => <List.Icon {...props} icon="folder"/>}>
//             {(airports || [item]).map((airport, index) => <AirportItem
//                 selected={selected}
//                 onPress={() => onSelect(airport)}
//                 airport={airport}
//                 key={index}
//             />)}
//     </List.Accordion>
// }

function SelectAirport({navigation, route}) {

    const {goBack, setOptions} = navigation;
    const dispatch = useDispatch();


    const {searchType, onSelect, selected: selectedAirport} = getParams(route, "searchType onSelect selected");
    // console.log(Object.keys(navigation));

    const [show, setShow] = useState(true);
    const {lang} = useSelector(({pax}) => pax);

    const {airportCode: selected} = selectedAirport || {};

    // console.log(selectedAirport);


    const [loader, setLoader] = useState(false);
    const [key, setKey] = useState("");
    const [airports, setAirports] = useState(FAV_CITIES);

    useEffect(() => {
        setOptions({title: T("airplane.select_airport", lang)})
    }, [lang]);



    let page;


    const search = () => getAirports({q: key === "" ? "teh" : key}, setLoader, setAirports, page);

    // useEffect(search, [searchType]);

    // const theme = useTheme();

    const dark = Appearance.getColorScheme() === "dark";

    // console.log(Appearance.getColorScheme());

    return <JPage
        ref={ref => page = ref}
        loader={loader} pin2={<Searchbar
        // style={{backgroundColor: "#fff", color: "#000"}}
        placeholder={T("search", lang)}
        onChangeText={setKey}
        value={key}
        onIconPress={search}
        // onMagicTap={search}
        onSubmitEditing={search}
    />}>

        <NoData loader={loader} visible={!airports || airports.length === 0} message={T("airplane.no_airport", lang)}  />

        <List.Section style={{flex: 1, backgroundColor: dark ? '#000' : "#fff"}}>
            {(airports || []).map((item, key) => <AirportItem selected={selected} onPress={() => {
                // console.log()
                if(!!onSelect) onSelect(item);
                goBack();
            }} airport={item} key={key} />)}
        </List.Section>

    </JPage>
}

SelectAirport.title = P("airplane.select_airport");

export default SelectAirport;
