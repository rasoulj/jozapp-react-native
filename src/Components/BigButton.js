import React from "react"
import {ActivityIndicator, View} from "react-native"
import {JCard} from "./JCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Title, useTheme, TouchableRipple} from "react-native-paper";
import {cardStyle, dprimary} from "../jozdan-common-temp/theme";

export const BigButton = ({style = {},icon, title, onPress, loader = false}) => {
    const {colors: {primary, accent}} = useTheme();

    return <TouchableRipple  onPress={onPress}>
        <JCard style={{marginTop: 4, marginBottom: 4, height: 50, ...cardStyle, flexDirection: "row", ...style}} >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderEndWidth: 1, borderEndColor: '#eee'}}>
                <Ionicons name={icon} size={30} color={primary}/>
            </View>
            <View style={{flex: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingStart: 10}}>
                <Title>{title}</Title>
                {loader ? <ActivityIndicator size={'small'} color={accent} /> : <Ionicons name="chevron-forward-outline" size={25} color="#bbb"/>}
            </View>
        </JCard>
    </TouchableRipple>;
};
