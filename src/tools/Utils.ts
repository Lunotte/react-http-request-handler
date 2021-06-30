import { Platform } from "react-native";

export function isMobile(): boolean {
    return Platform.OS === 'android' || Platform.OS === 'ios';
}

export function isWeb(): boolean {
    return Platform.OS === 'web';
}

export function isMobileOuWeb(): boolean {
    return isMobile() || isWeb();
}
