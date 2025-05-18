/**
 * Example of using Bright Data scraping browser with Selenium WebDriver
 * This simple script demonstrates how to make a request to a website through Bright Data scraping Browser
 */
import { promises as fs } from 'fs';
import { Builder, Browser } from 'selenium-webdriver';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

/**
 * STEP 1: Configure your Bright Data scraping browser endpoint
 *  - Navigate to your scraping browser zone from https://brightdata.com/cp/zones
 *  - Create your scraping browser if you haven't already:
 *    https://docs.brightdata.com/scraping-automation/scraping-browser/quickstart
 *  - Copy your Selenium endpoint from the scraping browser overview page:
 *    Example: https://brd-customer-hl_1user23d-zone-scraping_browser1:password12abcd@brd.superproxy.io:9515
 *  - Replace YOUR_BRIGHT_DATA_SCRAPING_BROWSER_ENDPOINT with your actual scraping browser endpoint for Selenium
 */
const SCRAPING_BROWSER = process.env.BRIGHT_DATA_SCRAPING_BROWSER_ENDPOINT || "YOUR_BRIGHT_DATA_SCRAPING_BROWSER_ENDPOINT";

// STEP 2: Set your target URL
const PAGE_URL = "https://example.com";

// STEP 3: Run `node index.js` command on terminal
(async function main() {
    console.log("🚀 Starting the scraping process...");
    let driver;
    
    try {
        console.log("🌐 Setting up Selenium with Bright Data Scraping Browser...");
        
        // Initialize the WebDriver using Bright Data's Scraping Browser WebDriver
        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .usingServer(SCRAPING_BROWSER)
            .build();
            
        console.log("✅ Successfully connected to the browser!");
        
        // Navigate to the target URL
        console.log("🌍 Navigating to the test URL...");
        await driver.get(PAGE_URL);
        
        // Take a screenshot
        console.log("📸 Taking a screenshot of the page...");
        const screenshot = await driver.takeScreenshot();
        await fs.writeFile('./page.png', Buffer.from(screenshot, 'base64'));
        console.log("✅ Screenshot saved as 'page.png'!");
        
        // Get page content
        console.log("🔍 Scraping page content...");
        const html = await driver.getPageSource();
        console.log("📝 Page content retrieved:");
        console.log(html);
        
    } catch (error) {
        console.error("❌ An error occurred during scraping:");
        console.error(error.message);
        console.error(error.stack);
    } finally {
        if (driver) {
            await driver.quit();
            console.log("👋 Browser closed.");
        }
    }
})();