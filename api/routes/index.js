const { middlewareHere } = require('../middleware/index.js');

module.exports = (app) => {
    const cUser = require('../controllers/user.js');
    const cBank = require('../controllers/bank.js');
    // const categories = require('../controllers/category.js');
    // const apps = require('../controllers/app.js');
    // const stocks = require('../controllers/stock.js');
    // const prices = require('../controllers/price.js');

    app.get('/user/list', middlewareHere, cUser.list);
    app.post('/user', middlewareHere, cUser.create);
    app.post('/user/auth', middlewareHere, cUser.login);
    app.patch('/user', middlewareHere, cUser.update);
    app.delete('/user', middlewareHere, cUser.delete);

    app.get('/bank/list', middlewareHere, cBank.list);
    app.post('/bank', middlewareHere, cBank.create);
    app.patch('/bank', middlewareHere, cBank.update);
    app.delete('/bank', middlewareHere, cBank.delete);

    // app.get('/apps', middlewareHere, apps.list);
    // app.post('/app', middlewareHere, apps.create);
    // app.patch('/app', middlewareHere, apps.update);
    // app.delete('/app', middlewareHere, apps.delete);


}