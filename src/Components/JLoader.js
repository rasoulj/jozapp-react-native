import React from 'react';
import {View, Text, Dimensions, StyleSheet, ActivityIndicator} from "react-native"
import {useTheme} from "react-native-paper";

const {width, height} = Dimensions.get('window');

const JLoader = ({visible}) => {
    const {colors: {primary, accent}} = useTheme();

    return visible ? <View style={[styles.overlay, {backgroundColor: primary+"4f"}]}>
        <ActivityIndicator size={'large'} color={accent}/>
    </View> : null;
};

export default JLoader;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        //opacity: 0.5,
        //backgroundColor: primary,
        width, height,
        zIndex: 20000,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

