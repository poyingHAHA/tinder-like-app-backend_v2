const express = require("express");
const ProductPost = require("../models/productPost.js");

const router = new express.Router();

const findItems = async (condition, limit, skip, sort) => {
  if (condition) {
    const items = await ProductPost.find(condition, null, {
      limit: limit,
      skip: skip,
      sort,
    }).exec();
    return items;
  } else {
    const items = await ProductPost.find({}, null, {
      limit: limit,
      skip: skip,
      sort,
    }).exec();
    return items;
  }
};

router.get("/", async (req, res) => {
  const sort = { createdAt: "desc" };
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  let shopArr = req.query.shopid;

  try {
    let itemList = [];
    if (shopArr) {
      // 如果是根據shopid找的，就將limit平均分給幾間店
      shopArr = shopArr.split(",");
      const shopNum = shopArr.length;
      const shopLimit = Math.floor(limit / shopNum);
      const shopSkip = Math.floor(skip / shopNum);
      itemList = await shopArr.reduce(async (last, current) => {
        last = await Promise.resolve(last);
        const condition = { shopid: current };
        const items = await findItems(condition, shopLimit, shopSkip, sort);
        return last.concat(items);
      }, []);
      
      res.send(itemList);
      return;
    }

    if (!limit || !skip) {
      //直接找全部商品
      const items = await ProductPost.find({}, null, { sort });
      res.send(items);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server is wrong");
  }
});

// Get productpost by itemid
router.get("/:id", (req, res) => {
  const _id = req.params.id;

  ProductPost.findOne({ _id: _id }).then((product) => {
      if (!product) {
        return res.status(404).send("No product");
      }

      res.send(product);
    })
    .catch((e) => {
      res.status(500).send("sever is wrong");
    });
});

module.exports = router;

