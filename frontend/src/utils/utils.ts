import { NumPairs, GameType } from "../models/types";

export function getRandomPairing(): NumPairs {
    let choice = Math.floor(Math.random() * 3);
    switch (choice) {
        case 0:
            return 2;
        case 1:
            return 4;
        case 2:
            return 8;
        default:
            throw new Error("This will never happen, since random from 0 to 3 is never not 0 1 or 2");
    }
}

export function shuffle<T>(vals: T[]) {
    vals.sort((a, b) => Math.random() - 0.5)
}

export function getTestDate() {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //add 7 days to current time
}
export function mapErrorCodeToMessage(code: string) {
    switch (code) {
        case "auth/email-already-in-use":
            return "Email already exists.";
        case "auth/invalid-email":
            return "Invalid email.";
        case "auth/weak-password":
            return "Password length must be > 6 characters.";
        case "auth/user-not-found":
            return "Invalid login info.";
        case "auth/wrong-password":
            return "Invalid login info.";
        case "auth/too-many-requests":
            return "Attempted to login too many times. Please reset your password."
        default:
            return "Unknown error: " + code;
    }
}

/**
 * Produces a random game type.
 */
export function getRandomGameType(): GameType {
    const gameTypes: GameType[] = ["pairing", "selecting"];
    return gameTypes[Math.floor(Math.random() * gameTypes.length)];
}
