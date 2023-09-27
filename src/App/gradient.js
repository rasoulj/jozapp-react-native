import React from "react"
import {Dimensions, View} from "react-native"
// import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from "react-native-paper";
const height = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';

// const LinearGradient = View;

export default () => {
    const {colors: {primary, accent}} = useTheme();
    return <LinearGradient
        // Background Linear Gradient
        colors={[`${primary}2f`, `${accent}2f`]} // primary + "00"]}
        style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height,
        }}
    />;
};
