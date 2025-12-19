import * as React from 'react';
import { Navigate } from "react-router-dom";
import "./../../styles/spinner.css";
import "./../../styles/login.css";
import toast from 'react-hot-toast';

export class LoginComp extends React.Component {
    state = {
        loading: false,
        submitted: false

    };
    private search = async (formData: FormData): Promise<void> => {
        this.setState({ loading: true });

        const body = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await fetch(
                'https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/User/Login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                }
            );

            if (response.status === 401) {
                alert(await response.text());
                this.setState({ loading: false });
                return;
            }

            if (response.ok) {
                const responseContent = await response.text();
                const lines: string[] = responseContent.split("\n");

                const token = lines[0];
                localStorage.setItem("JWToken", token);
                const role = lines[1]
                localStorage.setItem("Role",role);
                this.setState({ submitted: true });
                toast.success(`Logget ind`, {
                    iconTheme: {
                        primary: "#00aa00",     // orange circle
                        secondary: "#fff",      // white background
                        
                    },
                    duration: 5000,
                });
            }


        } catch {
            alert("Noget gik galt");
            this.setState({ loading: false });
        }



    }


    public render(): React.ReactNode {
        if (this.state.submitted) {
            return <Navigate to="/" />
        }


        return (
            <div className="login-page">
                <div className="login-card">

                    <form action={this.search}>
                        <div className="field">
                            <label htmlFor="email">Email</label>

                            <input type="text" id="email" name="email" />
                        </div>

                        <br />
                        <div className="field">
                            <label htmlFor="password">Adgangskode</label>

                            <input type="text" id="password" name="password" />
                        </div>



                        {this.state.loading && <div className="spinner"></div>}




                        <div className="buttons">
                            <button
                                type="button"
                                onClick={() => window.location.href = "/"}
                            >
                                Fortryd
                            </button>



                            <button type="submit" disabled={this.state.loading}>
                                {this.state.loading ? "Logger ind..." : "Log ind"}
                            </button>
                        </div>

                        <br /><br />

                        <a href="/register">Registrer her</a>

                    </form>
                </div>
            </div>
        );
    }
}

//<input onClick={() => this.navigate("/")} value="Fortryd"/>
//<button onClick={() => this.navigate("/")}>Fortryd</button>