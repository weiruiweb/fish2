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
    wx.showLoading();
    self.getNoticeData()

  },

  getNoticeData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      aboutData:{
        tableName:'label',
        searchItem:{
          title:['=',['联系我们']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.noticeData = res.info.data[0];
        self.data.noticeData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      wx.hideLoading();
      self.setData({
        web_noticeData:self.data.noticeData,

      });
    };
    api.articleGet(postData,callback);
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

  