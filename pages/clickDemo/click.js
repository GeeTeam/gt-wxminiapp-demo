/*eslint-disable no-console*/
Page({
    data: {
        changeStatus:'',
        result: {},
        validateType: 'sh256',
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
          phrase: {
            register: 'https://www.geetest.com/demo/gt/register-phrase',
            validate: 'https://www.geetest.com/demo/gt/validate-phrase'
          },
          sh256:{
            register: 'http://demo.gtapp.xyz/gt/register/98a460967a492ad8f4b2f8ec16b50e56435620c3bfb7cad720818a556366d115/4db307c47efaa480541ba8425cf21450?t=1608864405927',
            validate: 'http://demo.gtapp.xyz/gt/validate/98a460967a492ad8f4b2f8ec16b50e56435620c3bfb7cad720818a556366d115/4db307c47efaa480541ba8425cf21450'
          }
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
          url: that.data.api[that.data.validateType].register+'?t=' + new Date().getTime(),
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
    captchaValidate: function(){
        var that = this
        var data = that.data.result
        if (!data || (data && !data.geetest_challenge))  {
            console.log('请先完成验证！')
            return
        }
        my.request({
          url: that.data.api[that.data.validateType].validate+'?t=' + new Date().getTime(),
            method: 'POST',
            dataType: 'json',
            data: {
                geetest_challenge: data.geetest_challenge,
                geetest_validate: data.geetest_validate,
                geetest_seccode: data.geetest_seccode
            },
            success: function (res) {
              console.log(res);
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
        console.log(result);
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
    btnReset:function(){
        this.setData({
            toReset: Date.now()
        })
    }
})
