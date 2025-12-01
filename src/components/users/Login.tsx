import * as React from 'react';

export class LoginComp extends React.Component {
    private async search(formData: FormData): Promise<void> {
            const email = formData.get("email");
            const password = formData.get("password")
            const body = {
                email: email,
                password: password,
                
            };

            fetch('https://localhost:7275/api/User/Login', {
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
                    });   
                }
            });
/*
            if (!response.ok) {
                const text = await response.text();
                console.error('Failed to send subscription', text);
                alert('Failed to send subscription to server.');
                return;
            }
                */

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
                    <input type="submit" value="Fortryd"/>
                    <input type="submit" value="Log ind"/>
                    <br/>
                    <br/>
                    <a>Registrer her</a>
                </form> 
            </div>
        );
    }
}

