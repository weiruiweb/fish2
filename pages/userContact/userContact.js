import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    isFirstLoadAllStandard:['getNoticeData'],
    isLoadAll:false,
    buttonCanClick:false,
  },
  //事件处理函数
 
  onLoad(options) {
    wx.showLoading();
    const self = this;
    wx.removeStorageSync('checkLoadAll');
    self.getNoticeData()

  },
  intoMap:function(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude: 34.325739,
          longitude: 109.038907,
          name: "西安市浐灞生态区浐灞半岛A15区",
          address:"西安市浐灞生态区浐灞半岛A15区",
          scale: 28
        })
      }
    })
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
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getNoticeData',self);
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

  