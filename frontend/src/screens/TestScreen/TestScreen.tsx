import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BLUE, GREY } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { User, Word, UID, GameType } from "../../models/types";
import { durstenfeldShuffle } from "../../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../../components/LoadingScreen";
import { NavigationContainer } from "@react-navigation/native";
import AnimatedProgress from 'react-native-reanimated-progress-bar';

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
    const [page, setPage] = useState<number>(0);
    const numQuestions = 50;

    React.useLayoutEffect(() => {
        navigation.setOptions(TEST_HEADER_OPTIONS);
      }, [navigation]);

    const testButtonOnPress = () => {
        if (page < numQuestions) {
            setPage(page + 1);
        } else {
            navigation.navigate("TestResultsScreen", { correct: 30, total: 50 })
        }
    }


    return (
        <DraxProvider>
            <View style={styles.container}>
                <Text style={{color: "#000", fontSize: 22}}>top</Text>
                <AnimatedProgress 
                    fill="light-blue" // fill of progress bar
                    current={2} // current position current/total
                    total={5} // total parts for iterations
                    style={{ height: 6 }} // container style
                />
                <Text style={{color: "#000", fontSize: 22}}>bottom</Text>
                <Text style={{color: "#000", fontSize: 22}}>bottom</Text>
                <TouchableOpacity style={styles.startButton} onPress={testButtonOnPress}>
                    <Text style={{color: "#FFF", fontSize: 22}}>continue</Text>
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
        paddingTop: "5%"
   },
   startButton: {
    backgroundColor: "#5FBFF8",
    borderColor: "#5FBFF8",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '7.5%',
    width: '75%',
    paddingHorizontal: "5%",
    marginHorizontal: '3%',
    marginVertical: "1%",
    paddingVertical: 10,
    marginTop: "10%"
    }
})
