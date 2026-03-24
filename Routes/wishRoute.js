const express = require("express");
const { auth } = require("../Middlewares/authMiddleware");
const wishlistRouter = express.Router();
const ProductModel = require("../Models/productModel");
const WishListModel = require("../Models/wishModel");

wishlistRouter.get("/", auth, async (req, res) => {
  const userId = req.body.userID;
  try {
    const wishlist = await WishListModel.find({ userId });
    const myWishlist = await Promise.all(
      wishlist.map(async (ele) => {
        const product = await ProductModel.findOne({ _id: ele.productId });
        return product;
      })
    );
    return res.status(200).send({ success: true, myWishlist });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
});

wishlistRouter.post("/add/:id", auth, async (req, res) => {
  const productId = req.params.id;
  const userId = req.body.userID;

  try {
    const wishlist = new WishListModel({ productId, userId });
    await wishlist.save();
    return res
      .status(201)
      .send({ message: `Product Added Successfully in Wishlist` });
  } catch (error) {
    return res.status(404).send({ message: "Something went wrong !" });
  }
});

wishlistRouter.delete("/delete/:id", auth, async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userID;
  try {
    const productToDelete = await WishListModel.findOne({
      productId: id,
      userId,
    });
    if (productToDelete) {
      const idToDelete = productToDelete._id;
      await WishListModel.findByIdAndDelete(idToDelete);
      const deletedProduct = await ProductModel.findOne({ _id: id });
      res.status(200).json({
        message: "Item was removed from Wishlist!",
        deletedProduct: deletedProduct,
      });
    } else {
      throw new Error("Product not found! please pass a valid product id!");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wishlistRouter.delete("/deleteall", auth, async (req, res) => {
  const userId = req.body.userID;
  try {
    await WishListModel.deleteMany({ userId });
    res.status(200).json({ message: "Wishlist cleared successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = wishlistRouter;