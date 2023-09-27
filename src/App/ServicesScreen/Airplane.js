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
import {setValues} from "../../redux/actions";

import parsePhoneNumber from 'libphonenumber-js'

// console.log(parsePhoneNumber('+919098765432'));
// console.log(parsePhoneNumber('+989133834091'));

// const {nationalNumber, countryCallingCode} = parsePhoneNumber('+989133834091');
// console.log(nationalNumber, countryCallingCode);


Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const nop = () => true;

const getAirportTitle = ({cityNameEn, airportCode}) => `${cityNameEn} (${airportCode})`;

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


    //console.log(dep);

    return <View>
        <JCard>
            <JRadioButton visible={false} style={styles.withMargin} icon="check-bold" lang={lang} color={accent} value={flightType} setValue={setFlightType} options={[
                {v: 2, l: "airplane.domestic"},
                {v: 1, l: "airplane.international"},
            ]} />

            <JRadioButton style={styles.withMargin} icon="check-bold" lang={lang} value={dirType} color={accent}  setValue={setDirType} options={[
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
            }})}>{!dep ? T("airplane.select_parenthesis", lang) : getAirportTitle(dep)}</Button>

            {/*<JPicker value={dep} onChange={setDep} options={airports} />*/}
            <Caption style={styles.pickerCaption}>{T("airplane.to_airport", lang)}</Caption>
            <Button uppercase={false} onPress={() => navigate("SelectAirport", {searchType: flightType, selected: arrival, onSelect: airport => {
                    setArrival(airport);
                }})}>{!arrival ? T("airplane.select_parenthesis", lang) : getAirportTitle(arrival)}</Button>
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

const PassengerTypeCodes = ["ADT", "CHD", "INF"];
const NamePrefixes = ["MR", "MS", "MSTR", "MISS"];

function passToTraveler(passenger) {
    const {
        type, //0 for Adult, 1 for child, 2 for infant
        nationality, ///: "IR,IRN"
        latinFirstName,
        latinLastName,
        birthDay,
        gender, //0 for female, 1 for male : "1"
        nationalCode,
        firstName,
        lastName,
        isForeigners,
        passengerValidationType, //1 International, 2 for Domestic

        passportIssueCountry, //: "IR,IRN",
        passportExpireDate, //: "",

        passportNumber, //: "",
        parent, //: null,

    } = passenger || {};

    const preIndex = 2*(type === 0 ? 0 : 1)+1-(1*gender);

    var nation = "IR";
    if(isForeigners) {
        if(!!passportIssueCountry && passportIssueCountry.length >= 2) nation = passportIssueCountry.substring(0, 2);
    }

    return {
        "PersonName": {
            "GivenName": (latinFirstName || "").toUpperCase(),
            "NamePrefix": NamePrefixes[preIndex], // gender === 0 ? "MR" : "MS",
            "Surname": (latinLastName || "").toUpperCase(),
        },
        "Document": {
            "DocID": isForeigners ? passportNumber : nationalCode,
            "DocIssueCountry": "IQ", // isForeigners ? nation : "IR",
            "ExpireDate": isForeigners ? passportExpireDate : "2025-01-01",
            "InnerDocType": "Passport"
        },
        "NationalId": isForeigners ? passportNumber : nationalCode,
        "BirthDate": birthDay,
        "PassengerTypeCode": PassengerTypeCodes[type],
        "CurrencyCode": "",
        "Email": ""
    };
}

