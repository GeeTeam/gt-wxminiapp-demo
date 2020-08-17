// components/swiper/swiper.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      currentCaptcha: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        captchalist:[
          {
            id: 'ai',
            path: '../ai/ai',
            name: '智能组合验证',
            imgsrc: '/images/icon1.png'
          },
          {
            id: 'slide',
            path: '../slide/slide',
            name: '滑动拼图验证',
            imgsrc: '/images/icon2.png'
          },
          {
            id: 'click',
            path: '../click/click',
            name: '文字点选验证',
            imgsrc: '/images/icon3.png'
          },
          {
            id: 'space',
            path: '../space/space',
            name: '空间推理验证',
            imgsrc: '/images/icon4.png'
          }
          ],
          showLBlur: false,
          showRBlur: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
      scroll(e){
        console.log(e.detail.scrollLeft);
      },
      scrollLeft(e){
        console.log("left");
      },
      scrollRight(e){
        console.log("right");
      },
      switchCaptcha(e){
        var type = e.currentTarget.dataset.id;
        this.setData({
          currentCaptcha: type
        });

        this.triggerEvent("Onchange",{
          currentCaptcha: type
        })
      }
    }
})
