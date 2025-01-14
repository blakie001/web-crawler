import { Worker } from "bullmq";
import { crawlPage } from "../utils/crawlPage.js";
import fs from "fs";

// Function to log crawled URLs to a file
const logUrls = (domain, urls) => {
    const logData = {
        domain: domain,
        urls: urls,
        timestamp: new Date().toString(),
    };
    fs.appendFileSync("crawled_urls.json", JSON.stringify(logData, null, 2) + "\n");
};

// Initialize the worker
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
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
            password: process.env.REDIS_PASSWORD || null,
        },
        concurrency: parseInt(process.env.PARALLEL_PROCESSES, 10) || 10, // Ensure concurrency is a valid integer
        stallInterval: 1000 * 30,
        maxStalledCount: 3,
    }
);

// Event listeners for the worker
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
