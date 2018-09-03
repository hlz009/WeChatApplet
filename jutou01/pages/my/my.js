const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    fold:'展开',
    foldArray:[],
    pageIndex:1,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      //查找我的记录
      that.findMyList(app.globalData.userId);
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          wx.setStorageSync('user', res.userInfo);
          that.x_login(res.userInfo);
        },
        fail:function () {
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权,将无法使用我的剧透,点击确定重新获取授权。',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                      wx.getUserInfo({
                        success: function (res) {
                          var user = res.userInfo;
                          app.globalData.userInfo = user
                          wx.setStorageSync('user', user);   
                          that.x_login(user)
                        }
                      })
                    }
                  }, fail: function (res) {

                  }
                }) 
              }else {
                wx.navigateTo({
                  url: '../index/index'
                })
              }
            }
          })
        },
         complete: function (res) {
        }
      })
    }
  },
  x_login:function(user){
    var that = this;
    this.setData({
      userInfo: user,
      hasUserInfo: true
    })
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.domain + '/users/userAndOpenid/' + res.code,
          method: 'get',
          dataType: 'json',
          success: function (res) {
            var userId = res.data.userId;
            if (userId == null || 0 == userId) {
              //不存在用户
              that.x_setAndgetUser(user, res.data.wxopenid);
            } else {
              //查找我的记录
              that.findMyList(userId);
              app.globalData.userId = userId;
              wx.setStorageSync('userId', userId);
              that.setData({
                userInfo: user,
                hasUserInfo: true
              })
            }
          },
          fail: function (e) {
            console.log("获取用户openid失败");
          }
        })
      }
    })
  },
  x_setAndgetUser: function (user, openid) {
    wx.request({
      url: app.globalData.domain + '/users',
      method: 'post',
      data: {
        'wxopenid': openid,
        'nickname': user.nickName,
        'avatarUrl': user.avatarUrl
      },
      success: function (e) {
        //存入userId
        var userId = e.data.userId;
        //  查找我的记录
        that.findMyList(userId);
        app.globalData.userId = userId;
        wx.setStorageSync('userId', userId);
        console.log("登录成功");
      },
      fail: function (e) {
        console.log("登录失败" + e);
      }
    })
  },
  findMyList:function(userId){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/works/'+userId,
      method:'GET',
      data:{
        pageIndex:that.data.pageIndex
      },
      dataType:'json',
      success:function(res){
        var result = res.data;
        if (result.next) {
          that.data.pageIndex = that.data.pageIndex+1;
        }
        //累加数据
        var len = result.list.length;
        var _thisList = result.list;
        var datas = [];
        for (let i = 0; i<len; i++) {
          datas.push(_thisList[i]);
        }
        var foldArray = []
        for (let i = 0; i < len; i++) {
          foldArray.push(0);
        }
        Array.prototype.push.apply(that.data.list, datas);
        Array.prototype.push.apply(that.data.foldArray, foldArray);
        that.setData({
          list: that.data.list,
          next: result.next,
          foldArray:that.data.foldArray
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.next){
      this.findMyList(app.globalData.userId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  fold:function(e){
    var i = e.target.id
    var fold = this.data.fold;
    var foldArray = this.data.foldArray;
    if (fold == '展开'){
      fold='收起';
      foldArray[i] = 1
    } else {
      fold = '展开';
      foldArray[i] = 0
    }
    this.setData({
      fold: fold,
      foldArray: foldArray,
    })
  }
})