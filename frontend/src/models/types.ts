import { Role } from "../constants/role";

export type NumPairs = 2 | 4 | 8;

export type GameType = "pairing" | "selecting";

export type UID = string;

export interface User {
    email: string;
    testDate: Date;
    numPairs: NumPairs;
    gameType: GameType;
    role: Role
    hasFinishedTutorial: boolean;
    testScore: number | null;
    testSessionId: string | null;
}

export interface Word {
    turkish: string;
    english: string;
}

export interface Session {
    user: UID;
    startTime: Date;
    endTime: Date | null;
}

export interface Round {
    session: UID;
    startTime: Date;
    endTime: Date | null;
    words: Word[];
    correctWords: Word[] | null;
}

export interface Match {
    round: UID;
    turkish: string;
    english: string;
    correct: boolean;
}

export interface TestWord {
    turkish: string;
    english: string;
    correctlyPaired: string;
    question: number;
}

export interface TestSession {
    user: UID;
    startTime: Date;
    endTime: Date | null;
    score: number | null;
    correctWords: TestWord[] | null;
}

export interface TestRound {
    testSession: UID;
    startTime: Date;
    endTime: Date | null;
    testWord: TestWord;
    questionNum: number;
    correct: boolean | null;
}

export interface RoundWithId {
    id: string,
    round: Round
}

export interface TestRoundWithId extends TestRound {
    id: string
}
