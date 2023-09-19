
const db = require('../models')
const debtors = db.debtors
const Op = db.Sequelize.Op
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size
        const { count, rows: result } = await debtors.findAndCountAll({
            where: {
                deleted: { [Op.eq]: 0 },
                ...req.query.search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.user_id && { user_id: { [Op.eq]: req.query.user_id } },
                ...req.query.status && { status: { [Op.eq]: req.query.status } }
            },
            order: [
                ['created_on', 'DESC'],
            ],
            limit: size,
            offset: offset
        })
        const total_pages = Math.ceil(count / size);
        return res.status(200).send({
            status: "success",
            total_items: count,
            total_pages: total_pages,
            items: result,
            code: 200
        })
    } catch (error) {
        return res.status(500).send({ message: "Server mengalami gangguan!", error: error })
    }
};

exports.create = async (req, res) => {
    try {
        let requiredAttributes = ['name', 'address', 'field_type', 'place_status', 'mother_name', 'ktp', 'kk']
        for (let index = 0; index < requiredAttributes.length; index++) {
            const element = requiredAttributes[index];
            if (!req.body[element]) {
                return res.status(400).send({
                    status: "error",
                    items: "",
                    error_message: "Parameter tidak lengkap! " + element,
                    code: 400
                })
            }
        }
        const payload = {
            ...req.body,
        };
        const result = await debtors.create(payload)
        return res.status(200).send({
            status: "success",
            items: result,
            code: 200
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server mengalami gangguan!", error: error })
        return
    }
};

exports.update = async (req, res) => {
    try {
        const result = await debtors.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        if (!result) {
            return res.status(404).send({ message: "Data tidak ditemukan!" })
        }
        const payload = {
            ...req.body,
        }
        const onUpdate = await debtors.update(payload, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        const results = await debtors.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        res.status(200).send({ message: "Berhasil ubah data", update: onUpdate })
        return
    } catch (error) {
        return res.status(500).send({ message: "Gagal mendapatkan data", error: error })
    }
}

exports.delete = async (req, res) => {
    try {
        const result = await debtors.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.query.id }
            }
        })
        if (!result) {
            return res.status(404).send({ message: "Data tidak ditemukan!" })
        }
        result.deleted = 1
        await result.save()
        res.status(200).send({ message: "Berhasil hapus data" })
        return
    } catch (error) {
        return res.status(500).send({ message: "Gagal mendapatkan data", error: error })
    }
}