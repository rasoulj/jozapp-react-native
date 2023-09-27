import {P} from "../../i18n";
import {JCard, JPage} from "../../Components";
import React, {useEffect, useState} from "react";
import {Button, Text, Colors, Title, Card} from "react-native-paper";
import {createOtp} from "../../utils/db_mongo";
import gStyles from "../../utils/gStyles";
import {View} from "react-native"
import Clipboard from '@react-native-community/clipboard';
import TouchableRipple from "react-native-paper/src/components/TouchableRipple/TouchableRipple.native";
import {setValues} from "../../redux/actions";
import {useDispatch} from "react-redux";

const MAX_COUNT = 120;
const DELAY = 1000;

function zeroPad(count) {
    if(count < 10) return `00${count}`;
    if(count < 100) return `0${count}`;
    return count+"";
}

function getColor(count) {

    if(count < 15) return Colors.black;
    if(count < 30) return Colors.red600;
    if(count < 60) return Colors.orange600;
    return Colors.green600;
}

function CountDown({count}) {
    return <JCard visible={count > 0} style={{flex: 1, alignItems: 'center'}}>
        <Text style={gStyles.text}>Timeout:</Text>
        <Text style={{...gStyles.text, fontFamily: "courier", fontSize: 40, fontWeight: "bold", color: getColor(count)}}>{zeroPad(count)}</Text>
    </JCard>
}

function Otp({navigation, route}) {

    const [loader, setLoader] = useState(false);
    const [pass, setPass] = useState("");
    const [count, setCount] = useState(MAX_COUNT);

    const dispatch = useDispatch();

    const setNotif = notif => dispatch(setValues({notif}));


    const loadOtp = () => createOtp(setLoader, console.log, ({otp}) => {
       setPass(otp);
       if(count <= 0) setCount(MAX_COUNT);
    });


    useEffect(() => {
        if(count <= 0) return;
        setTimeout(() => setCount(count - 1), DELAY);
    }, [count]);

    useEffect(() => loadOtp(), []);

    return <JPage footer={count <= 0 && <Button
        mode="contained"
        loading={loader}
        icon="form-textbox-password"
        color={Colors.blueA700}
        onPress={loadOtp}>Create New OTP</Button>
    }>
        <JCard visible={count > 0} style={{flex: 1, alignItems: 'center'}}>
            <Text style={gStyles.text}>OTP (Click to copy)</Text>
            <TouchableRipple onPress={() => {
                Clipboard.setString(pass+"");
                setNotif({title: pass+"", body: `Copied to clipboard`});
            }}>
                <Text style={{...gStyles.text, fontSize: 32, fontWeight: "bold"}}>{pass}</Text>
            </TouchableRipple>
        </JCard>
        <JCard visible={count <= 0} style={{flex: 1, alignItems: 'center'}}>
            <Text style={{...gStyles.text, fontSize: 18, fontWeight: "bold", margin: 20}}>No valid OTP available</Text>
        </JCard>
        <CountDown count={count} />



        {/*<Button style={{marginTop: 20}} disabled={false} icon={"done"} color={Colors.green} mode="contained" onPress={loadOtp}>*/}
        {/*    Done*/}
        {/*</Button>*/}
    </JPage>
}

Otp.title = P("services.otp");

export default Otp;
