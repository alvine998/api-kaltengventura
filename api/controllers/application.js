
const db = require('../models')
const applications = db.applications
const debtors = db.debtors
const users = db.users
const Op = db.Sequelize.Op
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const size = req.query.size || 10;
        const result = await applications.findAll({
            where: {
                deleted: { [Op.eq]: 0 },
                ...req.query.search && {
                    [Op.or]: [
                        { contract_no: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.status && { status: { [Op.eq]: req.query.status } },
                ...req.query.debtor_id && { debtor_id: { [Op.eq]: req.query.debtor_id } },
                ...req.query.user_id && { user_id: { [Op.eq]: req.query.user_id } },
            },
            order: [
                ['created_on', 'DESC'],
            ],
            limit: size
        })
        return res.status(200).send({
            status: "success",
            total_items: result.length,
            items: result,
            code: 200
        })
    } catch (error) {
        return res.status(500).send({ message: "Server mengalami gangguan!", error: error })
    }
};

exports.create = async (req, res) => {
    try {
        let requiredAttributes = ['user_id', 'user_name', 'debtor_id', 'debtor_name', 'loan', 'year', 'installment']
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
        const existUser = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.user_id }
            }
        })
        if (!existUser) {
            return res.status(400).send({
                status: "error",
                items: "",
                error_message: "Data user tidak ditemukan!",
                code: 400
            })
        }
        const existDebt = await debtors.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.debtor_id }
            }
        })
        if (!existDebt) {
            return res.status(400).send({
                status: "error",
                items: "",
                error_message: "Data debtor tidak ditemukan!",
                code: 400
            })
        }
        const payload = {
            ...req.body,
        };
        const result = await applications.create(payload)
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
        const result = await applications.findOne({
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
        const onUpdate = await applications.update(payload, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        const results = await applications.findOne({
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
        const result = await applications.findOne({
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