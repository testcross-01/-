wx.cloud.init({
  env: 'map-915'
})
var db= wx.cloud.database();

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

   var that = this
    
   //获得用户信息
    this.getUserInfo();
   
    //获得marker点信息
    this.getMarkers();
    
    // wx.request({
    //   url: 'http://localhost:8080/Map/QueryMarksServlet',
    //   success:function(res){
    //     var coll=wx.cloud.database().collection('markers')
    //     console.log(res.data)
    //     var markers=[]
    //     res.data.forEach(function(item){
    //       var  mark={
    //           id:item.id,
    //           title:item.title,
    //           latitude:item.latitude,
    //           longitude:item.longitude,
    //           type:'jiaoyu',
    //           text:item.text
    //         }
    //         markers.push(mark)
    //         coll.add({data:mark})
    //     })
    //     console.log(markers)
    //   }
    // })
   
  },
  //修改点
  getMarkers:function(){
    var that=this;
   //同步获取本地markers
   that.globalData.markers= wx.getStorageSync('markers')

   //如果本地不存在就发起请求
   if(that.globalData.markers==null|that.globalData.markers=='')
   wx.cloud.callFunction({
     name:'getMarkers',
     success:function(res){
      console.log('???')
        that.globalData.markers=res.result.data
       if(that.markersCallback){
         console.log('???')
         that.markersCallback()
       }
       wx.setStorage({
         data: that.globalData.markers,
         key: 'markers',
       })
     },
     fail:function(res){
          that.globalData.loading=false
          if(that.markersCallback)
          that.markersCallback()    
     }
   })
  },
  //修改点
  getUserInfo:function(){
    var that=this;
    //同步获取本地openid
    that.globalData.openid= wx.getStorageSync('openid')
   //如果本地没有发起请求
    if(that.globalData.openid==null|that.globalData.openid==''){
      wx.cloud.callFunction({
        // 云函数名称
        name: 'getUserInfo',
        // 传给云函数的参数
        success: function(res) {
          that.globalData.openid=res.result.openid;
          wx.setStorage({
            data: that.globalData.openid,
            key: 'openid',
          })
        },
        fail: console.error
      })
    }

  },
  globalData: {
    markers:null,
    openid:null,
    loading:true
  }

})
