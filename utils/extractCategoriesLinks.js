import { categoryPatterns } from "../helper/product.helper.js";
export const extractCategoriesLinks = async(links, domain) =>{
    // const absoluteLinks = links.map((link) => {
    //     if (link.startsWith("/")) {
    //         return new URL(link, `https://${domain}`).href;
    //     }
    //     return link;
    // });
    const absoluteLinks = links.map((link) => {
        if (link.startsWith("/")) {
            return new URL(link, `https://${domain}`).href;
        } else if (!link.startsWith("http")) {
            return `https://${domain}${link}`;
        }
        return link;
    });

    const validLinks = absoluteLinks.filter(link =>
        link && !link.includes('#') && !link.includes('mailto:')
    );

    const categoryLinks = validLinks.filter((link) =>
        categoryPatterns.some((pattern) => pattern.test(link))
    );
    // console.log("Filtered Category Links:", categoryLinks);
    // console.log("Filtered Product Links:", productLinks);
    return categoryLinks;
}