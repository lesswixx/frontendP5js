import axios from "axios";

// Configure the base API client
const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",  // base URL for backend API
    withCredentials: true                 // include cookies (for session ID)
});

// **NOTE:** If any interceptors were previously setting an Authorization header with JWT,
// they have been removed since we now rely on session cookies.

// Auth-related API calls
const authApi = {
    login: (credentials) => {
        // credentials is an object like { email: "...", password: "..." }
        return apiClient.post("/auth/login", credentials);
    },
    register: (userData, avatarFile) => {
        // Prepare form data if an avatar file is provided
        if (avatarFile) {
            const formData = new FormData();
            formData.append("avatar", avatarFile);
            // Append other user fields to formData
            Object.entries(userData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            return apiClient.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        } else {
            // If no avatar file, send JSON
            return apiClient.post("/auth/register", userData);
        }
    },
    logout: () => {
        // Invalidate session on the server
        return apiClient.post("/auth/logout");
    }
};

// User-related API calls
const usersApi = {
    getCurrentUser: () => {
        // Fetch the currently authenticated user's info (session-based)
        return apiClient.get("/auth/me");
        // ^^^ Assuming the backend provides an endpoint to get current user info.
        // Adjust this URL if your backend uses a different path (e.g., "/users/current").
    }
};
const assignmentsApi = {
    list: () => apiClient.get("/assignments")
};

const submissionsApi = {
    submit: (payload) => apiClient.post("/submissions", payload),
    listAll: ()          => apiClient.get("/submissions"),
    getOne:   id   => apiClient.get(`/submissions/${id}`),
    grade:    (id, data) => apiClient.put(`/submissions/${id}`, data),
    my: id => apiClient.get(`/submissions/mine/${id}`),
};
export default {
    auth: authApi,
    users: usersApi,
    assignments: assignmentsApi,
    submissions: submissionsApi
};
