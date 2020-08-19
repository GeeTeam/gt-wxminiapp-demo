const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lang: {
      navigator: "行为验证",
      title: "极验-行为验证",
      introduce: '基于生物的行为特征，结合人工智能技术帮助 29 万家网站和 APP 智能区分人机阻绝恶意程序带来的业务损失',
      tips: '点击下方按钮进行体验',
      copyright: '极验行为验证产品体验  Copyright @ 2020 GeeTest'
    },
    captchalist:[
      {
        id: 'ai',
        name: '智能组合验证',
        imgsrc: '/images/icon1.png'
      },
      {
        id: 'slide',
        name: '滑动拼图验证',
        imgsrc: '/images/icon2.png'
      },
      {
        id: 'click',
        name: '文字点选验证',
        imgsrc: '/images/icon3.png'
      },
      {
        id: 'space',
        name: '空间推理验证',
        imgsrc: '/images/icon4.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
          navH: App.globalData.navHeight
        })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  navigatorTo(e){
    let path = e.currentTarget.dataset.path;
    let id = e.currentTarget.dataset.id;
    if(path && id){
      wx.navigateTo({
        url: path+'?id='+id
      })
    }
  }
})