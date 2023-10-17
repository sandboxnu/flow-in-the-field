/* eslint-disable prettier/prettier */
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AnimatedBar from "react-native-animated-bar";
import { DraxProvider } from "react-native-drax";
import { min } from "react-native-reanimated";

import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { TestWord, UID } from "../../models/types";

const fi = new FirebaseInteractor();

const TEST_HEADER_OPTIONS = {
  headerTitle: () => {
    return (
      <Text style={{ color: "#5eafdf", fontSize: 20 }}>
        Test Your Knowledge
      </Text>
    );
  },
  title: "",
  headerTitleAlign: "center" as "center",
  headerShadowVisible: false,
  headerTintColor: "#FFF",
  headerBackTitle: "",
  headerStyle: {
    backgroundColor: "#FFF",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const ROUND_LENGTH = 15;

export interface TestScreenProps {
  route: any;
}

export default function TestScreen(props: TestScreenProps) {
  const navigation = useNavigation();
  const { testSessionId } = props.route.params;
  const [currentTestRoundId, setCurrentTestRoundId] = useState<UID>("");
  const [page, setPage] = useState<number>(1);
  const [finished, setFinished] = useState<boolean>(false);

  const numQuestions = 50;
  const [testQuestion, setTestQuestion] = useState<TestWord>();
  const [testQuestions, setTestQuestions] = useState<TestWord[]>();
  const [answer, setAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [timer, setTimer] = useState<number>(ROUND_LENGTH);
  const [resetTimer, setResetTimer] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    fi.getTestWord(page)
      .then((testWord) => {
        setTestQuestion(testWord);
      })
      .catch(console.error);
    fi.getTestQuestions().then((testWords) => {
      setTestQuestions(testWords);
    });

    if (finished) {
      const testGradingInfo = gradeAnswers();
      fi.endTestSession(
        testSessionId,
        testGradingInfo.score,
        testGradingInfo.correctAnswers
      ).then(() =>
        navigation.navigate("TestResultsScreen", {
          correct: testGradingInfo.score,
          total: numQuestions,
        })
      );
    } else {
      fi.startTestRound(testSessionId, page).then((result) =>
        setCurrentTestRoundId(result)
      );
    }
  }, [page, finished]);

  useEffect(() => {
    setIsLoading(false);
  }, [currentTestRoundId]);

  const gradeAnswers = () => {
    let numCorrectTestAnswers = 0;
    const correctTestAnswersList = [];

    for (let question = 1; question <= numQuestions; question++) {
      const testWord = getTestWord(question);

      if (answers && answers[question - 1] === testWord.correctlyPaired) {
        numCorrectTestAnswers++;
        correctTestAnswersList.push(testWord);
      }
    }
    return {
      score: numCorrectTestAnswers,
      correctAnswers: correctTestAnswersList,
    };
  };

  const getTestWord = (question: number) => {
    const testWordList: TestWord[] =
      testQuestions?.filter((testWord) => testWord.question === question) ?? [];
    return testWordList[0];
  };

  const continueButtonOnPress = () => {
    if (!isLoading) {
      setIsLoading(true);
      fi.endTestRound(currentTestRoundId, determineIfRoundAnswerCorrect()).then(
        () => {
          setAnswers([...answers, answer]);
          setAnswer("");
          if (page < numQuestions) {
            setPage(page + 1);
            setTimer(ROUND_LENGTH);
            setResetTimer(true);
          } else {
            setFinished(true);
          }
        }
      );
    }
  };

  React.useEffect(() => {
    if (resetTimer) {
      const counter: any = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);

      if (timer === 0) {
        // countdown is finished
        setResetTimer(false);
        clearInterval(counter);
        continueButtonOnPress();
      }
      return () => clearInterval(counter);
    }
  }, [timer, resetTimer, setResetTimer]);

  const determineIfRoundAnswerCorrect = () => {
    return answer === testQuestion?.correctlyPaired;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions(TEST_HEADER_OPTIONS);
  }, [navigation]);

  const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${formattedSec}`;
  }

  return (
    <DraxProvider>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={{ color: "#5eafdf", fontSize: 16, paddingRight: 8 }}>
            {page} / {numQuestions}
          </Text>
          <AnimatedBar
            progress={page / numQuestions}
            height={6}
            borderColor="#FFF"
            barColor="#5EAFDF"
            fillColor="#5EAFDF20"
            fillStyle={{ borderRadius: 10 }}
            barStyle={{ borderRadius: 10 }}
            animate={false}
            duration={500}
            row
          />
          <Text style={styles.timer}>
            {formatTimer(timer)}
          </Text>
        </View>
        <Text style={{ fontSize: 36 }}>
          Do these words share the same meaning?
        </Text>
        <View style={styles.wordsContainer}>
          <Text style={styles.wordsText}>{testQuestion?.turkish}</Text>
          <Text style={styles.wordsText}>{testQuestion?.english}</Text>
        </View>
        <View style={styles.answerContainer}>
          <TouchableOpacity
            onPress={() => setAnswer("yes")}
            style={
              answer === "yes"
                ? styles.selectedAnswerButton
                : styles.unselectedAnswerButton
            }
          >
            <Text
              style={
                answer === "yes"
                  ? styles.selectedAnswerText
                  : styles.unselectedAnswerText
              }
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAnswer("no")}
            style={
              answer === "no"
                ? styles.selectedAnswerButton
                : styles.unselectedAnswerButton
            }
          >
            <Text
              style={
                answer === "no"
                  ? styles.selectedAnswerText
                  : styles.unselectedAnswerText
              }
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={!answer || isLoading}
          onPress={continueButtonOnPress}
          style={
            answer
              ? styles.continueButton
              : { ...styles.continueButton, opacity: 0.5 }
          }
        >
          <Text style={{ color: "#6E81E7", fontSize: 22 }}>{"continue >"}</Text>
        </TouchableOpacity>
      </View>
    </DraxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
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
  timer: {
    color: "#5eafdf",
    fontSize: 16,
    paddingLeft: 8,
    width: "12%",
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
    justifyContent: "center",
    height: "40%",
    width: "90%",
    paddingLeft: "10%",
  },
  unselectedAnswerButton: {
    backgroundColor: "#FFF",
    borderColor: "#6E81E7",
    borderWidth: 3,
    borderRadius: 12,
    justifyContent: "center",
    height: "40%",
    width: "90%",
    paddingLeft: "10%",
  },
  selectedAnswerText: {
    color: "#FFF",
    fontSize: 24,
  },
  unselectedAnswerText: {
    color: "#6E81E7",
    fontSize: 24,
  },
  continueButton: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
    width: "100%",
    maxHeight: "6%",
    marginTop: "7%",
    overflow: "hidden",
    marginBottom: "3%",
  },
});
