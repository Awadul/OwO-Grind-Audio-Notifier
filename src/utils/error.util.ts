import { config } from "../config/config.js";

export function errorHandler(error: any): boolean {

    if (error?.message?.includes('401') || String(error).includes('401')) {
        console.log(`[UNAUTHENTICATED] Log in Again! ${error}`);

        return true;
    } else {
        console.error(`[ERROR] Couldn't send the action! [HUNT]: ${error}`);
        return false;
    }
}