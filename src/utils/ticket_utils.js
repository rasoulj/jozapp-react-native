import set from "@babel/runtime/helpers/esm/set";
import {baseApiUrl, getOnError} from "./db_mongo";
import {getItem, saveItem} from "./local_db";

import qs from "qs";

const _flightOwner = "tav";

/*
'username': 'wallet', //  '00987161938675',
        'password':  '123Wallet!@#', // 'kaskas'
    });
 */

const _allFlightConfig = {
    test: {
        Currency: "IRR",
        username: "00987161938675",
        password: "kaskas",
        hasDomestic: true,
        origin: "https://www.demo.citynet.ir",
    },
    tav: {
        Currency: "IRR",
        username: "info@tavenergy.com",
        password: "123Inf!@#",
        hasDomestic: true,
        origin: "www.tavenergy.com",
    },
    bahbahan: {
        Currency: "USD",
        username: "wallet",
        password: "123Wallet!@#",
        hasDomestic: false,
        origin: 'https://www.bahbahan.com'
    }
};

export const flightConfig = _allFlightConfig[_flightOwner];


// const client_id = "mwv0iiJwFI6iHPefIK2ZryMYPt1P+IdoQFBNJJuPZbw="; //&
// const client_secret = "DWXUvI8tn6Q15zNRtD2UX0uoDSlEk6DMidu37TLlqUkCfY+9fGOdRNWnIG4goper"; //&


const client_id = "MQ5eGzxtYyEm4FbckJ74EsLAQXe4Q48nYiTDAFBQUPk="; //&
const client_secret = "MQ5eGzxtYyEm4FbckJ74EsLAQXe4Q48nYiTDAFBQUPk=";//&
const grant_type = "client_credentials";

export const ticket_credentials = `client_id=${client_id}&\nclient_secret=${client_secret}&\ngrant_type=${grant_type}`;

// export const ticketBaseUrl = "https://api.bluetriip.com";
export const ticketBaseUrl = "https://171.22.24.69";
// export const ticketBaseApi = `${ticketBaseUrl}api/v2/`;
export const ticketBaseApi = `${ticketBaseUrl}/api/v1.0/`;

const INVALID_TOKEN = "INVALID_TOKEN";
let ticket_token = INVALID_TOKEN;

const Srv = {
    token: "token",
    airports: "airports",
    search: "search",
    book: "book",
    issue: "issue",
};

const S = {
    authenticate: "authenticate",
    airportList: "airportlist",
    flights: {
        search: "flights/search",
        book: "flights/book",
        ticket: "flights/ticket",
    },
};

const axios = require('axios');//.default;

const doResults = (setValue, onError) => response => {
    // console.log(response);
    const {data} = response || {};
    // console.log("data", data);
    const {Success = false, Items = "Unknown error"} = data || {Success: false, Items: "Unknown error"};

    // console.log(data);

    if (!Success) {
        onError(Items);
    } else setValue(Items);
};


function getConfig(action, data, method = "post") {
    const {origin} = flightConfig;
    const p = method === "post";
    return {
        method,
        url: ticketBaseApi + action + (p ? "" : `?${qs.stringify(data)}`),

        headers: {
            'Authorization': `bearer ${ticket_token}`,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            origin
        },
        data: p ? JSON.stringify(data) : ""
    };
}


/*
{
    "key": "ban",
    "searchType": 1
}
 */
export function getAirports(data, setLoader, onDone, page) {
    const onError = getOnError(page);
    // console.log(data);
    const config = getConfig(S.airportList, data, "get");
    // console.log(config);
    setLoader(true);
    axios(config).then(doResults(onDone, onError)).catch(onError).finally(() => setLoader(false));
}



function getTicketToken() {
    // const data = qs.stringify({
    //     'username': 'wallet', //  '00987161938675',
    //     'password':  '123Wallet!@#', // 'kaskas'
    // });

    const {username, password, origin} = flightConfig;

    const data = qs.stringify({username, password});
        //'username': 'wallet', //  '00987161938675',
        //'password':  '123Wallet!@#', // 'kaskas'
    // });

    console.log(data);
    const config = {
        method: 'post',
        url: ticketBaseApi+S.authenticate,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            origin
        },
        data: data
    };
    // setLoader(true);
    // console.log(config);
    axios(config).then(function (response) {
        const {Success, token, Items} = response.data;
        if(Success) ticket_token = token;
        // else if(!!onError) onError(Items);
        })
        .catch(function (error) {
            console.log(error);
            // onError(error);
        });//.finally(() => setLoader(false));

}

getTicketToken();

