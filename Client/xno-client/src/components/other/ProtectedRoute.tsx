import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { enqueueSnackbar } from "notistack";

type ProtectedRouteProps = {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    
    if(!isAuthenticated && !loading) {
        enqueueSnackbar("Please Login To Access This Feature", { variant: "warning" })
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}