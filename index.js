const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');
const getPrivateChromePage = require("./utils/chromium");
//middleware
app.use(cors());
app.use(express.json())


async function run() {
    try {
        console.log("server connected");
        var chrome = null;
        app.get('/test', async (req, res) => {
            if (chrome === null) {
                chrome = await getPrivateChromePage();
            }
            await chrome.goto("https://www.google.com/")
            console.log("1");
            await chrome.fill('input[name="q"]', 'mr beast');
            console.log("2");
            await chrome.press('input[name="q"]', 'Enter');
            console.log("3");
            await chrome.waitForSelector('#search');
            console.log("4");

            const { title, links } = await chrome.evaluate(() => {
                const links = Array.from(document.querySelectorAll("#search .g .yuRUbf > a")).map(item => item.href);
                return { title: document.title, links: links }
            })

            console.log("🚀 ~ file: main.ts:20 ~ title ~ title:", title, links)

            fs.writeFile('data.json', JSON.stringify(links), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error saving data');
                }

                res.json({ title: title, links: links })
            });
        });


        app.get('/readTest', async (req, res) => {
            fs.readFile('data.json', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const jsonData = JSON.parse(data);
                console.log(jsonData);
                res.json(jsonData)
            });
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server Is Running")
})

app.listen(port, () => {
    console.log("Server Is Running at Port", port);
})

module.exports = app