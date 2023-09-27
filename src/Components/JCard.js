import React from "react"
import {View} from "react-native";
import {borderColor, cardStyle} from "../jozdan-common-temp/theme";

export const JCard = ({children, style = {}, visible = true}) => visible && <View elevation={0} style={{
    // justifyContent: 'center',
    // position: 'absolute',
    ...cardStyle,
    borderRadius: 15,
    // borderColor: '#000',
    // top: 200,
    // left: 50,
    // right: 50,
    // bottom: 50,
    // backgroundColor: 'rgba(255,255,255,0.9)',
    // zIndex: 1000,
    shadowColor: borderColor,
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
        height: 1,
        width: 1
    },
    padding: 5,
    marginBottom: 2,
    marginEnd: 3,
    ...style
}}>
    {children}
</View>;

