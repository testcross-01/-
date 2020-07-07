
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this
    // 登录
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.globalData.openid=res.data
      },
    })
    if (that.globalData.openid==null)
    wx.login({

      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
        wx.request({
          url: 'https://www.testcross.cn/Map/loginServlet',
          //请求中携带本程序的appid和secret
          data: {
            js_code: res.code
          },
          success(res) {

            //输出服务器响应的数据
            console.log(res.data);

            //将openid和sessionkey存入globalData以供之后使用
            that.globalData.session_key = res.data.session_key;
            that.globalData.openid = res.data.openid;

            wx.setStorage({
              key: 'openid',
              data: that.globalData.openid,
            })
          }
        })
      }
    })

    //请求mark数据
    wx.cloud.init({
      env: 'map-915'
    })
    var db= wx.cloud.database();
    var marksCollecton=db.collection("markers")
    wx.request({
      url: 'http://localhost:8080/Map/QueryMarksServlet',
      success(res) {
        console.log("请求marks数据成功");
        console.log(res.data);
        that.globalData.marks = res.data;
       
        
       
        
      }
    })
  },
  globalData: {
    userInfo: null,
    marks: [],
    session_key:null,
    openid:null
  }

})
