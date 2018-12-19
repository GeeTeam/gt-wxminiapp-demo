## 极验小程序插件接入指南

---
#### 搜索申请：
1. 首先在小程序管理后台的"设置-第三方服务-插件管理"中添加插件，通过AppID查找所需的插件，等待极验通过申请。

2. 在项目app.json文件中声明所需要使用的插件 （最低可使用版本为1.0.9，为使体验最佳，请及时更新到最高版本）
```
{
 "plugins": {
    "myPlugin": {
      "version": "1.1.1", 
      "provider": "wxxxxxxxxxxxxxxxxx"
    }
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
<captcha id="captcha" wx:if="{{loadCaptcha}}" gt="{{gt}}" challenge="{{challenge}}offline="{{offline}}" product="{{product}}" changeStatus="{{changeStatus}}"
 />
```

5. onLoad时期在页面初始化插件，this.setData中为必传参数
 ```
 onLoad: function() {
        wx.request({
          url: "API1接口（详见服务端部署）",
          type: "get",
          dataType: "json",
          success: function (data) {
         that.setData({ loadCaptcha:true,gt: res.data.gt, challenge: res.data.challenge, offline: !res.data.success})
          }
      })
  }
  ```

6. 使用极验提供的onSuccess获取验证结果，准备二次验证
```
captchaSuccess:function(result){
  console.log("captcha-Success!");
    this.setData({
        result: result.detail
    })
  },
```

7. 二次验证
```
btnSubmit: function(){
    var that = this;
    var data = that.data.result;
    if(typeof data !== 'object'){
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
  }
```

####  提供的api接口  
  * onReady 监听验证按钮的 DOM 生成完毕事件，用户可点击
  * onSuccess 监听验证成功事件，参数为验证结果（用于二次验证）
  * onError 监听验证出错事件
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

####  提供自定义样式
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
### 多语言国际化支持
 使用方式为在组件传参，不传默认为中文
 ```
   // wxml
  <captcha lang="zh-cn"/>	
 ```
 * zh-cn默认  中文
 * zh-tw   繁体中文
 * en 英文
 * ja 日文
 * id 印尼
  
#### Tips&Bug
  * toReset 由于小程序的限制，实际无法直接去调用插件内部组件的方法，这里是hack的方式，通过改变组件的公有属性(properties)，触发observer调用内部方法
  * captcha插件的父容器大小会影响插件的显示，请参照demo设置一个合适的大小
  * 为了防止challenge9分钟过期无法reset，需要在error中对code：21，tips：not proof做一个监控，以便重置插件
  * 安卓下滑动模式进行滑动时可能会有卡顿

#### 帮助

| 问题 | 参考解答| 
| :------ | :----- |
| 小程序插件支持web的无按钮bind模式吗？| 不支持，由于微信小程序插件对于安全方面的限制，致使外部无法调用插件内方法。|
| 大图模式支持哪几种验证形式？如何使用？ | click、icon、phrase、space、nine。极验后台申请相应id即可|
| 插件放置时间过长或者出错了怎么办？ |  在onError做监听，reset验证插件 |
| 服务端接口如何部署与使用？ | 参考pc端的部署方式，详细见官网文档https://docs.geetest.com/install/deploy/server/csharp|



