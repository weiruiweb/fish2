import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    couponData:[],
    submitData:{
      price:''
    },
    isFirstLoadAllStandard:['getMainData','getCouponData'],
    isLoadAll:false,
    buttonCanClick:false,

  },
  //事件处理函数
  onLoad(){
    const self = this;
    wx.showLoading();
    self.getMainData();
    self.getCouponData()
  },
  getMainData(){
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
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData
      })
    }
    api.orderGet(postData,callback)
  },

  getCouponData(){
    const self = this;
    const postData = {
      tokenFuncName:'getProjectToken',
      searchItem:{
        type:4, 
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.couponData.push.apply(self.data.couponData,res.info.data)
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCouponData',self);
      self.setData({
        web_couponData:self.data.couponData
      })
    }
    api.orderGet(postData,callback)
  },
  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },
  pay(){
    const self = this;
    api.buttonCanClick(self);
    const postData = {
      tokenFuncName:'getProjectToken',
    };
    postData.coupon = {
      coupon_no:self.data.couponNo,
      price:self.data.couponPrice.toFixed(2)
    };
    const callback = (res)=>{
      console.log(res)
      if(res.solely_code==100000){
        api.showToast('支付成功','none')    
        if(self.data.mainData.paidMoney!=0){
            const payCallback=(payData)=>{
            if(payData==1){
              api.showToast('支付成功','none')     
            }else{
              api.showToast('调起微信支付失败','none')
            };
            api.realPay(res.info,payCallback);    
          }
        };
      }else{
        api.showToast('支付失败','none')
      } 
      api.buttonCanClick(self,true) 
    }
    api.directPay(postData,callback);
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

  