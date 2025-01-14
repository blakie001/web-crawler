import puppeteer from "puppeteer";

export const fetchWithPuppeteer = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox",
            "--disable-http2", // Disables HTTP/2
            "--disable-features=IsolateOrigins,site-per-process" // Might help with protocol issues
        ],
    });

    try {
        const page = await browser.newPage();
        
        // Set a custom user agent to avoid bot detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Increase timeout for slow-loading pages
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60 seconds timeout
        
        const html = await page.content();
        return html;
    } catch (error) {
        console.error(`Failed to fetch URL: ${url}`, error);
        throw error;
    } finally {
        await browser.close();
    }
};