/*
{
	"itineraries":[{
		"OriginLocation":"ika",
		"DestinationLocation":"ist",
		"DepartureDate":"2021-06-25",
		"ReturnDate":null
	}],
	"ChildQuantity":0,
	"InfantQuantity":0,
	"AdultQuantity":1,
	"CabinType":3,
	"SearchType":1
}
 */
export function getSeaerch(data, setLoader, onDone, page) {
    const onError = getOnError(page);
    console.log("getSeaerch", JSON.stringify(data));
    const config = getConfig(S.flights.search, data);
    setLoader(true);
    axios(config).then(doResults(onDone, onError)).catch(err => {
        const es = err + "";
        if(es.indexOf("403") >= 0) {
            getTicketToken();
            onError("Please try again");
        } else onError(err);
    }).finally(() => setLoader(false));
}

// flight/book


export function doFlightBook(data, setLoader, onDone, page) {
    // console.log("doFlightBook");
    const onError = getOnError(page);
    const config = getConfig(S.flights.book, data);
    // console.log(config);
    setLoader(true);
    axios(config).then(({data}) => {
        console.log("data", data);
        const {Items} = data || {};
        if(!!Items && Items.length >= 1) {
            console.log("1111");
            const {Success} = Items[0];
            if(Success) onDone(data);
            else {
                console.log("333");
                if(Items && Items.length >= 1) onError(Items[0].Items);
                else onError(Items);
            }
        } else {
            console.log("222");
            onError(Items);
        }
        // onDone(data);
    }).catch(onError).finally(() => setLoader(false));
}

export function doFlightIssue(ContractNo, setLoader, onDone, page) {
    // onDone({data: "alaki"});
    // return;

    const onError = getOnError(page);


    const info = {
        ContractNo,
        Credit: true,
        Wallet: false,
        Currency: "USD"
    };

    console.log(JSON.stringify(info));

    const config = getConfig(S.flights.ticket, info, "get");
    // console.log(config);
    setLoader(true);
    axios(config).then(({data}) => {
        console.log("data", JSON.stringify(data));
        const {Items} = data || {};
        if(!!Items && Items.length >= 1) {
            console.log("1111");
            const {Success} = Items[0];
            if(Success) onDone(data);
            else {
                console.log("333");
                if(Items && Items.length >= 1) onError(Items[0].Items);
                else onError(Items);
            }
        } else {
            console.log("222");
            onError(Items);
        }
        // onDone(data);
    }).catch(onError).finally(() => setLoader(false));
}


const token_config = {
    method: 'post',
    url: `${ticketBaseUrl}/token`,
    headers: {
        'Content-Type': 'text/plain'
    },
    data: ticket_credentials
};

