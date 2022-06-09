import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { DraxProvider } from "react-native-drax";
import { useNavigation } from "@react-navigation/core";
import AnimatedBar from "react-native-animated-bar";
import { TestWord, UID } from "../../models/types";

const fi = new FirebaseInteractor();

const TEST_HEADER_OPTIONS = {
    headerTitle: () => { return <Text style={{color: "#5eafdf", fontSize: 20, fontFamily: 'Montserrat_500Medium'}}>Test Your Knowledge</Text> },
    title: '',
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: '#FFF',
    headerBackTitle: '',
    headerStyle: {
      backgroundColor: '#FFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  }

export interface TestScreenProps {
    route: any;
}

export default function TestScreen(props: TestScreenProps) {
    const navigation = useNavigation();
    const { testSessionId } = props.route.params;
    const [currentTestRoundId, setCurrentTestRoundId] = useState<UID>("");
    const [page, setPage] = useState<number>(1);
    const numQuestions = 50;
    const [testQuestion, setTestQuestion] = useState<TestWord>();
    const [testQuestions, setTestQuestions] = useState<TestWord[]>();
    const [answer, setAnswer] = useState<string>("");
    const [answers, setAnswers] = useState<string[]>([]);

    useEffect(() => {
        if (currentTestRoundId == "") {
            fi.startTestRound(testSessionId, page).then(result => setCurrentTestRoundId(result));
        } else if (answers.length == numQuestions) {
            let testGradingInfo = gradeAnswers();
            fi.endTestRound(currentTestRoundId, determineIfRoundAnswerCorrect());
            fi.endTestSession(testSessionId, testGradingInfo.score, testGradingInfo.correctAnswers).then(
                () => navigation.navigate("TestResultsScreen", 
                        { correct: testGradingInfo.score, total: numQuestions }));
        } else {
            fi.getTestWord(page).then(testWord => {
                setTestQuestion(testWord)
            }).catch(console.error);
            fi.getTestQuestions().then(testWords => {
                setTestQuestions(testWords)
            })
        }
    }, [currentTestRoundId, answers])

    const gradeAnswers = () => {
        let numCorrectTestAnswers = 0;
        let correctTestAnswersList = [];

        for (let question = 1; question <= numQuestions; question++) {
            let testWord = getTestWord(question);

            if (answers && answers[question - 1] === testWord.correctlyPaired) {
                numCorrectTestAnswers++;
                correctTestAnswersList.push(testWord);
            }
        }
        return { score: numCorrectTestAnswers, correctAnswers: correctTestAnswersList };
    }

    const getTestWord = (question: number) => {
        let testWordList: TestWord[] = testQuestions?.filter(testWord => testWord.question === question) ?? []
        return testWordList[0]
    }

    const continueButtonOnPress = () => {
        fi.endTestRound(currentTestRoundId, determineIfRoundAnswerCorrect());
        setAnswers([...answers, answer]);
        setAnswer("");
        if (page < numQuestions) {
            setPage(page + 1);
        }
        fi.startTestRound(testSessionId, page).then(result => setCurrentTestRoundId(result));
    }

    const determineIfRoundAnswerCorrect = () => {
        return answer === testQuestion?.correctlyPaired;
    }

    React.useLayoutEffect(() => {
        navigation.setOptions(TEST_HEADER_OPTIONS);
      }, [navigation]);

    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={styles.row}>
                    <AnimatedBar
                        progress={page / numQuestions}
                        height={6}
                        borderColor="#FFF"
                        barColor="#5EAFDF"
                        fillColor="#5EAFDF20"
                        fillStyle={{borderRadius: 10}}
                        barStyle={{borderRadius: 10}}
                        animate={false}
                        duration={500}
                        row
                    >
                    </AnimatedBar>
                    <Text style={{color: "#5eafdf", fontSize: 16, paddingLeft: 8, fontFamily: 'Montserrat_400Regular'}}>{page} / {numQuestions}</Text>
                </View>
                <Text style={{fontSize: 36, fontFamily: 'Montserrat_400Regular'}}>Do these words share the same meaning?</Text>
                <View style={styles.wordsContainer}>
                    <Text style={styles.wordsText}>{ testQuestion?.turkish }</Text>
                    <Text style={styles.wordsText}>{ testQuestion?.english }</Text>
                </View>
                <View style={styles.answerContainer}>
                    <TouchableOpacity
                        onPress={() => setAnswer("yes")} 
                        style={answer === "yes" ? styles.selectedAnswerButton : styles.unselectedAnswerButton}>
                        <Text style={answer === "yes" ? styles.selectedAnswerText : styles.unselectedAnswerText}>
                            Yes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => setAnswer("no")} 
                    style={answer === "no" ? styles.selectedAnswerButton : styles.unselectedAnswerButton}>
                        <Text style={answer === "no" ? styles.selectedAnswerText : styles.unselectedAnswerText}>
                            No
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    disabled={!answer} 
                    onPress={continueButtonOnPress} 
                    style={answer ? styles.continueButton : {...styles.continueButton, opacity: 0.5}}>
                    <Text style={{color: "#6E81E7", fontSize: 22, fontFamily: 'Montserrat_400Regular'}}>continue ></Text>
                </TouchableOpacity>
            </View>
        </DraxProvider>
    )
}

const styles = StyleSheet.create({
   container: {
        flexDirection: "column",
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%",
        paddingLeft: "5%",
        paddingRight: "5%",
   },
   rowText: {
        marginRight: 20,
  },
  row: {
        flexDirection: "row",
        alignItems: "center",
  },
    wordsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    wordsText: {
        fontSize: 40,
        color: "#5EAFDF",
        fontFamily: 'Montserrat_400Regular'
    },
    answerContainer: {
        width: "100%",
        height: "20%",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    selectedAnswerButton: {
        backgroundColor: "#6E81E7",
        borderColor: "#6E81E7",
        borderWidth: 3,
        borderRadius: 12,
        justifyContent: 'center',
        height: '40%',
        width: '90%',
        paddingLeft: "10%",
    },
    unselectedAnswerButton: {
        backgroundColor: "#FFF",
        borderColor: "#6E81E7",
        borderWidth: 3,
        borderRadius: 12,
        justifyContent: 'center',
        height: '40%',
        width: '90%',
        paddingLeft: "10%",
    },
    selectedAnswerText: {
        color: "#FFF", 
        fontSize: 24,
        fontFamily: 'Montserrat_500Medium'
    },
    unselectedAnswerText: {
        color: "#6E81E7", 
        fontSize: 24,
        fontFamily: 'Montserrat_500Medium'
    },
    continueButton: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        backgroundColor: "#FFF",
        width: "100%",
        maxHeight: "6%",
        marginTop: "7%",
        overflow: 'hidden',
        marginBottom: "3%",
    }
})
