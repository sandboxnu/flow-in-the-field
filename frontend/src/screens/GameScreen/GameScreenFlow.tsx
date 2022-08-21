import { useEffect, useState } from "react";

import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { GameScreenProps } from "./gameScreen";
import PairingGameScreen from "./pairingGameScreen";
import SelectingGameScreen from "./selectingGameScreen";

const fi = new FirebaseInteractor();

export default function GameScreenFlow(props: GameScreenProps) {
  const [gameType, setGameType] = useState("pairing");

  useEffect(() => {
    fi.getUser().then((user) => {
      setGameType(user.gameType);
    });
  }, []);

  if (gameType === "pairing") {
    return PairingGameScreen(props);
  } else {
    return SelectingGameScreen(props);
  }
}
