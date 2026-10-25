const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Load dealers data reliably
let dealerslist;
try {
  dealerslist = require("./utils/dealers.json");
} catch (e) {
  try {
    dealerslist = require(path.join(__dirname, "utils", "dealers.json"));
  } catch (err) {
    dealerslist = { dealers: [] };
  }
}

app.get("/price/:dealer/:product", function (request, response) {
  try {
    const dealers = dealerslist.dealers || [];
    const req_dealer = request.params.dealer;
    const req_product = request.params.product;

    const matchedDealer = dealers.find(
      (d) => d.Dealer.toLowerCase() === req_dealer.toLowerCase()
    );

    if (matchedDealer) {
      if (matchedDealer.products && matchedDealer.products[req_product]) {
        return response.send({
          message: req_product + " costs " + matchedDealer.products[req_product] + " at " + req_dealer,
        });
      } else {
        return response.send({
          message: req_product + " is not available with " + req_dealer,
        });
      }
    }
    return response.send({ message: "The product is not available with this dealer" });
  } catch (error) {
    return response.status(500).send({ message: "Error retrieving dealer price" });
  }
});

app.get("/allprice/:product", function (request, response) {
  try {
    const dealers = dealerslist.dealers || [];
    const req_product = request.params.product;
    const priceslist = [];

    dealers.forEach((dealer) => {
      if (dealer.products && dealer.products[req_product]) {
        priceslist.push({ key: dealer.Dealer, value: dealer.products[req_product] });
      }
    });

    if (priceslist.length > 0) {
      return response.send({ prices: priceslist });
    } else {
      return response.send({ message: "The product is not available with this dealer" });
    }
  } catch (error) {
    return response.status(500).send({ message: "Error retrieving all dealer prices" });
  }
});

let port = process.env.PORT || 8080;
if (require.main === module) {
  app.listen(port, function () {
    console.log("Dealer details microservice running at: http://localhost:" + port);
  });
}

module.exports = app;