
const { formatDateToIndonesian, base64ToFormData } = require('../../utils');
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
                ['created_on', 'ASC'],
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

        let uploadPromise = null;

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
            ...req.body.photo && { photo: uploadedFiles[0] }
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
        console.log(error);
        res.status(500).send({ message: "Gagal mendapatkan data", error: error })
        return
    }
}