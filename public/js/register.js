(function() {
    'use strict';

    $(function() {
        init();

        function init() {
            regHandler();
        }


        // 事件处理器注册函数
        function regHandler() {
            // 注册表单提交
            $('#register-form').on('submit', function(ev) {
                ev.preventDefault();
                var postData = $(this).serialize();
                $.post({
                    url: '/api/register',
                    data: postData,
                    success: function(res) {
                        if (res.status == 1) {
                            $.toptip(res.msg, 2000, 'success');
                            setTimeout(function() {
                                location.href = '/login';
                            }, 2000);
                        } else {
                            $.toptip(res.msg, 2000, 'error');
                        }
                    }
                });
                return false;
            });

            // 验证码点击处理
            $('.weui-vcode-img').on('click', function() {
                $(this).attr('src', '/api/captcha?v=' + Date.now());
            });

            // 上传头像
            Upload.init({
                btn: '.btn-upload',
                url: '/api/upload',
                beforeUpload: function() {
                    $('.img-upload').attr('src', '/public/img/loading.gif');
                },
                uploadFinished: function(res) {
                    $('.img-upload').attr('src', res.avatar);
                    $('#avatar').val(res.avatar);
                },
                uploadFail: function() {
                    $.toptip(res.msg, 2000, 'error');
                }
            })
        }

    })
})();