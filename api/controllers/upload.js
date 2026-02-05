const fs = require("fs");
const db = require("../models");
const images = db.images;
const { uploadFileToR2 } = require("../../utils/uploadR2");

const uploadFiles = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
    const url = await uploadFileToR2(
      req.file.buffer,
      fileName,
      req.file.mimetype,
    );

    const image = await images.create({
      url: url,
    });

    return res.send({ url: image, message: "File Success Uploaded" });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};
