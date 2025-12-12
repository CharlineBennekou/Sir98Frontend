import * as React from 'react';
import { Navigate } from "react-router-dom";

export class LoginComp extends React.Component {
 state = {
        submitted: false
    };
    private async search(formData: FormData): Promise<void> {
            const email = formData.get("email");
            const password = formData.get("password")
            const body = {
                email: email,
                password: password,
                
            };
//Todo: Move this to Redux api slice
            fetch('https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/User/Login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then((response: Response) => {
                if(response.status === 401) {
                    response.text().then(text => {
                        alert(text);
                    });
                }
                if(response.ok) {
                    response.text().then(text => {
                        localStorage.setItem("JWToken", text);
                        alert("Du er nu logget ind")
                    });   
                }
            });
        }

        private onSubmit() {
            this.setState({ submitted: true });
        }

    public render(): React.ReactNode {
          

        return (
            <div>
                <form action={this.search}>
                    <label htmlFor="email">Email</label>
                    <br/>
                    <input type="text" id="email" name="email"/>
                    <br/>
                    <br/>
                    <label htmlFor="password">Adgangskode</label>
                    <br/>
                    <input type="text" id="password" name="password"/>
                    <br/>
                    <br/>
                    <a>Glemt adgangskode</a>
                    <br/>
                    <br/>
                    <input type="submit" onClick={() => this.onSubmit()} value="Fortryd"/>
                    {this.state.submitted && <Navigate to="/" />}
                    
                    <input type="submit" value="Log ind"/>
                    <br/>
                    <br/>
                    <a>Registrer her</a>
                </form> 
            </div>
        );
    }
}

//<input onClick={() => this.navigate("/")} value="Fortryd"/>
//<button onClick={() => this.navigate("/")}>Fortryd</button>