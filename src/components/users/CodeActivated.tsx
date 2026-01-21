import * as React from 'react';

export class CodeActivationComp extends React.Component<{}, { progress: string}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            progress: "load"
        };   
    }

    //to test this page disable strict mode
    //https://stackoverflow.com/questions/72406486/react-fetch-api-being-called-2-times-on-page-load
    public render(): React.ReactNode {
        const parameters = new URLSearchParams(location.search)
        const code: string | null = parameters.get("code");
        if(this.state.progress === "load") {
            fetch(`https://api.mnoergaard.dk/api/User/Activate/code=${code}`, {
                method: 'GET',
            }).then((response) => {
                this.setState({ progress: (response.status == 200) ? "ok" : "fail" })
            });
        }

        if(this.state.progress === "fail" ) {
           return (<h1>Ugyldig aktiveringskode.</h1>);
        }
        if(this.state.progress === "ok") {
            return (<h1>Konto er nu aktiveret</h1>);
        }
         return (<h1>Aktiverer konto</h1>);
    }
}