import * as cheerio from 'cheerio';

export const extractLinks = async(html) =>{
    const $ = cheerio.load(html);
    const links = [];
    $("a").each((_, element) =>{
        const href = $(element).attr("href");
        if(href) {
          links.push(href);
        }
    })
    
    return links;
}
