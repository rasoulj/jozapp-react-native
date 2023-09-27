import React, {useEffect, useState} from "react"
import {JPage} from "../../../Components";
import {Button, Card, Colors, Paragraph, Title} from "react-native-paper";
import {getNetError, getParams} from "../../../utils";
import {getCurrencyName} from "../../../jozdan-common-temp/currency";
import {OrdersInfo} from "./info";
import {commafy, randomInt} from "../../../jozdan-common-temp/utils";
import {useDispatch, useSelector} from "react-redux";
import {blockAmount, saveOrder} from "../../../utils/db_mongo";
import {ConfirmButton} from "./ConfirmButton";
import {getScreen} from "../index";
import {dprimary} from "../../../jozdan-common-temp/theme";
import {T} from "../../../i18n";
import {OrderTypes} from "jozdan-common";
import gStyles from "../../../utils/gStyles";
import {useNetInfo} from "@react-native-community/netinfo";
import {setValues} from "../../../redux/actions";

const styles = {
    card: {marginVertical: 15},
    command: {flex: 1, margin: 1}
};

function ConfirmBox({type, cur, amount, stage}) {
    const {title: tt, icon, color, target} = OrdersInfo[type];
    const {lang} = useSelector(({pax}) => pax);

    const title = T(tt, lang);

    const backgroundColor = stage === 0 ? dprimary : Colors.green200;

    return <Card style={[styles.card, {backgroundColor}]}  >
        {/*<Card.Title title="Current" subtitle="Card Subtitle"/>*/}
        {/*<Card.Title title="Current" subtitle="Card Subtitle"/>*/}
        {stage === 0 && <Card.Content>
            <Paragraph style={gStyles.text}>{T("wallet.ex_info2", lang)}</Paragraph>
            <Title style={gStyles.text}>{title} {commafy(amount)} {getCurrencyName(cur)}</Title>
        </Card.Content>}

        {stage === 1 && <Card.Content>
            <Paragraph style={gStyles.text}>{T("wallet.Completed", lang)}</Paragraph>
            <Title style={gStyles.text}>{T("wallet.tw_done", lang)}</Title>
        </Card.Content>}


    </Card>;

}


function TopupWithdrawConfirm({navigation, route}) {

    const {setOptions, navigate} = navigation;

    const params = getParams(route, "type cur amount back wid");
    const {user, lang} = useSelector(({pax}) => pax);

    const {title: tt} = OrdersInfo[params.type];
    const title = T(tt, lang);

    useEffect(() => {
        setOptions({title: `${T("wallet.Confirm", lang)} ${title}`});
    }, [lang]);

    const [loader, setLoader] = useState(false);
    const [stage, setStage] = useState(0);

    const {isConnected} = useNetInfo();
    const dispatch = useDispatch();
    const showError = () => dispatch(setValues(getNetError(lang)));


    const error = false;
    const confirmAction = () => {
        if(!isConnected) {
            showError();
            return;
        }

        if(stage === 1) {
            navigate(params.back, {screen: getScreen(params.back)});
            return;
        }

        saveOrder(user, params, setLoader, () => {
            // console.log(params);
            const {type} = params || {};
            if(type === OrderTypes.withdraw) {
                blockAmount(params, setLoader, () => {
                    setStage(1);
                }, console.log)
            } else setStage(1);
        }, console.log);

    };
    return <JPage>
        <ConfirmBox {...params} stage={stage} />
        <ConfirmButton stage={stage} loader={loader} onPress={confirmAction} />
    </JPage>;
}

TopupWithdrawConfirm.title = "TopupWithdrawConfirm";
export default TopupWithdrawConfirm;
