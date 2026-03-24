export const handleError = (error: any): Error => {
    if (error.response?.data) {
        const message = error.response.data[0] ||
            "Login Failed";

        return new Error(message);
    }

    return new Error("Login Failed");
}