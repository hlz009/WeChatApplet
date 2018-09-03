const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:'http://localhost:8443',
    imgDomain:'http://localhost:8080/idiomsImgs/',
    grade_imgs: ['1.jpg', '1.jpg', '1.jpg', '1.jpg',
      '1.jpg','1.jpg', '1.jpg', '1.jpg', '1.jpg', 
      '1.jpg', '1.jpg']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getUserCredit();
    this.getUserIdiom();
  },
  /**
   * 得到用户猜词记录及等级
   */
  getUserIdiom: function () {
    var that = this;
    wx.request({
      url: that.data.domain + '/idioms',
      data : {
        third_session : app.globalData.loginSessionKey
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result.status = 200) {
          that.setData({
            idiom:{
              gradeImg: that.data.imgDomain +
              that.data.grade_imgs[result.content.idiomGrade],
              gradeName: app.globalData.grade_names[result.content.idiomGrade],
              grade: result.content.idiomGrade,
              sort: result.content.idiomSort
            }
          })
        }
      }
    })    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})