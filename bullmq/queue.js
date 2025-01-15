import { Queue } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis;
try {
    redis = new Redis(process.env.REDIS_URL);
    // redis = new Redis({
    //     host: process.env.REDIS_HOST,
    //     port: process.env.REDIS_PORT,
    //     password: process.env.REDIS_PASSWORD,
    // });
    await redis.set('foo', 'bar');
    console.log(`Redis Connected with queue`);

} catch (error) {
    console.log("Error connecting Redis Server", error);
    process.exit(1);
}

export const urlQueue = new Queue("url-crawling", {
    connection: redis,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    }
    });

export const addToQueue = (domain) =>{
    urlQueue.add("crawl-domain", {domain});
    console.log(`Added Domain To Queue: ${domain}`);
}

process.on("SIGINT", async() =>{
    console.log("Shutting Down Redis Server form Queue");
    if (redis) await redis.quit();
    process.exit(0);
})
process.on("SIGTERM", async () => {
    console.log("Shutting Down Redis Server from Queue");
    if (redis) await redis.quit();
    process.exit(0);
});