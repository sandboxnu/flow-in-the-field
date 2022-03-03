import { useEffect, useState } from "react"
import FirebaseInteractor from "../firebase/firebaseInteractor"
import PairingGameScreen, { GameScreenProps } from "./pairingGameScreen";
import SelectingGameScreen from "./selectingGameScreen";

const fi = new FirebaseInteractor();
export default function GameScreenFlow(props : GameScreenProps) {
  const [gameType, setGameType] = useState("pairing");
  const fi = new FirebaseInteractor();
  
  useEffect(() => {
    fi.getUser().then(user => {
      setGameType(user.gameType);
    })}, []);

    if (gameType === "pairing") {
      return PairingGameScreen(props);
    } else {
      return SelectingGameScreen(props);
    }
}