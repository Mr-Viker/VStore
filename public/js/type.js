(function() {
    'use strict';

    $(function() {
        var type = 0; //商品类型id
        var page = 0;
        var pageNum = 10;
        var loading = false; // 加载状态

        init();

        function init() {
            getCateList(regHandler);
            getGoodsList();
            initLoading();
        }

        // 获取商品类型列表
        function getCateList(cb) {
            $.get({
                url: '/api/goodsCateList',
                success: function(res) {
                    if (res.status == 1) {
                        Common.insertData($('#cate-list'), $('#cate-list-temp'), res.data);
                        cb && cb();
                    } else {
                        $.toptip(res.msg, 2000, 'error');
                    }
                },
                error: function(err) {
                    $.toptip(err.msg, 2000, 'error');
                }
            })
        }

        // 获取某类型下的商品列表
        function getGoodsList() {
            $.get({
                url: '/api/goodsList',
                data: {
                    page: page,
                    pageNum: pageNum,
                    type: type
                },
                success: function(res) {
                    if (res.status == 1) {
                        if (res.data.length > 0) {
                            Common.insertData($('#tab-content'), $('#tab-content-temp'), res.data);
                        }
                        if (res.data.length < 10) {
                            loading = false;
                            $('.weui-loadmore').html('全部加载成功');
                            $(document.body).destroyInfinite();
                            return;
                        }
                        page++;
                    } else {
                        // $.toptip(res.msg, 2000, 'error');
                        $('.weui-loadmore').html('加载失败');
                    }
                    loading = false;
                },
                error: function(err) {
                    // $.toptip(err.msg, 2000, 'error');
                    $('.weui-loadmore').html('加载失败');
                    loading = false;
                }
            })
        }


        function regHandler() {
            // 点击tab
            $('.tab-item').on('click', function(ev) {
                type = $(this).data('type');
                page = 0;
                $('#tab-content').html('');
                getGoodsList();
            })
        }


        // 滚动加载
        function initLoading() {
            $(document.body).infinite().on('infinite', function() {
                if (loading) {
                    return;
                }
                loading = true;
                getGoodsList();
            })
        }

    })
})();