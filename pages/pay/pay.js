import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    couponData:[],
    choosedCouponData:[],
    submitData:{
      price:0
    },
    isFirstLoadAllStandard:['getMainData'],
    isLoadAll:false,
    buttonCanClick:false,
    couponCount:0,
    count:0

  },
  //事件处理函数
  onLoad(){
    const self = this;
    wx.showLoading();
    wx.removeStorageSync('checkLoadAll');
    self.getMainData();
    self.setData({
      web_choosedCouponData:self.data.choosedCouponData,
      web_wxPay:self.data.count?self.data.submitData.price - self.data.count:self.data.submitData.price
    })
  },


  getMainData(){
    const self = this;
    const postData = {
      tokenFuncName:'getProjectToken',
      searchItem:{
        type:['in',[3,4]], 
        pay_status:1
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
        web_submitData:self.data.submitData,
        web_wxPay:self.data.count?(self.data.submitData.price - self.data.count).toFixed(2):parseFloat(self.data.submitData.price).toFixed(2)
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
      web_wxPay:self.data.count?(self.data.submitData.price - self.data.count).toFixed(2):parseFloat(self.data.submitData.price).toFixed(2)
    });  
  },

  couponChoose(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var count = api.getDataSet(e,'count');
    var itemRes = api.findItemInArray(self.data.choosedCouponData,'id',id);
    console.log(999,itemRes);
    console.log(1000,self.data.choosedCouponData);
    if(itemRes){
      self.data.count -= count;
      self.data.choosedCouponData.splice(itemRes[0],1);
    }else{
      self.data.count += count;
      self.data.choosedCouponData.push({id:id,price:count});
    };
    self.setData({
      web_choosedCouponData:self.data.choosedCouponData,
      web_wxPay:self.data.count?(self.data.submitData.price - self.data.count).toFixed(2):parseFloat(self.data.submitData.price).toFixed(2)
    })
    console.log('self.data.count',self.data.count);
    console.log('self.data.choosedCouponData',self.data.choosedCouponData);
    
  },

  pay(){
    const self = this;
    api.buttonCanClick(self);
    const postData = {
      tokenFuncName:'getProjectToken',
    };
    postData.data = {
      price:self.data.count + parseFloat(self.data.submitData.price)
    };
    postData.pay = {};
    if(self.data.choosedCouponData.length>0&&self.data.submitData.price){
      postData.pay = {
        wxPay:self.data.submitData.price-self.data.count,
        wxPayStatus:0,
        coupon:self.data.choosedCouponData
      };
    }else if(self.data.submitData.price){
      postData.pay = {
        wxPay:self.data.submitData.price,
        wxPayStatus:0,
      };
    }else if(self.data.choosedCouponData.length>0){
      postData.pay = {
        coupon:self.data.choosedCouponData
      };
    };

    if(postData.pay&&postData.pay.wxPay&&postData.pay.wxPay<=0){
    	delete postData.pay.wxPay;
    	delete postData.pay.wxPayStatus;
    }else if(postData.pay.wxPay){
    	postData.pay.wxPay = parseFloat(postData.pay.wxPay).toFixed(2);
    };

    if(JSON.stringify(postData.pay)=='{}'){
      api.showToast('空白支付','error');
      api.buttonCanClick(self,true)
      return;
    };
    

    const callback = (res)=>{
      console.log(res)
      if(res.solely_code==100000){
         
        if(res.info){
            const payCallback=(payData)=>{
              if(payData==1){
                api.showToast('支付成功','none',function(){
                  api.pathTo('/pages/index/index','redi')  
                });
              }else{
                api.showToast('调起微信支付失败','none');
              };
              self.data.mainData = [];
              self.data.submitData.price = 0;
              self.getMainData();
            };
            api.realPay(res.info,payCallback);    
        }else{
          api.showToast('支付成功','none',function(){
            api.pathTo('/pages/index/index','redi')  
          });
        };
      }else{
        api.showToast('支付失败','none');
        self.data.mainData = [];
        self.data.submitData.price = 0;
        self.getMainData();
      }; 
      api.buttonCanClick(self,true) 
    }
    api.addVirtualOrder(postData,callback);
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

  