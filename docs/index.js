// get the data by doing a fetch
async function getData(ticker) {
  ticker = ticker + " stock";
  const googleURI = "https://www.google.com/search?q=";
  console.log("ticker2=>" + ticker);

  // let priceValueStringToMatch = 'class="BNeawe iBp4i AP7Wnd"><div><div class="BNeawe iBp4i AP7Wnd">'; // When accessed via Back end API
  let priceValueStringToMatch =
    '<span jsname="vWLAgc" class="IsqQVc NprOob wT3VGc">'; // When accessed from Front end UI

  // let companyNameStringToMatch = '<span><span class="BNeawe tAd8D AP7Wnd">';
  let companyNameStringToMatch = '<span><span class="BNeawe tAd8D AP7Wnd">';

  let price = "";
  let companyName = "";

  let response = await fetch(googleURI + encodeURI(ticker));

  let textResponse = await response.text();

  // console.log("=>" + textResponse);

  // return textResponse;

  let indexOfPrice = textResponse.indexOf(priceValueStringToMatch);
  let indexOfCompanyName = textResponse.indexOf(companyNameStringToMatch);
  console.log("indexOfPrice" + indexOfPrice);
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
