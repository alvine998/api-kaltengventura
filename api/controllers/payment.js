
const { formatDateToIndonesian } = require('../../utils');
const db = require('../models')
const payments = db.payments
const Op = db.Sequelize.Op
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size
        const { count, rows: result } = await payments.findAndCountAll({
            where: {
                deleted: { [Op.eq]: 0 },
                ...req.query.search && {
                    [Op.or]: [
                        { application_contract: { [Op.like]: `%${req.query.search}%` } },
                        { account_number: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.application_id && { application_id: { [Op.eq]: req.query.application_id } },
                ...req.query.status && { status: { [Op.eq]: req.query.status } },
                ...req.query.start_date && req.query.end_date && {
                    [Op.or]: [
                        {
                            from: { [Op.between]: [req.query.start_date, req.query.end_date] }
                        },
                        {
                            to: { [Op.between]: [req.query.start_date, req.query.end_date] }
                        }
                    ]
                }
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

exports.update = async (req, res) => {
    try {
        const result = await payments.findOne({
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
            ...req.body.payment_date && { payment_date: formatDateToIndonesian(req.body.payment_date) }
        }
        const onUpdate = await payments.update(payload, {
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