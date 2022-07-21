import React from "react";
import { UID } from "../models/types";

interface GameStateContextInterface {
    sessionId: UID,
    roundId: UID,
    updateSessionId: (sessionId: UID) => void,
    updateRoundId: (roundId: UID) => void
}

export const GameStateContext = React.createContext<GameStateContextInterface>({
    sessionId: "",
    roundId: "",
    updateRoundId: (roundId) => {},
    updateSessionId: (sessionId) => {}
})
