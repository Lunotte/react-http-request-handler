/*
 * File: Utils.ts                                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: We Jun yyyy                                                   *
 * Author: Charly Beaugrand                                                                *
 * -----                                                                       *
 * Last Modified: Sun Aug 08 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import {
    rh2ConfigService 
} from "../services";

const INFO = '[RH2 INFO] ';
const WARN = '[RH2 WARN] ';

export function isModeDebugThenDisplayError(message: string, ...data: unknown[]): void {
    if (rh2ConfigService.isModeDebug()) {
        if (data.length > 0) {
            console.error(WARN + message, data);
        } else {
            console.error(WARN + message);
        }
    }
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
