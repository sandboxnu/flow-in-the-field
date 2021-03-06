import { useFocusEffect, useNavigation } from "@react-navigation/core"
import { User } from "firebase/auth"
import React, { useState } from "react"
import { LoadingScreen } from "../../components/LoadingScreen"
import FirebaseInteractor from "../../firebase/firebaseInteractor"
import LoginPage from "./login"
import RecoverPasswordPage from "./recoverPassword"
import SignUpPage from "./signUp"


type CurrentPage = "signUp" | "signIn" | "recoverPassword"
const fi = new FirebaseInteractor();
export default function SignInFlow() {

    const userSignedIn = () => {
        if (fi.auth.currentUser?.emailVerified) {
            fi.getUser().then((user) => {
                if (user.hasGivenConsent) {
                    navigation.navigate("HomeScreen")
                }
                else {
                    navigation.navigate("ConsentScreen")
                }
            })
        } else {
            navigation.navigate("EmailVerification")
        }
    };

    const [currentPage, setCurrentPage] = useState<CurrentPage>("signUp")
    const [currentUser, setCurrentUser] = useState<User | null | "unknown">("unknown")
    const navigation = useNavigation();

    useFocusEffect(() => {
        fi.trySignedIn().then(user => {
            setCurrentUser(user)
            if (fi.auth.currentUser) userSignedIn();
        });
    })

    if (currentUser) {
        return <LoadingScreen />
    } else {
        if (currentPage == 'signIn') {
            return (<LoginPage
                goToSignUp={() => setCurrentPage("signUp")}
                goToRecoveryScreen={() => setCurrentPage("recoverPassword")}
                goToAccountSettings={userSignedIn} />)
        } else if (currentPage == "recoverPassword") {
            return (<RecoverPasswordPage goToSignIn={() => setCurrentPage("signIn")} />)
        } else {
            return (<SignUpPage goToSignIn={() => setCurrentPage("signIn")} goToAccountSettings={userSignedIn} />)
        }
    }
}
