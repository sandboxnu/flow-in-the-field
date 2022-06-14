import React from "react";
import { Text, StyleSheet } from "react-native";
import { BLUE } from "../../constants/colors";
import GameScreen, { GameScreenProps } from "./gameScreen";

export default function PairingGameScreen(props: GameScreenProps) {

    const pairingTopRenderer = (numCorrect: number, numTotal: number) => {
        return <Text style={styles.scoreText}>{numCorrect}/{numTotal}</Text>
    }

    const pairingShuffleFunction = (words: any[]) => {
        return words.map((word) => word.english);
    }

    return GameScreen({
        route: props.route,
        isPairing: true,
        topScreenRenderFunction: pairingTopRenderer,
        shuffleFunction: pairingShuffleFunction
    })
}

const styles = StyleSheet.create({
    scoreText: {
        color: BLUE,
        fontSize: 124,
        textAlign: "center",
        width: "100%",
        fontFamily: 'Montserrat_500Medium'
    }
})
