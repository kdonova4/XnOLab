export const handleError = (error: any): Error => {
    if (error.response?.data) {
        const data = error.response.data;

        // If data is an array (like validation errors)
        if (Array.isArray(data) && data.length > 0) {
            return new Error(data[0]);
        }

        // If data has a 'message' field (most backend errors)
        if (typeof data === "object" && "message" in data) {
            return new Error(data.message);
        }

        // fallback: stringify the data
        return new Error(JSON.stringify(data));
    }

    // fallback: generic message
    return new Error("Something went wrong");
}