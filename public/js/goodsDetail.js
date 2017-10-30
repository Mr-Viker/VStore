(function() {
    'use strict';

    $(function() {
        var goodsId;
        var goodsInfo;

        init();

        function init() {
            goodsId = Common.getQueryParam('goodsId');
            getGoodsInfo();
            getCartSum();
        }


        // 获取购物车总数
        function getCartSum() {
            Common.checkLogin(function(res) {
                if (res.status == 1) {
                    $.get({
                        url: '/api/cart/sum',
                        success: function(res) {
                            $("#cart-sum").html(res.data).removeClass('hide');
                        }
                    })
                }
            })
        }


        // 获取商品详细数据
        function getGoodsInfo(cb) {
            if (!goodsId || !parseInt(goodsId)) {
                $.toptip('未找到该商品', 2000, 'warning');
                setTimeout(function() {
                    location.href = '/';
                }, 2000);
                return;
            }
            $.get({
                url: '/api/goodsDetailInfo?goodsId=' + goodsId,
                success: function(res) {
                    if (res.status == 1) {
                        goodsInfo = res.data;
                        Common.insertData($('#goods-detail'), $('#goods-detail-temp'), res.data);
                        initSwiper();
                        regHandler();
                    } else {
                        $.toptip(res.msg, 2000, 'error');
                    }
                }
            })
        }

        // 初始化轮播
        function initSwiper() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                loop: true,
            });
        }


        function regHandler() {
            // 加入购物车
            $('#btn-add-cart').on('click', function() {
                Common.checkLogin(function(res) {
                    if (res.status == 1) {
                        $.post({
                            url: '/api/cart/add',
                            data: {
                                goods_id: goodsId,
                                goods_num: $('input[name="goods_num"]').val(),
                            },
                            success: function(res) {
                                if (res.status == 1) {
                                    $.toast('加入购物车成功', 2000);
                                    $("#cart-sum").html(res.data).removeClass('hide');
                                } else if (res.status == 0) {
                                    location.href = '/login';
                                } else {
                                    $.toast(res.msg, 'cancel');
                                }
                            },
                            error: function(err) {
                                $.toast(err.msg, 'forbidden');
                            }
                        })
                    } else if (res.status == 0) {
                        location.href = '/login';
                    } else {
                        $.toast(res.msg, 2000, 'cancel');
                    }
                });
            })

            // 立即购买 跳转至结算页
            $('#btn-settlement').on('click', function() {
                Common.checkLogin(function(res) {
                    if (res.status == 1) {
                        location.href = '/settlement';
                    } else if (res.status == 0) {
                        location.href = '/login';
                    } else {
                        $.toast(res.msg, 2000, 'cancel');
                    }
                })
            })

            // 显示选择规格数量picker
            $('#btn-show-picker').picker({
                title: '请选择数量',
                toolbarCloseText: '确定',
                cols: [{
                    textAlign: 'center',
                    values: Common.getArrByNum(goodsInfo.amount),
                }],
            });
        }

    })
})();