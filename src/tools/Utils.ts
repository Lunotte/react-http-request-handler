import { Platform } from "react-native";
import { rh2ConfigService } from "../services";

const INFO = '[RH2 INFO] ';
const WARN = '[RH2 WARN] ';

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
            console.warn(WARN + message, data);
        } else {
            console.warn(WARN + message);
        }
    }
}

export function isModeDebugThenDisplayInfo(message: string, ...data: unknown[]): void {
    if (rh2ConfigService.isModeDebug()) {
        if (data.length > 0) {
            console.info(INFO + message, data);
        } else {
            console.info(INFO + message);
        }
    }
}