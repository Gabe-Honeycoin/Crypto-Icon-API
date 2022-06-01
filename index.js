var express = require("express");
var fs = require("fs"),
  request = require("request");
var unirest = require("unirest");
var bodyParser = require("body-parser");
var dotenv = require("dotenv").config({
  path: __dirname + "/.env",
});
const { dirname } = require("path");
const port = process.env.PORT || 3000;

var app = express();

var dotenv = require("dotenv").config({
  path: __dirname + "/.env",
});

app.use(bodyParser.json()); // for parsing application/json
app.use(
  bodyParser.raw({
    type: "image/png",
    limit: "10mb",
  })
);

const path = dirname(require.main.filename) + "/icon/";

app.get("/get-icon/:icon", function (req, resp) {
  const icon = req.params.icon;
  try {
    const pngPath = `${path}/${icon}.png`;
    if (fs.existsSync(pngPath)) {
      resp.sendFile(pngPath);
    } else {
        try{
          getLogoCMC(icon,resp)
        }catch(err){
          console.log("Getting UI Characters")
          download(
            `https://ui-avatars.com/api/?background=random&name=${icon}`,
            "temp.png",
            function () {
              console.log("done");
    
              resp.sendFile(`${dirname(require.main.filename)}/temp.png`);
            }
          );
        }
    }
  } catch (err) {
    resp.status(403).json({
      error: err,
    });
  }
});

async function getLogoCMC(icon,resp){
  console.log("checking CMC")
    unirest('GET', `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${icon}`)
  .headers({
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
  })
  .then(async function (res) { 
    if (res.error) throw new Error(res.error); 
    let logo_uri  = await res.body.data[`${icon.toUpperCase()}`][0].logo;
    download(
        logo_uri,
        "temp.png",
         ()=> {
          console.log("done");
          resp.sendFile(`${dirname(require.main.filename)}/temp.png`);
        }
      );
    
  }).catch((err) => {
    console.log(err)
    console.log("Getting UI Characters")
      download(
        `https://ui-avatars.com/api/?background=random&name=${icon}`,
        "temp.png",
        function () {
          console.log("done");

          resp.sendFile(`${dirname(require.main.filename)}/temp.png`);
        }
      );
  });
}

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

app.listen(port, () => {
  console.log(`listening at https://cryptoiconapi.honeycoin.app/:${port}`);
});
