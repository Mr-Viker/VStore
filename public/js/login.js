(function() {
    'use strict';

    $(function() {
        init();

        function init() {
            regHandler();
        }


        // 注册事件处理器
        function regHandler() {
            // 提交表单
            $('#login-form').on('submit', function(ev) {
                ev.preventDefault();
                var postData = $(this).serialize();
                $.post({
                    url: '/api/login',
                    data: postData,
                    success: function(res) {
                        if (res.status == 1) {
                            $.cookie('id', res.data.id, {expires: 7, path: '/',});
                            $.toptip(res.msg, 1000, 'success');
                            setTimeout(function() {
                                location.href = '/person';
                            }, 1000);
                        } else {
                            $.toptip(res.msg, 1000, 'error');
                        }
                    }
                });
            });
        }

    })
})();