const getTicketTokenPromise = () => axios(token_config);
//
// export function getTicketToken(setLoader, onDone = console.log, onError = console.log) {
//     // return;
//     setLoader(true);
//     getTicketTokenPromise()
//         .then(({data}) => {
//             const {access_token} = data || {};
//             ticket_token = access_token;
//             // console.log(data);
//             onDone(access_token);
//         })
//         .catch(onError)
//         .finally(() => setLoader(false));
//
//     //axios.defaults.headers.common['x-access-token'] = token;
// }
//
// const issuedTicket = [
//     {
//         "ticketCreateDate": "2021-06-21T14:18:11.4503296+04:30",
//         "referenceCode": "J26K2J",
//         "status": "صدور بلیط",
//         "price": 10000.00,
//         "baseFare": 10000.00,
//         "discount": 0.00,
//         "totalPrice": 10000.00,
//         "totalPriceCurrencyCode": "IRR",
//         "flightRules": [],
//         "pnrRemarks": null,
//         "passengers": [
//             {
//                 "englishFirstName": "Rasoul",
//                 "englishLastName": "Jafari",
//                 "firstName": "رسول",
//                 "lastName": "جعفری",
//                 "nationalCode": "4679389427",
//                 "gender": "Mr",
//                 "eticketNumber": "102421191",
//                 "ticketCreateDate": "2021-06-21T14:18:11.4503296+04:30",
//                 "ticketCreatePersianDate": "1400/03/31",
//                 "referenceCode": "J26K2J",
//                 "baseFare": 10000.00,
//                 "totalTax": 0.00,
//                 "totalPrice": 10000.00,
//                 "ticketType": 1,
//                 "type": 0,
//                 "typeTitle": "Adult",
//                 "baggaes": [],
//                 "itineraries": [
//                     {
//                         "providerType": 4,
//                         "direction": false,
//                         "departureAirportLocationCode": "IKA",
//                         "departureAirportLocationTitle": "فرودگاه امام خمینی تهران",
//                         "departureCityTitle": "تهران",
//                         "cabinType": "Economy",
//                         "persianCabinType": "اقتصادی",
//                         "cabinCode": "IST  W5  NN6",
//                         "departureDateTime": "2021-07-19T06:50:00",
//                         "arrivalAirportLocationCode": "IST",
//                         "arrivalAirportLocationTitle": "istanbul new airport",
//                         "arrivalCityTitle": "استانبول",
//                         "arrivalDateTime": "2021-07-19T08:35:00",
//                         "elapsedTimePerMinute": 105,
//                         "stops": 0,
//                         "segments": [
//                             {
//                                 "departureAirportLocationCode": "IKA",
//                                 "departureAirportLocationTitle": "tehran imam khomeini airport",
//                                 "departureCityTitle": "تهران",
//                                 "departureAirportLocationTerminal": null,
//                                 "departureDateTime": "2021-07-19T06:50:00",
//                                 "departurePersianDate": "1400/04/28",
//                                 "departurePersianTime": "06:50",
//                                 "arrivalAirportLocationCode": "IST",
//                                 "arrivalAirportLocationTitle": "istanbul new airport",
//                                 "arrivalCityTitle": "استانبول",
//                                 "arrivalAirportLocationTerminal": null,
//                                 "arrivalDateTime": "2021-07-19T08:35:00",
//                                 "arrivalPersianDate": "1400/04/28",
//                                 "arrivalPersianTime": "08:35",
//                                 "duration": 105,
//                                 "flightNumber": "112",
//                                 "fareClass": "IST  W5  NN6",
//                                 "cabinCode": "B",
//                                 "cabinType": "Economy",
//                                 "airplaneCode": "310",
//                                 "airlineCode": "W5",
//                                 "marketingAirlineCode": "W5",
//                                 "baggages": "20 KG",
//                                 "airlineTitle": "ماهان",
//                                 "airlineEnglishTitle": "mahan air",
//                                 "airlineLogoUrl": "https://cdn01.safiran.ir/AirlineLogo/W5.png"
//                             }
//                         ]
//                     }
//                 ],
//                 "airLinePolicies": []
//             }
//         ],
//         "itineraries": [
//             {
//                 "providerType": 4,
//                 "direction": false,
//                 "departureAirportLocationCode": "IKA",
//                 "departureAirportLocationTitle": "فرودگاه امام خمینی تهران",
//                 "departureCityTitle": "تهران",
//                 "cabinType": "Economy",
//                 "persianCabinType": "اقتصادی",
//                 "cabinCode": "IST  W5  NN6",
//                 "departureDateTime": "2021-07-19T06:50:00",
//                 "arrivalAirportLocationCode": "IST",
//                 "arrivalAirportLocationTitle": "istanbul new airport",
//                 "arrivalCityTitle": "استانبول",
//                 "arrivalDateTime": "2021-07-19T08:35:00",
//                 "elapsedTimePerMinute": 105,
//                 "stops": 0,
//                 "segments": [
//                     {
//                         "departureAirportLocationCode": "IKA",
//                         "departureAirportLocationTitle": "tehran imam khomeini airport",
//                         "departureCityTitle": "تهران",
//                         "departureAirportLocationTerminal": null,
//                         "departureDateTime": "2021-07-19T06:50:00",
//                         "departurePersianDate": "1400/04/28",
//                         "departurePersianTime": "06:50",
//                         "arrivalAirportLocationCode": "IST",
//                         "arrivalAirportLocationTitle": "istanbul new airport",
//                         "arrivalCityTitle": "استانبول",
//                         "arrivalAirportLocationTerminal": null,
//                         "arrivalDateTime": "2021-07-19T08:35:00",
//                         "arrivalPersianDate": "1400/04/28",
//                         "arrivalPersianTime": "08:35",
//                         "duration": 105,
//                         "flightNumber": "112",
//                         "fareClass": "IST  W5  NN6",
//                         "cabinCode": "B",
//                         "cabinType": "Economy",
//                         "airplaneCode": "310",
//                         "airlineCode": "W5",
//                         "marketingAirlineCode": "W5",
//                         "baggages": "20 KG",
//                         "airlineTitle": "ماهان",
//                         "airlineEnglishTitle": "mahan air",
//                         "airlineLogoUrl": "https://cdn01.safiran.ir/AirlineLogo/W5.png"
//                     }
//                 ]
//             }
//         ],
//         "buyerName": "محمد داعی نژاد",
//         "buyerEmail": "mohammadhack3@gmail.com",
//         "buyerMobile": "09106020624",
//         "receiverEmail": "",
//         "invoiceId": 69936,
//         "invoiceTrackingCode": "3F1F4C27AD34",
//         "ticketType": 1
//     }
// ];
