import { useNavigation } from "@react-navigation/core"
import React, { useState } from "react"
import AccountSettings from "./accountSettings"
import LoginPage from "./login"
import RecoverPasswordPage from "./recoverPassword"
import SignUpPage from "./signUp"


type CurrentPage = "signUp" | "signIn" | "recoverPassword"

export default function SignInFlow() {
    const [currentPage, setCurrentPage] = useState<CurrentPage>("signUp")
    const navigation = useNavigation();
    if (currentPage == 'signIn') {
        return (<LoginPage
            goToSignUp={() => setCurrentPage("signUp")}
            goToRecoveryScreen={() => setCurrentPage("recoverPassword")}
            goToAccountSettings={() => navigation.navigate({key: "SignedInGame"})} />)
    } else if (currentPage == "recoverPassword") {
        return (<RecoverPasswordPage goToSignIn={() => setCurrentPage("signIn")} />)
    } else {
        return (<SignUpPage goToSignIn={() => setCurrentPage("signIn")} goToAccountSettings={() => navigation.navigate({key: "SignedInGame"})} />)
    }
}