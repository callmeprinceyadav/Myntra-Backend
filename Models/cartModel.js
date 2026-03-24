const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        productId: {
            type:String,
            required:true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;