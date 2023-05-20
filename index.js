const express = require("express");
const app = express();

// GET route
app.get("/price/:symbol", async (req, res) => {
  let ticker = req.params.symbol; // Get the value of the symbol parameter
  console.log("symbol=>" + symbol);
  console.log("req.params.symbol=>" + req.params.symbol);

  let price = getData(ticker);

  const tickerData = {
    symbol: symbol,
    price: 150.25,
    volume: 10000,
  };

  res.json(tickerData);
});

async function getData(ticker) {
  let googleURI = "https://www.google.com/search?q=";
  let stringToMatch = '<span jsname="vWLAgc" class="IsqQVc NprOob wT3VGc">';
  let price = "";
  let response = await fetch(googleURI + encodeURI(ticker));
  let reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (!done) {
      let chunk = new TextDecoder().decode(value);
      let index = chunk.indexOf(stringToMatch);
      if (index != -1) {
        let priceString = chunk.substring(
          index + stringToMatch.length,
          index + stringToMatch.length + 10
        );
        for (each of priceString) {
          if ((each >= "0" && each <= "9") || each === ".") {
            price = price + each;
          }
        }
        console.log("price", price);
        break;
      }
    } else {
      break;
    }
  }
  return price;
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
