// 對資料做前處理後再放到資料庫
// Steps:
// 1. 每次存一間店，要幫那間店創一個User的document，順便把商品都存好
// 2. 也就是每次都會用到User、Shop、ProductPost這幾個Collection
// 3. 每個商品要多一個field放分詞過後的結果(先不要有點慢)
require("./db/tinder_app_db");
const ProductPost = require("./models/productPost.js");
const Buyer = require("./models/buyer.js");
const Shop = require("./models/shop.js");

const fs = require("fs-extra");
const shopeeFilePath = "D:/tinderApp_index_test/shopee";
const shops = fs.readdirSync(shopeeFilePath);

const dataToDB = async (shopid, shopNum) => {
  // 因為目前主要存的是商店，所以原本的account先給Shop的collection用
  let shopInfo = fs.readJsonSync(
    `D:/tinderApp_index_test/shopee/${shopid}/shopInfo_${
      shopid.split("_")[1]
    }_post.json`
  );
  const buyer = new Buyer({
    role: "buyer",
    awardCoin: 0,
    email: `test${shopNum}@example.com`,
    password: "123456",
    ...shopInfo,
    account: `testbuyer${shopNum}`,
  });
  await buyer.save();

  Buyer.find({ account: `testbuyer${shopNum}` }).exec(async (err, buyer) => {
    const shop = new Shop({
      buyerid: buyer[0]._id,
      shopAccount: shopInfo.account,
      ...shopInfo,
    });
    await shop.save();

    let items = fs.readdirSync(
      `D:/tinderApp_index_test/shopee/${shopid}/itemsInfo_tinder`
    );

    for (let item of items) {
      let product = fs.readJSONSync(
        `D:/tinderApp_index_test/shopee/${shopid}/itemsInfo_tinder/${item}`
      );
      if (product.feLabels.length === 0) {
        product.feLabels = [
          {
            labelid: 0,
            display_name: "null",
          },
        ];
      }

      const productPost = new ProductPost({
        shopid: shop._id,
        shopAccount: shop.shopAccount,
        ...product,
      });
      productPost.save();
    }
  });
};

// 將buyer跟shop還有product存入資料庫
let shopNum = 1;
for (let shop of shops) {
  dataToDB(shop, shopNum);
  break;
  shopNum += 1;
}

// 修改用
// Buyer.findOneAndUpdate({account: 'hy_fitness'}, {account: 'testbuyer1'},null,(err, doc, res)=>{
//   console.log(res)
// })

// Shop.findOneAndUpdate({shopAccount: 'testshop1'}, {shopAccount: 'hy_fitness'}, null, (err, doc, res)=>{
//   console.log(doc)
// })

// console.log(shopInfo)
