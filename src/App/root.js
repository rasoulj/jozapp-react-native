import {Appbar} from "react-native-paper";
import React from "react";
import {createStackNavigator} from '@react-navigation/stack';
import {primary} from "../jozdan-common-temp/theme";
const Stack = createStackNavigator();

function MyHeader({navigation, scene, previous}) {
    return <View>

    </View>

}

export default function Root({pages}) {
    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                header: ({navigation, scene, previous}) => {
                    const {descriptor: {options: {title, subtitle}}} = scene;
                    // return null;
                    return (
                        <Appbar.Header style={{elevation: 1}}>
                            {previous && <Appbar.BackAction onPress={() => navigation.goBack()}/>}
                            <Appbar.Content title={title} subtitle={subtitle}/>
                        </Appbar.Header>
                    );
                },
            }}
        >

            {(Object.keys(pages)).map(id => {
                // console.log(pages);
                const page = pages[id];
                const {title, subtitle} = page || {title: "NA"};
                return (
                    <Stack.Screen
                        key={id}
                        name={id}
                        component={page}
                        options={{title, subtitle}}
                    />
                );
            })}
        </Stack.Navigator>
    );
}
