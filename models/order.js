const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    buyerid: {
      type: mongoose.Types.ObjectId,
      ref: "Buyer",
    },
    boughtFromPost: {
      type: mongoose.Types.ObjectId,
      ref: "SharePost",
    },
    shopid: {
      type: mongoose.Types.ObjectId,
      ref: "Shop",
    },
    orderDetails: [
      {
        itemid: {
          type: mongoose.Types.ObjectId,
          ref: "ProductPost",
        },
        amount: { type: Number },
        cost: { type: Number },
        _id: false
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;