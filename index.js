var express = require("express");
var fs = require("fs"),
  request = require("request");
var unirest = require("unirest");
var bodyParser = require("body-parser");
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
      download(
        `https://ui-avatars.com/api/?background=random&name=${icon}`,
        "temp.png",
        function () {
          console.log("done");

          resp.sendFile(`${dirname(require.main.filename)}/temp.png`);
        }
      );
    }
  } catch (err) {
    resp.status(403).json({
      error: err,
    });
  }
});

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
