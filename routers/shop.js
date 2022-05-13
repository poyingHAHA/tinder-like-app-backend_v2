const express = require("express");
const Shop = require("../models/shop.js");

const router = new express.Router()

// Get shop Info by shopid
router.get('/:id', async (req, res) => {
  const shopid = req.params.id;
  try {
    const shop = await Shop.findOne({_id: shopid})
    res.send(shop)
  } catch (e) {
    console.log(e)
    res.status(500).send("Server Error")
  }
})

router.patch('/:id', async(req, res) => {
  const shopid = req.params.id
  const updates = Object.keys(req.body)
  
  console.log(updates)
  try {
    let shop = await Shop.findOne({_id: shopid})
    // console.log(shop)
    updates.forEach((update) => {
      shop[update] = req.body[update]
    })
    await shop.save()
    res.send(shop)  
  } catch (e) {
    console.log(e)
    res.status(500).send("Server Error")
  }
})


module.exports = router 