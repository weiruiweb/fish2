import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    swiperIndex:0,
    is_show:true,
    potData:[],
    foodData:[],
    merChantData:[],
    isFirstLoadAllStandard:['getMerchantData','getPotData','getFoodData','getCouponData','getNoticeData','checkToday',
    'getCouponDataTwo'],
    isLoadAll:false,
    buttonCanClick:false
  },
  //事件处理函数
  onLoad(options) {
    wx.showLoading();
    const self = this;
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.removeStorageSync('checkLoadAll');
    self.data.paginate = getApp().globalData.paginate;
    self.getCouponDataTwo();
    self.getSliderData()
  },

  intoMap:function(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({        //所以这里会显示你当前的位置
          longitude: 109.038907,
          latitude: 34.319956,
          //109.045249,34.325841
          name: "浐灞半岛A15区1号楼顺水鱼馆",
          address:"浐灞半岛A15区1号楼顺水鱼馆",
          scale: 28
        })
      }
    })
  },
  
  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      title:'首页轮播图',
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    const callback = (res)=>{ 
      if(res.info.data.length>0){
        self.data.sliderData = res.info.data[0];
      }
      self.setData({
        web_sliderData:self.data.sliderData,
      });

      self.getNoticeData();
      self.getCouponData();
      self.getMerchantData();
    };
    api.labelGet(postData,callback);
  },

  getPotData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      aboutData:{
        tableName:'label',
        searchItem:{
          title:['=',['特色锅底']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.potData.push.apply(self.data.potData,res.info.data)
      }else{
        api.showToast('没有更多了','none')
      };
      self.setData({
        web_potData:self.data.potData,
      });
      self.getFoodData();
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getPotData',self);
    };
    api.articleGet(postData,callback);
  },

  getFoodData(){
    const self = this;
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      aboutData:{
        tableName:'label',
        searchItem:{
          title:['=',['精品推荐']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.foodData.push.apply(self.data.foodData,res.info.data)
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none')
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getFoodData',self);
      self.setData({
        web_foodData:self.data.foodData,
      });

    };
    api.articleGet(postData,callback);
  },

  getCouponData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
      title:'抵扣券'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.couponData = res.info.data[0]
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCouponData',self);
      self.setData({
        web_couponData:self.data.couponData,
      });

    };
    api.productGet(postData,callback);
  },

  getCouponDataTwo(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
      id:2
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.couponDataTwo = res.info.data[0]
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCouponDataTwo',self);
      self.setData({
        web_couponDataTwo:self.data.couponDataTwo,
      });
      self.checkToday()
      console.log(899,res.info.data[0])
    };
    api.productGet(postData,callback);
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
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getNoticeData',self);
      self.setData({
        web_noticeData:self.data.noticeData,
      });
      self.getPotData()
    };
    api.articleGet(postData,callback);
  },
  getMerchantData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      aboutData:{
        tableName:'label',
        searchItem:{
          title:['=',['商户介绍']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.merChantData = res.info.data[0];
        self.data.merChantData.passage1 = self.data.merChantData.description.split(',');
        self.data.merChantData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMerchantData',self);
      self.setData({
        web_merChantData:self.data.merChantData,
      });
      console.log(999,self.data.merChantData);
      console.log(1000,self.data.merChantData.passage1);
    };
    api.articleGet(postData,callback);
  },

  checkToday(){
    const self = this;
    const postData = {};
    postData.tokenFuncName='getProjectToken',
    postData.searchItem = {
      product_id:self.data.couponDataTwo.id
    };
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.todayCouponData = res.info.data;
        }else{
          self.data.todayCouponData = [];
        };
      };
      
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'checkToday',self);
      self.setData({
        web_todayCouponData:self.data.todayCouponData
      });
      api.buttonCanClick(self,true)
    }
    api.orderItemGet(postData,callback)
  },


  addCouponOrder(e){
    const self = this;
    api.buttonCanClick(self);
    console.log('addCouponOrder',self.data.todayCouponData)
    if(self.data.todayCouponData.length>0){
      api.showToast('每个用户每天限领取一张','none');
      api.buttonCanClick(self,true)
      return;
    };
    var id = api.getDataSet(e,'id');

    const postData = {
      tokenFuncName:'getProjectToken',
      product:[
        {id:id,count:1}
      ],
      data:{
        limit:1
      },
      pay:{
        other:0
      },
      type:3,
      data:{
        deadline:new Date().getTime()+parseFloat(self.data.couponDataTwo.passage1),
        discount:self.data.couponDataTwo.discount
      }
    };
    const callback = (res)=>{
      if(res&&res.solely_code==100000){
        api.showToast('领取成功！','none',function(){
          self.checkToday()
        });   
      }else{
        api.showToast('领取失败！','none',function(){
          self.setData({
            web_todayCouponData:[]
          })
        });
      };
    };
    api.addOrder(postData,callback);
  },

  addOrder(){
    const self = this;
    api.buttonCanClick(self);
    console.log(1);

    if(!self.data.order_id){
      const postData = {
        tokenFuncName:'getProjectToken',
        product:[
          {id:self.data.couponData.id,count:1}
        ],
        pay:{wxPay:self.data.couponData.price,wxPayStatus:0},
        type:3,
        data:{
          balance:self.data.couponData.discount,
          deadline:new Date().getTime()+parseFloat(self.data.couponData.passage1)
        }
      };

      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          const payCallback=(payData)=>{
            if(payData==1){
               api.showToast('支付成功','none');
               setTimeout(function(){
                api.pathTo('pages/userDiscount/userDiscount','nav');
               },300);
            }else{
              api.showToast('支付失败','none');
            }   
          };
          api.realPay(res.info,payCallback);  

        }; 
        api.buttonCanClick(self,true);
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id)
    }    
  },

  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      searchItem:{
        id:order_id,
      }
    };
    postData.tokenFuncName='getProjectToken';
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        const payCallback=(payData)=>{
            if(payData==1){
               api.showToast('支付成功','none');
            };   
          };
          api.realPay(res.info,payCallback);      
      }else{
        api.showToast('支付失败','none')
      }    
    };
    api.pay(postData,callback);
  },

  phoneCall() {
    const self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.noticeData.contactPhone,
    })
  },

  getMoreData() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getFoodData();
    };
  },
  onShareAppMessage(res){
    const self = this;
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '顺水鱼馆',
        path: 'pages/index/index',
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
          }else{
            wx.showToast({
              title: '分享失败',
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },



  mask:function(e){
    this.setData({
      is_show:false,
    })
  },

 
  close:function(e){
    this.setData({
      web_todayCouponData:[1]
    })
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

  