const sampleAirTraveler = {
    "AirTraveler": [
        {
            "PersonName": {
                "GivenName": "RASOUL",
                "NamePrefix": "MR",
                "Surname": "JAFARI"
            },
            "Document": {
                "DocID": "4679389427",
                "DocIssueCountry": "IR",
                "ExpireDate": "2025-01-01",
                "InnerDocType": "Passport"
            },
            "NationalId": "4679389427",
            "BirthDate": "1985-03-21",
            "PassengerTypeCode": "ADT",
            "CurrencyCode": "",
            "Email": ""
        },
        {
            "PersonName": {
                "GivenName": "JAVAD",
                "NamePrefix": "MS",
                "Surname": "AHMADI"
            },
            "Document": {
                "DocID": "1234567",
                "DocIssueCountry": "ES",
                "ExpireDate": "2023-02-03",
                "InnerDocType": "Passport"
            },
            "NationalId": "1234567",
            "BirthDate": "2001-03-21",
            "PassengerTypeCode": "ADT",
            "CurrencyCode": "",
            "Email": ""
        },
        {
            "PersonName": {
                "GivenName": "MARYAM",
                "NamePrefix": "MSTR",
                "Surname": "AHMADI"
            },
            "Document": {
                "DocID": "4679425814",
                "DocIssueCountry": "IR",
                "ExpireDate": "2025-01-01",
                "InnerDocType": "Passport"
            },
            "NationalId": "4679425814",
            "BirthDate": "2018-03-21",
            "PassengerTypeCode": "CHD",
            "CurrencyCode": "",
            "Email": ""
        },
        {
            "PersonName": {
                "GivenName": "PARIA",
                "NamePrefix": "MISS",
                "Surname": "JAFARI"
            },
            "Document": {
                "DocID": "2345678",
                "DocIssueCountry": "AE",
                "ExpireDate": "2024-03-02",
                "InnerDocType": "Passport"
            },
            "NationalId": "2345678",
            "BirthDate": "2020-03-20",
            "PassengerTypeCode": "INF",
            "CurrencyCode": "",
            "Email": ""
        }
    ]
};

const sampleFlightSegment = {
    "DepartureDateTime": "2021-12-17T00:49:00",
    "ArrivalDateTime": "2021-12-17T03:35:00",
    "FlightNumber": 668,
    "ResBookDesigCode": "N",
    "JourneyDuration": "02:46",
    "JourneyDurationPerMinute": 166,
    "ConnectionTime": "00:00",
    "ConnectionTimePerMinute": 0,
    "DepartureAirport": {
        "LocationCode": "MHD",
        "AirportName": "Shahid Hashemi Nejad",
        "Terminal": 1,
        "Gate": null,
        "CodeContext": null
    },
    "ArrivalAirport": {
        "LocationCode": "THR",
        "AirportName": "Mehrabad Intl",
        "Gate": null,
        "CodeContext": null
    },
    "MarketingAirline": {
        "Code": "QB",
        "CompanyShortName": "Qeshm Air"
    },
    "CabinClassCode": "Economy",
    "OperatingAirline": {
        "Code": "QB",
        "FlightNumber": 668,
        "CompanyShortName": "Qeshm Air"
    },
    "TPA_Extensions": {
        "Origin": "Mashhad",
        "Destination": "Tehran",
        "DepartureDateG": "December 17",
        "DepartureDateJ": "جمعه 26 آذر",
        "ArrivalDateG": "December 17",
        "ArrivalDateJ": "جمعه 26 آذر",
        "FlightTime": "00:49",
        "ArrivalTime": "03:35",
        "AirlineNameFa": "قشم ایر"
    },
    "Comment": "",
    "Equipment": {
        "AircraftTailNumber": "",
        "AirEquipType": "Boeing737",
        "ChangeofGauge": null
    },
    "SeatsRemaining": "9",
    "comment": "",
    "BookingClassAvail": {
        "ResBookDesigCode": "N",
        "ResBookDesigQuantity": null,
        "ResBookDesigStatusCode": null,
        "Meal": null
    },
    "MarketingCabin": {
        "Meal": null,
        "FlightLoadInfo": {
            "AuthorizedSeatQty": null,
            "RevenuePaxQty": null
        },
        "BaggageAllowance": {
            "UnitOfMeasure": "Kilo Gram",
            "UnitOfMeasureCode": "KG",
            "UnitOfMeasureQuantity": 20
        }
    }
};

