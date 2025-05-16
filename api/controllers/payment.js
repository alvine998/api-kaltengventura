const { formatDateToIndonesian, base64ToFormData } = require("../../utils");
const db = require("../models");
const payments = db.payments;
const applications = db.applications;
const Op = db.Sequelize.Op;
require("dotenv").config();
const bucket = require("../../config/firebase");

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;
    const { count, rows: result } = await payments.findAndCountAll({
      where: {
        deleted: { [Op.eq]: 0 },
        ...(req.query.search && {
          [Op.or]: [
            { application_contract: { [Op.like]: `%${req.query.search}%` } },
            {
              "$application.user_name$": { [Op.like]: `%${req.query.search}%` },
            }, // Filtering by user_name
          ],
        }),
        ...(req.query.id && { id: { [Op.eq]: req.query.id } }),
        ...(req.query.application_id && {
          application_id: { [Op.eq]: req.query.application_id },
        }),
        ...(req.query.status && { status: { [Op.eq]: req.query.status } }),
        ...(req.query.start_date &&
          req.query.end_date && {
            [Op.or]: [
              {
                from: {
                  [Op.between]: [req.query.start_date, req.query.end_date],
                },
              },
              {
                to: {
                  [Op.between]: [req.query.start_date, req.query.end_date],
                },
              },
            ],
          }),
      },
      order: [["created_on", "ASC"]],
      include: [
        {
          model: applications,
          as: "application",
          attributes: ["user_id", "user_name"],
        },
      ],
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
    console.log(error);
    res
      .status(500)
      .send({ message: "Server mengalami gangguan!", error: error });
    return;
  }
};

exports.update = async (req, res) => {
  try {
    const result = await payments.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        id: { [Op.eq]: req.body.id },
      },
    });
    if (!result) {
      return res.status(404).send({ message: "Data tidak ditemukan!" });
    }

    let uploadPromise = null;

    if (req.body.photo) {
      const buffers = [
        {
          label: "photo",
          data: Buffer.from(
            req.body.photo.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          raw: req.body.photo,
        },
      ];

      const uploadToGCS = async ({ data, label, raw }) => {
        const extension = raw.startsWith("data:image/png")
          ? "png"
          : raw.startsWith("data:image/jpeg") ||
            raw.startsWith("data:image/jpg")
          ? "jpg"
          : "jpeg";

        const fileName = `uploads/${label}-${req.body.id}.${extension}`;
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

      const payloadWithPhoto = {
        ...req.body,
        photo: uploadedFiles[0],
      };
      await payments.update(payloadWithPhoto, {
        where: {
          deleted: { [Op.eq]: 0 },
          id: { [Op.eq]: req.body.id },
        },
      });
    } else {
      await payments.update(
        { ...req.body },
        {
          where: {
            deleted: { [Op.eq]: 0 },
            id: { [Op.eq]: req.body.id },
          },
        }
      );
    }
    res.status(200).send({ message: "Berhasil ubah data" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Gagal mendapatkan data", error: error });
    return;
  }
};
