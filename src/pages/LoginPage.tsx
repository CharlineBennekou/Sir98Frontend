import { LoginComp } from "../components/users/Login";
import AppHeader from "../components/layout/AppHeader";

export default function LoginPage() {
    return (
        <>
            <AppHeader title="Login" backTo="/"/>
            <LoginComp />
        </>
    );
}