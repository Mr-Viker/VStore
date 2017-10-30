/* HTML文件发送器 */
module.exports = function(fileName) {
    return function(req, res, next) {
        res.render(fileName);
        console.log('Sent: ', fileName + '.html');
        next();
    }
}