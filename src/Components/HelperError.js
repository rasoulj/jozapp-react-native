// import {getErrorMessage} from "../jozdan-common-temp/utils";
import {HelperText} from "react-native-paper";
import React from "react";
import {T} from "../i18n";

const UnknownError = "Unknown Error";

const getErrorMessage = err => {
    if(!err) return null;
    if(typeof err === "string") return err;
    if (typeof err === 'object') {
        const { message, request } = err;
        if(message) return message;
        if (request) {
            return request._response || UnknownError;
        }
        else return message || UnknownError;
    } else {
        return (typeof err === 'string') ? err : UnknownError;
    }

};

const HelperError = ({error, lang = "en"}) => !!error && <HelperText type="error" visible={error}>{T(getErrorMessage(error), lang)}</HelperText>;

export default HelperError;
