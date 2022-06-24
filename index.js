const mongoose = require('mongoose');
const express = require("express");
var cors = require('cors')
const routes = require('./routes/index');
const mainFunction = require('./main');
const saveSymbol = require('./UtilFunctions/saveSymbols');

const app = express();

const uri = "mongodb+srv://nightfuury:Bbdnitm%402014@tradebot.74say.mongodb.net/?retryWrites=true&w=majority";

//const url ='mongodb+srv://nightfuury:Bbdnitm%402014@tradebot.74say.mongodb.net/tradebot'

app.use(cors());

app.use('/', routes);



mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {


    app.listen(5000, () => {
      console.log("Server has started!")
    })

  })
  .then(() => {
    console.log('OK')
    //timedTrx();
  })
  .catch(err => console.log(err));


const timedTrx = () => {
  setInterval(() => {
    mainFunction.main();
  }, 28000);
}