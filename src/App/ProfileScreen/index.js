import React, {useState, useEffect} from "react"
import {Text, Title, IconButton, useTheme, Colors, Caption, Snackbar} from "react-native-paper";
import {useSelector, useDispatch} from "react-redux";
import {setValues, signOut} from "../../redux/actions";
import {View} from "react-native"
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import root from "../root"
import {BigButton, GridView, JPage, ToastTypes} from "../../Components";
import {stdCustomerNumber} from "../../jozdan-common-temp/account";
import {encodeWID} from "../../jozdan-common-temp/currency";
import AboutUs from "./AboutUs";
import UserSettings from "./UserSettings";
import WalletInfo from "./WalletInfo";
import UserInfo from "./UserInfo";
import ChangePassword from "./UserSettings/ChangePassword";
import Share from 'react-native-share';

import {secondary} from "../../jozdan-common-temp/theme";
import {P, T} from "../../i18n";
import gStyles from "../../utils/gStyles";
// import UserInfo as UInfo  from "./WalletInfo";



function UInfo(props) {
    const {colors: {primary, accent}} = useTheme();

    const {user, lang} = useSelector(({pax}) => pax);

    const [url, setUrl] = useState();

    const {displayName, address, wid} = user;

    let svg;

    // const [visible, setVisible] = React.useState(false);
    // const [{title, body}, setNotif] = React.useState({title: "", body: ""});

    const dispatch = useDispatch();

    const setNotif = notif => dispatch(setValues({notif}));

    // const onDismissSnackBar = () => setVisible(false);


    return <View style={{flex: 3, flexDirection: 'row', margin: 20}}>
        {/*<Snackbar*/}
        {/*    style={{backgroundColor: '#000'}}*/}
        {/*    duration={2000}*/}
        {/*    visible={visible}*/}
        {/*    onDismiss={onDismissSnackBar}*/}
        {/*    action={{*/}
        {/*        label: 'OK',*/}
        {/*        onPress: onDismissSnackBar,*/}
        {/*    }}>*/}
        {/*    <View style={{flex: 1}}>*/}
        {/*        <Text style={{color: Colors.amber600}}>{title}</Text>*/}
        {/*        <Caption style={{color: Colors.white}}>{body}</Caption>*/}
        {/*    </View>*/}
        {/*</Snackbar>*/}
        <View style={{justifyContent: 'center', flex: 1}}>
            <QRCode
                getRef={c => (svg = c)}
                value={encodeWID(wid)} backgroundColor="#fff" color={'#000'} />
        </View>

        <View style={{justifyContent: 'space-between', alignItems: 'center', flex: 2, flexDirection: 'row'}}>
            <View style={{flex: 1.5, justifyContent: 'flex-end'}}>
                <Title style={gStyles.text}>{T("profile.your_wallet_no", lang)}</Title>
                <Text style={gStyles.text}>{stdCustomerNumber(wid)}</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'flex-end'}}>
                <IconButton onPress={() => {
                    svg.toDataURL(data => {
                        // setUrl(`data:image/png;base64,${data}`);
                        // console.log(data);
                        let shareImageBase64 = {
                            title: T("profile.share_wallet_info", lang),
                            url: `data:image/png;base64,${data}`,
                            subject: 'Share Link', //  for email
                            message: `${T("profile.my_wallet_is", lang)}: ${stdCustomerNumber(wid)}`
                        };
                        Share.open(shareImageBase64).catch(error => console.log(error));
                    })
                }} icon="share-variant" size={30} color={secondary} style={{margin: 0}} />
                <IconButton
                    onPress={() => {
                        const ww = stdCustomerNumber(wid);
                        Clipboard.setString(ww);
                        setNotif({title: ww, body: `Copied to clipboard`});
                        //setVisible(true);
                    }}
                    icon="content-copy" size={30} color={accent} style={{margin: 0}} />
            </View>

        </View>
        {/*<Avatar.Image source={{uri: url}} size={50}/>*/}

    </View>
}

const ITEMS = [
    {icon: "bank", title: ("profile.BranchInfo"), page: "UserInfo", color: Colors.purple600},
    {icon: "lock", title: ("profile.ChangePassword"), page: "ChangePassword", color: Colors.amber600},
    {icon: "cog", title: ("profile.UserSettings"), page: "UserSettings", color: Colors.green600},
    {icon: "information", title: ("profile.AboutUs"), page: "AboutUs", color: Colors.blue600},
    {icon: "logout", title: ("profile.logout"), color: Colors.red600},
];

function Profile({navigation}) {
    const {setOptions, navigate} = navigation;
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(0);
    const [snack, setSnack] = useState(undefined);
    const {lang} = useSelector(({pax}) => pax);

    useEffect(() => {
        setOptions({title: T("profile", lang)})
    }, [lang]);

    const types = {
        1: ToastTypes.default,
        2: ToastTypes.info,
        3: ToastTypes.danger,
        4: ToastTypes.success,
    };

    const busy = index => () => {
        page.setToast("Salaam: "+index, types[index]);
        setLoader(index);
        setTimeout(() => setLoader(0), 3000);
    };

    let page;// = React.createRef();

    // React.RefObject<JPage> page;

    const onPress = async ({page}) => {
        if (!page) {
            try {
                //TODO: await auth.signOut();
                dispatch(signOut());
            } catch (e) {
                console.log(e)
            }
        } else navigate(page, {screen});
    };


    return <JPage ref={ref => page = ref}>

        <UInfo/>

        <GridView cols={2} data={ITEMS} onPress={onPress} />

        {/*<BigButton icon="person-outline" title="Registration info" onPress={() => dispatch(setValues({notif: {body: "Salaam", title: "Aleik"}}, true))} loader={loader === 1} />*/}
        {/*<BigButton icon="wallet-outline" title="Change password" onPress={() => navigate("ChangePassword", {screen})} loader={loader === 2} />*/}
        {/*<BigButton icon="settings-outline" title="Settings" onPress={() => navigate("UserSettings", {screen})} loader={loader === 3} />*/}
        {/*<BigButton icon="information-circle-outline" title="About us" onPress={() => navigate("AboutUs", {screen})} />*/}
        {/*<BigButton icon="log-out-outline" title="Sign out" onPress={async () => {*/}
        {/*    try {*/}
        {/*        await auth.signOut();*/}
        {/*        dispatch(signOut());*/}
        {/*    } catch (e) {*/}
        {/*        console.log(e)*/}
        {/*    }*/}
        {/*}} />*/}

    </JPage>;

}

Profile.title = P("profile.my");
// Profile.subtitle = "Test it!";


const pages = {
    Profile,
    AboutUs,
    UserSettings,
    ChangePassword,
    UserInfo,
    WalletInfo
};

const Screen = () => root({pages});

Screen.title = ("profile");
Screen.icon1 = 'person';
Screen.icon2 = 'person-outline';

//<ion-icon name="person-outline"></ion-icon>

export default Screen;
export const screen = Object.keys({ProfileScreen: Screen})[0];




