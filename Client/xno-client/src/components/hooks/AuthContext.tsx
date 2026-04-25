import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginRequest } from "../../types/Auth/LoginRequest";
import type { UserInfoResponse } from "../../types/Auth/UserInfoResponse";
import { useNavigate } from "react-router-dom";
import { getUserDetails, login, logout } from "../../api/AuthAPI";
import { enqueueSnackbar } from "notistack";

interface AuthContextType {
    appUser: UserInfoResponse | null;
    loading: boolean;
    loginUser: (credentials: LoginRequest) => Promise<void>;
    logoutUser: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [appUser, setAppUser] = useState<UserInfoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const refreshUser = async () => {
    try {
        const user = await getUserDetails();
        setAppUser(user);
        setIsAuthenticated(true);
    } catch {
        setAppUser(null);
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
};

    const loginUser = async (credentials: LoginRequest) => {
        const user = await login(credentials);
        setAppUser(user);
        setIsAuthenticated(true)
        navigate("/");
    }

    const logoutUser = async () => {
    try {
        navigate("/");
        const data = await logout();
        enqueueSnackbar(data.message, { variant: "success" });

        setAppUser(null);
        setIsAuthenticated(false);

        // optional: prevents immediate re-fetch flicker
        await new Promise(res => setTimeout(res, 50));

        
    } catch {
        setAppUser(null);
        setIsAuthenticated(false);
        navigate("/");
    }
};

    useEffect(() => {
        refreshUser();
    }, [])

    return (
        <AuthContext.Provider value={{ appUser, loading, loginUser, logoutUser, refreshUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};