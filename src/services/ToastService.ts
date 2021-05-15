import { Alert } from "react-native";

export interface ToastOneButtonParameters { title: string, message: string, onOk?: Function }
export interface ToastTwoButtonParameters { title: string, message: string, onCancel?: Function, onOk?: Function }

export const toastOne = (info: ToastOneButtonParameters) => {

    const onOk = (info.onOk) ? info.onOk() : () => console.log('Rien de déclaré');

    Alert.alert(info.title, info.message,
        [
            { text: "OK", onPress: () => onOk }
        ],
        { cancelable: false });
}

export const toastTwo = (info: ToastTwoButtonParameters) => {
    
    const onOk = (info.onOk) ? info.onOk() : () => console.log('Rien de déclaré');
    const onCancel = (info.onCancel) ? info.onCancel() : () => console.log('Rien de déclaré');

    Alert.alert(info.title, info.message,
        [
            {
                text: "Cancel",
                onPress: () => onCancel,
                style: "cancel"
            },
            { text: "OK", onPress: () => onOk }
        ],
        { cancelable: false }
    );
}