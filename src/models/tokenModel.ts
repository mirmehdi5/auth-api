import config from "../config";
import { parseDuration } from "../utils/helper";
import redisClient from "../utils/redis";

export const getTokenByUsername = async (username: string): Promise<string | null> => {
    return await redisClient.get(`token:user:${username}`);
}

export const saveTokenForUser = async (username: string, jti: string): Promise<void> => {
    redisClient.set(`token:user:${username}`, jti, 'EX', Math.floor(parseDuration(config.jwtExpiration) / 1000)); // Store jti with 1 hour expiration
}