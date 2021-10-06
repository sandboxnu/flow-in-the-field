import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from "firebase/app";
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cAIskIjacQRxhbJlJxJNizGOlbRj4gk",
  authDomain: "flowinthefield.firebaseapp.com",
  projectId: "flowinthefield",
  storageBucket: "flowinthefield.appspot.com",
  messagingSenderId: "788116866647",
  appId: "1:788116866647:web:0e2cbfc671576c8089c512"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
