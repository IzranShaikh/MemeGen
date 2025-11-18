const express = require("express");
const multer = require("multer");
const { createCanvas, loadImage } = require("canvas");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text;
    const x = parseInt(req.body.x);
    const y = parseInt(req.body.y);
    const imagePath = req.file.path;

    const img = await loadImage(imagePath);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    // Style
    ctx.font = "bold 40px Impact";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    // Draw text at clicked position
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);

    // Output buffer
    const buffer = canvas.toBuffer("image/png");

    // Clean temporary upload
    fs.unlinkSync(imagePath);

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating meme");
  }
});

app.listen(3500, () => console.log("Server running on port 3500"));
