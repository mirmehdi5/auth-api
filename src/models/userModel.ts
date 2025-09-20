import { User } from "../types";
import redisClient from "../utils/redis";

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const userData = await redisClient.get(`user:${username}`);
    if (!userData) {
        return null;
    }
    
    return JSON.parse(userData);
}

export const saveUser = async (username: string, user: User): Promise<void> => {
    await redisClient.set(`user:${username}`, JSON.stringify(user));
}