(function() {
    'use strict';

    $(function() {
        var page = 0;
        var pageNum = 10;
        var loading = false;
        var type = 0; //type: 商品类型 0:表示为您推荐的商品
        var totalPrice = 0.00; //购物车总价
        var isCheckedAll = true;

        init();

        function init() {
            checkLogin();
            initLoading();
        }


        function checkLogin(cb) {
            Common.checkLogin(function(res) {
                if (res.status == 1) {
                    $('#page-has-login').removeClass('hide');
                    getCartInfo();
                    getGoodsList();
                } else {
                    $('#page-no-login').removeClass('hide');
                }
            })
        }


        // 获取购物车信息
        function getCartInfo() {
            $.get({
                url: '/api/cartInfo',
                success: function(res) {
                    if (res.status == 1) {
                        if (res.data.length > 0) {
                            Common.insertData($('#cart-list'), $('#cart-list-temp'), res.data);
                            regHandler();
                            // 更新总价
                            res.data.forEach(function(item) {
                                if (item.is_checked) {
                                    totalPrice += item.goods_num * item.goods.price;
                                } else {
                                    isCheckedAll = false;
                                }
                            })
                            if (isCheckedAll) {
                                $('#select-all').prop('checked', true);
                            } else {
                                $('#select-all').prop('checked', false);
                            }
                            $('#total-price').html(totalPrice.toFixed(2));

                        } else {
                            $('.cart-empty').removeClass('hide');
                        }
                    } else {
                        $.toptip(res.msg, 2000, 'warn');
                    }
                },
                error: function(err) {
                    $.toptip(err.msg, 2000, 'error');
                }
            })
        }


        function regHandler() {
            // 切换商品选中状态
            $('.selected-goods').on('click', function() {
                var postData = {};
                postData.id = $(this).data('id');
                postData.is_checked = $(this).prop('checked') ? 1 : 0;
                // 检查更新全选
                if (!postData.is_checked) {
                    isCheckedAll = false;
                    $('#select-all').prop('checked', false);
                } else {
                    // 假设都已勾选 再去检查每个checkbox 只要有一个没勾选就不是全选
                    isCheckedAll = true;
                    $('.selected-goods').each(function(index, item) {
                        if (!$(this).prop('checked')) {
                            isCheckedAll = false;
                        }
                    })
                    if (isCheckedAll) {
                        $('#select-all').prop('checked', true);
                    } else {
                        $('#select-all').prop('checked', false);
                    }
                }
                
                $.post({
                    url: '/api/cart/update',
                    data: postData,
                    success: function(res) {
                        if (res.status == 1) {
                            $('#total-price').html(res.data);
                        }
                    }
                })
            })

            // 全选按钮
            $("#select-all").on('click', function() {
                var checkboxs = $('.selected-goods');
                var isCheckedAll = $(this).prop('checked');
                checkboxs.each(function(index, item) {
                    if (isCheckedAll) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                });
                $.post({
                    url: '/api/cart/update',
                    data: {
                        is_checked: isCheckedAll ? 1 : 0,
                    },
                    success: function(res) {
                        if (res.status == 1) {
                            $('#total-price').html(res.data);
                        }
                    }
                })
            })

            // 去结算
            $('#btn-to-settlement').on('click', function() {
                var isHasOneChecked = false;
                $('.selected-goods').each(function(index, item) {
                    if ($(this).prop('checked')) {
                        isHasOneChecked = true;
                    }
                })
                if (isHasOneChecked) {
                    location.href = '/settlement';
                }
            })
            
        }


        // 获取推荐商品列表
        function getGoodsList() {
            if (loading) {
                return;
            }
            loading = true;
            $.get({
                url: '/api/goodsList',
                data: {
                    page: page,
                    pageNum: pageNum,
                    type: type,
                },
                success: function(res) {
                    if (res.status == 1) {
                        if (res.data.length > 0) {
                            Common.insertData($('#recommend-goods-list'), $('#recommend-goods-list-temp'), res.data);
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
            });
        }


        // 滚动加载
        function initLoading() {
            $(document.body).infinite().on('infinite', function() {
                getGoodsList();
            })
        }


    })
})();