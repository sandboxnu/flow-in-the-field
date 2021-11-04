import React, { useState } from "react"
import LoginPage from "./login"
import RecoverPasswordPage from "./recoverPassword"
import SignUpPage from "./signUp"


type CurrentPage = "signUp" | "signIn" | "recoverPassword"

export default function SignInFlow() {
    const [currentPage, setCurrentPage] = useState<CurrentPage>("signUp")

    if (currentPage == 'signIn') {
        return (<LoginPage goToSignUp={() => setCurrentPage("signUp")} goToRecoveryScreen={() => setCurrentPage("recoverPassword")}/>)
    } else if (currentPage == "recoverPassword") {
        return(<RecoverPasswordPage goToSignIn={() => setCurrentPage("signIn")} />)
    } else {
        return (<SignUpPage goToSignIn={() => setCurrentPage("signIn")}/>)
    }
}