const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
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

const WishListModel = mongoose.model("Wishlist", wishListSchema);

module.exports = WishListModel;