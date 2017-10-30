(function() {
    'use strict';

    $(function() {
        var id;

        init();

        function init() {
            id = Common.getQueryParam('id') || $.cookie('id');
            getUserInfo(regHandler);
        }


        function getUserInfo(cb) {
            $.get({
                url: '/api/user?id=' + id,
                success: function(res) {
                    if (res.status == 1) {
                        Common.insertData($('#user-info'), $('#user-info-temp'), res.data);
                    } else if (res.status == 10) {
                        location.href = '/login';
                    } else {
                        $.toptip(res.msg, 2000, 'error');
                    }
                    cb && cb();
                }
            })
        }


        function regHandler() {
            // 表单提交
            $('#personal-data-form').on('submit', function(ev) {
                ev.preventDefault();

                // var formData = new FormData();
                // formData.append('id', $("#id").val());
                // formData.append('nickname', $('#nickname').val());
                // var avatar = $('#avatar')[0].files[0];
                // avatar ? formData.append('avatar', avatar) : '';
                // console.log('formData: ', formData);
                var postData = $(this).serialize();
                $.post({
                    url: '/api/user/update',
                    data: postData,
                    // processData: false,
                    // contentType: false,
                    success: function(res) {
                        if (res.status == 1) {
                            $.toptip(res.msg, 2000, 'success');
                            setTimeout(function() {
                                location.href = '/person';
                            }, 2000);
                        } else {
                            $.toptip(res.msg, 2000, 'error');
                        }
                    }
                })
            })

            $("#btn-back").on('click', function() {
                history.back();
            })

            // 更换头像
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