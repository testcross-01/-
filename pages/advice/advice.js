
const app = getApp();

/**
 * 增加图片上传的数量
 * 更改文件上传和提交表单的方式
 */
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
   feedback:{ 
    openid:null,//用户唯一标识符
    isAndroid:true,//手机机型
    email:null,//电子邮箱
    index: null,//图片序列号
    imgPaths :[],//图片
    feedbackText: '',//具体意见  
  },
  imgList: [],
  imgNum:6
  },
  onLoad(){
   
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
      count: this.data.imgNum, 
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
        
          console.log(res.tempFilePaths)
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          console.log(res.tempFilePaths)
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
    wx.showLoading({
      title: '提交中',
    })
    var that=this;
    this.data.feedback.isAndroid = e.detail.value.isAndroid;
    this.data.feedback.email = e.detail.value.email;
    this.data.feedback.feedbackText = e.detail.value.feedbackText;
    this.data.feedback.openid =app.globalData.openid
   
    this.updateIMG().then(res=>{  
      //上传反馈表   
      wx.cloud.callFunction({
        name:"addFeedback",
        data:{
          feedback:this.data.feedback
        },
        //云函数调用成功
        success(res){
          wx.hideLoading()
          if(res.result==-1){
            wx.showToast({
              icon:'none',
              title: '建议中涉及敏感词',
              duration:2000
            })
          }else{
            wx.showModal({
              title:"提交成功",
              content:'是否返回主页',
              success(res){
                if(res.confirm){
                  wx.redirectTo({
                    url: '/pages/first/first',
                  })
                }
              }
            })
          }
        },
        fail(res){
          wx.showToast({
            icon:'none',
            title: '提交失败',
            duration:2000
          })
        }
      })}
     ).catch(res=>{
      wx.hideLoading()
       wx.showToast({
        icon:'none',
        title: '提交失败',
        duration:2000
      })

     }
       
     )
   
  },
  updateIMG(){
    var that=this
     //上传图片
     var pArr=[]
     for(var i=0;i<that.data.imgList.length;i++){
      var promise=new Promise((resolve,reject)=>{
         wx.cloud.uploadFile({
         cloudPath: 'feedbackIMG/'+that.data.imgList[i].replace(/(.*\/)*([^.]+)/i,"$2"), // 上传至云端的路径
         filePath: that.data.imgList[i], // 小程序临时文件路径
         success: res => {
           // 返回文件 ID
           resolve(res)
         },
         fail:res=>{
           reject(res)
         }
       })
     })
     pArr.push(promise);
   }
  return Promise.all(pArr).then(
     res=>{
       res.forEach(
         item=>{
          that.data.feedback.imgPaths.push(item.fileID)
         }
       )
   }
   )
  }
})