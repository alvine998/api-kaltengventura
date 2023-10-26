const fs = require('fs')
const path = require('path')

exports.generateRandomString = (length) => {
    const characters = '0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

exports.formatDateToIndonesian = (date) => {
    const monthsInIndonesian = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'Mei', 'Jun', 'Jul', 'Agu',
        'Sep', 'Okt', 'Nov', 'Des'
    ];

    const month = monthsInIndonesian[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

exports.base64ToFormData = (base64) => {
    const data = base64.replace(/^data:image\/(png|jpeg);base64,/, '');
        const extension = base64.startsWith('data:image/png') ? 'png' : 'jpeg';
        const fileName = `${this.generateRandomString(10)}.${extension}`;
        const buffer = Buffer.from(data, 'base64');
        const uploadDirectory = path.join(__dirname, '..', 'resources', 'uploads');
        const filePath = path.join(uploadDirectory, fileName);
        fs.writeFileSync(filePath, buffer);
    return `http://localhost:8080/resources/uploads/${fileName}`;
}