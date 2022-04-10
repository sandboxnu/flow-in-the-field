import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { DraxProvider } from "react-native-drax";
import { useNavigation } from "@react-navigation/core";
import AnimatedBar from "react-native-animated-bar";

const fi = new FirebaseInteractor();

const TEST_HEADER_OPTIONS = {
    headerTitle: () => { return <Text style={{color:"#5eafdf", fontSize:20}}>Test Your Knowledge</Text> },
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
    const { testId } = props.route.params;
    const [page, setPage] = useState<number>(1);
    const numQuestions = 50;
    const TESTWORDS = require('./testWords.json');
    const [answer, setAnswer] = useState<string>("");
    const [answers, setAnswers] = useState<string[]>([]);
    const answerKey = ['no', 'yes', 'no', 'no', 'yes', 'yes', 'no', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'no', 'yes', 'yes', 'yes', 'no', 'yes', 'yes', 'yes', 'no', 'no', 'yes', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'no', 'no', 'yes', 'no', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'no', 'yes', 'no', 'yes', 'no', 'yes', 'yes', 'yes', 'yes', 'yes'];

    const gradeAnswers = () => {
        let correctAnswers = 0;
        for (let question = 1; question <= numQuestions; question++) {
            if (answers && answers[question - 1] === answerKey[question - 1]) {
                correctAnswers++;
            }
        }
        return correctAnswers;
    }

    const getCorrectWords = () => {
        // const correctWords = currentPairs?.filter(({ english, correctEnglishWord }) => english === correctEnglishWord)
        //     .map((maybeWordPair) => ({
        //         turkish: maybeWordPair.turkish,
        //         english: maybeWordPair.correctEnglishWord
        //     })) ?? null

        let correctWordsArray = [];

        for (let question = 1; question <= numQuestions; question++) {
            if (answers && answers[question - 1] === answerKey[question - 1]) {
                correctWordsArray.push({
                    english: TESTWORDS.testWords[question - 1]["english"],
                    turkish: TESTWORDS.testWords[question - 1]["turkish"],
                    answer: answerKey[question - 1]
                })
            }
        }

        return correctWordsArray;
    }

    React.useLayoutEffect(() => {
        navigation.setOptions(TEST_HEADER_OPTIONS);
      }, [navigation]);

      useEffect(() => {
        if (answers.length == numQuestions) {
            let score = gradeAnswers();
            fi.endTest(testId, score, getCorrectWords()).then(() => navigation.navigate("TestResultsScreen", { correct: score, total: numQuestions }));
        } 
      }, [answers])

    const testButtonOnPress = () => {
        setAnswers([...answers, answer]);
        setAnswer("");
        if (page < numQuestions) {
            setPage(page + 1);
        }
    }

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
                    <Text style={{color: "#5eafdf", fontSize: 16, paddingLeft: 8}}>{page} / {numQuestions}</Text>
                </View>
                <Text style={{fontSize: 36}}>Do these words share the same meaning?</Text>
                <View style={styles.wordsContainer}>
                    <Text style={styles.wordsText}>{TESTWORDS.testWords[page - 1]["turkish"]}</Text>
                    <Text style={styles.wordsText}>{TESTWORDS.testWords[page - 1]["english"]}</Text>
                </View>
                <View style={styles.answerContainer}>
                    <TouchableOpacity onPress={() => setAnswer("yes")} style={answer === "yes" ? styles.selectedAnswerButton : styles.unselectedAnswerButton}>
                        <Text style={answer === "yes" ? styles.selectedAnswerText : styles.unselectedAnswerText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAnswer("no")} style={answer === "no" ? styles.selectedAnswerButton : styles.unselectedAnswerButton}>
                        <Text style={answer === "no" ? styles.selectedAnswerText : styles.unselectedAnswerText}>No</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={!answer} onPress={testButtonOnPress} style={answer ? styles.continueButton : {...styles.continueButton, opacity: 0.5}}>
                    <Text style={{color: "#6E81E7", fontSize: 22}}>continue ></Text>
                </TouchableOpacity>
            </View>
        </DraxProvider>
    )
}


const defaultStyle = StyleSheet.create({

});

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
    },
    unselectedAnswerText: {
        color: "#6E81E7", 
        fontSize: 24
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
