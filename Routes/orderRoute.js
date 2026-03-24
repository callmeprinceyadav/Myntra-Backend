const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const express = require("express");
const orderRouter = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

// Test route
orderRouter.get("/test", (req, res) => res.send("Order Router is Working!"));

// Create order
orderRouter.post("/new", auth, async (req, res) => {
  console.log("Order creation request received at /orders/new");
  console.log("Body:", req.body);
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const userID = req.body.userID; // From auth middleware

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: userID,
    });
    
    // Update stock for each item
    for (const item of orderItems) {
      await updateStock(item.product, item.quantity);
    }

    return res
      .status(201)
      .send({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(400).send({ error: error.message });
  }
});

// get single order
orderRouter.get("/single", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.query.id).populate(
      "user",
      "name email role"
    );
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    return res.status(200).send({ success: true, order });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

// get orders of logged in user
orderRouter.get("/user", auth, async (req, res) => {
  try {
    const order = await Order.find({ user: req.body.userID })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    if (order.length === 0) {
      return res.status(404).send({ message: "No orders found" });
    }
    return res.status(200).send({ success: true, order });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

// get all orders
orderRouter.get("/all", auth, async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders found" });
    }
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    return res.status(200).send({ success: true, orders, totalAmount });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

// update order status
orderRouter.put("/update", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.query.id);

    if (order.orderStatus === "Delivered") {
      return res.status(400).send({ message: "Order already delivered" });
    }

    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    return res
      .status(200)
      .send({ message: "Order updated successfully", order });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

async function updateStock(id, quantity) {
  try {
    const product = await Product.findById(id);
    if (product) {
      product.stock -= quantity;
      await product.save({ validateBeforeSave: false });
    }
  } catch (err) {
    console.error("Stock update error:", err);
  }
}

// delete order
orderRouter.delete("/delete", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.query.id);
    if (order) {
      await order.deleteOne();
      return res.status(200).send({
        success: true,
        message: "order deleted successfully",
      });
    }
    return res.status(404).send({ message: "Order not found" });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

module.exports = orderRouter;