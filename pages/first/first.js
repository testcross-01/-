var app=getApp()
Page({
  data: {
    cardCur: 0,
    swiperList: [{
      id: 23,
      type: 'image',
      url: '../../img/23.jpg'
    }, {
      id: 29,
      type: 'image',
        url: '../../img/29.jpg',
    }, {
      id: 19,
      type: 'image',
        url: '../../img/19.jpg'
    }, {
      id: 2,
      type: 'image',
        url: '../../img/2.jpg'
    }],
  },
  onLoad() {
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    if(app.globalData.openid==='oX16p5T2RvvshCOyp5IYPTNGPp9Q')
    this.setData({
      admin:true
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  toAdmin(e){
      wx.navigateTo({
        url: '/pages/admin/admin',
      })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  //跳转至关于我们
  toAbout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  toOldnew(){
    wx.navigateTo({
      url: '../oldnew/oldnew',
    })

  },
  toMap(){
    wx.navigateTo({
      url: '../map/map',
    })
  },
  toFeedback(){
    wx.navigateTo({
      url: '../advice/advice',
    })
  },
  toSchool(){

    wx.navigateTo({
      url: '../view/view',
    })
  },
  toHelp() {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  swiperNavigate(e){
    wx.navigateTo({
      url: '../signs/signs?id=' + e.currentTarget.dataset.id + '&add=true' 
    })
  }
})