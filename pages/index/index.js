Page({
    data: {
    },
    onLoad: function() {
    },
    onReady: function(){
    },
    toSlide:function(){
        my.navigateTo({
            url: '../slideDemo/slide',
        })
    },
    toClick: function () {
        my.navigateTo({
            url: '../clickDemo/click',
        })
    },
    toBind: function () {
        my.navigateTo({
            url: '../bindDemo/bindDemo',
        })
    }
})
