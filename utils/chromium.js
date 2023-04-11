const { chromium } = require('playwright');
const { spawnSync } = require("child_process");
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


module.exports = getPrivateChromePage