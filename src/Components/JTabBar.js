import React from "react"
import {Dimensions, View, Image} from "react-native"
import {Button, Caption, IconButton, Text} from "react-native-paper";
import {secondary} from "../jozdan-common-temp/theme";
import {T} from "../i18n";

const styles = {
    viewStyle: {
        flex: 1,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        // alignContent: 'center',
        borderBottomWidth: 5,
        borderRightWidth: 1,
        borderBottomEndRadius: 10,
    },
    text1: {textAlign: 'center', color: secondary, fontWeight: 'bold'},
    text2: {textAlign: 'center', color: 'grey'},
    text3: {textAlign: 'center', color: 'green'},
};

function TabButton({tab, disabled, lang}) {
    const {title} = tab;
    const color = disabled ? "grey" : secondary;
    const borderBottomColor = disabled ? "#eee" : color;
    return <View style={{...styles.viewStyle, borderBottomColor, borderRightColor: borderBottomColor}}>
        <Caption style={disabled ? styles.text2 : styles.text1}>{T(title, lang)}</Caption>
    </View>
}

export function JTabBar({tabs = [], index, lang}) {
    if(!tabs) return <View/>;
    const tabsLen = tabs.length;
    return <View style={{flex: tabsLen, flexDirection: 'row'}}>
        {tabs.map((tab, key) => <TabButton lang={lang} tab={tab} key={key} disabled={index < key} />)}
    </View>
}
