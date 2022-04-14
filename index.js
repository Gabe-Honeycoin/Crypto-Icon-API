var express = require("express");
var bodyParser = require("body-parser");
const { dirname } = require("path");
const fs = require("fs");
const port = process.env.PORT || 3000;

var app = express();

var dotenv = require("dotenv").config({
  path: __dirname + "/.env",
});

app.use(bodyParser.json()); // for parsing application/json

const path = dirname(require.main.filename) + "/icon/";

app.get("/get-icon", function (req, res) {
  const icon = req.body.icon;
  try {
    const pngPath = `${path}/${icon}.png`;
    if (fs.existsSync(pngPath)) {
      res.sendFile(pngPath);
    } else {
      res.sendFile(`${path}_no_image_.png`);
    }
  } catch (err) {
    res.status(403).json({
      error: err,
    });
  }
});

app.listen(port, () => {
  console.log(`listening at https://cryptoiconapi.honeycoin.app/:${port}`);
});
