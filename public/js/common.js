var Common = (function() {
    'use strict';

    // 检测用户是否登录
    function checkLogin(cb) {
        $.get({
            url: '/api/checkLogin',
            success: function(res) {
                cb && cb(res);
            },
            error: function(err) {
                $.toptip(err.msg, 2000, 'error');
            }
        })
    }


    // 插入数据到模板
    function insertData(container, temp, data) {
        if (container && temp) {
            if (Array.isArray(data)) {
                for(var i = 0, len = data.length; i < len; i++) {
                    container.append(doT.template(temp.text())(data[i]));
                }
            } else {
                container.append(doT.template(temp.text())(data));
            }
        }
    }


    // 获取查询参数
    function getQueryParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return;
    }


    // 根据给定数字返回相应数组
    function getArrByNum(num) {
        var arr = [];
        for(var i = 1, len = num; i <= len; i++) {
            arr.push(i);
        }
        return arr;
    }


    return {
        checkLogin: checkLogin,
        insertData: insertData,
        getQueryParam: getQueryParam,
        getArrByNum: getArrByNum,
    }
})();