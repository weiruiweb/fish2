import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
  
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.data.id = options.id;
    self.getMainData()
  },


  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id,
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    const callback = (res)=>{
   	  if(res.info.data.length>0){
   		self.data.mainData = res.info.data[0];
   		self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
   	  };
   	  self.setData({
   	  	web_mainData:self.data.mainData
   	  })
   	};
    api.productGet(postData,callback);
  },
 
})

  