function FlightSegment({segment, index, length}) {
    const {
        MarketingAirline: {Code: airlineCode, CompanyShortName: airlineTitle},
        DepartureAirport: {AirportName: departureAirportLocationTitle},
        DepartureDateTime: departureDateTime,
        CabinClassCode: cabinType,
        ArrivalAirport: {AirportName: arrivalAirportLocationTitle},
        ArrivalDateTime: arrivalDateTime,
        FlightNumber: flightNumber,
        Equipment: {AirEquipType: airplaneTitle},
        // airlineTitle,
        //airplaneTitle,
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
const sampleOriginDestination = {
    "DepartureDateTime": "2021-12-17T00:49:00",
    "DepartureDateG": "December 17",
    "DepartureDateJ": "جمعه 26 آذر",
    "ArrivalDateTime": "2021-12-17T03:35:00",
    "ArrivalDateG": "December 17",
    "ArrivalDateJ": "جمعه 26 آذر",
    "JourneyDuration": "02:46",
    "JourneyDurationPerMinute": 166,
    "OriginLocation": "MHD",
    "DestinationLocation": "THR",
    "TPA_Extensions": {
        "Origin": "Mashhad",
        "Destination": "Tehran",
        "FlightType": "float",
        "IsCharter": true,
        "IsForeign": false,
        "IsLock": true,
        "stop": 0
    },
    "FlightSegment": [
        {
            "DepartureDateTime": "2021-12-17T00:49:00",
            "ArrivalDateTime": "2021-12-17T03:35:00",
            "FlightNumber": 668,
            "ResBookDesigCode": "N",
            "JourneyDuration": "02:46",
            "JourneyDurationPerMinute": 166,
            "ConnectionTime": "00:00",
            "ConnectionTimePerMinute": 0,
            "DepartureAirport": {
                "LocationCode": "MHD",
                "AirportName": "Shahid Hashemi Nejad",
                "Terminal": 1,
                "Gate": null,
                "CodeContext": null
            },
            "ArrivalAirport": {
                "LocationCode": "THR",
                "AirportName": "Mehrabad Intl",
                "Gate": null,
                "CodeContext": null
            },
            "MarketingAirline": {
                "Code": "QB",
                "CompanyShortName": "Qeshm Air"
            },
            "CabinClassCode": "Economy",
            "OperatingAirline": {
                "Code": "QB",
                "FlightNumber": 668,
                "CompanyShortName": "Qeshm Air"
            },
            "TPA_Extensions": {
                "Origin": "Mashhad",
                "Destination": "Tehran",
                "DepartureDateG": "December 17",
                "DepartureDateJ": "جمعه 26 آذر",
                "ArrivalDateG": "December 17",
                "ArrivalDateJ": "جمعه 26 آذر",
                "FlightTime": "00:49",
                "ArrivalTime": "03:35",
                "AirlineNameFa": "قشم ایر"
            },
            "Comment": "",
            "Equipment": {
                "AircraftTailNumber": "",
                "AirEquipType": "Boeing737",
                "ChangeofGauge": null
            },
            "SeatsRemaining": "9",
            "comment": "",
            "BookingClassAvail": {
                "ResBookDesigCode": "N",
                "ResBookDesigQuantity": null,
                "ResBookDesigStatusCode": null,
                "Meal": null
            },
            "MarketingCabin": {
                "Meal": null,
                "FlightLoadInfo": {
                    "AuthorizedSeatQty": null,
                    "RevenuePaxQty": null
                },
                "BaggageAllowance": {
                    "UnitOfMeasure": "Kilo Gram",
                    "UnitOfMeasureCode": "KG",
                    "UnitOfMeasureQuantity": 20
                }
            }
        }
    ]
};

function OriginDestination({option, index, length}) {
    const {
        FlightSegment: flightsSegments,
        remain,
        stops,

    } = option || {};

    const last = index === length-1;
    // console.log(option);

    const segLength = (flightsSegments || []).length;

    return !flightsSegments ?
        <FlightSegment length={1} segment={option} /> : <View>
            {length > 1 && <View style={{alignItems: 'center'}}>
                <Caption style={{color: 'green'}}>{flightTitle(index)}</Caption>
            </View>}
            {flightsSegments.map((segment, key) => <FlightSegment length={segLength} index={key} segment={segment} key={key} />)}
            <Hr visible={!last} />
        </View>

}


export const sampleResult = {
    "AirItinerary": [
        {
            "SessionId": "cd95bc0b-9421-42a9-9e25-408dc7289b0a",
            "CombinationId": 1,
            "RecommendationId": 0,
            "SubsystemId": 110,
            "SubsystemName": "gohar"
        }
    ],
    "AirItineraryPricingInfo": {
        "ItinTotalFare": {
            "BaseFare": 86359,
            "TotalFare": 94809,
            "TotalCommission": 0,
            "TotalTax": 8450,
            "ServiceTax": 0,
            "Original": 86359,
            "Currency": "IRR"
        },
        "PTC_FareBreakdowns": [
            {
                "PassengerFare": {
                    "BaseFare": 86359,
                    "TotalFare": 94809,
                    "Commission": 0,
                    "ServiceTax": 0,
                    "Taxes": 8450,
                    "Currency": "IRR"
                },
                "PassengerTypeQuantity": {
                    "Code": "ADT",
                    "Quantity": 1
                }
            }
        ]
    },
    "OriginDestinationInformation": {
        "OriginDestinationOption": [
            {
                "DepartureDateTime": "2021-12-18T00:49:00",
                "DepartureDateG": "December 17",
                "DepartureDateJ": "جمعه 26 آذر",
                "ArrivalDateTime": "2021-12-17T03:35:00",
                "ArrivalDateG": "December 17",
                "ArrivalDateJ": "جمعه 26 آذر",
                "JourneyDuration": "02:46",
                "JourneyDurationPerMinute": 166,
                "OriginLocation": "MHD",
                "DestinationLocation": "THR",
                "TPA_Extensions": {
                    "Origin": "Mashhad",
                    "Destination": "Tehran",
                    "FlightType": "float",
                    "IsCharter": true,
                    "IsForeign": false,
                    "IsLock": true,
                    "stop": 0
                },
                "FlightSegment": [
                    {
                        "DepartureDateTime": "2021-12-17T00:49:00",
                        "ArrivalDateTime": "2021-12-17T03:35:00",
                        "FlightNumber": 668,
                        "ResBookDesigCode": "N",
                        "JourneyDuration": "02:46",
                        "JourneyDurationPerMinute": 166,
                        "ConnectionTime": "00:00",
                        "ConnectionTimePerMinute": 0,
                        "DepartureAirport": {
                            "LocationCode": "MHD",
                            "AirportName": "Shahid Hashemi Nejad",
                            "Terminal": 1,
                            "Gate": null,
                            "CodeContext": null
                        },
                        "ArrivalAirport": {
                            "LocationCode": "THR",
                            "AirportName": "Mehrabad Intl",
                            "Gate": null,
                            "CodeContext": null
                        },
                        "MarketingAirline": {
                            "Code": "QB",
                            "CompanyShortName": "Qeshm Air"
                        },
                        "CabinClassCode": "Economy",
                        "OperatingAirline": {
                            "Code": "QB",
                            "FlightNumber": 668,
                            "CompanyShortName": "Qeshm Air"
                        },
                        "TPA_Extensions": {
                            "Origin": "Mashhad",
                            "Destination": "Tehran",
                            "DepartureDateG": "December 17",
                            "DepartureDateJ": "جمعه 26 آذر",
                            "ArrivalDateG": "December 17",
                            "ArrivalDateJ": "جمعه 26 آذر",
                            "FlightTime": "00:49",
                            "ArrivalTime": "03:35",
                            "AirlineNameFa": "قشم ایر"
                        },
                        "Comment": "",
                        "Equipment": {
                            "AircraftTailNumber": "",
                            "AirEquipType": "Boeing737",
                            "ChangeofGauge": null
                        },
                        "SeatsRemaining": "9",
                        "comment": "",
                        "BookingClassAvail": {
                            "ResBookDesigCode": "N",
                            "ResBookDesigQuantity": null,
                            "ResBookDesigStatusCode": null,
                            "Meal": null
                        },
                        "MarketingCabin": {
                            "Meal": null,
                            "FlightLoadInfo": {
                                "AuthorizedSeatQty": null,
                                "RevenuePaxQty": null
                            },
                            "BaggageAllowance": {
                                "UnitOfMeasure": "Kilo Gram",
                                "UnitOfMeasureCode": "KG",
                                "UnitOfMeasureQuantity": 20
                            }
                        }
                    }
                ]
            }
        ]
    }
};

function calTotalPrice(result) {
    if(!result) return 0;
    const {AirItineraryPricingInfo} = result;
    if(!AirItineraryPricingInfo) return 0;
    const {ItinTotalFare} = AirItineraryPricingInfo;
    if(!ItinTotalFare) return 0;
    const {TotalFare} = ItinTotalFare;
    return TotalFare || 0;
}

function Result({value, selected, index, onPress, airplaneTicketRate}) {
    // console.log(Object.keys(value));
    // console.log(value);
    // const {source, date, price} = value || {};
    // const {flights = [], totalPrice, currency} = value || {};
    // const {flights} = value || {};
    const {AirItinerary, AirItineraryPricingInfo, OriginDestinationInformation} = value || {};

    const {SubsystemId, SubsystemName} = AirItinerary[0] || {};
    console.log(AirItinerary);
    // if(SubsystemId === 85) return null;

    // const {ItinTotalFare, PTC_FareBreakdowns} = AirItineraryPricingInfo || {};
    // const {TotalFare: totalPrice, Currency: currency} = ItinTotalFare || {};

    const totalPrice = calTotalPrice(value);

    const {OriginDestinationOption} = OriginDestinationInformation || {};

    const onp = SubsystemId === 85 ? () => {
        console.log(SubsystemName);
    } : onPress;

    const backgroundColor = SubsystemId === 85 ? "#eeeeee" : selected === index ? 'yellow' : 'white'

    const length = OriginDestinationOption.length;
    return <JCard style={{backgroundColor}}>
        <TouchableRipple onPress={onp}>
            <View style={{flex: 1, marginHorizontal: 4}}>
                <Text style={{color: "black", fontWeight: 'bold', textAlign: "center"}}>USD {toTwoDigit(calcPriceInUSD(totalPrice, airplaneTicketRate))}</Text>
                <Hr />
                {OriginDestinationOption.map((f, i) => <OriginDestination option={f} index={i} length={length} key={i} />)}
            </View>
        </TouchableRipple>
    </JCard>;
}

function Tab1({lang, results, selected, setSelected, airplaneTicketRate}) {

    const itineraries = results || [];
    // console.log("results", JSON.stringify(results));

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

// function normalizePassenger(pass) {
//     const {birthDay: b, passportExpireDate: p} = pass;
//     return {...pass, birthDay: normalizeDate(b), passportExpireDate: normalizeDate(p) }
// }
//
// function normalizePassengers(passengers) {
//     return passengers.map(normalizePassenger);
// }

const EMPTY_Passenger = {
    type: 0, //0 for Adult, 1 for child, 2 for infant
    nationality: "IQ", ///xxx
    latinFirstName: "",
    latinLastName: "",
    birthDay: "",
    gender: "1", //0 for female, 1 for male
    nationalCode: "",
    firstName: "",
    lastName: "",
    isForeigners: true,
    passengerValidationType: 2, //1 International, 2 for Domestic

    passportIssueCountry: "IQ",
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
    return totalPrice;
    //return !airplaneTicketRate ? totalPrice : totalPrice / airplaneTicketRate;
}

function Tab3({message, bookingInfo, lang, airplaneTicketRate}) {
    //{"id": 51376, "invoiceId": 48228, "isChangePrice": false, "refrenceCode": "-1", "totalPrice": 5485000}
    //{"BookId": "0965c486-4b9d-46de-b508-219ec3a2f4d3", "ContractInfo": {"Amount": 96717, "ContractNo": 2125, "Currency": "IRR"},
    // const {invoiceId, totalPrice} = bookingInfo;
    const {ContractInfo} = bookingInfo || {};
    const {Amount = 0, ContractNo} = ContractInfo || {};

    return <View>
        <JCard>
            <Title style={styles.black}>Contract No: {ContractNo}</Title>
            <Title style={styles.black}>Total Price: USD {toTwoDigit(calcPriceInUSD(Amount, airplaneTicketRate))}</Title>
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

function airportToLocation(airport) {
    console.log("airportToLocation", JSON.stringify(airport));

    const {airportCode: LocationCode, airportNameEn, MultiAirportCityInd} = airport;
    return {
        CodeContext: "IATA",
        LocationCode,
        MultiAirportCityInd: !!MultiAirportCityInd,
    };
}

function Airplane({navigation, route}) {
    let page;

    const {setOptions, navigate} = navigation;
    const dispatch = useDispatch();


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

    const {user: {aid, wid, bid, phone}, wallet: {usd}, branch: {wid: bwid}} = useSelector(({pax}) => pax);

    // console.log("phone", phone);
    // console.log("wid", wid, bid);

    // const {wallet, rates, user: {walletType = WalletTypes.bronze, aid}, branch: {defCurrency}} = useSelector(({pax}) => pax);
    useEffect(() => {
        loadFees(aid, setLoading, setFees, console.log, 1);
    }, [aid]);


    const {airplaneTicket: airplaneTicketRate} = fees;

    // console.log("airplaneTicketRate", airplaneTicketRate);



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


    /*
    "OriginDestinationInformations": [
                {
                    "OriginLocation": {
                        "CodeContext": "IATA",
                        "LocationCode": "MHD",
                        "MultiAirportCityInd": false
                    },
                    "DestinationLocation": {
                        "CodeContext": "IATA",
                        "LocationCode": "THR",
                        "MultiAirportCityInd": false
                    },
                    "DepartureDateTime": "2021-12-17",
                    "ArrivalDateTime": null
                }
            ]
     */

    const getSearchOptions = () => {
        console.log("dirType", dirType);
        const OriginLocation = airportToLocation(dep);
        const DestinationLocation = airportToLocation(arrival);
        const odi1 = {
            OriginLocation,
            DestinationLocation,
            DepartureDateTime: DepartureDate,
            ArrivalDateTime: null,
        };

        const OriginDestinationInformations = dirType === 0 ? [odi1] : [odi1, {
            OriginLocation: DestinationLocation,
            DestinationLocation: OriginLocation,
            DepartureDateTime: ArrivalDate,
            ArrivalDateTime: null,
        }];

        return {
            "Lang": "FA",
            "TravelPreference": {
                "CabinPref": {
                    "Cabin": "Economy"
                },
                "EquipPref": {
                    "AirEquipType": "IATA"
                },
                "FlightTypePref": {
                    "BackhaulIndicator": "",
                    "DirectAndNonStopOnlyInd": false,
                    "ExcludeTrainInd": false,
                    "GroundTransportIndicator": false,
                    "MaxConnections": 3
                }
            },
            "TravelerInfoSummary": {
                "AirTravelerAvail": {
                    "PassengerTypeQuantity": [
                        {
                            "Code": "ADT",
                            "Quantity": adultCount
                        },
                        {
                            "Code": "CHD",
                            "Quantity": childCount
                        },
                        {
                            "Code": "INF",
                            "Quantity": infantCount
                        }
                    ]
                }
            },
            "SpecificFlightInfo": {
                "Airline": []
            },
            OriginDestinationInformations,
        };
    };

    const getSearchOptions_old = () => {
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

        getSeaerch(getSearchOptions(), setLoading, results => {
            // console.log(JSON.stringify(results));
            setResults(results);

            setIndex(1);
        }, page);
        return false;
    };

    const sampleTicket = {
        "Items": [
            {
                "Success": true,
                "Items": {
                    "AirItinerary": {
                        "SessionId": "5de0be58-0a60-4ccb-a0c9-3950329c4c8e",
                        "CombinationId": 0,
                        "RecommendationId": 0,
                        "SubsystemId": 110,
                        "SubsystemName": "gohar",
                        "pnr": "TestDL"
                    },
                    "TravelerInfo": {
                        "AirTraveler": [
                            {
                                "Email": "",
                                "Gender": "Male",
                                "Document": {
                                    "DocID": "4679389427",
                                    "ExpireDate": "2025-01-01 00:00:00",
                                    "InnerDocType": "Passport",
                                    "DocIssueCountry": "IR"
                                },
                                "PersonId": 31094,
                                "BirthDate": "1978-07-02 00:00:00",
                                "NationalId": "4679389427",
                                "PersonName": {
                                    "Surname": "JAFARI",
                                    "GivenName": "RASOUL",
                                    "NamePrefix": "MR"
                                },
                                "Nationality": "IR",
                                "PassengerId": 31066,
                                "CurrencyCode": "",
                                "PassengerTypeCode": "ADT",
                                "TicketNumber": [
                                    "97351284"
                                ],
                                "ReferenceId": "TestDL"
                            }
                        ]
                    }
                }
            }
        ]
    };

    const doIssue = () => {
        const {ContractInfo} = bookingInfo || {};
        const {Amount = 0, ContractNo} = ContractInfo || {};

        // const {invoiceId, totalPrice} = bookingInfo;

        // console.log(bookingInfo);

        // return false;

        const amount = calcPriceInUSD(Amount, airplaneTicketRate);

        const transactions = [
            {amount: -amount, wid: formalCustomerNumber(wid), cur: "usd", desc: "Buy airplane ticket from "+stdCustomerNumber(bwid), type: "airplane_ticket", owid: bwid, bid},
            {amount, wid: formalCustomerNumber(bwid), cur: "usd", desc: "Transfer to "+stdCustomerNumber(wid) + " for airplane ticket", type: "airplane_ticket", owid: wid, bid},
        ];

        doFlightIssue(ContractNo, setLoading, data => {
            // console.log(ticket);
            // const usdPrice = calcPriceInUSD(totalPrice, airplaneTicketRate);
            const result = (results || [])[selected];
            setMessage("airplane.mes.ticked_issued");
            const t = {data, usdPrice: amount, result};
            //console.log(data);
            setTicket(t);

            saveATicket(t, setLoading, () => {
                doWallets(transactions, setLoading, () => {
                }, () => showError("Error"), lang);
            });
        }, page);

        return false;
    };

    const showError = err => page.setToast(T(err+"", lang), Colors.red600);

    const getBookData = () => {
        const AirTraveler = [...adultsInfo, ...childsInfo, ...infantsInfo].map(passToTraveler);
        const {AirItinerary} = results[selected] || {};

        const {nationalNumber: PhoneNumber, countryCallingCode} = parsePhoneNumber(phone || '+989133834091');


        return {
          "Discount": {
              "CoponCode": "kaskas"
          },
          "Owner": {
              "Contacts": [
                  {
                      "Email": "wallet@bahbahan.com",
                      "Telephone": {
                          "PhoneTechType": "Mobile",
                          PhoneNumber,
                          "CountryAccessCode": "00"+countryCallingCode,
                          "AreaCityCode": ""
                      }
                  }
              ]
          },
          "Transports": {
              AirItinerary,
              "Ticketing": {
                  "TicketType": "BookingOnly"
              },
              //"Captcha": null,
              "TravelerInfo": {
                  AirTraveler
              }
          },
          "currencyToPay": "USD"
      };
    };

    const doBook = () => {
        if(!results || selected < 0) return false;
        // console.log("ssss", results[selected]);
        // console.log("doBook2", adultsInfo[0]);
        // console.log("doBook3", JSON.stringify(passToTraveler(adultsInfo[0])) );

        const passengers = [...adultsInfo, ...childsInfo, ...infantsInfo];

        // console.log(infantsInfo);
        // return ;

        for(const p of passengers) {
            if(!p.latinFirstName) {
                showError("airplane.err.fill_passengers");
                return ;
            }
        }

        const bookingData = getBookData();

        console.log("bookingData2", JSON.stringify(bookingData));
        // return;

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
        //const {itineraries = []} = results;
        const result = (results || [])[selected];

        // console.log("airplaneTicketRate", airplaneTicketRate);

        const totalPrice = calTotalPrice(result);

        const usdPrice = calcPriceInUSD(totalPrice, airplaneTicketRate);
        console.log("checkPrice, totalPrice", usdPrice, usd, usdPrice > usd);
        if(false && usdPrice >= usd) { //TODO:
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
