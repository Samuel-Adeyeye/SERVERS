"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const server = http_1.default.createServer(async (req, res) => {
    let data = "";
    req.on("data", (chunk) => {
        data += chunk;
    });
    req.on("end", async () => {
        let { url } = JSON.parse(data);
        const browser = await puppeteer_1.default.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const title = await page.title();
        const description = await page.evaluate(() => {
            const metaDescription = document.querySelector('meta[name="description"]');
            return metaDescription ? metaDescription.getAttribute('content') : '';
        });
        const imageUrl = await page.evaluate(() => {
            let link = Array.from(document.querySelectorAll("img")).map((a) => a.getAttribute("src"));
            return link;
        });
        let result = {
            title: title,
            description: description,
            imageUrl: imageUrl
        };
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            success: true,
            result: result
        }));
        if (req.method === "GET" && req.url === "/data") {
            return result;
        }
    });
});
server.listen(3001, () => console.log(`Server is listening on Port ${3001}`));
