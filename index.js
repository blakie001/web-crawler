import express from "express";
import crawlRoute from "./routes/crawl.routes.js";
import dotenv from "dotenv";

const server = express();
server.use(express.json());
const port = process.env.PORT || 5000;
dotenv.config();

server.use("", crawlRoute);

server.listen(port, () =>{
    console.log(`Server Is Running At Port : ${port}`);
})