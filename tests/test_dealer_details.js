const assert = require("assert");
const app = require("../dealer_details/server");

// Helper to perform in-memory request using http server
function runTests() {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`Running dealer_details tests against temporary port ${port}...`);

    try {
      // Test 1: Single dealer price valid
      const res1 = await fetch(`${baseUrl}/price/Binglee/Headphones`);
      assert.strictEqual(res1.status, 200);
      const data1 = await res1.json();
      assert.strictEqual(data1.message, "Headphones costs $30 at Binglee");
      console.log("✓ GET /price/Binglee/Headphones passed");

      // Test 2: Product not available with specific dealer
      const res2 = await fetch(`${baseUrl}/price/Binglee/Mouse`);
      assert.strictEqual(res2.status, 200);
      const data2 = await res2.json();
      assert.strictEqual(data2.message, "Mouse is not available with Binglee");
      console.log("✓ GET /price/Binglee/Mouse (not stocked) passed");

      // Test 3: Dealer not found
      const res3 = await fetch(`${baseUrl}/price/NonExistentDealer/Headphones`);
      assert.strictEqual(res3.status, 200);
      const data3 = await res3.json();
      assert.strictEqual(data3.message, "The product is not available with this dealer");
      console.log("✓ GET /price/NonExistentDealer/Headphones passed");

      // Test 4: All prices for valid product
      const res4 = await fetch(`${baseUrl}/allprice/Printer`);
      assert.strictEqual(res4.status, 200);
      const data4 = await res4.json();
      assert.ok(Array.isArray(data4.prices), "prices should be an array");
      assert.ok(data4.prices.length >= 4, "Printer should have at least 4 dealers");
      const bingleeEntry = data4.prices.find((p) => p.key === "Binglee");
      assert.ok(bingleeEntry, "Binglee should be in Printer dealers");
      assert.strictEqual(bingleeEntry.value, "$75");
      console.log("✓ GET /allprice/Printer passed");

      // Test 5: All prices for invalid product
      const res5 = await fetch(`${baseUrl}/allprice/UnknownProduct123`);
      assert.strictEqual(res5.status, 200);
      const data5 = await res5.json();
      assert.strictEqual(data5.message, "The product is not available with this dealer");
      console.log("✓ GET /allprice/UnknownProduct123 passed");

      console.log("All dealer_details tests passed successfully!");
      server.close();
      process.exit(0);
    } catch (err) {
      console.error("Test failed:", err);
      server.close();
      process.exit(1);
    }
  });
}

runTests();
