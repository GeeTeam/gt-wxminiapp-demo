使用

1.根据提示订购插件 https://opendocs.alipay.com/mini/plugin/plugin-order
2.插件使用声明
```javascript
  "plugins": {
    "geetest": {
      "version": "*", // 插件版本号
      "provider": "2021002124682563"
    }
   }
```
3.组件
```javascript
{
  "usingComponents": {
    "captcha": "plugin://geetest/captcha"
  }
}
```

4.具体可参考本demo

5.配置参数，定制化可参考极验微信小程序文档 https://docs.geetest.com/sensebot/deploy/client/miniprogram