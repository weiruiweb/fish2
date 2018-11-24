import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    mainData:[],
  },
  //事件处理函数

  onLoad(options) {
    const self = this;
    self.getOrderData()
  },

  getOrderData(){
    const self = this;
    const postData = {
      tokenFuncName:'getProjectToken',
      searchItem:{
        type:3,
        pay_status:1
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }else{
        self.data.isLoadAll=true;
        api.showToast('没有更多了','none')
      };
      self.setData({
        
        web_mainData:self.data.mainData
      })
    }
    api.orderGet(postData,callback)
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 


})

  