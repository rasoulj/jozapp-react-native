import React from "react"
import {ActivityIndicator, Caption, Card, Colors, List} from "react-native-paper";
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/TouchableRipple.native";
import {accent, primary, secondary} from "../jozdan-common-temp/theme";


export function LoaderMini({visible = true, title = "", onPress, loader = false}) {
    if(!visible) return null;
    if(loader) return  <ActivityIndicator style={{paddingVertical: 16}} animating={true} color={accent} />;
    const sta = !onPress;
    const inner = <Caption style={{alignSelf: 'center', paddingVertical: 16, color: sta ? 'gray' : accent}}>{title}</Caption>;
    if(sta) return inner;
    else return <TouchableRipple onPress={onPress}>{inner}</TouchableRipple>;
}

export function NoData({visible = true, loader = false, message = "No Data", icon = "alert"}, onPress = () => {}) {
    return <LoaderMini visible={visible} loader={loader} title={message} onPress={onPress} />
}

