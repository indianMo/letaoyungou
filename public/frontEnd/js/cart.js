$(function () {
  mui.init({
    pullRefresh: {
      container: '.mui-scroll-wrapper',
      down: {
        auto: true,
        callback: function () {
          var that = this;
          /*获取数据*/
          getCartData(function (data) {
            that.endPulldownToRefresh();
            /*渲染*/
            window.data = data;
            $('#cart_box').html(template('cartTpl', { model: window.data }));
          });
        }
      }
    }
  });
})