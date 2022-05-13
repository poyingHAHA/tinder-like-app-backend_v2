const express = require("express");
const Buyer = require("../models/buyer.js");
const Order = require("../models/order.js");
const ProductPost = require("../models/productPost.js");
const SharePost = require("../models/sharePost.js");

const router = new express.Router();

// 買家註冊
router.post("/register", async (req, res) => {
  try {
    const buyer = new Buyer(req.body);
    await buyer.save();

    res.status(201).send(buyer);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
});

// 買家購買商品
router.post("/placeOrder", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).send(order);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
});

// 獲取單的或多個order，及演示populate的使用方式
router.get("/order/:buyerid", async (req, res) => {
  const buyerid = req.params.buyerid;
  const match = {};
  const sort = { createdAt: "desc" };

  try {
    const buyer = await Buyer.findOne({ _id: buyerid });
    await buyer.populate({
      path: "orders",
      match, // 匹配條件， 沒有就全部
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(buyer.orders);
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
});

// 買家分享商品，要在order裡面有才能分享
router.post("/buyer/share", async (req, res) => {
  try {
    const shareItem = req.body.itemid;
    const shopid = req.body.shopid;
    const buyerid = req.body.buyerid;
    // 如果有share過同樣的商品就不能再share了
    const shared = await SharePost.findOne({itemid: shareItem, buyerid: buyerid, shopid: shopid})
    if(shared){
      res.send("You have already shared")
    }

    const buyer = await Buyer.findOne({ _id: buyerid });
    await buyer.populate({
      path: "orders",
    });

    let noOrder = true;
    for (let order of buyer.orders){
      if( order.shopid==shopid && order.orderDetails.some(detail=>detail.itemid==shareItem) ){
        noOrder = false
        if(!req.body.content || !req.body.images){
          const item = await ProductPost.findOne({_id: shareItem})
          console.log(!req.body.images)
          req.body.content = req.body.content ? req.body.content : item.content
          req.body.images = req.body.images ? req.body.images : item.images
        }

        const post = {
          ...req.body,
          shopid: shopid,
          orderid: order._id,
          content: req.body.content
        }
        const sharePost = new SharePost(post)
        await sharePost.save()

        res.send(sharePost);
      }
    }

    if(noOrder){
      res.send("You don't have related order");
    }

  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
});

// 獲取sharepost
router.get("/buyer/share/:buyerid", async(req, res) => {
  const buyerid = req.params.buyerid;
  const match = {};
  const sort = { createdAt: "desc" };
  try {
    const buyer = await Buyer.findOne({ _id: buyerid });
    // console.log(buyer)
    await buyer.populate({
      path: "sharePosts",
      match, // 匹配條件， 沒有就全部
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(buyer.sharePosts);
  } catch (e) {
    console.log(e)
    res.status(500).send("Server Error")
  }
})



module.exports = router;