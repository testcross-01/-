const app = getApp();

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
   feedback:{ 
    openid:null,//用户唯一标识符
    isAndroid:true,//手机机型
    email:null,//电子邮箱
    index: null,//图片序列号
    imgPath :null,//图片
    feedbackText: '',//具体意见  
  },
  imgList: []
  },
  switchChange(e){
    this.setData({
      isAndroid: e.detail.value,  
      })
  },
  emailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },
  
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      confirmText: '确定',
      cancelText: '放弃',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

   submit(e) {//将表单各项数据赋值给feedback并向服务器发起请求（传递数据）
     var that=this;
   wx.showLoading({
     title: '反馈提交中！',
   })
    this.data.feedback.isAndroid = e.detail.value.isAndroid;
    this.data.feedback.email = e.detail.value.email;
    this.data.feedback.feedbackText = e.detail.value.feedbackText;
    this.data.feedback.openid =app.globalData.openid
    //console.log(this.data.feedback);
    
   //上传图片
    if(this.data.imgList.length>0){
    wx.uploadFile({
      url: 'https://www.testcross.cn/Map/AddImageServlet',
      filePath: this.data.imgList[0],
      name: 'image',
      success(res){
        that.data.feedback.imgPath=res.data;
        console.log(res.data);
        //上传反馈表单
        wx.request({
          url: 'https://www.testcross.cn/Map/AddFeedbackInfoServlet',
          data: that.data.feedback,
          success(res) {
            console.log(res.data)
            wx.hideLoading()
            if (res.data == '上传成功！') {
              wx.navigateBack({
              })
            }
            wx.showToast({
              title: res.data,
              icon: 'none'
            })
          }
        })
      }
    })
  }else{
  //上传反馈表单
     wx.request({
       url: 'https://www.testcross.cn/Map/AddFeedbackInfoServlet',
       data: this.data.feedback,
       success(res) {
         console.log(res.data)
         wx.hideLoading()
         if (res.data =='上传成功！'){
           wx.navigateBack({
           })
       }
         wx.showToast({
           title: res.data,
           icon: 'none'
         })
       }
     })
    }
  }
})