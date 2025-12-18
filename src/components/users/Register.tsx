import * as React from 'react';
import AppHeader from "../../components/layout/AppHeader";
import { Link, Navigate } from "react-router-dom";
import "../../styles/register.css";



export class RegisterComp extends React.Component {
    state = {
        goToLogin: false
    };


    private search = async(formData: FormData): Promise<void> => {
            const email = formData.get("email");
            const password = formData.get("password")
            const passwordRepeat = formData.get("passwordRepeat")

            if(password?.toString() != passwordRepeat?.toString()) {
                alert("Indtastet adgangskode matcher ikke")
                return;
            }

            const body = {
                email: email,
                password: password,
                PasswordRepeated: passwordRepeat
            };

//Todo: Move this to redux api slice
            fetch('https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/User/Register', {
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
                if(response.status === 429) {
                    alert("Registrerings forsøg opbrugt, prøv igen om 5 minutter.")
                }
                if(response.ok) {
                    alert(`Link til aktivering af konto er sendt til ${email}.`)
                }
            });
        }

    public render(): React.ReactNode {
        if (this.state.goToLogin) {
            return <Navigate to="/login" />;
        }
        

        return (
            <div className="register-page">
            <div className="register-card">
                <form action={this.search}>
                    <AppHeader title={"Register"} backTo='/Login'/>
                    <div style={{ marginTop: 70 }}></div>
                    
                    <div className="fieldReg">
                      <label htmlFor="email">Email</label>
                     <input type="text" id="email" name="email"/>
                    </div>
                    
                    <div className="fieldReg">
                    <label htmlFor="password">Adgangskode</label>
                    <input type="password" id="password" name="password"/>
                    </div>
                    <div className="fieldReg">
                    <label htmlFor="passwordRepeat">Gentag adgangskode</label>
                    <input type="password" id="passwordRepeat" name="passwordRepeat"/>
                    </div>
                     <br/>
                  


                    <div className="buttons">
                        <button type="submit" className="primary">
                            Registrer</button>  
                    </div>
                    <br/>

                     <Link to="/login" className="button secondary">
                             Fortryd
                    </Link>
                </form> 
            </div>
         </div>
        );
    }
}

