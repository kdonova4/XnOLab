import { useState } from "react";
import type { LoginRequest } from "../../types/Auth/LoginRequest";
import { useAuth } from "../hooks/AuthContext";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const [credentials, setCredentials] = useState<LoginRequest>({
        username: "",
        password: ""
    })
    const navigate = useNavigate();
    
    const { loginUser, loading } = useAuth();
    
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
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    required
                    />
                    <input
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                    />
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">
                    {loading ? "Logging In..." : "Login"}
                </button>
                <button onClick={() => navigate("/register")} className="bg-blue-600 text-white px-3 py-1 rounded">
                            Go Register
                        </button>
                </form>
            </div>
        </>
    )
}

export default LoginPage;