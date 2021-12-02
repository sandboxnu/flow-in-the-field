import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BLUE, GREY } from "../constants/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, Word } from "../models/types";
import { durstenfeldShuffle } from "../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
const fi = new FirebaseInteractor();

interface MaybeWordPair {
    english?: string;
    turkish: string;
    correctEnglishWord: string;
}

const fetchNewWords = async (user: User) => {
    const words = await fi.getXRandomPairs(user.numPairs)
    let allEnglishWords: string[] = durstenfeldShuffle(words.map((word, i) => word.english));
    if (user.gameType !== "pairing") {
        allEnglishWords = [allEnglishWords[0]]
    }
    const turkishWords: MaybeWordPair[] = durstenfeldShuffle(words.map((word, i) => ({ turkish: word.turkish, correctEnglishWord: word.english })))
    return {allEnglishWords, turkishWords}
}

export default function PairingGameScreen() {
    const [englishWords, setEnglishWords] = useState<string[]>()
    const [turkishWords, setTurkishWords] = useState<MaybeWordPair[]>()
    const [user, setUser] = useState<User>();
    const [submitted, setSubmitted] = useState(false);
    const navigation = useNavigation()

    useEffect(() => {
        fi.getUser().then(user => {
            setUser(user);
            fetchNewWords(user)
            .then(({allEnglishWords, turkishWords}) => {
                setEnglishWords(allEnglishWords)
                setTurkishWords(turkishWords)
            }).catch(console.log)
        }).catch(console.error);
    }, []);

    if (englishWords === undefined) {
        return <Text>loading</Text>
    }

    const correctValues = turkishWords?.filter(({ english, correctEnglishWord }) => english === correctEnglishWord).length ?? 0;
    const canClickDoneButton = englishWords.every((word) => turkishWords?.some(({ english }) => english === word))
    const extraButtonStyles = canClickDoneButton ? {} : styles.inactiveButton

    const topScreen = user?.gameType === "pairing" ? <Text style={styles.scoreText}>{correctValues}/{turkishWords?.length ?? 0}</Text>
        : <Text style={styles.correctText}>{correctValues === 1 ? "correct" : "incorrect"}</Text>
    const shouldNotFlexWrap = user?.gameType === "selecting" || submitted

    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={{ ...styles.column, flex: submitted ? 5 : 8, flexWrap: shouldNotFlexWrap ? "nowrap" : "wrap" }}>
                    {submitted ? topScreen :
                        englishWords?.map(word => {
                            if (turkishWords?.some(({ english }) => english === word) ?? false) {
                                return (<View key={word} style={styles.englishUsed} />)
                            }
                            return (<DraxView payload={word} key={word} style={styles.draxView} draggingStyle={styles.englishUsed} dragReleasedStyle={styles.englishUsed}>
                                <Text style={styles.english}>{word}</Text>
                            </DraxView>)
                        })
                    }
                </View>
                <View style={styles.turkishContainer}>
                    {turkishWords?.map((word, i) => (
                        <DroppableRow
                            key={word.turkish}
                            showingResults={submitted}
                            wordDropped={(newWord) => {
                                const newTurkishWords = [...turkishWords]
                                newTurkishWords[i] = { english: newWord, turkish: word.turkish, correctEnglishWord: word.correctEnglishWord }
                                setTurkishWords(newTurkishWords)
                            }}
                            turkish={word.turkish}
                            english={word.english}
                            correctEnglish={word.correctEnglishWord}
                            removeWord={
                                () => {
                                    const newTurkishWords = [...turkishWords]
                                    newTurkishWords[i] = { turkish: word.turkish, correctEnglishWord: word.correctEnglishWord }
                                    setTurkishWords(newTurkishWords)
                                }}
                        />))}
                </View>
                <View style={styles.doneContainer}>
                    {submitted && <TouchableOpacity style={styles.doneButton} onPress={() => {
                        if (user) {
                            fetchNewWords(user)
                            .then(({allEnglishWords, turkishWords}) => {
                                setEnglishWords(allEnglishWords)
                                setTurkishWords(turkishWords)
                                setSubmitted(false)
                            }).catch(console.log)
                        }
                    }}><Text style={styles.doneButtonTitle}>play again</Text></TouchableOpacity>}
                    <TouchableOpacity style={{ ...styles.doneButton, ...extraButtonStyles }} disabled={!canClickDoneButton} onPress={() => {
                        if (submitted) {
                            navigation.navigate("home")
                        } else {
                            setSubmitted(true)
                        }
                    }}><Text style={styles.doneButtonTitle}>{submitted ? "end session" : "done"}</Text></TouchableOpacity>
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
        height: "100%",
        paddingTop: "5%"
    },
    inactiveButton: {
        backgroundColor: "#D16B5025",
    },
    column: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    turkishContainer: {
        width: "100%",
        flex: 10,
        justifyContent: "center"
    },
    english: {
        ...defaultStyle.default,
    },
    draxView: {
        width: "40%",
        marginHorizontal: "5%",
        height: "15%",
        marginVertical: "3%",
        backgroundColor: BLUE,
        justifyContent: 'center'
    },
    doneContainer: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    doneButton: {
        backgroundColor: "#D16B50",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: "10%",
        marginVertical: "1%",
        paddingVertical: 10
    },
    doneButtonTitle: {
        color: "white"
    },
    scoreText: {
        color: BLUE,
        fontSize: 124,
        textAlign: "center",
        width: "100%"
    },
    correctText: {
        color: BLUE,
        fontSize: 64,
        textAlign: "center",

    },
    englishUsed: {
        borderColor: BLUE,
        borderWidth: 1,
        width: "40%",
        borderStyle: "dashed",
        height: "15%",
        marginVertical: "3%",
        marginHorizontal: "5%",
        borderRadius: 0.0001
    }
})

