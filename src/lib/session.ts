import { SessionOptions } from "iron-session";

export interface SessionData {
    user?: {
        email: string;
        name: string;
        role: string;
        isLoggedIn: boolean;
    };
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
    cookieName: "donations_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export const defaultSession: SessionData = {
    user: {
        email: "",
        name: "",
        role: "ENTRY",
        isLoggedIn: false,
    },
};
