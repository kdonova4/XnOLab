import { useState } from "react";
import type { LoginRequest } from "../../types/Auth/LoginRequest";
import { useAuth } from "../hooks/AuthContext";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Container, Divider, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

function LoginPage() {

    const [credentials, setCredentials] = useState<LoginRequest>({
        username: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { loginUser } = useAuth();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials, [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        try {
            setLoading(true);
            await loginUser(credentials);
            enqueueSnackbar("Login Successful", { variant: "success" })
        } catch (e) {
            const message = e instanceof Error ? e.message : "Something went wrong";
            enqueueSnackbar(message, { variant: "error" })
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>

            <Container className="container">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <Card variant="outlined" sx={{ minWidth: '30%', backgroundColor: '#181a1b', color: 'white' }}>
                        <Box sx={{ p: 2 }}>
                            <Stack

                                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <Typography gutterBottom variant="h5" component="div">
                                    Login
                                </Typography>

                            </Stack>
                        </Box>
                        <Divider sx={{ borderColor: 'gray' }} />

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ p: 2 }}
                        >
                            <Stack spacing={1} sx={{ alignItems: 'center' }} gap={2}>

                                <FormControl sx={{ m: 1, width: '35ch', color: 'white' }} variant="outlined">
                                    <TextField
                                        slotProps={{
                                            inputLabel: {
                                                sx: {
                                                    color: "white",
                                                    "&.Mui-focused": {
                                                        color: "white",
                                                    },
                                                },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "gray",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "white",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "white",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "white",
                                            },
                                        }}
                                        id="username-input"
                                        label="Username"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl

                                    sx={{
                                        m: 1,
                                        width: "35ch",

                                        "& .MuiInputLabel-root": {
                                            color: "white",
                                        },

                                        // 👇 THIS is the missing piece
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "white !important",
                                        },

                                        "& .MuiOutlinedInput-input": {
                                            color: "white",
                                        },

                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "gray",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "white",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "white",
                                            },
                                        },

                                        "& .MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                    }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">
                                        Password
                                    </InputLabel>

                                    <OutlinedInput

                                        name="password"
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>

<LoadingButton
  type="submit"
  variant="contained"
  loading={loading}
  sx={{
    backgroundColor: "green",
    color: "white",

    "&:hover": {
      backgroundColor: "darkgreen",
    },

    // keep button visible in loading state
    "&.Mui-disabled": {
      backgroundColor: "darkgreen",
      color: "transparent",   // 👈 hides text completely
      opacity: .7,
    },

    // hide label completely
    "& .MuiLoadingButton-label": {
      visibility: loading ? "hidden" : "visible",
    },
  }}
>
  Login
</LoadingButton>

                                <Typography sx={{ color: 'white' }}>
                                    or <Link href="/register">Sign-Up</Link>
                                </Typography>

                            </Stack>
                        </Box>
                    </Card>
                </Box>

            </Container>
        </>
    )
}

export default LoginPage;