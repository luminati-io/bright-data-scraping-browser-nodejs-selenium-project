import { Builder, Browser, By, until } from 'selenium-webdriver';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

// Configuration
const AMAZON_URL = "https://www.amazon.com";


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

// STEP 2: Run `node amazon-product-scraping.js` command on terminal

// Search parameters
const SEARCH_TERM = "laptop";  // Change this to search for different products

/**
 * Main function to run the scraper
 * This is the entry point of our script
 */
async function scrapeAmazon() {
  console.log("🚀 Starting Amazon scraper...");
  console.log(`🔍 Searching for: ${SEARCH_TERM}`);
  let driver;

  try {
      // Step 1: Connect to Bright Data's browser
      console.log("🌐 Connecting to browser...");
      driver = await new Builder()
          .forBrowser(Browser.CHROME)
          .usingServer(SCRAPING_BROWSER)
          .build();
      console.log("✅ Connected to browser");
      
      // Step 2: Go to Amazon
      console.log("🌐 Opening Amazon...");
      await driver.get(AMAZON_URL);
      console.log("✅ Amazon loaded");

      // Step 3: Search for products
      console.log("🔍 Entering search term...");
      await driver.findElement(By.id('twotabsearchtextbox')).sendKeys(SEARCH_TERM);
      await driver.findElement(By.id('nav-search-submit-button')).click();
      console.log("✅ Search submitted");

      // Step 4: Wait for results to load
      console.log("⏳ Waiting for results...");
      await driver.wait(until.elementLocated(By.css('[data-component-type="s-search-result"]')), 10000);
      console.log("✅ Results loaded");

      // Step 5: Extract product information
      console.log("📊 Extracting product data...");
      const products = await driver.executeScript(`
          const items = document.querySelectorAll('[data-component-type="s-search-result"]');
          return Array.from(items).slice(0, 5).map(item => {
              // Get product title
              const titleElement = item.querySelector('h2');
              const title = titleElement ? titleElement.innerText : 'N/A';

              // Get product price
              const priceElement = item.querySelector('.a-price .a-offscreen');
              const price = priceElement ? priceElement.innerText : 'N/A';

              // Get product rating
              const ratingElement = item.querySelector('.a-icon-star-small');
              const rating = ratingElement ? ratingElement.innerText : 'N/A';

              return {
                  title,
                  price,
                  rating
              };
          });
      `);

      // Step 6: Display results
      console.log(`\n📊 AMAZON SEARCH RESULTS for "${SEARCH_TERM}"`);
      console.log("=======================");
      
      // Format and display each product in a clean, readable way
      products.forEach((product, index) => {
        console.log(`\n#${index + 1} ${product.title}`);
        console.log(`   💰 Price: ${product.price}`);
        console.log(`   ⭐ Rating: ${product.rating}`);
        console.log("   " + "-".repeat(50));
      });
      
      console.log(`\n✅ Found ${products.length} products for "${SEARCH_TERM}"`);

  } catch (error) {
      console.error("❌ Error occurred:", error.message);
      console.error(error.stack);
  } finally {
      // Step 7: Close browser
      if (driver) {
          console.log("👋 Closing browser...");
          await driver.quit();
          console.log("✅ Browser closed");
      }
  }
}

// Run the scraper
scrapeAmazon(); 