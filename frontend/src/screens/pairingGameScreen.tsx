import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
    correctEnglishWord: string;
}

export default function PairingGameScreen() {
    const [englishWords, setEnglishWords] = useState<string[]>()
    const [turkishWords, setTurkishWords] = useState<MaybeWordPair[]>()
    const [user, setUser] = useState<User>();
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fi.getUser().then(user => {
            setUser(user);
            fi.getXRandomPairs(user.numPairs).then(words => {
                setEnglishWords(durstenfeldShuffle(words.map((word, i) => word.english)));
                setTurkishWords(durstenfeldShuffle(words.map((word, i) => ({ turkish: word.turkish, correctEnglishWord: word.english }))));
            }).catch(console.error);
        }).catch(console.error);
    }, []);

    if (englishWords === undefined) {
        return <Text>loading</Text>
    }

    const correctValues = turkishWords?.filter(({ english, correctEnglishWord }) => english === correctEnglishWord).length ?? 0;
    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={styles.column}>
                    {submitted ? <Text style={styles.scoreText}>{correctValues}/{turkishWords?.length ?? 0}</Text> :
                        englishWords?.map(word =>
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
                                newTurkishWords[i] = { english: newWord, turkish: word.turkish, correctEnglishWord: word.correctEnglishWord }
                                setTurkishWords(newTurkishWords)
                                setEnglishWords(englishWords?.filter((word) => word !== newWord))
                            }}
                            turkish={word.turkish}
                            english={word.english}
                            removeWord={
                                () => {
                                    const newTurkishWords = [...turkishWords]
                                    newTurkishWords[i] = { turkish: word.turkish, correctEnglishWord: word.correctEnglishWord }
                                    const newEnglishWords = [...englishWords!]
                                    newEnglishWords?.push(word.english!)
                                    console.log(newEnglishWords)
                                    setTurkishWords(newTurkishWords)
                                    setEnglishWords(newEnglishWords)
                                }}
                        />))}
                </View>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={() => setSubmitted(true)}><Text style={styles.doneButtonTitle}>done</Text></TouchableOpacity>
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
        height: "100%",
    },
    column: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        paddingTop: "10%",
        flexWrap: "wrap",
        flexDirection: "row"

    },
    turkishContainer: {
        width: "100%",
        flex: 1
    },
    english: {
        ...defaultStyle.default,
        paddingVertical: "10%",
        marginVertical: "4%",
        backgroundColor: BLUE
    },
    draxView: {
        width: "40%",
        marginHorizontal: "5%",
        height: "15%",
        marginVertical: "3%"
    },
    doneButton: {
        backgroundColor: "#D16B50",
        borderRadius: 12,
        height: "5%",
        justifyContent: 'center',
        alignItems: 'center',
        width: "20%",
        marginBottom: "2%",
        marginLeft: "40%"
    },
    doneButtonTitle: {
        color: "white"
    },
    scoreText: {
        color: BLUE,
        fontSize: 124,
        textAlign: "center",
        width: "100%"
    }
})

