import { useState } from "react";
import type { LoginRequest } from "../../types/Auth/LoginRequest";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { enqueueSnackbar } from "notistack";

function LoginPage() {

    const [credentials, setCredentials] = useState<LoginRequest>({
        username: "",
        password: ""
    })
    
    const { loginUser, loading } = useAuth();
    const navigate = useNavigate();
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials, [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        try {
            await loginUser(credentials);
            enqueueSnackbar("Login Successful", { variant: "success" })
        } catch(e) {
            const message = e instanceof Error ? e.message : "Something went wrong";
            enqueueSnackbar(message, { variant: "error" })
        }
    }
    return(
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <h2>Enter Username</h2>
                    <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({...prev, username: e.target.value}))}
                    placeholder="Enter Username"
                    required
                    />
                    <input
                    type="text"
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({...prev, password: e.target.value}))}
                    placeholder="Enter Password"
                    required
                    />
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">
                    {loading ? "Logging In..." : "Login"}
                </button>
                </form>
            </div>
        </>
    )
}

export default LoginPage;