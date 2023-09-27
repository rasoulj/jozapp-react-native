import React from "react"
import {Button, Colors} from "react-native-paper";
import {T} from "../../../i18n";
import {useSelector} from "react-redux";

export function ConfirmButton({loader, stage, onPress, error = false}) {
    const {lang} = useSelector(({pax}) => pax);
    return <Button
        loading={loader}
        disabled={error}
        icon={ stage === 0 ? "alert-circle-check-outline" : "check"}
        color={stage === 0 ? Colors.lightGreen300 : Colors.green600} mode="contained" onPress={onPress}>
        {T(stage === 0 ? "wallet.Confirm" : "wallet.Done", lang)}
    </Button>;
}
