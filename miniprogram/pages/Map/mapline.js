Page({
 
    /**
     * 页面的初始数据
     */
    data: {
      // 导航路线
      markers: [{
        longitude: 114.072329,
        latitude: 22.725849,
      }, {
        id: 0,
        longitude: 114.277769,
        latitude: 22.730863,
      }],
   
   
      polyline: [{
        points: [{
          longitude: 114.072329,
          latitude: 22.725849
        }, {
          longitude: 114.277769,
          latitude: 22.730863
        }],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true
      }],
    }
  }
)