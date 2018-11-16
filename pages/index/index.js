import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    background: ['/images/banner.jpg', '/images/banner.jpg', '/images/banner.jpg'],
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
  },
  //事件处理函数
 mask:function(e){
   this.setData({
    is_show:false,
   })
 },
 close:function(e){
  this.setData({
    is_show:false,
   })
 },
  onLoad(options) {
    const self = this;

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

  