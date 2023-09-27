import React, {useEffect, useRef} from "react"
import {getParams} from "../../utils";
import {JCard, JPage} from "../../Components";
import {Avatar, Button, FAB, Text, Title} from "react-native-paper";
import gStyles from "../../utils/gStyles";
import {useSelector} from "react-redux";
import {T} from "../../i18n";
import {View, Image} from "react-native";
import {accent, secondary} from "../../jozdan-common-temp/theme";
import Share from "react-native-share";
import ViewShot from "react-native-view-shot";
import {TermDef} from "../TransactionsScreen/Transaction";
import moment from "moment";
import {toTwoDigit} from "../../jozdan-common-temp/utils";
import QRCode from "react-native-qrcode-svg";
import {encodeWID} from "../../jozdan-common-temp/currency";
import {getAirlineLogoUrl, sampleResult} from "./Airplane";

function formatDate(d) {
    return moment(d).format("lll");
}
//TermDef
function ViewFields({data, lang, comp, tid}) {
    const Comp = comp;
    return <JCard>
        <Title style={{...gStyles.darkText, textAlign: 'center'}}>{T(tid, lang)}</Title>
        {(data || []).map((p, key) => <Comp lang={lang} data={p} key={key} />)}
    </JCard>
}


function PropsView({data, lang}) {
    if(!data) return null;
    const keys = Object.keys(data);
    const last = keys.length - 1;
    return <JCard>
        {keys.map((key, index) => <TermDef last={index === last} key={key} tid={`airplane.ticket.${key}`} lang={lang} def={data[key]} />)}
    </JCard>;
}

function ViewPassenger({data, lang}) {
    // console.log(data);
    const {PersonName: {GivenName: englishFirstName, NamePrefix: gender, Surname: englishLastName}, NationalId: nationalCode, TicketNumber: eticketNumber = ["NA"]} = data;
    const name = [gender+".", englishFirstName, englishLastName].join(" ");
    return <JCard>
        <TermDef lang={lang} tid="airplane.ticket.name" def={name} />
        <TermDef lang={lang} tid="airplane.nationalCode" def={nationalCode} />
        <TermDef lang={lang} tid="airplane.ticket.eticketNumber" def={eticketNumber[0]} last />
    </JCard>
}

function ViewItineraries({data, lang}) {
    // console.log(data);

    const {
        FlightSegment = [{}],
        TPA_Extensions: {stop: stops},
        JourneyDurationPerMinute: elapsedTimePerMinute,
        DepartureDateTime: departureDateTime,
        ArrivalDateTime: arrivalDateTime,

        // departureAirportLocationTitle,
        // arrivalAirportLocationTitle,
        // cabinType,
        // cabinCode,
        // stops,
        // elapsedTimePerMinute,
        // arrivalDateTime,
        // departureDateTime,
    } = data || {};

    const {
        DepartureAirport: {AirportName: departureAirportLocationTitle},
        ArrivalAirport: {AirportName: arrivalAirportLocationTitle},
        CabinClassCode: cabinType,
        Equipment: {AirEquipType: cabinCode},
    } = FlightSegment[0];

    return <JCard>
        <TermDef lang={lang} tid="airplane.ticket.departureAirportLocationTitle" def={departureAirportLocationTitle} />
        <TermDef lang={lang} tid="airplane.ticket.arrivalAirportLocationTitle" def={arrivalAirportLocationTitle} />
        <TermDef lang={lang} tid="airplane.ticket.cabinType" def={cabinType} />
        <TermDef lang={lang} tid="airplane.ticket.cabinCode" def={cabinCode} />
        <TermDef lang={lang} tid="airplane.ticket.stops" def={stops} />
        <TermDef lang={lang} tid="airplane.ticket.elapsedTimePerMinute" def={elapsedTimePerMinute} />
        <TermDef lang={lang} tid="airplane.ticket.departureDateTime" def={formatDate(departureDateTime)}  />
        <TermDef lang={lang} tid="airplane.ticket.arrivalDateTime" def={formatDate(arrivalDateTime)} last />
    </JCard>
}

