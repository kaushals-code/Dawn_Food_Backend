import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("connect", () => {
    console.log("Redis Conntected");
});

redisClient.on("error", (err) => {
    console.log("Error", err);
});

const connectRedis = async () => {
    try {

        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

    } catch (err) {

        console.log(
            "Redis Connection Failed:",
            err
        )

    }
};

export {
    redisClient,
    connectRedis
};