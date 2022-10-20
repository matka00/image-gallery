const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();
const port = 3000;

fs = require("fs");

app.use(express.static("../frontend"));
app.use(fileUpload());

app.get("/api/pictures", (req, res) => {
  fs.readFile("../frontend/images/images.json", "utf8", function (err, data) {
    res.send(data);
  });
});

app.post("/api/pictures", (req, res) => {
  fs.readFile("../frontend/images/images.json", "utf8", function (err, data) {
    const image = req.files.pictureUrl;
    const uploadDate = new Date().getTime();
    const uploadPath =
      `${__dirname}/../frontend/images/` + uploadDate + image.name;
    const images = JSON.parse(data);

    image.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    });

    const uploadedImage = {
      pictureUrl: req.files.pictureUrl.name,
      title: req.body.title,
      uploadDate: uploadDate,
      photographer: req.body.photographer,
    };

    images.push(uploadedImage);

    fs.writeFile(
      "../frontend/images/images.json",
      JSON.stringify(images, null, 4),
      function (err) {
        if (err) {
          return "error";
        }
        res.send(uploadedImage);
      }
    );
  });
});

app.delete("/api/pictures", (req, res) => {
  fs.readFile("../frontend/images/images.json", "utf8", function (err, data) {
    const images = JSON.parse(data);
    const pictureUrl = req.query.pictureUrl;

    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      if (pictureUrl === image.uploadDate + image.pictureUrl) {
        images.splice(i, 1);
      }
    }
    fs.writeFile(
      "../frontend/images/images.json",
      JSON.stringify(images, null, 4),
      function (err) {
        let pictureUploadPath = `../frontend/images/${pictureUrl}`;

        if (err) {
          return "error";
        }

        if (fs.existsSync(pictureUploadPath)) {
          fs.unlinkSync(pictureUploadPath, (err) => {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            }
          });
        }
      }
    );
  });

  return res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
