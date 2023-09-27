import {ON_SET_FIELDS} from "../constants";

export const setValues = (dictValues, save = false) => {
    for(const key in dictValues) {
        if(!dictValues[key] && dictValues[key] !== 0) dictValues[key] = "";
    }
    return {
        type: ON_SET_FIELDS,
        payload: {dictValues, save}
    }
};
//
// export const signIn = user => {
//     return setValues({user});
// };

export const signOut = () => {

    return setValues({user: undefined, mainTabIndex: 0});
};
