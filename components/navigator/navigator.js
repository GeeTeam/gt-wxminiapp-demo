// components/navigator/navigator.js
const App = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        title: '行为验证体验',
        navH: ''
    },
    attached(){
        this.setData({
            navH: App.globalData.navHeight
          })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        back(){
            wx.navigateBack()
        }
    }
})
