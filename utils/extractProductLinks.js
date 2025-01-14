import { productPatterns } from "../helper/product.helper.js";
export const extractProductsLinks = (links, domain) =>{

    // Convert /item/54321    to    https://example.com/item/54321
    const absoluteLinks = links.map((link) =>{
        if(link.startsWith("/")) {
            return new URL(link, `https://${domain}`).href;
        }
        return link;
    })
    // console.log("Absolute Links:", absoluteLinks);

    const validLinks = absoluteLinks.filter(link =>
        link && !link.includes('#') && !link.includes('mailto:')
    )

    // console.log("validLinks ar :", validLinks);

    const productLinks = validLinks.filter((link) =>
        productPatterns.some((pattern) => pattern.test(link))
    );

    // console.log("Filtered Products links :", productLinks);

    return productLinks;
}