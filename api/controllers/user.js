
const db = require('../models')
const users = db.users
const Op = db.Sequelize.Op
const bcrypt = require('bcryptjs')
const bucket = require('../../config/firebase')
const { base64ToFormData } = require('../../utils')
require('dotenv').config()

// Retrieve and return all notes from the database.
exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size
        const { count, rows: result } = await users.findAndCountAll({
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
                ...req.query.from && { from: { [Op.eq]: req.query.from } },
            },
            order: [
                ['created_on', 'DESC'],
            ],
            ...req.query.pagination == "true" && {
                limit: size,
                offset: offset
            }
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
        console.log(error);
        res.status(500).send({ message: "Server mengalami gangguan!", error: error })
        return
    }
};

exports.create = async (req, res) => {
    try {
        const { phone } = req.body
        let requiredAttributes = ['name', 'phone', 'email', 'status', 'password']
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
        if(req.body.photo){
            const buffers = [
                { label: "photo", data: Buffer.from(req.body.photo.replace(/^data:image\/\w+;base64,/, ''), 'base64'), raw: req.body.photo },
            ].filter(v => v !== "undefined");
    
            const getDownloadUrl = async (file) => {
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500', // Set expiration date as needed
                });
                return url;
            };
    
            uploadPromise = buffers.map(async (file) => {
                const { data, label, raw } = file
                const buffer = Buffer.from(data, 'base64');
                const storageFile = bucket.file(`uploads/${label}-${req.body.name}`);
    
    
                new Promise((resolve, reject) => {
                    const stream = storageFile.createWriteStream({
                        metadata: {
                            contentType: raw.startsWith('data:image/png') ? 'image/png' : raw.startsWith('data:image/png') ? 'image/jpg' : 'image/jpeg' // Adjust according to your file type
                        }
                    });
    
                    stream.on('error', (err) => {
                        console.error(err);
                        reject('File upload failed.');
                    });
    
                    stream.on('finish', async () => {
                        await storageFile.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFile.name}`;
                        resolve(publicUrl);
                    });
    
                    stream.end(buffer);
                });
    
                return await getDownloadUrl(storageFile)
            })
        }

        const uploadedFiles = await Promise.all(uploadPromise);
        const payload = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 8),
            ...req.body.photo && { photo: uploadedFiles[0] }
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
        if(req.body.photo){
            const buffers = [
                { label: "photo", data: Buffer.from(req.body.photo.replace(/^data:image\/\w+;base64,/, ''), 'base64'), raw: req.body.photo },
            ].filter(v => v !== "undefined");
    
            const getDownloadUrl = async (file) => {
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500', // Set expiration date as needed
                });
                return url;
            };
    
            uploadPromise = buffers.map(async (file) => {
                const { data, label, raw } = file
                const buffer = Buffer.from(data, 'base64');
                const storageFile = bucket.file(`uploads/${label}-${req.body.name}`);
    
    
                new Promise((resolve, reject) => {
                    const stream = storageFile.createWriteStream({
                        metadata: {
                            contentType: raw.startsWith('data:image/png') ? 'image/png' : raw.startsWith('data:image/png') ? 'image/jpg' : 'image/jpeg' // Adjust according to your file type
                        }
                    });
    
                    stream.on('error', (err) => {
                        console.error(err);
                        reject('File upload failed.');
                    });
    
                    stream.on('finish', async () => {
                        await storageFile.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFile.name}`;
                        resolve(publicUrl);
                    });
    
                    stream.end(buffer);
                });
    
                return await getDownloadUrl(storageFile)
            })
        }

        const uploadedFiles = await Promise.all(uploadPromise);
        const payload = {
            ...req.body,
            ...req.body.password && { password: bcrypt.hashSync(req.body.password, 8) },
            ...req.body.photo && { photo: uploadedFiles[0] }
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