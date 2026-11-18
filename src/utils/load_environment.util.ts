export function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`[FATAL] Missing required environment variable: ${key}. Check your .env file!`)
    }
    return value;
};
