import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BLUE, GREY } from "../constants/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, Word } from "../models/types";
import { durstenfeldShuffle } from "../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../components/DroppableRow";
const fi = new FirebaseInteractor();

interface MaybeWordPair {
    english?: string;
    turkish: string;
}

export default function PairingGameScreen() {
    const [englishWords, setEnglishWords] = useState<string[]>()
    const [turkishWords, setTurkishWords] = useState<MaybeWordPair[]>()
    const [user, setUser] = useState<User>();

    useEffect(() => {
        fi.getUser().then(user => {
            setUser(user);
            fi.getXRandomPairs(user.numPairs).then(words => {
                setEnglishWords(durstenfeldShuffle(words.map((word, i) => word.english)));
                setTurkishWords(durstenfeldShuffle(words.map((word, i) => ({ turkish: word.turkish }))));
            }).catch(console.error);
        }).catch(console.error);
    }, []);

    if (englishWords?.length === 0) {
        return <Text>loading</Text>
    }

    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={styles.column}>
                    {englishWords?.map(word =>
                        <DraxView payload={word} key={word} style={styles.draxView}>
                            <Text style={styles.english}>{word}</Text>
                        </DraxView>)}
                </View>
                <View style={styles.turkishContainer}>
                    {turkishWords?.map((word, i) => (
                        <DroppableRow
                            key={word.turkish}
                            wordDropped={(newWord) => {
                                const newTurkishWords = turkishWords
                                newTurkishWords[i] = { english: newWord, turkish: word.turkish }
                                setTurkishWords(newTurkishWords)
                                setEnglishWords(englishWords?.filter((word) => word !== newWord))
                            }}
                            turkish={word.turkish}
                            english={word.english}
                            removeWord={
                                () => {
                                    const newTurkishWords = [...turkishWords]
                                    newTurkishWords[i] = { turkish: word.turkish }
                                    const newEnglishWords = [...englishWords!]
                                    newEnglishWords?.push(word.english!)
                                    console.log(newEnglishWords)
                                    setTurkishWords(newTurkishWords)
                                    setEnglishWords(newEnglishWords)
                                }}
                        />))}
                </View>
            </View>
        </DraxProvider>
    )
}

const defaultStyle = StyleSheet.create({
    default: {
        color: "white",
        borderRadius: 5,
        textAlign: "center",
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    column: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        paddingTop: "10%",
        height: "50%",
        flexWrap: "wrap",
        flexDirection: "row"

    },
    turkishContainer: {

    },
    english: {
        ...defaultStyle.default,
        paddingVertical: "7%",
        backgroundColor: BLUE
    },
    turkish: {
        ...defaultStyle.default,
        backgroundColor: GREY
    },
    draxView: {
        width: "40%",
        marginHorizontal: "5%",
        height: "15%"
    },
    turkishDraxView: {
    }
})

