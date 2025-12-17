import AppHeader from "../components/layout/AppHeader";
import { CodeActivationComp } from "../components/users/CodeActivated";

export default function ActivateCodePage() {
    return (
        <>
            <AppHeader title="Aktiver konto" backTo="/"/>
            <CodeActivationComp/>
        </>
    );
}