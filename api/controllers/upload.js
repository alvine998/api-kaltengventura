const fs = require('fs');
const db = require('../models')
const images = db.images

const uploadFiles = async (req, res) => {
    try {
        console.log(
            req.file
            );

        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        const image = await images.create({
            url: `http://localhost:8080/${req.file.path}`,
        })

        return res.send({url: image, message:"File Success Uploaded"});
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload images: ${error}`);
    }
};

module.exports = {
    uploadFiles,
};