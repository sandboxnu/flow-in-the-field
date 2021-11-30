import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BLUE, GREY } from "../constants/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, Word } from "../models/types";
import { durstenfeldShuffle } from "../utils/utils";

const fi = new FirebaseInteractor();

export default function PairingGameScreen() {
    const [englishWords, setEnglishWords] = useState<string[]>()
    const [turkishWords, setTurkishWords] = useState<string[]>()
    const [user, setUser] = useState<User>();

    useEffect(() => {
        fi.getUser().then(user => {
            setUser(user);
            fi.getXRandomPairs(user.numPairs).then(words => {
                setEnglishWords(durstenfeldShuffle(words.map((word, i) => word.english)));
                setTurkishWords(durstenfeldShuffle(words.map((word, i) => word.turkish)));
            }).catch(console.error);
        }).catch(console.error);
    }, []);

    if (englishWords?.length === 0) {
        return <Text>loading</Text>
    }

    return (<View style={styles.container}>
        <View style={styles.column}>
            {englishWords?.map(word => <Text style={styles.english}>{word}</Text>)}
        </View>
        <View style={styles.column}>
            {turkishWords?.map(word => <Text style={styles.turkish}>{word}</Text>)}
        </View>
    </View>)
}

const defaultStyle = StyleSheet.create({
    default: {
        color: "white",
        width: "80%",
        marginVertical: 5,
        borderRadius: 5,
        textAlign: "center",
        paddingVertical: "4%",
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: '#FFF',
    },
    column: {
        flex: 1,
        width: "50%",
        alignItems: "center",
        paddingTop: "10%"
    },
    english: {
        ...defaultStyle.default,
        backgroundColor: BLUE
    },
    turkish: {
        ...defaultStyle.default,
        backgroundColor: GREY
    }
})

