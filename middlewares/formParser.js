/* 客户端请求数据解析器 */
var formidable = require('formidable');


module.exports = function() {
    return function(req, res, next) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = './upload';
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {
            if (err) {
                console.log('parse form err: ', err);
                next(err);
                return;
            }
            if (fields) {
                req.body = fields;
            }
            if (files) {
                req.files = files;
            }
            next();
        });
    }
}