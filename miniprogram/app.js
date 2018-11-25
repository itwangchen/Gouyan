App({
  globalData: {
    test: 1
  },
  onLaunch: function () {
    // console.log('小程序启动了...');
  },
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  //在app中定义一个方法,调用获取位置方法,传入一个回调函数,参数是获取的位置信息
  getLocation: function (cb) {
    // 获取用户的位置
    // 小程序提供了专门的 API 来获取用户位置
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude.toFixed(5),
        longitude = res.longitude.toFixed(5);

        // 将用户经纬度发送给后台接口
        // 来获得用户的所在城市

        // 在小程序中提供了专门 发送请求 的 API
        // wx.request 有点类似 jQuery 中的 $.ajax
        wx.request({
          url: 'https://wx.maoyan.com/hostproxy/locate/v2/rgeo',
          method: 'get',
          data: { coord: [latitude, longitude, 1].join(',') },
          header: {
            'x-host': 'http://apimobile.vip.sankuai.com'
          },
          success: function (info) {
            // console.log(info);
            // console.log(info.data.data.city);
            cb(info.data.data.city);
          }
        });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  onError: function (msg) {

  }
})

