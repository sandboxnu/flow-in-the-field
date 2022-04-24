import React, { useEffect, useState, useCallback, useMemo, useRef, useContext, } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { BLUE, GREY } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { User, UID } from "../../models/types";
import { durstenfeldShuffle } from "../../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../../components/LoadingScreen";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import { GameStateContext } from "../../utils/context";
import BottomSheet from '@gorhom/bottom-sheet';
import GameTutorialScreens from "../GameTutorial/GameTutorialScreens";

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
    const [user, setUser] = useState<User>();
    const [submitted, setSubmitted] = useState(false);
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false);
    const gameStateContext = useContext(GameStateContext);
    const [showingModal, setShowModal] = useState(true);

    // ref for tutorial modal
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables --> snap points for tutorial modal
    const snapPoints = useMemo(() => ['25%', '80%'], []);

    // handle close press for tutorial modal
    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
        setShowModal(false);
    }, []);

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
                setUser(user);
                fi.getRoundPairs(gameStateContext.roundId).then(words => {
                    setEnglishWords(durstenfeldShuffle(props.shuffleFunction(words)));
                    setCurrentPairs(durstenfeldShuffle(words.map((word, i) => ({ turkish: word.turkish, correctEnglishWord: word.english, english: undefined }))));
                    setSubmitted(false)
                    setIsLoading(false)
                }).catch(console.error);
            }).catch(console.error);
        }
    }, [gameStateContext.roundId, showingModal]);

    useEffect(() => {
        if (submitted) {
            fi.endRound(gameStateContext.roundId, getCorrectWords());
        }
    }, [submitted])

    if (englishWords === undefined) {
        return <LoadingScreen />
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
        return currentPairs?.map((word, i) => (
            <DroppableRow
                key={word.turkish}
                showingResults={submitted}
                wordDropped={getWordDroppedHandler(currentPairs, word, i)}
                turkish={word.turkish}
                english={word.english}
                correctEnglish={word.correctEnglishWord}
                removeWord={getRemoveWordHandler(currentPairs, word, i)}
                isPairing={props.isPairing}
            />))
    }

    const renderSubmittedButtons = () => {
        return (<View style={styles.doneContainer}>
            <PrimaryButton
                disabled={isLoading}
                onPress={() => {
                    setIsLoading(true);
                    fi.startRound(gameStateContext.sessionId).then(result => gameStateContext.updateRoundId(result));
                }}
                text="play again" />
            <SecondaryButton
                disabled={isLoading}
                text="end session"
                onPress={() => {
                    fi.endSession(gameStateContext.sessionId);
                    gameStateContext.updateSessionId("");
                    gameStateContext.updateRoundId("");
                    navigation.navigate("HomeScreen");
                }} />
        </View>)
    }

    const renderInProgressButtons = () => {
        return (<View style={styles.doneContainer}>
            <PrimaryButton
                disabled={!canClickDoneButton || isLoading}
                text="done"
                onPress={() => {
                    setSubmitted(true);
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
        if (!submitted) {
            return null
        }

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
    const shouldFlexWrap = props.isPairing && !submitted

    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={showingModal && !user?.hasFinishedTutorial ? styles.overlay : {}}>
                    <View style={shouldFlexWrap ? styles.wrapTopContainer : styles.noWrapTopContainer}>
                        {submitted ? scoreText : renderEnglishOptions()}
                    </View>
                    <View style={styles.bottomContainer}>
                        {renderTurkishWords()}
                    </View>
                    {submitted ? renderSubmittedButtons() : renderInProgressButtons()}
                </View>
                {!user?.hasFinishedTutorial &&
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                    >
                        <View style={styles.contentContainer}>
                            <GameTutorialScreens isPairing={props.isPairing} onFinish={handleClosePress} />
                        </View>
                    </BottomSheet>}
            </View>
        </DraxProvider>
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
        justifyContent: "center",
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
    // Styles associated with bottom sheet modal for game tutorial
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    overlay: {
        opacity: 0.8,
        backgroundColor: "#6E81E7A6",
        width: "100%",
        height: "100%",
    }
})
