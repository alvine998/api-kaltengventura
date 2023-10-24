const { middlewareHere } = require('../middleware/index.js');
const uploadFile = require('../middleware/upload.js');

module.exports = (app) => {
    const cUser = require('../controllers/user.js');
    const cBank = require('../controllers/bank.js');
    const cDebtor = require('../controllers/debtor.js');
    const cApplication = require('../controllers/application.js');
    const cUpload = require('../controllers/upload.js');
    const cPayment = require('../controllers/payment.js');

    app.get('/user/list', middlewareHere, cUser.list);
    app.post('/user', middlewareHere, cUser.create);
    app.post('/user/login', middlewareHere, cUser.login);
    app.patch('/user', middlewareHere, cUser.update);
    app.delete('/user', middlewareHere, cUser.delete);

    app.get('/bank/list', middlewareHere, cBank.list);
    app.post('/bank', middlewareHere, cBank.create);
    app.patch('/bank', middlewareHere, cBank.update);
    app.delete('/bank', middlewareHere, cBank.delete);

    app.get('/debtor/list', middlewareHere, cDebtor.list);
    app.post('/debtor', middlewareHere, cDebtor.create);
    app.patch('/debtor', middlewareHere, cDebtor.update);
    app.delete('/debtor', middlewareHere, cDebtor.delete);
    app.post('/debtor/upload', middlewareHere, cDebtor.uploadImage);

    app.get('/application/list', middlewareHere, cApplication.list);
    app.post('/application', middlewareHere, cApplication.create);
    app.post('/application/approval', middlewareHere, cApplication.approval);
    app.patch('/application', middlewareHere, cApplication.update);
    app.delete('/application', middlewareHere, cApplication.delete);

    app.get('/payment/list', middlewareHere, cPayment.list);
    app.patch('/payment', middlewareHere, cPayment.update);

    app.post('/image/upload', uploadFile.single("file"), cUpload.uploadFiles)


}