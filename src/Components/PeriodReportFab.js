import React, {useState} from "react"
import {FAB, Portal} from "react-native-paper";

export const PERIOD_REPORT_OPTIONS = [
    {icon: 'calendar-today', label: 'Daily', value: 1},
    {icon: 'calendar-today', label: 'Weekly', value: 7},
    {icon: 'check', label: '2 Week', value: 14},
    {icon: 'calendar-today', label: 'Monthly', value: 30},
    {icon: 'calendar-today', label: 'Season', value: 90},
    {icon: 'calendar-today', label: 'Half Year', value: 180},
    {icon: 'calendar-today', label: 'Yearly', value: 365},
];

export function PeriodReportFab({onChange, selected}) {
    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;
    return <FAB.Group
        small
        open={open}
        icon={open ? 'close' : 'calendar-today'}
        actions={PERIOD_REPORT_OPTIONS.map(opt => {
            return {...opt, icon: opt === selected ? 'check' : 'calendar-today', onPress: () => onChange(opt)}
        })}
        onStateChange={onStateChange}
        onPress={() => {
            if (open) {
                console.log("OPEN")
                // do something if the speed dial is open
            }
        }}
    />;
}


