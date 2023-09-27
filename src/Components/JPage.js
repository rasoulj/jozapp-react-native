import React, {useState, useEffect, Component} from "react"
import Gradient from "../App/gradient";
import {View, ScrollView, Dimensions} from "react-native";
import {FAB, Colors, Snackbar, Portal, Provider, IconButton, Button, withTheme } from "react-native-paper";
import JLoader from "./JLoader";
import {accent, primary, secondary} from "../jozdan-common-temp";

const pageStyle = {flex: 1, paddingHorizontal: 10};

export const ToastTypes = {
    primary,
    accent,
    danger: Colors.red600,
    info: "blue",
    success: "green",
    default: "black",
};

const {width: W, height: H} = Dimensions.get('window');

const Snack = ({toast, onDismissSnackBar, duration, type = ToastTypes.success}) => {
    // const {colors: {primary, accent}} = useTheme();

    return <Snackbar
        theme={{ colors: {surface: '#fff'},}}
        style={{backgroundColor: type, color: "#fff"}}
        duration={duration}
        visible={toast}
        onDismiss={onDismissSnackBar}
        // action={{
        //     label: 'OK',
        //     onPress: () => {
        //     },
        // }}
    >
        {toast}
    </Snackbar>;
};

export class JPageInt extends Component<{
    children: any,
    style: {},
    loader: boolean,
    fab: any,
    noScroll: boolean,
    pin: any,
}> {
    static defaultProps = {
        style: {},
        loader: false,
        fab: null,
        noScroll: false,
        pin: null,
    };

    constructor(props) {
        super(props);
        const {pin} = props;

        const {initState} = pin || {initState: "open"};

        this.state = {
            toast: undefined,
            timer: undefined,
            duration: 7000,
            showPin: initState === "open",
        };

    }


    setToast(toast, type = ToastTypes.default, duration = 5000) {
        clearTimeout(this.state.timer);
        this.setState({toast, type}, () => {
            this.setState({timer: setTimeout(() => this.setState({toast: undefined}), duration)});
        });
    }

    onDismissSnackBar = () => this.setState({toast: undefined});

    render() {
        let {children, style, loader, fab, noScroll, pin, theme, pin2, footer, footerHeight = 50} = this.props;

        // console.log("theme", theme);

        const MyView = !!noScroll ? View : ScrollView;

        const {toast, duration, type, showPin} = this.state;

        const {commandType, textOpen, textClose, comp} = pin || {};

        return <Provider>
            <Portal style={{...style, ...pageStyle}}>
                {/*<Gradient/>*/}
                {!!pin && <View style={{top: 0, left: 0, right: 0, elevation: 10, borderBottomWidth: 1, borderColor: "#d1d1d1", backgroundColor: '#f1f1f1'}}>
                    {commandType === "icon" && <IconButton icon={`arrow-${showPin ? "up" : "down"}`} style={{top: 0, left: W-35}} color={showPin ? 'black' : 'grey'} size={12} onPress={() => this.setState({showPin: !showPin})} />}
                    {commandType === "text" && <Button compact={true} uppercase={false} icon={!showPin ? `arrow-${showPin ? "up" : "down"}` : "close"} style={{top: 0, backgroundColor: "#aaa"}} color={!showPin ? 'black' : 'white'} size={12} onPress={() => this.setState({showPin: !showPin})}>
                        {!showPin ? textOpen : textClose}
                    </Button>}
                    {showPin && comp}
                </View>}
                {!!pin2 && <View style={{left: 0, right: 0, elevation: 2, backgroundColor: 'white', height: 50}}>
                    {pin2}
                </View>}
                <Snack type={type} duration={duration} onDismissSnackBar={this.onDismissSnackBar} toast={toast}/>
                <JLoader visible={loader}/>
                <MyView style={{backgroundColor: `${primary}`}}>
                    {children}
                </MyView>

                {fab}


                {!!footer && <View style={{left: 0, right: 0, bottom: 0, height: footerHeight}}>
                    {footer}
                </View>}
            </Portal>
        </Provider>;
    }
}

export const JPage = withTheme(JPageInt);
