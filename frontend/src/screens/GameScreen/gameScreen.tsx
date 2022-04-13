import React, { useEffect, useState, useCallback, useMemo, useRef, useContext, } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { BLUE, GREY } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { UID } from "../../models/types";
import { durstenfeldShuffle } from "../../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../../components/LoadingScreen";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import CustomRow from "../../components/CustomRow";
import CustomButton from "../../components/Button/CustomButton";
import { GameStateContext } from "../../utils/context";

const fi = new FirebaseInteractor();

interface MaybeWordPair {
    english?: string;
    turkish: string;
    correctEnglishWord: string;
}

export interface GameScreenProps {
    route: any;
}

export interface SpecificGameScreenProps {
    route: any;
    shuffleFunction: (words: any[]) => any[];
    topScreenRenderFunction: (numCorrect: number, numTotal: number) => JSX.Element;
    isPairing: boolean;
}

export default function GameScreen(props: SpecificGameScreenProps) {
    const [englishWords, setEnglishWords] = useState<string[]>()
    const [currentPairs, setCurrentPairs] = useState<MaybeWordPair[]>()
    const [submitted, setSubmitted] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const navigation = useNavigation();
    const gameStateContext = useContext(GameStateContext);
    const { sessionId } = props.route.params;
    const [currentRoundId, setCurrentRoundId] = useState<UID>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const backAction = () => {
            fi.getCorrectWords(gameStateContext.roundId).then(correctWords => {
                fi.endRound(gameStateContext.roundId, correctWords);
                fi.endSession(gameStateContext.sessionId);
                gameStateContext.updateRoundId("")
                gameStateContext.updateSessionId("")
            });
            return false;
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    })

    useEffect(() => {
        if (gameStateContext.roundId == "") {
            fi.startRound(gameStateContext.sessionId).then(async result => {
                gameStateContext.updateRoundId(result)
            });
        } else {
            fi.getUser().then(user => {
                fi.getRoundPairs(currentRoundId).then(words => {
                    setEnglishWords(durstenfeldShuffle(props.shuffleFunction(words)));
                    setCurrentPairs(durstenfeldShuffle(words.map((word, i) => ({ turkish: word.turkish, correctEnglishWord: word.english, english: undefined }))));
                    setSubmitted(false)
                    setShowAnswers(false)
                    setIsLoading(false)
                }).catch(console.error);
            }).catch(console.error);
        }
    }, [currentRoundId]);

    if (englishWords === undefined) {
        return <LoadingScreen />
    }

    const restartRound = () => {
        fi.endRound(currentRoundId, getCorrectWords());
        fi.startRound(sessionId).then(result => setCurrentRoundId(result));
    }

    //Returns a function that updates the state of the player's current pairs by
    //adding their current guess to the pair at the given index
    const getWordDroppedHandler = (currentPairs: MaybeWordPair[], word: MaybeWordPair, i: number) => {
        return (newWord: string) => {

            //This map is required because it allows words to be dragged from
            //one row to another. It clears the dropped word from all pairs so
            //that it can be properly placed into the new one.
            const newPairs = currentPairs.map(({ english, turkish, correctEnglishWord }) => {
                if (english === newWord) {
                    return { turkish, correctEnglishWord }
                } else {
                    return { turkish, correctEnglishWord, english }
                }
            })
            newPairs[i] = { english: newWord, turkish: word.turkish, correctEnglishWord: word.correctEnglishWord }
            setCurrentPairs(newPairs)
        }
    }

    //Returns a function that updates the state of the player's current pairs by
    //removing their current guess of the given pair
    const getRemoveWordHandler = (currentPairs: MaybeWordPair[], word: MaybeWordPair, i: number) => {
        return () => {
            const newPairs = [...currentPairs]
            newPairs[i] = { turkish: word.turkish, correctEnglishWord: word.correctEnglishWord }
            setCurrentPairs(newPairs)
        }
    }

    const renderTurkishWords = () => {
        if (props.isPairing) {
            return currentPairs?.map((word, i) => (
                <CustomRow
                    key={word.turkish}
                    showingResults={submitted}
                    showingAnswers={showAnswers}
                    wordDropped={getWordDroppedHandler(currentPairs, word, i)}
                    turkish={word.turkish}
                    english={word.english}
                    correctEnglish={word.correctEnglishWord}
                    removeWord={getRemoveWordHandler(currentPairs, word, i)}
                    isPairing={props.isPairing}
            />))
        }
        else {
            return currentPairs?.map((word, i) => 
                    englishWords.map((englishWord) => (
                        <CustomRow
                            key={word.turkish}
                            showingResults={submitted}
                            showingAnswers={showAnswers}
                            wordDropped={getWordDroppedHandler(currentPairs, word, i)}
                            turkish={word.turkish}
                            englishSelectingWord={englishWord}
                            english={word.english}
                            correctEnglish={word.correctEnglishWord}
                            removeWord={getRemoveWordHandler(currentPairs, word, i)}
                            isPairing={props.isPairing}
                    />))
                )
        }
    }

    const renderSubmittedButtons = () => {
      if (showAnswers) {
        return (<View style={styles.doneContainer}>
          <PrimaryButton
              disabled={isLoading}
              onPress={() => {
                  setIsLoading(true);
                  restartRound();
              }}
              text="play again" />
          <SecondaryButton
              disabled={isLoading}
              text="end session"
              onPress={() => {
                  fi.endRound(currentRoundId, getCorrectWords());
                  fi.endSession(sessionId);
                  navigation.navigate("HomeScreen");
              }} />
      </View>)
      } else {
        return (<View style={styles.doneContainer}>
           <CustomButton
                onPress={() => {
                    setShowAnswers(true);
                }}
                disabled={false}
                enabledStyle={styles.seeCorrectButton}
                disabledStyle={styles.seeCorrectButton}
                enabledTextStyle={styles.buttonText}
                disabledTextStyle={styles.buttonText}
                text={"see correct answers"}/>
            </View>)
      }
    }

    const renderInProgressButtons = () => {
        return (<View style={styles.doneContainer}>
            <PrimaryButton
                disabled={!canClickDoneButton || isLoading}
                text="done"
                onPress={() => {
                  setSubmitted(true)
                //   if (getNumCorrectWords() > 0 && !props.isPairing || getNumCorrectWords() == currentPairs?.length && props.isPairing) {
                //     setShowAnswers(true);
                //   }
                }} />
        </View>
        )
    }

    const renderEnglishOptions = () => {
        return englishWords?.map(word => {
            if (currentPairs?.some(({ english }) => english === word) ?? false) {
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

    const getCorrectWords = () => {
        const correctWords = currentPairs?.filter(({ english, correctEnglishWord }) => english === correctEnglishWord)
            .map((maybeWordPair) => ({
                turkish: maybeWordPair.turkish,
                english: maybeWordPair.correctEnglishWord
            })) ?? null

        return correctWords
    }

    const getNumCorrectWords = () => getCorrectWords()?.length ?? 0;

    const canClickDoneButton = englishWords.every((word) => currentPairs?.some(({ english }) => english === word))

    const scoreText = props.topScreenRenderFunction(getNumCorrectWords(), currentPairs?.length ?? 0)
    const correctAnswersText = <Text style={styles.correctAnswersText}>Correct Answers</Text>
    const shouldFlexWrap = props.isPairing && !submitted

    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={shouldFlexWrap ? styles.wrapTopContainer : styles.noWrapTopContainer}>
                    {submitted ? (showAnswers ? correctAnswersText : scoreText) : renderEnglishOptions()}
                </View>
                <View style={styles.bottomContainer}>
                    {renderTurkishWords()}
                </View>
                {submitted ? renderSubmittedButtons() : renderInProgressButtons()}
            </View>
        </DraxProvider >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
    },
    noWrapTopContainer: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        flex: 6,
        flexWrap: "nowrap",
    },
    wrapTopContainer: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        flex: 6,
        flexWrap: "wrap",
    },
    bottomContainer: {
        width: "100%",
        flex: 12,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    english: {
        color: "white",
        borderRadius: 5,
        textAlign: "center",
        alignItems: "center",
        paddingVertical: "4%",
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
    correctAnswersText: {
        color: BLUE,
        fontSize: 40,
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
    },
    seeCorrectButton: {
        backgroundColor: "#6E81E7",
        borderColor: "#6E81E7",
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '65%',
        paddingHorizontal: "5%",
        marginHorizontal: '3%',
        marginVertical: "1%",
        paddingVertical: 10
    },
    buttonText: {
        color: "white",
        backgroundColor: "transparent"
    },
})