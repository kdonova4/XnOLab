import { createContext, use, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginRequest } from "../../types/Auth/LoginRequest";
import type { UserInfoResponse } from "../../types/Auth/UserInfoResponse";
import { useNavigate } from "react-router-dom";
import { getUserDetails, login, logout } from "../../api/AuthAPI";

interface AuthContextType {
    appUser: UserInfoResponse | null;
    loading: boolean;
    loginUser: (credentials: LoginRequest) => Promise<void>;
    logoutUser: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [appUser, setAppUser] = useState<UserInfoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const refreshUser = async () => {
        try {
            const user = await getUserDetails();
            setAppUser(user)
        } catch {
            setAppUser(null);
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (credentials: LoginRequest) => {
        const user = await login(credentials);
        setAppUser(user);
        navigate("/");
    }

    const logoutUser = async () => {
        try {
            const response = await logout();
        } catch {
            
        } finally {
            setAppUser(null);
            navigate("/");
        }
    }

    useEffect(() => {
        refreshUser();
    }, [])

    return (
        <AuthContext.Provider value={{ appUser, loading, loginUser, logoutUser, refreshUser }}>
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