const db = require("../models");
const notifications = db.notifications;
const Op = db.Sequelize.Op;

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;
    const { count, rows: result } = await notifications.findAndCountAll({
      where: {
        deleted: { [Op.eq]: 0 },
        ...(req.query.user_id && { user_id: { [Op.eq]: req.query.user_id } }),
        ...(req.query.is_read && { is_read: { [Op.eq]: req.query.is_read } }),
        ...(req.query.search && {
          [Op.or]: [
            { title: { [Op.like]: `%${req.query.search}%` } },
            { message: { [Op.like]: `%${req.query.search}%` } },
          ],
        }),
      },
      order: [["created_on", "DESC"]],
      limit: size,
      offset: offset,
      include: [
        {
          model: db.users,
          attributes: ["id", "name", "email"],
        },
      ],
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

exports.create = async (req, res) => {
  try {
    let requiredAttributes = ["user_id", "title", "message"];
    for (let index = 0; index < requiredAttributes.length; index++) {
      const element = requiredAttributes[index];
      if (!req.body[element]) {
        return res.status(400).send({
          status: "error",
          error_message: "Parameter tidak lengkap! " + element,
          code: 400,
        });
      }
    }

    const payload = {
      user_id: req.body.user_id,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || "general",
      is_read: 0,
      deleted: 0,
    };

    const result = await notifications.create(payload);
    return res.status(200).send({
      status: "success",
      items: result,
      code: 200,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Server mengalami gangguan!", error: error });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send({ message: "ID parameter is required!" });
    }

    const result = await notifications.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        id: { [Op.eq]: req.body.id },
      },
    });

    if (!result) {
      return res.status(404).send({ message: "Data tidak ditemukan!" });
    }

    const payload = {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.message && { message: req.body.message }),
      ...(req.body.is_read !== undefined && { is_read: req.body.is_read }),
      ...(req.body.type && { type: req.body.type }),
    };

    await notifications.update(payload, {
      where: { id: req.body.id },
    });

    const updatedResult = await notifications.findByPk(req.body.id);

    return res.status(200).send({
      status: "success",
      message: "Berhasil ubah data",
      items: updatedResult,
      code: 200,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Gagal mengubah data", error: error });
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).send({ message: "ID parameter is required!" });
    }

    const result = await notifications.findOne({
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

    return res.status(200).send({ message: "Berhasil hapus data" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Gagal menghapus data", error: error });
  }
};
