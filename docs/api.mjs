import fetch from "node-fetch";
import express from "express";
const app = express();
const googleURI = "https://www.google.com/search?q=";

// GET route
app.get("/price/:searchString", async (req, res) => {
  let searchString = req.params.searchString; // Get the value of the symbol parameter
  let response = { searchString: searchString };
  try {
    console.log("Before=>" + searchString);
    let { price, companyName } = await getData(searchString);
    response.data = {
      companyName: companyName,
      price: price,
    };
  } catch (err) {
    console.log("error" + err.message);
    response.error = { message: err.message };
  } finally {
    console.log("Finally response" + JSON.stringify(response));
    res.json(response);
  }
});

async function getData(ticker) {
  console.log("ticker2=>" + ticker);
  let priceValueStringToMatch =
    'class="BNeawe iBp4i AP7Wnd"><div><div class="BNeawe iBp4i AP7Wnd">';
  let companyNameStringToMatch = '<span><span class="BNeawe tAd8D AP7Wnd">';
  let price = "";
  let companyName = "";

  let response = await fetch(googleURI + encodeURI(ticker));

  let textResponse = await response.text();
  //return textResponse;
  let indexOfPrice = textResponse.indexOf(priceValueStringToMatch);
  let indexOfCompanyName = textResponse.indexOf(companyNameStringToMatch);

  if (indexOfPrice == -1) throw Error("Not a valid company/stock name");

  if (indexOfPrice != -1) {
    let priceString = textResponse.substring(
      indexOfPrice + priceValueStringToMatch.length,
      indexOfPrice + priceValueStringToMatch.length + 10
    );
    for (let each of priceString) {
      if ((each >= "0" && each <= "9") || each === ".") {
        price = price + each;
      }
    }
  }
  console.log("price", price);
  console.log("company name is found at", indexOfCompanyName);
  if (indexOfCompanyName != -1) {
    let companyString = textResponse.substring(
      indexOfCompanyName + companyNameStringToMatch.length,
      indexOfCompanyName + companyNameStringToMatch.length + 20
    );
    console.log("indexOfCompanyName=>" + indexOfCompanyName);
    for (let each of companyString) {
      if (each != "<") {
        companyName = companyName + each;
      } else {
        break;
      }
    }
  }
  console.log("companyName", companyName);

  return {
    companyName: companyName,
    price: price,
  };
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
