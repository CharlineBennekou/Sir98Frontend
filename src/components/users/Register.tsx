import * as React from 'react';

export class RegisterComp extends React.Component {
    private async search(formData: FormData): Promise<void> {
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
                    <label htmlFor="passwordRepeat">Gentag adgangskode</label>
                    <br/>
                    <input type="text" id="passwordRepeat" name="passwordRepeat"/>
                    <br/>
                    <br/>
                    <input type="submit" value="Fortryd"/>
                    <input type="submit" value="Registrer"/>
                </form> 
            </div>
        );
    }
}

