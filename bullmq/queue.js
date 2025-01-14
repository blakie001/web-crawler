import { Queue } from "bullmq";
import Redis from "ioredis";

let redis;
try {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    });
    console.log(`Redis Connected`);

} catch (error) {
    console.log("Error connecting Redis Server");
    process.exit(1);
}

export const urlQueue = new Queue("url-crawling", {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
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

export const checkQueueStatus = async () => {
    try {
        const jobCounts = await urlQueue.getJobCounts();
        const waitingCount = jobCounts.waiting || 0;
        const activeCount = jobCounts.active || 0;
        const completedCount = jobCounts.completed || 0;
        const failedCount = jobCounts.failed || 0;

        console.log(`Queue Status:`);
        console.log(`Waiting jobs: ${waitingCount}`);
        console.log(`Active jobs: ${activeCount}`);
        console.log(`Completed jobs: ${completedCount}`);
        console.log(`Failed jobs: ${failedCount}`);
        
        if (waitingCount === 0 && activeCount === 0) {
            console.log("The queue is empty.");
        } else {
            console.log("The queue is not empty.");
        }
    } catch (error) {
        console.error("Error checking queue status:", error);
    }
};

process.on("SIGINT", async() =>{
    console.log("Shutting Down Redis Server");
    await redis.quit();
    process.exit(0);
})
process.on("SIGTERM", async () => {
    console.log("Shutting Down Redis Server");
    await redis.quit();
    process.exit(0);
});