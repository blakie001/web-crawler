import { Worker } from "bullmq";
import { crawlPage } from "../utils/crawlPage.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const logUrls = (domain, urls) => {
    const logData = {
        domain: domain,
        urls: urls,
        timestamp: new Date().toString(),
    };
    fs.appendFileSync("crawled_urls.json", JSON.stringify(logData, null, 2) + "\n");
};

const redisUrl = process.env.REDIS_URL;

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
        connection: {
            url: redisUrl,
        },
        concurrency: 5,
    }
);

// Worker event listeners
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
