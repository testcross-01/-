//获取应用实例
const app = getApp()

// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'YAHBZ-H2AWQ-OW75L-GHBNL-4A34K-C6F7H'
})

Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    height:'',
    fangxiangSrc:"./icons/fangxiang_shang.png",
    polyline: [],
    index: 0,
    isShow: false,
    hide:false,
    markers: [],
    nowLatitude:0,
    nowLongitude:0,
    scale: 18
  },
  //事件处理函数
  bindViewTap: function () {

  },
  /*
  加载
  */
  onLoad: function () {
    wx.showLoading({
      title: '标记点加载中'
    })
    /*
    读取本地缓存
    */
    // var that =this
    // wx.getStorage({
    //   key: 'markers',
    //   success: function(res) {
    //     console.log(res)
    //     that.setData({
    //       markers:res.data
    //     })
    //   },
    // })
    // 获取设备的信息 
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight+'   '+res.windowWidth)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          height:Math.round( res.windowHeight * 0.9) + 'px',
        })
        console.log(that.data.height)
      },
      fail: function (err) {
        console.log(err)
      }
    })
    //  获取定位信息
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {

        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          nowLongitude: longitude,
          nowLatitude: latitude
        })
      },
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },

      complete: function () {
        //隐藏定位中信息进度
        // wx.hideLoading()
      }

    })
    wx.getStorage({
      key: 'markers',
      success: function(res) {
       // console.log(res.data)
        console.log(res.data)
        if(res.data.length>0){
        that.setData({ markers: res.data})
        app.globalData.marks=res.data
        console.log("通过缓存获得数据")
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        return }
        
      },
    })
    
   
   
    if (app.globalData.marks.length > 0) {
      console.log("app请求先执行完");
      this.setData({ markers: app.globalData.marks })
      wx.setStorage({
        key: 'markers',
        data: app.globalData.marks,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }


    app.marksCallback = res => {
      console.log("pageonload 先执行完");
      this.setData({ markers: app.globalData.marks })
      wx.setStorage({
        key: 'markers',
        data: app.globalData.marks,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000);
    };
    // wx.showLoading({
    //   title: "定位中",
    //   mask: true
    // })
 

  },


  /*
  点的标记事件
  */
  // mark: function () {
  //   var that = this
  //   var point = [{
  //     iconPath: './icons/dingweidian.png',
  //     id: that.data.markers.length,
  //     latitude: that.data.latitude,
  //     longitude: that.data.longitude,
  //     width: 50,
  //     height: 50,
  //     name: "",
  //     address: "",
  //     title: ""
  //   }]

  //   /*
  //   标点的同时向远程服务器发送请求存储数据
  //   */
  //   wx.request({
  //     url: 'https://www.testcross.cn/Map/AddMarkServlet',
  //     data: {
  //       latitude: that.data.latitude,
  //       longitude: that.data.longitude,
  //       title: "hi",
  //       id: that.data.markers.length
  //     },

  //   })
  //   this.setData({
  //     markers: that.data.markers.concat(point)
  //   })
  //    wx.setStorage({
  //    key: 'markers',
  //    data: JSON.stringify(this.data.markers)
  //    })

  //   /*
  //   把mark点储存到本地缓存中
  //   */
  //    wx.setStorage({
  //    key: 'markers',
  //    data: this.data.markers,
  //    success: function(res) {

  //     }
  //    })

  // },


  /*
  查看地图按钮事件
  */
  chooseMapViewTap: function () {
    var that = this
    wx.openLocation({
      latitude:this.data.latitude,
      longitude: this.data.longitude,
      name:'目的地',
      scale: 18,
    })


    
    // wx.chooseLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     // success
    //     console.log(res)

    //     var choosePoint = [{
    //       iconPath: './icons/dingweidian.png',
    //       id: that.data.markers.length,
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //       width: 50,
    //       height: 50,
    //       callout: {
    //         content: res.name,
    //         bgColor: "#00b26a",
    //         borderRadius: 5,
    //         color: "#ffffff",
    //         fontSize: 16
    //       },
    //       name: res.name,
    //       address: res.address
    //     }]

        
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   },
    //   complete: function () {
    //     //接口调用结束的回调函数（调用成功，失败都会执行）
    //   }
    // })
  },


  /*
  挪动地图时发生
  */
  // regionchange(e) {
  //   // console.log(e.type)
  //   if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
  //     // console.log(e)
  //     var that = this
  //     this.mapctx = wx.createMapContext("mapid", that) //创建一个地图实例
  //     this.mapctx.getCenterLocation({
  //       type: 'gcj02',
  //       success: function (res) {
  //         // console.log(res)
  //         that.setData({
  //           longitude: res.longitude,
  //           latitude: res.latitude
  //         })
  //       }
  //     })
  //   }
  // },


  /*
  点击地图时发生
  */
  // maptap(e) {
  //   wx.hideToast({
  //     success:function(){

  //     }})

  //   var isShow = this.data.isShow
  //   this.setData({
  //     isShow: !isShow
  //   })
  // },

  helpView(e) {
    wx.navigateTo({
      url: '../help/help',
    })
  },

  /*
  点击mark点时发生
  */
  markertap(e) {
    this.maptap()
  },

  /*
  点击mark上的气泡时发生
  */
  callouttap(e){
    console.log(e.markerId)
    wx.navigateTo({
      url: '../signs/signs?id=' + e.markerId 
    })
  },

  /*
  模糊搜索功能，已经禁用
  现在时点击搜索跳转到相应的mark点的位置
  */
  search: function () {
    var index = this.data.index
    this.setData({
      latitude: this.data.markers[index].latitude,
      longitude: this.data.markers[index].longitude,
      scale:18
    })

    //   //调用距离计算接口
    //   qqmapsdk.direction({
    //     mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
    //     //from参数不填默认当前地址
    //     from: {
    //       latitude:this.data.markers[0].latitude,
    //       longitude: this.data.markers[0].longitude
    //     },
    //     to: {
    //       latitude: this.data.latitude,
    //       longitude: this.data.longitude
    //     },
    //     success: function (res) {
    //       console.log(res);
    //       var ret = res;
    //       var coors = ret.result.routes[0].polyline, pl = [];
    //       //坐标解压（返回的点串坐标，通过前向差分进行压缩）
    //       var kr = 1000000;
    //       for (var i = 2; i < coors.length; i++) {
    //         coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    //       }
    //       //将解压后的坐标放入点串数组pl中
    //       for (var i = 0; i < coors.length; i += 2) {
    //         pl.push({ latitude: coors[i], longitude: coors[i + 1] })
    //       }
    //       console.log(pl)
    //       //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
    //       that.setData({
    //         latitude: pl[pl.length-1].latitude,
    //         longitude: pl[pl.length - 1].longitude,
    //         polyline: [{
    //           points: pl,
    //           color: '#FF0000DD',
    //           width: 4
    //         }]
    //       })
    //     },
    //     fail: function (error) {
    //       console.error(error);
    //     },
    //     complete: function (res) {
    //       console.log(res);
    //     }

    // })
  },

  /*
  导航功能,现在这个方法是在sign这个页面里被调用的方法
  */
  daohang(item) {
    var index = item.id
    var that = this
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'walking', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: {
        latitude: this.data.nowLatitude,
        longitude: this.data.nowLongitude
      },
      to: {
        latitude: this.data.markers[index].latitude,
        longitude: this.data.markers[index].longitude
      },
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#6996fe',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }

    })
  },

  daohangImg(e){
    var item=e.currentTarget.dataset
    this.daohang(item)
    this.scale(15)
  },

/*
展开景点
*/
//  修改！！
  show(){
    var height=Math.round( this.data.windowHeight*0.9)
    if(this.data.height=== (height-200)+'px'){
      this.setData({
        height: (parseInt(this.data.height) + 200) + "px",
        hide: !this.data.hide,
        fangxiangSrc: "./icons/fangxiang_shang.png"
      })
      return
    }
      this.setData({
        height: (parseInt(this.data.height)- 200) + "px",
        hide: !this.data.hide,
        fangxiangSrc:"./icons/fangxiang_xia.png"
      })
  },

  clickToIntroduce(e){
    console.log(e.currentTarget.dataset)
    var item = e.currentTarget.dataset
    var that = this
    this.setData({
      latitude:app.globalData.marks[item.id].latitude,
      longitude: app.globalData.marks[item.id].longitude
    })
    this.scale(19)
    wx.navigateTo({
      url: '../signs/signs?id=' + item.id + '&add=false' ,
    })
  },

  /*
  地图缩放的方法
  为了导航之后可以看到整条路线
  */
  scale(rank) {
    this.setData({
      scale: rank
    })
  }
})