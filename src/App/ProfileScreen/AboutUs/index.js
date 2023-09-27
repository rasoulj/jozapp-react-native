import React, {useState, useEffect} from "react"
import {View, Image, Linking} from "react-native";
import {Avatar, Button, Text, Title, IconButton, Colors} from "react-native-paper";
import {JPage} from "../../../Components";
import {useSelector} from "react-redux";
import {P, T} from "../../../i18n";
import {appVer} from "../../../consts";
import gStyles from "../../../utils/gStyles";
import {baseApiUrl} from "../../../utils/db_mongo";

// const webUrl = "www.nonamewallet.com";
// const supportEmail = "support@nonamewallet.com";
// const supportTel = "+964 783 170 8035";

// const {webUrl, supportEmail, supportTel} = WhiteCopyConfig[ActiveWhiteCopy];


//TODO:NOT_TRAN

function ViewSupportTel({supportTel}) {
    return !!supportTel && <View style={{flex: 2, flexDirection: 'row', marginTop: 30}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={[gStyles.text, {fontWeight: 'bold', paddingEnd: 20}]}>{supportTel}</Text>
            <IconButton color={"green"} icon="whatsapp" onPress={async () => {
                //await Linking.openURL("tel:"+supportTel)
                await Linking.openURL(Linking.openURL(`whatsapp://send?text=&phone=${supportTel}`))
            }}/>
            <IconButton color={Colors.purple600} icon="phone" onPress={async () => {
                await Linking.openURL("tel:" + supportTel)
                // await Linking.openURL(Linking.openURL(`whatsapp://send?text=&phone=${supportTel}`))
            }}/>
        </View>
    </View>
}

function AboutUs({navigation, onClose}) {
    const {lang, agency} = useSelector(({pax}) => pax);
    const {setOptions} = navigation;

    console.log("agency", agency);

    const {webUrl, supportEmail, supportTel, supportTel2, logo2} = agency || {};

    useEffect(() => {
        setOptions({title: T("profile.AboutUs", lang)});
    }, [lang]);


    // const {setOptions} = navigation;
    // const [counter, setCounter] = useState(0);
    return <JPage style={{flex: 1, alignItems: 'center'}}>
        {!!onClose && <IconButton size={32} style={{alignSelf: 'flex-end'}} color={Colors.red600} icon="close" onPress={onClose}/>}
        <Image size={148} style={{margin: 10, width: 200, height: 200, alignSelf: 'center'}}
               source={{uri: `${baseApiUrl}/${logo2}`}}/>
        <View style={{alignItems: 'center'}}>
            <Image style={{width: 200, height: 200}} source={require("../../../assests/qr-code.png")}/>
            {/*<QRCode*/}
            {/*    size={200}*/}
            {/*    value={contactUsCard}*/}
            {/*/>*/}
            {!!webUrl && <Button uppercase={false} onPress={async () => {
                const url = `http://${webUrl}`;
                if (await Linking.canOpenURL(url)) await Linking.openURL(url);
            }} style={{marginBottom: 10}}>{webUrl}</Button>}
            <Text style={{
                paddingBottom: 10,
                fontWeight: 'bold', ...gStyles.text
            }}>{T("about-us.ver", lang)} {appVer}</Text>
            {!!supportEmail && <Button uppercase={false} icon="email" onPress={async () => {
                await Linking.openURL("mailto:" + supportEmail)
            }}>{supportEmail}</Button>}
            <ViewSupportTel supportTel={supportTel} />
            <ViewSupportTel supportTel={supportTel2} />

            {/*<Headline style={{paddingBottom: 30, paddingTop: 30, ...gStyles.text}}>{T("about-us.h4", lang)}</Headline>*/}
            {/*<Title style={gStyles.text}>{T("about-us.h1", lang)}</Title>*/}
            {/*<Text>Private Group Corporation</Text>*/}
        </View>
    </JPage>;
}

AboutUs.title = P("profile.AboutUs");

export default AboutUs;


/*

return <View style={{flex: 1}}>
        <Gradient/>
        <Text>Next Page: {counter}</Text>
        <Button style={{marginTop: 100}} onPress={() => {
            setCounter(counter+1);
            setOptions({title: "Salaam: " + counter});
        }}>
            <Text>Update title</Text>
        </Button>
    </View>
 */
