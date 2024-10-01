const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with a real database in production)
let menuItems = [
  { id: 1, name: "Burger", price: 5.99, category: "Main" },
  { id: 2, name: "Fries", price: 2.99, category: "Side" },
  { id: 3, name: "Soda", price: 1.99, category: "Drink" },
  { id: 4, name: "Salad", price: 4.99, category: "Side" },
  { id: 5, name: "Pizza", price: 8.99, category: "Main" },
];

let orders = [];

// GET /menu endpoint
app.get("/menu", (req, res) => {
  res.json(menuItems);
});

// POST /process-payment endpoint
app.post("/process-payment", (req, res) => {
  const { orderId, total } = req.body;

  /*if (!orderId || typeof total !== "number") {
    return res.status(400).json({ success: false, message: "Invalid order data" });
  }
*/

  // In a real application, you would save the order to a database here
  orders.push({ id: orderId, total, status: "completed" });
  res.json({ success: true, message: "Payment processed successfully" });
});

// GET /orders endpoint (for demonstration purposes)
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(port, () => {
  console.log(`POS backend server running on port ${port}`);
});
