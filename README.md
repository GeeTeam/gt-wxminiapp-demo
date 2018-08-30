## 极验小程序插件接入指南

---
1. 首先在小程序管理后台的"设置-第三方服务-插件管理"中添加插件，通过AppID或者搜索验证码查找插件，等待极验通过申请。

2. 在项目app.json文件中声明所需要使用的插件  
```
 "plugins": {
    "myPlugin": {
      "version": "1.0.9",
      "provider": "wxefa63d84fe9f64a2"
    }
  }
```

3. 在页面配置文件中(.json)使用我们的captcha插件
```
{
  "usingComponents": {
    "captcha": "plugin://myPlugin/captcha"
  }
}
```

4. 页面wxml中插入captcha
```
<captcha id="captcha" wx:if="{{loadCaptcha}}" gt="{{gt}}" challenge="{{challenge}}" offline="{{offline}}"
 />
 ``` 
5. onLoad时期在页面初始化插件，this.setData中的参数为必传参数
 ```
  onLoad: function() {
    this.captchaRegister()
  }
  captchaRegister: function () {
    var that = this
    wx.request({
    url: 'API1接口（详见服务端部署）',
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
 ```

6. 在onSuccess获取验证结果，准备二次验证（这里只是将结果保存在result中，二次验证时机自行决定)
```
captchaSuccess:function(result){
  console.log("captcha-Success!");
    this.setData({
        result: result.detail
    })
  },
```

7. 提交二次验证，上传一次验证结果
```
btnSubmit: function(){
   this.captchaValidate()
  },
captchaValidate: function () {
   var that = this
   var data = that.data.result
   if (!data || (data && !data.geetest_challenge)) {
       console.log('请先完成验证！')
       return
      }
   wx.request({
      url:'API2接口（详见服务端部署）',
      method: 'POST',
      dataType: 'json',
      data: {
        geetest_challenge: data.geetest_challenge,
        geetest_validate: data.geetest_validate,
        geetest_seccode: data.geetest_seccode
      },
      success: function (res) {
        wx.showToast({
          title: res.data.status
        })
      },
      fail: function () {
        console.log('error')
      }
    })
   },  
  
```

8. 提供的api接口  
  * onReady 监听验证按钮的 DOM 生成完毕事件，用户可点击
  * onSuccess 监听验证成功事件，参数为验证结果（用于二次验证）
```
      captchaSuccess:function(result){
        console.log('captcha-Success!')
        this.setData({
            result: result.detail
        })
    },
```
  * onError 监听验证出错事件
```
      captchaError: function (e) {
        console.log('captcha-Error!',e.detail)
        // 这里对challenge9分钟过期的机制返回做一个监控，如果服务端返回code:21,tips:not proof，则重新调用api1重置
        if(e.detail.code === 21){
          var that = this
          // 需要先将插件销毁
          that.setData({ loadCaptcha: false });
          // 重新调用api1
          that.captchaRegister()
        }
    }
```
  * onClose 插件关闭时
  * toReset 用户主动调用，对二次验证的情况去重置验证码
```
       // 调用toReset接口需要在模版中多加一个属性
       <captcha id="captcha" wx:if="{{loadCaptcha}}" gt="{{gt}}" challenge="{{challenge}}" offline="{{offline}}" bindonSuccess="captchaSuccess" bindonReady="captchaReady" bindonClose="captchaClose" bindonError="captchaError" toReset = "{{toReset}}" 
       // 方法调用
           btnReset:function(){
             this.setData({
               toReset: true
             })
         }
```
  
9. Tips&Bug
  * toReset 由于小程序的限制，实际无法直接去调用插件内部组件的方法，这里是hack的方式，通过改变组件的公有属性(properties)，触发observer调用内部方法
  * captcha插件的父容器大小会影响插件的显示，请参照demo设置一个合适的大小
  * 为了防止challenge9分钟过期无法reset，需要在error中对code：21，tips：not proof做一个监控，以便重置插件
  * 安卓下滑动模式进行滑动时可能会有卡顿


10. 提供自定义样式
  * 在调用的组件上传入styleConfig 
  * styleConfig 中可选参数 color 只能传入完整6位的HEX，按钮上的背景色为传入的色值透明度的60%；
  * styleConfig 中可选参数 btnWidth 传入合法的css长度，需要带单位。

  ``` 
  // wxml
  <captcha styleConfig="{{styleConfig}}"/>

  // js
  data:{
    styleConfig: {
      color: '#00aa90',  // 必须是完整的6位
      btnWidth: '180px'
    }
  }
  ```