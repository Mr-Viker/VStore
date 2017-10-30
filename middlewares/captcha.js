/* 生成验证码中间件 */
var svgCaptcha = require('svg-captcha');


module.exports = function() {
    return function(req, res, next) {
        var captcha = svgCaptcha.create({
            noise: 3,
            color: true,
            width: 90,
        });
        req.session.captcha = captcha.text;

        res.type('svg');
        res.status(200).send(captcha.data);
    }
}