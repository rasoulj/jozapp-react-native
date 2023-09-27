import SyncStorage from 'sync-storage';
import {INIT_STATE} from "../redux/reducers/pax";


export async function init_db() {
    try {
        const data = await SyncStorage.init();
        if (!data) return {};
        let state = INIT_STATE;
        for (const d of data) {
            state[d[0]] = d[1];
        }
        if(state.user) delete state.user;
        // console.log("initState", state);

        return state;
    } catch (e) {
        console.log(e);
        return {};
    }
    // console.log('AsyncStorage is ready!', data);
}

// init_db();
//init();

export function saveItem(Key, value) {
    SyncStorage.set(Key, value).then(() => {}).catch(console.log).finally();
}
export function getItem(Key, defValue = '') {
    try {
        // console.log("getItem", Key, val);
        return SyncStorage.get(Key) || defValue;
    } catch (e) {
        // console.log(e);
        return defValue;
    }
}
export function removeItem(Key) {
    SyncStorage.remove(Key).finally();
}

