const mongoose = require("mongoose");
const { tinderUserSchema } = require("./partial/partialSchema.js");
const {
  labelSchema,
  variationSchema,
  ratingSchema,
  likeSchema,
} = require("./partial/partialSchemaForPost.js");

const shareSchema = new mongoose.Schema(
  {
    userid: mongoose.Types.ObjectId,
    postid: mongoose.Types.ObjectId,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    autoIndex: true,
  }
);

const productPostSchema = new mongoose.Schema(
  {
    shopid: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "Shop",
    },
    shopAccount: {
      type: String,
      index: true,
      ref: "Shop",
    },
    sp_itemid: {
      type: Number,
    },
    sp_shopid: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    seg_name: {
      type: String,
      index: true,
    },
    content: {
      type: String,
    },
    labels: [labelSchema],
    feLabels: {
      type: [labelSchema],
      default: [
        {
          labelid: 0,
          display_name: "Null",
        },
      ],
    },
    shipping_free: {
      type: Boolean,
      default: false,
    },
    variation: [variationSchema],
    models: [
      {
        name: String,
        price: Number,
        stock: Number,
        modelid: Number,
        _id: false,
      },
    ],
    images: [String],
    display: {
      type: Boolean,
    },
    price: Number,
    priceMax: Number,
    priceMin: Number,
    rating: ratingSchema,
    discount: Number,
    historicalSold: Number,
    monthSold: Number,
    stock: Number,
    likeCount: Number,
    shareCount: Number,
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productPostSchema.virtual("ratingDetail", {
  ref: "Rating",
  localField: "_id",
  foreignField: "itemid",
});

productPostSchema.virtual("sharePosts", {
  ref: "SharePost",
  localField: "_id",
  foreignField: "itemid",
});

const ProductPost = mongoose.model("ProductPost", productPostSchema);
module.exports = ProductPost;
