import React, {useEffect} from 'react';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import Index from './src/App';
import {Provider as ReduxProvider, useDispatch} from 'react-redux';

import configureStore from "./src/redux"
import {accent, primary} from "./src/jozdan-common-temp";

import SplashScreen from 'react-native-splash-screen';

// init_db().then(() => console.log("DB loaded")).catch(console.log);



const theme = {
    ...DefaultTheme,
    mode: "exact",
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary, // "rgb(98,155,248)",// '#ff6347', //255, 99, 71
        accent,
    }
};
//"rgb(205,105,189)"


export default function Main() {
    // console.log("createOrderNo1", createOrderNo());
    // console.log("createOrderNo2", createOrderNo());
    // console.log("createOrderNo3", createOrderNo());
    // console.log("createOrderNo4", createOrderNo());
    // console.log("createOrderNo5", createOrderNo());

    useEffect(() => {

        // AsyncStorage.getItem('lang').then((value) => {
        //     //now you should forceRTL by Language and set Language in your states
        //     // if ((value === 'ar' || value === 'fa' )) {
        //     //     I18nManager.forceRTL(true);
        //     // } else {
        //     //     I18nManager.forceRTL(false);
        //     // }
        //     console.log("value", value);
        //     changeLanguage(value || "en");
        // }).done(() => {
        // });
        SplashScreen.hide()

        //
        // setTimeout(() => {
        //     SplashScreen.hide();
        // }, 1500);

    }, []);



    return <PaperProvider theme={theme}>
            <ReduxProvider store={configureStore()}>
                <Index/>
            </ReduxProvider>
        </PaperProvider>
}


// AppRegistry.registerComponent("jozapp", () => Main);
