/* 检测用户是否登录 */
module.exports = function() {
    return function(req, res, next) {
        if (!req.session.user) {
            res.send({status: 0, msg: '用户未登录'});
            return;
        }
        next();
    }
}