/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import I18n from "./src/i18n/i18n";

// I18n.locale = "fa";
I18n.defaultLocale = 'fa-IR';

LogBox.ignoreAllLogs(true);
// console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
