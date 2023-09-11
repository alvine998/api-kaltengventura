
const db = require('../models')
const users = db.users
const Op = db.Sequelize.Op
const bcrypt = require('bcryptjs')
const fs = require('fs')
const crypto = require('crypto')
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const size = req.query.size || 10;
        const result = await users.findAll({
            where: {
                deleted: { [Op.eq]: 0 },
                ...req.query.search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${req.query.search}%` } },
                        { phone: { [Op.like]: `%${req.query.search}%` } },
                        { email: { [Op.like]: `%${req.query.search}%` } },
                    ]
                },
                ...req.query.id && { id: { [Op.eq]: req.query.id } },
                ...req.query.status && { status: { [Op.eq]: req.query.status } },
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
        const { phone } = req.body
        let requiredAttributes = ['name', 'phone', 'email', 'address', 'status', 'password']
        for (let index = 0; index < requiredAttributes.length; index++) {
            const element = requiredAttributes[index];
            if (!req.body[element]) {
                return res.status(400).send({
                    status: "error",
                    items: "",
                    error_message: "Parameter tidak lengkap!",
                    code: 400
                })
            }
        }
        let newPhone = null;
        if (phone[0] == '0') {
            newPhone = `${phone.substring(1, 12)}`
        }
        const existUsers = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                email: { [Op.eq]: req.body.email },
                phone: { [Op.eq]: req.body.phone }
            }
        })
        if (existUsers) {
            return res.status(404).send({ message: "Akun telah terdaftar!" })
        }
        const payload = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 8)
        };
        const result = await users.create(payload)
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

exports.login = async (req, res) => {
    try {
        const existUsers = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                email: { [Op.eq]: req.body.email }
            }
        })
        if (!existUsers) {
            return res.status(404).send({ message: "Email tidak ditemukan!" })
        }
        const comparePassword = await bcrypt.compare(req.body.password, existUsers.password)
        if (!comparePassword) {
            return res.status(404).send({ message: "Password Salah" })
        }
        res.status(200).send({ message: "Berhasil login", result: existUsers })
        return
    } catch (error) {
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.update = async (req, res) => {
    try {
        const result = await users.findOne({
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
            ...req.body.password && { password: bcrypt.hashSync(req.body.password, 8) }
        }
        const onUpdate = await users.update(payload, {
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        const results = await users.findOne({
            where: {
                deleted: { [Op.eq]: 0 },
                id: { [Op.eq]: req.body.id }
            }
        })
        res.status(200).send({ message: "Berhasil ubah data", result: results, update: onUpdate })
        return
    } catch (error) {
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}

exports.delete = async (req, res) => {
    try {
        const result = await users.findOne({
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
        return res.status(500).send({ message: "Gagal mendapatkan data admin", error: error })
    }
}