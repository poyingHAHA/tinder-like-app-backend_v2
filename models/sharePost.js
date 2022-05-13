const mongoose = require("mongoose");
const {
  labelSchema,
  variationSchema,
  ratingSchema,
  likeSchema,
} = require("./partial/partialSchemaForPost.js");

const sharePostSchema = new mongoose.Schema({
  orderid: {
    type: mongoose.Types.ObjectId,
    ref: "Order"
  },
  itemid: {
    type: mongoose.Types.ObjectId,
    ref: "ProductPost",
  },
  orderid: {
    type: mongoose.Types.ObjectId,
    ref: "Order"
  },
  buyerid: {
    type: mongoose.Types.ObjectId,
    ref: "Buyer"
  },
  shopid: {
    type: mongoose.Types.ObjectId,
    ref: "Shop"
  },
  content: {
    type: String
  },
  likes: [likeSchema],
  images: [String],
  responses: [
    {
      userid: {
        type: mongoose.Types.ObjectId
      },
      userPic: {type: String},
      content: {type: String}
    },{
      timestamps: true,
      autoIndex: true
    }
  ]
}, {
  timestamps: true,
  autoIndex: true
});

sharePostSchema.virtual("productdetail", {
  ref: "ProductPost",
  localField: "itemid",
  foreignField: "_id",
});

sharePostSchema.virtual("soldByShareOrder", {
  ref: "Order",
  localField: "_id",
  foreignField: "boughtFromShare"
})

sharePostSchema.virtual("order", {
  ref: "Order",
  localField: "orderid",
  foreignField: "_id"
})

const SharePost = mongoose.model("SharePost", sharePostSchema);
module.exports = SharePost;
