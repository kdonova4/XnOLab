import { useAuth } from "../hooks/AuthContext";

function HomePage() {

    const { appUser } = useAuth();
    
    return(
        <>
            <h1>Home</h1>
            <h2>{appUser?.username}</h2>
        </>
    )
}

export default HomePage;