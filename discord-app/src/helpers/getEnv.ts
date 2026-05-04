/* eslint-disable */
import dotenv from "dotenv";

dotenv.config();

/**
 * Get the value of an environment variable
 */
export default function getEnv(key: string): any {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
}