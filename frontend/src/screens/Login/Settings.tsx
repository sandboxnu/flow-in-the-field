import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { BLUE, GREY, LIGHTPURPLE } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/FirebaseInteractor";

const fi = new FirebaseInteractor();

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.scroll}>
          <ScrollView horizontal>
            <Text style={styles.value}>{fi.email}</Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Password</Text>
        <Text style={styles.value}>********</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.buttonText}>change password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            fi.logout().then(() => navigation.navigate("SignInFlow"));
          }}
        >
          <Text style={styles.buttonText}>logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    height: "100%",
  },
  divider: {
    borderWidth: 0.5,
    borderColor: GREY,
  },
  row: {
    flexDirection: "row",
    height: "10%",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontWeight: "500",
    color: BLUE,
    fontSize: 24,
    textAlignVertical: "center",
  },
  value: {
    flex: 2,
    textAlign: "right",
    textAlignVertical: "center",
    fontSize: 21,
  },
  button: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: LIGHTPURPLE,
    justifyContent: "center",
    padding: "2%",
  },
  buttonText: {
    color: "white",
    fontSize: 21,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  gradient: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 10,
  },
});
