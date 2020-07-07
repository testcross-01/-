var app=getApp();

// pages/signs/signs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    navigate: true,
    add:false,
    id:'',
    name:'',
    src:'',
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.add==='true'){
      this.setData({
        add: true
      })
    }else{
      this.setData({
        add: false
      })

    }
    console.log(options)
    var id=options.id
    this.data.id=id
      this.setData({
        isShow: true,
        src: 'https://www.testcross.cn/Map/img/'+id+'.jpg',
        name: app.globalData.marks[id].title,
        text: app.globalData.marks[id].text
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  daohang: function () {
    var add=this.data.add
    var index ;
    var pages = getCurrentPages()
   
    var indexPage = pages[1]
    indexPage.daohang({id:this.data.id})
    wx.navigateBack({
      
    })
    indexPage.scale(15)
  },

  toMap(e){
  
    wx.redirectTo({
      url: '../map/map',
    })
  }

})