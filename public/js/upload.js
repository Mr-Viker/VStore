var Upload = (function() {
    'use strict';

    function init(opt) {
        opt.btn = opt.btn || '.btn-upload';
        opt.url = opt.url || '/api/upload';

        upload(opt);
    }


    function upload(opt) {
        $(opt.btn).on('change', function(ev) {
            var name = $(this).data('name');
            var value = $(this)[0].files[0];
            console.log(name, value);
            if (!name || !value) {
                return;
            }
            var formData = new FormData();
            formData.append(name, value);

            opt.beforeUpload && opt.beforeUpload();
            $.post({
                url: opt.url,
                data: formData,
                processData: false,
                contentType: false,
                success: function(res) {
                    if (res.status == 1) {
                        opt.uploadFinished && opt.uploadFinished(res.data);
                    } else {
                        opt.uploadFail && opt.uploadFail();
                    }
                }
            });
        });
    }
 

    return {
        init: init,
    }
})();