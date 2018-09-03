const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    list:[]
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.findworks()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onLoad:function(){
    this.findworks()
  },
  search:function(){
    console.log("111")
  },
  findworks:function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/works/worksClassification',
      method:'GET',
      data:{
        pageIndex: that.data.pageIndex
      },
      dataType:'json',
      success:function(res){
        console.log(res)
        var result = res.data;
        if (result.next) {
          that.data.pageIndex = that.data.pageIndex + 1;
        }
        //累加数据
        var len = result.list.length;
        var _thisList = result.list;
        var datas = [];
        for (let i = 0; i < len; i++) {
          datas.push(_thisList[i]);
        }
        // var foldArray = []
        // for (let i = 0; i < len; i++) {
        //   foldArray.push(0);
        // }
        Array.prototype.push.apply(that.data.list, datas);
        // Array.prototype.push.apply(that.data.foldArray, foldArray);
        that.setData({
          list: that.data.list,
          next: result.next,
        })
      },
      fail:function(){

      }
    })
  },
  getInfo:function(e){
    // let str = JSON.stringify(this.data.list[e.currentTarget.id]);
    wx.navigateTo({
      url: '../info/info?id' + e.currentTarget.id 
    })
  }
})