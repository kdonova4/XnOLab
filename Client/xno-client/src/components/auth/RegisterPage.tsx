import { useState } from "react";
import type { SignUpRequest } from "../../types/Auth/SignUpRequest";
import { enqueueSnackbar } from "notistack";
import { register } from "../../api/AuthAPI";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

    const [credentials, setCredentials] = useState<SignUpRequest>({
        username: "",
        email: "",
        password: "",
        roles: ["user"]
    })
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials, [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const data = await register(credentials);
            enqueueSnackbar(data.message, { variant: "success" })
            navigate("/login");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong"
            enqueueSnackbar(message, { variant: "error" })
        }
    }

    return (
        <>
            <div>
                <Stack spacing={2} alignItems={"center"}>
                    <form onSubmit={handleSubmit}>
                        <h2>Enter Username</h2>
                        <input
                            name="username"
                            type="text"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                        />
                        <h2>Enter Email</h2>
                        <input
                            name="email"
                            type="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            required
                        />
                        <h2>Enter Password</h2>
                        <input
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
                            Register
                        </button>
                        <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-3 py-1 rounded">
                            Go Login
                        </button>
                    </form>
                    
                </Stack>
            </div>
        </>
    )
}

export default RegisterPage;