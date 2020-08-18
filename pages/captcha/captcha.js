// pages/ai/ai.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showModal: false,
        showfocus: true,
        currentCaptcha: 'ai',
        changeStatus:'',
        result: {},
        styleConfig: {
            color: '#376FFF',
            btnWidth: '100%'
        },
        loading: true,
        lang: {
            login: '登录',
            more: '前往极验官网 了解更多'
        },
        captchalist:{
            ai: {
                src: '/images/tips-ai.png',
                tips: '根据用户行为轨迹以及其他安全策略，判别用户的风险程度，给用户智能呈现对应的验证形式。' 
            },
            slide: {
                src: '/images/tips-slide.png',
                tips: '通过收集并分析滑动过程中产生的行为轨迹，进行人机区分。适用于对用户体验要求较高的应用与场景。'
            },
            click: {
                src: '/images/tips-click.png',
                tips: '通过收集并分析点击图片中指定文字的过程中产生的行为数据，进行人机区分。适用于对安全性有较高要求的应用与场景。'
            },
            space: {
                src: '/images/tips-space.png',
                tips: '收集用户行为轨迹信息和设备信息作为人机判别依据，用户根据问题提示点选相应的物体，由于图片空间形态的多样性和复杂性，可以显著的降低机器识别的概率。'
            }
        },
        api: {
            click: {
                register: 'https://www.geetest.com/demo/gt/register-click',
                validate: 'https://www.geetest.com/demo/gt/validate-click'
            },
            icon: {
                register: 'https://www.geetest.com/demo/gt/register-icon',
                validate: 'https://www.geetest.com/demo/gt/validate-icon'
            },
            space: {
                register: 'https://www.geetest.com/demo/gt/register-space',
                validate: 'https://www.geetest.com/demo/gt/validate-space'
            },
            nine: {
                register: 'https://www.geetest.com/demo/gt/register-click-s-e',
                validate: 'https://www.geetest.com/demo/gt/validate-click-s-e'
            },
            ai: {
                register: 'https://www.geetest.com/demo/gt/register-phrase',
                validate: 'https://www.geetest.com/demo/gt/validate-phrase'
            },
            slide: {
                register: 'https://www.geetest.com/demo/gt/register-slide',
                validate: 'https://www.geetest.com/demo/gt/validate-slide'
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);

        this.setData({
            currentCaptcha: options.id
        });
        this.captchaRegister()
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
    navigatoweb(){
        wx.navigateTo({
          url: '../web/web'
        })
    },
    switchCaptcha(e){
        var type = e.detail.currentCaptcha || 'slide';
        this.setData({
            currentCaptcha: type,
            loadCaptcha: false,
            loading: true
        });
        this.captchaRegister();
    },
    btnSubmit: function(){
        this.captchaValidate()
    },
    captchaRegister: function () {
        var that = this
        wx.request({
            url: that.data.api[that.data.currentCaptcha].register + '?t=' + new Date().getTime(),
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                that.setData({ loadCaptcha: true, gt: res.data.gt, challenge: res.data.challenge, offline: !res.data.success })
            },
            fail: function () {
                console.log('error')
            }
        })
    },
    captchaValidate: function () {
        var that = this
        var data = that.data.result
        if (!data || (data && !data.geetest_challenge)) {
            console.log('请先完成验证！')
            return
        }
        wx.request({
            url: that.data.api[that.data.currentCaptcha].validate + '?t=' + new Date().getTime(),
            method: 'POST',
            dataType: 'json',
            data: {
                geetest_challenge: data.geetest_challenge,
                geetest_validate: data.geetest_validate,
                geetest_seccode: data.geetest_seccode
            },
            success: function (res) {
                
            },
            fail: function () {
                console.log('error')
            }
        })
    },
    captchaSuccess:function(result){
        console.log('captcha-Success!')
        // 直接显示成功

        setTimeout(()=>{
            this.setData({
                result: result.detail,
                showfocus: false,
                showModal: true
            });
        },1800)

        setTimeout(()=>{
            this.setData({
                showModal: false
            });
        },4800)
    
    },
    captchaReady:function(){
        console.log('captcha-Ready!')
        this.setData({
            loading: false
        })
    },
    captchaClose:function(){
        console.log('captcha-Close!')
        this.setData({
            showfocus: false
        })
    },
    captchaError: function (e) {
        console.log('captcha-Error!', e.detail)
        // 这里对challenge9分钟过期的机制返回做一个监控，如果服务端返回code:21,tips:not proof，则重新调用api1重置
        if (e.detail.code === 21) {
            var that = this
            // 需要先将插件销毁
            that.setData({ loadCaptcha: false })
            // 重新调用api1
            that.captchaRegister()
        }
    },
    resetCaptcha:function(){
        this.setData({
            toReset: true
        })
    }
})