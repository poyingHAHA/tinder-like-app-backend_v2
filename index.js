const express = require( "express")
require ("./db/tinder_app_db.js")
const productPostRouter =require( './routers/item.js')
const shopRouter =require( './routers/shop.js')
const buyerRouter =require( './routers/buyer.js')
const cors = require('cors')

const Buyer = require("./models/buyer");
const jwt = require("jsonwebtoken");
const config = require("./config/config.json");
const { isAuthenticated } = require("./auth/auth.js")

const app = express();
const port = process.env.PORT || 3000;

// automatically parse incoming JSON into JS object which you can access on req.body
app.use(cors());
app.use(express.json());

//not yet use authentication to pretect route
app.use('/items', productPostRouter)
app.use('/shop', shopRouter)
app.use('/buyer', buyerRouter)


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //check from database
  try {
    const buyer = await Buyer.findOne({email, password})
    if(buyer){
      const accessToken = jwt.sign({ email: email }, config.accessScret, {
        expiresIn: "10m",
      });
  
      //不用超時重新登入->uuid, 有要超時登入->JWT
      const refreshToken = jwt.sign({ email: email }, config.refreshSecret, {
          expiresIn: "24h",
      });
  
      return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });

    }else{
      return res.status(400).json({success: false, error: "No user found"});
    }
  } catch (e) {
    return res
    .status(500)
    .json({ success: false, error: "Internal Server Error" });
  }
});

app.post('/logout', async (req, res)=>{
  //cancel the refresh token in database
  


});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

module.exports = app;
