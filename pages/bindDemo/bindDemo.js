/*eslint-disable no-console*/

Page({
    data: {
        changeStatus: '',
        result: {},
        validateType: 'icon',
        api: {
            slide: {
                register: 'https://www.geetest.com/demo/gt/register-slide',
                validate: 'https://www.geetest.com/demo/gt/validate-slide'
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
            phrase: {
                register: 'https://www.geetest.com/demo/gt/register-phrase',
                validate: 'https://www.geetest.com/demo/gt/validate-phrase'
            }
        }
    },
    onLoad: function () {
        this.captchaRegister()
    },
    onReady: function () {

    },
    btnSubmit: function () {
        // 进行业务逻辑处理
        console.log("用户密码效验完毕，打开验证码");
       
        // 唤起验证码
        this.verify();
    },
    verify:function(){
        this.setData({
            verify: Date.now()
        })
    },
    captchaRegister: function () {
        var that = this
        my.request({
            url: that.data.api[that.data.validateType].register + '?t=' + new Date().getTime(),
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                // 获取到了challenge，开始初始化插件
                // 这里对初始化的量做一个统计
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
            url: that.data.api[that.data.validateType].validate + '?t=' + new Date().getTime(),
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
    captchaSuccess: function (result) {
        console.log('captcha-Success!')
        this.setData({
            result: result
        })
        this.captchaValidate()
    },
    captchaReady: function () {
        // 验证码加载成功
        // 这里对成功量做一个统计
        console.log('captcha-Ready!')
    },
    captchaClose: function () {
        console.log('captcha-Close!')
    },
    captchaError: function (e) {
        console.log('captcha-Error!', e)
        // 这里对challenge9分钟过期的机制返回做一个监控，如果服务端返回code:21,tips:not proof，则重新调用api1重置
        if (e.code === 21) {
            var that = this
            // 需要先将插件销毁
            that.setData({ loadCaptcha: false })
            // 重新调用api1
            that.captchaRegister()
        }
    },
    btnReset: function () {
        this.setData({
            toReset: Date.now()
        })
    }
})
