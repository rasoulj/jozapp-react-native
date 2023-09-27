import React, {useEffect, useState} from "react"
import {getParams, trimAll} from "../../utils";
import {JCard, JDatePicker, JPage, JPicker, JRadioButton, JRadioSelect} from "../../Components";
import {Button, Caption, HelperText, Text, TextInput} from "react-native-paper";
import {P, T} from "../../i18n";
import {accent, primary, secondary} from "../../jozdan-common-temp/theme";
import {useSelector} from "react-redux";
import {Platform, View} from "react-native"
import {formatDate, formatDate2, normalDateFrom, styles} from "./Airplane";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";



// const ALL_FIELDS = [
//     ["latinFirstName", "latinLastName", "firstName", "lastName", "nationalCode", "birthDay"],
//     ["latinFirstName", "latinLastName", "birthDay", "nationality", "passportIssueCountry", "passportNumber", "passportExpireDate"],
//     ["latinFirstName", "latinLastName", "birthDay", "nationalCode", "passportIssueCountry", "passportNumber", "passportExpireDate"],
// ];

const ALL_FIELDS = [
    ["latinFirstName", "latinLastName", "nationalCode", "birthDay"],
    ["latinFirstName", "latinLastName", "birthDay", "nationality", "passportIssueCountry", "passportNumber", "passportExpireDate"],
    ["latinFirstName", "latinLastName", "birthDay", "nationalCode", "passportIssueCountry", "passportNumber", "passportExpireDate"],
];


const trivialChecker = () => true;



function checkCodeMelli(code) {
    if(!code) return false;
    const L = code.length;

    if(L < 8 || parseInt(code,10) === 0) return false;
    code = ('0000' + code).substr(L+4-10);
    if(parseInt(code.substr(3,6),10) === 0) return false;
    const c = parseInt(code.substr(9, 1), 10);
    let s = 0;
    for(let i=0; i<9; i++)
        s += parseInt(code.substr(i,1),10)*(10 - i);
    s = s % 11;
    return (s < 2 && c === s) || (s >= 2 && c === (11 - s));
}

const checkName = name => !!name && name.length >= 2 && name.length <= 50;

const regName = /^[a-zA-Z]+$/;
const checkNameEn = name => checkName(name) && regName.test(name);
const checkNameFa = name => checkName(name) && !regName.test(name);

const _MS_PER_YEAR = 31556926000.0;// 1000 * 60 * 60 * 24 * 365.24;


function yearsDiff(date1, date2) {
    const a = new Date(date1);
    const b = new Date(date2);
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return ((utc1 - utc2) / _MS_PER_YEAR);
}

/*
function test_yearsDiff(d1, d2) {
    console.log("yearsDiff", d1, d2, yearsDiff(d1, d2));
}

test_yearsDiff("2023-07-21", "2020-03-20");
test_yearsDiff("2023-07-11", "2020-03-20");


function Test_checkCodeMelli(code) {
    console.log(code, checkCodeMelli(code) ? "Valid" : "Invalid");
}

Test_checkCodeMelli("4679389427");
Test_checkCodeMelli("4679425817");
Test_checkCodeMelli("4679425814");
*/


import _countries from "./countries.json"
let countries = _countries.map(p => {
    const {Code, EnglishName: l, Name} = p;
    return {v: `${Code},${l}`, l};
});

function toStr(val) {
    if(!val) return "";
    if(typeof val === "string") return trimAll(val);
    return formatDate(val);
}

function checkPassportNumber(pas) {
    if(!pas) return false;
    return pas.length >= 4;
}

const getNow = () =>  moment().format("YYYY-MM-DD");
const NowYear = new Date().getFullYear();

const checkPassportExpireDate = date => yearsDiff(date, getNow()) >= 0;

// console.log("checkPassportExpireDate", checkPassportExpireDate("2021-06-14"));

const CHECKERS = {
    latinFirstName: checkNameEn,
    latinLastName: checkNameEn,
    // birthDay: () => true,
    nationalCode: checkCodeMelli,
    firstName: checkNameFa,
    lastName: checkNameFa,
    // passportExpireDate: checkPassportExpireDate,
    passportNumber: checkPassportNumber,
};



