import React, {useEffect, useState} from "react"
import {JCard, JDatePicker, JPage, JPicker, JRadioButton, JRadioSelect, NoData} from "../../Components";
import {useDispatch, useSelector} from "react-redux";
import {getChevron, isRTL, P, T} from "../../i18n";
import {JTabBar} from "../../Components/JTabBar";
import {Platform, View} from "react-native";
import {
    Button,
    Caption,
    HelperText,
    List,
    RadioButton,
    Text,
    TextInput,
    Title,
    Avatar,
    Paragraph, Colors
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {accent, primary, secondary} from "../../jozdan-common-temp/theme";
import {range, toTwoDigit} from "../../jozdan-common-temp/utils";
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/TouchableRipple.native";
import {getParams, trimAll} from "../../utils";
import {doFlightBook, doFlightIssue, getSeaerch} from "../../utils/ticket_utils";
import gStyles from "../../utils/gStyles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import HelperError from "../../Components/HelperError";
import {baseApiUrl, doWallets, loadFees, saveATicket} from "../../utils/db_mongo";
import {TicketViewPage} from "./TicketView";
import {WalletTypes} from "../../jozdan-common-temp/currency";
import {formalCustomerNumber, stdCustomerNumber} from "../../jozdan-common-temp/account";
import {OrderTypes} from "../../jozdan-common-temp/db";

Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const nop = () => true;

const buyer = {
    "firstName": "محمد",
    "lastName": "داعی نژاد",
    "mobile": "09106020624",
    "email": "mohammadhack3@gmail.com",
    "nationalCode": "2003290125"
};

export const formatDate = d => moment(d).format("YYYY-MM-DD");
export const formatDate2 = d => moment(d).format("MMM DD, YYYY");

function Hr({visible = true, color = "#ccc"}) {
    if(!visible) return null;
    return <View style={{borderColor: color, borderBottomWidth: 1, marginVertical: 10, marginHorizontal: 15}}>
        {/*<Text>SS</Text>*/}
    </View>
}

export const styles = {
    black: {color: "black"},
    green: {color: "green"},
    passenger: {
      title: {color: 'green', textAlign: 'center', fontWeight: 'bold', borderBottomWidth: 0.5, borderColor: "green", paddingBottom: 8},
    },
    blue: {color: "blue"},
    radio: {flex: 1, flexDirection: 'row', verticalAlign: 'center'},
    pickerCaption: {color: "blue", marginTop: 10, marginLeft: 10},
    box: {
        flex: 1,
        // borderColor: accent,
        // borderWidth: 1,
        // borderRadius: 3,
        marginVertical: 6,
        // padding: 0,
        margin: 0,
        marginEnd: 0
    },
    blueBox: {
        flex: 1,
        borderColor: accent,
        borderWidth: 1,
        borderRadius: 3,
        marginVertical: 3,
        // padding: 0,
        margin: 0,
        marginEnd: 0
    },
    redBox: {
        flex: 1,
        borderColor: "rgb(199,106,124)",
        borderWidth: 2,
        borderRadius: 3,
        marginVertical: 3,
        // padding: 0,
        margin: 0,
        marginEnd: 0
    },
    withMargin: {margin: 10}

};

export function normalDateFrom(d) {
    if (!d) return d;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function normalDateTo(d) {
    if (!d) return d;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}


const TABS = [
    {title: "airplane.search_flight", button1: "search"},
    {title: "airplane.search_result"},
    {title: "airplane.passengers"},
    {title: "airplane.issue_ticket", button1: "airplane.issue_ticket"},
];

function flightTitle(index, lang) {
    if (index === 0) {
        return T("airplane.raft", lang);
    } else {
        return T("airplane.bargasht", lang);
    }
}




function TText({children}) {
    return <Text style={styles.black}>{children}</Text>;
}


function getPassengers(from = 0, len = 6) {
    let ret = [];
    for(let v=from; v<len; v++) {
        ret.push({v, l: v+" "});
    }
    return ret;
}

const ADULTS = getPassengers(1, 6);
const CHILDS = getPassengers(0, 6);

function Tab0({
                  navigate, loading,
                  setLoading, lang,
                  adultCount, setAdultCount,
                  childCount, setChildCount,
                  infantCount, setInfantCount,
                  dep, setDep,
                  arrival, setArrival,
                  flightType, setFlightType,
                  dirType, setDirType,
                  dateFrom, setDateFrom,
                  dateTo, setDateTo
              }) {

    const [show, setShow] = useState(0);
    const onChangeDate = (event, selectedDate) => {
        const ss = show;
        // console.log("sel", selectedDate, typeof selectedDate);
        const currentDate = selectedDate;
        setShow(Platform.OS === 'ios' ? show : 0);

        if(!selectedDate) return;
        if (ss === 1) setDateFrom(normalDateFrom(currentDate));
        else setDateTo(normalDateTo(currentDate));
    };




    return <View>
        <JCard>
            <JRadioButton style={styles.withMargin} icon="check-bold" lang={lang} color={accent} value={flightType} setValue={setFlightType} options={[
                {v: 2, l: "airplane.domestic"},
                {v: 1, l: "airplane.international"},
            ]} />

            <JRadioButton style={styles.withMargin} icon="check-bold" lang={lang} value={dirType} setValue={setDirType} options={[
                {v: 0, l: "airplane.one_way_flight"},
                {v: 1, l: "airplane.two_way_flight"},

            ]} />
        </JCard>



        <JCard>
            {/*<Caption style={styles.pickerCaption}>{T("airplane.adult_count", lang)}</Caption>*/}
            <JRadioButton value={adultCount} setValue={setAdultCount} options={ADULTS} color={accent} title={T("airplane.adult_count", lang)} />
            {/*<Caption style={styles.pickerCaption}>{T("airplane.child_count", lang)}</Caption>*/}
            <JRadioButton value={childCount} setValue={setChildCount} options={CHILDS} title={T("airplane.child_count", lang)} />
            {/*<Caption style={styles.pickerCaption}>{T("airplane.infant_count", lang)}</Caption>*/}
            <JRadioButton value={infantCount} setValue={setInfantCount} options={CHILDS} title={T("airplane.infant_count", lang)} />
        </JCard>


        <JCard>
            {show !== 0 && (
                <DateTimePicker
                    value={(show === 1 ? dateFrom : dateTo) || new Date()}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <Caption style={styles.pickerCaption}>{T("airplane.dep_date_1", lang)}</Caption>
            <Button color={secondary} mode="outlined" icon="clock-time-four" compact uppercase={false}
                    onPress={() => setShow(1)}>
                {!dateFrom ? T("airplane.date_1", lang)+"..." : formatDate2(dateFrom)}
            </Button>

            {dirType === 1 && <Caption style={styles.pickerCaption}>{T("airplane.dep_date_2", lang)}</Caption>}
            {dirType === 1 && <Button color={secondary} mode="outlined" icon="clock-time-seven" compact uppercase={false}
                    onPress={() => setShow(2)}>
                {!dateTo ? T("airplane.date_2", lang)+"..." : formatDate2(dateTo)}
            </Button>}
        </JCard>

        <JCard>
            <Caption style={styles.pickerCaption}>{T("airplane.from_airport", lang)}</Caption>
            <Button uppercase={false} onPress={() => navigate("SelectAirport", {searchType: flightType, selected: dep, onSelect: airport => {
                setDep(airport);
            }})}>{!dep ? T("airplane.select_parenthesis", lang) : dep.label}</Button>

            {/*<JPicker value={dep} onChange={setDep} options={airports} />*/}
            <Caption style={styles.pickerCaption}>{T("airplane.to_airport", lang)}</Caption>
            <Button uppercase={false} onPress={() => navigate("SelectAirport", {searchType: flightType, selected: arrival, onSelect: airport => {
                    setArrival(airport);
                }})}>{!arrival ? T("airplane.select_parenthesis", lang) : arrival.label}</Button>
        </JCard>
    </View>
}


function rand(from = 1, to = 10) {
    return from+Math.floor(Math.random()*(to-from));
}

function formatDateTime(dt) {
    const m = moment(dt);
    return m.format("lll");
}


export function getAirlineLogoUrl(airlineCode) {
    return `${baseApiUrl}/static/AirlineLogo/${airlineCode}.png`;
}

function FlightSegment({segment, index, length}) {
    const {
        airlineCode,
        departureAirportLocationTitle,
        departureDateTime,
        cabinType,
        arrivalAirportLocationTitle,
        arrivalDateTime,
        flightNumber,
        airlineTitle,
        airplaneTitle,
    } = segment;

    const airlineLogoUrl = getAirlineLogoUrl(airlineCode);
    // console.log("segment", segment);
    // console.log(flightsSegments);

    const caption = [
        length > 1 ? `#${index+1}` : null,
        airlineTitle, airplaneTitle, flightNumber, cabinType
    ].filter(p => !!p).join(" | ");
    // if(length > 1) caption = `#${index+1} | ` + caption;

    return <View style={{flex: 1, flexDirection: "column"}}>
        {/*<Caption style={{color: secondary}}>Flight #{index+1}: {cabinType} {flightsSegments.length}</Caption>*/}
        <View style={{flex: 1, flexDirection: "row", alignItems: 'center'}}>
            <Avatar.Image style={{backgroundColor: "#fff0"}} size={30} source={{uri: airlineLogoUrl}} />
            <Caption style={{color: secondary, paddingStart: 10}}>{caption}</Caption>
        </View>
        <View style={{flex: 11, flexDirection: "row"}}>

            <View style={{flex: 5}}>
                <Text style={gStyles.text}>{departureAirportLocationTitle}</Text>
                <Caption style={gStyles.darkText}>{formatDateTime(departureDateTime)}</Caption>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="arrow-right-bold-circle-outline" color={secondary} size={20} />
            </View>
            <View style={{flex: 5, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{color: '#000', textAlign: "right"}}>{arrivalAirportLocationTitle}</Text>
                <Caption style={gStyles.darkText}>{formatDateTime(arrivalDateTime)}</Caption>
            </View>
        </View>
    </View>;
}
/**
 * @return {boolean}
 */
function FlightRow({flight, index, length}) {
    const {
        flightsSegments,
        remain,
        stops,

    } = flight || {};

    const last = index === length-1;
    // console.log(flight);

    const segLength = (flightsSegments || []).length;

    return !flightsSegments ?
        <FlightSegment length={1} segment={flight} /> : <View>
            {length > 1 && <View style={{alignItems: 'center'}}>
                <Caption style={{color: 'green'}}>{flightTitle(index)}</Caption>
            </View>}
            {flightsSegments.map((segment, key) => <FlightSegment length={segLength} index={key} segment={segment} key={key} />)}
            <Hr visible={!last} />
        </View>

}

function Result({value, selected, index, onPress, airplaneTicketRate}) {
    // console.log(Object.keys(value));
    // console.log(value);
    // const {source, date, price} = value || {};
    const {flights = [], totalPrice, currency} = value || {};
    const flightLen = flights.length;
    return <JCard style={{backgroundColor: selected === index ? 'yellow' : 'white'}}>
        <TouchableRipple onPress={onPress}>
            <View style={{flex: 1, marginHorizontal: 4}}>
                <Text style={{color: "black", fontWeight: 'bold', textAlign: "center"}}>USD {toTwoDigit(calcPriceInUSD(totalPrice, airplaneTicketRate))}</Text>
                <Hr />
                {flights.map((f, i) => <FlightRow flight={f} index={i} length={flightLen} key={i} />)}
            </View>
        </TouchableRipple>
    </JCard>;
}

function Tab1({lang, results, selected, setSelected, airplaneTicketRate}) {

    const {itineraries = []} = results || {};
    // console.log("results", results);

    return <View>
        <NoData visible={!itineraries || itineraries.length === 0} message={T("airplane.no_flight_found", lang)} />
        {(itineraries || []).map((p, key) => <Result
            airplaneTicketRate={airplaneTicketRate}
            onPress={() => setSelected(key)} value={p} key={key} index={key} selected={selected} />)}
    </View>
}

function normalizeDate(d) {
    if(!d) return "";
    const dd = moment(d).toISOString().split(".");
    // console.log(dd.split(".")[0]);
    return dd[0];
}

function normalizePassenger(pass) {
    const {birthDay: b, passportExpireDate: p} = pass;
    return {...pass, birthDay: normalizeDate(b), passportExpireDate: normalizeDate(p) }
}

function normalizePassengers(passengers) {
    return passengers.map(normalizePassenger);
}

const EMPTY_Passenger = {
    type: 0, //0 for Adult, 1 for child, 2 for infant
    nationality: "IR,IRN", ///xxx
    latinFirstName: "",
    latinLastName: "",
    birthDay: "",
    gender: "1", //0 for female, 1 for male
    nationalCode: "",
    firstName: "",
    lastName: "",
    isForeigners: false,
    passengerValidationType: 2, //1 International, 2 for Domestic

    passportIssueCountry: "IR,IRN",
    passportExpireDate: "",

    passportNumber: "",
    parent: null,

};

function getEmptyPassenger(type, passengerValidationType) {
    return {...EMPTY_Passenger, type, passengerValidationType};
}

/*
{
            "type": 0,
            "nationality": 0,
            "latinFirstName": "karim",
            "latinLastName": "daei",
            "birthDay": "1998-02-17T00:00:00",
            "gender": "1",
            "nationalCode": "2002394156",
            "firstName": "محمد",
            "lastName": "داعی",
            "isForeigners": false,
            "passengerValidationType": 2
        }
 */



function PassengersGroup({lang, info, setInfo, navigate, hasAdult = true, showError = console.log, adults = [], flightDate}) {
    if(!info || info.length === 0) return null;
    const {type} = info[0];
    const {color, icon, title} = PassengerType[type] || {title: type};
    const style = {...styles.passenger.title, color, borderColor: color};

    const setInfoX = (index, x) => {
        const ai = [...info];
        ai[index] = x;
        setInfo(ai);
    };


    const _getTitle = p => {
        const {latinFirstName, latinLastName} = p || {};
        return trimAll(latinFirstName + latinLastName).length > 0 ? `${latinFirstName} ${latinLastName}` : T("airplane.select_passenger_parenthesis", lang);
    };

    return <List.Section>
        <List.Subheader  style={style}>{T(title, lang)}</List.Subheader>
        {info.map((p, i) => <List.Item key={i}
            onPress={() => {
                if(!hasAdult) {
                    showError("airplane.err.select_adult_passenger");
                    return;
                }
                navigate("SelectPassenger", {index: i, info, onSelect: x => setInfoX(i, x), adults, flightDate});
            }}
            right={props => <List.Icon {...props} color={"grey"}  icon={getChevron()} />}
            left={props => <List.Icon {...props} color={color}  icon={icon} />}
            title={<Paragraph style={gStyles.text} >{_getTitle(p)}</Paragraph>}

        />)}

    </List.Section>
}

function Tab2({
                  dateFrom,
                  lang, navigate, showError,
                  adultsInfo, setAdultsInfo,
                  childsInfo, setChildsInfo,
                  infantsInfo, setInfantsInfo,}) {

    const hasAdult = adultsInfo.some(p => p.latinFirstName);

    const flightDate = normalizeDate(dateFrom);

    return <View style={{flex: 1}}>
        <PassengersGroup lang={lang} flightDate={flightDate} info={adultsInfo} navigate={navigate} setInfo={setAdultsInfo} />
        <PassengersGroup lang={lang} flightDate={flightDate} info={childsInfo} navigate={navigate} setInfo={setChildsInfo} />
        <PassengersGroup lang={lang} flightDate={flightDate} adults={adultsInfo} showError={showError} hasAdult={hasAdult} info={infantsInfo} navigate={navigate} setInfo={setInfantsInfo} />
    </View>
}

function calcPriceInUSD(totalPrice, airplaneTicketRate) {
    return !airplaneTicketRate ? totalPrice : totalPrice / airplaneTicketRate;
}

function Tab3({message, bookingInfo, lang, airplaneTicketRate}) {
    //{"id": 51376, "invoiceId": 48228, "isChangePrice": false, "refrenceCode": "-1", "totalPrice": 5485000}

    const {invoiceId, totalPrice} = bookingInfo;

    return <View>
        <JCard>
            <Title style={styles.black}>invoiceId: {invoiceId}</Title>
            <Title style={styles.black}>totalPrice: USD {toTwoDigit(calcPriceInUSD(totalPrice, airplaneTicketRate))}</Title>
            {!!message && <Text style={styles.green}>{T(message, lang)}</Text>}
        </JCard>
        {/*<Button*/}
        {/*    style={{marginVertical: 10}}*/}
        {/*    color={"green"}*/}
        {/*    mode="contained">Submit</Button>*/}
    </View>
}

const TabsComp = [Tab0, Tab1, Tab2, Tab3];

/*
"buyer": {
        "firstName": "محمد",
        "lastName": "داعی نژاد",
        "mobile": "09106020624",
        "email": "mohammadhack3@gmail.com",
        "nationalCode": "2003290125"
    },
"passengers": [{
            "type": 0,
            "passportIssueCountry": "IR,IRN",
            "nationality": 0,
            "latinFirstName": "karim",
            "latinLastName": "daei",
            "birthDay": "1998-02-17",
            "gender": "1",
            "nationalCode": "2002394156",
            "passportNumber": "3252345",
            "passportExpireDate": "2024-08-15",
            "isForeigners": false,
            "passengerValidationType": 1
        },],

 */

//    const title = type === 0 ? "Adults" : type === 1 ? "Children" : "Infants";
const PassengerType = [
    {color: "green", icon: "human-male", title: "airplane.adult_passenger"},
    {color: "red", icon: "human-child", title: "airplane.child_passenger"},
    {color: "pink", icon: "account-child", title: "airplane.infant_passenger"},
];
function NavBar({index, setIndex, length = 1, enabled = true, onDone, loading = false, error, lang}) {
    const {button1 = "next", button2 = "back"} = TABS[index];
    const isLast = index+1 === length;

    const onPressNext = () => {
        if(onDone(index)) setIndex(index+1);
        // if(isLast) {
        //     if(!!onDone) onDone();
        // } else setIndex(index+1);
        //
    };

    return <View style={{flex: 1}}>
        {!!error && <HelperError lang={lang} error={error} />}
        <View style={{flexDirection: "row", flex: 2}}>
        {index > 0 && <View style={{flex: 1}} >
            <Button
                color={"#ccc"}
                mode="contained"
                onPress={() => setIndex(index-1)}
                disabled={index <= 0}>{T(button2, lang)}</Button>
        </View>}
        {index < length && <View style={{flex: 1}}>
            <Button
                loading={loading}
                color={enabled ? (isLast ? "green" : secondary) : "#bbb"}
                mode="contained"
                onPress={enabled ? onPressNext : null}
                 >{T(button1, lang)}</Button>
        </View>}
    </View>
    </View>
}

function Airplane({navigation, route}) {
    let page;

    const {setOptions, navigate} = navigation;

    const [index, _setIndex] = useState(0);
    const [selected, _setSelected] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const [ticket, setTicket] = useState();
    const [error, setError] = useState();

    const [adultCount, _setAdultCount] = useState(1);
    const [childCount, _setChildCount] = useState(0);
    const [infantCount, _setInfantCount] = useState(0);
    const [flightType, _setFlightType] = useState(2);

    const [dirType, _setDirType] = useState(0);
    const [dateFrom, _setDateFrom] = useState(new Date());
    const [dateTo, _setDateTo] = useState(new Date());

    const [dep, _setDep] = useState(0);
    const [arrival, _setArrival] = useState(0);

    const [adultsInfo, setAdultsInfo] = useState([]);
    const [childsInfo, setChildsInfo] = useState([]);
    const [infantsInfo, setInfantsInfo] = useState([]);
    const [bookingInfo, setBookingInfo] = useState({});

    const [fees, setFees] = useState({});

    const {user: {aid, wid, bid}, wallet: {usd}, branch: {wid: bwid}} = useSelector(({pax}) => pax);

    console.log("wid", wid, bid);

    // const {wallet, rates, user: {walletType = WalletTypes.bronze, aid}, branch: {defCurrency}} = useSelector(({pax}) => pax);
    useEffect(() => {
        loadFees(aid, setLoading, setFees, console.log, 1);
    }, [aid]);


    const {airplaneTicket: airplaneTicketRate} = fees;

    console.log("airplaneTicketRate", airplaneTicketRate);



    useEffect(() => {
        setAdultsInfo(range(0, adultCount).map(p => getEmptyPassenger(0, flightType)));
        setChildsInfo(range(0, childCount).map(p => getEmptyPassenger(1, flightType)));
        setInfantsInfo(range(0, infantCount).map(p => getEmptyPassenger(2, flightType)));
    }, [adultCount, childCount, infantCount]);



    const setWithNoError = func => d => {
        setError();
        func(d);
    };

    const setDirType = setWithNoError(_setDirType);
    const setAdultCount = setWithNoError(_setAdultCount);
    const setChildCount = setWithNoError(_setChildCount);
    const setInfantCount = setWithNoError(_setInfantCount);
    const setSelected = setWithNoError(_setSelected);
    const setFlightType = flight => {
        setError();
        _setFlightType(flight);
        setDep();
        setArrival();
    };

    const setDateFrom = setWithNoError(_setDateFrom);
    const setDateTo = setWithNoError(_setDateTo);
    const setDep = setWithNoError(_setDep);
    const setArrival = setWithNoError(_setArrival);

    /*
    "itineraries":[{
                "OriginLocation": dep.code,
                "DestinationLocation": arrival.code,
                "DepartureDate":"2021-06-25",
                "ReturnDate":null
            }, {
                "OriginLocation":"ist",
                "DestinationLocation":"ika",
                "DepartureDate":"2021-07-25",
                "ReturnDate":null
            }]
     */

    const DepartureDate = formatDate(dateFrom);
    const ArrivalDate = formatDate(dateTo);

    const getSearchOptions = () => {
        const {code: OriginLocation} = dep || {};
        const {code: DestinationLocation} = arrival || {};

        let itineraries = [{
            OriginLocation,
            DestinationLocation,
            DepartureDate,
            ReturnDate: null
        }];

        if(dirType === 1) itineraries.push({
            OriginLocation: DestinationLocation,
            DestinationLocation: OriginLocation,
            DepartureDate: ArrivalDate,
            ReturnDate: null
        });

        return {
            itineraries,
            ChildQuantity: childCount,
            InfantQuantity: infantCount,
            AdultQuantity: adultCount,
            CabinType: 3,
            SearchType: 1, //flightType
        }
    };

    const findSearchErrors = () => {
        // setError();
        const now = formatDate(Date.now());
        if(DepartureDate < now) return "airplane.err.passed_date";
        if(dirType !== 0) {
            if(ArrivalDate < DepartureDate) {
                return "airplane.err.arrival_date";
            }
        }

        if(!dep) return "airplane.err.select_dep";
        if(!arrival) return "airplane.err.select_arrival";
    };



    const doSearch = () => {
        const e = findSearchErrors();
        if(e) {
            setError(e);
            return false;
        }

        setResults([]);

        // console.log(getSearchOptions());
        // return false;
        //
        /*
        {
	"itineraries":[{
		"OriginLocation":"ika",
		"DestinationLocation":"ist",
		"DepartureDate":"2021-10-25",
		"ReturnDate":null
	}],
	"ChildQuantity":0,
	"InfantQuantity":0,
	"AdultQuantity":1,
	"CabinType":3,
	"SearchType":1
}


{"AdultQuantity": 1, "CabinType": 3, "ChildQuantity": 0, "InfantQuantity": 0, "SearchType": 1, "itineraries": [{"DepartureDate": "2021-10-25", "DestinationLocation": "IKA", "OriginLocation": "IST", "ReturnDate": null}]}
         */
        getSeaerch(getSearchOptions(), setLoading, results => {
            setResults(results);
            setIndex(1);
        });
        return false;
    };


    const doIssue = () => {

        const {invoiceId, totalPrice} = bookingInfo;

        console.log(bookingInfo);

        return false;

        const amount = calcPriceInUSD(totalPrice, airplaneTicketRate);

        const transactions = [
            {amount: -amount, wid: formalCustomerNumber(wid), cur: "usd", desc: "Buy airplane ticket from "+stdCustomerNumber(bwid), type: "airplane_ticket", owid: bwid, bid},
            {amount, wid: formalCustomerNumber(bwid), cur: "usd", desc: "Transfer to "+stdCustomerNumber(wid) + " for airplane ticket", type: "airplane_ticket", owid: wid, bid},
        ];

        doFlightIssue(invoiceId, setLoading, data => {
            // console.log(ticket);
            // const usdPrice = calcPriceInUSD(totalPrice, airplaneTicketRate);
            setMessage("airplane.mes.ticked_issued");
            const t = {data, usdPrice: amount};
            console.log(data);
            setTicket(t);

            saveATicket(t, setLoading, () => {
                doWallets(transactions, setLoading, () => {
                }, () => showError("Error"), lang);
            });
        }, page);

        return false;
    };

    const showError = err => page.setToast(T(err+"", lang), Colors.red600);

    const doBook = () => {
        if(!results || selected < 0) return false;

        const {searchId, itineraries} = results || {};
        if(!searchId || !itineraries) return false;

        // if(!results || !results.itineraries || !results.itineraries[selected]) return false;
        const sel = itineraries[selected];
        const passengers = [...adultsInfo, ...childsInfo, ...infantsInfo];

        // console.log(infantsInfo);
        // return ;

        for(const p of passengers) {
            if(!p.latinFirstName) {
                showError("airplane.err.fill_passengers");
                return ;
            }
        }

        const bookingData = {
            searchType: flightType,
            searchId,
            selected: [sel],
            passengers,
            promotionCode: null,
            buyer,
        };

        doFlightBook(bookingData, setLoading, info => {
            // console.log(info);
            setBookingInfo(info);
            setIndex(3);
        }, page);

        return false;
    };

    const [results, _setResults] = useState({itineraries: []});

    const setResults = results => {
        setSelected(-1);
        _setResults(results);
    };

    const setIndex = index => {
        setMessage();
        _setIndex(index);
    };

    // useEffect(() => {
    //     setResults(getResults())
    // }, [index]);
    //

    const {user, lang} = useSelector(({pax}) => pax);
    useEffect(() => {
        setOptions({title: `${T("airplane.new_ticket", lang)}`});
    }, [lang]);

    // useEffect(() => getTicketToken(setLoading), []);

    useEffect(() => {
        return function cleanUp() {
            const {onUnmount} = getParams(route, "onUnmount");
            if(!onUnmount) return;
            onUnmount();
        }
    }, []);

    // console.log(infantsInfo);

    const TabComp = TabsComp[index];

    const props = {
        loading, setLoading,
        lang, showError,
        results,
        selected, setSelected,
        adultCount, setAdultCount,
        childCount, setChildCount,
        infantCount, setInfantCount,
        flightType, setFlightType,
        dirType, setDirType,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        dep, setDep,
        arrival, setArrival,
        adultsInfo, setAdultsInfo,
        childsInfo, setChildsInfo,
        infantsInfo, setInfantsInfo,
        bookingInfo, setBookingInfo,
        message,
        navigate,
        airplaneTicketRate,
    };

    const checkPrice = () => {
        if(!results) return false;
        const {itineraries = []} = results;

        const {totalPrice} = itineraries[selected] || {};
        const usdPrice = calcPriceInUSD(totalPrice, airplaneTicketRate);
        console.log("checkPrice, totalPrice", usdPrice, usd, usdPrice > usd);
        if(usdPrice > usd) {
            showError("airplane.err.insufficient_usd");
            return false;
        }
        else return true;
    };


    const enabled = (index === 0) || (index === 1 && selected >= 0) || (index === 2) || (index === 3);
    const actions = [doSearch, checkPrice, doBook, doIssue, nop];


    const onDone = index => {
        const act = actions[index];
        return !act ? true : act();
    };


    return !!ticket && !loading ? <TicketViewPage loader={loading} t={ticket} /> :  <JPage
        ref={ref => page = ref}
        loader={loading}
        pin2={<JTabBar lang={lang} index={index} tabs={TABS} />}
        footerHeight={!error ? 42 : 68}
        footer={<NavBar lang={lang} error={error}  index={index} length={TABS.length} setIndex={setIndex} enabled={enabled} loading={loading} onDone={onDone} />}
    >
        <TabComp {...props} />



    </JPage>
}

Airplane.title = P("airplane.ticket");

export default Airplane;
