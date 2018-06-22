## 极验小程序插件接入指南

---
1. 首先在小程序管理后台的"设置-第三方服务-插件管理"中添加插件，通过AppID或者搜索验证码查找插件，等待极验通过申请。

2. 在项目app.json文件中声明所需要使用的插件  
```
 "plugins": {
    "myPlugin": {
      "version": "1.0.0",
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
5. onLoad时期在页面初始化插件，this.setData中为必传参数
 ```
  onLoad: function() {
        wx.request({
          url: "API1接口（详见服务端部署）"+new Date().getTime(), //加时间戳防止缓存
          type: "get",
          dataType: "json",
          success: function (data) {
            that.setData({ loadCaptcha:true,gt: res.data.gt, challenge: res.data.challenge, offline: !res.data.success })
          }
      })
  }
 ```

6. 使用极验提供的onSuccess获取验证结果，准备二次验证，这里只是将结果保存在result中，可以自行决定是否在此直接调用二次验证
```
captchaSuccess:function(result){
  console.log("captcha-Success!");
    this.setData({
        result: result.detail
    })
  },
```

7. 提交二次验证，二次验证时机用户可自行决定，前提是已经拿到了一次验证结果
```
btnSubmit: function(){
    var that = this;
    var data = that.data.result;
    if(typeof data !== 'object' && !data.geetest_challenge){
      console.log("请先完成验证！")
      return 
    }
    wx.request({
      url: "API2接口（详见服务端部署）",
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
  * onError 监听验证出错事件
  * onClose 插件关闭时
  * toReset 用户主动调用，对二次验证的情况去重置验证码
  
9. Tips&Bug
  * toReset 由于小程序的限制，实际无法直接去调用插件内部组件的方法，这里是hack的方式，通过改变组件的公有属性(properties)，触发observer调用内部方法
  * captcha插件的父容器大小会影响插件的显示，请参照demo设置一个合适的大小
  * 安卓下滑动模式进行滑动时可能会有卡顿