function SelectPassenger({navigation, route}) {
    const {goBack, setOptions} = navigation;
    const {index, info, onSelect, adults, flightDate} = getParams(route, "index info onSelect adults flightDate");

    const {type} = info[index] || {type: 0};

    const [passenger, setPassenger] = useState({...info[index], parent: type === 2 ? adults[0] : null});

    const {lang} = useSelector(({pax}) => pax);

    const _val = key => passenger[key];

    const setVal = (k, v) => {
        setError({});
        setPassenger({...passenger, [k]: v});
    };

    const [error, setError] = useState({});

    const ParentOptions = (adults || []).map((adult, v) => {
        const {latinFirstName, latinLastName} = adult;
        return {v: adult, l: `${latinFirstName} ${latinLastName}`}
    });

    // const [show, setShow] = useState(0);
    // const onChangeDate = (event, selectedDate) => {
    //     const ss = show;
    //     // console.log("sel", selectedDate, typeof selectedDate);
    //     const currentDate = selectedDate;
    //     setShow(Platform.OS === 'ios' ? show : 0);
    //
    //     if(!selectedDate) return;
    //     if (ss === 1) setVal("birthDay", normalDateFrom(currentDate));
    //     else setVal("passportExpireDate", normalDateFrom(currentDate));
    // };

    const birthDay = _val("birthDay");
    // const type = _val("type");
    const passportExpireDate = _val("passportExpireDate");
    const passengerValidationType = _val("passengerValidationType");
    const parent = _val("parent");
    const setParent = v => setVal("parent", v);

    // console.log("type", type);

    const isForeigners = _val("isForeigners");

    const fieldsType = passengerValidationType === 1 ? 2 : isForeigners ? 1 : 0;
    const Fields = ALL_FIELDS[fieldsType];

    // console.log(Fields, fieldsType);

    const isVisible = field => Fields.includes(field);

    const _checkBirthDay = () => {
        // return true;
        // console.log("_checkBirthDay", bday);
        if(!birthDay) return false;
        const age = yearsDiff(flightDate, birthDay);
        console.log("age", age);
        if(type === 0) return age > 12;
        else if(type === 1) return age > 2 && age <= 12;
        else return age <= 2;
    };

    const _checkPassportExpireDate = () => yearsDiff(passportExpireDate, flightDate) >= 0;

    const _Checkers = {...CHECKERS, birthDay: _checkBirthDay, passportExpireDate: _checkPassportExpireDate};

    const _getChecker = field => _Checkers[field] || trivialChecker;

    const _checkErrors = () => {
        // console.log("----------------------------_checkErrors");
        // console.log(Fields);
        const err = {};
        Fields.forEach(field => {
            const e = !_getChecker(field)(trimAll(_val(field)));
            if(!!e) err[field] = e;
            // console.log(field, _val(field), e);
        });
        // console.log(err);

        // setError(err);
        return err;
    };

    const hasError = Object.keys(error).length > 0;

    const onSave = () => {
        const errs = _checkErrors();

        // console.log(errs);

        if(Object.keys(errs).length > 0) {
            setError(errs);
            return;
        }


        onSelect(passenger);
        goBack();
    };
    // console.log(error);


    useEffect(() => {
        setOptions({title: T("airplane.select_passenger", lang)})
    }, [lang]);


    const getPicker = (field, options) => isVisible(field) && <View style={styles.blueBox}>
        <HelperText type="info" style={{color: "grey"}} visible>{T(`airplane.${field}`, lang)}</HelperText>
        <JPicker options={options} value={_val(field)} onChange={val => setVal(field, val)} />
    </View>;

    // const adultPicker = ParentOptions.length > 0 && <View style={styles.blueBox}>
    //     <HelperText type="info" style={{color: "grey"}} visible>{T(`airplane.parent`, lang)}</HelperText>
    //     <JPicker options={ParentOptions} value={parent} onChange={setParent} />
    // </View>;

    // console.log("parent", parent);

    const getField = field => isVisible(field) && <View style={{flex: 1}}>
        <TextInput
            value={_val(field)}
            theme={{colors: {text: '#000', placeholder: accent, primary: accent}}}
            style={{backgroundColor: '#fff'}}
            error={error[field]}
            mode="outlined"
            label={T(`airplane.${field}`, lang)}
            // keyboardType="numeric"
            onChangeText={val => setVal(field, val)}
        />
        <HelperText type="error" visible={!!error[field]}>{T(`airplane.${field}.error`, lang)}</HelperText>
    </View>;

    const maxYear = type === 0 ? NowYear-12 : type === 1 ? NowYear - 2 : NowYear;
    const minYear = type === 0 ? maxYear - 100 : type === 1 ? maxYear - 10 : maxYear - 2;

    return <JPage
        footerHeight={42}
        footer={<View>
            <Button
                icon="check-bold"
                color={hasError ? secondary : accent}
                mode="contained"
                onPress={onSave}>{T("airplane.done", lang)}</Button>
        </View>}>

        {/*{show !== 0 && (*/}
        {/*    <DateTimePicker*/}
        {/*        value={(show === 1 ? birthDay : passportExpireDate) || new Date()}*/}
        {/*        mode={"date"}*/}
        {/*        is24Hour={true}*/}
        {/*        display="calendar"*/}
        {/*        onChange={onChangeDate}*/}
        {/*    />*/}
        {/*)}*/}


        <View style={{paddingHorizontal: 10}}>
            <JRadioButton visible={false} lang={lang} style={styles.box} value={isForeigners} setValue={val => setVal("isForeigners", val)} options={[
                {v: false, l: "airplane.isDomestic"},
                {v: true, l: "airplane.isForeigners"},
            ]} color={accent} />

            {/*<JRadioSelect lang={lang} style={styles.blueBox} value={isForeigners} setValue={val => setVal("isForeigners", val)} options={[*/}
            {/*    {v: false, l: "airplane.isDomestic"},*/}
            {/*    {v: true, l: "airplane.isForeigners"},*/}
            {/*]} />*/}

            <JRadioButton lang={lang} style={styles.box} value={_val("gender")} setValue={val => setVal("gender", val)} options={[
                {v: "1", l: "airplane.male"},
                {v: "0", l: "airplane.female"},
            ]} />

            {/*{adultPicker}*/}


            {getField("latinFirstName")}
            {getField("latinLastName")}
            {/*{getField("firstName")}*/}
            {/*{getField("lastName")}*/}
            {getField("nationalCode")}

            <JDatePicker
                error={error.birthDay && "airplane.birthDay.error"}
                minYear={minYear}
                maxYears={maxYear}
                title={"airplane.birthDay"}
                style={!!error.birthDay ? styles.redBox : styles.blueBox}
                value={birthDay}
                onChange={date => setVal("birthDay", date)}
                lang={lang}
            />


            {/*<View style={!!error.birthDay ? styles.redBox : styles.blueBox}>*/}
            {/*    <HelperText type="info" style={{color: "grey"}} visible>{T(`airplane.birthDay`, lang)}</HelperText>*/}
            {/*    <Button color={secondary} mode="outlined" icon="calendar" compact uppercase={false}*/}
            {/*            onPress={() => setShow(1)}>*/}
            {/*        {!birthDay ? T("airplane.birthDay", lang)+"..." : formatDate2(birthDay)}*/}
            {/*    </Button>*/}
            {/*    <HelperText type="error" visible={!!error.birthDay}>{T(`airplane.birthDay.error`, lang)}</HelperText>*/}
            {/*</View>*/}

            {/*{getPicker("nationality", countries)}*/}
            {getPicker("passportIssueCountry", countries)}

            {getField("passportNumber")}


            {/*{isVisible("passportExpireDate") && <View style={!!error.passportExpireDate ? styles.redBox : styles.blueBox}>*/}
            {/*    <HelperText type="info" style={{color: "grey"}} visible>{T(`airplane.passportExpireDate`, lang)}</HelperText>*/}
            {/*    <Button color={secondary} mode="outlined" icon="calendar-remove" compact uppercase={false}*/}
            {/*            onPress={() => setShow(2)}>*/}
            {/*        {!passportExpireDate ? T("airplane.passportExpireDate", lang)+"..." : formatDate2(passportExpireDate)}*/}
            {/*    </Button>*/}
            {/*    <HelperText type="error" visible={!!error.passportExpireDate}>{T(`airplane.passportExpireDate.error`, lang)}</HelperText>*/}
            {/*</View>}*/}


            <JDatePicker
                error={error.passportExpireDate && "airplane.passportExpireDate.error"}
                visible={isVisible("passportExpireDate")}
                minYear={NowYear}
                maxYears={NowYear+10}
                title={"airplane.passportExpireDate"}
                style={!!error.passportExpireDate ? styles.redBox : styles.blueBox}
                value={passportExpireDate}
                onChange={date => setVal("passportExpireDate", date)}
                lang={lang}
            />


        </View>

        {false && <Button onPress={() => {
            setPassenger({...passenger,
                firstName: "رسول",
                lastName: "جعفری",
                nationalCode: "4679389427",
                birthDay: "1978-07-02",
                latinFirstName: "Rasoul",
                latinLastName: "Jafari",
                "passportNumber": "18532172",
                "passportExpireDate": "2029-04-14",
            });
        }}>Fill</Button>}

        {/*<JCard visible={isForeigners}>*/}
        {/*    <Text style={styles.passenger.title}>Passport Information</Text>*/}

        {/*</JCard>*/}



    </JPage>
}

SelectPassenger.title = P("airplane.select_passenger");

export default SelectPassenger;
