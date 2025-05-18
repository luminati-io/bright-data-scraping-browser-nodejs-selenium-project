import { Builder, Browser, By, until } from 'selenium-webdriver';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

// Configuration
const BOOKING_URL = "https://www.booking.com/";


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

// STEP 2: Run `node booking-hotel-scraping.js` command on terminal

// Search parameters
const SEARCH_LOCATION = "New York";
const CHECK_IN_DAYS_FROM_NOW = 1;  // Check-in tomorrow
const CHECK_OUT_DAYS_FROM_NOW = 2;  // Check-out day after tomorrow

// Helper function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper function to format date for Booking.com
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Calculate check-in and check-out dates
const today = new Date();
const checkInDate = formatDate(addDays(today, CHECK_IN_DAYS_FROM_NOW));
const checkOutDate = formatDate(addDays(today, CHECK_OUT_DAYS_FROM_NOW));

// Main function to run the hotel search
async function searchHotels() {
  console.log("🔍 Starting hotel search process...");
  console.log(`📍 Searching for hotels in: ${SEARCH_LOCATION}`);
  console.log(`📅 Check-in date: ${checkInDate}`);
  console.log(`📅 Check-out date: ${checkOutDate}`);
  
  let driver;
  
  try {
    // Connect to browser
    console.log("🌐 Connecting to browser...");
    driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .usingServer(SCRAPING_BROWSER)
        .build();
    console.log("✅ Successfully connected to browser");
    
    // Open Booking.com
    console.log("🌐 Opening Booking.com...");
    await driver.get(BOOKING_URL);
    console.log("✅ Successfully loaded Booking.com");
    
    // Handle popup if it appears
    await handlePopup(driver);
    
    // Fill search form and submit
    console.log("📝 Filling search form...");
    await fillSearchForm(driver);
    console.log("✅ Search form submitted successfully");
    
    // Get and display results
    console.log("🔍 Searching for available hotels...");
    const results = await getHotelResults(driver);
    
    // Display results in a table
    console.log("\n📊 Search Results:");
    console.log("==================");
    
    // Format results for table display
    const tableData = results.map((hotel, index) => ({
      '#': index + 1,
      'Hotel Name': hotel.name,
      'Price': hotel.price,
      'Rating': hotel.rating
    }));
    
    // Display the table
    console.table(tableData);
    console.log(`\n✅ Found ${results.length} hotels`);
    
  } catch (error) {
    console.error("❌ Error occurred:", error.message);
    console.error(error.stack);
  } finally {
    // Close browser
    if (driver) {
      console.log("👋 Closing browser...");
      await driver.quit();
      console.log("✅ Browser closed successfully");
    }
  }
}

// Handle the sign-in popup if it appears
async function handlePopup(driver) {
  try {
    console.log("⚠️ Checking for popup...");
    const closeButton = await driver.wait(
      until.elementLocated(By.css('[aria-label="Dismiss sign-in info."]')), 
      25000, 
      'Popup close button not found'
    );
    await closeButton.click();
    console.log("✅ Popup closed successfully");
  } catch (e) {
    console.log("ℹ️ No popup appeared - continuing with search");
  }
}

// Fill and submit the search form
async function fillSearchForm(driver) {
  // Fill location
  console.log("📍 Entering search location...");
  const destinationInput = await driver.wait(
    until.elementLocated(By.css('[data-testid="destination-container"] input')),
    10000,
    'Destination input not found'
  );
  await destinationInput.sendKeys(SEARCH_LOCATION);
  console.log("✅ Location entered successfully");
  
  // Select dates
  console.log("📅 Selecting dates...");
  const datesContainer = await driver.findElement(By.css('[data-testid="searchbox-dates-container"]'));
  await datesContainer.click();
  
  await driver.wait(
    until.elementLocated(By.css('[data-testid="searchbox-datepicker-calendar"]')),
    10000,
    'Calendar not found'
  );
  
  const checkInElement = await driver.findElement(By.css(`[data-date="${checkInDate}"]`));
  await checkInElement.click();
  
  const checkOutElement = await driver.findElement(By.css(`[data-date="${checkOutDate}"]`));
  await checkOutElement.click();
  console.log("✅ Dates selected successfully");
  
  // Submit search
  console.log("🔍 Submitting search...");
  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();
  
  // Wait for navigation to complete
  await driver.wait(
    until.elementLocated(By.css('[data-testid="property-card"]')),
    30000,
    'Search results not found'
  );
  
  console.log("✅ Search submitted successfully");
}

// Extract hotel information from search results
async function getHotelResults(driver) {
  console.log("🏨 Extracting hotel information...");
  return await driver.executeScript(`
    const cards = document.querySelectorAll('[data-testid="property-card"]');
    return Array.from(cards).map(card => ({
      name: card.querySelector('[data-testid="title"]')?.innerText || 'N/A',
      price: card.querySelector('[data-testid="price-and-discounted-price"]')?.innerText || 'N/A',
      rating: card.querySelector('[data-testid="review-score"]')?.innerText || 'N/A'
    }));
  `);
}

// Start the search
searchHotels();