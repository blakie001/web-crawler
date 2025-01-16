import { Worker } from "bullmq";
import { crawlPage } from "../utils/crawlPage.js";
import fs from "fs";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
const logUrls = (domain, urls) => {
    const filePath = "/tmp/crawled_urls.json"; 
    const logData = {
        domain: domain,
        urls: urls,
        timestamp: new Date().toString(),
    };
    try {
        if (!fs.existsSync("/tmp")) {
            fs.mkdirSync("/tmp", { recursive: true });
        }

        fs.appendFileSync(filePath, JSON.stringify(logData, null, 2) + "\n");
        console.log(`Url's Are written to ${filePath}`);
    } catch (error) {
        console.error("Error writing log to file:", error.message);
    }
};

let local = process.env.REDIS_LOCAL;


let redis;
try {
    redis = new Redis(local ? {
        host: "127.0.0.1",
        port: 6379
    } : process.env.REDIS_URL, {
        tls: !local ? {} : undefined,
        maxRetriesPerRequest: null,
    });

    redis.on('connect', () => {
        console.log('Connected to Redis!');
    });
    await redis.set("foo", "bar");
    console.log(`Redis Connected with worker`);

} catch (error) {
    console.log("Error connecting Redis Server", error);
    process.exit(1);
}


const worker = new Worker(
    "url-crawling",
    async (job) => {
        const { domain } = job.data;
        console.log(`Crawling Domain: ${domain}`);
        try {
            const productLinks = await crawlPage(domain);
            console.log(`Crawled ${domain} and fetched ${productLinks.length} URLs`);
            logUrls(domain, productLinks);
            return productLinks;
        } catch (error) {
            console.error(`Error Processing ${domain}: ${error.message}`);
            throw error;
        }
    },
    {
        connection: redis,
        concurrency: 5,
    }
);

worker.on("active", (job) => {
    console.log(`Job is active: ${job.id}, Domain: ${job.data.domain}`);
});

worker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`Job failed: ${job.id}, Error: ${err.message}`);
});

worker.on("error", (err) => {
    console.error(`Worker error: ${err.message}`);
});

console.log("Worker is listening for jobs...");


process.on("SIGINT", async () => {
    console.log("Shutting Down Redis Server from Worker");
    if (redis) await redis.quit();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Shutting Down Redis Server from Worker");
    if (redis) await redis.quit();
    process.exit(0);
});