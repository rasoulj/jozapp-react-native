import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from "react-redux";

import WalletScreen from "./WalletScreen"
import ServicesScreen from "./ServicesScreen"
import TransactionsScreen from "./TransactionsScreen"
import ProfileScreen from "./ProfileScreen"


import Auth from "./Auth";
import {Caption, Colors, Modal, Snackbar, Text, Title, useTheme} from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import {accent, secondary, primary} from "../jozdan-common-temp/theme";
import {Notifications} from 'react-native-notifications';
import {setValues} from "../redux/actions";
import {getItem, init_db} from "../utils/local_db";
import {getInitState} from "../redux/reducers/pax";
import {TouchableWithoutFeedback, View, StyleSheet} from "react-native"

import {changeLanguage, T} from "../i18n"
import {SelectLang} from "./ProfileScreen/UserSettings";
import Register from "./Auth/Register";

// changeLanguage(getItem("lang", "fa"));


// console.log("login:", T("login"));

const Tabs = {
    WalletScreen,
    ServicesScreen,
    TransactionsScreen,
    ProfileScreen,
};

const Tab = createBottomTabNavigator();

export default function Index({navigation}) {



    const {user, lang, notif = {}, openRegister, agency} = useSelector(({pax}) => pax);

    // console.log("lang", lang);

    // useEffect(() => {
    //     changeLanguage(lang);
    // }, [lang]);

    // const [visible, setVisible] = React.useState(false);
    // const [notif, setNotif] = React.useState({title: "", body: ""});

    // const onToggleSnackBar = () => setVisible(!visible);

    const setNotif = notif => dispatch(setValues({notif}));
    const visible = !!notif;

    const onDismissSnackBar = () => setNotif(undefined);


    // console.log("User-user", user, getItem("user"));

    // const {colors: {accent: primary}} = useTheme();

    const dispatch = useDispatch();

    useEffect(() => {
        init_db().then(() => {
            const init = getInitState();

            dispatch(setValues(init));

            const lang = getItem("lang", "fa");
            // console.log("lang-lang-init_db", init["user"]);
            changeLanguage(lang);
        }).catch(err => {
            console.log("salaam");
            console.log(err);
        });


    }, []);

    useEffect(() => {
        changeLanguage(lang);
    }, [lang]);

    useEffect(() => {

        Notifications.registerRemoteNotifications();

        Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
            const {payload: {["gcm.notification.title"]: title, ["gcm.notification.body"]: body}} = notification;
            console.log(`Notification received in foreground: ${title} ${body}`);
            setNotif({title, body});
            // setVisible(true);
            completion({alert: true, sound: true, badge: false});
        });

        Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
            console.log(`Notification opened: ${notification.payload}`);
            completion();
        });

        Notifications.registerRemoteNotifications();

        Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
            console.error(event);
        });

        Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
            const {deviceToken: token} = event || {};
            const {token: utoken} = user || {};
            if(token !== utoken || !utoken) dispatch(setValues({token}));
        })
    }, [lang]);

    // if(!lang) return <SelectLang />;
    if(openRegister) return <Register agency={agency} />;

    // console.log("lang", lang);

    if (!user) {
        console.log("user2", user);
        return <Auth lang={lang} />;
    }

    // console.log("BUGGGG", user);


    const {title, body} = notif;


    return <NavigationContainer lang={lang}>
        <Snackbar
            style={{backgroundColor: '#000', zIndex: 10000}}
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'OK',
                onPress: () => {
                    // console.log("Ssss")
                    setNotif(undefined);
                },
            }}>
            <View style={{flex: 1}}>
                <Text style={{color: Colors.amber600}}>{title}</Text>
                <Caption style={{color: Colors.white}}>{body}</Caption>
            </View>
        </Snackbar>
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    const {icon1, icon2} = Tabs[route.name];
                    let iconName = focused ? icon1 : icon2;
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
            })}
            tabBarOptions={{
                activeTintColor: secondary,// 'tomato',
                inactiveTintColor: "gray",
            }}
        >
            {Object.keys(Tabs).map(tabName => {
                const tab = Tabs[tabName];
                const {title} = tab;
                return <Tab.Screen lang={lang} key={tabName} options={{title: T(title, lang)}} name={tabName} component={tab}/>;
            })}

        </Tab.Navigator>
    </NavigationContainer>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    modal: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
});
