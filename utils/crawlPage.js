import { extractLinks } from "./extractLinks.js";
import { extractCategoriesLinks } from "./extractCategoriesLinks.js";
import { extractProductsLinks } from "./extractProductLinks.js";
import { fetchWithPuppeteer } from "./fetchWithPuppeteer.js";

import pLimit from "p-limit";

const CONCURRENCY_LIMIT = 10;
const limit = pLimit(CONCURRENCY_LIMIT);

export const crawlPage = async (domain) => {
    const allProductsLinks = new Set();
    const processedCategories = new Set();
    try {
        const html = await fetchWithPuppeteer(`https://${domain}`);
        const links = await extractLinks(html);

        const categoriesLinks = await extractCategoriesLinks(links, domain);
        const productLinks = await extractProductsLinks(links, domain);

        productLinks.forEach((link) => allProductsLinks.add(link));

        const categoryPromises = categoriesLinks.map((categoryLink) =>
            limit(async () => {
                if(processedCategories.has(categoryLink)) {
                    return;
                }
                processedCategories.add(categoryLink);
                try {
                    const categoryHtml = await fetchWithPuppeteer(categoryLink);
                    const categoryLinks = await extractLinks(categoryHtml);
                    const categoryProductLinks = await extractProductsLinks(categoryLinks, domain);

                    categoryProductLinks.forEach((link) => allProductsLinks.add(link));
                } catch (error) {
                    console.error(`Error processing category link: ${categoryLink}`, error);
                }
            })
        );

        await Promise.all(categoryPromises);
    } catch (error) {
        console.error(`Error crawling domain: ${domain}`, error);
    }

    return Array.from(allProductsLinks);
};
