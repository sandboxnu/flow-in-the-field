import { useEffect, useState } from "react";

import { GameScreenProps } from "./Game";
import PairingGame from "./PairingGame";
import SelectingGame from "./SelectingGame";

export default function GameFlow(props: GameScreenProps) {
  const [gameType, setGameType] = useState("pairing");
  const fi = new FirebaseInteractor();

  useEffect(() => {
    fi.getUser().then((user) => {
      setGameType(user.gameType);
    });
  }, []);

  if (gameType === "pairing") {
    return PairingGame(props);
  } else {
    return SelectingGame(props);
  }
}
