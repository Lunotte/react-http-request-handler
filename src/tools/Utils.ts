import { Platform } from "react-native";
import { rh2ConfigService } from "../services";

export function isMobile(): boolean {
    return Platform.OS === 'android' || Platform.OS === 'ios';
}

export function isWeb(): boolean {
    return Platform.OS === 'web';
}

export function isMobileOuWeb(): boolean {
    return isMobile() || isWeb();
}

export function isModeDebugThenDisplayWarn(message: string, ...data: unknown[]): void {
    if (rh2ConfigService.isModeDebug()) {
        if (data.length > 0) {
            console.warn(message, data);
        } else {
            console.warn(message);
        }
    }
}

export function isModeDebugThenDisplayInfo(message: string, ...data: unknown[]): void {
    if (rh2ConfigService.isModeDebug()) {
        if (data.length > 0) {
            console.info(message, data);
        } else {
            console.info(message);
        }
    }
}