# Bright Data Hotel Search Scraper with Selenium WebDriver

This project demonstrates how to use Bright Data's Scraping Browser with Selenium WebDriver to search for hotels on Booking.com. It provides a practical example of web scraping with automated browser control.

<a href="https://codesandbox.io/p/devbox/github/luminati-io/bright-data-scraping-browser-selenium-webdriver-project?file=%2Fbooking-hotel-scraping.js" target="_blank" rel="noopener">Open in CodeSandbox</a>, sign in with GitHub account, then fork the repository to begin making changes.

### Getting Started

1. Replace the `YOUR_BRIGHT_DATA_SCRAPING_BROWSER_ENDPOINT` value with your actual Bright Data scraping browser endpoint in `booking-hotel-scraping.js`
2. Run `node booking-hotel-scraping.js` to start scraping


## 💻 Usage

1. Modify search parameters in `booking-hotel-scraping.js`:
   ```javascript
   const SEARCH_LOCATION = "New York";  // Change to your desired location
   const CHECK_IN_DAYS_FROM_NOW = 1;    // Adjust check-in date
   const CHECK_OUT_DAYS_FROM_NOW = 2;   // Adjust check-out date
   ```

2. Run the script:
   ```bash
   node booking-hotel-scraping.js
   ```

## 🔍 How It Works

The script uses Selenium WebDriver to:
1. Connect to Bright Data's Scraping Browser
2. Navigate to Booking.com
3. Handle any popups that appear
4. Fill in the search form with location and dates
5. Submit the search and wait for results
6. Extract hotel information (name, price, rating)
7. Display the results in a table format

```javascript
// Initialize the WebDriver using Bright Data's Scraping Browser
driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .usingServer(SCRAPING_BROWSER)
    .build();
```

## 📊 Example Output

```
📊 Search Results:
==================
┌─────────┬─────┬────────────────────┬──────────┬─────────┐
│ (index) │  #  │     Hotel Name     │  Price   │ Rating  │
├─────────┼─────┼────────────────────┼──────────┼─────────┤
│    0    │  1  │ Hotel Name 1       │ $100     │ 8.5     │
│    1    │  2  │ Hotel Name 2       │ $150     │ 9.0     │
│    2    │  3  │ Hotel Name 3       │ $200     │ 8.8     │
└─────────┴─────┴────────────────────┴──────────┴─────────┘
```