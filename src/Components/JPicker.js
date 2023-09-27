import React from "react"
import {Picker} from '@react-native-community/picker';
import {T} from "../i18n";


export const JPicker = ({onChange, value, options = [], style = {}, lang}) => <Picker
    style={style}
    selectedValue={value}
    onValueChange={onChange}>
    {options.map(({l, v}, key) => <Picker.Item key={key} label={T(l, lang)} value={v} />)}
</Picker>;


