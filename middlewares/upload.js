/**
 * 处理文件上传中间件
 * @return file path obj
 */
module.exports = function() {
    return function(req, res, next) {
        var files = req.files;
        var path = {};
        for(var i in files) {
            if (files.hasOwnProperty(i)) {
                path[i] = files[i].path;
            }
        }
        if (Object.keys(path).length <= 0) {
            res.send({status: 0, msg: '上传文件失败'});
            return;
        }
        res.send({status: 1, data: path, msg: '上传文件成功'});
        next();
    }
}