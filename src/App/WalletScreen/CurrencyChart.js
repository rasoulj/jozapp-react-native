import React from "react"
import {View, Dimensions} from "react-native";
import {Text} from "react-native-paper";
import {LineChart} from "react-native-chart-kit";
import {addDays, getPastDays, range, toTwoDigit} from "../../jozdan-common-temp/utils";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CurrencyDef} from "../../jozdan-common-temp/currency";
import {dprimary, primary} from "../../jozdan-common-temp/theme";

//TODO:NOT_TRAN

const {width} = Dimensions.get("window");

export const CurrencyChart1 = ({color = [0, 0, 128]}) => <View style={{zIndex: 3, position: "relative"}}>
    <View style={{zIndex: 5, bottom: 0, left: -30}}>
    <LineChart
        withInnerLines={false}
        withHorizontalLines={false}
        withVerticalLines={false}
        yAxisLabel={null}
        withDots={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        // renderDots={() => null}
        data={{
            //labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
                {
                    data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100
                    ]
                }
            ]
        }}
        width={width-40} // from react-native
        height={80}
        //yAxisLabel="$"
        //yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
            horizontalOffset: 0,
            verticalOffset: 0,
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
            // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                //borderRadius: 16
            },
            propsForVerticalLabels: {width: 0}
            // propsForDots: {
            //     r: "6",
            //     strokeWidth: "2",
            //     stroke: "#ffa726"
            // }
        }}
        bezier
        style={{
            // marginTop: 8,
            // borderRadius: 16
        }}
    />
    </View>
</View>;

const floatStyles = {
    float: {flex: 1, flexDirection: 'row', top: 10, left: width/2-40, zIndex: 3000, position: 'absolute', justifyContent: 'center'},
    pos: {color: "green"},
    neg: {color: "red"},
};
/**
 * @return {boolean}
 */
function RateText({data, len}) {
    if(!data || data.length !== len) return null;
    const first = data[0];
    const last = data[len-1];
    if(first === 0 || last === 0) return null;
    const rate = 100*(last - first) / first;

    return <View style={floatStyles.float}>
        <Text style={rate > 0 ? floatStyles.pos : floatStyles.neg}>%{rate > 0 ? toTwoDigit(rate) : "("+toTwoDigit(-rate)+")"}</Text>
        <Icon size={20} color={rate > 0 ? 'green' : 'red'} name={rate > 0 ? "menu-up" : "menu-down"} />
    </View>

}


const FILLED_H = new Array(366).fill(-1.0);
function initH() {
    let H = {};
    for(const cur in CurrencyDef) {
        H[cur] = FILLED_H;
    }
    return H;
}
const INIT_H = initH();


export const CurrencyChart = ({color = [0, 0, 128], rates = {}, cur, interval = 1, len = 5, visible = true}) => {
    if(!visible) return false;
    try {
        // const {b, s} = rates[walletType] || {b: 1, s: 1} ;
        const {H = {}} = rates;

        const histData = (H || INIT_H)[cur];
        const f = (histData || []).filter((p, index) => index % interval === 0).slice(0, len).map(p => p < 0 ? 0 : p);
        // console.log("data-f", getDays(7, 5));
        // console.log("f", f);
        // console.log("getPastDays(interval, len)", getPastDays(interval, len));

        if(!f || f.length === 0) return null;

        return <View style={{position: 'relative'}}>
            <RateText data={f} len={len} />
            {<LineChart
                //withInnerLines={false}
                // withHorizontalLines={false}
                // withVerticalLines={false}
                // yAxisLabel={null}
                // withDots={false}
                withVerticalLabels
                withHorizontalLabels

                data={{
                    labels: getPastDays(interval, len),
                    datasets: [{data: f.reverse()}]
                }}
                width={width - 23} // from react-native
                height={170}
                // yAxisLabel="$"
                // yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    horizontalOffset: 0,
                    verticalOffset: 0,
                    backgroundColor: dprimary,
                    backgroundGradientFrom: dprimary,
                    backgroundGradientTo: dprimary,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
                    // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        //borderRadius: 16
                    },
                    propsForVerticalLabels: {width: 0}
                    // propsForDots: {
                    //     r: "6",
                    //     strokeWidth: "2",
                    //     stroke: "#ffa726"
                    // }
                }}
                bezier
                style={{
                    marginTop: 8,
                    left: -16,
                    bottom: 0,
                    margin: 0
                    // borderRadius: 16
                }}
            />}
        </View>;
    } catch (e) {
        console.log(e);
        return <View/>;
    }
};
