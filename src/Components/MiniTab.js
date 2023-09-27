import React from "react"
import {View, TouchableOpacity} from "react-native"
import {Button, Caption, Text, Title} from "react-native-paper";
import {accent, primary, secondary} from "../jozdan-common-temp/theme";
import {P, T} from "../i18n";

const styles = {
    main: {flex: 1, flexDirection: "row", justifyContent: 'flex-end', alignSelf: 'center'},
    item: {paddingHorizontal: 2, margin: 0},
    selected: {
        color: secondary,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: secondary,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        textAlign: 'center'
    },
    normal: {color: "#777", textAlign: 'center', paddingHorizontal: 10},
    asli: {justifyContent: "space-between", flex: 1, flexDirection: "row"}
};

export function MiniTab({title, options, onChange, value, style = {}}) {
    const tt = typeof title;
    return <View style={styles.asli}>
        <View style={{alignSelf: 'center'}}>{tt === "string" ?<Caption>{title}</Caption> : title}</View>
        <View style={{...styles.main, ...style}}>
        {(options || []).map(({v, l}) => <TouchableOpacity style={styles.item} key={v} onPress={() => onChange(v)}>
            <Text style={v === value ? styles.selected : styles.normal}>{P(l)}</Text>
        </TouchableOpacity>)}
    </View>
    </View>
}


