import {OrderTypes} from "../../../jozdan-common-temp/db";
import {Colors} from "react-native-paper"
export const OrdersInfo = {
    [OrderTypes.topUp]: {
        color: Colors.green600,
        title: "OrderTypes.topUp",
        icon: "transfer-up",
        target: "TopupWithdraw",
    },
    [OrderTypes.withdraw]: {
        color: Colors.red600,
        title: "OrderTypes.withdraw",
        icon: "transfer-down",
        target: "TopupWithdraw",
    },
    [OrderTypes.exchange]: {
        color: Colors.lightBlue600,
        title: "OrderTypes.exchange",
        icon: "bank-transfer",
        target: "Exchange",
    },
    [OrderTypes.transfer]: {
        color: Colors.purple600,
        title: "OrderTypes.transfer",
        icon: "transfer-right",
        target: "Transfer",
    },
    // [OrderTypes.airplane]: {
    //     color: Colors.red600,
    //     title: "OrderTypes.airplane",
    //     icon: "airplane",
    //     target: "Airplane",
    // }
};
