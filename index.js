import express from "express";
import crawlRoute from "./routes/crawl.routes.js";
import dotenv from "dotenv";
// import { BullAdapter } from "bull-board/bullAdapter";
// import { router } from 'bull-board';

const server = express();
server.use(express.json());
const port = process.env.PORT || 5000;
dotenv.config();

// const { setQueues } = require('bull-board');
// setQueues([new BullAdapter(queue)]);


server.use("", crawlRoute);


server.listen(port, () =>{
    console.log(`Server Is Running At Port : ${port}`);
})