$(function () {
  // 获取数据列表
  var getSecondData = function (pageNum) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: pageNum || 1,
        pageSize: 5
      },
      dataType: 'json',
      success: function (data) {
        // console.log(data);
        var secondResult = template('second-template', data);
        $('tbody').html(secondResult);

        $('.pagination').bootstrapPaginator({
          /*当前使用的是3版本的bootstrap*/
          bootstrapMajorVersion: 3,
          /*配置的字体大小是小号*/
          size: 'small',
          /*当前页*/
          currentPage: data.page,
          /*一共多少页*/
          // 总页数=数据的总数/每页显示多少条数据
          totalPages: Math.ceil(data.total / data.size),
          /*点击页面事件*/
          onPageClicked: function (event, originalEvent, type, page) {
            /*改变当前页再渲染 page当前点击的按钮的页面*/
            getSecondData(page);
          }
        });





      }
    })
  }

  //添加二级分类
  $('#addBtn').on('click', function () {
    $('#second-modal').modal('show');
  });
  //


  getSecondData();
  initDropDown();
  initUpload();



  // 校验
  $('#secondform').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      // 字段名是name属性的值
      brandName: {
        validators: {
          notEmpty: {
            message: '二级分类不能为空'
          }
        }
      }
    }
  }).on('success.form.bv', function (e) { //点击提交之后
    // Prevent form submission 防止表单提交
    e.preventDefault();
    // Get the form instance 获取表单实例
    var $form = $(e.target);
    // Get the BootstrapValidator instance
    var bv = $form.data('bootstrapValidator');
    // brandName     品牌名称
    // categoryId    所属分类id 
    // brandLogo     品牌
    var data = $form.serialize();
    // console.log(data);
    // console.log(0)
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: data,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        // 关掉遮罩层
        $('#second-modal').modal('hide');
        // 刷新数据
        // getSecondData();
        getSecondData()
      }
    })
  })

});

var initDropDown = function () {

  var $dropDown = $('.dropdown');
  $dropDown.on('click', '#dLabel', function () {
    // console.log(1)

    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 50
      },
      success: function (data) {
        var html = '';
        // console.log(1);
        // console.log(data);
        $.each(data.rows, function (i, item) {
          // console.log(i,item);
          html += '<li><a href="javascript:;" data-id="'+ item.id +'">' + item.categoryName + '</a></li>';
        })
        //将数据放入ul中
        $('.dropdown-menu').html(html);
        $('.dropdown-menu').on('click', 'a', function () {
          $('.dropdown-text').html($(this).html());
          $('#categoryId').val($(this).attr('data-id'));
        })
      }
    })
  })
}
//上传图片
var initUpload = function () {
  // 下面的id是type=file类型的input的id
  $("#secondupload").fileupload({
    // 找到上传图片的接口
    url: "/category/addSecondCategoryPic",
    done: function (e, data) {
      // console.log(data);
      $('#previewimg').attr('src', data.result.picAddr);
      $('#brandLogo').val(data.result.picAddr);
    }
  })
}