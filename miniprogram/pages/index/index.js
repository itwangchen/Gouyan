Page({
  /**
   * 页面的初始数据
   */
  data: {
    ac: 'reying',
    //热映标识
    hotStatus: 0,
    //待映标识
    cStatus: 0,
    page: 1,
    limit: 12,
    addLength: 1
  },

  swith: function (e) {
    var _this = this;
    console.log(this);
    
    var classInd=e.target.dataset.classIndex;//获取当前点击项目
    //将当前的点击项目的自定义属性的值赋值给ac
    this.setData({
      ac: classInd
    });
    //用户点击待映的时候发送请求
    //根据自定义属性,判断点击的为将映
    //判断当前点击的元素
    if (e.target.dataset.classIndex == "jijiang") {
        //绑定 在自定义属性中,1 表示数据请求过,0 表示未请求
        if (e.target.dataset.status == 1) {
          return
        } else {
          //数据加载loading
          wx.showLoading({
            title: '加载中'
        });
        wx.request({
          //最受欢迎
          url: 'https://wx.maoyan.com/mmdb/movie/v1/list/wish/order/coming.json',
          data: {
            ci: 1,
            limit: 30,
            offset: 0
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            // console.log(res);
            //热映
            res.data.data.coming.forEach(element => {
              //处理数据,获取特定尺寸的图片w.h,重新赋值
              element.img = element.img.replace('w.h', '170.230');
            });
            var coming = res.data.data.coming;
            //待映列表
            wx.request({
              url: 'https://wx.maoyan.com/mmdb/movie/v2/list/rt/order/coming.json',
              method: 'GET',
              data: {
                ci: 1,
                limit: 10
              },
              success: function (res) {
                var title = '';
                res.data.data.coming.forEach(element => {
                  //处理item title 日期重复 进行判断 相同的保留第一个 后续的title 清空                  
                  if (title == element.comingTitle) {
                    //当重复的时候 将当前的标题赋值为空
                    element.comingTitle = '';
                  } else {
                    //当不重复的时候 将当前的标题赋值给title
                    title = element.comingTitle;
                  }
                  //处理数据,获取特定尺寸的图片w.h,重新赋值
                  element.img = element.img.replace('w.h', '170.230');
                });

                var comingListT = res.data.data.coming;
                //数据挂载,修改状态
                _this.setData({ comingListT: comingListT, comingList: coming, cStatus: 1 });
                //数据成功渲染停止loading效果
                wx.hideLoading();
              }
            })
          }
        })
      }
      //设置标识表示请求过数据了
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //数据加载loading
    wx.showLoading({
      title: '加载中'
    });
    // console.log('页面加载完毕...');

    var _this = this;
    // 要获得全局对象
    var app = getApp();
    // console.log(this)
    // 调用位置获取方法
    app.getLocation(function (locate) {
      //   // 用户所在城市
      _this.setData({ locate: locate });
      // 根据用户所在城市查询数据
      wx.request({
        url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
        method: 'get',
        data: {
          limit: 12,
          offset: 0,
          ct: locate
        },
        success: function (info) {
          console.log(info);
          
          info.data.data.hot.forEach(element => {
            //处理数据,获取特定尺寸的图片w.h,重新赋值
            element.img = element.img.replace('w.h', '128.180');
          });
          //设置数据到data中
          _this.setData({ hot: info.data.data.hot });
          //热映数据获取完后,改变状态
          _this.setData({ hotStatus: 1 });
          //数据成功渲染停止loading效果
          wx.hideLoading();
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作/刷新页面
   */
  onPullDownRefresh: function () {
    //数据加载loading
    wx.showLoading({
      title: '正在刷新'
    });
    var _this = this;
    var locate = this.data.locate;
    //重新获取数据,data中的数据进行重新赋值 
    wx.request({
      url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
      method: 'get',
      data: {
        limit: 12,
        offset: 0,
        ct: locate
      },
      success: function (info) {
        info.data.data.hot.forEach(element => {
          //处理数据,获取特定尺寸的图片w.h,重新赋值
          element.img = element.img.replace('w.h', '128.180');
        });
        //设置数据到data中
        _this.setData({ hot: info.data.data.hot });
        //热映数据获取完后,改变状态
        _this.setData({ hotStatus: 1 });
        //数据成功渲染停止loading效果
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
   },

  /**
   * 页面上拉触底事件/加载更多的处理函数
   */
  onReachBottom: function () {
    if (this.data.addLength == 0) return;
    //loading
    wx.showLoading({
      title: '正在加载'
    });
    var page = this.data.page;
    var limit = this.data.limit;
    var _this = this;
    //获取数据
    var locate = this.data.locate;
    //重新获取数据,data中的数据进行重新赋值 
    wx.request({
      url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
      method: 'get',
      data: {
        limit: limit,
        offset: page * limit,
        ct: locate
      },
      success: function (info) {
        console.log(info.data.data.hot);

        info.data.data.hot.forEach(element => {
          //处理数据,获取特定尺寸的图片w.h,重新赋值
          element.img = element.img.replace('w.h', '128.180');
        });
        info.data.data.hot.forEach(function (e) {
          //将新数据中的项目 添加到数据中
          _this.data.hot.push(e);
        })

        //重新设置数据来进行数据驱动视图
        //设置长度 判断是否显示加载框
        _this.setData({
          hot: _this.data.hot,
          addLength: info.data.data.hot.length
        })
        // console.log(_this.data.hot);
        //将页数+1
        _this.data.page = _this.data.page + 1;

        wx.hideLoading({
          title: '刷新成功'
        });

        wx.stopPullDownRefresh();
      }
    });


  },

  /**
   * 用户点击右上角分享,点击转发
   */
  onShareAppMessage: function () {
      console.log('点击分享');
      
  }
  ,
  stop: function () {
    wx.showToast({//loading
      title: '搜索电影!',
      icon: 'success',
      duration: 2000
    });
    wx.showActionSheet({
      itemList: ['拍照', '自拍', '本地上传','分享'],
      success(res) {
        console.log(['拍照', '自拍', '本地上传','分享'][res.tapIndex])
      },
      fail(res) {
        console.log('关闭')
      }
    });
  }

})