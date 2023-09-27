import React, {useState, useEffect} from "react"
import {JCard, JPage} from "../../../Components";
import {Avatar, Caption, Colors, Headline, Text, Title, List, IconButton} from "react-native-paper";
import {useSelector} from "react-redux";
import {Linking, View} from "react-native"
import {getCurrencyName, getFlagUri, toUpperCase} from "../../../jozdan-common-temp/currency";
import {getFlagSource} from "../../../utils";
import {getChevron, P, T} from "../../../i18n";
import gStyles from "../../../utils/gStyles";
import {baseApiUrl} from "../../../utils/db_mongo";

const bold = {fontWeight: "bold", ...gStyles.text};


const TermDef = ({tid, def, lang, icon, onPress}) => <List.Item
    onPress={onPress}
    title={<Text style={bold}>{T(tid, lang)}</Text>}
    description={<Text style={[gStyles.darkText, {}]}>{def}</Text>}
    left={props => icon}
    right={props => !!onPress && <IconButton {...props} icon={getChevron()} color="#aaa" size={25} key={2} />}
/>;

const ItemView = ({item, lang, type = "branch"}) => {
    console.log(item);
    const {displayName, phone, defCurrency, address, logo2} = item || {};
    // const isBranch = type === "branch";
    return <JCard style={{marginStart: 10, padding: 10, margin: 10}}>
        <Title style={{...gStyles.text, fontSize: 24, marginVertical: 20, textAlign: 'center'}}>{displayName}</Title>
        {/*<TermDef*/}
        {/*    lang={lang}*/}
        {/*    tid="profile.UserInfo.BranchName"*/}
        {/*    def={displayName}*/}
        {/*    icon={<Avatar.Image size={48} source={getFlagSource(defCurrency)}/>}*/}
        {/*/>*/}
        {type === "branch" && <TermDef
            lang={lang}
            tid="profile.UserInfo.DefCurrency"
            def={`${toUpperCase(defCurrency)} (${getCurrencyName(defCurrency)})`}
            icon={<Avatar.Image size={48} source={getFlagSource(defCurrency)}/>}
        />}
        {type === "agency" && <TermDef
            lang={lang}
            tid="profile.UserInfo.DefCurrency"
            def={`${toUpperCase(defCurrency)} (${getCurrencyName(defCurrency)})`}
            icon={<Avatar.Image size={48} source={{uri: `${baseApiUrl}/${logo2}`}}/>}
        />}

        <TermDef
            lang={lang}
            tid="profile.UserInfo.Address"
            def={address}
            icon={<Avatar.Icon size={48} icon="city" color={Colors.green600} style={{backgroundColor: '#eee'}} />}
        />
        <TermDef
            lang={lang}
            tid="profile.UserInfo.Phone"
            def={phone}
            icon={<Avatar.Icon size={48} icon="phone" color={Colors.purple600} style={{backgroundColor: '#eee'}} />}
            onPress={async () => {
                await Linking.openURL("tel:"+phone);
            }}
        />
    </JCard>
};

function UserInfo({navigation}) {

    const {setOptions, navigate} = navigation;

    const {branch, lang, user, agency} = useSelector(({pax}) => pax);
    console.log("user", user);
    useEffect(() => {
        setOptions({title: T("profile.BranchInfo", lang)});
    }, [lang]);

    return <JPage>
        {/*<ItemView item={user} lang={lang} type="user" />*/}
        {/*<Title style={[gStyles.text, {textAlign: 'center', marginTop: 30}]}>{T("profile.BranchInfo", lang)}</Title>*/}
        <ItemView item={branch} lang={lang} type="branch"/>
        {/*<ItemView item={agency} lang={lang} type="agency"/>*/}

    </JPage>;
}

UserInfo.title = P("profile.UserInfo");

export default UserInfo;
