(function() {
    'use strict';

    $(function() {
        var page = 0;
        var pageNum = 10;
        var loading = false; // 加载状态

        init();


        function init() {
            initSwiper();
            initLoading();
            getData();
        }


        // 初始化Swiper
        function initSwiper() {
            // banner
            var bannerSwiper = new Swiper('.swiper-container', {
                loop: true,
                pagination: '.swiper-pagination',
                autoplay: 3000,
            });
            // msg
            var msgSwiper = new Swiper('.swiper-container-2', {
                loop: true,
                direction: 'vertical',
                autoplay: 4000,
            });
            // prize
            var prizeSwiper = new Swiper('.swiper-container-3', {
                loop: true,
                autoplay: 5000,
            });
        }


        // 滚动加载
        function initLoading() {
            $(document.body).infinite().on('infinite', function() {
                if (loading) {
                    return;
                }
                loading = true;
                getData();
            })
        }


        // 获取商品数据
        function getData() {
            $.get({
                url: '/api/goodsList',
                data: {page: page, pageNum: pageNum, hot: 1},
                success: function(res) {
                    if (res.status == 1) {
                        if (res.data.length > 0) {
                            Common.insertData($('#goods-list'), $('#goods-list-temp'), res.data);
                        }
                        if (res.data.length < 10) {
                            loading = false;
                            $('.weui-loadmore').html('全部加载完成');
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

    })
})();