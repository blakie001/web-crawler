         <--      Web Crawler with BullMQ      -->
 
This project is a web crawler built using Node.js, BullMQ, and Puppeteer.
It allows users to fetch product URLs from e-commerce websites by adding domains to a Redis-backed task queue.


Features

 -> Task queuing and processing with BullMQ.
 -> Concurrency control for crawling.
 -> Scalable and efficient processing of multiple domains.
 -> Integration with Puppeteer for page scraping.

### Video Explanation of Code And Approach : "https://www.loom.com/share/9affc82c84ab42759adcc66275f50206?sid=d8f878d5-86d3-42d1-a76c-4e29b6120030"

Installation

 -> Node.js installed
 -> Redis can accessible via the cloud

Steps to Run

 -> redis-server
 -> npm run dev:all

Usage
 
 POST http://localhost:5000/crawl
 Content-Type: application/json

{
 "domains" : ["example1.com", "example2.com", example3.com"…]
}


    Once a job is processed by the worker, the extracted URLs are stored in :
    "https://raw.githubusercontent.com/blakie001/web-crawler/refs/heads/main/bullmq/crawled_urls.json".


