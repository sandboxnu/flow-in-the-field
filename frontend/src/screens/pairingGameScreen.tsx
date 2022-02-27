import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BLUE, GREY } from "../constants/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, Word, UID, GameType } from "../models/types";
import { durstenfeldShuffle } from "../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../components/LoadingScreen";

const fi = new FirebaseInteractor();

interface MaybeWordPair {
    english?: string;
    turkish: string;
    correctEnglishWord: string;
}

export interface GameScreenProps {
    route: any;
}

export default function PairingGameScreen(props: GameScreenProps) {
    const [englishWords, setEnglishWords] = useState<string[]>()
    const [turkishWords, setTurkishWords] = useState<MaybeWordPair[]>()
    const [user, setUser] = useState<User>();
    const [submitted, setSubmitted] = useState(false);
    const navigation = useNavigation()
    const { sessionId } = props.route.params;
    const [currentRoundId, setCurrentRoundId] = useState<UID>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("sessionId = " + sessionId)
        if (currentRoundId == "") {
            fi.startRound(sessionId).then(result => setCurrentRoundId(result));
        } else {
            fi.getUser().then(user => {
                setUser(user);
                fi.getRoundPairs(currentRoundId).then(words => {
                    setEnglishWords(durstenfeldShuffle(words.map((word, i) => word.english))); // pairing case
                    setTurkishWords(durstenfeldShuffle(words.map((word, i) => ({ turkish: word.turkish, correctEnglishWord: word.english, english: undefined }))));
                    setSubmitted(false)
                    setIsLoading(false)
                }).catch(console.error);
            }).catch(console.error);
        }
    }, [currentRoundId]);

    if (englishWords === undefined) {
        return <LoadingScreen />
    }

    const startRound = () => {
        fi.startRound(sessionId).then(result => setCurrentRoundId(result));
    }

    const restartRound = () => {
        fi.endRound(currentRoundId);
        fi.startRound(sessionId).then(result => setCurrentRoundId(result));
    }

    const endRound = () => {
        fi.endRound(currentRoundId);
    }

    const correctValues = turkishWords?.filter(({ english, correctEnglishWord }) => english === correctEnglishWord).length ?? 0;
    const canClickDoneButton = englishWords.every((word) => turkishWords?.some(({ english }) => english === word))
    const extraButtonStyles = canClickDoneButton && !isLoading ? {} : styles.inactiveButton

    const topScreen = <Text style={styles.scoreText}>{correctValues}/{turkishWords?.length ?? 0}</Text>
    const shouldNotFlexWrap = submitted
    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={{ ...styles.topContainer, flex: 6, flexWrap: shouldNotFlexWrap ? "nowrap" : "wrap" }}>
                    {submitted ? topScreen :
                        englishWords?.map(word => {
                            if (turkishWords?.some(({ english }) => english === word) ?? false) {
                                return (<View key={word} style={styles.englishUsed} />)
                            }
                            return (<DraxView payload={word} key={word}
                                style={styles.draxView}
                                draggingStyle={{ opacity: 0.3 }}
                                dragReleasedStyle={{ opacity: 0.3 }}
                                longPressDelay={100}>
                                <Text style={styles.english}>{word}</Text>
                            </DraxView>)
                        })
                    }
                </View>
                <View style={styles.bottomContainer}>
                    {turkishWords?.map((word, i) => (
                        <DroppableRow
                            key={word.turkish}
                            showingResults={submitted}
                            wordDropped={(newWord) => {
                                const newTurkishWords = turkishWords.map(({ english, turkish, correctEnglishWord }) => {
                                    if (english === newWord) {
                                        return { turkish, correctEnglishWord }
                                    } else {
                                        return { turkish, correctEnglishWord, english }
                                    }
                                })
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
                            isPairing={true}
                        />))}
                </View>
                <View style={styles.doneContainer}>
                    {submitted && <TouchableOpacity
                        style={{ ...styles.doneButton, ...(isLoading ? styles.inactiveButton : {}) }}
                        disabled={isLoading}
                        onPress={() => {
                            setIsLoading(true);
                            restartRound()
                        }}>
                        <Text style={styles.doneButtonTitle}>play again</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity style={submitted ? { ...styles.endSessionButton, ...(isLoading ? { borderColor: "#D16B5025" } : {}) }
                        : { ...styles.doneButton, ...extraButtonStyles }} disabled={submitted ? isLoading : !canClickDoneButton} onPress={() => {
                            if (submitted) {
                                fi.endRound(currentRoundId);
                                fi.endSession(sessionId);
                                navigation.navigate("HomeScreen");
                            } else {
                                setSubmitted(true)
                            }
                        }}><Text style={submitted ? { ...styles.endSessionButtonTitle, ...(isLoading ? { color: "#D16B5025" } : {}) }
                         : styles.doneButtonTitle}>{submitted ? "end session" : "done"}</Text></TouchableOpacity>
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
        alignItems: "center",
        paddingVertical: "4%",
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
    },
    inactiveButton: {
        backgroundColor: "#D16B5025",
        borderColor: "#FFF"
    },
    topContainer: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    bottomContainer: {
        width: "100%",
        flex: 12,
        justifyContent: "center",
    },
    english: {
        ...defaultStyle.default,
    },
    draxView: {
        width: "40%",
        marginHorizontal: "5%",
        height: "15%",
        marginVertical: "2%",
        backgroundColor: GREY,
        justifyContent: 'center'
    },
    doneContainer: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row'
    },
    doneButton: {
        backgroundColor: "#D16B50",
        borderColor: "#D16B50",
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        paddingHorizontal: "5%",
        marginHorizontal: '3%',
        marginVertical: "1%",
        paddingVertical: 10
    },
    doneButtonTitle: {
        color: "white"
    },
    endSessionButton: {
        backgroundColor: 'white',
        borderColor: "#D16B50",
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        paddingHorizontal: "5%",
        marginHorizontal: '3%',
        marginVertical: "1%",
        paddingVertical: 10
    },
    endSessionButtonTitle: {
        color: "#D16B50"
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
        textAlign: "center"
    },
    englishUsed: {
        borderColor: BLUE,
        borderWidth: 1,
        width: "40%",
        borderStyle: "dashed",
        height: "15%",
        marginVertical: "2%",
        marginHorizontal: "5%",
        borderRadius: 0.0001
    }
})
