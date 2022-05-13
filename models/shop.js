const mongoose = require("mongoose");
const {
  buyerFollowSchema,
  shopFollowSchema,
} = require("./partial/partialSchema.js");

const shopSchema = new mongoose.Schema(
  {
    buyerid: mongoose.Types.ObjectId,
    sp_shopid: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      deault: "shop",
    },
    shopAccount: {
      type: String,
      index: true,
    },
    itemcount: Number,
    profilePic: {
      type: String,
    },
    selfIntro: {
      type: String,
    },
    rating: {
      ratingStar: {
        type: Number,
        index: true,
      },
      ratingBad: {
        type: Number,
      },
      ratingNormal: {
        type: Number,
      },
      ratingGood: {
        type: Number,
      },
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.virtual("buyer", {
  ref: "Buyer",
  localField: "buyerid",
  foreignField: "_id",
});

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
