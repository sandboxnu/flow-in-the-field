import { useEffect, useState } from "react";

import { GameScreenProps } from "./gameScreen";
import PairingGameScreen from "./pairingGameScreen";
import SelectingGameScreen from "./selectingGameScreen";
import FirebaseInteractor from "../../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();

export default function GameScreenFlow(props: GameScreenProps) {
  const [gameType, setGameType] = useState("pairing");

  useEffect(() => {
    setGameType("pairing");
    // fi.getUser().then((user) => {
    //   setGameType(user.gameType);
    // });
  }, []);

  if (gameType === "pairing") {
    return PairingGameScreen(props);
  } else {
    return SelectingGameScreen(props);
  }
}
