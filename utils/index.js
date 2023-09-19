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