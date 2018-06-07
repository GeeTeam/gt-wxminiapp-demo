var plug = requirePlugin('myPlugin')
Page({
  data: {
  },
  onLoad: function() {
  },
  onReady: function(){
  },
  toSlide:function(){
    wx.navigateTo({
      url: '../slideDemo/slide',
    })
  },
  toClick: function () {
    wx.navigateTo({
      url: '../clickDemo/click',
    })
  },
  toBind: function () {
    wx.navigateTo({
      url: '../bindDemo/bind',
    })
  }
})