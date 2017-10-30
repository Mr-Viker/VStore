(function() {
    'use strict';

    $(function() {
        var page = 0;
        var pageNum = 10;
        var loading = false;
        var searchText;

        init();

        function init() {
            regHandler();
            initLoading();
        }


        function regHandler() {
            // 提交表单
            $('#search-form').on('submit', function(ev) {
                ev.preventDefault();
                page = 0;
                searchText = $('input[name="search"]').val();
                $('#goods-list').empty();
                $('.weui-loadmore').removeClass('hide');

                getGoodsList();
                return false;
            })
        }

        // 获取包含搜索内容的商品列表
        function getGoodsList() {
            if (loading) {
                return;
            }
            loading = true;

            var data = {
                search: searchText,
                page: page,
                pageNum: pageNum,
            };

            $.get({
                url: '/api/goods/search',
                data: data,
                success: function(res) {
                    if (res.status == 1) {
                        if (res.data.length > 0) {
                            Common.insertData($('#goods-list'), $('#goods-list-temp'), res.data);
                        }
                        if (res.data.length < 10) {
                            loading = false;
                            $('.weui-loadmore').html('全部加载成功');
                            $(document.body).destroyInfinite();
                            return;
                        }
                        page++;
                    } else {
                        $('.weui-loadmore').html('加载失败');
                    }
                    loading = false;
                },
                error: function(err) {
                    $('.weui-loadmore').html('加载失败');
                    loading = false;
                }
            })
        }

        // 滚动加载
        function initLoading() {
            $(document.body).infinite().on('infinite', function() {
                getGoodsList();
            })
        }

    })
})();