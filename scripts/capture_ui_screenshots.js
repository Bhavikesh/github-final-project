const puppeteer = require("/tmp/node_modules/puppeteer-core");
const path = require("path");

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security", "--window-size=1200,800"],
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();
  const screenshotsDir = path.join(__dirname, "..", "screenshots");

  console.log("Navigating to http://localhost:5001/ ...");
  await page.goto("http://localhost:5001/", { waitUntil: "networkidle0" });

  // 1. Homepage: wait for selProd dropdown to populate and expand so options can be read
  await page.waitForSelector("#selProd option[value='Headphones']");
  await page.evaluate(() => {
    const sel = document.getElementById("selProd");
    sel.size = 5; // Expand dropdown so all products are visible and readable
  });
  await new Promise(r => setTimeout(r, 400));
  console.log("Saving homepage.png...");
  await page.screenshot({ path: path.join(screenshotsDir, "homepage.png") });

  // Reset size
  await page.evaluate(() => {
    const sel = document.getElementById("selProd");
    sel.size = 1;
  });

  // 2. Product Dealer: select 'Headphones', call getDealers(), and expand dealer dropdown
  await page.evaluate(() => {
    const sel = document.getElementById("selProd");
    sel.value = "Headphones";
    getDealers();
  });
  await page.waitForSelector("#selDealer option[value='Binglee']");
  await page.evaluate(() => {
    const selDealer = document.getElementById("selDealer");
    selDealer.size = 5; // Expand dealer dropdown so all dealers can be read
  });
  await new Promise(r => setTimeout(r, 400));
  console.log("Saving product_dealer.png...");
  await page.screenshot({ path: path.join(screenshotsDir, "product_dealer.png") });

  // Reset dealer size
  await page.evaluate(() => {
    const selDealer = document.getElementById("selDealer");
    selDealer.size = 1;
  });

  // 3. Product Dealer Price: select 'Binglee' and call getDealerProductPrice()
  await page.evaluate(() => {
    const selDealer = document.getElementById("selDealer");
    selDealer.value = "Binglee";
    getDealerProductPrice();
  });
  await page.waitForFunction(() => {
    const el = document.getElementById("pricing");
    return el && el.innerText.includes("Headphones costs $30 at Binglee");
  });
  await new Promise(r => setTimeout(r, 400));
  console.log("Saving product_dealer_price.png...");
  await page.screenshot({ path: path.join(screenshotsDir, "product_dealer_price.png") });

  // 4. Product All Dealers Prices: select 'All Dealers' and call getDealerProductPrice()
  await page.evaluate(() => {
    const selDealer = document.getElementById("selDealer");
    selDealer.value = "All Dealers";
    getDealerProductPrice();
  });
  await page.waitForSelector("#pricing table tr");
  await new Promise(r => setTimeout(r, 400));
  console.log("Saving product_all_dealers_prices.png...");
  await page.screenshot({ path: path.join(screenshotsDir, "product_all_dealers_prices.png") });

  await browser.close();
  console.log("All UI screenshots captured and verified!");
}

capture().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
