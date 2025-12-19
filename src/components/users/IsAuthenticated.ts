export function isAuthenticated(): boolean {
        return !!localStorage.getItem("JWToken") && !!localStorage.getItem("Email");
    };
    