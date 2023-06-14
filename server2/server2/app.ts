import http, { IncomingMessage, Server, ServerResponse } from "http";
import puppeteer from "puppeteer";
import fs from "fs/promises";


const server: Server = http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", async () => {
            let { url } = JSON.parse(data);
            const browser = await puppeteer.launch();
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
    }
);
server.listen(3001, () => console.log(`Server is listening on Port ${3001}`));