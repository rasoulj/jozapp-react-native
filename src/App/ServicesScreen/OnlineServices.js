import React, {useEffect} from "react";
import {GridView, JPage} from "../../Components";
import {T} from "../../i18n";
import {useSelector} from "react-redux";
import {OrderTypes} from "../../jozdan-common-temp/db";
import {Colors} from "react-native-paper";
import {screen} from "./index";
import {Linking} from "react-native";

const SERVICES = [
    {
        type: OrderTypes.airplane,
        key: "AirplaneTicket",
        color: Colors.red600,
        title: "OrderTypes.ticket",
        icon: "airplane",
        target: "https://www.bahbahan.com/flight",
        image: require("../../assests/srv/transfer.png")
    },
    {
        type: OrderTypes.airplane,
        key: "HotelTicket",
        color: Colors.blue600,
        title: "Hotel",
        icon: "domain-plus",
        target: "https://www.bahbahan.com/hotel",
        image: require("../../assests/srv/transfer.png")
    },
];

function OnlineServices({navigation}) {
    const {navigate, setOptions} = navigation;
    const {lang} = useSelector(({pax}) => pax);

    useEffect(() => {
        setOptions({title: T("Online Services", lang)})
    }, [lang]);

    return <JPage>
        <GridView onPress={async ({target: url}) => {
            if (await Linking.canOpenURL(url)) await Linking.openURL(url);
        }} data={SERVICES} cols={3}/>
    </JPage>
}

export default OnlineServices;
