
(function() {
    'use strict';

    $(function() {
        init();

        function init() {
            getUserInfo(regHandler);
        }

        function getUserInfo(cb) {
            Common.checkLogin(function(res) {
                if (res.status == 1) {
                    Common.insertData($('#user'), $('#user-temp'), res.data);
                    $('#page-has-login').removeClass('hide');
                } else {
                    $('#page-no-login').removeClass('hide');
                }
                cb && cb();
            });
        }


        function regHandler() {
            // 退出登录
            $('#btn-logout').on('click', function() {
                $.get({
                    url: '/api/logout',
                    success: function(res) {
                        if (res.status == 1) {
                            $.toast(res.msg, 2000 , function() {
                                location.reload();
                            });
                        } else {
                            $.toast(res.msg, 'forbidden');
                        }
                    }
                })
            })
        }
    })
})();