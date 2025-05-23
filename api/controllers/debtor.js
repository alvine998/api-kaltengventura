const db = require("../models");
const debtors = db.debtors;
const Op = db.Sequelize.Op;
const bucket = require("../../config/firebase");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { base64ToFormData } = require("../../utils");

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;
    const { count, rows: result } = await debtors.findAndCountAll({
      where: {
        deleted: { [Op.eq]: 0 },
        ...(req.query.search && {
          [Op.or]: [{ name: { [Op.like]: `%${req.query.search}%` } }],
        }),
        ...(req.query.id && { id: { [Op.eq]: req.query.id } }),
        ...(req.query.user_id && { user_id: { [Op.eq]: req.query.user_id } }),
        ...(req.query.status && { status: { [Op.eq]: req.query.status } }),
      },
      order: [["created_on", "DESC"]],
      limit: size,
      offset: offset,
    });
    const total_pages = Math.ceil(count / size);
    return res.status(200).send({
      status: "success",
      total_items: count,
      total_pages: total_pages,
      items: result,
      code: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Server mengalami gangguan!", error: error });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const base64 = req.body.base64Data;
    const data = base64.replace(/^data:image\/(png|jpeg);base64,/, "");
    const extension = base64.startsWith("data:image/png") ? "png" : "jpeg";
    const fileName = `image.${extension}`;
    const buffer = Buffer.from(data, "base64");
    const uploadDirectory = path.join(
      __dirname,
      "..",
      "..",
      "resources",
      "uploads"
    );
    const filePath = path.join(uploadDirectory, fileName);
    console.log(uploadDirectory);
    console.log(filePath);
    fs.writeFileSync(filePath, buffer);
    res.sendFile(filePath);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

exports.create = async (req, res) => {
  try {
    let requiredAttributes = [
      "name",
      "address",
      "field_type",
      "place_status",
      "mother_name",
      "ktp",
      "kk",
    ];
    for (let index = 0; index < requiredAttributes.length; index++) {
      const element = requiredAttributes[index];
      if (!req.body[element]) {
        return res.status(400).send({
          status: "error",
          items: "",
          error_message: "Parameter tidak lengkap! " + element,
          code: 400,
        });
      }
    }
    const buffers = [
      {
        label: "ktp",
        data: Buffer.from(
          req.body.ktp.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        raw: req.body.ktp,
      },
      req.body.partner_ktp && {
        label: "partnerktp",
        data: Buffer.from(
          req.body.partner_ktp.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        raw: req.body.partner_ktp,
      },
      {
        label: "kk",
        data: Buffer.from(
          req.body.kk.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        raw: req.body.kk,
      },
    ].filter((v) => v !== "undefined");

    const getDownloadUrl = async (file) => {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Set expiration date as needed
      });
      return url;
    };

    const uploadPromise = buffers.map(async (file) => {
      const { data, label, raw } = file;
      const buffer = Buffer.from(data, "base64");
      const storageFile = bucket.file(`uploads/${label}-${req.body.name}`);

      new Promise((resolve, reject) => {
        const stream = storageFile.createWriteStream({
          metadata: {
            contentType: raw.startsWith("data:image/png")
              ? "image/png"
              : raw.startsWith("data:image/png")
              ? "image/jpg"
              : "image/jpeg", // Adjust according to your file type
          },
        });

        stream.on("error", (err) => {
          console.error(err);
          reject("File upload failed.");
        });

        stream.on("finish", async () => {
          await storageFile.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFile.name}`;
          resolve(publicUrl);
        });

        stream.end(buffer);
      });

      return await getDownloadUrl(storageFile);
    });

    const uploadedFiles = await Promise.all(uploadPromise);

    const payload = {
      ...req.body,
      ...(req.body.ktp && { ktp: uploadedFiles[0] }),
      ...(req.body.partner_ktp && {
        partner_ktp: req.body.partner_ktp ? uploadedFiles[1] : null,
      }),
      ...(req.body.kk && {
        kk: req.body.partner_ktp ? uploadedFiles[2] : uploadedFiles[1],
      }),
    };
    const result = await debtors.create(payload);
    return res.status(200).send({
      status: "success",
      items: result,
      code: 200,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Server mengalami gangguan!", error: error });
    return;
  }
};

exports.update = async (req, res) => {
  try {
    const result = await debtors.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        id: { [Op.eq]: req.body.id },
      },
    });
    if (!result) {
      return res.status(404).send({ message: "Data tidak ditemukan!" });
    }

    if (req.body.ktp || req.body.kk || req.body.partner_ktp) {
      const buffers = [
        {
          label: "ktp",
          data: Buffer.from(
            req.body.ktp.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          raw: req.body.ktp,
        },
        req.body.partner_ktp && {
          label: "partnerktp",
          data: Buffer.from(
            req.body.partner_ktp.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          raw: req.body.partner_ktp,
        },
        {
          label: "kk",
          data: Buffer.from(
            req.body.kk.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          raw: req.body.kk,
        },
      ].filter((v) => !v.raw.includes("https"));

      const uploadToGCS = async ({ data, label, raw }) => {
        const extension = raw.startsWith("data:image/png")
          ? "png"
          : raw.startsWith("data:image/jpeg") ||
            raw.startsWith("data:image/jpg")
          ? "jpg"
          : "jpeg";

        const fileName = `uploads/${label}-${req.body.name}.${extension}`;
        const storageFile = bucket.file(fileName);

        return new Promise((resolve, reject) => {
          const stream = storageFile.createWriteStream({
            metadata: {
              contentType: `image/${extension}`,
            },
            resumable: false,
          });

          stream.on("error", (err) => {
            console.error("Upload error:", err);
            reject(err);
          });

          stream.on("finish", async () => {
            try {
              await storageFile.makePublic();
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFile.name}`;
              resolve(publicUrl);
            } catch (err) {
              console.error("makePublic error:", err);
              reject(err);
            }
          });

          stream.end(data);
        });
      };

      const uploadedFiles = await Promise.all(buffers.map(uploadToGCS));

      const payload = {
        ...req.body,
        ...(req.body.ktp && {
          ktp: req.body.ktp
            ? uploadedFiles.find((v) => v.raw === req.body.ktp)
            : req.body.ktp,
        }),
        ...(req.body.partner_ktp && {
          partner_ktp: req.body.partner_ktp
            ? uploadedFiles.find((v) => v.raw === req.body.partner_ktp)
            : req.body.partner_ktp,
        }),
        ...(req.body.kk && {
          kk: req.body.partner_ktp
            ? uploadedFiles.find((v) => v.raw === req.body.kk)
            : req.body.kk,
        }),
      };
      const onUpdate = await debtors.update(payload, {
        where: {
          deleted: { [Op.eq]: 0 },
          id: { [Op.eq]: req.body.id },
        },
      });
      const results = await debtors.findOne({
        where: {
          deleted: { [Op.eq]: 0 },
          id: { [Op.eq]: req.body.id },
        },
      });
      res.status(200).send({ message: "Berhasil ubah data", update: onUpdate });
      return;
    }

    const payload = {
      ...req.body,
    };
    const onUpdate = await debtors.update(payload, {
      where: {
        deleted: { [Op.eq]: 0 },
        id: { [Op.eq]: req.body.id },
      },
    });
    const results = await debtors.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        id: { [Op.eq]: req.body.id },
      },
    });
    res.status(200).send({ message: "Berhasil ubah data", update: onUpdate });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Gagal mendapatkan data", error: error });
    return;
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await debtors.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        id: { [Op.eq]: req.query.id },
      },
    });
    if (!result) {
      return res.status(404).send({ message: "Data tidak ditemukan!" });
    }
    result.deleted = 1;
    await result.save();
    res.status(200).send({ message: "Berhasil hapus data" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Gagal mendapatkan data", error: error });
    return;
  }
};
