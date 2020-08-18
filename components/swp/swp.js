// components/swiper/swiper.js
const App = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      currentCaptcha: String
    },
    observers:{
      'currentCaptcha': function(cur){

        var windowWidth = this.data.windowWidth;
        var selector = this.createSelectorQuery();
        
        selector.select("."+cur).boundingClientRect((rect)=>{
          
          var left = rect.left;
          var halfwidth = rect.width/2;
          var center =  windowWidth/2;

          var distance = left - center + halfwidth;

          let scrollLeft = this.data.scrollLeft;

          scrollLeft = scrollLeft + distance;
          
          if(scrollLeft<0){
             scrollLeft =0;
          }
          this.setData({
           scrollLeft: scrollLeft
         })
      
       }).exec();
      }
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
          showLBlur: true,
          showRBlur: true,
          scrollLeft: 0
    },

    /**
     * 组件的方法列表
     */
    created(){
     
      this.setData({
        windowWidth: App.globalData.windowWidth
      })
    },
    methods: {
      scroll(e){

      },
      scrollLeft(e){
      },
      scrollRight(e){
      },
      switchCaptcha(e){
        var type = e.currentTarget.dataset.id;
      
        // 此处事件触发父组件元素更新，同时父组件传递给子组件的currentCaptcha也会刷新，这里不需要手动再更新
        this.triggerEvent("Onchange",{
          currentCaptcha: type
        });

      }
    }
})
