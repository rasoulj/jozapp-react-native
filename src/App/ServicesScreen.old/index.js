import React, {useState, useEffect} from "react"
import {Text, Button, Card, Headline, Title, Colors, IconButton, TouchableRipple} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {Image, View} from "react-native"
import Gradient from "../gradient.js"

import root from "../root"
import {GridView, JCard, JPage} from "../../Components";
import {primary} from "../../jozdan-common-temp/theme";
import SelectCurrency from "./SelectCurrency";
import Exchange from "../WalletScreen/CurrencyDetail/Exchange";
import Transfer from "../WalletScreen/CurrencyDetail/Transfer";
import Airplane from "./Airplane";
import Hotel from "./Hotel";
import {OrderTypes} from "../../jozdan-common-temp/db";
import ExchangeConfirm from "../WalletScreen/CurrencyDetail/ExchangeConfirm";
import TransferConfirm from "../WalletScreen/CurrencyDetail/TransferConfirm";
import TopupWithdraw from "../WalletScreen/CurrencyDetail/TopupWithdraw";
import TopupWithdrawConfirm from "../WalletScreen/CurrencyDetail/TopupWithdrawConfirm";
import {OrdersInfo} from "../WalletScreen/CurrencyDetail/info";
import {range} from "../../jozdan-common-temp/utils";
import {T} from "../../i18n";
import SelectAirport from "./SelectAirport";
import SelectPassenger from "./SelectPassenger";
import AirplaneTicket from "./AirplaneTicket";
import TicketView from "./TicketView";

function ServiceButton({image, title, onPress, backgroundColor = primary}) {
    return <TouchableRipple onPress={onPress}>
        <JCard style={{backgroundColor, marginEnd: 8, marginStart: 8, marginVertical: 12, height: 180}}>
            <View style={{flex: 10, flexDirection: 'row'}}>
                <View style={{flex: 9}}>
                    <Headline style={{color: '#fff', marginStart: 20, marginTop: 15}}>{title}</Headline>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={image}/>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <IconButton icon="chevron-right" color="#fff" size={40}/>
                </View>
            </View>
        </JCard>
    </TouchableRipple>
}

const SERVICES = [
    {
        type: OrderTypes.exchange,
        key: "Exchange",
        // title: "Exchange Currency",
        ...OrdersInfo[OrderTypes.exchange],
        target: "SelectCurrency",
        image: require("../../assests/srv/exchange.png")
    },
    {
        type: OrderTypes.transfer,
        key: "Transfer",
        // title: "Transfer Money",
        ...OrdersInfo[OrderTypes.transfer],
        target: "SelectCurrency",
        image: require("../../assests/srv/transfer.png")
    },
    {
        type: OrderTypes.topUp,
        key: "TopupWithdraw",
        // title: "Top-up Money",
        ...OrdersInfo[OrderTypes.topUp],
        target: "SelectCurrency",
        image: require("../../assests/srv/transfer.png")
    },
    {
        type: OrderTypes.withdraw,
        key: "TopupWithdraw",
        // title: "Withdraw Money",
        ...OrdersInfo[OrderTypes.withdraw],
        target: "SelectCurrency",
        image: require("../../assests/srv/transfer.png")
    },
    {
        type: OrderTypes.airplane,
        key: "AirplaneTicket",
        color: Colors.red600,
        title: "OrderTypes.ticket",
        icon: "airplane",
        target: "AirplaneTicket",
        image: require("../../assests/srv/transfer.png")
    },
];

function Services({navigation}) {
    const {navigate, setOptions} = navigation;
    const {lang} = useSelector(({pax}) => pax);

    useEffect(() => {
        setOptions({title: T("Services.my", lang)})
    }, [lang]);

    // const dispatch = useDispatch();

    return <JPage>
        <GridView onPress={props => navigate(props.target, {screen, ...props})} data={SERVICES} cols={2}/>
    </JPage>;

    // return <JPage>
    //     {SERVICES.map((props, key) => {
    //         const {target} = props;
    //         console.log(target);
    //         return <ServiceButton key={key} {...props}
    //                               onPress={() => navigate(target || "SelectCurrency", {screen, ...props})}
    //         />;
    //     })}
    // </JPage>;
}

Services.title = "My Services";


const pages = {
    Services,
    SelectCurrency,
    TopupWithdraw,
    TopupWithdrawConfirm,
    Exchange,
    ExchangeConfirm,
    Transfer,
    TransferConfirm,

    AirplaneTicket,
    Airplane,
    SelectAirport,
    SelectPassenger,
    TicketView,

    Hotel,
};

const Screen = () => root({pages});

Screen.title = ("Services");
Screen.icon1 = 'library';
Screen.icon2 = 'library-outline';

export default Screen;

export const screen = Object.keys({ServicesScreen: Screen})[0];



