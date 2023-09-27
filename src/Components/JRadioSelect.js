import {JCard} from "./JCard";
import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Button, Caption, HelperText, RadioButton, ToggleButton} from "react-native-paper";
import {T} from "../i18n";
import {JPicker} from "./JPicker";
import moment from "moment";
import HelperError from "./HelperError";
import {accent, secondary} from "../jozdan-common-temp/theme";

const pickerCaption = {color: "blue", marginTop: 10, marginLeft: 10};

const style = {flex: 1, flexDirection: 'row', verticalAlign: 'center'};

function JRadio({value, title, index, setValue}) {
    const onPress = () => setValue(index);
    const checked = value === index;
    return <View style={style}>
        <RadioButton
            uncheckedColor={"grey"}
            color={"blue"}
            value={value}
            status={checked ? "checked" : "unchecked"}
            onPress={onPress}
        />
        <Button color={checked ? "blue" : "grey"} onPress={onPress}>{title}</Button>
    </View>;
}


export function JRadioSelect({value, setValue, options, style = {}, lang}) {
    return <JCard style={style}>
        {options.map((p, i) => <JRadio index={p.v} title={T(p.l, lang)} value={value} setValue={setValue} key={i}/>)}
    </JCard>
}

export function JRadioButton({visible = true, value, setValue, options, style = {}, lang, color = secondary, title, icon = null}) {
    return visible && <View style={style}>
        {!!title && <Caption style={pickerCaption}>{title}</Caption>}
        <View style={{flex: options.length, flexDirection: "row"}}>
            {options.map((p, i) => {
                const sel = p.v === value;
                return <View key={`key${i}`} style={{flex: 1}}>
                    <Button
                        icon={sel ? icon : null}
                        style={{borderColor: color}}
                        mode={sel ? "contained" : "outlined"}
                        onPress={() => setValue(p.v)}
                        color={color}>{T(p.l, lang)}</Button>
                </View>;
            })}
        </View>
    </View>
}


function getDateOptions(title, from, to, tran = p => p + "") {
    let options = [{l: title, v: -1}];
    for (let i = from; i <= to ; i++) {
        options.push({l: tran(i), v: i});
    }
    return options;
}

const monthNames2 = ["airplane.date.months", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const monthNames = ["airplane.date.months", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Months = getDateOptions("airplane.date.months", 1, 12);//, p => monthNames[p]);

function p2(a) {
    if (a < 10) return "0" + a;
    else return a
}

function daysInMonth(year, month) {
    console.log("month, year", month, year);
    return new Date(year, month, 0).getDate();
}

export function JDatePicker({title, value, onChange, lang, style = {}, minYear = 2021, maxYears = 2, visible = true, error = null}) {
    // const [Years, setYears] = useState([]);

    const [Years, setYears] = useState([]);
    const [Days, setDays] = useState([]);

    const [values, setValues] = useState([-1, -1, -1]);

    useEffect(() => {
        setYears(getDateOptions("airplane.date.years", minYear, maxYears))
    }, [minYear, maxYears]);
    useEffect(() => {
        setDays(getDateOptions("airplane.date.days", 1, daysInMonth(values[0], values[1])))
    }, [values[0], values[1]]);


    useEffect(() => {
        const vals = (value || "").split("-");
        if (vals.length !== 3) return;
        setValues(vals.map(p => 1 * p));
    }, [value]);


    const _onChange = (index, value) => {
        const v = [...values];
        v[index] = value;
        setValues(v);
        if (v.includes(-1)) return;
        onChange(v.map(p => p2(p)).join("-"));
    };

    const _desc = values.includes(-1) ? "" : `(${moment(values.map(p => p2(p)).join("-")).format("ll")})`;


    return visible && <JCard style={style}>
        <HelperText type="info" style={{color: "grey"}} visible>{T(title, lang)} <HelperText type="info"
                                                                                             style={{color: "green"}}
                                                                                             visible>{_desc}</HelperText></HelperText>
        <View style={{flex: 3, flexDirection: "row"}}>
            <JPicker lang={lang} style={{flex: 1}} options={Days} value={values[2]} onChange={d => _onChange(2, d)}/>
            <JPicker lang={lang} style={{flex: 1}} options={Months} value={values[1]} onChange={d => _onChange(1, d)}/>
            <JPicker lang={lang} style={{flex: 1}} options={Years} value={values[0]} onChange={d => _onChange(0, d)}/>
        </View>
        <HelperError lang={lang} error={error}/>
    </JCard>
}
