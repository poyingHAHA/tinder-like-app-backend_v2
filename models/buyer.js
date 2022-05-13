const mongoose = require("mongoose");
const validator = require("validator");

const {
  buyerFollowSchema,
  shopFollowSchema,
  likeItemSchema,
  tinderItemSchema,
} = require("./partial/partialSchema.js");

const buyerSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "buyer",
    },
    awardCoin: {
      type: Number,
      default: 0,
    },
    account: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    selfIntro: {
      type: String,
    },
    followerCount: Number,
    followingCount: Number,
    superLikeLeft: {
      type: Number,
      default: 10,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

buyerSchema.virtual("sharePosts", {
  ref: "SharePost",
  localField: "_id",
  foreignField: "buyerid",
});

buyerSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "buyerid",
});

const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;
