import { addToQueue } from "../bullmq/queue.js";

export const crawlController = async(req, res) =>{
    const { domains } = req.body;
    if(!domains) {
        return res.status(400).json("Domains Not Found");
    }
    try {
        await Promise.all(domains.map((domain) => {
            addToQueue(domain);
        }))
        return res.status(200).json(" All Domains Added TO Queue");
    } catch (error) {
        console.log("Error adding domains to queue:", error.message);
        res.status(500).json("Failed to add domains to queue");
    }
}
