import * as React from 'react';



export class CodeActivationComp extends React.Component<{}, { progress: string}> {

    constructor(props: {}) {
        super(props);
        this.state = {
            progress: "load"
        }
        const parameters = new URLSearchParams(location.search)
        const code: string | null = parameters.get("code");
        console.log(code)
        if(!code) {
            this.state.progress
        }
        fetch(`https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/User/Activate/code=${code}`, {
            method: 'GET',
        }).then((response) => {
            if(response.ok) {
                this.setState({ progress: "ok" })
            } else {
                this.setState({ progress: "fail" })
            }
            console.log(response)
        });
    }

    public render(): React.ReactNode {
        
        if(this.state.progress === "load" ) {
            return (<h1>Aktiverer konto</h1>);
        }
        if(this.state.progress === "ok") {
            return (<h1>Konto er nu aktiveret</h1>);
        }
        return (
            <h1>Ugyldig aktiveringskode.</h1>
        );
    }
}

