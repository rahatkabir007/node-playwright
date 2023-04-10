const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { chromium } = require('playwright');
const { spawnSync } = require("child_process")
//middleware
app.use(cors());
app.use(express.json())

var privatePage = null

const getPrivateChromePage = async () => {
    console.log(`Chrome getPrivateChromePage`)
    spawnSync("npx", ["playwright", "install", "chromium"]);
    if (privatePage == null) {
        console.log(`Chrome NULL`)
        const timeout = 1000 * 60 * 10
        const privateBrowser = await chromium.launch({
            headless: true,
            timeout: timeout
        });
        const context = await privateBrowser.newContext()

        context.setDefaultNavigationTimeout(timeout)
        context.setDefaultTimeout(timeout)

        privatePage = await context.newPage();
    }

    return privatePage
}

async function run() {
    try {
        console.log("server connected");
        var chrome = null;
        app.get('/test', async (req, res) => {
            if (chrome === null) {
                chrome = await getPrivateChromePage();
            }
            await chrome.goto("https://www.google.com/")
            // await chrome.waitForTimeout(2000);
            // await chrome.type(`#APjFqb`, "Jhoome Jo Pathan");
            // await chrome.waitForTimeout(2000);
            // await chrome.keyboard.press("Enter");
            // await chrome.waitForTimeout(2000);

            const title = await chrome.evaluate(() => {
                return document.title
            })

            console.log("🚀 ~ file: main.ts:20 ~ title ~ title:", title)
            res.json({ title: title })
        })
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