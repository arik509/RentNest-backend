const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (
    body: Record<string, unknown>
): string[] => {
    const errors: string[] = [];

    const { name, email, password, role } = body;

    if (!name || typeof name !== "string") {
        errors.push("Name is required");
    }

    if (!email || typeof email !== "string") {
        errors.push("Email is required");
    } else if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required");
    } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }

    if (!role || typeof role !== "string") {
        errors.push("Role is required");
    } else if (!["TENANT", "LANDLORD"].includes(role)) {
        errors.push("Role must be TENANT or LANDLORD");
    }

    return errors;
};

const validateLogin = (
    body: Record<string, unknown>
): string[] => {
    const errors: string[] = [];

    const { email, password } = body;

    if (!email || typeof email !== "string") {
        errors.push("Email is required");
    } else if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required");
    }

    return errors;
};

export const authValidation = {
    validateRegister,
    validateLogin,
};