// const { middlewareHere } = require('../middleware/index.js');

module.exports = (app) => {
    const cUser = require('../controllers/user.js');
    // const customers = require('../controllers/customer.js');
    // const categories = require('../controllers/category.js');
    // const apps = require('../controllers/app.js');
    // const stocks = require('../controllers/stock.js');
    // const prices = require('../controllers/price.js');

    app.get('/users', cUser.list);
    app.post('/user', cUser.create);
    app.post('/user/auth', cUser.login);
    app.patch('/user', cUser.update);
    app.delete('/user', cUser.delete);

    // app.get('/customers', middlewareHere, customers.list);
    // app.post('/customer', middlewareHere, customers.create);
    // app.patch('/customer', middlewareHere, customers.update);
    // app.delete('/customer', middlewareHere, customers.delete);

    // app.get('/apps', middlewareHere, apps.list);
    // app.post('/app', middlewareHere, apps.create);
    // app.patch('/app', middlewareHere, apps.update);
    // app.delete('/app', middlewareHere, apps.delete);


}