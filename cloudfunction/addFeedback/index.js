// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const coll=cloud.database().collection('feedbacks')
  var result=0;
  //敏感词检查
  if(event.feedback.feedbackText!=""){
   try{
    const result=await 
   cloud.openapi.security.msgSecCheck({
    content:event.feedback.feedbackText
    })
  }catch{
    return -1
  }
}
 await coll.add({
    data:event.feedback
  }).then(
    res=>{
      result=1
    }
  ).catch(
    res=>{
      result=0;
    }
  )
 return result;
}