/*
 * @Author: ziming
 * @Date: 2021-02-02 16:39:25
 * @LastEditors: ziming
 * @LastEditTime: 2021-02-02 17:59:59
 */
/*eslint-disable no-console*/
Page({
    data: {
        changeStatus:'',
        result: {},
        styleConfig: {
          color: '#2488FF',
          btnWidth: '260px'
        }
    },
    onLoad: function() {
        this.captchaRegister()
    },
    onReady: function(){
    },

    btnSubmit: function(){
        this.captchaValidate()
    }, 
    captchaRegister: function () {
        var that = this
        my.request({
            url: 'https://www.geetest.com/demo/gt/register-slide?t=' + new Date().getTime(),
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
        my.request({
            url: 'https://www.geetest.com/demo/gt/validate-slide?t=' + new Date().getTime(),
            method: 'POST',
            dataType: 'json',
            data: {
                geetest_challenge: data.geetest_challenge,
                geetest_validate: data.geetest_validate,
                geetest_seccode: data.geetest_seccode
            },
            success: function (res) {
                my.showToast({
                    type: 'success',
                    content: res.data.status
                })
            },
            fail: function () {
                console.log('error')
            }
        })
    },
    captchaSuccess:function(result){
        console.log('captcha-Success!')
        this.setData({
            result: result
        })
    },
    captchaReady:function(){
        console.log('captcha-Ready!')
    },
    captchaClose:function(){
        console.log('captcha-Close!')
    },
    captchaError: function (e) {
        console.log('captcha-Error!',e)
        // 这里对challenge9分钟过期的机制返回做一个监控，如果服务端返回code:21,tips:not proof，则重新调用api1重置
        if(e.code === 21){
            var that = this
            // 需要先将插件销毁
            that.setData({ loadCaptcha: false })
            // 重新调用api1
            that.captchaRegister()
        }

    }
})
