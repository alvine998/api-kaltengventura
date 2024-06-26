
const { generateRandomString, formatDateToIndonesian } = require('../../utils')
const db = require('../models')
const applications = db.applications
const payments = db.payments
const debtors = db.debtors
const users = db.users
const Op = db.Sequelize.Op
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size
        const { count, rows: result } = await applications.findAndCountAll({
            where: {
                deleted: { [Op.eq]: 0 },
                ...req.query.search && {
                    [Op.or]: [
                        { contract_no: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.status && { status: { [Op.eq]: req.query.status } },
                ...req.query.user_id && { user_id: { [Op.eq]: req.query.user_id } },
            },
            order: [
                ['created_on', 'DESC'],
            ],
            ...req.query.pagination == 'true' && {
                limit: size,
                offset: offset
            }
        })
        const total_pages = Math.ceil(count / size);

        let resPay = 0
        if (req.query.id) {
            resPay = await payments.findAll({
                where: {
                    deleted: { [Op.eq]: 0 },
                    status: { [Op.eq]: 'unpaid' },
                    application_id: { [Op.eq]: req.query.id }
                }
            })
        }
        return res.status(200).send({
            status: "success",
            total_items: count,
            total_pages: total_pages,
            items: result,
            tempo: resPay[0]?.due_date,
            code: 200
        })
    } catch (error) {
        return res.status(500).send({ message: "Server mengalami gangguan!", error: error })
    }
};

exports.create = async (req, res) => {
    try {
        let requiredAttributes = ['user_id', 'user_name', 'loan', 'year', 'installment']
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
        const payload = {
            ...req.body,
        };
        const result = await applications.create(payload)
        if (req.body.user_from == "admin") {
            const payload2 = {
                application_id: result?.id,
                application_contract: req.body.contract_no,
                fee: req.body.installment,
                payment_rate: 0,
                payment_fee: 0,
                payment_date: null,
                total_payment: req.body.installment,
                status: req.body.status == "approved" ? 'unpaid' : 'paid'
            };
            let dates = new Date(req.body.start_date);
            let monthly = req.body.year * 12;
            let rem_month = monthly
            for (let index = 0; index < monthly; index++) {
                dates.setMonth(dates.getMonth() + 1);
                await payments.create({ ...payload2, due_date: formatDateToIndonesian(dates), remaining_payment: `${rem_month} Bulan`, payment_no: `Ke ${index + 1}` })
                rem_month -= 1
            }
        }
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

exports.approval = async (req, res) => {
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
        let randomess = generateRandomString(8)
        const payload = {
            ...req.body,
            ...req.body.status == "approved" && { contract_no: randomess },
            ...req.body.status == "approved" && {
                approved_by: {
                    admin_name: req.body.admin.name,
                    admin_id: req.body.admin.id,
                    date: new Date()
                }
            },
            status: req.body.status == "rejected" ? "rejected" : "approved"
        }
        const onUpdate = await applications.update(payload, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        if (req.body.status == "approved") {
            const payload = {
                application_id: result?.id,
                application_contract: randomess,
                fee: result?.installment,
                payment_rate: 0,
                payment_fee: 0,
                payment_date: null,
                total_payment: result?.installment,
                status: 'unpaid'
            };
            let dates = new Date();
            let monthly = result.year * 12;
            let rem_month = monthly
            for (let index = 0; index < monthly; index++) {
                dates.setDate(dates.getDate() + 30);
                await payments.create({ ...payload, due_date: formatDateToIndonesian(dates), remaining_payment: `${rem_month} Bulan`, payment_no: `Ke ${index + 1}` })
                rem_month -= 1
            }
        }
        res.status(200).send({ message: "Berhasil ubah status", update: onUpdate })
        return
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Gagal ubah status", error: error })
        return
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