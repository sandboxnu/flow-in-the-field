import { NumPairs, GameType, RoundWithId } from "../models/types";

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

//stolen from https://stackoverflow.com/a/12646864/9124516
//mutates original array and returns it
export function durstenfeldShuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/**
 * Produces a random game type.
 */
export function getRandomGameType(): GameType {
    const gameTypes: GameType[] = ["pairing", "selecting"];
    return gameTypes[Math.floor(Math.random() * gameTypes.length)];
}

/**
 * Returns the given list of rounds with the given round inserted in order of start time
 * 
 * @param currentRounds sorted list of rounds to insert new round into
 * @param toInsert round to insert into list
 */
export function insertRoundInOrder(currentRounds: RoundWithId[], toInsert: RoundWithId): RoundWithId[] {
    if (currentRounds.length == 0) {
        currentRounds.push(toInsert);
        return currentRounds;
    }
    
    let lowIndex = 0;
    let highIndex = currentRounds.length - 1;

    while (currentRounds[lowIndex].round.startTime < currentRounds[highIndex].round.startTime) {
        let midIndex = Math.floor((lowIndex + highIndex) / 2)
        if (currentRounds[midIndex].round.startTime < toInsert.round.startTime) {
            lowIndex = midIndex + 1
        } else {
            highIndex = midIndex;
        }
    }

    currentRounds.splice(lowIndex, 0, toInsert)
    return currentRounds;
}
