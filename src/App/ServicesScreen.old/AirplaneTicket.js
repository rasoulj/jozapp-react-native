import React, {useEffect, useState} from "react";
import {getChevron, P, T} from "../../i18n";
import {JCard, JPage, NoData} from "../../Components";
import {Button, Caption, Card, Headline, Text, Title, List, Avatar, IconButton} from "react-native-paper";
import gStyles from "../../utils/gStyles";
import {View} from "react-native";
import {accent, secondary} from "../../jozdan-common-temp/theme";
import {useSelector} from "react-redux";
import {CardTitle} from "react-native-paper/src/components/Card/CardTitle";
import {toTwoDigit} from "../../jozdan-common-temp/utils";
import moment from "moment";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getAirlineLogoUrl} from "./Airplane";
import {getCurrencyName, getCurrencySymbol, toUpperCase} from "../../jozdan-common-temp/currency";
import {loadAtickets} from "../../utils/db_mongo";


function TicketRow({t, onPress}) {
    // console.log(t);

    const {data: ticket, usdPrice: cost} = t || {};
    const cur = "USD";
    const {itineraries, invoiceTrackingCode: code} = ticket[0] || {};


    const {departureDateTime: date, departureCityTitle: src, arrivalCityTitle: dst, segments = []} = (itineraries || [])[0] || {};// || {};

    const {airlineLogoUrl} = segments[0] || {};

    // const airlineLogoUrl = getAirlineLogoUrl(airlineCode);

    const price = <Caption style={gStyles.darkText}>{cur} {toTwoDigit(cost)} - <Text style={gStyles.secondaryText}>{code}</Text></Caption>;
    const fdate = props => <Caption {...props}  style={{...gStyles.secondaryText, fontWeight: 'bold'}}>
        {moment(date).format("ll")}
    </Caption>;

    return <List.Item
        onPress={onPress}
        left={props => <Avatar.Image {...props} style={{backgroundColor: "#fff0"}} size={60} source={{uri: airlineLogoUrl}} />}
        right={fdate}
        title={<Text style={{...gStyles.text, fontWeight: "bold"}}>{src} > {dst}</Text>}
        description={price}

    />;
    // return <JCard>
    //     <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8}}>
    //         <Text style={{...gStyles.text, textAlign: 'center'}}>{dst}</Text>
    //         <Icon />
    //     </View>
    //     <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8}}>
    //         <Caption style={gStyles.text}>${toTwoDigit(cost)}</Caption>
    //
    //     </View>
    // </JCard>
}

function AirplaneTicket({navigation, route}) {
    let page;

    const {lang} = useSelector(({pax}) => pax);
    const {setOptions, navigate} = navigation;
    useEffect(() => {
        setOptions({title: `${T("airplane.ticket", lang)}`});
    }, [lang]);


    const [tickets, setTickets] = useState([]);
    const [loader, setLoader] = useState(false);

    // useEffect(() => setTickets(TICKETS), []);

    // const setTickets = t => setTickets00(TICKETS);

    const _loadTickets = () => loadAtickets(setLoader, setTickets, page);

    useEffect(_loadTickets, []);

    // console.log(tickets);

    return <JPage
        loader={loader}
        ref={ref => page = ref}
        footerHeight={42}
        footer={<View>
            <Button
                icon="plus"
                color={accent}
                mode="contained"
                onPress={() => navigate("Airplane", {onUnmount: _loadTickets})}>{T("airplane.new_ticket", lang)}</Button>
        </View>}>

        <NoData loader={loader} visible={!tickets || tickets.length === 0} message={T("airplane.no_tickets", lang)}  />

        {tickets.map((t, key) => <TicketRow onPress={() => navigate("TicketView", {t})} t={t} key={key}/>)}
    </JPage>
}

AirplaneTicket.title = P("airplane.ticket");

export default AirplaneTicket;

