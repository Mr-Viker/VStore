/* 路由分发入口 */
var fileHandler = require('../middlewares/fileHandler');
var captcha = require('../middlewares/captcha');
var formParser = require('../middlewares/formParser');
var upload = require('../middlewares/upload');

module.exports = function(app) {
    // HTML Static Page
    app.get('/', fileHandler('index'));
    app.get('/query', fileHandler('query'));
    app.get('/person', fileHandler('person'));
    app.get('/login', fileHandler('login'));
    app.get('/register', fileHandler('register'));
    app.get('/forgetPassword', fileHandler('forgetPassword'));
    app.get('/type', fileHandler('type'));
    app.get('/search', fileHandler('search'));
    app.get('/personalData', fileHandler('personalData'));
    app.get('/cart', fileHandler('cart'));
    app.get('/goodsDetail', fileHandler('goodsDetail'));
    app.get('/settlement', fileHandler('settlement'));


    // API
    // auth
    app.get('/api/captcha', captcha());
    app.get('/api/checkLogin', require('../controller/authCtrl'));
    app.get('/api/logout', require('../controller/authCtrl'));
    app.post('/api/register', require('../controller/authCtrl'));
    app.post('/api/login', require('../controller/authCtrl'));

    // user
    app.get('/api/user', require('../controller/userCtrl'));
    app.post('/api/user/update', require('../controller/userCtrl'));
    app.post('/api/upload', formParser(), upload());

    // goods
    app.get('/api/goodsList', require('../controller/goodsCtrl'));
    app.get('/api/goodsDetailInfo', require('../controller/goodsCtrl'));
    app.get('/api/goodsCateList', require('../controller/goodsCtrl'));
    app.get('/api/goods/search', require('../controller/goodsCtrl'));

    // cart
    app.get('/api/cartInfo', require('../controller/cartCtrl'));
    app.get('/api/cart/sum', require('../controller/cartCtrl'));
    app.post('/api/cart/add', require('../controller/cartCtrl'));
    app.post('/api/cart/update', require('../controller/cartCtrl'));

}