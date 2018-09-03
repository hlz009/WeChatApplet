//app.js
App({
  onLaunch: function () {
    var userId = wx.getStorageSync('userId')
    if (null != userId && 0!= userId) {
      this.globalData.userId = userId;
    }
    var user = wx.getStorageSync('user')
    if (null != user && "" != user){
      this.globalData.userInfo = user;
    }
  },
  globalData: {
    userInfo: null,
    userId:null,
    domain:'http://127.0.0.1:8080'
  }
})