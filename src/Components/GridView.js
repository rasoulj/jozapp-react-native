import React from "react"
import {Dimensions, View, Image} from "react-native"
import {chunck} from "../jozdan-common-temp/utils";
import {JCard} from "./JCard";
import {Text, Title, Avatar} from "react-native-paper";
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/TouchableRipple.native";
import {T} from "../i18n";
import {useSelector} from "react-redux";
import gStyles from "../utils/gStyles";
import AvatarImage from "react-native-paper/src/components/Avatar/AvatarImage";
import {baseApiUrl} from "../utils/db_mongo";

const {width: W, height: H} = Dimensions.get('window');
const M = 10;

export function GridView({
                             data = [],
                             cols = 3,
                             onPress = () => {
                             },
    renderNoContent = null

                         }) {

    const width = (W - (cols + 1) * M) / cols;
    const {lang} = useSelector(({pax}) => pax);

    // console.log(`${baseApiUrl}/${data[0].logo2}`);

    const renderItem = ({title, icon, color, url}) => <JCard
        style={{width, height: width, justifyContent: 'center', alignItems: 'center'}}>
        {!url ? <Avatar.Icon
            size={width * .6}
            icon={icon}
            color={color}
            style={{backgroundColor: "#eee", marginBottom: 5}}
        /> : <Image

            source={{uri: baseApiUrl + "/" + url}}
            size={width * .6}
            icon={icon}
            color={color}
            style={{marginBottom: 5, width: 0.8 * width, height: 0.8 * width}}
        />}
        {!!title && <Text style={{fontWeight: "bold", ...gStyles.text}}>{T(title, lang)}</Text>}
    </JCard>;

    if(!data || data.length === 0) {
        if(renderNoContent) return renderNoContent();
    }

    return <View style={{flex: 1, marginStart: M}}>
        {chunck(data, cols).map((row, x) => <View key={x} style={{flex: cols, flexDirection: "row"}}>
                {row.map((col, y) => {
                    return <TouchableRipple key={y} onPress={() => {
                        console.log(col);
                        return onPress(col);
                    }}>
                        {renderItem(col)}
                    </TouchableRipple>;
                })}
            </View>
        )}
    </View>
}