const logoSize = 100;


function TicketView({route}) {
    const {t} = getParams(route, "t");
    return <TicketViewPage t={t} />
}

export function TicketViewPage({t, loader = false}) {
    let page;
    const shot = useRef(null);

    const {data: ticket, usdPrice, result = sampleResult} = t || {};


    const {OriginDestinationInformation} = result || {};

    const {OriginDestinationOption} = OriginDestinationInformation || {};

    const cur = "USD";
    const {Items: outerItems} = ticket;
    const {Items} = outerItems[0] || {};

    const {
        TravelerInfo: {
            AirTraveler: passengers = [],
        },
        AirItinerary: {SessionId: code}
    } = Items || {TravelerInfo: {AirTraveler: []}};
    // console.log("Items", JSON.stringify(Items));


    const {
        FlightSegment = [{}],
        DepartureDateTime: date, TPA_Extensions: {
            Origin: src,
            Destination: dst,
        }} = (OriginDestinationOption || [])[0] || {};// || {};

    const {
        MarketingAirline: {Code}
    } = FlightSegment[0];

    // const priceInfo = {
    //     price: totalPriceCurrencyCode + " " + toTwoDigit(price),
    //     baseFare: totalPriceCurrencyCode + " " + toTwoDigit(baseFare),
    //     discount: totalPriceCurrencyCode + " " + toTwoDigit(discount),
    //     totalPrice: totalPriceCurrencyCode + " " + toTwoDigit(totalPrice),
    //     // totalPriceCurrencyCode,
    // };

    const genInfo = {
        // ticketCreateDate: formatDate(ticketCreateDate),
        // referenceCode: code,
        status: "Issued",
        // invoiceTrackingCode,
        // ticketType,
        price: `USD ${toTwoDigit(usdPrice)}`
    };


    const airlineLogoUrl = getAirlineLogoUrl(Code);


    const title = `${src} - ${dst}`;

    const {lang} = useSelector(({pax}) => pax);
    // const {setOptions, navigate} = navigation;
    // useEffect(() => {
    //     // setOptions({title});
    // }, [lang]);


    return <JPage
        loader={loader}
        ref={ref => page = ref}
        footerHeight={42}
        footer={<View>
            <Button
                icon="share-variant"
                color={secondary}
                mode="contained"
                onPress={() => {
                    shot.current.capture().then(url => {
                        let shareImageBase64 = {
                            title: T("tran.share_title", lang),
                            url,
                            subject: 'Share Link', //  for email
                            message: T("airplane.share_detail", lang, [title])
                        };
                        Share.open(shareImageBase64).catch(error => console.log(error));
                    });
                }}
            >{T("airplane.share_ticket", lang)}</Button>
        </View>}>
        <ViewShot ref={shot} options={{format: "jpg", quality: 0.9}}>
            <View style={{backgroundColor: '#fff', margin: 20, marginEnd: 20, paddingBottom: 30}}>
                <Title style={{...gStyles.text, textAlign: 'center'}}>{title}</Title>
                <JCard style={{flex: 2, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10}}>
                    <Image style={{backgroundColor: "#fff0", height: logoSize, width: logoSize}} size={logoSize} source={{uri: airlineLogoUrl}} />
                    <QRCode value={code} backgroundColor="#fff" color={'#000'} size={logoSize} />
                </JCard>
                <ViewFields data={[genInfo]} comp={PropsView} tid={"airplane.ticket.genInfo"} lang={lang} />
                <ViewFields data={passengers} comp={ViewPassenger} tid={"airplane.ticket.passengers_info"} lang={lang} />
                <ViewFields data={(OriginDestinationOption || [{}])} comp={ViewItineraries} tid={"airplane.ticket.itineraries_info"} lang={lang} />
                {/*<ViewFields data={[priceInfo]} comp={PropsView} tid={"airplane.ticket.priceInfo"} lang={lang} />*/}
            </View>
        </ViewShot>
    </JPage>
}

export default TicketView;
